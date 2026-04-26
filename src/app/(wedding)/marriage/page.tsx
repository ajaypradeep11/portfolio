import Image from "next/image";
import Link from "next/link";

import { wedding } from "@/app/resources/wedding";

import { HeroSlideshow } from "./HeroSlideshow";
import styles from "./styles.module.scss";

export const metadata = {
  title: `${wedding.couple.primary} & ${wedding.couple.partner}`,
  robots: { index: false, follow: false },
};

function formatDeadline(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function MarriageLanding() {
  const deadlineDisplay = formatDeadline(wedding.rsvpDeadlineISO);

  return (
    <main className={styles.page}>
      {/* ──────────────  HERO  ────────────── */}
      <section className={styles.hero}>
        <h1 className={styles.heroNames}>
          {wedding.couple.primary} and {wedding.couple.partner}
        </h1>

        <div className={styles.heroPhotoWrap}>
          <HeroSlideshow
            images={wedding.coupleImages}
            className={styles.heroSlideshow}
            imageClassName={styles.heroPhoto}
          />
        </div>

        <div className={styles.heroFooter}>
          <span className={styles.heroFooterLeft}>{wedding.dateDisplay}</span>
          <span className={styles.heroFooterCenter}>
            Please RSVP on or before {deadlineDisplay}.
          </span>
          <span className={styles.heroFooterRight}>{wedding.location}</span>
        </div>
      </section>

      {/* ──────────────  OUR STORY  ────────────── */}
      <section className={styles.loveStory}>
        <h2 className={styles.loveStoryTitle}>
          {wedding.loveStoryTitleLines.map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </h2>

        <div className={styles.loveStorySinceRow}>
          <span className={styles.loveStorySinceLabel}>Since</span>
          <CoupleIllustration className={styles.loveStoryIllustration} />
          <span className={styles.loveStorySinceYear}>
            {wedding.loveStorySinceYear}
          </span>
        </div>

        <div className={styles.loveStoryText}>
          {wedding.loveStory.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      {/* ──────────────  THE CEREMONY  ────────────── */}
      <section className={styles.ceremony}>
        <h2 className={styles.ceremonyTitle}>The Ceremony</h2>

        <div className={styles.ceremonyGrid}>
          <article className={styles.ceremonyCard}>
            <FloralIcon variant="rose" className={styles.ceremonyIcon} />
            <h3 className={styles.ceremonyHeading}>Ceremony Venue</h3>
            <p className={styles.ceremonyBody}>
              {wedding.venue.name}
              <br />
              {wedding.venue.address}
              <br />
              <Link href={wedding.venue.mapUrl} target="_blank" rel="noopener noreferrer">
                View on map →
              </Link>
            </p>
          </article>

          <article className={styles.ceremonyCard}>
            <FloralIcon variant="wildflower" className={styles.ceremonyIcon} />
            <h3 className={styles.ceremonyHeading}>Dress Code</h3>
            <p className={styles.ceremonyBody}>{wedding.dressCode}</p>
          </article>

          <article className={styles.ceremonyCard}>
            <FloralIcon variant="tulip" className={styles.ceremonyIcon} />
            <h3 className={styles.ceremonyHeading}>When</h3>
            <p className={styles.ceremonyBody}>
              {wedding.dateDisplay}
              <br />
              {wedding.time}
            </p>
          </article>
        </div>
      </section>

      {/* ──────────────  PROGRAM & RECEPTION  ────────────── */}
      <section className={styles.programReception}>
        <div className={styles.programReceptionInner}>
          <div>
            <h2 className={styles.prSectionTitle}>Program</h2>
            <ul className={styles.programList}>
              {wedding.program.map((item, i) => (
                <li key={i} className={styles.programItem}>
                  <span className={styles.programTime}>{item.time}</span>
                  <span className={styles.programEvent}>{item.event}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={styles.prSectionTitle}>Reception</h2>
            <div className={styles.receptionList}>
              {wedding.reception.map((item, i) => (
                <div key={i} className={styles.receptionItem}>
                  <h3 className={styles.receptionHeading}>{item.heading}</h3>
                  <p className={styles.receptionBody}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <p className={styles.invitationNote}>By invitation only</p>
    </main>
  );
}

/* ----------- Couple silhouette illustration ----------- */

function CoupleIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 100"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      {/* Left figure (suit) */}
      <circle cx="46" cy="20" r="6.5" />
      <path d="M40 28 Q40 26 46 26 Q52 26 52 28 L54 50 Q54 52 52 52 L48 52 L48 70 L52 92 L46 92 L43 75 L40 92 L34 92 L38 68 L38 52 L34 52 Q32 52 32 50 L36 33 Z" />
      {/* Right figure (dress) */}
      <circle cx="74" cy="22" r="6" />
      <path d="M68 30 Q68 28 74 28 Q80 28 80 30 L82 46 L96 80 L70 80 L78 46 Z" />
      {/* Right figure legs from under skirt */}
      <path d="M76 80 L74 92 L70 92 L72 80 Z" />
      <path d="M82 80 L86 92 L82 92 L78 80 Z" />
      {/* Joined hands between them */}
      <path d="M52 38 Q60 42 68 38" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

/* ----------- Inline botanical icons ----------- */

function FloralIcon({
  variant,
  className,
}: {
  variant: "rose" | "wildflower" | "tulip";
  className?: string;
}) {
  if (variant === "rose") {
    return (
      <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M50 28c-7 0-12 5-12 11 0 7 5 12 12 12s12-5 12-12c0-6-5-11-12-11z" />
        <path d="M44 36c0-3 3-5 6-5s6 2 6 5-3 5-6 5-6-2-6-5z" />
        <path d="M46 38c1-1 3-1 4 0" />
        <path d="M50 50c0 18-6 36-18 42" />
        <path d="M50 50c0 18 6 36 18 42" />
        <path d="M40 60c-7-2-14 2-18 8 6 0 12-2 16-6" />
        <path d="M60 60c7-2 14 2 18 8-6 0-12-2-16-6" />
        <path d="M44 75c-6 0-11 4-13 10 5 0 10-3 13-7" />
        <path d="M56 75c6 0 11 4 13 10-5 0-10-3-13-7" />
        <path d="M50 50c-2-2-3-4-3-7" />
        <path d="M50 50c2-2 3-4 3-7" />
      </svg>
    );
  }

  if (variant === "wildflower") {
    return (
      <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* central stem */}
        <path d="M50 92 Q49 70 51 50 Q52 35 50 22" />
        {/* small bloom top */}
        <circle cx="50" cy="20" r="4" />
        <path d="M46 17 Q50 13 54 17" />
        <path d="M46 23 Q50 27 54 23" />
        {/* side bloom upper-right */}
        <path d="M62 35 Q70 28 72 22 Q66 24 62 30" />
        <circle cx="64" cy="30" r="2.5" />
        {/* side bloom upper-left */}
        <path d="M38 38 Q30 34 28 28 Q34 30 38 36" />
        <circle cx="36" cy="34" r="2.5" />
        {/* mid bloom right */}
        <path d="M58 50 Q66 50 70 56" />
        <circle cx="62" cy="50" r="3" />
        <path d="M59 47 Q62 44 65 47" />
        {/* leaf left mid */}
        <path d="M50 60 Q42 60 38 66 Q44 68 50 64 Z" />
        {/* leaf right lower */}
        <path d="M50 75 Q58 75 62 82 Q56 84 50 80 Z" />
      </svg>
    );
  }

  // tulip
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* tulip cup */}
      <path d="M40 28 Q42 18 50 16 Q58 18 60 28 L60 44 Q55 48 50 48 Q45 48 40 44 Z" />
      <path d="M50 16 Q50 30 50 48" />
      <path d="M40 32 Q44 36 48 32" />
      <path d="M52 32 Q56 36 60 32" />
      {/* stem */}
      <path d="M50 48 Q49 70 50 92" />
      {/* leaf left */}
      <path d="M50 70 Q40 68 32 78 Q42 78 50 74" />
      {/* leaf right */}
      <path d="M50 60 Q60 58 68 66 Q60 70 52 65" />
    </svg>
  );
}
