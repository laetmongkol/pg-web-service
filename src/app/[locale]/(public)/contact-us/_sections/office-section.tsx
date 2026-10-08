import cn from "@/lib/tw-merge";

import FadeIn from "@/app/component/fade-in.components";

import { SECTION_CONTAINER_CLASSNAME } from "../../_shared/styles";

import ContactForm from "./components/contact-form";
import { CONTACT_MOCK } from "./contact-mock";

const MOCK = CONTACT_MOCK.office;

/** Office details, opening hours and map on the left; the message form on the right. */
const OfficeSection = () => {
    const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(MOCK.mapQuery)}&hl=th&z=17&output=embed`;

    return (
        <section id="contact-form" className="w-full pb-16 pt-20 text-(--text-on-dark) sm:pb-20 lg:pb-24 lg:pt-24">
            <div className={cn(SECTION_CONTAINER_CLASSNAME, "grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-10")}>
                <FadeIn className="flex flex-col">
                    <h2 className="text-xl font-bold sm:text-[1.375rem]">{MOCK.title}</h2>
                    <p className="mt-3 text-sm text-(--text-body-on-dark)">{MOCK.address}</p>

                    <div className="mt-7 border-t border-(--border-on-dark) pt-7">
                        <h3 className="text-[0.6875rem] font-semibold tracking-[0.08em] text-(--label-on-dark)">
                            {MOCK.hoursTitle}
                        </h3>
                        <dl className="mt-4 flex flex-col gap-2.5 text-sm">
                            {MOCK.hours.map(({ day, time }) => (
                                <div key={day} className="flex items-center justify-between gap-4">
                                    <dt className="text-(--text-muted-on-dark)">{day}</dt>
                                    <dd className="font-semibold">{time}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    <div className="mt-8 min-h-72 flex-1 overflow-hidden rounded-[1.75rem] bg-(--glass-on-dark)">
                        <iframe
                            src={mapSrc}
                            title={`แผนที่ ${MOCK.title}`}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allowFullScreen
                            className="block size-full min-h-72 border-0"
                        />
                    </div>
                </FadeIn>

                <FadeIn delay={120}>
                    <ContactForm />
                </FadeIn>
            </div>
        </section>
    );
};

export default OfficeSection;
