import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

describe("Alert component", () => {
  it("renders alert role and content", () => {
    render(
      <Alert variant="amber">
        <AlertTitle>Beacon Notice</AlertTitle>
        <AlertDescription>System frequency synchronized.</AlertDescription>
      </Alert>
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Beacon Notice")).toBeInTheDocument();
    expect(screen.getByText("System frequency synchronized.")).toBeInTheDocument();
  });
});
