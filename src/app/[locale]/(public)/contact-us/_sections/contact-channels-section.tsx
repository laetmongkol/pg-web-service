import { Mail, MapPin, Phone } from "lucide-react";

import cn from "@/lib/tw-merge";

import FadeIn from "@/app/component/fade-in.components";
import LinkCustom from "@/components/link-custom.component";

import { SECTION_CONTAINER_CLASSNAME } from "../../_shared/styles";

import { CONTACT_MOCK } from "./contact-mock";

const ICONS = { phone: Phone, mail: Mail, pin: MapPin };

/** Three white cards — phone, email, office — on the light panel under the hero. */
const ContactChannelsSection = () => (
    <section id="contact-channels" className="w-full py-14 sm:py-20">
        <FadeIn className={SECTION_CONTAINER_CLASSNAME}>
            <ul className="grid gap-4 sm:grid-cols-3 sm:gap-5">
                {CONTACT_MOCK.channels.map(({ icon, label, title, value, href }) => {
                    const Icon = ICONS[icon];
                    return (
                        <li
                            key={icon}
                            className="flex min-h-40 flex-col rounded-2xl bg-(--surface-card) px-6 py-7 text-(--text-on-light) sm:min-h-48 sm:px-8 sm:py-8"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-[0.6875rem] font-semibold tracking-[0.06em]">{label}</span>
                                <Icon aria-hidden className="size-5" strokeWidth={1.75} />
                            </div>
                            <h2 className="mt-6 text-xl font-bold sm:text-[1.375rem]">{title}</h2>
                            {href ? (
                                <LinkCustom
                                    href={href}
                                    className={cn("mt-2 text-sm transition-opacity hover:opacity-75")}
                                >
                                    {value}
                                </LinkCustom>
                            ) : (
                                <p className="mt-2 whitespace-pre-line text-sm">{value}</p>
                            )}
                        </li>
                    );
                })}
            </ul>
        </FadeIn>
    </section>
);

export default ContactChannelsSection;
