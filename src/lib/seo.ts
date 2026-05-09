export const siteName = "Library Archive";
export const defaultDescription =
  "A search-first personal Markdown knowledge archive for technical notes and references.";

const fallbackSiteUrl = "http://localhost:4321";

export function getSiteUrl(): string {
  const url = process.env.SITE_URL ?? fallbackSiteUrl;

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
