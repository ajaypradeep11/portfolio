import { getDb } from "@/lib/firebase-admin";
import { isAdmin, isAdminConfigured } from "@/lib/admin-auth";

import { InvitesTable, type InviteRow } from "./InvitesTable";
import { LoginForm } from "./LoginForm";
import styles from "./styles.module.scss";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin · Wedding invites",
  robots: { index: false, follow: false },
};

interface RawInvite {
  familyName?: unknown;
  maxCount?: unknown;
  attendingCount?: unknown;
  respondedAt?: { toDate?: () => Date } | null | unknown;
}

async function loadAllInvites(): Promise<InviteRow[]> {
  const snap = await getDb().collection("invites").get();
  const rows: InviteRow[] = [];
  snap.forEach((doc) => {
    const data = (doc.data() ?? {}) as RawInvite;
    rows.push({
      id: doc.id,
      familyName: typeof data.familyName === "string" ? data.familyName : "(unnamed)",
      maxCount: typeof data.maxCount === "number" ? data.maxCount : 0,
      attendingCount:
        typeof data.attendingCount === "number" ? data.attendingCount : null,
      respondedAtISO: extractDateISO(data.respondedAt),
    });
  });
  rows.sort((a, b) => a.familyName.localeCompare(b.familyName));
  return rows;
}

function extractDateISO(input: unknown): string | null {
  if (!input) return null;
  if (typeof input === "object" && input !== null && "toDate" in input) {
    const fn = (input as { toDate?: () => Date }).toDate;
    if (typeof fn === "function") {
      try {
        return fn.call(input).toISOString();
      } catch {
        return null;
      }
    }
  }
  return null;
}

export default async function AdminPage() {
  if (!isAdmin()) {
    return <LoginForm notConfigured={!isAdminConfigured()} />;
  }

  const rows = await loadAllInvites();

  return (
    <main className={styles.adminShell}>
      <header className={styles.adminHeader}>
        <p className={styles.adminEyebrow}>Wedding admin</p>
        <h1 className={styles.adminTitle}>Invites</h1>
      </header>
      <InvitesTable rows={rows} />
    </main>
  );
}
