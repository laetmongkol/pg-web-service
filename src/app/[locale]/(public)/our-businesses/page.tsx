import { isSupportedLanguage } from "@/proxies/language.proxy";
import { LANGUAGE } from "@/shared/constants/common.constants";

import BannerSection from "./_sections/banner-section";
import ContactSection from "./_sections/contact-section";
import OurCompanySection from "./_sections/our-company-section";
import OurEcosystemSection from "./_sections/our-ecosystem-section";
import OurPhilosophySection from "./_sections/our-philosophy-section";

interface OurBusinessesPageProps {
    params: Promise<{ locale: string }>;
}

export default async function OurBusinesses({ params }: OurBusinessesPageProps) {
    const { locale: routeLocale } = await params;
    const language = await isSupportedLanguage(routeLocale) ? (routeLocale as LANGUAGE) : LANGUAGE.TH;

    return (
        <div className="flex flex-col">
            <BannerSection />
            <OurEcosystemSection />
            <OurCompanySection />
            <OurPhilosophySection />
            <ContactSection language={language} />
        </div>
    );
}
