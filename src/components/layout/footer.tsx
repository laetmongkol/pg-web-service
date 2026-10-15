import { getTranslations } from "next-intl/server"

import Logo from "@/components/brand/logo"

type Service = { name: string }

export default async function Footer() {
  const t = await getTranslations("footer")
  const nav = await getTranslations("nav")
  const services = (await getTranslations("services")).raw("items") as Service[]

  const links = [
    { href: "#about", label: nav("about") },
    { href: "#services", label: nav("services") },
    { href: "#why", label: nav("why") },
    { href: "#contact", label: nav("cta") },
  ]

  return (
    <footer className="relative z-20 border-t border-ivory/10 bg-night-950 text-ivory">
      <div className="mx-auto max-w-[1440px] px-4 pt-16 pb-10 md:px-[72px]">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo tone="ivory" width={150} />
            <p className="mt-8 max-w-md text-[19px] leading-8 font-semibold">{t("about")}</p>
            <p className="mt-4 font-mono text-[12px] text-coral">{t("tagline")}</p>
          </div>
          <div className="lg:col-span-4">
            <p className="font-mono text-[12px] text-coral">{t("services")}</p>
            <ul className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3 text-[15px] text-stone">
              {services.map((s) => (
                <li key={s.name}>{s.name}</li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-3">
            <p className="font-mono text-[12px] text-coral">{t("navigation")}</p>
            <ul className="mt-5 grid gap-3 text-[15px]">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-stone hover:text-ivory">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-4 border-t border-ivory/15 pt-8 md:flex-row md:items-end md:justify-between">
          <p className="text-[56px] leading-none font-semibold tracking-[-0.02em] md:text-[72px]">PG Solution.</p>
          <p className="font-mono text-[11px] text-muted">{t("rights")}</p>
        </div>
      </div>
    </footer>
  )
}
