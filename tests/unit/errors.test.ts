import { describe, it, expect } from "vitest";
import {
  AppError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ValidationError,
  ConflictError,
  formatSafeErrorResponse,
} from "@/lib/errors";

describe("Error handling architecture", () => {
  it("instantiates custom error classes with correct status codes and codes", () => {
    const baseError = new AppError("Base failure", 500, "CUSTOM_BASE");
    expect(baseError.statusCode).toBe(500);
    expect(baseError.code).toBe("CUSTOM_BASE");

    const notFound = new NotFoundError("Project not found");
    expect(notFound.statusCode).toBe(404);
    expect(notFound.code).toBe("NOT_FOUND");
    expect(notFound.message).toBe("Project not found");

    const unauthorized = new UnauthorizedError();
    expect(unauthorized.statusCode).toBe(401);
    expect(unauthorized.code).toBe("UNAUTHORIZED");

    const forbidden = new ForbiddenError();
    expect(forbidden.statusCode).toBe(403);
    expect(forbidden.code).toBe("FORBIDDEN");

    const validation = new ValidationError("Invalid slug", { field: "slug" });
    expect(validation.statusCode).toBe(422);
    expect(validation.code).toBe("VALIDATION_ERROR");
    expect(validation.details).toEqual({ field: "slug" });

    const conflict = new ConflictError();
    expect(conflict.statusCode).toBe(409);
    expect(conflict.code).toBe("CONFLICT");
  });

  it("formats AppError into safe response payload", () => {
    const error = new NotFoundError("Scene portal coordinate not registered");
    const formatted = formatSafeErrorResponse(error);

    expect(formatted.statusCode).toBe(404);
    expect(formatted.body.success).toBe(false);
    expect(formatted.body.error.code).toBe("NOT_FOUND");
    expect(formatted.body.error.message).toBe("Scene portal coordinate not registered");
  });

  it("sanitizes unexpected internal exceptions without leaking stack trace or secrets", () => {
    const rawError = new Error(
      "FATAL: connection to PostgreSQL host ep-123.neon.tech failed with password secret_pw"
    );
    const formatted = formatSafeErrorResponse(rawError);

    expect(formatted.statusCode).toBe(500);
    expect(formatted.body.success).toBe(false);
    expect(formatted.body.error.code).toBe("INTERNAL_ERROR");
    expect(formatted.body.error.message).not.toContain("secret_pw");
    expect(formatted.body.error.message).toBe(
      "An internal realm anomaly occurred. Please try again later."
    );
  });
});
