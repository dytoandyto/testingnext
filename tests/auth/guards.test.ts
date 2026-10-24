import { describe, it, expect, vi, beforeEach } from "vitest";
import { requirePublishedOnly, withAdminAction, requireAdminSession } from "@/lib/auth/guards";
import { auth } from "@/auth";
import type { Session } from "next-auth";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

const mockAuth = auth as unknown as ReturnType<typeof vi.fn<() => Promise<Session | null>>>;

describe("Server-Side Authorization Guards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("enforces { status: 'PUBLISHED' } on any query where-clause", () => {
    const rawWhere = { featured: true, order: 1 };
    const securedWhere = requirePublishedOnly(rawWhere);

    expect(securedWhere).toEqual({
      featured: true,
      order: 1,
      status: "PUBLISHED",
    });
  });

  it("overrides any attempt to query DRAFT content through public helper", () => {
    const attempt = { status: "DRAFT" as const, featured: true };
    const secured = requirePublishedOnly(attempt);

    expect(secured.status).toBe("PUBLISHED");
  });

  it("throws UnauthorizedError when session is missing", async () => {
    mockAuth.mockResolvedValue(null);

    await expect(requireAdminSession()).rejects.toThrow(
      "Authentication required to access Sanctuary CMS controls"
    );
  });

  it("throws ForbiddenError when user role is not ADMIN", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "user_guest", email: "guest@realm.io", role: "USER" },
      expires: "2026-12-31",
    } as unknown as Session);

    await expect(requireAdminSession()).rejects.toThrow(
      "Administrative privileges required for this directive"
    );
  });

  it("permits action execution when valid ADMIN session is present", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "admin_01", email: "admin@indie-realm.io", role: "ADMIN" },
      expires: "2026-12-31",
    } as unknown as Session);

    const protectedAction = withAdminAction(async (user, payload: { title: string }) => {
      return { success: true, createdBy: user.id, title: payload.title };
    });

    const result = await protectedAction({ title: "Authorized Project" });
    expect(result).toEqual({
      success: true,
      createdBy: "admin_01",
      title: "Authorized Project",
    });
  });
});
