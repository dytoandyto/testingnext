export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 500, code = "INTERNAL_ERROR", details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Requested resource was not found in this realm") {
    super(message, 404, "NOT_FOUND");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required to enter this sanctuary") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Access to this sector is strictly forbidden") {
    super(message, 403, "FORBIDDEN");
  }
}

export class ValidationError extends AppError {
  constructor(message = "Payload validation failed", details?: unknown) {
    super(message, 422, "VALIDATION_ERROR", details);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource state conflicts with existing record") {
    super(message, 409, "CONFLICT");
  }
}

export interface SafeErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
}

export function formatSafeErrorResponse(error: unknown): {
  statusCode: number;
  body: SafeErrorResponse;
} {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      body: {
        success: false,
        error: {
          message: error.message,
          code: error.code,
          details: error.details,
        },
      },
    };
  }

  // Never leak unexpected database errors, stack traces, or credentials to clients
  console.error("Unhandled system error:", error);
  return {
    statusCode: 500,
    body: {
      success: false,
      error: {
        message: "An internal realm anomaly occurred. Please try again later.",
        code: "INTERNAL_ERROR",
      },
    },
  };
}
