import { ArrowUpRight } from "lucide-react";

import { extractAttributes, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";
import LinkCustom from "@/components/link-custom.component";

import PillLabel from "../../_shared/pill-label";
import { HEADING_GRADIENT_LIGHT_CLASSNAME, SECTION_CONTAINER_CLASSNAME } from "../../_shared/styles";

const SERVICE_KEYS = ["service1", "service2", "service3", "service4", "service5"] as const;

/** First row is two wide cards, the rest sit three-up. */
const WIDE_COUNT = 2;

/** The outer corner of the grid gets the big radius, like one rounded block cut into cards. */
const CORNER_CLASSNAME = [
    "sm:rounded-tl-[2.5rem]",
    "sm:rounded-tr-[2.5rem]",
    "sm:rounded-bl-[2.5rem]",
    "",
    "sm:rounded-br-[2.5rem]",
];

type ServiceItem = {
    key: string;
    title: string;
    image: string;
};

/** service1..5 — value is the service name, plus the row's picture. */
function getServices(data: Record<string, TranslateContentResponseDto>): ServiceItem[] {
    return SERVICE_KEYS.flatMap((key) => {
        const item = data?.[key];
        if (!item?.value) return [];

        const pictureAttributes = extractAttributes<PictureAttributes>(item);
        return [{ key, title: item.value, image: pictureAttributes?.mediaStorageKey ?? "" }];
    });
}

interface ServiceCardProps {
    title: string;
    image: string;
    button: string;
    href: string;
    cornerClassName?: string;
}

/**
 * 3D illustration shown whole in the upper part of the card (it carries its own navy backdrop that
 * melts into the card), copy on the bottom. On hover (pointer screens) the button rises out
 * of a collapsed row under the title, pushing the title up; touch screens always show it.
 */
const ServiceCard = ({ title, image, button, href, cornerClassName }: ServiceCardProps) => (
    <article
        className={cn(
            "group relative isolate flex h-72 flex-col justify-end overflow-hidden rounded-xl px-6 pb-7 text-center sm:h-80 lg:h-[21.5rem]",
            "bg-[image:var(--surface-card-dark)] text-(--text-on-dark)",
            cornerClassName,
        )}
    >
        <FillImage
            draggable={false}
            src={image}
            alt=""
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
            wrapperClassName="absolute inset-x-0 top-0 bottom-[24%] -z-10"
            className="object-contain object-top transition-transform! duration-700! group-hover:scale-105"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[image:var(--card-image-fade)]" />

        <h3 className="text-sm font-bold leading-snug sm:text-[0.9375rem]">{title}</h3>

        {/* 0fr → 1fr animates the row's height, so the title is pushed up as the button fades in */}
        <div
            className={cn(
                "grid grid-rows-[1fr] lg:grid-rows-[0fr]",
                "lg:group-hover:grid-rows-[1fr] lg:group-focus-within:grid-rows-[1fr]",
                "transition-[grid-template-rows]! duration-500! ease-out",
            )}
        >
            <div className="min-h-0 overflow-hidden">
                <LinkCustom
                    href={href}
                    className={cn(
                        "mt-4 inline-flex items-center gap-3 rounded-full border border-(--border-on-dark) bg-(--glass-on-dark) px-6 py-2 text-xs backdrop-blur-sm",
                        "transition-[opacity,transform,translate,scale,background-color]! duration-500! ease-out hover:bg-(--border-on-dark)",
                        "hover:scale-105 active:scale-95",
                        "lg:translate-y-3 lg:opacity-0",
                        "lg:group-hover:translate-y-0 lg:group-hover:opacity-100",
                        "lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100",
                    )}
                >
                    {button}
                    <ArrowUpRight size={14} strokeWidth={2} aria-hidden />
                </LinkCustom>
            </div>
        </div>
    </article>
);

interface ServiceListSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

const ServiceListSection = ({ data, language }: ServiceListSectionProps) => {
    if (!data) return null;
    const services = getServices(data);
    const button = data?.button?.value ?? "";
    const href = `/${language}/${data?.button?.linkUrl}`;

    return (
        <section id="our-services" className="w-full py-16 sm:py-20 lg:py-24">
            <div className={SECTION_CONTAINER_CLASSNAME}>
                <div className="flex flex-col items-center text-center">
                    <FadeIn>
                        <PillLabel>{data?.label?.value}</PillLabel>
                    </FadeIn>
                    <FadeIn delay={80}>
                        <h2
                            className={cn(
                                HEADING_GRADIENT_LIGHT_CLASSNAME,
                                "mt-5 font-bold text-3xl leading-tight sm:text-4xl lg:text-[3.25rem]",
                            )}
                        >
                            {data?.title?.value}
                        </h2>
                    </FadeIn>
                    <FadeIn delay={140} className="mt-5 max-w-4xl text-sm text-(--text-on-light) sm:text-base">
                        {data?.description?.value}
                    </FadeIn>
                </div>

                <FadeIn delay={200} className="mt-12 flex flex-col gap-4 sm:gap-2.5 lg:mt-20">
                    <ul className="grid gap-4 sm:grid-cols-2 sm:gap-2.5">
                        {services.slice(0, WIDE_COUNT).map(({ key, title, image }, index) => (
                            <li key={key}>
                                <ServiceCard
                                    title={title}
                                    image={image}
                                    button={button}
                                    href={href}
                                    cornerClassName={CORNER_CLASSNAME[index]}
                                />
                            </li>
                        ))}
                    </ul>
                    <ul className="grid gap-4 sm:grid-cols-3 sm:gap-2.5">
                        {services.slice(WIDE_COUNT).map(({ key, title, image }, index) => (
                            <li key={key}>
                                <ServiceCard
                                    title={title}
                                    image={image}
                                    button={button}
                                    href={href}
                                    cornerClassName={CORNER_CLASSNAME[WIDE_COUNT + index]}
                                />
                            </li>
                        ))}
                    </ul>
                </FadeIn>
            </div>
        </section>
    );
};

export default ServiceListSection;
