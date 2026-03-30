"use client";

import React, { CSSProperties, forwardRef, useEffect, useRef } from "react";
import { SpacingToken } from "../types";
import { Flex } from "./Flex";
import { DisplayProps } from "../interfaces";
import styles from "./Background.module.scss";
import classNames from "classnames";

function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref && "current" in ref) {
    (ref as React.MutableRefObject<T | null>).current = value;
  }
}

interface MaskProps {
  cursor?: boolean;
  x?: number;
  y?: number;
  radius?: number;
}

interface GradientProps {
  display?: boolean;
  opacity?: DisplayProps["opacity"];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  tilt?: number;
  colorStart?: string;
  colorEnd?: string;
}

interface DotsProps {
  display?: boolean;
  opacity?: DisplayProps["opacity"];
  color?: string;
  size?: SpacingToken;
}

interface GridProps {
  display?: boolean;
  opacity?: DisplayProps["opacity"];
  color?: string;
  width?: string;
  height?: string;
}

interface LinesProps {
  display?: boolean;
  opacity?: DisplayProps["opacity"];
  size?: SpacingToken;
}

interface BackgroundProps extends React.ComponentProps<typeof Flex> {
  position?: CSSProperties["position"];
  gradient?: GradientProps;
  dots?: DotsProps;
  grid?: GridProps;
  lines?: LinesProps;
  mask?: MaskProps;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const Background = forwardRef<HTMLDivElement, BackgroundProps>(
  (
    {
      position = "fixed",
      gradient = {},
      dots = {},
      grid = {},
      lines = {},
      mask = {},
      children,
      className,
      style,
      ...rest
    },
    forwardedRef,
  ) => {
    const dotsColor = dots.color ?? "brand-on-background-weak";
    const dotsSize = `var(--static-space-${dots.size ?? "24"})`;
    const hasMask = mask.cursor || (mask.x != null && mask.y != null);
    const backgroundRef = useRef<HTMLDivElement>(null);
    const targetPositionRef = useRef({ x: 0, y: 0 });
    const smoothPositionRef = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>();

    useEffect(() => {
      setRef(forwardedRef, backgroundRef.current);
    }, [forwardedRef]);

    useEffect(() => {
      if (!mask.cursor || !backgroundRef.current) {
        return;
      }

      const element = backgroundRef.current;
      const isViewportBound = position === "fixed";

      const setMaskPosition = (x: number, y: number) => {
        element.style.setProperty("--mask-position-x", `${Math.round(x)}px`);
        element.style.setProperty("--mask-position-y", `${Math.round(y)}px`);
      };

      const initialPosition = {
        x: isViewportBound ? window.innerWidth / 2 : element.clientWidth / 2,
        y: isViewportBound ? window.innerHeight / 2 : element.clientHeight / 2,
      };

      targetPositionRef.current = initialPosition;
      smoothPositionRef.current = initialPosition;
      setMaskPosition(initialPosition.x, initialPosition.y);

      const updateSmoothPosition = () => {
        const previous = smoothPositionRef.current;
        const deltaX = targetPositionRef.current.x - previous.x;
        const deltaY = targetPositionRef.current.y - previous.y;
        const easingFactor = 0.05;

        if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5) {
          smoothPositionRef.current = targetPositionRef.current;
          setMaskPosition(targetPositionRef.current.x, targetPositionRef.current.y);
          animationFrameRef.current = undefined;
          return;
        }

        const nextPosition = {
          x: previous.x + deltaX * easingFactor,
          y: previous.y + deltaY * easingFactor,
        };

        smoothPositionRef.current = nextPosition;
        setMaskPosition(nextPosition.x, nextPosition.y);
        animationFrameRef.current = requestAnimationFrame(updateSmoothPosition);
      };

      const startAnimation = () => {
        if (animationFrameRef.current == null) {
          animationFrameRef.current = requestAnimationFrame(updateSmoothPosition);
        }
      };

      const handleMouseMove = (event: MouseEvent) => {
        if (isViewportBound) {
          targetPositionRef.current = {
            x: event.clientX,
            y: event.clientY,
          };
          startAnimation();
          return;
        }

        const rect = element.getBoundingClientRect();
        targetPositionRef.current = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
        startAnimation();
      };

      document.addEventListener("mousemove", handleMouseMove, { passive: true });

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        document.removeEventListener("mousemove", handleMouseMove);
      };
    }, [mask.cursor, position]);

