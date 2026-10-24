"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  WorldSceneFormSchema,
  WorldPortalFormSchema,
  updateWorldSceneAction,
  createWorldPortalAction,
  updateWorldPortalAction,
  deleteWorldPortalAction,
  getWorldSceneAdminAction,
} from "@/actions/world-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Compass,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Sun,
  Loader2,
  Sparkles,
} from "lucide-react";

interface PortalItem {
  id: string;
  sceneId: string;
  targetRoute: string;
  posX: number;
  posY: number;
  posZ: number;
  rotY: number;
  labelEn: string;
  labelId: string;
  active: boolean;
  order: number;
}

interface WorldSceneData {
  id: string;
  name: string;
  fogColor: string;
  fogDensity: number;
  ambientLightColor: string;
  ambientLightIntensity: number;
  sunLightColor: string;
  sunLightIntensity: number;
  bloomIntensity: number;
  portals: PortalItem[];
}

export function WorldSceneManager({ initialScene }: { initialScene: WorldSceneData }) {
  const [scene, setScene] = React.useState<WorldSceneData>(initialScene);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isSubmittingScene, setIsSubmittingScene] = React.useState(false);

  // Portal Dialog
  const [isPortalDialogOpen, setIsPortalDialogOpen] = React.useState(false);
  const [editingPortal, setEditingPortal] = React.useState<PortalItem | null>(null);
  const [isSubmittingPortal, setIsSubmittingPortal] = React.useState(false);

  // Scene Form
  const sceneForm = useForm({
    resolver: zodResolver(WorldSceneFormSchema),
    defaultValues: {
      name: scene.name,
      fogColor: scene.fogColor,
      fogDensity: scene.fogDensity,
      ambientLightColor: scene.ambientLightColor,
      ambientLightIntensity: scene.ambientLightIntensity,
      sunLightColor: scene.sunLightColor,
      sunLightIntensity: scene.sunLightIntensity,
      bloomIntensity: scene.bloomIntensity,
    },
  });

  // Portal Form
  const portalForm = useForm({
    resolver: zodResolver(WorldPortalFormSchema),
    defaultValues: {
      sceneId: scene.id,
      targetRoute: "/projects",
      posX: 0,
      posY: 0,
      posZ: 0,
      rotY: 0,
      labelEn: "",
      labelId: "",
      active: true,
      order: 0,
    },
  });

  const onSceneSubmit = async (data: any) => {
    setIsSubmittingScene(true);
    setServerError(null);
    try {
      await updateWorldSceneAction(scene.id, data);
      const refreshed = await getWorldSceneAdminAction();
      setScene(refreshed as any);
      setSuccessMessage("Atmospheric parameters updated & revision logged.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setServerError(err.message || "Failed to update scene.");
    } finally {
      setIsSubmittingScene(false);
    }
  };

  const openCreatePortal = () => {
    setEditingPortal(null);
    setServerError(null);
    portalForm.reset({
      sceneId: scene.id,
      targetRoute: "/projects",
      posX: 0,
      posY: 0,
      posZ: 0,
      rotY: 0,
      labelEn: "",
      labelId: "",
      active: true,
      order: scene.portals.length + 1,
    });
    setIsPortalDialogOpen(true);
  };

  const openEditPortal = (p: PortalItem) => {
    setEditingPortal(p);
    setServerError(null);
    portalForm.reset({
      sceneId: scene.id,
      targetRoute: p.targetRoute,
      posX: p.posX,
      posY: p.posY,
      posZ: p.posZ,
      rotY: p.rotY,
      labelEn: p.labelEn,
      labelId: p.labelId,
      active: p.active,
      order: p.order,
    });
    setIsPortalDialogOpen(true);
  };

  const onPortalSubmit = async (data: any) => {
    setIsSubmittingPortal(true);
    setServerError(null);
    try {
      if (editingPortal) {
        await updateWorldPortalAction(editingPortal.id, data);
        setSuccessMessage(`Portal "${data.labelEn}" updated.`);
      } else {
        await createWorldPortalAction(data);
        setSuccessMessage(`Portal "${data.labelEn}" placed in 3D diorama.`);
      }
      const refreshed = await getWorldSceneAdminAction();
      setScene(refreshed as any);
      setIsPortalDialogOpen(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setServerError(err.message || "Failed to save portal.");
    } finally {
      setIsSubmittingPortal(false);
    }
  };

  const handleDeletePortal = async (id: string, label: string) => {
    if (!confirm(`Remove portal node "${label}" from diorama?`)) return;
    try {
      await deleteWorldPortalAction(id);
      const refreshed = await getWorldSceneAdminAction();
      setScene(refreshed as any);
      setSuccessMessage(`Portal "${label}" removed.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8">
      {successMessage && (
        <Alert variant="default" className="border-[var(--realm-moss)] bg-[var(--realm-moss)]/10 text-[var(--realm-moss-bright)]">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription className="font-mono text-xs">{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Atmospheric Environment Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Sun className="h-4 w-4 text-[var(--realm-amber)]" />
                <span>Atmospheric Environment & Lighting</span>
              </CardTitle>
              <CardDescription>
                Configure real-time fog density, ambient warm illumination, and bloom intensity for the 3D diorama.
              </CardDescription>
            </div>
            <Button
              form="scene-form"
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmittingScene}
              className="font-mono text-xs gap-1.5"
            >
              {isSubmittingScene ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              <span>Commit Atmosphere</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form id="scene-form" onSubmit={sceneForm.handleSubmit(onSceneSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <Label required>Scene Name</Label>
                <Input {...sceneForm.register("name")} className="text-xs" />
              </div>

              <div className="space-y-1.5">
                <Label required>Fog Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    {...sceneForm.register("fogColor")}
                    className="h-9 w-9 rounded border border-[var(--realm-border)] bg-transparent cursor-pointer p-0.5"
                  />
                  <Input {...sceneForm.register("fogColor")} className="font-mono text-xs uppercase" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <Label required>Fog Density</Label>
                  <span className="font-mono text-xs text-[var(--realm-amber)]">
                    {String(sceneForm.watch("fogDensity"))}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.001"
                  max="0.08"
                  step="0.001"
                  {...sceneForm.register("fogDensity", { valueAsNumber: true })}
                  className="w-full accent-[var(--realm-amber)] cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <Label required>Bloom Glow</Label>
                  <span className="font-mono text-xs text-[var(--realm-amber)]">
                    {String(sceneForm.watch("bloomIntensity"))}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1.5"
                  step="0.05"
                  {...sceneForm.register("bloomIntensity", { valueAsNumber: true })}
                  className="w-full accent-[var(--realm-amber)] cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 border-t border-[var(--realm-border)]/50 pt-4">
              <div className="space-y-1.5">
                <Label required>Ambient Light Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    {...sceneForm.register("ambientLightColor")}
                    className="h-9 w-9 rounded border border-[var(--realm-border)] bg-transparent cursor-pointer p-0.5"
                  />
                  <Input {...sceneForm.register("ambientLightColor")} className="font-mono text-xs uppercase" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <Label required>Ambient Intensity</Label>
                  <span className="font-mono text-xs text-[var(--realm-amber)]">
                    {String(sceneForm.watch("ambientLightIntensity"))}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="2.5"
                  step="0.05"
                  {...sceneForm.register("ambientLightIntensity", { valueAsNumber: true })}
                  className="w-full accent-[var(--realm-amber)] cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <Label required>Sun Directional Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    {...sceneForm.register("sunLightColor")}
                    className="h-9 w-9 rounded border border-[var(--realm-border)] bg-transparent cursor-pointer p-0.5"
                  />
                  <Input {...sceneForm.register("sunLightColor")} className="font-mono text-xs uppercase" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <Label required>Sun Intensity</Label>
                  <span className="font-mono text-xs text-[var(--realm-amber)]">
                    {String(sceneForm.watch("sunLightIntensity"))}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3"
                  step="0.1"
                  {...sceneForm.register("sunLightIntensity", { valueAsNumber: true })}
                  className="w-full accent-[var(--realm-amber)] cursor-pointer"
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Portals Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-[var(--realm-amber)]" />
            <span className="text-sm font-semibold">3D Diorama Portal Nodes</span>
            <Badge variant="outline" className="font-mono">
              {scene.portals.length} Active Nodes
            </Badge>
          </div>

          <Button
            onClick={openCreatePortal}
            variant="primary"
            size="sm"
            className="gap-1.5 font-mono text-xs shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span>Place Portal Node</span>
          </Button>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--realm-border)] bg-[var(--realm-bg-surface)] font-mono tracking-wider text-[var(--realm-text-muted)] uppercase">
                <tr>
                  <th className="p-4">Destination Route</th>
                  <th className="p-4">Bilingual Label (EN / ID)</th>
                  <th className="p-4">3D Position [X, Y, Z]</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Order</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--realm-border)]/50">
                {scene.portals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-[var(--realm-text-muted)] font-mono">
                      No portal nodes active in this world scene.
                    </td>
                  </tr>
                ) : (
                  scene.portals.map((portal) => (
                    <tr
                      key={portal.id}
                      className="transition-colors hover:bg-[var(--realm-bg-surface)]/50"
                    >
                      <td className="p-4 font-mono font-semibold text-[var(--realm-amber)]">
                        {portal.targetRoute}
                      </td>

                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className="font-medium text-[var(--realm-text-primary)]">
                            {portal.labelEn}
                          </span>
                          <span className="block text-[11px] text-[var(--realm-text-muted)] italic">
                            {portal.labelId}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 font-mono text-[11px] text-[var(--realm-text-secondary)]">
                        [{portal.posX.toFixed(1)}, {portal.posY.toFixed(1)}, {portal.posZ.toFixed(1)}]
                      </td>

                      <td className="p-4">
                        <Badge
                          variant={portal.active ? "moss" : "outline"}
                          className="font-mono text-[10px]"
                        >
                          {portal.active ? "ACTIVE" : "INACTIVE"}
                        </Badge>
                      </td>

                      <td className="p-4 font-mono text-[11px] text-[var(--realm-text-muted)]">
                        #{portal.order}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditPortal(portal)}
                            className="h-8 w-8 text-[var(--realm-amber)] hover:bg-[var(--realm-amber)]/10"
                            title="Edit Coordinates"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletePortal(portal.id, portal.labelEn)}
                            className="h-8 w-8 text-[var(--realm-clay)] hover:bg-[var(--realm-clay)]/10"
                            title="Remove Portal"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Portal Dialog */}
      <Dialog open={isPortalDialogOpen} onOpenChange={setIsPortalDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-mono text-sm">
              {editingPortal ? `Edit Portal: ${editingPortal.labelEn}` : "Place New 3D Portal"}
            </DialogTitle>
          </DialogHeader>

          {serverError && (
            <Alert variant="destructive">
              <AlertDescription className="text-xs">{serverError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={portalForm.handleSubmit(onPortalSubmit)} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label required>Target Route</Label>
              <Input
                {...portalForm.register("targetRoute")}
                placeholder="e.g. /projects, /about, /experience, /skills, /contact"
                className="font-mono text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label required>Label (EN)</Label>
                <Input
                  {...portalForm.register("labelEn")}
                  placeholder="e.g. Workshop"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label required>Label (ID)</Label>
                <Input
                  {...portalForm.register("labelId")}
                  placeholder="Contoh: Bengkel"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5 border-t border-[var(--realm-border)]/50 pt-2">
              <Label required>3D Coordinates in World Space (X, Y, Z)</Label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="font-mono text-[10px] text-[var(--realm-text-muted)]">X Position</span>
                  <Input type="number" step="0.5" {...portalForm.register("posX")} className="font-mono text-xs" />
                </div>
                <div>
                  <span className="font-mono text-[10px] text-[var(--realm-text-muted)]">Y Position</span>
                  <Input type="number" step="0.5" {...portalForm.register("posY")} className="font-mono text-xs" />
                </div>
                <div>
                  <span className="font-mono text-[10px] text-[var(--realm-text-muted)]">Z Position</span>
                  <Input type="number" step="0.5" {...portalForm.register("posZ")} className="font-mono text-xs" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 items-center border-t border-[var(--realm-border)]/50 pt-2">
              <div className="space-y-1.5">
                <Label>Order</Label>
                <Input type="number" {...portalForm.register("order")} className="font-mono text-xs" />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Switch
                  checked={Boolean(portalForm.watch("active"))}
                  onCheckedChange={(val) => portalForm.setValue("active", val)}
                  id="portal-active"
                />
                <label htmlFor="portal-active" className="text-xs font-mono font-medium cursor-pointer">
                  Active Portal
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--realm-border)]">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsPortalDialogOpen(false)}
                className="font-mono text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmittingPortal} className="font-mono text-xs">
                {isSubmittingPortal ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save Portal"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
