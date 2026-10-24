# Component Conventions & Architectural Guidelines

**Project:** Interactive 3D Indie Portfolio CMS  
**Standards:** Next.js Server Components by Default • TypeScript Strict • Accessible Primitives

---

## 1. Server vs. Client Component Boundaries

1. **Server Components Default:**
   - Every page (`page.tsx`) and layout (`layout.tsx`) is an async Server Component.
   - Database queries, `next-intl` translation lookups, and metadata extraction run exclusively on the server.
   - Zero React client JavaScript is bundled for static portfolio content.
2. **Client Components (`'use client'`):**
   - Strictly reserved for interactive nodes:
     - 3D Canvas diorama (`next/dynamic` with `ssr: false`).
     - Form inputs with controlled state (`LocaleSwitcher`, contact form, CMS inputs).
     - Modals and dialogs requiring DOM event listeners (`Dialog`).
     - Global error boundaries (`error.tsx`).

---

## 2. Component Structure Pattern

All UI components adhere to the accessible shadcn/ui pattern:

1. Built with `class-variance-authority` (`cva`) for deterministic variant resolution.
2. Utilizes `cn` (`clsx` + `tailwind-merge`) for safe prop class merging.
3. Uses `React.forwardRef` to maintain standard DOM reference forwarding.
4. Uses TypeScript interfaces/types extending native HTML attributes.

Example:

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("...", { ... });

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  )
);
Button.displayName = "Button";
```

---

## 3. Accessibility & Keyboard Navigation (WCAG 2.1 AA)

- **Semantic HTML:** Never use `div` for interactive buttons or links.
- **Focus Indicators:** All interactive elements must exhibit high-contrast focus rings: `focus-visible:ring-2 focus-visible:ring-[var(--realm-amber)]`.
- **Screen Reader Labels:** Icon-only buttons must supply `aria-label` and `title`.
- **Keyboard Trapping:** Modal dialogs trap focus and close on `Escape`.

---

## 4. External Component Adaptation Rules

When integrating components from React Bits, Animate UI, or 21st.dev:

1. Review license (MIT / Apache 2.0 required).
2. Strip out foreign CSS frameworks; re-map styles to `--realm-*` design tokens.
3. Convert animation logic to `motion` (Motion for React) without installing legacy or duplicate animation packages.
4. Verify server/client component requirements.
5. Record source and license in project documentation.

---

## 5. Non-Negotiable Data Rules

- **Zero Fabricated Content:** Never populate pages with fake biography details, invented work histories, or bogus client references. Use neutral, explicitly identified demonstration records (`[DEMONSTRATION PLACEHOLDER]`).
- **Database Single Source of Truth:** All editable portfolio copy and visual settings reside in PostgreSQL via Prisma.
