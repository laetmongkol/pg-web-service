import { setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo/metadata";
import { translateContentAppServiceServer } from "@/services/modules/app-service/server";

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

    // { [sectionCode]: { [translateContentCode]: dto } } — section codes are "1".."8", in page order.
    const data = await translateContentAppServiceServer.getTranslateContentsCached(language, "Home");

    return (
        <div className="relative flex flex-col bg-(--surface-page)">
            <HeroSection data={data?.["1"]} language={language} />
            <TrustedPartnerSection data={data?.["2"]} />
            <AboutStrategySection data={data?.["3"]} />
            <OurMissionSection data={data?.["4"]} />
            <TeamCapabilitySection data={data?.["5"]} />
            <OurServicesSection data={data?.["6"]} language={language} />
            <ReviewSection data={data?.["7"]} />
            <CtaSection data={data?.["8"]} language={language} />
        </div>
    );
}
