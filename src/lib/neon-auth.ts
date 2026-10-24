export const NEON_AUTH_BASE_URL =
  process.env.NEON_AUTH_BASE_URL ||
  "https://ep-billowing-bonus-b4b3fj4v.neonauth.c-6.us-east-2.aws.neon.tech/neondb/auth";

export const NEON_AUTH_JWKS_URL =
  process.env.NEON_AUTH_JWKS_URL ||
  "https://ep-billowing-bonus-b4b3fj4v.neonauth.c-6.us-east-2.aws.neon.tech/neondb/auth/.well-known/jwks.json";

export async function fetchNeonAuthJwks() {
  const res = await fetch(NEON_AUTH_JWKS_URL, {
    method: "GET",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch Neon Auth JWKS: HTTP ${res.status} ${res.statusText}`);
  }
  return await res.json();
}

export async function checkNeonAuthHealth() {
  const res = await fetch(NEON_AUTH_BASE_URL, {
    method: "GET",
  });
  return {
    status: res.status,
    ok: res.ok || res.status === 404 || res.status === 200, // 200/404 is normal for root auth endpoint
    url: NEON_AUTH_BASE_URL,
  };
}
