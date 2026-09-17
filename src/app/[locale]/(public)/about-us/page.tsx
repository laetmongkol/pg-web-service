import { setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo/metadata";
import { translateContentAppServiceServer } from "@/services/modules/app-service/server";

import type { Metadata } from "next";

import { isSupportedLanguage } from "@/proxies/language.proxy";
import { LANGUAGE } from "@/shared/constants/common.constants";

import {
    CtaSection,
    HeroSection,
    HistorySection,
    JourneySection,
    MessageFromFounderSection,
    OurImpactSection,
    OurPeopleSection,
    TrustedBySection,
    VisionSection,
} from "./_sections";

interface AboutUsPageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutUsPageProps): Promise<Metadata> {
    const { locale } = await params;
    return buildPageMetadata({ locale, pathname: "", pageCode: "AboutUs" });
}

export default async function AboutUsPage({ params }: AboutUsPageProps) {
    const { locale: routeLocale } = await params;
    setRequestLocale(routeLocale);
    const language = await isSupportedLanguage(routeLocale) ? (routeLocale as LANGUAGE) : LANGUAGE.TH;

    const data = await translateContentAppServiceServer.getTranslateContentsCached(language, "AboutUs");

    return (
        <div className="relative flex flex-col bg-(--surface-page)">
            <HeroSection data={data} language={language} />
            <HistorySection data={data} language={language} />
            {/* OUR VALUE rides inside the journey's pinned viewport — see JourneyScroller */}
            <JourneySection data={data} language={language} />
            <TrustedBySection data={data} language={language} />
            <VisionSection data={data} language={language} />
            <OurImpactSection data={data} language={language} />
            <MessageFromFounderSection data={data} language={language} />
            <OurPeopleSection data={data} language={language} />
            <CtaSection data={data} language={language} />
        </div>
    );
}
