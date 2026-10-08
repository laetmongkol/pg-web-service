import { setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo/metadata";

import type { Metadata } from "next";

import { isSupportedLanguage } from "@/proxies/language.proxy";
import { LANGUAGE } from "@/shared/constants/common.constants";

import CtaCard from "../_shared/cta-card";
import LightPanel from "../_shared/light-panel";
import PageHero from "../_shared/page-hero";
import { PIP_MOCK_IMAGE } from "../_shared/styles";

import { HistorySection, JourneySection, MissionVisionSection, TeamSection } from "./_sections";
import { ABOUT_MOCK } from "./_sections/about-mock";

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

    const { hero, cta } = ABOUT_MOCK;

    // Mockup: every section renders ABOUT_MOCK copy. Once the PIP Evolution CMS rows are seeded,
    // fetch getTranslateContentsCached(language, "AboutUs") and pass each section its data.
    return (
        <div className="relative flex flex-col bg-(--section-dark)">
            <PageHero
                eyebrow={hero.eyebrow}
                titleLines={[...hero.titleLines]}
                description={hero.description}
                primary={{ label: hero.primary, href: `/${language}/${hero.primaryLink}` }}
                secondary={{ label: hero.secondary, href: `/${language}/${hero.secondaryLink}` }}
                image={PIP_MOCK_IMAGE}
                imageAlt={hero.titleLines.join(" ")}
            />
            <LightPanel curveTop curveBottom className="mt-12">
                <HistorySection />
            </LightPanel>
            <JourneySection />
            <LightPanel>
                <MissionVisionSection />
            </LightPanel>
            <TeamSection />
            <CtaCard
                title1={cta.title1}
                title2={cta.title2}
                description={cta.description}
                button={cta.button}
                href={`/${language}/${cta.buttonLink}`}
                image={PIP_MOCK_IMAGE}
            />
        </div>
    );
}
