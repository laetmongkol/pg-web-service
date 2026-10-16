import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import type { Metadata } from "next"

import { COMPANY_SLUGS, getCompany, pick } from "@/companies/companies"
import CompanyPage from "@/features/company/company-page"
import { SITE } from "@/shared/constants/site.constants"

interface PageProps {
  params: Promise<{ locale: string; company: string }>
}

// One static page per company per locale (the locale comes from the parent segment).
export function generateStaticParams() {
  return COMPANY_SLUGS.map((company) => ({ company }))
}
export const dynamicParams = false

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, company: slug } = await params
  const company = getCompany(slug)
  if (!company) return {}
  const name = pick(company.name, locale)
  return {
    title: { absolute: `${name} — ${pick(company.tagline, locale)}` },
    description: pick(company.content.hero.lead, locale),
    // Concept sites for the group's companies, hosted on the PG domain: keep them out of search.
    robots: { index: false, follow: false },
    alternates: { canonical: `${SITE.url}/${locale}/${slug}/` },
  }
}

export default async function CompanyRoute({ params }: PageProps) {
  const { locale, company: slug } = await params
  setRequestLocale(locale)
  const company = getCompany(slug)
  if (!company) notFound()
  return <CompanyPage company={company} locale={locale} />
}
