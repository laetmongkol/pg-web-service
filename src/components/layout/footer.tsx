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

/**
 * Mockup copy for PIP Evolution. The footer.* CMS values are still the template brand's, so
 * only the menu labels (navbar.* keys) come from the catalog until those rows are reseeded.
 */
const FOOTER_MOCK = {
  brandName: "PIP Evolution",
  brandDescription:
    "ให้บริการโซลูชันเทคโนโลยีที่ครบวงจร\nด้วยทีมผู้เชี่ยวชาญที่มีประสบการณ์มากกว่า 3 ปี\nพร้อมสนับสนุนธุรกิจของคุณให้เติบโตอย่างยั่งยืน",
  menuTitle: "เมนู",
  servicesTitle: "บริการ",
  services: [
    "ระบบเทรดอัตโนมัติ (EA)",
    "ออกแบบโครงสร้างโปรแกรม",
    "ให้คำปรึกษาด้านการเงิน",
    "วางแผนการเงินเชิงกลยุทธ์",
  ],
  contactTitle: "ติดต่อ",
  address: "72/1 ซ.รามอินทรา 19 แขวงอนุสาวรีย์\nเขตบางเขน กรุงเทพมหานคร 10220",
  email: "pipoffice1001@gmail.com",
  phone: "062 149 2446",
  copyright: "สงวนลิขสิทธิ์",
}

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
                  src={"/PIPEvolution.png"}
                  alt=""
                  width={40}
                  height={40}
                  sizes="40px"
                  wrapperClassName="size-9 shrink-0 overflow-hidden rounded-lg"
                  className="object-cover"
                />
                <span className="text-2xl font-bold">{FOOTER_MOCK.brandName}</span>
              </LinkCustom>
              <p className={cn("mt-5 whitespace-pre-line", BODY_CLASSNAME)}>{FOOTER_MOCK.brandDescription}</p>

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
              <h3 className={HEADING_CLASSNAME}>{FOOTER_MOCK.menuTitle}</h3>
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
              <h3 className={HEADING_CLASSNAME}>{FOOTER_MOCK.servicesTitle}</h3>
              <ul className="mt-5 flex flex-col gap-3">
                {FOOTER_MOCK.services.map((service) => (
                  <li key={service}>
                    <LinkCustom href={`/${language}/services`} className={BODY_LINK_CLASSNAME}>
                      {service}
                    </LinkCustom>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col">
              <h3 className={HEADING_CLASSNAME}>{FOOTER_MOCK.contactTitle}</h3>
              <ul className="mt-5 flex flex-col gap-3">
                <li className={cn(BODY_CLASSNAME, "whitespace-pre-line")}>{FOOTER_MOCK.address}</li>
                <li>
                  <LinkCustom href={`mailto:${FOOTER_MOCK.email}`} className={BODY_LINK_CLASSNAME}>
                    {FOOTER_MOCK.email}
                  </LinkCustom>
                </li>
                <li>
                  <LinkCustom href={`tel:${FOOTER_MOCK.phone.replace(/\s/g, "")}`} className={BODY_LINK_CLASSNAME}>
                    {FOOTER_MOCK.phone}
                  </LinkCustom>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-(--border-on-dark) pt-4 text-center text-sm text-(--text-body-on-dark)">
            {`© ${new Date().getFullYear()} ${FOOTER_MOCK.brandName} ${FOOTER_MOCK.copyright}`}
          </div>
        </div>
      </div>
    </footer>
  )
}
