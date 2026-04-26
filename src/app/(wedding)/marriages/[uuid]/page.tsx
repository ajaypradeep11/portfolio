import Image from "next/image";
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
        <Image
          src={wedding.heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay} />
      </section>

      <section className={styles.content}>
        <p className={styles.familyName}>{invite.familyName}</p>
        <h1 className={styles.headline}>You're invited to our wedding</h1>
        <p className={styles.couple}>
          {wedding.couple.primary} &amp; {wedding.couple.partner}
        </p>

        <dl className={styles.details}>
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

        <p className={styles.deadline}>
          Please RSVP by {formatDeadline(wedding.rsvpDeadlineISO)}
        </p>

        <RsvpForm
          uuid={params.uuid}
          maxCount={invite.maxCount}
          initialCount={invite.attendingCount}
          locked={locked}
        />
      </section>
    </main>
  );
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
