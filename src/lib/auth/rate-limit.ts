interface RateLimitRecord {
  count: number;
  firstAttemptAt: number;
  lockedUntil?: number;
}

const loginAttemptsStore = new Map<string, RateLimitRecord>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lockout

/**
 * Checks whether an identifier (IP address or email) is permitted to attempt authentication.
 */
export function checkLoginRateLimit(key: string): {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const record = loginAttemptsStore.get(key);

  if (!record) {
    return {
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS,
      retryAfterSeconds: 0,
    };
  }

  // Check if actively locked out
  if (record.lockedUntil && record.lockedUntil > now) {
    const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfterSeconds,
    };
  }

  // Check if window has expired
  if (now - record.firstAttemptAt > WINDOW_MS) {
    loginAttemptsStore.delete(key);
    return {
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS,
      retryAfterSeconds: 0,
    };
  }

  const remaining = Math.max(0, MAX_ATTEMPTS - record.count);
  return {
    allowed: record.count < MAX_ATTEMPTS,
    remainingAttempts: remaining,
    retryAfterSeconds: 0,
  };
}

/**
 * Increments failed attempt counter and applies lockout when exceeding max threshold.
 */
export function recordFailedLogin(key: string): {
  remainingAttempts: number;
  locked: boolean;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const record = loginAttemptsStore.get(key);

  if (!record || now - record.firstAttemptAt > WINDOW_MS) {
    loginAttemptsStore.set(key, {
      count: 1,
      firstAttemptAt: now,
    });
    return {
      remainingAttempts: MAX_ATTEMPTS - 1,
      locked: false,
      retryAfterSeconds: 0,
    };
  }

  record.count += 1;

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MS;
    const retryAfterSeconds = Math.ceil(LOCKOUT_MS / 1000);
    return {
      remainingAttempts: 0,
      locked: true,
      retryAfterSeconds,
    };
  }

  return {
    remainingAttempts: Math.max(0, MAX_ATTEMPTS - record.count),
    locked: false,
    retryAfterSeconds: 0,
  };
}

/**
 * Resets the attempt counter upon successful authentication.
 */
export function resetLoginRateLimit(key: string): void {
  loginAttemptsStore.delete(key);
}

/**
 * Test helper to clear all records in testing environments.
 */
export function clearAllRateLimits(): void {
  loginAttemptsStore.clear();
}
