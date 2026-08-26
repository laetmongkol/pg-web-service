import { getSiteUrl } from "@/lib/seo/metadata"

import { ORGANIZATION, SEO_DEFAULT_LOCALE, SERVICE } from "@/shared/constants/seo.constants"

type JsonLdObject = Record<string, unknown>

/** Stable @id for the Organization node so other nodes can reference it. */
export function organizationId(): string {
  return `${getSiteUrl()}/#organization`
}

export function buildOrganizationJsonLd(): JsonLdObject {
  const base = getSiteUrl()
  const logo = `${base}${ORGANIZATION.logoPath}`
  return {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "@id": organizationId(),
    name: ORGANIZATION.name,
    alternateName: ORGANIZATION.alternateName,
    legalName: ORGANIZATION.legalName,
    description: ORGANIZATION.description,
    url: base,
    logo,
    image: logo,
    // The site itself belongs in sameAs, but as the resolved origin — a hardcoded one goes
    // stale the moment the primary host changes (www -> apex), which it did.
    sameAs: [base, ...ORGANIZATION.sameAs],
    ...(ORGANIZATION.knowsAbout.length ? { knowsAbout: ORGANIZATION.knowsAbout } : {}),
  }
}

export function buildWebSiteJsonLd(): JsonLdObject {
  const base = getSiteUrl()
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${base}/#website`,
    url: base,
    name: ORGANIZATION.name,
    publisher: { "@id": organizationId() },
    inLanguage: SEO_DEFAULT_LOCALE,
  }
}

export function buildServiceJsonLd(): JsonLdObject {
  const base = getSiteUrl()
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${base}/#service`,
    name: SERVICE.name,
    serviceType: SERVICE.serviceType,
    description: SERVICE.description,
    provider: { "@id": organizationId() },
  }
}

type BreadcrumbItem = { name: string; url: string }

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

type ArticleInput = {
  url: string
  headline: string
  description?: string
  image?: string
  datePublished?: string
  dateModified?: string
  authorName?: string
}

export function buildArticleJsonLd(input: ArticleInput): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: { "@type": "WebPage", "@id": input.url },
    headline: input.headline,
    ...(input.description ? { description: input.description } : {}),
    ...(input.image ? { image: [input.image] } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    dateModified: input.dateModified ?? input.datePublished,
    ...(input.authorName ? { author: { "@type": "Person", name: input.authorName } } : {}),
    publisher: { "@id": organizationId() },
  }
}
