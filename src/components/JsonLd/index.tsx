import type { SchemaNode } from '@/lib/schema';

interface JsonLdProps {
  /** One schema.org node, or several to emit as separate blocks. */
  data: SchemaNode | (SchemaNode | null)[] | null;
}

/**
 * Renders schema.org JSON-LD.
 *
 * Server component on purpose: the markup has to be in the HTML Google
 * receives, not injected after hydration.
 *
 * `<` is escaped to `<` so a stray "</script>" inside restaurant or dish
 * text — user-editable content — cannot close the tag early and inject markup.
 */
export default function JsonLd({ data }: JsonLdProps) {
  const nodes = (Array.isArray(data) ? data : [data]).filter(
    (n): n is SchemaNode => Boolean(n),
  );
  if (!nodes.length) return null;

  return (
    <>
      {nodes.map((node, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(node).replace(/</g, '\\u003c'),
          }}
        />
      ))}
    </>
  );
}
