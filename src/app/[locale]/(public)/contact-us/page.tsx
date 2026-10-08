import { setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo/metadata";
import cn from "@/lib/tw-merge";
import { translateContentAppServiceServer } from "@/services/modules/app-service/server";

import type { Metadata } from "next";

import { isSupportedLanguage } from "@/proxies/language.proxy";
import { LANGUAGE } from "@/shared/constants/common.constants";

import { ContactChannels, ContactForm, HeroSection, OfficeMap } from "./_sections";

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
    const language = await isSupportedLanguage(routeLocale) ? (routeLocale as LANGUAGE) : LANGUAGE.TH;

    // { [sectionCode]: { [translateContentCode]: dto } } — section codes are "1".."4", in page order.
    const data = await translateContentAppServiceServer.getTranslateContentsCached(language, "ContactUs");

    return (
        <div className="relative flex flex-col bg-(--surface-elevated)">
            <HeroSection data={data?.["1"]} />

            <section
                id="contact-us-content"
                className={cn("w-full bg-(--surface-elevated)", "py-6 sm:py-20 lg:py-14")}
            >
                <div
                    className={cn(
                        "mx-auto grid w-full max-w-7xl gap-12",
                        "px-4 sm:px-8",
                        "lg:grid-cols-2 lg:gap-16",
                    )}
                >
                    <ContactChannels data={data?.["2"]} />
                    <ContactForm data={data?.["3"]} />
                </div>
            </section>

            <OfficeMap data={data?.["4"]} />
        </div>
    );
}
