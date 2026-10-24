import { setRequestLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles, Code, Globe, Cpu, Database, Wrench } from "lucide-react";
import { getPublicSkillCategories, generatePublicMetadata } from "@/services/public-queries";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("Skills");

  return generatePublicMetadata({
    locale,
    path: "/skills",
    title: t("title"),
    description: t("subtitle"),
  });
}

function getCategoryIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("front") || lower.includes("web") || lower.includes("ui")) return Globe;
  if (lower.includes("back") || lower.includes("data") || lower.includes("system")) return Database;
  if (lower.includes("infra") || lower.includes("cloud") || lower.includes("devops")) return Cpu;
  if (lower.includes("tool") || lower.includes("engine")) return Wrench;
  return Code;
}

export default async function SkillsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Skills");
  const categories = await getPublicSkillCategories();

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-4 border-b border-[var(--realm-border)] pb-8">
        <Badge variant="amber" className="gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          <span>PORTAL: MASTERY</span>
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--realm-text-primary)] sm:text-4xl font-serif">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-base text-[var(--realm-text-secondary)]">{t("subtitle")}</p>
      </div>

      {/* Skill Categories */}
      {categories.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--realm-border)] bg-[var(--realm-bg-card)] p-12 text-center max-w-xl mx-auto">
          <Sparkles className="mx-auto h-10 w-10 text-[var(--realm-amber)] opacity-60 mb-3" />
          <h3 className="font-serif text-lg text-[var(--realm-text-primary)]">
            Skill Matrix Empty
          </h3>
          <p className="mt-1 text-xs text-[var(--realm-text-muted)] leading-relaxed">
            No skill categories or proficiencies published yet. Configure technical proficiencies through the Sanctuary CMS to display them here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {categories.map((group) => {
            const Icon = getCategoryIcon(group.iconName || group.name);

            return (
              <Card
                key={group.id}
                className="transition-colors hover:border-[var(--realm-border-light)]"
              >
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between text-[var(--realm-amber)]">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-surface)]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <Badge variant="moss" className="font-mono text-[10px]">
                      {group.skills.length} SKILLS
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-serif">{group.name}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 pt-0">
                  {group.skills.map((skill) => (
                    <div key={skill.id} className="space-y-1.5">
                      <div className="flex justify-between font-mono text-xs">
                        <span className="text-[var(--realm-text-primary)]">{skill.name}</span>
                        <span className="text-[var(--realm-amber)] font-semibold">{skill.proficiency}%</span>
                      </div>
                      {/* Tactile Indie Progress Bar */}
                      <div className="h-2 w-full overflow-hidden rounded-full border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] p-0.5">
                        <div
                          className="h-full rounded-full bg-[var(--realm-amber)] shadow-[0_0_8px_rgba(217,155,56,0.5)] transition-all duration-500"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
