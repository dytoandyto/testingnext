"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProjectFormSchema,
  ProjectFormData,
  createProjectAction,
  updateProjectAction,
  deleteProjectAction,
  setProjectStatusAction,
  getProjectsAdminAction,
} from "@/actions/project-actions";
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
  FolderGit2,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  CheckCircle2,
  X,
  ExternalLink,
  Loader2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface ProjectItem {
  id: string;
  slug: string;
  featured: boolean;
  order: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  repoUrl: string | null;
  liveUrl: string | null;
  updatedAt: Date;
  translations: {
    locale: string;
    title: string;
    summary: string;
    caseStudy: string;
    metricsJson: any;
  }[];
  tags: { id: string; name: string }[];
  media: { id: string; mediaAsset: { id: string; secureUrl: string; altText: string | null } }[];
}

export function ProjectManager({ initialProjects }: { initialProjects: ProjectItem[] }) {
  const [projects, setProjects] = React.useState<ProjectItem[]>(initialProjects);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<ProjectItem | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = React.useState<string | null>(null);

  // Tag chip input state
  const [tagInput, setTagInput] = React.useState("");

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(ProjectFormSchema) as any,
    defaultValues: {
      slug: "",
      featured: false,
      order: 0,
      status: "DRAFT",
      repoUrl: "",
      liveUrl: "",
      tags: [],
      mediaIds: [],
      en: {
        title: "",
        summary: "",
        caseStudy: "",
        metrics: [],
      },
      id: {
        title: "",
        summary: "",
        caseStudy: "",
        metrics: [],
      },
    },
  });

  const { fields: enMetrics, append: appendEnMetric, remove: removeEnMetric } = useFieldArray({
    control: form.control,
    name: "en.metrics",
  });

  const { fields: idMetrics, append: appendIdMetric, remove: removeIdMetric } = useFieldArray({
    control: form.control,
    name: "id.metrics",
  });

  const currentTags = form.watch("tags") || [];

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.trim();
      if (val && !currentTags.includes(val)) {
        form.setValue("tags", [...currentTags, val]);
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    form.setValue(
      "tags",
      currentTags.filter((t) => t !== tagToRemove)
    );
  };

  const openCreateDialog = () => {
    setEditingProject(null);
    setServerError(null);
    form.reset({
      slug: "",
      featured: false,
      order: projects.length + 1,
      status: "DRAFT",
      repoUrl: "",
      liveUrl: "",
      tags: [],
      mediaIds: [],
      en: { title: "", summary: "", caseStudy: "", metrics: [] },
      id: { title: "", summary: "", caseStudy: "", metrics: [] },
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (proj: ProjectItem) => {
    setEditingProject(proj);
    setServerError(null);

    const en = proj.translations.find((t) => t.locale === "en") || {
      title: "",
      summary: "",
      caseStudy: "",
      metricsJson: [],
    };
    const id = proj.translations.find((t) => t.locale === "id") || {
      title: "",
      summary: "",
      caseStudy: "",
      metricsJson: [],
    };

    form.reset({
      slug: proj.slug,
      featured: proj.featured,
      order: proj.order,
      status: proj.status,
      repoUrl: proj.repoUrl || "",
      liveUrl: proj.liveUrl || "",
      tags: proj.tags.map((t) => t.name),
      mediaIds: proj.media.map((m) => m.mediaAsset.id),
      en: {
        title: en.title,
        summary: en.summary,
        caseStudy: en.caseStudy,
        metrics: Array.isArray(en.metricsJson) ? en.metricsJson : [],
      },
      id: {
        title: id.title,
        summary: id.summary,
        caseStudy: id.caseStudy,
        metrics: Array.isArray(id.metricsJson) ? id.metricsJson : [],
      },
    });

    setIsDialogOpen(true);
  };

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      if (editingProject) {
        await updateProjectAction(editingProject.id, data);
        setSuccessMessage(`Project "${data.slug}" updated successfully.`);
      } else {
        await createProjectAction(data);
        setSuccessMessage(`Project "${data.slug}" forged successfully.`);
      }

      // Refresh list
      const refreshed = await getProjectsAdminAction();
      setProjects(refreshed as any);
      setIsDialogOpen(false);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setServerError(err.message || "Failed to save project. Please check required fields.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (
    id: string,
    newStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  ) => {
    setActionLoadingId(id);
    try {
      await setProjectStatusAction(id, newStatus);
      const refreshed = await getProjectsAdminAction();
      setProjects(refreshed as any);
    } catch (err: any) {
      alert(`Error updating status: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string, slug: string) => {
    if (!confirm(`Are you sure you want to delete "${slug}"? This action is permanent and creates an audit trail.`)) {
      return;
    }
    setActionLoadingId(id);
    try {
      await deleteProjectAction(id);
      const refreshed = await getProjectsAdminAction();
      setProjects(refreshed as any);
      setSuccessMessage(`Project "${slug}" deleted.`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      alert(`Error deleting project: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.translations.some((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {successMessage && (
        <Alert variant="default" className="border-[var(--realm-moss)] bg-[var(--realm-moss)]/10 text-[var(--realm-moss-bright)]">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription className="font-mono text-xs">{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Control Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--realm-text-muted)]" />
            <Input
              placeholder="Search projects by title or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 font-sans text-xs"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-36 font-mono text-xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </Select>
        </div>

        <Button
          onClick={openCreateDialog}
          variant="primary"
          size="sm"
          className="gap-1.5 font-mono text-xs shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>Forge New Project</span>
        </Button>
      </div>

      {/* Projects Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--realm-border)] bg-[var(--realm-bg-surface)] font-mono tracking-wider text-[var(--realm-text-muted)] uppercase">
              <tr>
                <th className="p-4">Project</th>
                <th className="p-4">Slug & Links</th>
                <th className="p-4">Status & Workflow</th>
                <th className="p-4">Locales & Tags</th>
                <th className="p-4">Order</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--realm-border)]/50">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[var(--realm-text-muted)] font-mono">
                    No projects found matching the criteria. Click &quot;Forge New Project&quot; to create one.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((proj) => {
                  const en = proj.translations.find((t) => t.locale === "en");
                  const id = proj.translations.find((t) => t.locale === "id");
                  const isLoading = actionLoadingId === proj.id;

                  return (
                    <tr
                      key={proj.id}
                      className="transition-colors hover:bg-[var(--realm-bg-surface)]/50"
                    >
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[var(--realm-text-primary)]">
                              {en?.title || id?.title || "Untitled Project"}
                            </span>
                            {proj.featured && (
                              <Badge variant="amber" className="text-[9px] px-1.5 py-0">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <p className="line-clamp-1 text-[11px] text-[var(--realm-text-muted)]">
                            {en?.summary || id?.summary || "No summary provided."}
                          </p>
                        </div>
                      </td>

                      <td className="p-4 font-mono text-[11px]">
                        <div className="space-y-1">
                          <span className="text-[var(--realm-amber)]">/{proj.slug}</span>
                          <div className="flex items-center gap-2 text-[var(--realm-text-muted)]">
                            {proj.repoUrl && (
                              <a
                                href={proj.repoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-[var(--realm-text-primary)] flex items-center gap-0.5"
                              >
                                <span>Repo</span>
                                <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            )}
                            {proj.liveUrl && (
                              <a
                                href={proj.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-[var(--realm-text-primary)] flex items-center gap-0.5"
                              >
                                <span>Demo</span>
                                <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              proj.status === "PUBLISHED"
                                ? "moss"
                                : proj.status === "DRAFT"
                                ? "clay"
                                : "outline"
                            }
                            className="font-mono text-[10px]"
                          >
                            {proj.status}
                          </Badge>

                          {/* Quick Workflow Switcher */}
                          {proj.status === "DRAFT" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isLoading}
                              onClick={() => handleStatusChange(proj.id, "PUBLISHED")}
                              className="h-6 px-2 text-[10px] font-mono text-[var(--realm-moss-bright)] hover:bg-[var(--realm-moss)]/20"
                            >
                              Publish
                            </Button>
                          )}
                          {proj.status === "PUBLISHED" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isLoading}
                              onClick={() => handleStatusChange(proj.id, "DRAFT")}
                              className="h-6 px-2 text-[10px] font-mono text-[var(--realm-text-muted)] hover:bg-[var(--realm-bg-card)]"
                            >
                              Unpublish
                            </Button>
                          )}
                          {proj.status !== "ARCHIVED" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isLoading}
                              onClick={() => handleStatusChange(proj.id, "ARCHIVED")}
                              className="h-6 px-2 text-[10px] font-mono text-[var(--realm-text-muted)] hover:text-[#e07a5f]"
                            >
                              Archive
                            </Button>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex gap-1 font-mono">
                            {en && (
                              <span className="rounded border border-[var(--realm-border)] bg-[var(--realm-bg-elevated)] px-1 py-0.2 text-[9px] text-[var(--realm-amber)]">
                                EN
                              </span>
                            )}
                            {id && (
                              <span className="rounded border border-[var(--realm-border)] bg-[var(--realm-bg-elevated)] px-1 py-0.2 text-[9px] text-[var(--realm-amber)]">
                                ID
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1 max-w-[140px]">
                            {proj.tags.slice(0, 3).map((t) => (
                              <span
                                key={t.id}
                                className="text-[10px] font-mono text-[var(--realm-text-muted)] bg-[var(--realm-bg-surface)] px-1 rounded"
                              >
                                #{t.name}
                              </span>
                            ))}
                            {proj.tags.length > 3 && (
                              <span className="text-[9px] text-[var(--realm-text-muted)]">
                                +{proj.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-mono text-[11px] text-[var(--realm-text-muted)]">
                        #{proj.order}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {proj.status === "PUBLISHED" && (
                            <Link href={`/en/projects/${proj.slug}`} target="_blank">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-[var(--realm-text-muted)] hover:text-[var(--realm-amber)]"
                                title="Preview Public Page"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(proj)}
                            className="h-8 w-8 text-[var(--realm-amber)] hover:bg-[var(--realm-amber)]/10"
                            title="Edit Record"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isLoading}
                            onClick={() => handleDelete(proj.id, proj.slug)}
                            className="h-8 w-8 text-[var(--realm-clay)] hover:bg-[var(--realm-clay)]/10"
                            title="Delete Project"
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

      {/* Authoring & Case Study Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-mono text-base">
              <FolderGit2 className="h-4 w-4 text-[var(--realm-amber)]" />
              <span>{editingProject ? `Edit: ${editingProject.slug}` : "Forge New Project"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Complete the technical case study and bilingual descriptions. Changes are versioned in revision history.
            </DialogDescription>
          </DialogHeader>

          {serverError && (
            <Alert variant="destructive">
              <AlertDescription className="text-xs">{serverError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
            {/* Meta Row: Slug, Order, Status, Featured */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <Label required>URL Slug</Label>
                <Input
                  {...form.register("slug")}
                  placeholder="e.g. dynamic-portal-system"
                  className="font-mono text-xs"
                />
                {form.formState.errors.slug && (
                  <p className="text-[11px] text-[var(--realm-clay)]">
                    {form.formState.errors.slug.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Order</Label>
                <Input
                  type="number"
                  {...form.register("order")}
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Publication Status</Label>
                <Select {...form.register("status")} className="font-mono text-xs">
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </Select>
              </div>
            </div>

            {/* Links Row & Featured Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div className="space-y-1.5">
                <Label>Repository URL</Label>
                <Input
                  {...form.register("repoUrl")}
                  placeholder="https://github.com/..."
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Live Demo URL</Label>
                <Input
                  {...form.register("liveUrl")}
                  placeholder="https://..."
                  className="font-mono text-xs"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 sm:pt-0">
                <Switch
                  checked={form.watch("featured")}
                  onCheckedChange={(val) => form.setValue("featured", val)}
                  id="featured-switch"
                />
                <label
                  htmlFor="featured-switch"
                  className="text-xs font-mono font-medium text-[var(--realm-text-secondary)] cursor-pointer"
                >
                  Featured on Showcase
                </label>
              </div>
            </div>

            {/* Stack Tags */}
            <div className="space-y-1.5">
              <Label>Tech Stack Tags (Press Enter to add)</Label>
              <div className="flex flex-wrap gap-1.5 p-2 rounded-md border border-[var(--realm-border)] bg-[var(--realm-bg-surface)]">
                {currentTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded bg-[var(--realm-amber)]/10 border border-[var(--realm-amber)]/30 px-2 py-0.5 text-xs font-mono text-[var(--realm-amber)]"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-[var(--realm-clay)]"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder={currentTags.length === 0 ? "e.g. Next.js, Three.js, PostgreSQL" : "Add tag..."}
                  className="flex-1 min-w-[120px] bg-transparent text-xs text-[var(--realm-text-primary)] outline-none font-mono"
                />
              </div>
            </div>

            {/* Bilingual Tabs */}
            <div className="space-y-2 border-t border-[var(--realm-border)] pt-4">
              <Label required>Bilingual Case Study Content</Label>
              <Tabs defaultValue="en" className="w-full">
                <TabsList>
                  <TabsTrigger value="en">English (EN)</TabsTrigger>
                  <TabsTrigger value="id">Indonesian (ID)</TabsTrigger>
                </TabsList>

                {/* English Content */}
                <TabsContent value="en" className="space-y-4">
                  <div className="space-y-1.5">
                    <Label required>Title (EN)</Label>
                    <Input
                      {...form.register("en.title")}
                      placeholder="e.g. Astral Engine Telemetry"
                      className="text-xs"
                    />
                    {form.formState.errors.en?.title && (
                      <p className="text-[11px] text-[var(--realm-clay)]">
                        {form.formState.errors.en.title.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label required>Summary (EN)</Label>
                    <Input
                      {...form.register("en.summary")}
                      placeholder="Brief 1-2 sentence overview for cards"
                      className="text-xs"
                    />
                    {form.formState.errors.en?.summary && (
                      <p className="text-[11px] text-[var(--realm-clay)]">
                        {form.formState.errors.en.summary.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label required>Deep-Dive Case Study (EN - Markdown)</Label>
                    <Textarea
                      {...form.register("en.caseStudy")}
                      rows={6}
                      placeholder="Full technical architecture, challenges overcome, and performance decisions..."
                      className="font-mono text-xs leading-relaxed"
                    />
                    {form.formState.errors.en?.caseStudy && (
                      <p className="text-[11px] text-[var(--realm-clay)]">
                        {form.formState.errors.en.caseStudy.message}
                      </p>
                    )}
                  </div>

                  {/* Key Metrics EN */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Key Engineering Metrics (EN)</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => appendEnMetric({ label: "", value: "" })}
                        className="h-6 px-2 text-[10px] font-mono text-[var(--realm-amber)]"
                      >
                        + Add Metric
                      </Button>
                    </div>
                    {enMetrics.map((field, index) => (
                      <div key={field.id} className="flex gap-2 items-center">
                        <Input
                          {...form.register(`en.metrics.${index}.label` as const)}
                          placeholder="e.g. Frame Rate"
                          className="text-xs"
                        />
                        <Input
                          {...form.register(`en.metrics.${index}.value` as const)}
                          placeholder="e.g. 60 FPS Stable"
                          className="text-xs font-mono"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeEnMetric(index)}
                          className="h-8 w-8 text-[var(--realm-clay)]"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Indonesian Content */}
                <TabsContent value="id" className="space-y-4">
                  <div className="space-y-1.5">
                    <Label required>Judul (ID)</Label>
                    <Input
                      {...form.register("id.title")}
                      placeholder="Contoh: Telemetri Astral Engine"
                      className="text-xs"
                    />
                    {form.formState.errors.id?.title && (
                      <p className="text-[11px] text-[var(--realm-clay)]">
                        {form.formState.errors.id.title.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label required>Ringkasan (ID)</Label>
                    <Input
                      {...form.register("id.summary")}
                      placeholder="Ringkasan singkat 1-2 kalimat untuk kartu proyek"
                      className="text-xs"
                    />
                    {form.formState.errors.id?.summary && (
                      <p className="text-[11px] text-[var(--realm-clay)]">
                        {form.formState.errors.id.summary.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label required>Studi Kasus Lengkap (ID - Markdown)</Label>
                    <Textarea
                      {...form.register("id.caseStudy")}
                      rows={6}
                      placeholder="Arsitektur teknis lengkap, tantangan yang diatasi, dan keputusan performa..."
                      className="font-mono text-xs leading-relaxed"
                    />
                    {form.formState.errors.id?.caseStudy && (
                      <p className="text-[11px] text-[var(--realm-clay)]">
                        {form.formState.errors.id.caseStudy.message}
                      </p>
                    )}
                  </div>

                  {/* Key Metrics ID */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Metrik Teknis Kunci (ID)</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => appendIdMetric({ label: "", value: "" })}
                        className="h-6 px-2 text-[10px] font-mono text-[var(--realm-amber)]"
                      >
                        + Tambah Metrik
                      </Button>
                    </div>
                    {idMetrics.map((field, index) => (
                      <div key={field.id} className="flex gap-2 items-center">
                        <Input
                          {...form.register(`id.metrics.${index}.label` as const)}
                          placeholder="Contoh: Rasio Render"
                          className="text-xs"
                        />
                        <Input
                          {...form.register(`id.metrics.${index}.value` as const)}
                          placeholder="Contoh: 60 FPS Stabil"
                          className="text-xs font-mono"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeIdMetric(index)}
                          className="h-8 w-8 text-[var(--realm-clay)]"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Dialog Footer Actions */}
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
                    <span>Committing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{editingProject ? "Update Project Record" : "Forge Project Record"}</span>
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
