import { Check } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { SCENES } from "@/features/tower/scenes"

import ContactForm from "./contact-form"
import { Eyebrow, Lead, Title } from "./section"

export default async function Contact() {
  const t = await getTranslations("contact")
  const rail = await getTranslations("rail")
  const checklist = t.raw("checklist") as string[]

  return (
    <section
      id="contact"
      data-scene={SCENES.indexOf("contact")}
      aria-labelledby="contact-title"
      className="relative flex min-h-svh items-center py-28"
    >
      <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-4 md:px-[72px] lg:grid-cols-[minmax(0,1fr)_460px] lg:items-center">
        <div>
          <Eyebrow>{rail("contact")}</Eyebrow>
          <Title id="contact">{t("title")}</Title>
          <Lead>{t("lead")}</Lead>
          <ul className="mt-8 space-y-3">
            {checklist.map((item) => (
              <li key={item} className="flex items-center gap-3 text-[16px] text-ivory">
                <span className="grid size-6 place-items-center rounded-full bg-coral/15 text-coral">
                  <Check aria-hidden className="size-3.5" strokeWidth={2.5} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <ContactForm />
      </div>
    </section>
  )
}
