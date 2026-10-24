import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Sparkles, Compass, Boxes, Scroll, Layers, ArrowRight, Eye, Terminal } from "lucide-react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Hero");
  const tw = await getTranslations("World");
  const tp = await getTranslations("Projects");
  const tc = await getTranslations("Common");

  return (
    <div className="space-y-16 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] p-8 sm:p-12 lg:p-16 shadow-2xl">
          {/* Subtle Ambient Background Lighting */}
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[var(--realm-amber)]/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[var(--realm-moss)]/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="flex items-center gap-2">
              <Badge variant="amber">
                <Sparkles className="h-3 w-3" />
                <span>{t("greeting")}</span>
              </Badge>
              <span className="text-xs font-mono text-[var(--realm-text-muted)]">
                [SECTOR: 01 // INDIE DIORAMA]
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-[var(--realm-text-primary)]">
              {t("role")}
            </h1>

            <p className="text-base sm:text-lg text-[var(--realm-text-secondary)] leading-relaxed font-sans">
              {t("description")}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/projects">
                <Button variant="primary" size="lg" className="gap-2">
                  <Compass className="h-4 w-4" />
                  <span>{t("enterWorld")}</span>
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="secondary" size="lg" className="gap-2">
                  <Boxes className="h-4 w-4" />
                  <span>{t("browseCatalog")}</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3D World Diorama Placeholder / 2D Diorama Preview (Phase 1 Baseline) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-[var(--realm-border)] bg-[var(--realm-bg-card)] p-6 sm:p-8 relative overflow-hidden shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--realm-border)]/80 pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--realm-amber)] animate-pulse" />
                <h2 className="text-base font-semibold text-[var(--realm-text-primary)]">
                  {tw("loadingScene")}
                </h2>
              </div>
              <p className="text-xs text-[var(--realm-text-muted)] mt-1">
                {tw("hintInteraction")}
              </p>
            </div>
            <Badge variant="moss" className="self-start sm:self-auto font-mono text-xs">
              <Eye className="h-3.5 w-3.5" />
              <span>INTERACTIVE DIORAMA STAGE</span>
            </Badge>
          </div>

          {/* Diorama Stage Placeholder */}
          <div className="relative min-h-[360px] sm:min-h-[440px] rounded-lg border border-dashed border-[var(--realm-border-light)] bg-[var(--realm-bg)]/80 flex flex-col items-center justify-center p-8 text-center">
            <div className="relative mb-6">
              <div className="h-20 w-20 rounded-2xl bg-[var(--realm-bg-surface)] border border-[var(--realm-amber)]/40 flex items-center justify-center shadow-lg">
                <Compass className="h-10 w-10 text-[var(--realm-amber)] animate-spin [animation-duration:12s]" />
              </div>
              <div className="absolute -inset-2 rounded-2xl bg-[var(--realm-amber)]/10 blur-md pointer-events-none" />
            </div>

            <h3 className="text-lg font-medium text-[var(--realm-text-primary)]">
              Interactive 3D Diorama Gateway
            </h3>
            <p className="text-xs text-[var(--realm-text-secondary)] max-w-md mt-2 leading-relaxed">
              {tw("accessibleNotice")}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="/projects">
                <Button variant="secondary" size="sm" className="font-mono text-xs gap-1.5">
                  <Boxes className="h-3.5 w-3.5 text-[var(--realm-amber)]" />
                  <span>Portal: Creations</span>
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="secondary" size="sm" className="font-mono text-xs gap-1.5">
                  <Scroll className="h-3.5 w-3.5 text-[var(--realm-amber)]" />
                  <span>Portal: Chronicle</span>
                </Button>
              </Link>
              <Link href="/experience">
                <Button variant="secondary" size="sm" className="font-mono text-xs gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-[var(--realm-amber)]" />
                  <span>Portal: Expeditions</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Works Section (Skeletal baseline connecting to Phase 2/3 DB) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--realm-text-primary)]">
              {tp("featured")}
            </h2>
            <p className="text-sm text-[var(--realm-text-secondary)] mt-1">
              {tp("subtitle")}
            </p>
          </div>
          <Link href="/projects">
            <Button variant="ghost" size="sm" className="gap-1 font-mono text-xs">
              <span>{tc("viewAll")}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="group hover:border-[var(--realm-amber)] transition-all duration-300">
              <div className="h-44 bg-[var(--realm-bg-surface)] border-b border-[var(--realm-border)] relative flex items-center justify-center p-4">
                <div className="flex items-center gap-2 font-mono text-xs text-[var(--realm-text-muted)]">
                  <Terminal className="h-4 w-4 text-[var(--realm-amber)]" />
                  <span>PROJECT ARTEFACT #{item}</span>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant="moss">VERIFIED</Badge>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-[10px] font-mono">
                    FULLSTACK
                  </Badge>
                </div>
                <CardTitle className="text-base group-hover:text-[var(--realm-amber)] transition-colors">
                  System Architecture Engine 0{item}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  High-throughput distributed service architecture featuring real-time stream processing, event sourcing, and resilient persistence.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="default" className="text-[10px]">TypeScript</Badge>
                  <Badge variant="default" className="text-[10px]">Next.js</Badge>
                  <Badge variant="default" className="text-[10px]">PostgreSQL</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
