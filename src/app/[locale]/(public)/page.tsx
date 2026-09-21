import { setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo/metadata";

import type { Metadata } from "next";

import { isSupportedLanguage } from "@/proxies/language.proxy";
import { LANGUAGE } from "@/shared/constants/common.constants";

import {
    AboutStrategySection,
    CtaSection,
    HeroSection,
    OurMissionSection,
    OurServicesSection,
    ReviewSection,
    TeamCapabilitySection,
    TrustedPartnerSection
} from "./_sections";

interface HomePageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
    const { locale } = await params;
    return buildPageMetadata({ locale, pathname: "", pageCode: "Home" });
}

export default async function HomePage({ params }: HomePageProps) {
    const { locale: routeLocale } = await params;
    setRequestLocale(routeLocale);
    const language = await isSupportedLanguage(routeLocale) ? (routeLocale as LANGUAGE) : LANGUAGE.TH;

    // Copy is held in the sections for now — the Home rows in the CMS still carry the seed content
    // from the project this service was cloned from, so binding them here would print another
    // brand's text. Swap each section back to `data?.["<n>"]` as its rows are filled in.
    return (
        <div className="relative flex flex-col bg-(--surface-page)">
            <HeroSection language={language} />
            <TrustedPartnerSection />
            <AboutStrategySection />
            <OurMissionSection />
            <TeamCapabilitySection />
            <OurServicesSection language={language} />
            <ReviewSection />
            <CtaSection language={language} />
        </div>
    );
}
