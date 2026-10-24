import { setRequestLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Scroll, Compass, Sparkles, Heart, Cpu } from "lucide-react";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("About");

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-4 border-b border-[var(--realm-border)] pb-8">
        <Badge variant="amber" className="gap-1.5">
          <Scroll className="h-3.5 w-3.5" />
          <span>PORTAL: CHRONICLE</span>
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--realm-text-primary)] sm:text-4xl">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-base text-[var(--realm-text-secondary)]">{t("subtitle")}</p>
      </div>

      {/* Biography & Philosophy */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <div className="space-y-4 rounded-xl border border-[var(--realm-border)] bg-[var(--realm-bg-card)] p-6 shadow-md sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-[var(--realm-text-primary)]">
              <Compass className="h-5 w-5 text-[var(--realm-amber)]" />
              <span>{t("biographyHeading")}</span>
            </h2>
            <div className="prose prose-invert space-y-4 font-sans text-sm leading-relaxed text-[var(--realm-text-secondary)]">
              <p>
                Software engineering is more than assembly; it is an expedition in constructing
                resilient, expressive, and human-centric systems.
              </p>
              <p>
                Bridging distributed cloud systems with atmospheric 3D computer graphics, this
                digital realm explores how deep architectural rigor can harmonize with handcrafted
                artistry.
              </p>
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-[var(--realm-border)] bg-[var(--realm-bg-card)] p-6 shadow-md sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-[var(--realm-text-primary)]">
              <Sparkles className="h-5 w-5 text-[var(--realm-amber)]" />
              <span>{t("principlesHeading")}</span>
            </h2>
            <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
              <div className="space-y-2 rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--realm-amber)]">
                  <Cpu className="h-4 w-4" />
                  <span>Robust Determinism</span>
                </div>
                <p className="text-xs text-[var(--realm-text-muted)]">
                  Resilient data schemas, verifiable type contracts, and zero-compromise security
                  defaults.
                </p>
              </div>
              <div className="space-y-2 rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--realm-moss-bright)]">
                  <Heart className="h-4 w-4" />
                  <span>Atmospheric Joy</span>
                </div>
                <p className="text-xs text-[var(--realm-text-muted)]">
                  Tactile feedback, handcrafted visual identity, and purposeful spatial
                  storytelling.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Dossier */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-mono text-sm tracking-wider text-[var(--realm-amber)]">
                ENGINEER DOSSIER
              </CardTitle>
              <CardDescription>Verified Sector Record</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-[var(--realm-border)]/50 py-1">
                <span className="text-[var(--realm-text-muted)]">DISCIPLINE:</span>
                <span className="text-[var(--realm-text-primary)]">Full-Stack Architect</span>
              </div>
              <div className="flex justify-between border-b border-[var(--realm-border)]/50 py-1">
                <span className="text-[var(--realm-text-muted)]">FOCUS:</span>
                <span className="text-[var(--realm-text-primary)]">Systems & 3D Web</span>
              </div>
              <div className="flex justify-between border-b border-[var(--realm-border)]/50 py-1">
                <span className="text-[var(--realm-text-muted)]">STACK:</span>
                <span className="text-[var(--realm-text-primary)]">Next.js • R3F • Neon</span>
              </div>
              <div className="flex justify-between border-b border-[var(--realm-border)]/50 py-1">
                <span className="text-[var(--realm-text-muted)]">STATUS:</span>
                <span className="text-[var(--realm-moss-bright)]">ONLINE & AVAILABLE</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
