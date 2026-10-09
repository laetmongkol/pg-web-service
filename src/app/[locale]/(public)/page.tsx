import { setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo/metadata";
import { translateContentAppServiceServer } from "@/services/modules/app-service/server";

import type { Metadata } from "next";

import { isSupportedLanguage } from "@/proxies/language.proxy";
import { LANGUAGE } from "@/shared/constants/common.constants";

import {
    AboutSection,
    HeroSection,
    PartnersSection,
    PortfolioSection,
    ServicesSection,
    TestimonialsSection,
    WhyUsSection,
} from "./_sections";
import CtaSection from "./_shared/cta-section";
import LightPanel from "./_shared/light-panel";

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

    // { [sectionCode]: { [translateContentCode]: dto } } — section codes are the section names below.
    const data = await translateContentAppServiceServer.getTranslateContentsCached(language, "Home");

    return (
        <div className="relative flex flex-col bg-(--section-dark)">
            <HeroSection data={data?.["hero"]} language={language} />
            <LightPanel curveTop curveBottom className="mt-20">
                <PartnersSection data={data?.["partners"]} />
                <AboutSection data={data?.["about"]} language={language} />
            </LightPanel>
            <ServicesSection data={data?.["services"]} language={language} />
            <LightPanel>
                <WhyUsSection data={data?.["whyUs"]} />
            </LightPanel>
            <PortfolioSection data={data?.["portfolio"]} language={language} />
            <TestimonialsSection data={data?.["testimonials"]} />
            <CtaSection data={data?.["cta"]} language={language} />
        </div>
    );
}
