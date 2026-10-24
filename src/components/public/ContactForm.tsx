"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export function ContactForm({
  nameLabel,
  emailLabel,
  messageLabel,
  sendButton,
}: {
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  sendButton: string;
}) {
  const [isSent, setIsSent] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async (_data: ContactFormData) => {
    setIsSubmitting(true);
    // Simulate deterministic network dispatch
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSent(true);
    reset();
  };

  if (isSent) {
    return (
      <div className="rounded-xl border border-[var(--realm-moss)]/40 bg-[var(--realm-moss)]/10 p-6 text-center space-y-3">
        <CheckCircle2 className="mx-auto h-8 w-8 text-[var(--realm-moss-bright)]" />
        <h3 className="font-serif text-base text-[var(--realm-text-primary)]">
          Transmission Received by Sanctuary Beacon
        </h3>
        <p className="text-xs text-[var(--realm-text-secondary)] max-w-sm mx-auto leading-relaxed">
          Your inquiry has been successfully dispatched to the architect ledger. Thank you for reaching out across the ethereal frequencies.
        </p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsSent(false)}
          className="font-mono text-xs mt-2"
        >
          Send Another Transmission
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <label
          htmlFor="contact-name"
          className="font-mono text-xs tracking-wider text-[var(--realm-text-secondary)] uppercase block"
        >
          {nameLabel}
        </label>
        <Input
          id="contact-name"
          {...register("name", { required: "Name is required" })}
          placeholder="e.g. Commander Ada Lovelace"
          className="text-xs"
        />
        {errors.name && (
          <p className="text-[11px] text-[var(--realm-clay)]">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="contact-email"
          className="font-mono text-xs tracking-wider text-[var(--realm-text-secondary)] uppercase block"
        >
          {emailLabel}
        </label>
        <Input
          id="contact-email"
          type="email"
          {...register("email", { required: "Email is required" })}
          placeholder="ada@analytical-engine.io"
          className="text-xs font-mono"
        />
        {errors.email && (
          <p className="text-[11px] text-[var(--realm-clay)]">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="contact-message"
          className="font-mono text-xs tracking-wider text-[var(--realm-text-secondary)] uppercase block"
        >
          {messageLabel}
        </label>
        <Textarea
          id="contact-message"
          {...register("message", { required: "Message is required" })}
          placeholder="Describe your expedition, technical requirements, or collaboration vision..."
          rows={5}
          className="text-xs leading-relaxed"
        />
        {errors.message && (
          <p className="text-[11px] text-[var(--realm-clay)]">{errors.message.message}</p>
        )}
      </div>

      <Button
        variant="primary"
        size="lg"
        type="submit"
        disabled={isSubmitting}
        className="mt-2 w-full gap-2 font-mono text-xs shadow-md"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Transmitting Signal...</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span>{sendButton}</span>
          </>
        )}
      </Button>
    </form>
  );
}
