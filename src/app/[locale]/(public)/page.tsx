import { setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo/metadata";

import type { Metadata } from "next";

import { isSupportedLanguage } from "@/proxies/language.proxy";
import { LANGUAGE } from "@/shared/constants/common.constants";

import {
    AboutSection,
    CtaSection,
    HeroSection,
    PartnersSection,
    PortfolioSection,
    ServicesSection,
    TestimonialsSection,
    WhyUsSection,
} from "./_sections";
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

    return (
        <div className="relative flex flex-col bg-(--section-dark)">
            <HeroSection language={language} />
            {/* Mockup: every section renders HOME_MOCK copy. Once the PIP Evolution CMS rows are
                seeded, fetch getTranslateContentsCached(language, "Home") and pass each section
                data?.["<sectionCode>"] (hero, partners, about, services, whyUs, portfolio, testimonials, cta). */}
            <LightPanel curveTop curveBottom className="mt-20">
                <PartnersSection />
                <AboutSection language={language} />
            </LightPanel>
            <ServicesSection language={language} />
            <LightPanel>
                <WhyUsSection />
            </LightPanel>
            <PortfolioSection language={language} />
            <TestimonialsSection />
            <CtaSection language={language} />
        </div>
    );
}
