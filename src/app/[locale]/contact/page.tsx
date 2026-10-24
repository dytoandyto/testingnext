import { setRequestLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Radio, Mail, MessageSquare, Send, ShieldCheck } from "lucide-react";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Contact");

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-4 border-b border-[var(--realm-border)] pb-8">
        <Badge variant="amber" className="gap-1.5">
          <Radio className="h-3.5 w-3.5" />
          <span>PORTAL: SIGNAL BEACON</span>
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--realm-text-primary)] sm:text-4xl">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-base text-[var(--realm-text-secondary)]">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Contact Form */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-4 w-4 text-[var(--realm-amber)]" />
                <span>Transmit Inhabitation Inquiry</span>
              </CardTitle>
              <CardDescription>
                All communications are recorded securely in the PostgreSQL ledger.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label className="font-mono text-xs tracking-wider text-[var(--realm-text-primary)] uppercase">
                    {t("nameLabel")}
                  </label>
                  <Input placeholder="E.g., Commander Ada Lovelace" required />
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-xs tracking-wider text-[var(--realm-text-primary)] uppercase">
                    {t("emailLabel")}
                  </label>
                  <Input type="email" placeholder="ada@analytical-engine.io" required />
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-xs tracking-wider text-[var(--realm-text-primary)] uppercase">
                    {t("messageLabel")}
                  </label>
                  <Textarea
                    placeholder="Describe your expedition, technical requirements, or collaboration vision..."
                    rows={5}
                    required
                  />
                </div>

                <Button variant="primary" size="lg" type="submit" className="mt-2 w-full gap-2">
                  <Send className="h-4 w-4" />
                  <span>{t("sendButton")}</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Channels Dossier */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-mono text-sm tracking-wider text-[var(--realm-amber)]">
                DIRECT FREQUENCIES
              </CardTitle>
              <CardDescription>Verified Channels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="flex items-center gap-3 rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] p-3">
                <Mail className="h-4 w-4 text-[var(--realm-amber)]" />
                <div>
                  <div className="font-semibold text-[var(--realm-text-primary)]">Direct Mail</div>
                  <div className="font-mono text-[var(--realm-text-muted)]">architect@realm.io</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] p-3">
                <ShieldCheck className="h-4 w-4 text-[var(--realm-moss-bright)]" />
                <div>
                  <div className="font-semibold text-[var(--realm-text-primary)]">
                    PGP Encrypted
                  </div>
                  <div className="font-mono text-[var(--realm-text-muted)]">
                    Fingerprint: 8F2A...E910
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
