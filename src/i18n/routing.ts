import { defineRouting } from "next-intl/routing"

import { LANGUAGE } from "@/shared/constants/common.constants"

export const routing = defineRouting({
  locales: Object.values(LANGUAGE) as [LANGUAGE, ...LANGUAGE[]],
  defaultLocale: LANGUAGE.TH,
  localePrefix: "always",
})

export type Locale = (typeof routing.locales)[number]
