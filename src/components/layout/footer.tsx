import { getTranslations } from "next-intl/server"

import { IoLogoInstagram, IoLogoLinkedin } from "react-icons/io5"

import cn from "@/lib/tw-merge"
import { BUTTON_SCALE_CLASSNAME } from "@/shared/ui/classes/base.classes"

import FillImage from "@/components/fill-image.component"
import LinkCustom from "@/components/link-custom.component"

import type { ComponentType } from "react"

import { LANGUAGE } from "@/shared/constants/common.constants"
import { NAV_LINKS } from "@/shared/constants/nav-links.constants"

interface FooterProps {
  language?: LANGUAGE
}

/** footer.services.item1..n — the services column, one translate_values key per line. */
const SERVICE_ITEM_KEYS = ["footer.services.item1", "footer.services.item2", "footer.services.item3", "footer.services.item4", "footer.services.item5", "footer.services.item6"]

interface FooterSocialItem {
  label: string
  href: string
  Icon: ComponentType<{ className?: string }>
}

const SOCIAL_LINKS: FooterSocialItem[] = [
  { label: "Instagram", href: "#", Icon: IoLogoInstagram },
  { label: "LinkedIn", href: "#", Icon: IoLogoLinkedin },
]

const HEADING_CLASSNAME = "text-sm font-semibold text-(--text-on-dark)"
const BODY_CLASSNAME = "text-sm leading-relaxed text-(--text-body-on-dark)"
const BODY_LINK_CLASSNAME = cn(BODY_CLASSNAME, "transition-colors hover:text-(--text-on-dark)")

export default async function Footer({ language = LANGUAGE.TH }: FooterProps) {
  const t = await getTranslations()
  // A missing key renders nothing instead of the raw key name.
  const tr = (key: string) => (t.has(key) ? t(key).trim() : "")

  const services = SERVICE_ITEM_KEYS.map(tr).filter(Boolean)
  const email = tr("footer.contact.email")
  const phone = tr("footer.contact.phone")

  return (
    <footer className="w-full bg-(--section-dark) px-2 pb-2 sm:px-3 sm:pb-3 lg:px-4 lg:pb-4">
      <div
        className={cn(
          "relative isolate overflow-hidden rounded-[1.75rem] sm:rounded-[2.25rem]",
          "border border-(--border-on-dark) bg-(--section-dark) text-(--text-on-dark)",
        )}
      >
        {/* Top glow — near-white along the top rim, primary blue under it */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 -z-10",
            "bg-[image:var(--glow-footer-top)]",
          )}
        />
        {/* Dark bowl — the hero's arc turned upside down: deep at the centre, climbing at the sides */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute left-1/2 top-[12%] -z-10 h-[150%] w-[122%] -translate-x-1/2",
            "bg-[radial-gradient(closest-side,var(--section-dark)_80%,transparent_100%)]",
            "blur-xl",
          )}
        />

        <div className="mx-auto max-w-7xl px-6 pb-8 pt-24 sm:px-10 lg:pt-28">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:gap-8">
            <div className="flex flex-col items-start">
              <LinkCustom href={`/${language}`} className="flex items-center gap-3">
                <FillImage
                  draggable={false}
                  src={"/PIPEvolution.png"}
                  alt=""
                  width={40}
                  height={40}
                  sizes="40px"
                  wrapperClassName="size-9 shrink-0 overflow-hidden rounded-lg"
                  className="object-cover"
                />
                <span className="text-2xl font-bold">{tr("footer.brandName")}</span>
              </LinkCustom>
              <p className={cn("mt-5 whitespace-pre-line", BODY_CLASSNAME)}>{tr("footer.brandDescription")}</p>

              <div className="mt-8 flex items-center gap-4">
                {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                  <LinkCustom
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={cn("text-(--text-body-on-dark) hover:text-(--text-on-dark)", BUTTON_SCALE_CLASSNAME)}
                  >
                    <Icon className="size-6" />
                  </LinkCustom>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <h3 className={HEADING_CLASSNAME}>{tr("footer.navigation.title")}</h3>
              <ul className="mt-5 flex flex-col gap-3">
                {NAV_LINKS.map(({ key, href }) => (
                  <li key={key}>
                    <LinkCustom href={`/${language}${href ? `/${href}` : ""}`} className={BODY_LINK_CLASSNAME}>
                      {t(key)}
                    </LinkCustom>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col">
              <h3 className={HEADING_CLASSNAME}>{tr("footer.services.title")}</h3>
              <ul className="mt-5 flex flex-col gap-3">
                {services.map((service) => (
                  <li key={service}>
                    <LinkCustom href={`/${language}/services`} className={BODY_LINK_CLASSNAME}>
                      {service}
                    </LinkCustom>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col">
              <h3 className={HEADING_CLASSNAME}>{tr("footer.contact.title")}</h3>
              <ul className="mt-5 flex flex-col gap-3">
                <li className={cn(BODY_CLASSNAME, "whitespace-pre-line")}>{tr("footer.contact.address")}</li>
                {email ? (
                  <li>
                    <LinkCustom href={`mailto:${email}`} className={BODY_LINK_CLASSNAME}>
                      {email}
                    </LinkCustom>
                  </li>
                ) : null}
                {phone ? (
                  <li>
                    <LinkCustom href={`tel:${phone.replace(/\s/g, "")}`} className={BODY_LINK_CLASSNAME}>
                      {phone}
                    </LinkCustom>
                  </li>
                ) : null}
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-(--border-on-dark) pt-4 text-center text-sm text-(--text-body-on-dark)">
            {`© ${new Date().getFullYear()} ${tr("footer.brandName")} ${tr("footer.copyright")}`}
          </div>
        </div>
      </div>
    </footer>
  )
}
