import { Mail, MapPin, Phone, type LucideIcon } from "lucide-react";

import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";
import LinkCustom from "@/components/link-custom.component";

import { SECTION_CONTAINER_CLASSNAME } from "../../_shared/styles";

const CHANNEL_KEYS = ["channel1", "channel2", "channel3"] as const;

const ICON_MAP: Record<string, LucideIcon> = {
    Phone,
    Mail,
    MapPin,
};

type ContactChannel = {
    key: string;
    title: string;
    label: string;
    detail: string;
    icon?: LucideIcon;
    href: string;
};

/**
 * channel1..3 — value is the card title, attribute1 the small label, attribute2 the detail line,
 * attribute3 the lucide icon name (Phone / Mail / MapPin); linkUrl (tel: / mailto:) makes the detail a link.
 */
function getChannels(data: Record<string, TranslateContentResponseDto>): ContactChannel[] {
    return CHANNEL_KEYS.flatMap((key) => {
        const item = data?.[key];
        if (!item?.value) return [];

        return [{
            key,
            title: item.value,
            label: item.attribute1 ?? "",
            detail: item.attribute2 ?? "",
            icon: ICON_MAP[item.attribute3 ?? ""],
            href: item.linkUrl ?? "",
        }];
    });
}

interface ContactChannelsSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
}

/** Three white cards — phone, email, office — on the light panel under the hero. */
const ContactChannelsSection = ({ data }: ContactChannelsSectionProps) => {
    if (!data) return null;
    const channels = getChannels(data);

    return (
        <section id="contact-channels" className="w-full pt-8 pb-16 lg:py-20">
            <FadeIn className={SECTION_CONTAINER_CLASSNAME}>
                <ul className="grid gap-4 sm:grid-cols-3 sm:gap-5">
                    {channels.map(({ key, title, label, detail, icon: Icon, href }) => (
                        <li
                            key={key}
                            className="flex min-h-40 flex-col rounded-2xl bg-(--surface-card) px-6 py-7 text-(--text-on-light) sm:min-h-48 sm:px-8 sm:py-8"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-[0.6875rem] font-semibold tracking-[0.06em]">{label}</span>
                                {Icon ? <Icon aria-hidden className="size-5" strokeWidth={1.75} /> : null}
                            </div>
                            <h2 className="mt-6 text-xl font-bold sm:text-[1.375rem]">{title}</h2>
                            {href ? (
                                <LinkCustom href={href} className={cn("mt-2 text-sm transition-opacity hover:opacity-75")}>
                                    {detail}
                                </LinkCustom>
                            ) : (
                                <p className="mt-2 whitespace-pre-line text-sm">{detail}</p>
                            )}
                        </li>
                    ))}
                </ul>
            </FadeIn>
        </section>
    );
};

export default ContactChannelsSection;
