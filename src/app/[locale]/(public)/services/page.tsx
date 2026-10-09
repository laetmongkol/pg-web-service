import { setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo/metadata";
import { translateContentAppServiceServer } from "@/services/modules/app-service/server";

import type { Metadata } from "next";

import { isSupportedLanguage } from "@/proxies/language.proxy";
import { LANGUAGE } from "@/shared/constants/common.constants";

import CtaSection from "../_shared/cta-section";
import LightPanel from "../_shared/light-panel";
import PageHero from "../_shared/page-hero";

import { CapabilitiesSection, ServiceListSection, WhyChooseSection } from "./_sections";

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

    // { [sectionCode]: { [translateContentCode]: dto } } — section codes are the section names below.
    const data = await translateContentAppServiceServer.getTranslateContentsCached(language, "Services");

    return (
        <div className="relative flex flex-col bg-(--section-dark)">
            <PageHero data={data?.["hero"]} language={language} />
            <LightPanel curveTop curveBottom className="mt-12">
                <ServiceListSection data={data?.["serviceList"]} language={language} />
            </LightPanel>
            <WhyChooseSection data={data?.["whyChoose"]} />
            <CapabilitiesSection data={data?.["capabilities"]} />
            <CtaSection data={data?.["cta"]} language={language} />
        </div>
    );
}
