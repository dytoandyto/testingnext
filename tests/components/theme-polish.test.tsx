import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import * as React from "react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ShinyText } from "@/components/ui/shiny-text";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { getPublicActiveTheme } from "@/services/public-queries";
import { db } from "@/lib/db";

// Mock motion/react for deterministic unit testing of animated wrappers
vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, className, style, ...props }: any) => (
      <div className={className} style={style} data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
  },
  useReducedMotion: () => false,
}));

vi.mock("@/lib/db", () => ({
  db: {
    themePreset: {
      findFirst: vi.fn(),
    },
  },
}));

describe("Phase 6 Visual Polish Components", () => {
  describe("SpotlightCard", () => {
    it("renders children content accurately", () => {
      render(
        <SpotlightCard>
          <div data-testid="card-content">Diorama Node</div>
        </SpotlightCard>
      );
      expect(screen.getByTestId("card-content")).toBeInTheDocument();
      expect(screen.getByText("Diorama Node")).toBeInTheDocument();
    });

    it("tracks mouse movement and updates spotlight coordinates", () => {
      const { container } = render(
        <SpotlightCard className="test-card">
          <span>Target Artefact</span>
        </SpotlightCard>
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toBeInTheDocument();

      // Mock getBoundingClientRect
      vi.spyOn(card, "getBoundingClientRect").mockReturnValue({
        left: 100,
        top: 50,
        right: 400,
        bottom: 250,
        width: 300,
        height: 200,
        x: 100,
        y: 50,
        toJSON: () => {},
      });

      // Fire mousemove
      fireEvent.mouseMove(card, { clientX: 250, clientY: 150 });

      expect(card.style.getPropertyValue("--spotlight-x")).toBe("150px");
      expect(card.style.getPropertyValue("--spotlight-y")).toBe("100px");
      expect(card.style.getPropertyValue("--spotlight-opacity")).toBe("1");

      // Fire mouseleave
      fireEvent.mouseLeave(card);
      expect(card.style.getPropertyValue("--spotlight-opacity")).toBe("0");
    });
  });

  describe("ShinyText", () => {
    it("renders provided text or children", () => {
      render(<ShinyText text="ARCHITECT ASTRAL" />);
      expect(screen.getByText("ARCHITECT ASTRAL")).toBeInTheDocument();
      expect(screen.getByText("ARCHITECT ASTRAL")).toHaveClass("shiny-text");
    });

    it("renders nested children properly", () => {
      render(
        <ShinyText>
          <span>SECTOR 01</span>
        </ShinyText>
      );
      expect(screen.getByText("SECTOR 01")).toBeInTheDocument();
    });
  });

  describe("ScrollReveal", () => {
    it("renders wrapped children without crashing", () => {
      render(
        <ScrollReveal>
          <p>Revealed Content</p>
        </ScrollReveal>
      );
      expect(screen.getByText("Revealed Content")).toBeInTheDocument();
      expect(screen.getByTestId("motion-div")).toBeInTheDocument();
    });
  });

  describe("Theme Persistence Engine", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("retrieves the active theme preset when available", async () => {
      const mockActive = {
        id: "theme-forest",
        name: "Forest Moss",
        active: true,
        bgPrimary: "#0f1712",
        bgSurface: "#16221b",
        bgCard: "#1d2c23",
        border: "#2d4738",
        amber: "#e0ab4a",
        moss: "#528a6d",
        clay: "#bf6547",
        parchment: "#e8dfce",
      };

      vi.mocked(db.themePreset.findFirst).mockResolvedValueOnce(mockActive as any);

      const theme = await getPublicActiveTheme();
      expect(theme?.name).toBe("Forest Moss");
      expect(theme?.bgPrimary).toBe("#0f1712");
    });

    it("falls back to default preset when no active theme is explicitly set", async () => {
      const mockDefault = {
        id: "theme-default",
        name: "Slate Obsidian",
        isDefault: true,
        active: false,
        bgPrimary: "#0d131a",
        bgSurface: "#141d27",
        bgCard: "#182330",
        border: "#2c3c4f",
        amber: "#d99b38",
        moss: "#3d634f",
        clay: "#c45a3c",
        parchment: "#e4dbc9",
      };

      // First query for active returns null, second query for default returns mockDefault
      vi.mocked(db.themePreset.findFirst)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockDefault as any);

      const theme = await getPublicActiveTheme();
      expect(theme?.name).toBe("Slate Obsidian");
      expect(theme?.isDefault).toBe(true);
    });
  });
});
