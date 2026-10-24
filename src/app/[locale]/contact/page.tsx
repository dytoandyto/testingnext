import { setRequestLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Radio, Mail, MessageSquare, ShieldCheck, Share2 } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/icons/BrandIcons";
import { ContactForm } from "@/components/public/ContactForm";
import { getPublicSiteSettings, generatePublicMetadata } from "@/services/public-queries";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("Contact");

  return generatePublicMetadata({
    locale,
    path: "/contact",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Contact");
  const siteSettings = await getPublicSiteSettings();

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-4 border-b border-[var(--realm-border)] pb-8">
        <Badge variant="amber" className="gap-1.5">
          <Radio className="h-3.5 w-3.5" />
          <span>PORTAL: SIGNAL BEACON</span>
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--realm-text-primary)] sm:text-4xl font-serif">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-base text-[var(--realm-text-secondary)]">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Contact Form */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-serif">
                <MessageSquare className="h-4 w-4 text-[var(--realm-amber)]" />
                <span>Transmit Inhabitation Inquiry</span>
              </CardTitle>
              <CardDescription className="text-xs">
                All communications are recorded securely in the PostgreSQL ledger.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm
                nameLabel={t("nameLabel")}
                emailLabel={t("emailLabel")}
                messageLabel={t("messageLabel")}
                sendButton={t("sendButton")}
              />
            </CardContent>
          </Card>
        </div>

        {/* Channels Dossier */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-mono text-xs tracking-wider text-[var(--realm-amber)]">
                DIRECT FREQUENCIES
              </CardTitle>
              <CardDescription className="text-xs">
                Verified Inhabitation Channels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs font-mono">
              <div className="flex items-center gap-3 rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] p-3">
                <Mail className="h-4 w-4 text-[var(--realm-amber)]" />
                <div>
                  <div className="font-semibold text-[var(--realm-text-primary)]">Direct Mail</div>
                  <a
                    href={`mailto:${siteSettings.contactEmail}`}
                    className="text-[var(--realm-text-muted)] hover:text-[var(--realm-amber)] transition-colors"
                  >
                    {siteSettings.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] p-3">
                <ShieldCheck className="h-4 w-4 text-[var(--realm-moss-bright)]" />
                <div>
                  <div className="font-semibold text-[var(--realm-text-primary)]">PGP Verification</div>
                  <div className="text-[10px] text-[var(--realm-text-muted)]">Fingerprint: 8F2A...E910</div>
                </div>
              </div>

              {/* Connected Social Profiles from Database */}
              <div className="rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] p-3 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--realm-text-primary)]">
                  <Share2 className="h-3.5 w-3.5 text-[var(--realm-amber)]" />
                  <span>Verified Profiles</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  {siteSettings.githubUrl && (
                    <a
                      href={siteSettings.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-card)] text-[var(--realm-text-secondary)] hover:border-[var(--realm-amber)] hover:text-[var(--realm-amber)]"
                      title="GitHub"
                    >
                      <GithubIcon className="h-4 w-4" />
                    </a>
                  )}
                  {siteSettings.linkedinUrl && (
                    <a
                      href={siteSettings.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-card)] text-[var(--realm-text-secondary)] hover:border-[var(--realm-amber)] hover:text-[var(--realm-amber)]"
                      title="LinkedIn"
                    >
                      <LinkedinIcon className="h-4 w-4" />
                    </a>
                  )}
                  {siteSettings.twitterUrl && (
                    <a
                      href={siteSettings.twitterUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-card)] text-[var(--realm-text-secondary)] hover:border-[var(--realm-amber)] hover:text-[var(--realm-amber)]"
                      title="Twitter"
                    >
                      <TwitterIcon className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
