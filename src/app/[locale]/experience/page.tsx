import { setRequestLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Layers, Calendar, MapPin, Building2, CheckCircle2 } from "lucide-react";
import { getPublicExperiences, generatePublicMetadata } from "@/services/public-queries";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("Experience");

  return generatePublicMetadata({
    locale,
    path: "/experience",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function ExperiencePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Experience");
  const experiences = await getPublicExperiences(locale);

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-4 border-b border-[var(--realm-border)] pb-8">
        <Badge variant="amber" className="gap-1.5">
          <Layers className="h-3.5 w-3.5" />
          <span>PORTAL: EXPEDITIONS</span>
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--realm-text-primary)] sm:text-4xl font-serif">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-base text-[var(--realm-text-secondary)]">{t("subtitle")}</p>
      </div>

      {/* Timeline */}
      {experiences.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--realm-border)] bg-[var(--realm-bg-card)] p-12 text-center max-w-xl mx-auto">
          <Layers className="mx-auto h-10 w-10 text-[var(--realm-amber)] opacity-60 mb-3" />
          <h3 className="font-serif text-lg text-[var(--realm-text-primary)]">
            Expedition Ledger Empty
          </h3>
          <p className="mt-1 text-xs text-[var(--realm-text-muted)] leading-relaxed">
            No professional epochs or career milestones published yet. Record verifiable positions through the Sanctuary CMS to chronicle them here.
          </p>
        </div>
      ) : (
        <div className="relative ml-4 space-y-10 border-l border-[var(--realm-border-light)] pl-6 sm:ml-8 sm:pl-10">
          {experiences.map((event) => {
            const startStr = new Date(event.startDate).toLocaleDateString(undefined, {
              month: "short",
              year: "numeric",
            });
            const endStr = event.isCurrent
              ? t("present")
              : event.endDate
              ? new Date(event.endDate).toLocaleDateString(undefined, {
                  month: "short",
                  year: "numeric",
                })
              : "";

            return (
              <div key={event.id} className="group relative">
                {/* Timeline Rune Node */}
                <div className="absolute top-1.5 -left-[31px] flex h-7 w-7 items-center justify-center rounded-full border border-[var(--realm-border)] bg-[var(--realm-bg-card)] transition-colors group-hover:border-[var(--realm-amber)] sm:-left-[47px]">
                  <span className="h-2 w-2 rounded-full bg-[var(--realm-amber)]" />
                </div>

                <Card className="transition-colors group-hover:border-[var(--realm-border-light)]">
                  <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge variant="amber" className="font-mono text-xs">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {startStr} — {endStr}
                        </span>
                      </Badge>
                      <div className="flex items-center gap-3 font-mono text-xs text-[var(--realm-text-muted)]">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          <span>{event.organization}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <CardTitle className="text-lg text-[var(--realm-text-primary)] font-serif">
                        {event.role}
                      </CardTitle>
                      {event.isFallbackLocale && (
                        <span className="font-mono text-[9px] text-[var(--realm-text-muted)]">
                          [EN]
                        </span>
                      )}
                    </div>
                    <CardDescription className="mt-1 text-sm leading-relaxed">
                      {event.description}
                    </CardDescription>
                  </CardHeader>

                  {event.highlights.length > 0 && (
                    <CardContent className="space-y-4 pt-0">
                      <div className="space-y-2">
                        <h4 className="font-mono text-xs tracking-wider text-[var(--realm-amber)] uppercase">
                          Key Outcomes & Milestones
                        </h4>
                        <ul className="space-y-1.5">
                          {event.highlights.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-xs text-[var(--realm-text-secondary)]"
                            >
                              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--realm-moss-bright)]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
