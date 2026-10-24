import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Boxes, ArrowRight, Terminal } from "lucide-react";

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Projects");
  const tc = await getTranslations("Common");

  // Demonstration projects for Phase 1 skeleton (connected to Neon Postgres in Phase 2/3)
  const demonstrationProjects = [
    {
      slug: "interactive-3d-indie-portfolio",
      title: "Interactive 3D Indie Portfolio CMS",
      summary:
        "A production-grade indie game diorama portfolio powered by Next.js 15, React Three Fiber, and a custom PostgreSQL CMS.",
      category: "Fullstack & 3D",
      tags: ["Next.js", "Three.js", "Prisma", "PostgreSQL"],
    },
    {
      slug: "event-driven-telemetry-engine",
      title: "Event-Driven Telemetry Engine",
      summary:
        "Distributed real-time analytics pipeline processing 25,000 events/sec with Apache Kafka and TimescaleDB.",
      category: "Distributed Systems",
      tags: ["TypeScript", "Kafka", "PostgreSQL", "Docker"],
    },
    {
      slug: "stylized-voxel-terrain-generator",
      title: "Stylized Voxel Terrain Generator",
      summary:
        "Procedural terrain synthesis algorithm utilizing Simplex noise fields and custom WebGL shaders.",
      category: "Computer Graphics",
      tags: ["WebGL", "Three.js", "GLSL", "Algorithms"],
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-4 border-b border-[var(--realm-border)] pb-8">
        <Badge variant="amber" className="gap-1.5">
          <Boxes className="h-3.5 w-3.5" />
          <span>PORTAL: CREATIONS</span>
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--realm-text-primary)] sm:text-4xl">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-base text-[var(--realm-text-secondary)]">{t("subtitle")}</p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {demonstrationProjects.map((project) => (
          <Link key={project.slug} href={`/projects/${project.slug}`} className="group block">
            <Card className="flex h-full flex-col transition-all duration-300 group-hover:border-[var(--realm-amber)]">
              <div className="relative flex h-48 items-center justify-center border-b border-[var(--realm-border)] bg-[var(--realm-bg-surface)] p-6">
                <div className="space-y-2 text-center">
                  <Terminal className="mx-auto h-8 w-8 text-[var(--realm-amber)] opacity-70 transition-all group-hover:scale-110 group-hover:opacity-100" />
                  <span className="block font-mono text-xs text-[var(--realm-text-muted)]">
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
                <CardTitle className="text-lg transition-colors group-hover:text-[var(--realm-amber)]">
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
    </div>
  );
}
