"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExperienceFormSchema, type ExperienceFormData } from "@/schemas";
import {
  createExperienceAction,
  updateExperienceAction,
  deleteExperienceAction,
  setExperienceStatusAction,
  getExperiencesAdminAction,
} from "@/actions/experience-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Compass,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  X,
  Loader2,
  Sparkles,
  Building2,
  MapPin,
  Calendar,
} from "lucide-react";

interface ExperienceItem {
  id: string;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  organization: string;
  location: string;
  order: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  translations: {
    locale: string;
    role: string;
    description: string;
    highlightsJson: any;
  }[];
}

export function ExperienceManager({ initialExperiences }: { initialExperiences: ExperienceItem[] }) {
  const [experiences, setExperiences] = React.useState<ExperienceItem[]>(initialExperiences);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingExp, setEditingExp] = React.useState<ExperienceItem | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = React.useState<string | null>(null);

  // Dynamic highlights for EN and ID
  const [enHighlights, setEnHighlights] = React.useState<string[]>([]);
  const [idHighlights, setIdHighlights] = React.useState<string[]>([]);
  const [enHighlightInput, setEnHighlightInput] = React.useState("");
  const [idHighlightInput, setIdHighlightInput] = React.useState("");

  const form = useForm<ExperienceFormData>({
    resolver: zodResolver(ExperienceFormSchema) as any,
    defaultValues: {
      startDate: "",
      endDate: "",
      isCurrent: false,
      organization: "",
      location: "",
      order: 0,
      status: "PUBLISHED",
      en: { role: "", description: "", highlights: [] },
      id: { role: "", description: "", highlights: [] },
    },
  });

  const openCreateDialog = () => {
    setEditingExp(null);
    setServerError(null);
    setEnHighlights([]);
    setIdHighlights([]);
    setEnHighlightInput("");
    setIdHighlightInput("");
    form.reset({
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      isCurrent: true,
      organization: "",
      location: "",
      order: experiences.length + 1,
      status: "PUBLISHED",
      en: { role: "", description: "", highlights: [] },
      id: { role: "", description: "", highlights: [] },
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (exp: ExperienceItem) => {
    setEditingExp(exp);
    setServerError(null);

    const en = exp.translations.find((t) => t.locale === "en") || {
      role: "",
      description: "",
      highlightsJson: [],
    };
    const id = exp.translations.find((t) => t.locale === "id") || {
      role: "",
      description: "",
      highlightsJson: [],
    };

    const initialEnHighlights = Array.isArray(en.highlightsJson) ? en.highlightsJson : [];
    const initialIdHighlights = Array.isArray(id.highlightsJson) ? id.highlightsJson : [];

    setEnHighlights(initialEnHighlights);
    setIdHighlights(initialIdHighlights);

    form.reset({
      startDate: new Date(exp.startDate).toISOString().split("T")[0],
      endDate: exp.endDate ? new Date(exp.endDate).toISOString().split("T")[0] : "",
      isCurrent: exp.isCurrent,
      organization: exp.organization,
      location: exp.location,
      order: exp.order,
      status: exp.status,
      en: { role: en.role, description: en.description, highlights: initialEnHighlights },
      id: { role: id.role, description: id.description, highlights: initialIdHighlights },
    });

    setIsDialogOpen(true);
  };

  const addEnHighlight = () => {
    if (enHighlightInput.trim()) {
      const updated = [...enHighlights, enHighlightInput.trim()];
      setEnHighlights(updated);
      form.setValue("en.highlights", updated);
      setEnHighlightInput("");
    }
  };

  const removeEnHighlight = (idx: number) => {
    const updated = enHighlights.filter((_, i) => i !== idx);
    setEnHighlights(updated);
    form.setValue("en.highlights", updated);
  };

  const addIdHighlight = () => {
    if (idHighlightInput.trim()) {
      const updated = [...idHighlights, idHighlightInput.trim()];
      setIdHighlights(updated);
      form.setValue("id.highlights", updated);
      setIdHighlightInput("");
    }
  };

  const removeIdHighlight = (idx: number) => {
    const updated = idHighlights.filter((_, i) => i !== idx);
    setIdHighlights(updated);
    form.setValue("id.highlights", updated);
  };

  const onSubmit = async (data: ExperienceFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    data.en.highlights = enHighlights;
    data.id.highlights = idHighlights;

    try {
      if (editingExp) {
        await updateExperienceAction(editingExp.id, data);
        setSuccessMessage(`Expedition at "${data.organization}" updated.`);
      } else {
        await createExperienceAction(data);
        setSuccessMessage(`Expedition at "${data.organization}" forged.`);
      }

      const refreshed = await getExperiencesAdminAction();
      setExperiences(refreshed as any);
      setIsDialogOpen(false);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setServerError(err.message || "Failed to commit record.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED") => {
    setActionLoadingId(id);
    try {
      await setExperienceStatusAction(id, newStatus);
      const refreshed = await getExperiencesAdminAction();
      setExperiences(refreshed as any);
    } catch (err: any) {
      alert(`Error updating status: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string, org: string) => {
    if (!confirm(`Delete expedition record at "${org}"?`)) return;
    setActionLoadingId(id);
    try {
      await deleteExperienceAction(id);
      const refreshed = await getExperiencesAdminAction();
      setExperiences(refreshed as any);
      setSuccessMessage(`Expedition at "${org}" removed.`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      alert(`Error deleting record: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {successMessage && (
        <Alert variant="default" className="border-[var(--realm-moss)] bg-[var(--realm-moss)]/10 text-[var(--realm-moss-bright)]">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription className="font-mono text-xs">{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Header controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-[var(--realm-amber)]" />
          <span className="text-sm font-semibold">Expedition Records</span>
          <Badge variant="outline" className="font-mono">
            {experiences.length} Positions
          </Badge>
        </div>

        <Button
          onClick={openCreateDialog}
          variant="primary"
          size="sm"
          className="gap-1.5 font-mono text-xs shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>Add Expedition</span>
        </Button>
      </div>

      {/* List Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--realm-border)] bg-[var(--realm-bg-surface)] font-mono tracking-wider text-[var(--realm-text-muted)] uppercase">
              <tr>
                <th className="p-4">Organization & Location</th>
                <th className="p-4">Bilingual Role</th>
                <th className="p-4">Duration & Current</th>
                <th className="p-4">Status</th>
                <th className="p-4">Order</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--realm-border)]/50">
              {experiences.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[var(--realm-text-muted)] font-mono">
                    No career or education milestones recorded. Click &quot;Add Expedition&quot; to begin.
                  </td>
                </tr>
              ) : (
                experiences.map((exp) => {
                  const en = exp.translations.find((t) => t.locale === "en");
                  const id = exp.translations.find((t) => t.locale === "id");
                  const isLoading = actionLoadingId === exp.id;
                  const startStr = new Date(exp.startDate).toLocaleDateString(undefined, {
                    month: "short",
                    year: "numeric",
                  });
                  const endStr = exp.isCurrent
                    ? "Present"
                    : exp.endDate
                    ? new Date(exp.endDate).toLocaleDateString(undefined, {
                        month: "short",
                        year: "numeric",
                      })
                    : "";

                  return (
                    <tr
                      key={exp.id}
                      className="transition-colors hover:bg-[var(--realm-bg-surface)]/50"
                    >
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 font-semibold text-[var(--realm-text-primary)]">
                            <Building2 className="h-3.5 w-3.5 text-[var(--realm-amber)]" />
                            <span>{exp.organization}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-[var(--realm-text-muted)]">
                            <MapPin className="h-3 w-3" />
                            <span>{exp.location}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="space-y-0.5">
                          <div className="text-xs font-medium text-[var(--realm-text-primary)]">
                            {en?.role || id?.role || "Untitled Role"}
                          </div>
                          {id?.role && id.role !== en?.role && (
                            <div className="text-[11px] text-[var(--realm-text-muted)] italic">
                              {id.role}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="p-4 font-mono text-[11px]">
                        <div className="flex items-center gap-1.5 text-[var(--realm-text-secondary)]">
                          <Calendar className="h-3 w-3 text-[var(--realm-amber)]" />
                          <span>
                            {startStr} — {endStr}
                          </span>
                        </div>
                        {exp.isCurrent && (
                          <Badge variant="moss" className="text-[9px] px-1 py-0 mt-1">
                            Current
                          </Badge>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant={
                              exp.status === "PUBLISHED"
                                ? "moss"
                                : exp.status === "DRAFT"
                                ? "clay"
                                : "outline"
                            }
                            className="font-mono text-[10px]"
                          >
                            {exp.status}
                          </Badge>
                          {exp.status === "DRAFT" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isLoading}
                              onClick={() => handleStatusChange(exp.id, "PUBLISHED")}
                              className="h-6 px-1.5 text-[10px] font-mono text-[var(--realm-moss-bright)]"
                            >
                              Publish
                            </Button>
                          )}
                          {exp.status === "PUBLISHED" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isLoading}
                              onClick={() => handleStatusChange(exp.id, "DRAFT")}
                              className="h-6 px-1.5 text-[10px] font-mono text-[var(--realm-text-muted)]"
                            >
                              Draft
                            </Button>
                          )}
                        </div>
                      </td>

                      <td className="p-4 font-mono text-[11px] text-[var(--realm-text-muted)]">
                        #{exp.order}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(exp)}
                            className="h-8 w-8 text-[var(--realm-amber)] hover:bg-[var(--realm-amber)]/10"
                            title="Edit Expedition"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isLoading}
                            onClick={() => handleDelete(exp.id, exp.organization)}
                            className="h-8 w-8 text-[var(--realm-clay)] hover:bg-[var(--realm-clay)]/10"
                            title="Delete Expedition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Expedition Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-mono text-base">
              <Compass className="h-4 w-4 text-[var(--realm-amber)]" />
              <span>{editingExp ? `Edit: ${editingExp.organization}` : "Record New Expedition"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Chronicle career achievements, education history, and organizational leadership.
            </DialogDescription>
          </DialogHeader>

          {serverError && (
            <Alert variant="destructive">
              <AlertDescription className="text-xs">{serverError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label required>Organization / University</Label>
                <Input
                  {...form.register("organization")}
                  placeholder="e.g. Astral Labs"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label required>Location</Label>
                <Input
                  {...form.register("location")}
                  placeholder="e.g. Remote / San Francisco, CA"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div className="space-y-1.5">
                <Label required>Start Date</Label>
                <Input type="date" {...form.register("startDate")} className="font-mono text-xs" />
              </div>

              <div className="space-y-1.5">
                <Label>End Date</Label>
                <Input
                  type="date"
                  disabled={form.watch("isCurrent")}
                  {...form.register("endDate")}
                  className="font-mono text-xs"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 sm:pt-0">
                <Switch
                  checked={form.watch("isCurrent")}
                  onCheckedChange={(val) => {
                    form.setValue("isCurrent", val);
                    if (val) form.setValue("endDate", "");
                  }}
                  id="current-switch"
                />
                <label
                  htmlFor="current-switch"
                  className="text-xs font-mono font-medium text-[var(--realm-text-secondary)] cursor-pointer"
                >
                  Current Position
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Order</Label>
                <Input type="number" {...form.register("order")} className="font-mono text-xs" />
              </div>

              <div className="space-y-1.5">
                <Label>Publication Status</Label>
                <Select {...form.register("status")} className="font-mono text-xs">
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                  <option value="ARCHIVED">Archived</option>
                </Select>
              </div>
            </div>

            {/* Bilingual Content */}
            <div className="space-y-2 border-t border-[var(--realm-border)] pt-4">
              <Label required>Bilingual Role & Achievements</Label>
              <Tabs defaultValue="en" className="w-full">
                <TabsList>
                  <TabsTrigger value="en">English (EN)</TabsTrigger>
                  <TabsTrigger value="id">Indonesian (ID)</TabsTrigger>
                </TabsList>

                {/* English */}
                <TabsContent value="en" className="space-y-4">
                  <div className="space-y-1.5">
                    <Label required>Role / Degree Title (EN)</Label>
                    <Input
                      {...form.register("en.role")}
                      placeholder="e.g. Lead Full-Stack Architect"
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label required>Overview Description (EN)</Label>
                    <Textarea
                      {...form.register("en.description")}
                      rows={3}
                      placeholder="High-level mission scope and core responsibilities..."
                      className="text-xs"
                    />
                  </div>

                  {/* Highlights EN */}
                  <div className="space-y-2">
                    <Label>Key Highlights & Milestones (EN)</Label>
                    <div className="flex gap-2">
                      <Input
                        value={enHighlightInput}
                        onChange={(e) => setEnHighlightInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addEnHighlight();
                          }
                        }}
                        placeholder="Add achievement bullet and press enter..."
                        className="text-xs"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={addEnHighlight}
                        className="font-mono text-xs"
                      >
                        Add
                      </Button>
                    </div>

                    <div className="space-y-1 pt-1">
                      {enHighlights.map((hl, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded bg-[var(--realm-bg-surface)] text-xs text-[var(--realm-text-primary)]"
                        >
                          <span>• {hl}</span>
                          <button
                            type="button"
                            onClick={() => removeEnHighlight(idx)}
                            className="text-[var(--realm-clay)] hover:text-white"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Indonesian */}
                <TabsContent value="id" className="space-y-4">
                  <div className="space-y-1.5">
                    <Label required>Peran / Gelar (ID)</Label>
                    <Input
                      {...form.register("id.role")}
                      placeholder="Contoh: Arsitek Full-Stack Utama"
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label required>Deskripsi Ikhtisar (ID)</Label>
                    <Textarea
                      {...form.register("id.description")}
                      rows={3}
                      placeholder="Cakupan misi utama dan tanggung jawab tim..."
                      className="text-xs"
                    />
                  </div>

                  {/* Highlights ID */}
                  <div className="space-y-2">
                    <Label>Pencapaian Kunci (ID)</Label>
                    <div className="flex gap-2">
                      <Input
                        value={idHighlightInput}
                        onChange={(e) => setIdHighlightInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addIdHighlight();
                          }
                        }}
                        placeholder="Tambahkan poin pencapaian dan tekan enter..."
                        className="text-xs"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={addIdHighlight}
                        className="font-mono text-xs"
                      >
                        Tambah
                      </Button>
                    </div>

                    <div className="space-y-1 pt-1">
                      {idHighlights.map((hl, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded bg-[var(--realm-bg-surface)] text-xs text-[var(--realm-text-primary)]"
                        >
                          <span>• {hl}</span>
                          <button
                            type="button"
                            onClick={() => removeIdHighlight(idx)}
                            className="text-[var(--realm-clay)] hover:text-white"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-[var(--realm-border)] pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsDialogOpen(false)}
                className="font-mono text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="gap-2 font-mono text-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{editingExp ? "Update Record" : "Forge Record"}</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
