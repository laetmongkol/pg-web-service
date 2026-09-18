import { Toaster } from "react-hot-toast"
import { Noto_Sans_Thai, Roboto } from "next/font/google"
import { getLocale } from "next-intl/server"

import { buildOrganizationJsonLd, buildServiceJsonLd, buildWebSiteJsonLd } from "@/lib/seo/json-ld"
import { createRootMetadata } from "@/lib/seo/metadata"
import cn from "@/lib/tw-merge"

import JsonLd from "@/components/json-ld.component"

import AppProvider from "@/app/app-provider"

import "./globals.css"

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

const notoThai = Noto_Sans_Thai({
  variable: "--font-thai",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

export const metadata = createRootMetadata()

// Runs before React hydration to apply the saved theme class, preventing FOUC.
// Reads localStorage first (user preference), then the cookie set by middleware.
const themeInitScript = `(function(){try{var t=localStorage.getItem('preferred-theme')||document.cookie.split(';').find(function(c){return c.trim().startsWith('theme=')})?.split('=')[1]?.trim()||'light';document.documentElement.classList.add(t==='dark'?'dark':'light')}catch(e){}})()`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // getLocale() reads the locale set by next-intl middleware from the request header.
  // This keeps the HTML lang attribute in sync with the active URL locale for SEO.
  const locale = await getLocale()

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={cn(`${roboto.variable} ${notoThai.variable} h-full antialiased overflow-y-auto`)}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <JsonLd data={[buildOrganizationJsonLd(), buildWebSiteJsonLd(), buildServiceJsonLd()]} />
      </head>
      <body className={cn("min-h-[600px] w-full flex flex-col bg-(--surface-page)")}>
        <AppProvider>
          {children}
          <Toaster position="top-right" reverseOrder />
        </AppProvider>
      </body>
    </html>
  )
}
