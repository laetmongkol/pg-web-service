import { setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo/metadata";
import { translateContentAppServiceServer } from "@/services/modules/app-service/server";

import type { Metadata } from "next";

import { isSupportedLanguage } from "@/proxies/language.proxy";
import { LANGUAGE } from "@/shared/constants/common.constants";

import { CtaSection, HeroSection, OurCustomer, OurServices, WhoWeAre, WhyChooseUs } from "./_sections";

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
    const language = await isSupportedLanguage(routeLocale) ? (routeLocale as LANGUAGE) : LANGUAGE.TH;

    // { [sectionCode]: { [translateContentCode]: dto } } — section codes are "1".."6", in page order.
    const data = await translateContentAppServiceServer.getTranslateContentsCached(language, "Services");

    return (
        <div className="relative flex flex-col bg-(--surface-page)">
            <HeroSection data={data?.["1"]} language={language} />
            <section id="services-content" className="w-full bg-(--surface-page)" />
            <WhoWeAre data={data?.["2"]} />
            <OurServices data={data?.["3"]} language={language} />
            <OurCustomer data={data?.["4"]} />
            <WhyChooseUs data={data?.["5"]} />
            <CtaSection data={data?.["6"]} language={language} />
        </div>
    );
}
