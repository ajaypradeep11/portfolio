"use server";

import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

import { wedding } from "@/app/resources/wedding";
import { getDb } from "@/lib/firebase-admin";

export type SubmitRsvpResult =
  | { ok: true }
  | { ok: false; error: "invalid-invite" | "out-of-range" | "closed" | "internal" };

const UUID_PATTERN = /^[A-Za-z0-9_-]{6,64}$/;

export async function submitRsvp(
  uuid: string,
  count: number,
): Promise<SubmitRsvpResult> {
  if (typeof uuid !== "string" || !UUID_PATTERN.test(uuid)) {
    return { ok: false, error: "invalid-invite" };
  }

  if (!Number.isInteger(count) || count < 0) {
    return { ok: false, error: "out-of-range" };
  }

  const deadlineMs = Date.parse(`${wedding.rsvpDeadlineISO}T23:59:59`);
  if (!Number.isNaN(deadlineMs) && Date.now() > deadlineMs) {
    return { ok: false, error: "closed" };
  }

  try {
    const db = getDb();
    const ref = db.doc(`invites/${uuid}`);
    const snap = await ref.get();

    if (!snap.exists) {
      return { ok: false, error: "invalid-invite" };
    }

    const data = snap.data() as { maxCount?: number } | undefined;
    const maxCount = data?.maxCount;

    if (typeof maxCount !== "number" || count > maxCount) {
      return { ok: false, error: "out-of-range" };
    }

    await ref.update({
      attendingCount: count,
      respondedAt: FieldValue.serverTimestamp(),
    });

    revalidatePath(`/marriages/${uuid}`);
    return { ok: true };
  } catch (err) {
    console.error("[submitRsvp]", err);
    return { ok: false, error: "internal" };
  }
}
