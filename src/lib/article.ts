/**
 * Helpers for rendering long-form blog HTML that arrives from the admin panel.
 *
 * Blog bodies are stored as raw HTML in the API, so anything we want on top of
 * them (anchor links, a table of contents, a reading-time estimate) has to be
 * derived from that HTML here, on the server, before it is handed to the page.
 * Doing it server-side keeps the finished markup in the initial HTML response,
 * which is what search engines index.
 */

/** AZ/RU letters → ASCII, so headings produce clean, stable anchor ids. */
const TRANSLIT: Record<string, string> = {
  ə: 'e', ı: 'i', ö: 'o', ü: 'u', ğ: 'g', ş: 's', ç: 'c',
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh',
  з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
  п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts',
  ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu',
  я: 'ya',
};

const stripTags = (html: string) =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

export const slugifyHeading = (text: string) =>
  text
    .toLowerCase()
    .split('')
    .map((ch) => TRANSLIT[ch] ?? ch)
    .join('')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60);

export interface ArticleHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface PreparedArticle {
  /** Body HTML with `id` attributes injected into every h2/h3. */
  html: string;
  /** Flat list of headings, used to build the table of contents. */
  headings: ArticleHeading[];
}

/**
 * Inject anchor ids into h2/h3 tags and collect them for the table of contents.
 * Headings that already carry an `id` are left untouched so the admin can pin a
 * specific anchor by hand.
 */
export function prepareArticle(html: string): PreparedArticle {
  const headings: ArticleHeading[] = [];
  const used = new Set<string>();

  const withIds = html.replace(
    /<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi,
    (match, tag: string, attrs: string, inner: string) => {
      const text = stripTags(inner);
      if (!text) return match;

      const existing = /\bid\s*=\s*["']([^"']+)["']/i.exec(attrs);
      let id = existing?.[1] ?? slugifyHeading(text);
      if (!id) id = `bolme-${headings.length + 1}`;

      // Two headings can slugify to the same string — keep ids unique.
      let unique = id;
      let n = 2;
      while (used.has(unique)) unique = `${id}-${n++}`;
      used.add(unique);

      headings.push({
        id: unique,
        text,
        level: tag.toLowerCase() === 'h2' ? 2 : 3,
      });

      const cleanAttrs = existing ? attrs.replace(existing[0], '') : attrs;
      return `<${tag}${cleanAttrs} id="${unique}">${inner}</${tag}>`;
    },
  );

  return { html: withIds, headings };
}

/**
 * Rounded-up reading time in minutes. 190 wpm is a reasonable average for the
 * mixed AZ/EN/RU prose on this site; the number only has to be plausible.
 */
export function readingMinutes(html: string): number {
  const words = stripTags(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 190));
}

export { stripTags };
