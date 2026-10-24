import { setRequestLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Scroll, Compass, Sparkles, Heart, Cpu } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/icons/BrandIcons";
import { getPublicSiteSettings, generatePublicMetadata } from "@/services/public-queries";
import { ShinyText } from "@/components/ui/shiny-text";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("About");

  return generatePublicMetadata({
    locale,
    path: "/about",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("About");
  const siteSettings = await getPublicSiteSettings();

  return (
    <ScrollReveal className="mx-auto max-w-5xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-4 border-b border-[var(--realm-border)] pb-8">
        <Badge variant="amber" className="gap-1.5">
          <Scroll className="h-3.5 w-3.5" />
          <ShinyText>PORTAL: CHRONICLE</ShinyText>
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--realm-text-primary)] sm:text-4xl font-serif">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-base text-[var(--realm-text-secondary)]">{t("subtitle")}</p>
      </div>

      {/* Biography & Philosophy */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <SpotlightCard className="p-6 sm:p-8 space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-[var(--realm-text-primary)] font-serif">
              <Compass className="h-5 w-5 text-[var(--realm-amber)]" />
              <span>{t("biographyHeading")}</span>
            </h2>
            <div className="prose prose-invert space-y-4 font-sans text-sm leading-relaxed text-[var(--realm-text-secondary)]">
              <p>
                Software engineering is an expedition in constructing resilient, expressive, and human-centric systems.
              </p>
              <p>
                Bridging distributed cloud architectures with atmospheric 3D spatial web environments, this digital realm explores how deep engineering rigor harmonizes with handcrafted aesthetic craft.
              </p>
              <p>
                Every module, data model, and interactive portal is backed by strict type safety, zero fabricated claims, and deterministic database persistence.
              </p>
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-6 sm:p-8 space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-[var(--realm-text-primary)] font-serif">
              <Sparkles className="h-5 w-5 text-[var(--realm-amber)]" />
              <span>{t("principlesHeading")}</span>
            </h2>
            <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
              <div className="space-y-2 rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--realm-amber)] font-mono">
                  <Cpu className="h-4 w-4" />
                  <span>Deterministic Rigor</span>
                </div>
                <p className="text-xs text-[var(--realm-text-muted)] leading-relaxed">
                  Normalized database schemas, verifiable type contracts, and zero-compromise security defaults.
                </p>
              </div>

              <div className="space-y-2 rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--realm-moss-bright)] font-mono">
                  <Heart className="h-4 w-4" />
                  <span>Atmospheric Delight</span>
                </div>
                <p className="text-xs text-[var(--realm-text-muted)] leading-relaxed">
                  Tactile feedback, handcrafted visual tokens, and purposeful spatial storytelling.
                </p>
              </div>
            </div>
          </SpotlightCard>
        </div>

        {/* Sidebar Dossier */}
        <div className="space-y-6">
          <SpotlightCard>
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle className="font-mono text-xs tracking-wider text-[var(--realm-amber)]">
                  <ShinyText>VERIFIED ARCHITECT DOSSIER</ShinyText>
                </CardTitle>
                <CardDescription className="text-xs">
                  Live Configuration Record
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 font-mono text-xs">
                <div className="flex justify-between border-b border-[var(--realm-border)]/50 py-1.5">
                  <span className="text-[var(--realm-text-muted)]">DISCIPLINE:</span>
                  <span className="text-[var(--realm-text-primary)]">Full-Stack Architect</span>
                </div>
                <div className="flex justify-between border-b border-[var(--realm-border)]/50 py-1.5">
                  <span className="text-[var(--realm-text-muted)]">FOCUS:</span>
                  <span className="text-[var(--realm-text-primary)]">Systems & 3D Web</span>
                </div>
                <div className="flex justify-between border-b border-[var(--realm-border)]/50 py-1.5">
                  <span className="text-[var(--realm-text-muted)]">LOCALES:</span>
                  <span className="text-[var(--realm-amber)]">EN • ID PARITY</span>
                </div>
                <div className="flex justify-between border-b border-[var(--realm-border)]/50 py-1.5">
                  <span className="text-[var(--realm-text-muted)]">STATUS:</span>
                  <span className="text-[var(--realm-moss-bright)]">ONLINE & READY</span>
                </div>

                {/* Social Channels from Database */}
                <div className="pt-2 space-y-2">
                  <span className="text-[10px] text-[var(--realm-text-muted)] uppercase block">
                    Connected Frequencies
                  </span>
                  <div className="flex items-center gap-2">
                    {siteSettings.githubUrl && (
                      <a
                        href={siteSettings.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] text-[var(--realm-text-secondary)] hover:border-[var(--realm-amber)] hover:text-[var(--realm-amber)]"
                        title="GitHub"
                      >
                        <GithubIcon className="h-4 w-4" />
                      </a>
                    )}
                    {siteSettings.linkedinUrl && (
                      <a
                        href={siteSettings.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] text-[var(--realm-text-secondary)] hover:border-[var(--realm-amber)] hover:text-[var(--realm-amber)]"
                        title="LinkedIn"
                      >
                        <LinkedinIcon className="h-4 w-4" />
                      </a>
                    )}
                    {siteSettings.twitterUrl && (
                      <a
                        href={siteSettings.twitterUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] text-[var(--realm-text-secondary)] hover:border-[var(--realm-amber)] hover:text-[var(--realm-amber)]"
                        title="Twitter"
                      >
                        <TwitterIcon className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </SpotlightCard>
        </div>
      </div>
    </ScrollReveal>
  );
}
