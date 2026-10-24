import * as React from "react";
import { Link } from "@/i18n/routing";
import NextLink from "next/link";
import { getTranslations } from "next-intl/server";
import { Compass, Sparkles, Shield, Terminal } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/icons/BrandIcons";

export async function Footer() {
  const t = await getTranslations("Navigation");
  const tc = await getTranslations("Common");

  return (
    <footer className="mt-auto border-t border-[var(--realm-border)] bg-[var(--realm-bg-surface)] text-[var(--realm-text-secondary)] text-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & World Narrative */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--realm-bg-card)] border border-[var(--realm-border)]">
                <Compass className="h-4 w-4 text-[var(--realm-amber)]" />
              </div>
              <span className="font-semibold text-base tracking-wider text-[var(--realm-text-primary)]">
                INDIE REALM DIORAMA
              </span>
            </div>
            <p className="text-xs text-[var(--realm-text-muted)] max-w-md leading-relaxed">
              A production-oriented personal portfolio crafted as an interactive 3D indie game world. Engineered with Next.js App Router, React Three Fiber, Neon PostgreSQL, and a tailored CMS data layer.
            </p>
            <div className="flex items-center gap-3 text-xs font-mono text-[var(--realm-text-muted)]">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-[var(--realm-border)] bg-[var(--realm-bg-card)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--realm-moss-bright)] animate-pulse" />
                REALM SECTOR: ASTRA-01
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-[var(--realm-border)] bg-[var(--realm-bg-card)]">
                <Terminal className="h-3 w-3 text-[var(--realm-amber)]" />
                VER: 1.0.0-PROD
              </span>
            </div>
          </div>

          {/* Expeditions Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--realm-text-primary)]">
              Expedition Routes
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/projects" className="hover:text-[var(--realm-amber)] transition-colors">
                  {t("projects")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[var(--realm-amber)] transition-colors">
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link href="/experience" className="hover:text-[var(--realm-amber)] transition-colors">
                  {t("experience")}
                </Link>
              </li>
              <li>
                <Link href="/skills" className="hover:text-[var(--realm-amber)] transition-colors">
                  {t("skills")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[var(--realm-amber)] transition-colors">
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Channels & Admin */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--realm-text-primary)]">
              Ethereal Frequencies
            </h4>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-card)] text-[var(--realm-text-secondary)] hover:border-[var(--realm-amber)] hover:text-[var(--realm-amber)] transition-colors"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-card)] text-[var(--realm-text-secondary)] hover:border-[var(--realm-amber)] hover:text-[var(--realm-amber)] transition-colors"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-card)] text-[var(--realm-text-secondary)] hover:border-[var(--realm-amber)] hover:text-[var(--realm-amber)] transition-colors"
                aria-label="Twitter Profile"
              >
                <TwitterIcon className="h-4 w-4" />
              </a>
              <NextLink
                href="/admin"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-card)] text-[var(--realm-text-secondary)] hover:border-[var(--realm-amber)] hover:text-[var(--realm-amber)] transition-colors"
                aria-label="Admin Sanctuary"
                title="Admin Sanctuary"
              >
                <Shield className="h-4 w-4" />
              </NextLink>
            </div>
            <p className="text-xs text-[var(--realm-text-muted)] font-mono">
              Coordinates: Lat 07° S / Long 110° E
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-[var(--realm-border)]/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--realm-text-muted)]">
          <p>© {new Date().getFullYear()} {tc("allRightsReserved")}</p>
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[var(--realm-amber)]" />
            <span>Accessible 2D & Interactive 3D</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
