import { setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo/metadata";
import { translateContentAppServiceServer } from "@/services/modules/app-service/server";

import type { Metadata } from "next";

import { isSupportedLanguage } from "@/proxies/language.proxy";
import { LANGUAGE } from "@/shared/constants/common.constants";

import {
    HeroSection,
    AboutUs,
    ConsiderationSection,
    OurServicesSection,
    PortfolioSection,
    OurSubsidiariesSection,
    PartnerSection,
    JoinOurTeamSection,
    ReviewSection,
    CtaSection
} from "./_sections";

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

    const data = await translateContentAppServiceServer.getTranslateContentsCached(language, "Home");

    return (
        <div className="relative flex flex-col bg-(--surface-page)">
            <HeroSection data={data} language={language} />
            <AboutUs data={data} language={language} />
            <ConsiderationSection data={data} language={language} />
            <OurServicesSection data={data} language={language} />
            <PortfolioSection data={data} language={language} />    
            <OurSubsidiariesSection data={data} language={language} />
            <PartnerSection data={data} language={language} />
            <JoinOurTeamSection data={data} language={language} />
            <ReviewSection data={data} language={language} />
            <CtaSection data={data} language={language} />
        </div>
    );
}
