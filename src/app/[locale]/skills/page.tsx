import { setRequestLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Sparkles, Database, Globe, Cpu } from "lucide-react";

export default async function SkillsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Skills");

  const skillCategories = [
    {
      category: "Frontend & Spatial Interfaces",
      icon: Globe,
      description: "Crafting atmospheric, tactile, and highly responsive user interfaces.",
      skills: [
        { name: "React 19 & Next.js 15", level: 98 },
        { name: "TypeScript Strict", level: 95 },
        { name: "Three.js / React Three Fiber", level: 90 },
        { name: "Tailwind CSS v4 & CSS Tokens", level: 95 },
        { name: "Accessibility (WCAG AA)", level: 92 },
      ],
    },
    {
      category: "Backend & Distributed Systems",
      icon: Database,
      description: "Robust data architectures, type-safe APIs, and transactional security.",
      skills: [
        { name: "PostgreSQL & Prisma ORM", level: 94 },
        { name: "Server Actions & Auth.js v5", level: 92 },
        { name: "Node.js & Edge Runtime", level: 90 },
        { name: "REST & GraphQL APIs", level: 88 },
        { name: "Zod Schema Validation", level: 96 },
      ],
    },
    {
      category: "Infrastructure & Engineering Rigor",
      icon: Cpu,
      description: "Automated pipelines, performance optimization, and rock-solid deployment.",
      skills: [
        { name: "Vercel & Cloudflare Edge", level: 90 },
        { name: "Vitest & Playwright Testing", level: 88 },
        { name: "Docker Containerization", level: 85 },
        { name: "Content Security Policy (CSP)", level: 90 },
        { name: "Cloudinary Signed Media Pipeline", level: 92 },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-4 border-b border-[var(--realm-border)] pb-8">
        <Badge variant="amber" className="gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          <span>PORTAL: MASTERY</span>
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--realm-text-primary)] sm:text-4xl">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-base text-[var(--realm-text-secondary)]">{t("subtitle")}</p>
      </div>

      {/* Skill Categories */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {skillCategories.map((group) => {
          const Icon = group.icon;
          return (
            <Card
              key={group.category}
              className="transition-colors hover:border-[var(--realm-border-light)]"
            >
              <CardHeader>
                <div className="mb-2 flex items-center gap-2 text-[var(--realm-amber)]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-surface)]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <Badge variant="moss" className="font-mono text-[10px]">
                    VERIFIED
                  </Badge>
                </div>
                <CardTitle className="text-base">{group.category}</CardTitle>
                <CardDescription className="text-xs">{group.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                {group.skills.map((skill) => (
                  <div key={skill.name} className="space-y-1.5">
                    <div className="flex justify-between font-mono text-xs">
                      <span className="text-[var(--realm-text-primary)]">{skill.name}</span>
                      <span className="text-[var(--realm-text-muted)]">{skill.level}%</span>
                    </div>
                    {/* Tactile Indie Progress Bar */}
                    <div className="h-2 w-full overflow-hidden rounded-full border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] p-0.5">
                      <div
                        className="h-full rounded-full bg-[var(--realm-amber)] shadow-[0_0_8px_rgba(217,155,56,0.5)] transition-all duration-500"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
