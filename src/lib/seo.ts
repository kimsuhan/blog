export const siteName = "Library Archive";
export const defaultDescription =
  "A search-first personal Markdown knowledge archive for technical notes and references.";
export const defaultAuthorName = "Library Archive";

const fallbackSiteUrl = "http://localhost:4321";

export function getSiteUrl(): string {
  const url = import.meta.env.SITE_URL ?? fallbackSiteUrl;

  return String(url).replace(/\/$/, "");
}

export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) {
    return pathOrUrl;
  }

  const normalizedPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;

  return `${getSiteUrl()}${normalizedPath}`;
}

export function canonicalUrl(pathOrUrl: string): string {
  return absoluteUrl(pathOrUrl);
}

export function pageTitle(title: string): string {
  return title === siteName ? title : `${title} | ${siteName}`;
}

export interface ArticleJsonLdInput {
  title: string;
  description?: string | null;
  canonical: string;
  publishedAt?: string | null;
  updatedAt?: string | null;
  tags?: string[];
  ogImage?: string | null;
  authorName?: string | null;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function websiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: getSiteUrl(),
    description: defaultDescription,
    potentialAction: {
      "@type": "SearchAction",
      target: `${getSiteUrl()}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function breadcrumbListJsonLd(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url)
    }))
  };
}

export function articleJsonLd(input: ArticleJsonLdInput): Record<string, unknown> {
  const url = canonicalUrl(input.canonical);
  const authorName = input.authorName?.trim() || import.meta.env.SITE_AUTHOR_NAME || defaultAuthorName;
  const publishedAt = input.publishedAt || input.updatedAt || new Date().toISOString();
  const updatedAt = input.updatedAt || publishedAt;
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description || defaultDescription,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url
    },
    datePublished: publishedAt,
    dateModified: updatedAt,
    author: {
      "@type": "Person",
      name: authorName
    },
    publisher: {
      "@type": "Organization",
      name: siteName
    }
  };

  if (input.tags && input.tags.length > 0) {
    jsonLd.keywords = input.tags;
  }

  if (input.ogImage) {
    jsonLd.image = absoluteUrl(input.ogImage);
  }

  return jsonLd;
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
