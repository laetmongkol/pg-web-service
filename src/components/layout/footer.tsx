import { IoLogoFacebook } from "react-icons/io5"
import { getTranslations } from "next-intl/server"

import { MessageSquare } from "lucide-react"

import { resolveMediaDisplayUrl } from "@/lib/media/media-display-url"
import cn from "@/lib/tw-merge"

import FillImage from "@/components/fill-image.component"
import LinkCustom from "@/components/link-custom.component"

import type { IconType } from "react-icons"

import { LANGUAGE } from "@/shared/constants/common.constants"
import { BLOG_BASE_PATH } from "@/shared/constants/seo.constants";

const LINE_QR_STORAGE_KEY = ""

interface FooterProps {
  language?: LANGUAGE
}

interface FooterLinkItem {
  key: string
  href: string
}

interface FooterSocialItem {
  label: string
  href: string
  icon: IconType
}

const SOCIAL_LINKS: FooterSocialItem[] = [
  { label: "page-path", href: "#", icon: IoLogoFacebook },
]

const COMPANY_LINKS: FooterLinkItem[] = [
  { key: "page-path", href: "#" },
]

const GROUP_COMPANY_LINKS: FooterLinkItem[] = [
  { key: "page-path", href: "#" },
]

const LEGAL_LINKS: FooterLinkItem[] = [
  { key: "page-path", href: "#" },
]
async function FooterLinkList({
  label,
  links,
  language,
}: {
  label: string
  links: FooterLinkItem[]
  language: LANGUAGE
}) {
  const t = await getTranslations()
  return (
    <div className="flex w-1/2 min-w-0 flex-col gap-4">
      <h3 className="text-base font-bold text-white">
        {t(label)}
      </h3>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.key}>
            <LinkCustom
              href={link.href === "#" ? "#" : `/${language}${link.href}`}
              className="text-sm text-white/85 transition-colors hover:text-white"
            >
              {t(link.key)}
            </LinkCustom>
          </li>
        ))}
      </ul>
    </div>
  )
}

function LineQr() {
  const src = resolveMediaDisplayUrl(undefined, LINE_QR_STORAGE_KEY)

  if (!src) {
    return (
      <div
        aria-hidden="true"
        className="h-14 w-14 shrink-0 rounded bg-(--surface-default)"
      />
    )
  }

  return (
    <FillImage
      src={src}
      alt="Line QR"
      wrapperClassName="h-14 w-14 shrink-0 overflow-hidden rounded"
      className="object-cover"
      sizes="300px"
    />
  )
}

export default async function Footer({ language = LANGUAGE.TH }: FooterProps) {
  const t = await getTranslations()

  return (
    <footer className="w-full bg-(--color-primary-350) text-white">
      <div className="mx-auto px-6 py-8">
        <div className="flex w-full flex-col gap-10 lg:flex-row">
          {/* Brand & Socials */}
          <div className="flex w-full flex-col gap-5 lg:w-2/5">
            <h2 className="text-2xl font-bold">Name</h2>
            <p className="max-w-xs text-sm leading-relaxed text-white/85">
              Description
            </p>
            <div className="flex items-center gap-2.5">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <LinkCustom
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-(--surface-default)/15 text-white transition-colors hover:bg-(--surface-default)/25"
                >
                  <Icon size={18} aria-hidden="true" />
                </LinkCustom>
              ))}
            </div>
          </div>

          <div className="flex w-full min-w-0 flex-col gap-4 lg:flex-1 lg:flex-row lg:justify-around">
            <div className="flex w-full min-w-0 flex-row justify-between gap-4 sm:gap-6 lg:w-2/3">
              <FooterLinkList
                label="title"
                links={COMPANY_LINKS}
                language={language}
              />
              <FooterLinkList
                label="title"
                links={GROUP_COMPANY_LINKS}
                language={language}
              />
            </div>

            {/* Support */}
            <div className="flex w-full min-w-0 flex-col gap-4 lg:w-1/3">
              <h3 className="text-base font-bold text-white lg:block hidden">
                title
              </h3>
              <div
                className={cn(
                  "relative overflow-hidden rounded-xl p-4",
                  "border border-(--surface-default)/10 bg-(--surface-default)/10",
                  "backdrop-blur-sm supports-backdrop-filter:backdrop-blur-sm",
                  "shadow-sm shadow-white/10",
                  "flex min-w-0 flex-col gap-4",
                )}
              >
                <div className="relative hidden min-w-0 items-center gap-3 lg:flex">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-(--surface-default)/10">
                    <MessageSquare size={20} className="text-white" />
                  </div>
                  <div className="flex min-w-0 flex-col gap-1">
                    <p className="text-sm font-bold">
                      title
                    </p>
                    <p className="text-sm text-white/75">
                      subtitle
                    </p>
                  </div>
                </div>
                <div className="relative flex min-w-0 items-center gap-3">
                  <LineQr />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex flex-row gap-0.5 lg:hidden">
                      <p className="text-sm font-bold">
                        title
                      </p>
                      <p className="text-sm font-bold text-white">
                        subtitle
                      </p>
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <p className="text-xs leading-relaxed wrap-break-word text-white/85">
                        subtitle
                      </p>
                      <p className="text-xs leading-relaxed wrap-break-word text-white/85">
                        subtitle
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 border-t border-(--surface-default)/20 pt-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-xs text-white/75">
              © {new Date().getFullYear()} rights.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/75">
            {LEGAL_LINKS.map((link) => (
              <LinkCustom
                key={link.key}
                href={t(link.href)}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                {t(link.key)}
              </LinkCustom>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
