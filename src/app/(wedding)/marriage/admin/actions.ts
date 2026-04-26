"use server";

import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

import { getDb } from "@/lib/firebase-admin";
import {
  checkRateLimit,
  clearAdminCookie,
  clearFailedAttempts,
  isAdmin,
  isAdminConfigured,
  recordFailedAttempt,
  setAdminCookie,
  verifyPassword,
} from "@/lib/admin-auth";

export type LoginResult =
  | { ok: true }
  | {
      ok: false;
      error: "not-configured" | "rate-limited" | "invalid";
      retryAfterSeconds?: number;
    };

export async function loginAdmin(password: string): Promise<LoginResult> {
  if (!isAdminConfigured()) {
    return { ok: false, error: "not-configured" };
  }

  const limit = checkRateLimit();
  if (!limit.ok) {
    return {
      ok: false,
      error: "rate-limited",
      retryAfterSeconds: Math.ceil(limit.retryAfterMs / 1000),
    };
  }

  if (typeof password !== "string" || password.length === 0) {
    recordFailedAttempt();
    return { ok: false, error: "invalid" };
  }

  if (!verifyPassword(password)) {
    recordFailedAttempt();
    return { ok: false, error: "invalid" };
  }

  clearFailedAttempts();
  setAdminCookie();
  revalidatePath("/marriage/admin");
  return { ok: true };
}

export async function logoutAdmin(): Promise<void> {
  clearAdminCookie();
  revalidatePath("/marriage/admin");
}

type AdminMutationResult =
  | { ok: true; id?: string }
  | { ok: false; error: "unauthorized" | "invalid" | "internal" };

function requireAdmin(): boolean {
  return isAdmin();
}

export async function createInvite(input: {
  familyName: string;
  maxCount: number;
}): Promise<AdminMutationResult> {
  if (!requireAdmin()) return { ok: false, error: "unauthorized" };

  const familyName = (input?.familyName ?? "").trim();
  const maxCount = Number(input?.maxCount);

  if (familyName.length === 0 || familyName.length > 80) {
    return { ok: false, error: "invalid" };
  }
  if (!Number.isInteger(maxCount) || maxCount < 1 || maxCount > 50) {
    return { ok: false, error: "invalid" };
  }

  try {
    const ref = await getDb().collection("invites").add({
      familyName,
      maxCount,
      attendingCount: null,
      respondedAt: null,
      createdAt: FieldValue.serverTimestamp(),
    });
    revalidatePath("/marriage/admin");
    return { ok: true, id: ref.id };
  } catch (err) {
    console.error("[createInvite]", err);
    return { ok: false, error: "internal" };
  }
}

export async function updateInvite(
  uuid: string,
  patch: { familyName?: string; maxCount?: number },
): Promise<AdminMutationResult> {
  if (!requireAdmin()) return { ok: false, error: "unauthorized" };

  const updates: Record<string, unknown> = {};

  if (patch.familyName !== undefined) {
    const trimmed = patch.familyName.trim();
    if (trimmed.length === 0 || trimmed.length > 80) {
      return { ok: false, error: "invalid" };
    }
    updates.familyName = trimmed;
  }

  if (patch.maxCount !== undefined) {
    const n = Number(patch.maxCount);
    if (!Number.isInteger(n) || n < 1 || n > 50) {
      return { ok: false, error: "invalid" };
    }
    updates.maxCount = n;
  }

  if (Object.keys(updates).length === 0) {
    return { ok: false, error: "invalid" };
  }

  try {
    await getDb().doc(`invites/${uuid}`).update(updates);
    revalidatePath("/marriage/admin");
    revalidatePath(`/marriages/${uuid}`);
    return { ok: true };
  } catch (err) {
    console.error("[updateInvite]", err);
    return { ok: false, error: "internal" };
  }
}

export async function deleteInvite(uuid: string): Promise<AdminMutationResult> {
  if (!requireAdmin()) return { ok: false, error: "unauthorized" };

  if (typeof uuid !== "string" || uuid.length < 4) {
    return { ok: false, error: "invalid" };
  }

  try {
    await getDb().doc(`invites/${uuid}`).delete();
    revalidatePath("/marriage/admin");
    return { ok: true };
  } catch (err) {
    console.error("[deleteInvite]", err);
    return { ok: false, error: "internal" };
  }
}
