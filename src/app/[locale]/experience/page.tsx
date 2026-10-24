import { setRequestLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Layers, Calendar, MapPin, Building2, CheckCircle2 } from "lucide-react";

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
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
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="space-y-4 border-b border-[var(--realm-border)] pb-8">
        <Badge variant="amber" className="gap-1.5">
          <Layers className="h-3.5 w-3.5" />
          <span>PORTAL: EXPEDITIONS</span>
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-[var(--realm-text-primary)]">
          {t("title")}
        </h1>
        <p className="text-base text-[var(--realm-text-secondary)] max-w-2xl">
          {t("subtitle")}
        </p>
      </div>

      {/* Timeline */}
      <div className="relative border-l border-[var(--realm-border-light)] ml-4 sm:ml-8 space-y-10 pl-6 sm:pl-10">
        {timelineEvents.map((event, index) => (
          <div key={index} className="relative group">
            {/* Timeline Rune Node */}
            <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-[var(--realm-border)] bg-[var(--realm-bg-card)] group-hover:border-[var(--realm-amber)] transition-colors">
              <span className="h-2 w-2 rounded-full bg-[var(--realm-amber)]" />
            </div>

            <Card className="group-hover:border-[var(--realm-border-light)] transition-colors">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge variant="amber" className="font-mono text-xs">
                    <Calendar className="h-3 w-3" />
                    <span>{event.period}</span>
                  </Badge>
                  <div className="flex items-center gap-3 text-xs text-[var(--realm-text-muted)] font-mono">
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

                <CardTitle className="text-lg text-[var(--realm-text-primary)] mt-2">
                  {event.role}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed mt-1">
                  {event.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--realm-amber)]">
                    Key Outcomes & Impact
                  </h4>
                  <ul className="space-y-1.5">
                    {event.achievements.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-[var(--realm-text-secondary)]"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-[var(--realm-moss-bright)] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[var(--realm-border)]/50">
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
