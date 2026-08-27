import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"

import { routing } from "@/i18n/routing"

interface LanguageLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

// Pre-render one tree per known locale; 404 any other segment natively.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
export const dynamicParams = false

const LanguageLayout = async ({ children, params }: LanguageLayoutProps) => {
  const { locale } = await params

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}

export default LanguageLayout
