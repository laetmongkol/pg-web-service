import { routing } from "@/i18n/routing"

const target = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/${routing.defaultLocale}/`

// Static hosting has no server-side redirect; forward "/" to the default locale in the browser.
export default function RootRedirect() {
  return (
    <html lang={routing.defaultLocale}>
      <head>
        <meta httpEquiv="refresh" content={`0; url=${target}`} />
        <link rel="canonical" href={target} />
      </head>
      <body>
        <a href={target}>PG Solution</a>
      </body>
    </html>
  )
}
