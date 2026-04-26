import Image from "next/image";
import Link from "next/link";

import { wedding } from "@/app/resources/wedding";

import styles from "./styles.module.scss";

export const metadata = {
  title: `${wedding.couple.primary} & ${wedding.couple.partner}`,
  robots: { index: false, follow: false },
};

export default function MarriageLanding() {
  const loveStorySrc = wedding.loveStoryImage || wedding.heroImage;

  return (
    <main className={styles.page}>
      {/* ──────────────  CINEMATIC HERO  ────────────── */}
      <section className={styles.cinematicHero}>
        <Image
          src={wedding.heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.cinematicImage}
        />
        <div className={styles.cinematicOverlay} />

        <h1 className={styles.cinematicNames}>
          <span>{wedding.couple.primary}</span>
          <span className={styles.cinematicAmp}>&amp;</span>
          <span>{wedding.couple.partner}</span>
        </h1>

        <div className={styles.cinematicFooter}>
          <span>{wedding.dateDisplay}</span>
          {wedding.hashtag ? (
            <span className={styles.cinematicHashtag}>{wedding.hashtag}</span>
          ) : (
            <span />
          )}
        </div>
      </section>

      {/* ──────────────  OUR LOVE STORY  ────────────── */}
      <section className={styles.loveStory}>
        <h2 className={styles.loveStoryTitle}>
          <span>Our</span>
          <span>Love</span>
          <span>Story</span>
        </h2>

        <div className={styles.loveStoryPhotoWrap}>
          <Image
            src={loveStorySrc}
            alt=""
            fill
            sizes="(max-width: 880px) 100vw, 40vw"
            className={styles.loveStoryPhoto}
          />
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

      <p className={styles.invitationNote}>By invitation only</p>
    </main>
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
