import { setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo/metadata";
import { translateContentAppServiceServer } from "@/services/modules/app-service/server";

import type { Metadata } from "next";

import { isSupportedLanguage } from "@/proxies/language.proxy";
import { LANGUAGE } from "@/shared/constants/common.constants";

import LightPanel from "../_shared/light-panel";
import PageHero from "../_shared/page-hero";

import { ContactChannelsSection, OfficeSection } from "./_sections";

interface ContactUsPageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactUsPageProps): Promise<Metadata> {
    const { locale } = await params;
    return buildPageMetadata({ locale, pathname: "contact-us", pageCode: "ContactUs" });
}

export default async function ContactUsPage({ params }: ContactUsPageProps) {
    const { locale: routeLocale } = await params;
    setRequestLocale(routeLocale);
    const language = (await isSupportedLanguage(routeLocale)) ? (routeLocale as LANGUAGE) : LANGUAGE.TH;

    // { [sectionCode]: { [translateContentCode]: dto } } — section codes are the section names below.
    const data = await translateContentAppServiceServer.getTranslateContentsCached(language, "ContactUs");

    return (
        <div className="relative flex flex-col bg-(--section-dark)">
            <PageHero data={data?.["hero"]} language={language} />
            <LightPanel curveTop curveBottom className="mt-12">
                <ContactChannelsSection data={data?.["channels"]} />
            </LightPanel>
            <OfficeSection data={data?.["office"]} formData={data?.["form"]} />
        </div>
    );
}
