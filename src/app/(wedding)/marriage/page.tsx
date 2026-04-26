import Link from "next/link";

import { wedding } from "@/app/resources/wedding";

import styles from "../marriages/[uuid]/styles.module.scss";

export const metadata = {
  title: `${wedding.couple.primary} & ${wedding.couple.partner}`,
  robots: { index: false, follow: false },
};

function shortDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}.${mm}.${yy}`;
}

export default function MarriageLanding() {
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
          <p className={styles.subtagline}>Are getting married</p>
          <p className={styles.heroDate}>{shortDate(wedding.dateISO)}</p>

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

          <p className={styles.invitationNote}>By invitation only</p>
        </div>
      </section>
    </main>
  );
}
