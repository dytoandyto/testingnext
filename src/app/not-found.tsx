import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

export default function RootNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d131a] p-4 text-center text-[#f5f4f0]">
      <div className="max-w-md space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d99b38]/40 bg-[#182330] shadow-xl">
          <Compass className="h-8 w-8 text-[#d99b38]" />
        </div>
        <div className="space-y-2">
          <div className="font-mono text-xs tracking-widest text-[#d99b38] uppercase">
            [REALM 404]
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Destination Uncharted</h1>
          <p className="text-xs leading-relaxed text-[#a9bac7]">
            The path you followed does not correspond to any registered sector in this world.
          </p>
        </div>
        <Link href="/en">
          <Button variant="primary" className="gap-2">
            <span>Enter Global Realm</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
