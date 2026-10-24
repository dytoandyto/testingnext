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
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
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
          <span className="text-xs font-mono text-[var(--realm-text-muted)]">
            SLUG: {slug}
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl text-[var(--realm-text-primary)] capitalize">
          {slug.replace(/-/g, " ")}
        </h1>

        <p className="text-base sm:text-lg text-[var(--realm-text-secondary)] leading-relaxed max-w-3xl">
          An in-depth case study exploring the design, architectural tradeoffs, implementation strategies, and production performance metrics.
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--realm-text-primary)] flex items-center gap-2">
              <Terminal className="h-5 w-5 text-[var(--realm-amber)]" />
              <span>{t("caseStudy")}</span>
            </h2>
            <div className="rounded-xl border border-[var(--realm-border)] bg-[var(--realm-bg-card)] p-6 space-y-4 text-sm text-[var(--realm-text-secondary)] leading-relaxed">
              <p>
                The primary challenge of this project centered on combining high visual fidelity with strict performance benchmarks. By leveraging Next.js Server Components, static generation where appropriate, and isolated client boundaries for WebGL, zero initial render overhead was achieved.
              </p>
              <p>
                All data mutations, translation cascades, and content versioning are strictly enforced server-side, preventing state leakage and providing resilient recovery workflows.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--realm-text-primary)] flex items-center gap-2">
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
                  <span className="text-[var(--realm-amber)] font-mono">0{i + 1}.</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Sidebar Specifications */}
        <div className="space-y-6">
          <div className="rounded-xl border border-[var(--realm-border)] bg-[var(--realm-bg-card)] p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--realm-amber)]">
              {t("technologies")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Next.js", "React 19", "TypeScript", "Three.js", "Neon PostgreSQL", "Prisma", "Tailwind CSS v4"].map((tech) => (
                <Badge key={tech} variant="default" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[var(--realm-border)] bg-[var(--realm-bg-card)] p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--realm-amber)]">
              {t("metrics")}
            </h3>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-[var(--realm-border)]/50">
                <span className="text-[var(--realm-text-muted)]">CORE WEB VITALS:</span>
                <span className="text-[var(--realm-moss-bright)] font-bold">100 / 100</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--realm-border)]/50">
                <span className="text-[var(--realm-text-muted)]">LIGHTHOUSE A11Y:</span>
                <span className="text-[var(--realm-moss-bright)] font-bold">100%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--realm-border)]/50">
                <span className="text-[var(--realm-text-muted)]">LOCALIZATION:</span>
                <span className="text-[var(--realm-amber)] font-bold">EN & ID</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
