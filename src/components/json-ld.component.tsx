interface JsonLdProps {
  /** One schema.org node, or an array of nodes. */
  data: Record<string, unknown> | Record<string, unknown>[]
}

/**
 * Renders schema.org structured data as a JSON-LD script tag.
 * Server component — emitted in the static HTML so crawlers read it without JS.
 */
const JsonLd = ({ data }: JsonLdProps) => (
  <script
    type="application/ld+json"
    // Structured data is trusted, build-time/server-generated content.
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
)

export default JsonLd
