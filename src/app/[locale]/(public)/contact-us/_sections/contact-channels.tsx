import { Mail, type LucideIcon, Map, Phone } from "lucide-react";

import { convertObjectToArrayByPrefix, convertObjectToValuesByPrefix } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";

/** attributes on `detail*` — the address / phone / email text itself is the row value. */
interface ChannelAttributes {
    icon?: string;
    label?: string;
    /** Turns the value into a tel:/mailto: link; plain text when absent. */
    href?: string;
}

const CHANNEL_ICONS: Record<string, LucideIcon> = { Map, Phone, Mail };

const resolveChannelIcon = (icon?: string | null): LucideIcon => (icon && CHANNEL_ICONS[icon]) || Map;

interface ContactChannelsProps {
    data?: Record<string, TranslateContentResponseDto>;
}

const ContactChannels = ({ data }: ContactChannelsProps) => {
    if (!data) return null;

    const channels = convertObjectToArrayByPrefix<ChannelAttributes>(data, "detail");
    const officeHours = convertObjectToValuesByPrefix(data, "hours").filter(
        (line) => line.key !== "hoursTitle",
    );

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
                <FadeIn>
                    <h2
                        className={cn(
                            "font-bold text-(--text-primary)",
                            "text-2xl leading-snug sm:text-3xl",
                        )}
                    >
                        {data?.title?.value}
                    </h2>
                </FadeIn>
                <FadeIn delay={100} className="text-xs text-(--text-secondary) md:text-sm">
                    {data?.description?.value}
                </FadeIn>
            </div>

            <dl className="flex flex-col gap-6">
                {channels.map((channel, index) => {
                    const Icon = resolveChannelIcon(channel.attributes?.icon);
                    const href = channel.attributes?.href;

                    return (
                        <FadeIn
                            key={channel.key}
                            delay={200 + index * 100}
                            className="flex items-start gap-4"
                        >
                            <span
                                className={cn(
                                    "flex size-10 shrink-0 items-center justify-center rounded-lg",
                                    "border border-(--border-default) bg-(--surface-elevated)",
                                )}
                            >
                                <Icon className="size-4 text-(--text-primary)" strokeWidth={1.6} />
                            </span>

                            <div className="flex min-w-0 flex-col gap-1">
                                <dt className="text-[11px] font-medium tracking-wide text-(--text-muted) uppercase">
                                    {channel.attributes?.label}
                                </dt>
                                <dd className="text-sm leading-relaxed text-(--text-primary)">
                                    {href ? (
                                        <a href={href} className="transition-opacity hover:opacity-70">
                                            {channel.value}
                                        </a>
                                    ) : (
                                        channel.value
                                    )}
                                </dd>
                            </div>
                        </FadeIn>
                    );
                })}
            </dl>

            <FadeIn
                delay={500}
                className={cn(
                    "flex flex-col gap-3 rounded-2xl p-6",
                    "border border-(--border-default) bg-(--surface-page)",
                )}
            >
                <span className="font-bold text-(--text-primary)">{data?.hoursTitle?.value}</span>
                <div className="flex flex-col gap-1">
                    {officeHours.map((line) => (
                        <span key={line.key} className="text-xs text-(--text-secondary) md:text-sm">
                            {line.value}
                        </span>
                    ))}
                </div>
            </FadeIn>
        </div>
    );
};

export default ContactChannels;
