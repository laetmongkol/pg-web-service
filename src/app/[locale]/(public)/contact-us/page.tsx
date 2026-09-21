import { setRequestLocale } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo/metadata";
import cn from "@/lib/tw-merge";

import type { Metadata } from "next";

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

    // Copy is held in the sections for now — the ContactUs rows in the CMS still carry the seed
    // content from the project this service was cloned from, so binding them here would print
    // another brand's text. Swap each section to `data?.["<n>"]` as its rows are filled in.
    return (
        <div className="relative flex flex-col bg-(--surface-elevated)">
            <HeroSection />

            <section
                id="contact-us-content"
                className={cn("w-full bg-(--surface-elevated)", "py-16 sm:py-20 lg:py-24")}
            >
                <div
                    className={cn(
                        "mx-auto grid w-full max-w-7xl gap-12",
                        "px-4 sm:px-8",
                        "lg:grid-cols-2 lg:gap-16",
                    )}
                >
                    <ContactChannels />
                    <ContactForm />
                </div>
            </section>

            <OfficeMap />
        </div>
    );
}
