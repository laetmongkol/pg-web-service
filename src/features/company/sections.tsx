import Link from "next/link"
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Boxes,
  ChartLine,
  Cloud,
  CodeXml,
  Coins,
  Compass,
  Crosshair,
  Globe,
  GraduationCap,
  Handshake,
  Headset,
  Layers,
  Lightbulb,
  Megaphone,
  PenLine,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react"

import type { CompanyContent, IconKey, L } from "@/companies/types"
import cn from "@/lib/tw-merge"

import { POSES, type SectionId } from "./stage/poses"
import type { Ui } from "./ui"

const ICONS: Record<IconKey, LucideIcon> = {
  strategy: Compass,
  megaphone: Megaphone,
  sparkles: Sparkles,
  pen: PenLine,
  cloud: Cloud,
  bulb: Lightbulb,
  code: CodeXml,
  cubes: Boxes,
  headset: Headset,
  cap: GraduationCap,
  chart: ChartLine,
  shield: ShieldCheck,
  users: Users,
  globe: Globe,
  coins: Coins,
  rocket: Rocket,
  handshake: Handshake,
  target: Crosshair,
  book: BookOpen,
  layers: Layers,
}

export interface SectionCtx {
  /** Resolve a bilingual string for the page locale. */
  t: (l: L) => string
  locale: string
  ui: Ui
}

/** Soft pool of the page colour behind a text column, so copy stays readable over the model. */
const VEIL =
  "relative before:pointer-events-none before:absolute before:-inset-x-24 before:-inset-y-16 before:-z-10 before:bg-[radial-gradient(closest-side,var(--c-veil),transparent)]"

/**
 * One stop of the tour: a full-height block whose text column sits on the side its camera shot
 * leaves free (POSES), so the building is always visible next to what you are reading.
 */
function Block({
  id,
  wide = false,
  className,
  children,
}: {
  id: SectionId
  wide?: boolean
  className?: string
  children: React.ReactNode
}) {
  const side = POSES[id].side
  return (
    <section id={id} data-scene aria-labelledby={`${id}-title`} className={cn("relative flex min-h-svh items-center py-28 md:py-36", className)}>
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-12 lg:px-16">
        <div className={cn(VEIL, "w-full", wide ? "max-w-[780px]" : "max-w-[600px]", side === "right" && "lg:ml-auto")}>
          {children}
        </div>
      </div>
    </section>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-[13px] font-medium text-(--c-primary)">
      <span aria-hidden className="h-px w-8 bg-current" />
      {children}
    </p>
  )
}

function Title({ id, children }: { id: SectionId; children: React.ReactNode }) {
  return (
    <h2
      id={`${id}-title`}
      className="mt-5 font-display text-[clamp(1.9rem,3.6vw,3.25rem)] leading-[1.18] font-semibold text-balance text-(--c-ink)"
    >
      {children}
    </h2>
  )
}

function Lead({ children }: { children: React.ReactNode }) {
  return <p className="mt-5 max-w-[56ch] text-[17px] leading-[1.75] text-(--c-muted)">{children}</p>
}

export function Hero({ c, ctx, name }: { c: CompanyContent["hero"]; ctx: SectionCtx; name: string }) {
  const { t } = ctx
  const title = t(c.title)
  const accent = c.accent ? t(c.accent) : ""
  const at = accent ? title.indexOf(accent) : -1
  return (
    <section id="top" data-scene aria-labelledby="top-title" className="relative flex min-h-svh items-end pt-32 pb-20 md:pb-28">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-12 lg:px-16">
        <div className={cn(VEIL, "max-w-[640px]")}>
          <p className="text-[15px] font-medium text-(--c-muted)">
            {name}
            {name !== t(c.eyebrow) && <span className="block text-[13px] font-normal">{t(c.eyebrow)}</span>}
          </p>
          <h1
            id="top-title"
            className="mt-6 font-display text-[clamp(2.5rem,5.4vw,5.25rem)] leading-[1.08] font-semibold text-balance text-(--c-ink)"
          >
            {at >= 0 ? (
              <>
                {title.slice(0, at)}
                <span className="block text-(--c-primary)">{accent}</span>
                {title.slice(at + accent.length)}
              </>
            ) : (
              title
            )}
          </h1>
          <p className="mt-7 max-w-[46ch] text-[18px] leading-[1.75] text-(--c-muted)">{t(c.lead)}</p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="inline-flex h-13 items-center gap-3 rounded-full bg-(--c-primary) px-7 text-[16px] font-semibold text-(--c-on-primary) transition-transform hover:-translate-y-0.5"
            >
              {t(c.primaryCta)}
              <ArrowUpRight aria-hidden className="size-4" strokeWidth={2} />
            </a>
            <a
              href="#services"
              className="cglass inline-flex h-13 items-center rounded-full px-7 text-[16px] font-medium text-(--c-ink)"
            >
              {t(c.secondaryCta)}
            </a>
          </div>
          <p className="mt-16 flex items-center gap-2 text-[13px] text-(--c-muted) motion-reduce:hidden">
            <ArrowDown aria-hidden className="size-4 animate-bounce text-(--c-primary)" strokeWidth={1.75} />
            {ctx.ui.scroll}
          </p>
        </div>
      </div>
    </section>
  )
}

