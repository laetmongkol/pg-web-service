import { setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo/metadata";
import { translateContentAppServiceServer } from "@/services/modules/app-service/server";

import type { Metadata } from "next";

import { isSupportedLanguage } from "@/proxies/language.proxy";
import { LANGUAGE } from "@/shared/constants/common.constants";

import {
    HeroSection,
    MissionAndVision,
    OurHistory,
    OurJourney,
    OurValue
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
            <OurHistory />
            <OurJourney />
            <MissionAndVision data={data} />
            <OurValue data={data} />
        </div>
    );
}