    const maskStyle = (): CSSProperties => {
      if (!mask) return {};

      if (mask.cursor) {
        return {
          "--mask-position-x": "50%",
          "--mask-position-y": "50%",
          "--mask-radius": `${mask.radius || 50}vh`,
        } as CSSProperties;
      }

      if (mask.x != null && mask.y != null) {
        return {
          "--mask-position-x": `${mask.x}%`,
          "--mask-position-y": `${mask.y}%`,
          "--mask-radius": `${mask.radius || 50}vh`,
        } as CSSProperties;
      }

      return {};
    };

    const remap = (
      value: number,
      inputMin: number,
      inputMax: number,
      outputMin: number,
      outputMax: number,
    ) => {
      return ((value - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) + outputMin;
    };

    const adjustedX = gradient.x != null ? remap(gradient.x, 0, 100, 37.5, 62.5) : 50;
    const adjustedY = gradient.y != null ? remap(gradient.y, 0, 100, 37.5, 62.5) : 50;
    const fixedViewportStyle =
      position === "fixed"
        ? ({
            position: "fixed",
            inset: 0,
            width: "100vw",
            height: "100vh",
          } satisfies CSSProperties)
        : undefined;

    return (
      <Flex
        ref={backgroundRef}
        fill
        position={position}
        className={classNames(hasMask && styles.mask, className)}
        top="0"
        left="0"
        zIndex={0}
        overflow="hidden"
        style={{
          ...fixedViewportStyle,
          ...maskStyle(),
          ...style,
        }}
        {...rest}
      >
        {gradient.display && (
          <Flex
            position="absolute"
            className={styles.gradient}
            opacity={gradient.opacity}
            pointerEvents="none"
            style={{
              ["--gradient-position-x" as string]: `${adjustedX}%`,
              ["--gradient-position-y" as string]: `${adjustedY}%`,
              ["--gradient-width" as string]:
                gradient.width != null ? `${gradient.width / 4}%` : "25%",
              ["--gradient-height" as string]:
                gradient.height != null ? `${gradient.height / 4}%` : "25%",
              ["--gradient-tilt" as string]: gradient.tilt != null ? `${gradient.tilt}deg` : "0deg",
              ["--gradient-color-start" as string]: gradient.colorStart
                ? `var(--${gradient.colorStart})`
                : "var(--brand-solid-strong)",
              ["--gradient-color-end" as string]: gradient.colorEnd
                ? `var(--${gradient.colorEnd})`
                : "var(--brand-solid-weak)",
            }}
          />
        )}
        {dots.display && (
          <Flex
            position="absolute"
            top="0"
            left="0"
            fill
            pointerEvents="none"
            className={styles.dots}
            opacity={dots.opacity}
            style={
              {
                "--dots-color": `var(--${dotsColor})`,
                "--dots-size": dotsSize,
              } as React.CSSProperties
            }
          />
        )}
        {lines.display && (
          <Flex
            position="absolute"
            top="0"
            left="0"
            fill
            pointerEvents="none"
            className={styles.lines}
            opacity={lines.opacity}
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, var(--brand-on-background-weak) 0, var(--brand-on-background-weak) 0.5px, var(--static-transparent) 0.5px, var(--static-transparent) ${dots.size})`,
            }}
          />
        )}
        {grid.display && (
          <Flex
            position="absolute"
            top="0"
            left="0"
            fill
            pointerEvents="none"
            className={styles.grid}
            opacity={grid.opacity}
            style={{
              backgroundSize: `
                ${grid.width || "var(--static-space-32)"}
                ${grid.height || "var(--static-space-32)"}`,
              backgroundPosition: "0 0",
              backgroundImage: `
                linear-gradient(
                  90deg,
                  var(--${grid.color || "brand-on-background-weak"}) 0,
                  var(--${grid.color || "brand-on-background-weak"}) 1px,
                  var(--static-transparent) 1px,
                  var(--static-transparent) ${grid.width || "var(--static-space-32)"}
                ),
                linear-gradient(
                  0deg,
                  var(--${grid.color || "brand-on-background-weak"}) 0,
                  var(--${grid.color || "brand-on-background-weak"}) 1px,
                  var(--static-transparent) 1px,
                  var(--static-transparent) ${grid.height || "var(--static-space-32)"}
                )
              `,
            }}
          />
        )}
        {children}
      </Flex>
    );
  },
);

Background.displayName = "Background";

export { Background };
