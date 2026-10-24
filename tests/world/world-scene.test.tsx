import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WorldFallback2D } from "@/components/world/WorldFallback2D";
import type { LocalizedPortal } from "@/services/public-queries";

vi.mock("@/i18n/routing", () => ({
  Link: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const mockPortals: LocalizedPortal[] = [
  {
    id: "p1",
    targetRoute: "/projects",
    posX: -4,
    posY: 0,
    posZ: 2,
    rotY: 0.5,
    label: "Workshop Creations",
    order: 1,
  },
  {
    id: "p2",
    targetRoute: "/about",
    posX: 0,
    posY: 0,
    posZ: 5,
    rotY: 0,
    label: "Chronicle Biography",
    order: 2,
  },
  {
    id: "p3",
    targetRoute: "javascript:evil()", // Malicious target to test sanitization
    posX: 4,
    posY: 0,
    posZ: 2,
    rotY: -0.5,
    label: "Insecure Target",
    order: 3,
  },
];

describe("3D World Scene & Accessible 2D Fallback Engine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("WorldFallback2D Component", () => {
    it("renders the 2D accessible diorama stage with portal cards and coordinates", () => {
      render(
        <WorldFallback2D
          sceneName="Astral Archipelago"
          portals={mockPortals}
        />
      );

      expect(screen.getByRole("region", { name: /2D Accessible Diorama Stage/i })).toBeInTheDocument();
      expect(screen.getByText(/Astral Archipelago • 2D Accessible Diorama/i)).toBeInTheDocument();
      expect(screen.getByText("Workshop Creations")).toBeInTheDocument();
      expect(screen.getByText("Chronicle Biography")).toBeInTheDocument();
      expect(screen.getByText("[-4, 0, 2]")).toBeInTheDocument();
    });

    it("sanitizes malicious portal targets to safe internal fallback route", () => {
      render(
        <WorldFallback2D
          sceneName="Astral Archipelago"
          portals={mockPortals}
        />
      );

      const links = screen.getAllByRole("link");
      const hrefs = links.map((l) => l.getAttribute("href"));

      expect(hrefs).toContain("/projects");
      expect(hrefs).toContain("/about");
      expect(hrefs).not.toContain("javascript:evil()");
    });

    it("displays WebGL inactive notice and provides retry mechanism when unsupported", () => {
      const handleRetry = vi.fn();

      render(
        <WorldFallback2D
          sceneName="Astral Archipelago"
          portals={mockPortals}
          isUnsupportedWebGL={true}
          onRetryWebGL={handleRetry}
        />
      );

      expect(screen.getByText(/WebGL Inactive \/ Standard Mode/i)).toBeInTheDocument();

      const retryBtn = screen.getByRole("button", { name: /Retry 3D/i });
      expect(retryBtn).toBeInTheDocument();
      fireEvent.click(retryBtn);
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });
  });
});
