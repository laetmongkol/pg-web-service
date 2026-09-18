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

    // { [sectionCode]: { [translateContentCode]: dto } } — section codes are "1".."10", in page order.
    const data = await translateContentAppServiceServer.getTranslateContentsCached(language, "Home");

    return (
        <div className="relative flex flex-col bg-(--surface-page)">
            <HeroSection data={data?.["1"]} language={language} />
            <AboutUs data={data?.["2"]} language={language} />
            <ConsiderationSection data={data?.["3"]} language={language} />
            <OurServicesSection data={data?.["4"]} language={language} />
            <PortfolioSection data={data?.["5"]} language={language} />
            <OurSubsidiariesSection data={data?.["6"]} language={language} />
            <PartnerSection data={data?.["7"]} language={language} />
            <JoinOurTeamSection data={data?.["8"]} language={language} />
            <ReviewSection data={data?.["9"]} language={language} />
            <CtaSection data={data?.["10"]} language={language} />
        </div>
    );
}
