import { setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo/metadata";
import { translateContentAppServiceServer } from "@/services/modules/app-service/server";

import type { Metadata } from "next";

import { isSupportedLanguage } from "@/proxies/language.proxy";
import { LANGUAGE } from "@/shared/constants/common.constants";

import CtaSection from "../_shared/cta-section";
import LightPanel from "../_shared/light-panel";
import PageHero from "../_shared/page-hero";

import { HistorySection, JourneySection, MissionVisionSection, TeamSection } from "./_sections";

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
    const language = (await isSupportedLanguage(routeLocale)) ? (routeLocale as LANGUAGE) : LANGUAGE.TH;

    // { [sectionCode]: { [translateContentCode]: dto } } — section codes are the section names below.
    const data = await translateContentAppServiceServer.getTranslateContentsCached(language, "AboutUs");

    return (
        <div className="relative flex flex-col bg-(--section-dark)">
            <PageHero data={data?.["hero"]} language={language} />
            <LightPanel curveTop curveBottom className="mt-12">
                <HistorySection data={data?.["history"]} />
            </LightPanel>
            <JourneySection data={data?.["journey"]} />
            <LightPanel>
                <MissionVisionSection data={data?.["missionVision"]} />
            </LightPanel>
            <TeamSection data={data?.["team"]} />
            <CtaSection data={data?.["cta"]} language={language} />
        </div>
    );
}
