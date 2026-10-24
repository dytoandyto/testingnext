import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Terminal, CheckCircle2 } from "lucide-react";
import { GithubIcon } from "@/components/icons/BrandIcons";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Projects");
  const tc = await getTranslations("Common");

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
      {/* Return navigation */}
      <div>
        <Link href="/projects">
          <Button variant="ghost" size="sm" className="gap-2 font-mono text-xs">
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Workshop Index</span>
          </Button>
        </Link>
      </div>

      {/* Hero Banner */}
      <div className="space-y-6 border-b border-[var(--realm-border)] pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="amber">FULLSTACK ARTEFACT</Badge>
          <span className="font-mono text-xs text-[var(--realm-text-muted)]">SLUG: {slug}</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-[var(--realm-text-primary)] capitalize sm:text-5xl">
          {slug.replace(/-/g, " ")}
        </h1>

        <p className="max-w-3xl text-base leading-relaxed text-[var(--realm-text-secondary)] sm:text-lg">
          An in-depth case study exploring the design, architectural tradeoffs, implementation
          strategies, and production performance metrics.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Button variant="primary" size="default" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            <span>{tc("liveDemo")}</span>
          </Button>
          <Button variant="secondary" size="default" className="gap-2">
            <GithubIcon className="h-4 w-4" />
            <span>{tc("sourceCode")}</span>
          </Button>
        </div>
      </div>

      {/* Case Study Details */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="space-y-8 md:col-span-2">
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-[var(--realm-text-primary)]">
              <Terminal className="h-5 w-5 text-[var(--realm-amber)]" />
              <span>{t("caseStudy")}</span>
            </h2>
            <div className="space-y-4 rounded-xl border border-[var(--realm-border)] bg-[var(--realm-bg-card)] p-6 text-sm leading-relaxed text-[var(--realm-text-secondary)]">
              <p>
                The primary challenge of this project centered on combining high visual fidelity
                with strict performance benchmarks. By leveraging Next.js Server Components, static
                generation where appropriate, and isolated client boundaries for WebGL, zero initial
                render overhead was achieved.
              </p>
              <p>
                All data mutations, translation cascades, and content versioning are strictly
                enforced server-side, preventing state leakage and providing resilient recovery
                workflows.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-[var(--realm-text-primary)]">
              <CheckCircle2 className="h-5 w-5 text-[var(--realm-moss-bright)]" />
              <span>{t("keyFeatures")}</span>
            </h2>
            <ul className="grid grid-cols-1 gap-3">
              {[
                "Zero layout shift via self-hosted modern typography",
                "Strict typed translation schema ensuring 100% bilingual parity",
                "Server-verified Cloudinary signed uploads with MIME validation",
                "Instant rollback mechanism powered by JSON snapshot revisions",
              ].map((feature, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] p-3 text-xs text-[var(--realm-text-primary)]"
                >
                  <span className="font-mono text-[var(--realm-amber)]">0{i + 1}.</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Sidebar Specifications */}
        <div className="space-y-6">
          <div className="space-y-4 rounded-xl border border-[var(--realm-border)] bg-[var(--realm-bg-card)] p-6 shadow-sm">
            <h3 className="font-mono text-xs tracking-wider text-[var(--realm-amber)] uppercase">
              {t("technologies")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Next.js",
                "React 19",
                "TypeScript",
                "Three.js",
                "Neon PostgreSQL",
                "Prisma",
                "Tailwind CSS v4",
              ].map((tech) => (
                <Badge key={tech} variant="default" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-[var(--realm-border)] bg-[var(--realm-bg-card)] p-6 shadow-sm">
            <h3 className="font-mono text-xs tracking-wider text-[var(--realm-amber)] uppercase">
              {t("metrics")}
            </h3>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-[var(--realm-border)]/50 py-1">
                <span className="text-[var(--realm-text-muted)]">CORE WEB VITALS:</span>
                <span className="font-bold text-[var(--realm-moss-bright)]">100 / 100</span>
              </div>
              <div className="flex justify-between border-b border-[var(--realm-border)]/50 py-1">
                <span className="text-[var(--realm-text-muted)]">LIGHTHOUSE A11Y:</span>
                <span className="font-bold text-[var(--realm-moss-bright)]">100%</span>
              </div>
              <div className="flex justify-between border-b border-[var(--realm-border)]/50 py-1">
                <span className="text-[var(--realm-text-muted)]">LOCALIZATION:</span>
                <span className="font-bold text-[var(--realm-amber)]">EN & ID</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
