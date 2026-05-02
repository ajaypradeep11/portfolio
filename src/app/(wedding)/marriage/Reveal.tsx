"use client";

import {
  type ComponentPropsWithoutRef,
  type ElementType,
  useEffect,
  useRef,
} from "react";

type RevealProps<E extends ElementType = "div"> = {
  as?: E;
  threshold?: number;
  delayMs?: number;
} & ComponentPropsWithoutRef<E>;

export function Reveal<E extends ElementType = "div">({
  as,
  threshold = 0.15,
  delayMs,
  children,
  ...rest
}: RevealProps<E>) {
  const Component = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.dataset.revealed = "true";
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          const apply = () => {
            if (el.isConnected) el.dataset.revealed = "true";
          };
          if (delayMs && delayMs > 0) window.setTimeout(apply, delayMs);
          else apply();
          obs.unobserve(el);
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, delayMs]);

  return (
    <Component
      // biome-ignore lint/suspicious/noExplicitAny: polymorphic ref typing
      ref={ref as any}
      data-revealed="false"
      {...(rest as Record<string, unknown>)}
    >
      {children}
    </Component>
  );
}
