import { setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo/metadata";

import type { Metadata } from "next";

import LightPanel from "../_shared/light-panel";
import PageHero from "../_shared/page-hero";
import { PIP_MOCK_IMAGE } from "../_shared/styles";

import { ContactChannelsSection, OfficeSection } from "./_sections";
import { CONTACT_MOCK } from "./_sections/contact-mock";

interface ContactUsPageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactUsPageProps): Promise<Metadata> {
    const { locale } = await params;
    return buildPageMetadata({ locale, pathname: "contact-us", pageCode: "ContactUs" });
}

export default async function ContactUsPage({ params }: ContactUsPageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    const { hero } = CONTACT_MOCK;

    // Mockup: every section renders CONTACT_MOCK copy. Once the PIP Evolution CMS rows are seeded,
    // fetch getTranslateContentsCached(language, "ContactUs") and pass each section its data.
    return (
        <div className="relative flex flex-col bg-(--section-dark)">
            <PageHero
                eyebrow={hero.eyebrow}
                titleLines={[...hero.titleLines]}
                description={hero.description}
                image={PIP_MOCK_IMAGE}
                imageAlt={hero.titleLines.join(" ")}
            />
            <LightPanel curveTop curveBottom className="mt-12">
                <ContactChannelsSection />
            </LightPanel>
            <OfficeSection />
        </div>
    );
}
