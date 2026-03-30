import type { MetadataRoute } from "next";

import { getPosts } from "@/app/utils/utils";
import { absoluteUrl, routes as routesConfig } from "@/app/resources";

function normalizeLastModified(value?: string) {
  if (!value) {
    return undefined;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed.toISOString().split("T")[0];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = getPosts(["src", "app", "blog", "posts"]).map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: normalizeLastModified(post.metadata.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const works = getPosts(["src", "app", "work", "projects"]).map((post) => ({
    url: absoluteUrl(`/work/${post.slug}`),
    lastModified: normalizeLastModified(post.metadata.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const activeRoutes = Object.keys(routesConfig).filter((route) => routesConfig[route]);

  const routes = activeRoutes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: route === "/" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "/" ? 1 : 0.8,
  }));

  return [...routes, ...blogs, ...works];
}
