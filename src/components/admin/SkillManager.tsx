"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CategoryFormSchema,
  SkillFormSchema,
  createSkillCategoryAction,
  updateSkillCategoryAction,
  deleteSkillCategoryAction,
  createSkillAction,
  updateSkillAction,
  deleteSkillAction,
  getSkillCategoriesAdminAction,
} from "@/actions/skill-actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Code2,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  FolderPlus,
  Loader2,
  Layers,
} from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  iconName: string;
  order: number;
  skills: {
    id: string;
    categoryId: string;
    name: string;
    proficiency: number;
    order: number;
  }[];
}

export function SkillManager({ initialCategories }: { initialCategories: CategoryItem[] }) {
  const [categories, setCategories] = React.useState<CategoryItem[]>(initialCategories);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  // Category Dialog
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<CategoryItem | null>(null);

  // Skill Dialog
  const [isSkillDialogOpen, setIsSkillDialogOpen] = React.useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>("");
  const [editingSkill, setEditingSkill] = React.useState<{
    id: string;
    categoryId: string;
    name: string;
    proficiency: number;
    order: number;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  // Category Form
  const categoryForm = useForm({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: { name: "", iconName: "Globe", order: 0 },
  });

  // Skill Form
  const skillForm = useForm({
    resolver: zodResolver(SkillFormSchema),
    defaultValues: { categoryId: "", name: "", proficiency: 80, order: 0 },
  });

  const openCreateCategory = () => {
    setEditingCategory(null);
    setServerError(null);
    categoryForm.reset({ name: "", iconName: "Code", order: categories.length + 1 });
    setIsCategoryDialogOpen(true);
  };

  const openEditCategory = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setServerError(null);
    categoryForm.reset({ name: cat.name, iconName: cat.iconName, order: cat.order });
    setIsCategoryDialogOpen(true);
  };

  const onCategorySubmit = async (data: any) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      if (editingCategory) {
        await updateSkillCategoryAction(editingCategory.id, data);
        setSuccessMessage(`Category "${data.name}" updated.`);
      } else {
        await createSkillCategoryAction(data);
        setSuccessMessage(`Category "${data.name}" created.`);
      }
      const refreshed = await getSkillCategoriesAdminAction();
      setCategories(refreshed as any);
      setIsCategoryDialogOpen(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setServerError(err.message || "Failed to save category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}" and all of its associated skills?`)) return;
    try {
      await deleteSkillCategoryAction(id);
      const refreshed = await getSkillCategoriesAdminAction();
      setCategories(refreshed as any);
      setSuccessMessage(`Category "${name}" deleted.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const openCreateSkill = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setEditingSkill(null);
    setServerError(null);
    skillForm.reset({ categoryId, name: "", proficiency: 80, order: 0 });
    setIsSkillDialogOpen(true);
  };

  const openEditSkill = (skill: any) => {
    setSelectedCategoryId(skill.categoryId);
    setEditingSkill(skill);
    setServerError(null);
    skillForm.reset({
      categoryId: skill.categoryId,
      name: skill.name,
      proficiency: skill.proficiency,
      order: skill.order,
    });
    setIsSkillDialogOpen(true);
  };

  const onSkillSubmit = async (data: any) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      if (editingSkill) {
        await updateSkillAction(editingSkill.id, data);
        setSuccessMessage(`Skill "${data.name}" updated.`);
      } else {
        await createSkillAction(data);
        setSuccessMessage(`Skill "${data.name}" added.`);
      }
      const refreshed = await getSkillCategoriesAdminAction();
      setCategories(refreshed as any);
      setIsSkillDialogOpen(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setServerError(err.message || "Failed to save skill.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSkill = async (id: string, name: string) => {
    if (!confirm(`Delete skill "${name}"?`)) return;
    try {
      await deleteSkillAction(id);
      const refreshed = await getSkillCategoriesAdminAction();
      setCategories(refreshed as any);
      setSuccessMessage(`Skill "${name}" removed.`);
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

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-[var(--realm-amber)]" />
          <span className="text-sm font-semibold">Skill Masteries</span>
          <span className="font-mono text-xs text-[var(--realm-text-muted)]">
            ({categories.length} Categories)
          </span>
        </div>

        <Button
          onClick={openCreateCategory}
          variant="primary"
          size="sm"
          className="gap-1.5 font-mono text-xs shadow-md"
        >
          <FolderPlus className="h-4 w-4" />
          <span>New Skill Category</span>
        </Button>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.length === 0 ? (
          <div className="col-span-2 p-8 text-center text-xs font-mono text-[var(--realm-text-muted)] border border-dashed border-[var(--realm-border)] rounded-lg">
            No skill categories defined yet. Click &quot;New Skill Category&quot; to begin.
          </div>
        ) : (
          categories.map((cat) => (
            <Card key={cat.id} className="space-y-4">
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-[var(--realm-border)]/50">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[var(--realm-amber)]" />
                  <CardTitle className="text-sm font-semibold text-[var(--realm-text-primary)]">
                    {cat.name}
                  </CardTitle>
                  <span className="text-[10px] font-mono text-[var(--realm-text-muted)]">
                    #{cat.order}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openCreateSkill(cat.id)}
                    className="h-7 w-7 text-[var(--realm-moss-bright)] hover:bg-[var(--realm-moss)]/20"
                    title="Add Skill"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditCategory(cat)}
                    className="h-7 w-7 text-[var(--realm-amber)] hover:bg-[var(--realm-amber)]/20"
                    title="Edit Category"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    className="h-7 w-7 text-[var(--realm-clay)] hover:bg-[var(--realm-clay)]/20"
                    title="Delete Category"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-2">
                {cat.skills.length === 0 ? (
                  <p className="text-xs text-[var(--realm-text-muted)] italic font-mono py-2 text-center">
                    No skills in this category yet.
                  </p>
                ) : (
                  cat.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="group flex items-center justify-between rounded-md border border-[var(--realm-border)]/40 bg-[var(--realm-bg-surface)] p-2.5 transition-colors hover:border-[var(--realm-amber)]/40"
                    >
                      <div className="flex-1 space-y-1 pr-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-[var(--realm-text-primary)]">
                            {skill.name}
                          </span>
                          <span className="font-mono text-[11px] text-[var(--realm-amber)]">
                            {skill.proficiency}%
                          </span>
                        </div>
                        {/* Proficiency Bar */}
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--realm-border)]/50">
                          <div
                            className="h-full bg-gradient-to-r from-[var(--realm-moss)] to-[var(--realm-amber)] transition-all duration-300"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditSkill(skill)}
                          className="h-6 w-6 text-[var(--realm-amber)]"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteSkill(skill.id, skill.name)}
                          className="h-6 w-6 text-[var(--realm-clay)]"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-mono text-sm">
              {editingCategory ? `Edit Category: ${editingCategory.name}` : "Create Skill Category"}
            </DialogTitle>
          </DialogHeader>

          {serverError && (
            <Alert variant="destructive">
              <AlertDescription className="text-xs">{serverError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label required>Category Name</Label>
              <Input
                {...categoryForm.register("name")}
                placeholder="e.g. Frontend Architecture"
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Icon Identifier</Label>
                <Input
                  {...categoryForm.register("iconName")}
                  placeholder="e.g. Code, Globe"
                  className="font-mono text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Display Order</Label>
                <Input
                  type="number"
                  {...categoryForm.register("order")}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--realm-border)]">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsCategoryDialogOpen(false)}
                className="font-mono text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting} className="font-mono text-xs">
                {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save Category"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Skill Dialog */}
      <Dialog open={isSkillDialogOpen} onOpenChange={setIsSkillDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-mono text-sm">
              {editingSkill ? `Edit Skill: ${editingSkill.name}` : "Add New Skill"}
            </DialogTitle>
          </DialogHeader>

          {serverError && (
            <Alert variant="destructive">
              <AlertDescription className="text-xs">{serverError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={skillForm.handleSubmit(onSkillSubmit)} className="space-y-4 pt-2">
            <input type="hidden" {...skillForm.register("categoryId")} value={selectedCategoryId} />

            <div className="space-y-1.5">
              <Label required>Skill Name</Label>
              <Input
                {...skillForm.register("name")}
                placeholder="e.g. TypeScript / Next.js / Three.js"
                className="text-xs"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label required>Proficiency Level</Label>
                <span className="font-mono text-xs text-[var(--realm-amber)]">
                  {String(skillForm.watch("proficiency"))}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                {...skillForm.register("proficiency", { valueAsNumber: true })}
                className="w-full accent-[var(--realm-amber)] cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Display Order</Label>
              <Input
                type="number"
                {...skillForm.register("order")}
                className="font-mono text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--realm-border)]">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsSkillDialogOpen(false)}
                className="font-mono text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting} className="font-mono text-xs">
                {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save Skill"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
