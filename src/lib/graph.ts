export interface Wikilink {
  rawText: string;
  targetSlug: string;
  displayText: string;
}

const wikilinkPattern = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

export function parseWikilinks(markdown: string): Wikilink[] {
  return Array.from(markdown.matchAll(wikilinkPattern)).map((match) => {
    const targetSlug = normalizeTargetSlug(match[1]);
    const displayText = (match[2] ?? targetSlug).trim();

    return {
      rawText: match[0],
      targetSlug,
      displayText
    };
  });
}

export function replaceWikilinks(markdown: string): string {
  return markdown
    .split(/(```[\s\S]*?```|`[^`\n]*`)/g)
    .map((segment) => {
      if (segment.startsWith("`")) {
        return segment;
      }

      return replaceWikilinksInText(segment);
    })
    .join("");
}

function replaceWikilinksInText(markdown: string): string {
  return markdown.replace(wikilinkPattern, (_raw, target: string, display?: string) => {
    const targetSlug = normalizeTargetSlug(target);
    const label = escapeMarkdownLinkLabel((display ?? targetSlug).trim());

    return `[${label}](/posts/${encodeURIComponent(targetSlug)})`;
  });
}

function normalizeTargetSlug(value: string): string {
  return value.trim();
}

function escapeMarkdownLinkLabel(value: string): string {
  return value.replaceAll("[", "\\[").replaceAll("]", "\\]");
}
