import { NextRequest, NextResponse } from "next/server";

/**
 * In-memory rate limiter — good enough for a single-region Vercel deployment.
 * Each serverless instance carries its own counter; an attacker spreading
 * across instances dilutes the limit slightly but the per-instance cap still
 * makes brute-force expensive.
 *
 * For a hardened multi-region setup, swap this with Upstash Redis. The
 * `check()` signature is the same so call sites won't change.
 */

type Bucket = { count: number; resetAt: number };

const STORE = new Map<string, Bucket>();

/** Sweep stale entries periodically to keep memory bounded. */
let lastSweep = 0;
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [k, v] of STORE) {
    if (v.resetAt <= now) STORE.delete(k);
  }
}

export type RateLimitConfig = {
  /** Logical bucket name — keeps endpoints from interfering with each other. */
  scope: string;
  /** Max attempts inside the window. */
  max: number;
  /** Window length in seconds. */
  windowSec: number;
};

export type RateLimitResult =
  | { ok: true; remaining: number }
  | { ok: false; retryAfterSec: number };

function clientKey(req: NextRequest): string {
  // Vercel sets x-forwarded-for; fall back to a fixed bucket so misconfig
  // doesn't disable the limiter entirely.
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

export function check(req: NextRequest, cfg: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  sweep(now);
  const key = `${cfg.scope}:${clientKey(req)}`;
  const existing = STORE.get(key);

  if (!existing || existing.resetAt <= now) {
    STORE.set(key, { count: 1, resetAt: now + cfg.windowSec * 1000 });
    return { ok: true, remaining: cfg.max - 1 };
  }

  if (existing.count >= cfg.max) {
    const retryAfterSec = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    return { ok: false, retryAfterSec };
  }

  existing.count += 1;
  return { ok: true, remaining: cfg.max - existing.count };
}

/** Tiny helper to short-circuit a route with a 429 response. */
export function tooManyRequests(retryAfterSec: number) {
  return NextResponse.json(
    {
      ok: false,
      error: "rate-limited",
      message: "محاولات كثيرة في وقت قصير. حاول بعد قليل.",
      retryAfter: retryAfterSec,
    },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSec) },
    }
  );
}
