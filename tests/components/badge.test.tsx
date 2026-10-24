import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge component", () => {
  it("renders with given text", () => {
    render(<Badge>VERIFIED</Badge>);
    expect(screen.getByText("VERIFIED")).toBeInTheDocument();
  });

  it("applies variant classes accurately", () => {
    const { container: amberContainer } = render(<Badge variant="amber">Amber</Badge>);
    expect(amberContainer.firstChild).toHaveClass("text-[var(--realm-amber)]");

    const { container: mossContainer } = render(<Badge variant="moss">Moss</Badge>);
    expect(mossContainer.firstChild).toHaveClass("text-[#7ec7a2]");
  });
});
