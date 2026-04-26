import { cookies, headers } from "next/headers";
import { createHash, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "wedding_admin_session";
const SESSION_TTL_SECONDS = 12 * 60 * 60; // 12 hours

const MAX_FAILED_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

interface RateBucket {
  count: number;
  resetAt: number;
}

const failedAttempts = new Map<string, RateBucket>();

function expectedToken(): string | null {
  const password = process.env.WEDDING_ADMIN_PASSWORD;
  if (!password) return null;
  return createHash("sha256").update(`v1|${password}`).digest("hex");
}

function getClientIp(): string {
  const fwd = headers().get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return headers().get("x-real-ip") ?? "unknown";
}

export function checkRateLimit():
  | { ok: true }
  | { ok: false; retryAfterMs: number } {
  const ip = getClientIp();
  const now = Date.now();
  const entry = failedAttempts.get(ip);
  if (!entry || entry.resetAt <= now) return { ok: true };
  if (entry.count >= MAX_FAILED_ATTEMPTS) {
    return { ok: false, retryAfterMs: entry.resetAt - now };
  }
  return { ok: true };
}

export function recordFailedAttempt(): void {
  const ip = getClientIp();
  const now = Date.now();
  const entry = failedAttempts.get(ip);
  if (!entry || entry.resetAt <= now) {
    failedAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

export function clearFailedAttempts(): void {
  const ip = getClientIp();
  failedAttempts.delete(ip);
}

export function isAdmin(): boolean {
  const expected = expectedToken();
  if (!expected) return false;
  const cookieValue = cookies().get(COOKIE_NAME)?.value;
  if (!cookieValue) return false;
  const a = Buffer.from(cookieValue);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function verifyPassword(submitted: string): boolean {
  const password = process.env.WEDDING_ADMIN_PASSWORD;
  if (!password) return false;
  const a = Buffer.from(submitted);
  const b = Buffer.from(password);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function setAdminCookie(): void {
  const token = expectedToken();
  if (!token) throw new Error("WEDDING_ADMIN_PASSWORD not configured");
  cookies().set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export function clearAdminCookie(): void {
  cookies().delete(COOKIE_NAME);
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.WEDDING_ADMIN_PASSWORD);
}
