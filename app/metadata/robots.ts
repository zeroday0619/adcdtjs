import type { MetadataRoute } from "next";

import { buildRobotsMetadata } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return buildRobotsMetadata();
}
