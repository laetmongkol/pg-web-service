import { cache } from "react";

import { PUBLIC_INDEX_ROBOTS } from "@/lib/seo/metadata";
import { LanguageResponseDto } from "@/services/generated-cli/api-app-service";
import { languageAppServiceServer } from "@/services/modules/app-service/server";

import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import SmoothScroll from "@/components/layout/smooth-scroll";

import type { Metadata } from "next";

import { isSupportedLanguage } from "@/proxies/language.proxy";
import { LANGUAGE } from "@/shared/constants/common.constants";
import { NAV_LINKS } from "@/shared/constants/nav-links.constants";

interface PublicLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  robots: PUBLIC_INDEX_ROBOTS,
};

const fetchLanguages = cache(async (): Promise<LanguageResponseDto[]> => {
  try {
    return await languageAppServiceServer.getLanguagesCached();
  } catch {
    return [];
  }
});

const PublicLayout = async ({ children, params }: PublicLayoutProps) => {
  const { locale: routeLocale } = await params;
  const language = await isSupportedLanguage(routeLocale) ? (routeLocale as LANGUAGE) : LANGUAGE.TH;
  const languages = await fetchLanguages();

  // overflow-x-clip, not -hidden: `hidden` makes this a scroll container and kills
  // `position: sticky` in every page below it. `clip` trims the same overflow without that.
  return (
    <div className="relative flex min-h-screen w-full overflow-x-clip flex-col bg-(--surface-default)">
      <main className="flex flex-1">
      <Navbar language={language} languages={languages} menuItems={NAV_LINKS} showLogo />
        <section data-snap-root className="w-full whitespace-pre-line">
          {children}
        </section>
      </main>
      <Footer language={language} />
      <SmoothScroll />
    </div>
  );
};

export default PublicLayout;
