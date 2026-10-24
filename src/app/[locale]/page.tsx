import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Compass,
  Boxes,
  ArrowRight,
  Terminal,
} from "lucide-react";
import {
  getPublicSiteSettings,
  getPublicWorldScene,
  getPublicFeaturedProjects,
  generatePublicMetadata,
} from "@/services/public-queries";
import { WorldSceneContainer } from "@/components/world/WorldSceneContainer";

export const revalidate = 60; // ISR cache profile with on-demand invalidation

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const settings = await getPublicSiteSettings();

  return generatePublicMetadata({
    locale,
    path: "/",
    title: settings.siteTitle,
    description: settings.metaDescription,
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Hero");
  const tp = await getTranslations("Projects");
  const tc = await getTranslations("Common");

  const [siteSettings, worldScene, featuredProjects] = await Promise.all([
    getPublicSiteSettings(),
    getPublicWorldScene(locale),
    getPublicFeaturedProjects(locale),
  ]);

  return (
    <div className="space-y-16 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] p-8 shadow-2xl sm:p-12 lg:p-16">
          {/* Subtle Ambient Background Lighting */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[var(--realm-amber)]/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-[var(--realm-moss)]/15 blur-3xl" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="flex items-center gap-2">
              <Badge variant="amber">
                <Sparkles className="h-3 w-3" />
                <span>{t("greeting")}</span>
              </Badge>
              <span className="font-mono text-xs text-[var(--realm-text-muted)]">
                [SECTOR: 01 // INDIE DIORAMA]
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[var(--realm-text-primary)] sm:text-5xl lg:text-6xl font-serif">
              {siteSettings.siteTitle || t("role")}
            </h1>

            <p className="font-sans text-base leading-relaxed text-[var(--realm-text-secondary)] sm:text-lg">
              {siteSettings.metaDescription || t("description")}
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

      {/* 3D World Gateway & Interactive Archipelago Diorama */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <WorldSceneContainer
          sceneName={worldScene?.name || "Astral Archipelago"}
          fogColor={worldScene?.fogColor}
          fogDensity={worldScene?.fogDensity}
          sunLightIntensity={worldScene?.sunLightIntensity}
          ambientLightIntensity={worldScene?.ambientLightIntensity}
          sunLightColor={worldScene?.sunLightColor}
          ambientLightColor={worldScene?.ambientLightColor}
          portals={worldScene?.portals}
        />
      </section>

      {/* Featured Works Section (Connected to Real Published Database Records) */}
      <section className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--realm-text-primary)] font-serif">
              {tp("featured")}
            </h2>
            <p className="mt-1 text-sm text-[var(--realm-text-secondary)]">{tp("subtitle")}</p>
          </div>
          <Link href="/projects">
            <Button variant="ghost" size="sm" className="gap-1 font-mono text-xs">
              <span>{tc("viewAll")}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {featuredProjects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--realm-border)] bg-[var(--realm-bg-card)] p-12 text-center">
            <Boxes className="mx-auto h-8 w-8 text-[var(--realm-amber)] opacity-60 mb-3" />
            <p className="font-mono text-sm text-[var(--realm-text-primary)]">
              No featured creations published yet.
            </p>
            <p className="mt-1 text-xs text-[var(--realm-text-muted)]">
              Author and publish project case studies through the Sanctuary CMS to display them here.
            </p>
            <div className="mt-4">
              <Link href="/projects">
                <Button variant="secondary" size="sm" className="font-mono text-xs">
                  Browse All Workshop Catalog
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {featuredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group block"
              >
                <Card className="flex h-full flex-col transition-all duration-300 hover:border-[var(--realm-amber)]">
                  {/* Media Preview or Fallback Icon */}
                  <div className="relative flex h-48 items-center justify-center border-b border-[var(--realm-border)] bg-[var(--realm-bg-surface)] overflow-hidden">
                    {project.media.length > 0 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={project.media[0].url}
                        alt={project.media[0].altText || project.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 font-mono text-xs text-[var(--realm-text-muted)]">
                        <Terminal className="h-8 w-8 text-[var(--realm-amber)] transition-transform group-hover:scale-110" />
                        <span>/{project.slug}</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge variant="moss">FEATURED</Badge>
                    </div>
                  </div>

                  <CardHeader className="flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[var(--realm-amber)]">
                        /{project.slug}
                      </span>
                      {project.isFallbackLocale && (
                        <span className="font-mono text-[9px] text-[var(--realm-text-muted)]">
                          [EN]
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-base transition-colors group-hover:text-[var(--realm-amber)] font-serif">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {project.summary}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="default" className="text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 font-mono text-xs font-semibold text-[var(--realm-amber)] transition-transform group-hover:translate-x-1">
                      <span>{tc("viewProject")}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
