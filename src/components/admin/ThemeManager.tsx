"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ThemePresetFormSchema } from "@/schemas";
import {
  createThemePresetAction,
  activateThemePresetAction,
  deleteThemePresetAction,
  getThemePresetsAdminAction,
} from "@/actions/theme-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Palette,
  Plus,
  Trash2,
  CheckCircle2,
  Check,
  Loader2,
  Sparkles,
  Eye,
  EyeOff,
  RotateCcw,
} from "lucide-react";

interface PresetItem {
  id: string;
  name: string;
  isDefault: boolean;
  bgPrimary: string;
  bgSurface: string;
  bgCard: string;
  border: string;
  amber: string;
  moss: string;
  clay: string;
  parchment: string;
  active: boolean;
}

export function ThemeManager({ initialPresets }: { initialPresets: PresetItem[] }) {
  const [presets, setPresets] = React.useState<PresetItem[]>(initialPresets);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [activatingId, setActivatingId] = React.useState<string | null>(null);
  const [previewingId, setPreviewingId] = React.useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(ThemePresetFormSchema),
    defaultValues: {
      name: "",
      bgPrimary: "#0d131a",
      bgSurface: "#141d27",
      bgCard: "#182330",
      border: "#2c3c4f",
      amber: "#d99b38",
      moss: "#3d634f",
      clay: "#c45a3c",
      parchment: "#e4dbc9",
    },
  });

  const openCreateDialog = () => {
    setServerError(null);
    form.reset({
      name: "",
      bgPrimary: "#0e1620",
      bgSurface: "#162231",
      bgCard: "#1c2b3d",
      border: "#2d425c",
      amber: "#e5a93c",
      moss: "#416f56",
      clay: "#cf5e40",
      parchment: "#ebe3d3",
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      await createThemePresetAction(data);
      const refreshed = await getThemePresetsAdminAction();
      setPresets(refreshed as any);
      setIsDialogOpen(false);
      setSuccessMessage(`Theme preset "${data.name}" created.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setServerError(err.message || "Failed to create preset.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActivate = async (id: string, name: string) => {
    setActivatingId(id);
    try {
      await activateThemePresetAction(id);
      const refreshed = await getThemePresetsAdminAction();
      setPresets(refreshed as any);
      setSuccessMessage(`Theme "${name}" activated globally.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      alert(`Error activating theme: ${err.message}`);
    } finally {
      setActivatingId(null);
    }
  };

  const handlePreview = (preset: PresetItem) => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--realm-bg", preset.bgPrimary);
      document.documentElement.style.setProperty("--realm-bg-surface", preset.bgSurface);
      document.documentElement.style.setProperty("--realm-bg-card", preset.bgCard);
      document.documentElement.style.setProperty("--realm-border", preset.border);
      document.documentElement.style.setProperty("--realm-amber", preset.amber);
      document.documentElement.style.setProperty("--realm-moss", preset.moss);
      document.documentElement.style.setProperty("--realm-clay", preset.clay);
      document.documentElement.style.setProperty("--realm-parchment", preset.parchment);
      setPreviewingId(preset.id);
    }
  };

  const handleClearPreview = () => {
    if (typeof document !== "undefined") {
      document.documentElement.removeAttribute("style");
      setPreviewingId(null);
    }
  };

  const handleResetToDefault = async () => {
    const defaultPreset = presets.find((p) => p.isDefault) || presets[0];
    if (!defaultPreset) return;
    await handleActivate(defaultPreset.id, defaultPreset.name);
    handleClearPreview();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete theme preset "${name}"?`)) return;
    try {
      await deleteThemePresetAction(id);
      const refreshed = await getThemePresetsAdminAction();
      setPresets(refreshed as any);
      setSuccessMessage(`Theme preset "${name}" deleted.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
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

      {previewingId && (
        <Alert variant="default" className="border-[var(--realm-amber)] bg-[var(--realm-amber)]/10 text-[var(--realm-amber)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <AlertDescription className="font-mono text-xs">
              Live Preview Active: Experiencing client-side CSS token override. Changes not saved globally until activated.
            </AlertDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClearPreview} className="font-mono text-xs h-7">
            Clear Preview
          </Button>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-[var(--realm-amber)]" />
          <span className="text-sm font-semibold">Handcrafted Theme Presets</span>
          <span className="font-mono text-xs text-[var(--realm-text-muted)]">
            ({presets.length} Presets)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleResetToDefault}
            variant="secondary"
            size="sm"
            className="gap-1.5 font-mono text-xs"
            title="Reset to default system palette"
          >
            <RotateCcw className="h-3.5 w-3.5 text-[var(--realm-amber)]" />
            <span>Reset to Default</span>
          </Button>

          <Button
            onClick={openCreateDialog}
            variant="primary"
            size="sm"
            className="gap-1.5 font-mono text-xs shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span>Forge New Palette</span>
          </Button>
        </div>
      </div>

      {/* Preset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {presets.map((preset) => {
          const isActivating = activatingId === preset.id;

          return (
            <Card
              key={preset.id}
              className={`space-y-4 transition-all ${
                preset.active ? "border-[var(--realm-amber)] shadow-lg shadow-[var(--realm-amber)]/5" : ""
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-semibold">{preset.name}</CardTitle>
                  {preset.isDefault && (
                    <Badge variant="outline" className="text-[9px]">
                      Default
                    </Badge>
                  )}
                </div>
                {preset.active ? (
                  <Badge variant="amber" className="font-mono text-[9px] gap-1">
                    <Check className="h-2.5 w-2.5" />
                    <span>ACTIVE</span>
                  </Badge>
                ) : (
                  <Badge variant="outline" className="font-mono text-[9px]">
                    INACTIVE
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Color Swatches */}
                <div className="space-y-1.5">
                  <span className="font-mono text-[10px] text-[var(--realm-text-muted)] uppercase">
                    Palette Swatches
                  </span>
                  <div className="grid grid-cols-4 gap-1.5 rounded-lg border border-[var(--realm-border)]/50 p-2 bg-[var(--realm-bg-surface)]">
                    <div className="text-center space-y-1">
                      <div className="h-6 w-full rounded border border-[var(--realm-border)]" style={{ backgroundColor: preset.bgPrimary }} />
                      <span className="block font-mono text-[8px] text-[var(--realm-text-muted)]">Primary</span>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="h-6 w-full rounded border border-[var(--realm-border)]" style={{ backgroundColor: preset.bgSurface }} />
                      <span className="block font-mono text-[8px] text-[var(--realm-text-muted)]">Surface</span>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="h-6 w-full rounded border border-[var(--realm-border)]" style={{ backgroundColor: preset.amber }} />
                      <span className="block font-mono text-[8px] text-[var(--realm-text-muted)]">Amber</span>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="h-6 w-full rounded border border-[var(--realm-border)]" style={{ backgroundColor: preset.moss }} />
                      <span className="block font-mono text-[8px] text-[var(--realm-text-muted)]">Moss</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-[var(--realm-border)]/50">
                  <div className="flex items-center gap-2">
                    {preset.active ? (
                      <span className="font-mono text-xs text-[var(--realm-amber)] flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        <span>Live on Showcase</span>
                      </span>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={isActivating}
                        onClick={() => handleActivate(preset.id, preset.name)}
                        className="font-mono text-xs"
                      >
                        {isActivating ? <Loader2 className="h-3 w-3 animate-spin" /> : "Set As Active"}
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        previewingId === preset.id
                          ? handleClearPreview()
                          : handlePreview(preset)
                      }
                      className="font-mono text-xs gap-1 h-8 px-2"
                      title="Preview this palette locally"
                    >
                      {previewingId === preset.id ? (
                        <>
                          <EyeOff className="h-3 w-3 text-[var(--realm-clay)]" />
                          <span className="text-[var(--realm-clay)]">Exit</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3 text-[var(--realm-amber)]" />
                          <span>Preview</span>
                        </>
                      )}
                    </Button>
                  </div>

                  {!preset.active && !preset.isDefault && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(preset.id, preset.name)}
                      className="h-8 w-8 text-[var(--realm-clay)]"
                      title="Delete Palette"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Forge Preset Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-mono text-sm">Forge New Theme Preset</DialogTitle>
          </DialogHeader>

          {serverError && (
            <Alert variant="destructive">
              <AlertDescription className="text-xs">{serverError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label required>Preset Name</Label>
              <Input
                {...form.register("name")}
                placeholder="e.g. Amber Moss Nocturne"
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-[var(--realm-border)]/50 pt-2">
              <div className="space-y-1">
                <Label required>Background Primary</Label>
                <div className="flex gap-2">
                  <input type="color" {...form.register("bgPrimary")} className="h-8 w-8 rounded cursor-pointer p-0.5" />
                  <Input {...form.register("bgPrimary")} className="font-mono text-xs uppercase" />
                </div>
              </div>

              <div className="space-y-1">
                <Label required>Background Surface</Label>
                <div className="flex gap-2">
                  <input type="color" {...form.register("bgSurface")} className="h-8 w-8 rounded cursor-pointer p-0.5" />
                  <Input {...form.register("bgSurface")} className="font-mono text-xs uppercase" />
                </div>
              </div>

              <div className="space-y-1">
                <Label required>Card Background</Label>
                <div className="flex gap-2">
                  <input type="color" {...form.register("bgCard")} className="h-8 w-8 rounded cursor-pointer p-0.5" />
                  <Input {...form.register("bgCard")} className="font-mono text-xs uppercase" />
                </div>
              </div>

              <div className="space-y-1">
                <Label required>Border Color</Label>
                <div className="flex gap-2">
                  <input type="color" {...form.register("border")} className="h-8 w-8 rounded cursor-pointer p-0.5" />
                  <Input {...form.register("border")} className="font-mono text-xs uppercase" />
                </div>
              </div>

              <div className="space-y-1">
                <Label required>Amber Accent</Label>
                <div className="flex gap-2">
                  <input type="color" {...form.register("amber")} className="h-8 w-8 rounded cursor-pointer p-0.5" />
                  <Input {...form.register("amber")} className="font-mono text-xs uppercase" />
                </div>
              </div>

              <div className="space-y-1">
                <Label required>Moss Accent</Label>
                <div className="flex gap-2">
                  <input type="color" {...form.register("moss")} className="h-8 w-8 rounded cursor-pointer p-0.5" />
                  <Input {...form.register("moss")} className="font-mono text-xs uppercase" />
                </div>
              </div>

              <div className="space-y-1">
                <Label required>Clay Accent</Label>
                <div className="flex gap-2">
                  <input type="color" {...form.register("clay")} className="h-8 w-8 rounded cursor-pointer p-0.5" />
                  <Input {...form.register("clay")} className="font-mono text-xs uppercase" />
                </div>
              </div>

              <div className="space-y-1">
                <Label required>Parchment Text</Label>
                <div className="flex gap-2">
                  <input type="color" {...form.register("parchment")} className="h-8 w-8 rounded cursor-pointer p-0.5" />
                  <Input {...form.register("parchment")} className="font-mono text-xs uppercase" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--realm-border)]">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsDialogOpen(false)}
                className="font-mono text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting} className="font-mono text-xs">
                {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save Palette"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
