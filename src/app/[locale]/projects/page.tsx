import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Boxes, ArrowRight, Terminal } from "lucide-react";
import { getPublicProjects, generatePublicMetadata } from "@/services/public-queries";
import { ShinyText } from "@/components/ui/shiny-text";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("Projects");

  return generatePublicMetadata({
    locale,
    path: "/projects",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Projects");
  const tc = await getTranslations("Common");

  const projects = await getPublicProjects(locale);

  return (
    <ScrollReveal className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-4 border-b border-[var(--realm-border)] pb-8">
        <Badge variant="amber" className="gap-1.5">
          <Boxes className="h-3.5 w-3.5" />
          <ShinyText>PORTAL: CREATIONS</ShinyText>
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--realm-text-primary)] sm:text-4xl font-serif">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-base text-[var(--realm-text-secondary)]">{t("subtitle")}</p>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--realm-border)] bg-[var(--realm-bg-card)] p-12 text-center max-w-xl mx-auto">
          <Boxes className="mx-auto h-10 w-10 text-[var(--realm-amber)] opacity-60 mb-3" />
          <h3 className="font-serif text-lg text-[var(--realm-text-primary)]">
            Workshop Catalog Empty
          </h3>
          <p className="mt-1 text-xs text-[var(--realm-text-muted)] leading-relaxed">
            No projects have been published to the realm yet. Manage and publish case studies through the Sanctuary CMS to showcase them here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {projects.map((project, idx) => (
            <ScrollReveal key={project.id} delay={idx * 0.08}>
              <Link
                href={`/projects/${project.slug}`}
                className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--realm-amber)] rounded-xl"
              >
                <SpotlightCard className="h-full">
                  <Card className="flex h-full flex-col border-0 bg-transparent shadow-none">
                    {/* Media Preview or Fallback */}
                    <div className="relative flex h-48 items-center justify-center border-b border-[var(--realm-border)] bg-[var(--realm-bg-surface)] overflow-hidden">
                      {project.media.length > 0 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={project.media[0].url}
                          alt={project.media[0].altText || project.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="space-y-2 text-center p-6">
                          <Terminal className="mx-auto h-8 w-8 text-[var(--realm-amber)] opacity-70 transition-all group-hover:scale-110 group-hover:opacity-100" />
                          <span className="block font-mono text-xs text-[var(--realm-text-muted)]">
                            /{project.slug}
                          </span>
                        </div>
                      )}

                      <div className="absolute top-3 right-3 flex items-center gap-1">
                        {project.featured && (
                          <Badge variant="amber" className="text-[10px]">
                            FEATURED
                          </Badge>
                        )}
                        {project.isFallbackLocale && (
                          <Badge variant="outline" className="text-[9px] font-mono bg-[var(--realm-bg-primary)]/80">
                            EN
                          </Badge>
                        )}
                      </div>
                    </div>

                    <CardHeader className="flex-1">
                      <div className="mb-1">
                        <span className="font-mono text-[10px] text-[var(--realm-amber)]">
                          /{project.slug}
                        </span>
                      </div>
                      <CardTitle className="text-lg transition-colors group-hover:text-[var(--realm-amber)] font-serif">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="mt-2 line-clamp-3 text-xs leading-relaxed">
                        {project.summary}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="mb-4 flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="default" className="text-[10px]">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 font-mono text-xs font-semibold text-[var(--realm-amber)] transition-transform group-hover:translate-x-1">
                        <span>{tc("viewProject")}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </CardContent>
                  </Card>
                </SpotlightCard>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      )}
    </ScrollReveal>
  );
}
