import { describe, it, expect, beforeEach } from "vitest";
import {
  checkLoginRateLimit,
  recordFailedLogin,
  resetLoginRateLimit,
  clearAllRateLimits,
} from "@/lib/auth/rate-limit";

describe("Login Rate Limiting Service", () => {
  beforeEach(() => {
    clearAllRateLimits();
  });

  it("permits initial login attempts", () => {
    const status = checkLoginRateLimit("admin@realm.io");
    expect(status.allowed).toBe(true);
    expect(status.remainingAttempts).toBe(5);
    expect(status.retryAfterSeconds).toBe(0);
  });

  it("tracks failed attempts and decrements remaining quota", () => {
    const attempt1 = recordFailedLogin("test@realm.io");
    expect(attempt1.remainingAttempts).toBe(4);
    expect(attempt1.locked).toBe(false);

    const attempt2 = recordFailedLogin("test@realm.io");
    expect(attempt2.remainingAttempts).toBe(3);
    expect(attempt2.locked).toBe(false);
  });

  it("triggers lockout when failed attempts reach threshold", () => {
    // 5 failed attempts
    recordFailedLogin("attacker@realm.io");
    recordFailedLogin("attacker@realm.io");
    recordFailedLogin("attacker@realm.io");
    recordFailedLogin("attacker@realm.io");
    const fifth = recordFailedLogin("attacker@realm.io");

    expect(fifth.locked).toBe(true);
    expect(fifth.remainingAttempts).toBe(0);
    expect(fifth.retryAfterSeconds).toBeGreaterThan(0);

    const check = checkLoginRateLimit("attacker@realm.io");
    expect(check.allowed).toBe(false);
    expect(check.remainingAttempts).toBe(0);
  });

  it("resets rate limit upon successful authentication", () => {
    recordFailedLogin("editor@realm.io");
    recordFailedLogin("editor@realm.io");

    resetLoginRateLimit("editor@realm.io");

    const check = checkLoginRateLimit("editor@realm.io");
    expect(check.allowed).toBe(true);
    expect(check.remainingAttempts).toBe(5);
  });
});
