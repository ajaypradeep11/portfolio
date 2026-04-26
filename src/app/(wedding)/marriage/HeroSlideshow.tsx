"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface HeroSlideshowProps {
  images: readonly string[];
  intervalMs?: number;
  className?: string;
  imageClassName?: string;
}

export function HeroSlideshow({
  images,
  intervalMs = 4500,
  className,
  imageClassName,
}: HeroSlideshowProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => window.clearInterval(t);
  }, [images.length, intervalMs]);

  return (
    <div className={className}>
      {images.map((src, i) => (
        <div
          key={src}
          aria-hidden={i !== index}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === index ? 1 : 0,
            transition: "opacity 1.4s ease-in-out",
          }}
        >
          <Image
            src={src}
            alt=""
            fill
            priority={i === 0}
            sizes="(max-width: 720px) 90vw, 560px"
            className={imageClassName}
          />
        </div>
      ))}
    </div>
  );
}
