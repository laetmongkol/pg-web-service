"use client"

import { useId } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowUpRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { z } from "zod"

import cn from "@/lib/tw-merge"

const schema = z.object({
  name: z.string().trim().min(1, "name"),
  channel: z.string().trim().min(3, "channel"),
  type: z.string().trim().optional(),
  detail: z.string().trim().min(20, "detail"),
})

type Inquiry = z.infer<typeof schema>

const fieldClass =
  "w-full rounded-control border bg-ivory/[0.06] px-4 text-[16px] text-ivory shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] transition-colors placeholder:text-mist/60 hover:bg-ivory/[0.09] focus:border-coral/70 focus:bg-ivory/10 focus:outline-none"

function Field({
  label,
  error,
  children,
  id,
  className,
}: {
  label: string
  error?: string
  children: React.ReactNode
  id: string
  className?: string
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-[14px] font-semibold text-ivory">
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-[14px] text-coral">
          {error}
        </p>
      )}
    </div>
  )
}

export default function ContactForm() {
  const t = useTranslations("contact.form")
  const uid = useId()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inquiry>({ resolver: zodResolver(schema), mode: "onTouched" })

  const err = (key: keyof Inquiry) => (errors[key] ? t(`errors.${errors[key]!.message}` as "errors.name") : undefined)
  const aria = (key: keyof Inquiry, id: string) =>
    errors[key] ? { "aria-invalid": true, "aria-describedby": `${id}-error` } : {}

  const onSubmit = () => {
    // TODO: wire to the inquiry endpoint once the backend contract for PG Solution exists.
    toast(t("notConnected"))
  }

  const ids = { name: `${uid}-name`, channel: `${uid}-channel`, type: `${uid}-type`, detail: `${uid}-detail` }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="glass rounded-3xl p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-h2 font-semibold text-ivory">{t("title")}</h3>
        <p className="mt-2 font-mono text-[11px] text-gold">{t("tag")}</p>
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field id={ids.name} label={t("name")} error={err("name")}>
          <input
            id={ids.name}
            autoComplete="organization"
            placeholder={t("namePlaceholder")}
            className={cn(fieldClass, "h-12", errors.name ? "border-coral" : "border-ivory/15")}
            {...aria("name", ids.name)}
            {...register("name")}
          />
        </Field>
        <Field id={ids.channel} label={t("channel")} error={err("channel")}>
          <input
            id={ids.channel}
            autoComplete="email"
            placeholder={t("channelPlaceholder")}
            className={cn(fieldClass, "h-12", errors.channel ? "border-coral" : "border-ivory/15")}
            {...aria("channel", ids.channel)}
            {...register("channel")}
          />
        </Field>
        <Field id={ids.type} label={t("type")} className="sm:col-span-2">
          <input
            id={ids.type}
            placeholder={t("typePlaceholder")}
            className={cn(fieldClass, "h-12 border-ivory/15")}
            {...register("type")}
          />
        </Field>
        <Field id={ids.detail} label={t("detail")} error={err("detail")} className="sm:col-span-2">
          <textarea
            id={ids.detail}
            rows={5}
            placeholder={t("detailPlaceholder")}
            className={cn(fieldClass, "resize-y py-3", errors.detail ? "border-coral" : "border-ivory/15")}
            {...aria("detail", ids.detail)}
            {...register("detail")}
          />
        </Field>
      </div>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[40ch] text-[13px] leading-5 text-mist">{t("privacy")}</p>
        <button
          type="submit"
          className="inline-flex h-13 shrink-0 items-center justify-center gap-3 rounded-full bg-coral px-6 text-[16px] font-semibold text-night-950 transition-colors shadow-[0_10px_30px_-10px_var(--color-coral)] hover:bg-[#ff8463]"
        >
          {t("submit")}
          <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.75} />
        </button>
      </div>
    </form>
  )
}
