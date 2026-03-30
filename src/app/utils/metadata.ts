import type { Metadata } from "next";

import { absoluteUrl } from "@/app/resources";

type PageMetadataOptions = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
};

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);

const normalizePath = (path = "/") => {
  if (!path || path === "/") {
    return "/";
  }

  return path.startsWith("/") ? path : `/${path}`;
};

export function toAbsoluteUrl(path?: string) {
  if (!path) {
    return undefined;
  }

  return isAbsoluteUrl(path) ? path : absoluteUrl(path);
}

export function createOgImageUrl(title: string) {
  return `${absoluteUrl("/og")}?title=${encodeURIComponent(title)}`;
}

export function createMetadata({
  title,
  description,
  path = "/",
  image,
  type = "website",
  publishedTime,
}: PageMetadataOptions): Metadata {
  const canonicalPath = normalizePath(path);
  const ogImage = toAbsoluteUrl(image) ?? createOgImageUrl(title);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      type,
      url: canonicalPath,
      images: [
        {
          url: ogImage,
          alt: title,
        },
      ],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
