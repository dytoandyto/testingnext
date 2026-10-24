import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

describe("Cryptographic Password Service", () => {
  it("hashes password with bcrypt and verifies matching plaintext", async () => {
    const plaintext = "AncientSanctuaryCipher2026!";
    const hash = await hashPassword(plaintext);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(plaintext);
    expect(hash.startsWith("$2a$") || hash.startsWith("$2b$")).toBe(true);

    const isMatch = await verifyPassword(plaintext, hash);
    expect(isMatch).toBe(true);
  });

  it("rejects invalid password when checked against hash", async () => {
    const plaintext = "CorrectSecretPassword";
    const hash = await hashPassword(plaintext);

    const isMatch = await verifyPassword("WrongPassword123", hash);
    expect(isMatch).toBe(false);
  });

  it("rejects empty or malformed inputs safely", async () => {
    const isMatchEmpty = await verifyPassword("", "some-hash");
    expect(isMatchEmpty).toBe(false);

    const isMatchNull = await verifyPassword("password", "");
    expect(isMatchNull).toBe(false);

    await expect(hashPassword("short")).rejects.toThrow(
      "Password must be at least 8 characters in length"
    );
  });
});
