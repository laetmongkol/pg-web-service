import { cache } from "react";

import { type TranslateCatalog } from "@/services/modules/app-service";
import { translateAppServiceServer } from "@/services/modules/app-service/server";

import type { AbstractIntlMessages } from "next-intl";

// Loads the active locale catalog only. Missing keys fall back to the raw key via
// next-intl `getMessageFallback` in request.ts (not an English catalog merge).
export const getMessages = cache(
  async (locale: string): Promise<AbstractIntlMessages> => {
    try {
      const data: TranslateCatalog = await translateAppServiceServer.getTranslatesCached(locale);
      return data[locale] ?? {};
    } catch (error: unknown) {
      // Re-throw so Next keeps the LAST successful static render instead of
      // caching an empty catalog. Returning {} here would let a failed
      // background revalidate poison the ISR cache with blank, indexable HTML.
      console.error("[i18n] getMessages error", { locale, error });
      throw error;
    }
  }
);
