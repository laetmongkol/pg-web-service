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

    // { [sectionCode]: { [translateContentCode]: dto } } — section codes are "1".."10", in page order.
    const data = await translateContentAppServiceServer.getTranslateContentsCached(language, "AboutUs");

    return (
        <div className="relative flex flex-col bg-(--surface-page)">
            <HeroSection data={data?.["1"]} language={language} />
            <HistorySection data={data?.["2"]} language={language} />
            {/* OUR VALUE (section 4) rides inside the journey's pinned viewport — see JourneyScroller */}
            <JourneySection data={data?.["3"]} valueData={data?.["4"]} language={language} />
            <TrustedBySection data={data?.["5"]} language={language} />
            <VisionSection data={data?.["6"]} language={language} />
            <OurImpactSection data={data?.["7"]} language={language} />
            <MessageFromFounderSection data={data?.["8"]} language={language} />
            <OurPeopleSection data={data?.["9"]} language={language} />
            <CtaSection data={data?.["10"]} language={language} />
        </div>
    );
}
