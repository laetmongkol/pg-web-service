import FadeIn from "@/app/component/fade-in.components";
import cn from "@/lib/tw-merge";

import BannerSection from "./_sections/banner-section";
import ContactForm from "./_sections/contact-form";
import HeadOffice from "./_sections/head-office";

export default function ContactUs() {
    return (
        <div className="flex flex-col">
            <BannerSection />
            <section id="contact-us-content" className="w-full bg-(--surface-page)">
                <FadeIn
                    className={cn(
                        "grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-12",
                        "max-w-7xl mx-auto px-6 sm:px-12 md:px-16",
                        "py-16",
                    )}
                >
                    <HeadOffice />
                    <ContactForm />
                </FadeIn>
            </section>
        </div>
    );
}
