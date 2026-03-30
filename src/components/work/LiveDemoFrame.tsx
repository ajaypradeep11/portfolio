"use client";

import { useEffect, useRef, useState } from "react";

import { Button, Column, Flex, SmartImage, Text } from "@/once-ui/components";

const FRAME_LOAD_TIMEOUT_MS = 2500;

interface LiveDemoFrameProps {
  title: string;
  description?: string;
  src?: string;
  frameHeight?: string;
  standaloneHref?: string;
  fallbackImage?: string;
  fallbackAlt?: string;
  fallbackPriority?: boolean;
  fallbackSizes?: string;
}

export function LiveDemoFrame({
  title,
  description,
  src,
  frameHeight = "clamp(36rem, 82vh, 60rem)",
  standaloneHref,
  fallbackImage,
  fallbackAlt,
  fallbackPriority = false,
  fallbackSizes = "(max-width: 768px) 100vw, (max-width: 1280px) 92vw, 1100px",
}: LiveDemoFrameProps) {
  const [isFrameReady, setIsFrameReady] = useState(false);
  const [showFallbackNote, setShowFallbackNote] = useState(!src);
  const fallbackTimeoutRef = useRef<number | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const expectedOrigin = (() => {
    if (!src) {
      return null;
    }

    try {
      return new URL(src).origin;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (fallbackTimeoutRef.current !== null) {
      window.clearTimeout(fallbackTimeoutRef.current);
      fallbackTimeoutRef.current = null;
    }

    if (!src) {
      setIsFrameReady(false);
      setShowFallbackNote(true);
      return;
    }

    setIsFrameReady(false);
    setShowFallbackNote(false);

    fallbackTimeoutRef.current = window.setTimeout(() => {
      setShowFallbackNote(true);
    }, FRAME_LOAD_TIMEOUT_MS);

    return () => {
      if (fallbackTimeoutRef.current !== null) {
        window.clearTimeout(fallbackTimeoutRef.current);
        fallbackTimeoutRef.current = null;
      }
    };
  }, [src]);

  useEffect(() => {
    if (!src || !expectedOrigin) {
      return;
    }

    const handleMessage = (event: MessageEvent<{ type?: string }>) => {
      if (event.origin !== expectedOrigin) {
        return;
      }

      if (event.data?.type !== "portfolio-demo-ready") {
        return;
      }

      if (fallbackTimeoutRef.current !== null) {
        window.clearTimeout(fallbackTimeoutRef.current);
        fallbackTimeoutRef.current = null;
      }

      setIsFrameReady(true);
      setShowFallbackNote(false);
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [expectedOrigin, src]);

  useEffect(() => {
    if (!src || !expectedOrigin || isFrameReady) {
      return;
    }

    const pingChild = () => {
      try {
        iframeRef.current?.contentWindow?.postMessage(
          {
            type: "portfolio-parent-ping",
          },
          "*",
        );
      } catch {
        // Ignore early about:blank frames until the remote app navigates.
      }
    };

    pingChild();
    const intervalId = window.setInterval(pingChild, 500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [expectedOrigin, isFrameReady, src]);

  const showFallback = Boolean(fallbackImage) && !isFrameReady;
  const showLiveChrome = isFrameReady;

  return (
    <Column fillWidth gap="16">
      {showLiveChrome && (
        <Flex fillWidth mobileDirection="column" horizontal="space-between" vertical="center" gap="12">
          <Column gap="4">
            <Text variant="label-default-s" onBackground="brand-weak">
              Live Demo
            </Text>
            {description && (
              <Text variant="body-default-s" onBackground="neutral-weak">
                {description}
              </Text>
            )}
          </Column>
          {standaloneHref && (
            <Button
              href={standaloneHref}
              variant="secondary"
              size="s"
              suffixIcon="arrowUpRightFromSquare"
            >
              Open demo
            </Button>
          )}
        </Flex>
      )}
      <Flex
        fillWidth
        overflow="hidden"
        radius="l"
        border="neutral-alpha-weak"
        background="surface"
        style={{
          height: frameHeight,
          minHeight: "32rem",
          position: "relative",
        }}
      >
        {showFallback && fallbackImage && (
          <Flex
            fillWidth
            fillHeight
            background="surface"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
            }}
          >
            <SmartImage
              src={fallbackImage}
              alt={fallbackAlt || title}
              sizes={fallbackSizes}
              priority={fallbackPriority}
              unoptimized
              radius="l"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </Flex>
        )}
        {src ? (
          <iframe
            ref={iframeRef}
            src={src}
            title={title}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            style={{
              width: "100%",
              height: "100%",
              border: "0",
              display: "block",
              background: "#04090f",
              opacity: isFrameReady ? 1 : 0,
              transition: "opacity 180ms ease",
              position: "absolute",
              inset: 0,
              visibility: "visible",
              pointerEvents: isFrameReady ? "auto" : "none",
              zIndex: isFrameReady ? 2 : 0,
            }}
          />
        ) : null}
      </Flex>
      {showFallbackNote && !isFrameReady && !fallbackImage && (
        <Text variant="body-default-s" onBackground="danger-weak">
          Live demo is not available right now.
        </Text>
      )}
    </Column>
  );
}
