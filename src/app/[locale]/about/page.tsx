import { setRequestLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Scroll, Compass, Sparkles, Heart, Cpu } from "lucide-react";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("About");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="space-y-4 border-b border-[var(--realm-border)] pb-8">
        <Badge variant="amber" className="gap-1.5">
          <Scroll className="h-3.5 w-3.5" />
          <span>PORTAL: CHRONICLE</span>
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-[var(--realm-text-primary)]">
          {t("title")}
        </h1>
        <p className="text-base text-[var(--realm-text-secondary)] max-w-2xl">
          {t("subtitle")}
        </p>
      </div>

      {/* Biography & Philosophy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border border-[var(--realm-border)] bg-[var(--realm-bg-card)] p-6 sm:p-8 space-y-4 shadow-md">
            <h2 className="text-xl font-semibold text-[var(--realm-text-primary)] flex items-center gap-2">
              <Compass className="h-5 w-5 text-[var(--realm-amber)]" />
              <span>{t("biographyHeading")}</span>
            </h2>
            <div className="prose prose-invert text-sm text-[var(--realm-text-secondary)] space-y-4 leading-relaxed font-sans">
              <p>
                Software engineering is more than assembly; it is an expedition in constructing resilient, expressive, and human-centric systems.
              </p>
              <p>
                Bridging distributed cloud systems with atmospheric 3D computer graphics, this digital realm explores how deep architectural rigor can harmonize with handcrafted artistry.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--realm-border)] bg-[var(--realm-bg-card)] p-6 sm:p-8 space-y-4 shadow-md">
            <h2 className="text-xl font-semibold text-[var(--realm-text-primary)] flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[var(--realm-amber)]" />
              <span>{t("principlesHeading")}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--realm-amber)]">
                  <Cpu className="h-4 w-4" />
                  <span>Robust Determinism</span>
                </div>
                <p className="text-xs text-[var(--realm-text-muted)]">
                  Resilient data schemas, verifiable type contracts, and zero-compromise security defaults.
                </p>
              </div>
              <div className="rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--realm-moss-bright)]">
                  <Heart className="h-4 w-4" />
                  <span>Atmospheric Joy</span>
                </div>
                <p className="text-xs text-[var(--realm-text-muted)]">
                  Tactile feedback, handcrafted visual identity, and purposeful spatial storytelling.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Dossier */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-mono tracking-wider text-[var(--realm-amber)]">
                ENGINEER DOSSIER
              </CardTitle>
              <CardDescription>Verified Sector Record</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-[var(--realm-border)]/50">
                <span className="text-[var(--realm-text-muted)]">DISCIPLINE:</span>
                <span className="text-[var(--realm-text-primary)]">Full-Stack Architect</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--realm-border)]/50">
                <span className="text-[var(--realm-text-muted)]">FOCUS:</span>
                <span className="text-[var(--realm-text-primary)]">Systems & 3D Web</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--realm-border)]/50">
                <span className="text-[var(--realm-text-muted)]">STACK:</span>
                <span className="text-[var(--realm-text-primary)]">Next.js • R3F • Neon</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--realm-border)]/50">
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
