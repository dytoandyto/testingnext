import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Boxes, ArrowRight, Terminal } from "lucide-react";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Projects");
  const tc = await getTranslations("Common");

  // Demonstration projects for Phase 1 skeleton (connected to Neon Postgres in Phase 2/3)
  const demonstrationProjects = [
    {
      slug: "interactive-3d-indie-portfolio",
      title: "Interactive 3D Indie Portfolio CMS",
      summary: "A production-grade indie game diorama portfolio powered by Next.js 15, React Three Fiber, and a custom PostgreSQL CMS.",
      category: "Fullstack & 3D",
      tags: ["Next.js", "Three.js", "Prisma", "PostgreSQL"],
    },
    {
      slug: "event-driven-telemetry-engine",
      title: "Event-Driven Telemetry Engine",
      summary: "Distributed real-time analytics pipeline processing 25,000 events/sec with Apache Kafka and TimescaleDB.",
      category: "Distributed Systems",
      tags: ["TypeScript", "Kafka", "PostgreSQL", "Docker"],
    },
    {
      slug: "stylized-voxel-terrain-generator",
      title: "Stylized Voxel Terrain Generator",
      summary: "Procedural terrain synthesis algorithm utilizing Simplex noise fields and custom WebGL shaders.",
      category: "Computer Graphics",
      tags: ["WebGL", "Three.js", "GLSL", "Algorithms"],
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="space-y-4 border-b border-[var(--realm-border)] pb-8">
        <Badge variant="amber" className="gap-1.5">
          <Boxes className="h-3.5 w-3.5" />
          <span>PORTAL: CREATIONS</span>
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-[var(--realm-text-primary)]">
          {t("title")}
        </h1>
        <p className="text-base text-[var(--realm-text-secondary)] max-w-2xl">
          {t("subtitle")}
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {demonstrationProjects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="group block"
          >
            <Card className="h-full flex flex-col group-hover:border-[var(--realm-amber)] transition-all duration-300">
              <div className="h-48 bg-[var(--realm-bg-surface)] border-b border-[var(--realm-border)] relative flex items-center justify-center p-6">
                <div className="text-center space-y-2">
                  <Terminal className="h-8 w-8 text-[var(--realm-amber)] mx-auto opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                  <span className="font-mono text-xs text-[var(--realm-text-muted)] block">
                    SLUG: {project.slug}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant="moss" className="text-[10px]">
                    {project.category}
                  </Badge>
                </div>
              </div>
              <CardHeader className="flex-1">
                <CardTitle className="text-lg group-hover:text-[var(--realm-amber)] transition-colors">
                  {project.title}
                </CardTitle>
                <CardDescription className="line-clamp-3 text-xs leading-relaxed mt-2">
                  {project.summary}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="default" className="text-[10px]">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-xs font-mono text-[var(--realm-amber)] font-semibold group-hover:translate-x-1 transition-transform">
                  <span>{tc("viewProject")}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
