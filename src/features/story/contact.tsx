import { getTranslations } from "next-intl/server"

import SectionLabel from "@/components/ui/section-label"

import Chapter, { ChapterHeading } from "./chapter"
import ContactForm from "./contact-form"

export default async function Contact() {
  const t = await getTranslations("contact")
  const checklist = t.raw("checklist") as string[]

  return (
    <Chapter id="contact" index={7} wide className="pb-[30vh]">
      <div className="rounded-panel bg-coral p-6 md:p-10">
        <SectionLabel square="ink" className="text-ink">{t("label")}</SectionLabel>
        <ChapterHeading id="contact" title={t("title")} />
        <p className="mt-5 max-w-[60ch] text-body text-ink">{t("lead")}</p>
        <ol className="mt-8 max-w-xl">
          {checklist.map((item, i) => (
            <li key={item} className="flex gap-5 border-b border-ink/40 py-3 text-[15px] font-semibold text-ink">
              <span className="font-mono text-[12px] font-normal text-ink/70">{String(i + 1).padStart(2, "0")}</span>
              {item}
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <ContactForm />
        </div>
      </div>
    </Chapter>
  )
}
