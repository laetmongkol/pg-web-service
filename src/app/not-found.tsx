import Link from "next/link"

import { anuphan, jetbrains } from "@/app/fonts"
import { routing } from "@/i18n/routing"

export default function NotFound() {
  // Root layout renders no <html>; URLs outside a locale land here and need their own document.
  return (
    <html lang={routing.defaultLocale} className={`${anuphan.variable} ${jetbrains.variable}`}>
      <body>
        <main className="flex min-h-screen items-center bg-ink px-6 text-ivory">
          <div className="mx-auto w-full max-w-2xl">
            <p className="font-mono text-label text-coral">404</p>
            <h1 className="mt-4 text-h1 font-semibold">ไม่พบหน้านี้</h1>
            <p className="mt-4 text-body text-stone">หน้าที่คุณเปิดอาจถูกย้ายหรือไม่มีอยู่แล้ว</p>
            <Link
              href={`/${routing.defaultLocale}`}
              className="mt-10 inline-flex h-12 items-center rounded-control bg-coral px-6 font-medium text-ink"
            >
              กลับหน้าแรก
            </Link>
          </div>
        </main>
      </body>
    </html>
  )
}
