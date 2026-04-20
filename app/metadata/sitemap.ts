import type { MetadataRoute } from "next";

import { buildSitemapMetadata } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapMetadata();
}
