"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SiteSettingsFormSchema, type SiteSettingsFormData } from "@/schemas";
import { updateSiteSettingsAction } from "@/actions/settings-actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Globe,
  Share2,
  Mail,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";

interface SettingsData {
  siteTitle: string;
  metaDescription: string;
  defaultLocale: string;
  contactEmail: string;
  githubUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
}

export function SettingsManager({ initialSettings }: { initialSettings: SettingsData }) {
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<SiteSettingsFormData>({
    resolver: zodResolver(SiteSettingsFormSchema) as any,
    defaultValues: {
      siteTitle: initialSettings.siteTitle,
      metaDescription: initialSettings.metaDescription,
      defaultLocale: initialSettings.defaultLocale as "en" | "id",
      contactEmail: initialSettings.contactEmail,
      githubUrl: initialSettings.githubUrl || "",
      linkedinUrl: initialSettings.linkedinUrl || "",
      twitterUrl: initialSettings.twitterUrl || "",
    },
  });

  const onSubmit = async (data: SiteSettingsFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      await updateSiteSettingsAction(data);
      setSuccessMessage("Global settings and SEO metadata committed successfully.");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setServerError(err.message || "Failed to save settings.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const metaDescLength = form.watch("metaDescription")?.length || 0;

  return (
    <div className="space-y-6 max-w-4xl">
      {successMessage && (
        <Alert variant="default" className="border-[var(--realm-moss)] bg-[var(--realm-moss)]/10 text-[var(--realm-moss-bright)]">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription className="font-mono text-xs">{successMessage}</AlertDescription>
        </Alert>
      )}

      {serverError && (
        <Alert variant="destructive">
          <AlertDescription className="text-xs">{serverError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* SEO & Meta Identity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-[var(--realm-amber)]" />
              <span>SEO & Metadata Identity</span>
            </CardTitle>
            <CardDescription>
              Public search engine titles, open-graph descriptions, and canonical defaults.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label required>Global Site Title</Label>
              <Input
                {...form.register("siteTitle")}
                placeholder="Indie Realm | Interactive 3D Portfolio CMS"
                className="text-xs"
              />
              {form.formState.errors.siteTitle && (
                <p className="text-[11px] text-[var(--realm-clay)]">
                  {form.formState.errors.siteTitle.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <Label required>SEO Meta Description</Label>
                <span className="font-mono text-[10px] text-[var(--realm-text-muted)]">
                  {metaDescLength}/160 characters (Recommended: 120-160)
                </span>
              </div>
              <Textarea
                {...form.register("metaDescription")}
                rows={3}
                placeholder="Search engine summary..."
                className="text-xs"
              />
              {form.formState.errors.metaDescription && (
                <p className="text-[11px] text-[var(--realm-clay)]">
                  {form.formState.errors.metaDescription.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label required>Default Public Locale</Label>
              <Select {...form.register("defaultLocale")} className="font-mono text-xs max-w-xs">
                <option value="en">English (en)</option>
                <option value="id">Indonesian (id)</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Public Contact & Dispatch */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="h-4 w-4 text-[var(--realm-amber)]" />
              <span>Contact Dispatch & Inquiries</span>
            </CardTitle>
            <CardDescription>
              Target address for public signal beacon contact submissions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label required>Public Contact Email</Label>
              <Input
                {...form.register("contactEmail")}
                placeholder="architect@realm.io"
                className="font-mono text-xs max-w-md"
              />
              {form.formState.errors.contactEmail && (
                <p className="text-[11px] text-[var(--realm-clay)]">
                  {form.formState.errors.contactEmail.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Social Channels */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Share2 className="h-4 w-4 text-[var(--realm-amber)]" />
              <span>Social Links & Profiles</span>
            </CardTitle>
            <CardDescription>
              Public profiles displayed in header HUD and footer navigation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>GitHub Profile URL</Label>
              <Input
                {...form.register("githubUrl")}
                placeholder="https://github.com/your-username"
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label>LinkedIn Profile URL</Label>
              <Input
                {...form.register("linkedinUrl")}
                placeholder="https://linkedin.com/in/your-profile"
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Twitter / X Profile URL</Label>
              <Input
                {...form.register("twitterUrl")}
                placeholder="https://x.com/your-handle"
                className="font-mono text-xs"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="gap-2 font-mono text-xs shadow-md"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Committing Settings...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Save All Site Settings</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
