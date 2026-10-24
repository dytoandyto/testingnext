import { Button } from "@/components/ui/button";
import { Compass, MapPinOff } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function LocaleNotFound() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-24 text-center sm:px-6 lg:px-8">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--realm-amber)]/40 bg-[var(--realm-bg-card)] shadow-xl">
        <MapPinOff className="h-8 w-8 text-[var(--realm-amber)]" />
      </div>

      <div className="space-y-2">
        <div className="font-mono text-xs tracking-widest text-[var(--realm-amber)] uppercase">
          [COORDINATE ERROR: 404]
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--realm-text-primary)]">
          Realm Destination Not Found
        </h1>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-[var(--realm-text-secondary)]">
          This portal target has drifted beyond the charted boundaries of the astral map.
        </p>
      </div>

      <div className="pt-4">
        <Link href="/">
          <Button variant="primary" size="lg" className="gap-2">
            <Compass className="h-4 w-4" />
            <span>Return to Realm Coordinates</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
