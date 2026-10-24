import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Terminal, Activity, FileImage } from "lucide-react";
import { GithubIcon } from "@/components/icons/BrandIcons";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ShinyText } from "@/components/ui/shiny-text";
import { getPublicProjectBySlug, generatePublicMetadata } from "@/services/public-queries";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = await getPublicProjectBySlug(slug, locale);

  if (!project) {
    return generatePublicMetadata({
      locale,
      path: `/projects/${slug}`,
      title: "Project Not Found",
      description: "The requested project case study could not be located.",
    });
  }

  return generatePublicMetadata({
    locale,
    path: `/projects/${slug}`,
    title: project.title,
    description: project.summary,
    ogImage: project.media[0]?.url,
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Projects");
  const tc = await getTranslations("Common");

  const project = await getPublicProjectBySlug(slug, locale);

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
      {/* Return Navigation */}
      <ScrollReveal direction="down" duration={0.3}>
        <div>
          <Link href="/projects">
            <Button variant="ghost" size="sm" className="gap-2 font-mono text-xs">
              <ArrowLeft className="h-4 w-4" />
              <span>Return to Workshop Index</span>
            </Button>
          </Link>
        </div>
      </ScrollReveal>

      {/* Hero Banner */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="space-y-6 border-b border-[var(--realm-border)] pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="amber">FULLSTACK ARTEFACT</Badge>
            <span className="font-mono text-xs text-[var(--realm-text-muted)]">
              SLUG: <ShinyText text={`/${project.slug}`} />
            </span>
            {project.isFallbackLocale && (
              <Badge variant="outline" className="font-mono text-[9px]">
                DEFAULT TRANSLATION [EN]
              </Badge>
            )}
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[var(--realm-text-primary)] sm:text-5xl font-serif">
            {project.title}
          </h1>

          <p className="max-w-3xl text-base leading-relaxed text-[var(--realm-text-secondary)] sm:text-lg">
            {project.summary}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer">
                <Button variant="primary" size="default" className="gap-2 font-mono text-xs">
                  <ExternalLink className="h-4 w-4" />
                  <span>{tc("liveDemo")}</span>
                </Button>
              </a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noreferrer">
                <Button variant="secondary" size="default" className="gap-2 font-mono text-xs">
                  <GithubIcon className="h-4 w-4" />
                  <span>{tc("sourceCode")}</span>
                </Button>
              </a>
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* Case Study & Media Gallery */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="space-y-8 md:col-span-2">
          {/* Deep-Dive Case Study */}
          <ScrollReveal direction="up" delay={0.15}>
            <section className="space-y-4">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-[var(--realm-text-primary)] font-serif">
                <Terminal className="h-5 w-5 text-[var(--realm-amber)]" />
                <span>{t("caseStudy")}</span>
              </h2>
              <SpotlightCard className="p-6 text-sm leading-relaxed text-[var(--realm-text-secondary)] space-y-4">
                {project.caseStudy.split("\n\n").map((para, i) => (
                  <p key={i} className="leading-relaxed">
                    {para}
                  </p>
                ))}
              </SpotlightCard>
            </section>
          </ScrollReveal>

          {/* Media Gallery (if attached) */}
          {project.media.length > 0 && (
            <ScrollReveal direction="up" delay={0.2}>
              <section className="space-y-4">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-[var(--realm-text-primary)] font-serif">
                  <FileImage className="h-5 w-5 text-[var(--realm-amber)]" />
                  <span>Visual Gallery & Artifacts</span>
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {project.media.map((item, idx) => (
                    <SpotlightCard key={idx} className="overflow-hidden p-0 border border-[var(--realm-border)]">
                      <div className="relative aspect-video bg-[var(--realm-bg-surface)] overflow-hidden">
                        {item.format === "mp4" || item.format === "webm" ? (
                          <video src={item.url} controls className="h-full w-full object-cover" />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.url}
                            alt={item.altText}
                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        )}
                      </div>
                      {item.altText && (
                        <div className="p-2.5 font-mono text-xs text-[var(--realm-text-muted)] border-t border-[var(--realm-border)]/50">
                          {item.altText}
                        </div>
                      )}
                    </SpotlightCard>
                  ))}
                </div>
              </section>
            </ScrollReveal>
          )}
        </div>

        {/* Sidebar Specifications */}
        <div className="space-y-6">
          {/* Tech Stack */}
          {project.tags.length > 0 && (
            <ScrollReveal direction="up" delay={0.25}>
              <SpotlightCard>
                <div className="p-6">
                  <h3 className="font-mono text-xs tracking-wider text-[var(--realm-amber)] uppercase mb-3">
                    {t("technologies")}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tech) => (
                      <Badge key={tech} variant="default" className="text-xs">
                        #{tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </SpotlightCard>
            </ScrollReveal>
          )}

          {/* Engineering Metrics */}
          {project.metrics.length > 0 && (
            <ScrollReveal direction="up" delay={0.3}>
              <SpotlightCard>
                <div className="p-6">
                  <h3 className="font-mono text-xs tracking-wider text-[var(--realm-amber)] uppercase flex items-center gap-2 mb-3">
                    <Activity className="h-3.5 w-3.5 text-[var(--realm-moss-bright)]" />
                    <span>{t("metrics")}</span>
                  </h3>
                  <div className="space-y-3 font-mono text-xs">
                    {project.metrics.map((m, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between border-b border-[var(--realm-border)]/50 py-1.5"
                      >
                        <span className="text-[var(--realm-text-muted)] uppercase">{m.label}:</span>
                        <span className="font-bold text-[var(--realm-moss-bright)]">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </SpotlightCard>
            </ScrollReveal>
          )}
        </div>
      </div>
    </div>
  );
}
