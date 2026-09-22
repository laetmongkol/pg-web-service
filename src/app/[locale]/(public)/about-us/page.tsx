import { setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo/metadata";
import { translateContentAppServiceServer } from "@/services/modules/app-service/server";

import type { Metadata } from "next";

import { isSupportedLanguage } from "@/proxies/language.proxy";
import { LANGUAGE } from "@/shared/constants/common.constants";

import {
    CtaSection,
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
    return buildPageMetadata({ locale, pathname: "about-us", pageCode: "AboutUs" });
}

export default async function AboutUsPage({ params }: AboutUsPageProps) {
    const { locale: routeLocale } = await params;
    setRequestLocale(routeLocale);
    const language = await isSupportedLanguage(routeLocale) ? (routeLocale as LANGUAGE) : LANGUAGE.TH;

    // { [sectionCode]: { [translateContentCode]: dto } } — 1..5 and 8 carry copy, 6/7/9 the pictures.
    const data = await translateContentAppServiceServer.getTranslateContentsCached(language, "AboutUs");

    return (
        <div className="relative flex flex-col bg-(--surface-page)">
            <HeroSection data={data?.["1"]} language={language} />
            <OurHistory data={data?.["2"]} />
            <OurJourney data={data?.["3"]} />
            <MissionAndVision data={data} />
            <OurValue data={data} />
            <CtaSection data={data?.["8"]} language={language} />
        </div>
    );
}
