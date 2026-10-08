import { setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo/metadata";

import type { Metadata } from "next";

import { isSupportedLanguage } from "@/proxies/language.proxy";
import { LANGUAGE } from "@/shared/constants/common.constants";

import CtaCard from "../_shared/cta-card";
import LightPanel from "../_shared/light-panel";
import PageHero from "../_shared/page-hero";
import { PIP_MOCK_IMAGE } from "../_shared/styles";

import { CapabilitiesSection, ServiceListSection, WhyChooseSection } from "./_sections";
import { SERVICES_MOCK } from "./_sections/services-mock";

interface ServicesPageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ServicesPageProps): Promise<Metadata> {
    const { locale } = await params;
    return buildPageMetadata({ locale, pathname: "services", pageCode: "Services" });
}

export default async function ServicesPage({ params }: ServicesPageProps) {
    const { locale: routeLocale } = await params;
    setRequestLocale(routeLocale);
    const language = (await isSupportedLanguage(routeLocale)) ? (routeLocale as LANGUAGE) : LANGUAGE.TH;

    const { hero, cta } = SERVICES_MOCK;

    // Mockup: every section renders SERVICES_MOCK copy. Once the PIP Evolution CMS rows are seeded,
    // fetch getTranslateContentsCached(language, "Services") and pass each section its data.
    return (
        <div className="relative flex flex-col bg-(--section-dark)">
            <PageHero
                eyebrow={hero.eyebrow}
                titleLines={[...hero.titleLines]}
                description={hero.description}
                primary={{ label: hero.primary, href: `/${language}/${hero.primaryLink}` }}
                image={PIP_MOCK_IMAGE}
                imageAlt={hero.titleLines.join(" ")}
            />
            <LightPanel curveTop curveBottom className="mt-12">
                <ServiceListSection language={language} />
            </LightPanel>
            <WhyChooseSection />
            <CapabilitiesSection />
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
