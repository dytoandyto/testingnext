import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn utility", () => {
  it("merges standard class names correctly", () => {
    const result = cn("text-sm", "font-medium");
    expect(result).toBe("text-sm font-medium");
  });

  it("handles conditional classes cleanly", () => {
    const conditionTrue = true;
    const conditionFalse = false;
    const result = cn(
      "base-class",
      conditionTrue && "active-class",
      conditionFalse && "inactive-class"
    );
    expect(result).toBe("base-class active-class");
  });

  it("resolves conflicting tailwind classes with proper precedence", () => {
    const result = cn("p-4", "p-8");
    expect(result).toBe("p-8");
  });
});
