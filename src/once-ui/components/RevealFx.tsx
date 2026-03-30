"use client";

import React, { useState, useEffect, forwardRef } from "react";
import { SpacingToken } from "../types";
import { Flex } from ".";

interface RevealFxProps extends React.ComponentProps<typeof Flex> {
  children: React.ReactNode;
  speed?: "slow" | "medium" | "fast";
  delay?: number;
  revealedByDefault?: boolean;
  translateY?: number | SpacingToken;
  trigger?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const RevealFx = forwardRef<HTMLDivElement, RevealFxProps>(
  (
    {
      children,
      speed = "medium",
      delay = 0,
      revealedByDefault = false,
      translateY,
      trigger,
      style,
      className,
      ...rest
    },
    ref,
  ) => {
    const [isRevealed, setIsRevealed] = useState(revealedByDefault);

    useEffect(() => {
      if (trigger !== undefined) {
        setIsRevealed(trigger);
        return;
      }

      if (revealedByDefault) {
        setIsRevealed(true);
        return;
      }

      const timer = setTimeout(() => {
        setIsRevealed(true);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }, [delay, revealedByDefault, trigger]);

    const getSpeedDuration = () => {
      switch (speed) {
        case "fast":
          return "1s";
        case "medium":
          return "2s";
        case "slow":
          return "3s";
        default:
          return "2s";
      }
    };

    const getTranslateYValue = () => {
      if (typeof translateY === "number") {
        return `${translateY}rem`;
      } else if (typeof translateY === "string") {
        return `var(--static-space-${translateY})`;
      }
      return undefined;
    };

    const translateValue = getTranslateYValue();
    const transform = translateValue
      ? isRevealed
        ? "translateY(0)"
        : `translateY(${translateValue})`
      : undefined;

    const revealStyle: React.CSSProperties = {
      maskImage: "linear-gradient(to right, black 0%, black 25%, transparent 50%)",
      maskSize: "300% 100%",
      maskPosition: isRevealed ? "0 0" : "100% 0",
      filter: isRevealed ? "blur(0)" : "blur(0.5rem)",
      transitionProperty: "mask-position, filter, transform",
      transitionDuration: getSpeedDuration(),
      transitionTimingFunction: "ease-in-out",
      transform,
      ...style,
    };

    return (
      <Flex
        fillWidth
        position="relative"
        horizontal="center"
        ref={ref}
        style={revealStyle}
        className={className}
        {...rest}
      >
        {children}
      </Flex>
    );
  },
);

RevealFx.displayName = "RevealFx";
export { RevealFx };
