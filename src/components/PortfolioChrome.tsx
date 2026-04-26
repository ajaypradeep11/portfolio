"use client";

import { usePathname } from "next/navigation";

import { Footer, Header, RouteGuard } from "@/components";
import { effects } from "@/app/resources";
import { Background, Column, Flex } from "@/once-ui/components";

interface PortfolioChromeProps {
  children: React.ReactNode;
}

export function PortfolioChrome({ children }: PortfolioChromeProps) {
  const pathname = usePathname() ?? "";

  if (pathname.startsWith("/marriages")) {
    return <>{children}</>;
  }

  return (
    <Column as="div" fillWidth margin="0" padding="0">
      <Background
        mask={{
          cursor: effects.mask.cursor,
          x: effects.mask.x,
          y: effects.mask.y,
          radius: effects.mask.radius,
        }}
        gradient={{
          display: effects.gradient.display,
          x: effects.gradient.x,
          y: effects.gradient.y,
          width: effects.gradient.width,
          height: effects.gradient.height,
          tilt: effects.gradient.tilt,
          colorStart: effects.gradient.colorStart,
          colorEnd: effects.gradient.colorEnd,
          opacity: effects.gradient.opacity as any,
        }}
        dots={{
          display: effects.dots.display,
          color: effects.dots.color,
          size: effects.dots.size as any,
          opacity: effects.dots.opacity as any,
        }}
        grid={{
          display: effects.grid.display,
          color: effects.grid.color,
          width: effects.grid.width as any,
          height: effects.grid.height as any,
          opacity: effects.grid.opacity as any,
        }}
        lines={{
          display: effects.lines.display,
          opacity: effects.lines.opacity as any,
        }}
      />
      <Flex fillWidth minHeight="16" />
      <Header />
      <Flex
        as="main"
        position="relative"
        zIndex={0}
        fillWidth
        paddingY="l"
        paddingX="l"
        horizontal="center"
        flex={1}
      >
        <Flex horizontal="center" fillWidth minHeight="0">
          <RouteGuard>{children}</RouteGuard>
        </Flex>
      </Flex>
      <Footer />
    </Column>
  );
}