export function Partners({ c, ctx }: { c: CompanyContent["partners"]; ctx: SectionCtx }) {
  const { t } = ctx
  return (
    <Block id="partners">
      <Label>{t(c.label)}</Label>
      <Title id="partners">{t(c.title)}</Title>
      {c.lead && <Lead>{t(c.lead)}</Lead>}
      {/* A register of names rather than a logo wall: set in the display face, ruled like a ledger. */}
      <ul className="mt-10 grid grid-cols-2 border-t border-(--c-ink)/15 sm:grid-cols-3">
        {c.names.map((n) => (
          <li
            key={n}
            className="border-b border-(--c-ink)/15 py-4 pr-4 font-display text-[clamp(1.05rem,1.6vw,1.35rem)] font-medium text-(--c-ink)/80"
          >
            {n}
          </li>
        ))}
      </ul>
      {c.stat && (
        <p className="mt-8 flex items-baseline gap-4">
          <span className="font-display text-[48px] leading-none font-semibold text-(--c-primary)">{c.stat.value}</span>
          <span className="text-[15px] text-(--c-muted)">{t(c.stat.label)}</span>
        </p>
      )}
    </Block>
  )
}

export function About({ c, ctx }: { c: CompanyContent["about"]; ctx: SectionCtx }) {
  const { t } = ctx
  return (
    <Block id="about">
      <div className="cglass rounded-[28px] p-7 md:p-10">
        <Label>{t(c.label)}</Label>
        <Title id="about">{t(c.title)}</Title>
        <p className="mt-5 text-[16px] leading-[1.8] text-(--c-muted)">{t(c.body)}</p>
        <dl className="mt-9 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-(--c-ink)/12 pt-8">
          {c.stats.map((s) => (
            <div key={s.value + t(s.label)} className="flex flex-col-reverse">
              <dt className="mt-1.5 text-[14px] leading-5 text-(--c-muted)">{t(s.label)}</dt>
              <dd className="font-display text-[clamp(2rem,3vw,2.75rem)] leading-none font-semibold text-(--c-ink)">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      {c.quote && (
        <blockquote className="mt-8 border-l-2 border-(--c-primary) pl-5 font-display text-[clamp(1.15rem,1.8vw,1.5rem)] leading-[1.55] font-medium text-(--c-ink)">
          {t(c.quote)}
        </blockquote>
      )}
    </Block>
  )
}

export function Pillars({ c, ctx }: { c: CompanyContent["pillars"]; ctx: SectionCtx }) {
  const { t } = ctx
  return (
    <Block id="pillars">
      <Label>{t(c.label)}</Label>
      <Title id="pillars">{t(c.title)}</Title>
      {c.lead && <Lead>{t(c.lead)}</Lead>}
      <ul className="mt-10 grid gap-x-8 sm:grid-cols-2">
        {c.items.map((it) => (
          <li key={t(it.title)} className="border-t border-(--c-ink)/15 py-6">
            <p className="font-display text-[20px] leading-7 font-semibold text-(--c-ink)">{t(it.title)}</p>
            <p className="mt-2 text-[15px] leading-[1.7] text-(--c-muted)">{t(it.body)}</p>
          </li>
        ))}
      </ul>
    </Block>
  )
}

export function Services({ c, ctx }: { c: CompanyContent["services"]; ctx: SectionCtx }) {
  const { t } = ctx
  return (
    <Block id="services" wide>
      <Label>{t(c.label)}</Label>
      <Title id="services">{t(c.title)}</Title>
      <Lead>{t(c.lead)}</Lead>
      <ul className="mt-10 grid gap-3 sm:grid-cols-2">
        {c.items.map((it, i) => {
          const Icon = ICONS[it.icon]
          return (
            <li key={t(it.name)} className={cn("cglass rounded-[22px] p-6", i === 0 && "sm:row-span-2 sm:flex sm:flex-col")}>
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-11 place-items-center rounded-2xl bg-(--c-primary) text-(--c-on-primary)">
                  <Icon aria-hidden className="size-5" strokeWidth={1.75} />
                </span>
                {it.tag && <span className="text-[12px] text-(--c-muted)">{it.tag}</span>}
              </div>
              <p className={cn("mt-6 font-display text-[20px] leading-7 font-semibold text-(--c-ink)", i === 0 && "sm:mt-auto sm:text-[26px] sm:leading-9")}>
                {t(it.name)}
              </p>
              <p className="mt-2 text-[15px] leading-[1.65] text-(--c-muted)">{t(it.body)}</p>
            </li>
          )
        })}
      </ul>
    </Block>
  )
}

export function Showcase({ c, ctx }: { c: CompanyContent["showcase"]; ctx: SectionCtx }) {
  const { t, locale } = ctx
  return (
    <Block id="showcase" wide>
      <Label>{t(c.label)}</Label>
      <Title id="showcase">{t(c.title)}</Title>
      {c.lead && <Lead>{t(c.lead)}</Lead>}
      <ul className="mt-10 grid gap-3">
        {c.items.map((it) => {
          const body = (
            <>
              <div className="min-w-0">
                <p className="font-display text-[19px] leading-7 font-semibold text-(--c-ink)">{t(it.title)}</p>
                <p className="mt-1.5 text-[15px] leading-[1.65] text-(--c-muted)">{t(it.body)}</p>
                {it.tags && it.tags.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {it.tags.map((tag) => (
                      <li key={tag} className="rounded-full border border-(--c-ink)/20 px-2.5 py-0.5 text-[12px] text-(--c-muted)">
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {it.metric ? (
                <div className="shrink-0 text-right">
                  <p className="font-display text-[30px] leading-none font-semibold text-(--c-primary)">{it.metric.value}</p>
                  <p className="mt-1.5 max-w-[14ch] text-[12px] leading-4 text-(--c-muted)">{t(it.metric.label)}</p>
                </div>
              ) : it.href ? (
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-(--c-primary) text-(--c-on-primary) transition-transform group-hover:rotate-45">
                  <ArrowUpRight aria-hidden className="size-4" strokeWidth={2} />
                  <span className="sr-only">{ctx.ui.visit}</span>
                </span>
              ) : null}
            </>
          )
          const box = "cglass flex items-start justify-between gap-6 rounded-[22px] p-6"
          return (
            <li key={t(it.title)}>
              {it.href ? (
                <Link href={`/${locale}${it.href}`} className={cn(box, "group")}>
                  {body}
                </Link>
              ) : (
                <div className={box}>{body}</div>
              )}
            </li>
          )
        })}
      </ul>
    </Block>
  )
}

export function Testimonials({ c, ctx }: { c: CompanyContent["testimonials"]; ctx: SectionCtx }) {
  const { t } = ctx
  const [first, ...rest] = c.items
  return (
    <Block id="testimonials" wide>
      <Label>{t(c.label)}</Label>
      <Title id="testimonials">{t(c.title)}</Title>
      {c.lead && <Lead>{t(c.lead)}</Lead>}
      {first && (
        <figure className="mt-10">
          <blockquote className="font-display text-[clamp(1.3rem,2.2vw,1.85rem)] leading-[1.5] font-medium text-(--c-ink)">
            {t(first.quote)}
          </blockquote>
          <figcaption className="mt-4 text-[14px] text-(--c-muted)">
            <span className="font-semibold text-(--c-ink)">{t(first.name)}</span> — {t(first.role)}
          </figcaption>
        </figure>
      )}
      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {rest.map((q) => (
          <figure key={t(q.name)} className="cglass rounded-[22px] p-6">
            <blockquote className="text-[15px] leading-[1.7] text-(--c-ink)/90">{t(q.quote)}</blockquote>
            <figcaption className="mt-4 text-[13px] text-(--c-muted)">
              <span className="font-semibold text-(--c-ink)">{t(q.name)}</span> — {t(q.role)}
            </figcaption>
          </figure>
        ))}
      </div>
    </Block>
  )
}

export function Contact({
  cta,
  contact,
  ctx,
}: {
  cta: CompanyContent["cta"]
  contact: CompanyContent["contact"]
  ctx: SectionCtx
}) {
  const { t, ui } = ctx
  return (
    <Block id="contact">
      <div className="cglass rounded-[28px] p-7 md:p-10">
        <Label>{t(cta.label)}</Label>
        <Title id="contact">{t(cta.title)}</Title>
        <p className="mt-5 text-[16px] leading-[1.75] text-(--c-muted)">{t(cta.lead)}</p>
        <a
          href={`mailto:${contact.email}`}
          className="mt-8 inline-flex h-13 items-center gap-3 rounded-full bg-(--c-primary) px-7 text-[16px] font-semibold text-(--c-on-primary) transition-transform hover:-translate-y-0.5"
        >
          {t(cta.button)}
          <ArrowUpRight aria-hidden className="size-4" strokeWidth={2} />
        </a>
        <dl className="mt-10 grid gap-5 border-t border-(--c-ink)/12 pt-7 text-[15px] leading-[1.6]">
          <div>
            <dt className="text-[13px] text-(--c-muted)">{ui.contact.address}</dt>
            <dd className="mt-1 text-(--c-ink)">{t(contact.address)}</dd>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-[13px] text-(--c-muted)">{ui.contact.email}</dt>
              <dd className="mt-1">
                <a href={`mailto:${contact.email}`} className="text-(--c-ink) underline-offset-4 hover:underline">
                  {contact.email}
                </a>
              </dd>
            </div>
            {contact.phone && (
              <div>
                <dt className="text-[13px] text-(--c-muted)">{ui.contact.phone}</dt>
                <dd className="mt-1">
                  <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className="text-(--c-ink) underline-offset-4 hover:underline">
                    {contact.phone}
                  </a>
                </dd>
              </div>
            )}
          </div>
        </dl>
      </div>
    </Block>
  )
}
