"use client";

import Image from "next/image";
import { useRef } from "react";
import styles from "./ProjectStudy.module.scss";

interface ProjectScreenshotProps {
  src: string;
  title: string;
  description: string;
  index: number;
}

export function ProjectScreenshot({ src, title, description, index }: ProjectScreenshotProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <article className={styles.shot}>
      <button
        className={styles.frame}
        type="button"
        aria-label={`Enlarge: ${title}`}
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
      >
        <span className={styles.browserBar} aria-hidden="true"><i /><i /><i /></span>
        <span className={styles.image}>
          <Image
            src={src}
            alt={title}
            fill
            priority={index === 0}
            sizes="(max-width: 800px) 100vw, (max-width: 1280px) 65vw, 800px"
            style={{ objectFit: "contain" }}
          />
        </span>
        <span className={styles.enlarge} aria-hidden="true">View full screen ↗</span>
      </button>
      <div className={styles.caption}>
        <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <dialog
        ref={dialog}
        className={styles.lightbox}
        aria-label={title}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className={styles.lightboxContent}>
          <div className={styles.lightboxHeader}>
            <span>{title}</span>
            <button type="button" autoFocus onClick={() => dialog.current?.close()} aria-label="Close screenshot">Close ×</button>
          </div>
          <div className={styles.fullImage}>
            <Image src={src} alt={title} fill sizes="96vw" style={{ objectFit: "contain" }} />
          </div>
          <p>{description}</p>
        </div>
      </dialog>
    </article>
  );
}
