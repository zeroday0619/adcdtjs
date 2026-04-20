import type { Metadata, MetadataRoute } from "next";

export const siteConfig = {
  shortTitle: "AEJIS",
  title: "AEJIS Certificate Issuer",
  description:
    "Create an Acute Episode of Japan Ikitai Syndrome certificate with live PDF preview, optional redaction, and print-ready A4 output.",
  keywords: [
    "AEJIS",
    "AEJIS certificate generator",
    "Acute Episode of Japan Ikitai Syndrome",
    "Acute Episode of Japan Ikitai Syndrome certificate generator",
    "Japan Ikitai Syndrome",
    "Japan Ikitai Syndrome certificate generator",
  ],
  author: {
    name: "zeroday0619",
    url: "https://github.com/zeroday0619",
    handle: "@zeroday0619",
  },
} as const;

class SiteDocumentFactory {
  constructor(
    private readonly config: typeof siteConfig,
    private readonly originResolver: () => string,
  ) {}

  getSiteOrigin() {
    return this.originResolver();
  }

  buildMetadata(): Metadata {
    return {
      metadataBase: new URL(this.getSiteOrigin()),
      title: {
        default: this.config.title,
        template: `%s | ${this.config.shortTitle}`,
      },
      description: this.config.description,
      applicationName: this.config.shortTitle,
      alternates: {
        canonical: "/",
      },
      keywords: [...this.config.keywords],
      category: "entertainment",
      authors: [{ name: this.config.author.name, url: this.config.author.url }],
      creator: this.config.author.name,
      publisher: this.config.author.name,
      openGraph: {
        type: "website",
        locale: "en_US",
        url: "/",
        siteName: this.config.shortTitle,
        title: this.config.title,
        description: this.config.description,
      },
      twitter: {
        card: "summary_large_image",
        title: this.config.title,
        description: this.config.description,
        creator: this.config.author.handle,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      },
    };
  }

  buildWebApplicationJsonLd() {
    return {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: this.config.shortTitle,
      applicationCategory: "EntertainmentApplication",
      operatingSystem: "Web",
      isAccessibleForFree: true,
      url: this.getSiteOrigin(),
      description: this.config.description,
      author: {
        "@type": "Person",
        name: this.config.author.name,
        url: this.config.author.url,
      },
    };
  }

  buildRobotsMetadata(): MetadataRoute.Robots {
    const siteOrigin = this.getSiteOrigin();

    return {
      rules: {
        userAgent: "*",
        allow: "/",
      },
      sitemap: `${siteOrigin}/sitemap.xml`,
      host: siteOrigin,
    };
  }

  buildSitemapMetadata(): MetadataRoute.Sitemap {
    return [
      {
        url: this.getSiteOrigin(),
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 1,
      },
    ];
  }
}

let siteDocumentFactory: SiteDocumentFactory | null = null;

function getSiteDocumentFactory() {
  if (!siteDocumentFactory) {
    siteDocumentFactory = new SiteDocumentFactory(siteConfig, getSiteOrigin);
  }

  return siteDocumentFactory;
}

export function buildSiteMetadata(): Metadata {
  return getSiteDocumentFactory().buildMetadata();
}

export function buildWebApplicationJsonLd() {
  return getSiteDocumentFactory().buildWebApplicationJsonLd();
}

export function buildRobotsMetadata(): MetadataRoute.Robots {
  return getSiteDocumentFactory().buildRobotsMetadata();
}

export function buildSitemapMetadata(): MetadataRoute.Sitemap {
  return getSiteDocumentFactory().buildSitemapMetadata();
}

export function getSiteOrigin() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!siteUrl) {
    return "http://localhost:3000";
  }

  return siteUrl.replace(/\/+$/, "");
}
