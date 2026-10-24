import { setRequestLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Layers, Calendar, MapPin, Building2, CheckCircle2 } from "lucide-react";

export default async function ExperiencePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Experience");

  const timelineEvents = [
    {
      period: `2024 — ${t("present")}`,
      role: "Lead Software & Systems Architect",
      organization: "Indie Interactive Systems Lab",
      location: "Remote / Global",
      description:
        "Directed the architectural design and full-stack development of real-time web applications, 3D interactive diorama experiences, and high-performance serverless backends.",
      achievements: [
        "Architected Next.js 15 App Router applications supporting multi-locale workflows and zero layout shifts",
        "Pioneered integration of React Three Fiber 3D interactive portals with accessible 2D fallbacks",
        "Established automated database migration and revision recovery pipelines on PostgreSQL",
      ],
      technologies: ["Next.js", "TypeScript", "Three.js", "Prisma", "PostgreSQL", "Tailwind CSS"],
    },
    {
      period: "2022 — 2024",
      role: "Senior Full-Stack Engineer",
      organization: "Digital Vanguard Studios",
      location: "Hybrid",
      description:
        "Engineered scalable cloud web platforms, internal content management tooling, and mission-critical APIs.",
      achievements: [
        "Reduced page load latency by 45% through aggressive SSR streaming and asset pipeline optimization",
        "Maintained 99.98% uptime on distributed services handling millions of monthly requests",
      ],
      technologies: ["React", "Node.js", "Docker", "Redis", "PostgreSQL"],
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-4 border-b border-[var(--realm-border)] pb-8">
        <Badge variant="amber" className="gap-1.5">
          <Layers className="h-3.5 w-3.5" />
          <span>PORTAL: EXPEDITIONS</span>
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--realm-text-primary)] sm:text-4xl">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-base text-[var(--realm-text-secondary)]">{t("subtitle")}</p>
      </div>

      {/* Timeline */}
      <div className="relative ml-4 space-y-10 border-l border-[var(--realm-border-light)] pl-6 sm:ml-8 sm:pl-10">
        {timelineEvents.map((event, index) => (
          <div key={index} className="group relative">
            {/* Timeline Rune Node */}
            <div className="absolute top-1.5 -left-[31px] flex h-7 w-7 items-center justify-center rounded-full border border-[var(--realm-border)] bg-[var(--realm-bg-card)] transition-colors group-hover:border-[var(--realm-amber)] sm:-left-[47px]">
              <span className="h-2 w-2 rounded-full bg-[var(--realm-amber)]" />
            </div>

            <Card className="transition-colors group-hover:border-[var(--realm-border-light)]">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge variant="amber" className="font-mono text-xs">
                    <Calendar className="h-3 w-3" />
                    <span>{event.period}</span>
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

                <CardTitle className="mt-2 text-lg text-[var(--realm-text-primary)]">
                  {event.role}
                </CardTitle>
                <CardDescription className="mt-1 text-sm leading-relaxed">
                  {event.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                <div className="space-y-2">
                  <h4 className="font-mono text-xs tracking-wider text-[var(--realm-amber)] uppercase">
                    Key Outcomes & Impact
                  </h4>
                  <ul className="space-y-1.5">
                    {event.achievements.map((item, i) => (
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

                <div className="flex flex-wrap gap-1.5 border-t border-[var(--realm-border)]/50 pt-2">
                  {event.technologies.map((tech) => (
                    <Badge key={tech} variant="default" className="text-[10px]">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
