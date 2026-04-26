import "@/once-ui/styles/index.scss";
import "@/once-ui/tokens/index.scss";

import classNames from "classnames";
import type { Metadata } from "next";

import { PortfolioChrome } from "@/components/PortfolioChrome";
import { absoluteUrl, siteOrigin, style } from "@/app/resources";
import { createOgImageUrl } from "@/app/utils/metadata";

import { Inter } from "next/font/google";
import { Source_Code_Pro } from "next/font/google";

import { person, home, social } from "@/app/resources/content";
import { Column, Flex, ToastProvider } from "@/once-ui/components";

export async function generateMetadata(): Promise<Metadata> {
  const ogImage = createOgImageUrl(home.title);
  const googleVerification = process.env.GOOGLE_SITE_VERIFICATION;

  return {
    metadataBase: new URL(siteOrigin),
    title: home.title,
    description: home.description,
    applicationName: home.title,
    alternates: {
      canonical: "/",
    },
    authors: [
      {
        name: person.name,
        url: absoluteUrl("/about"),
      },
    ],
    creator: person.name,
    publisher: person.name,
    category: "technology",
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [{ url: "/favicon.ico" }],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    openGraph: {
      title: home.title,
      description: home.description,
      url: "/",
      siteName: home.title,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: ogImage,
          alt: home.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: home.title,
      description: home.description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    ...(googleVerification
      ? {
          verification: {
            google: googleVerification,
          },
        }
      : {}),
  };
}

const primary = Inter({
  variable: "--font-primary",
  subsets: ["latin"],
  display: "swap",
});

const code = Source_Code_Pro({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const sameAs = social
    .filter((item) => item.link && !item.link.startsWith("mailto:"))
    .map((item) => item.link);

  const structuredData = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: home.title,
      url: siteOrigin,
      description: home.description,
      publisher: {
        "@type": "Person",
        name: person.name,
        url: absoluteUrl("/about"),
        image: absoluteUrl(person.avatar),
        sameAs,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: person.name,
      url: absoluteUrl("/about"),
      image: absoluteUrl(person.avatar),
      jobTitle: person.role,
      sameAs,
      knowsLanguage: person.languages,
    },
  ]);

  return (
    <Flex
      as="html"
      lang="en"
      background="page"
      data-neutral={style.neutral}
      data-brand={style.brand}
      data-accent={style.accent}
      data-solid={style.solid}
      data-solid-style={style.solidStyle}
      data-theme={style.theme}
      data-border={style.border}
      data-surface={style.surface}
      data-transition={style.transition}
      className={classNames(
        primary.variable,
        code.variable,
      )}
    >
      <ToastProvider>
        <Column style={{ minHeight: "100vh" }} as="body" fillWidth margin="0" padding="0">
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: structuredData }}
          />
          <PortfolioChrome>{children}</PortfolioChrome>
        </Column>
      </ToastProvider>
    </Flex>
  );
}
