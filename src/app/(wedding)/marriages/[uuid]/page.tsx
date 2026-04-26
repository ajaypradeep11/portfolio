import Link from "next/link";
import { notFound } from "next/navigation";

import { wedding } from "@/app/resources/wedding";
import { getDb } from "@/lib/firebase-admin";

import { RsvpForm } from "./RsvpForm";
import styles from "./styles.module.scss";

interface InviteDoc {
  familyName: string;
  maxCount: number;
  attendingCount: number | null;
  respondedAt: FirebaseFirestore.Timestamp | null;
}

export const dynamic = "force-dynamic";

async function loadInvite(uuid: string): Promise<InviteDoc | null> {
  const snap = await getDb().doc(`invites/${uuid}`).get();
  if (!snap.exists) return null;
  const data = snap.data() as Partial<InviteDoc> | undefined;
  if (!data || typeof data.familyName !== "string" || typeof data.maxCount !== "number") {
    return null;
  }
  return {
    familyName: data.familyName,
    maxCount: data.maxCount,
    attendingCount:
      typeof data.attendingCount === "number" ? data.attendingCount : null,
    respondedAt: data.respondedAt ?? null,
  };
}

function isPastDeadline(): boolean {
  const ms = Date.parse(`${wedding.rsvpDeadlineISO}T23:59:59`);
  return !Number.isNaN(ms) && Date.now() > ms;
}

function shortDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}.${mm}.${yy}`;
}

function formatDeadline(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

interface PageProps {
  params: { uuid: string };
}

export default async function MarriagePage({ params }: PageProps) {
  const invite = await loadInvite(params.uuid);
  if (!invite) {
    notFound();
  }

  const locked = isPastDeadline();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span className={`${styles.floral} ${styles.floralTopRight}`} aria-hidden="true" />
        <span className={`${styles.floral} ${styles.floralBottomLeft}`} aria-hidden="true" />

        <div className={styles.heroInner}>
          <p className={styles.tagline}>Together with their families</p>
          <h1 className={styles.couple}>
            <span className={styles.coupleLine}>{wedding.couple.primary} &amp;</span>
            <span className={styles.coupleLine}>{wedding.couple.partner}</span>
          </h1>
          <p className={styles.subtagline}>Invite you to join them</p>
          <p className={styles.heroDate}>{shortDate(wedding.dateISO)}</p>
          <p className={styles.heroFamily}>For the {invite.familyName}</p>

          <div className={styles.divider} aria-hidden="true">
            <span />
            <em>Details</em>
            <span />
          </div>

          <dl className={styles.detailList}>
            <div className={styles.detailRow}>
              <dt>Date</dt>
              <dd>{wedding.dateDisplay}</dd>
            </div>
            <div className={styles.detailRow}>
              <dt>Time</dt>
              <dd>{wedding.time}</dd>
            </div>
            <div className={styles.detailRow}>
              <dt>Venue</dt>
              <dd>
                {wedding.venue.name}
                <br />
                {wedding.venue.address}
                <br />
                <Link href={wedding.venue.mapUrl} target="_blank" rel="noopener noreferrer">
                  View on map →
                </Link>
              </dd>
            </div>
            <div className={styles.detailRow}>
              <dt>Dress code</dt>
              <dd>{wedding.dressCode}</dd>
            </div>
          </dl>

          <div className={styles.divider} aria-hidden="true">
            <span />
            <em>RSVP</em>
            <span />
          </div>

          <p className={styles.deadline}>
            Kindly respond by {formatDeadline(wedding.rsvpDeadlineISO)}
          </p>

          <RsvpForm
            uuid={params.uuid}
            maxCount={invite.maxCount}
            initialCount={invite.attendingCount}
            locked={locked}
          />
        </div>
      </section>
    </main>
  );
}
