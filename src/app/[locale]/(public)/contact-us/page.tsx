import cn from "@/lib/tw-merge";
import { translateContentAppServiceServer } from "@/services/modules/app-service/server";

import FadeIn from "@/app/component/fade-in.components";

import { isSupportedLanguage } from "@/proxies/language.proxy";
import { LANGUAGE } from "@/shared/constants/common.constants";

import BannerSection from "./_sections/banner-section";
import ContactForm from "./_sections/contact-form";
import HeadOffice from "./_sections/head-office";

interface ContactUsPageProps {
    params: Promise<{ locale: string }>;
}

export default async function ContactUs({ params }: ContactUsPageProps) {
    const { locale: routeLocale } = await params;
    const language = await isSupportedLanguage(routeLocale) ? (routeLocale as LANGUAGE) : LANGUAGE.TH;

    // { [sectionCode]: { [translateContentCode]: dto } } — section codes are "1".."3", in page order.
    const data = await translateContentAppServiceServer.getTranslateContentsCached(language, "ContactUs");

    return (
        <div className="flex flex-col">
            <BannerSection data={data?.["1"]} />
            <section id="contact-us-content" className="w-full bg-(--surface-page)">
                <FadeIn
                    className={cn(
                        "grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-12",
                        "max-w-7xl mx-auto px-6 sm:px-12 md:px-16",
                        "py-16",
                    )}
                >
                    <HeadOffice data={data?.["2"]} />
                    <ContactForm data={data?.["3"]} />
                </FadeIn>
            </section>
        </div>
    );
}
