import { ArrowUpRight } from "lucide-react";

import cn from "@/lib/tw-merge";
import { BUTTON_SCALE_CLASSNAME } from "@/shared/ui/classes/base.classes";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";
import LinkCustom from "@/components/link-custom.component";

import { HEADING_GRADIENT_LIGHT_CLASSNAME } from "./styles";

// Ring radii in the 1000-unit SVG viewBox, around the circular photo.
const CTA_RING_RADII = [190, 300, 420];

export interface CtaCardProps {
    title1: string;
    title2: string;
    description: string;
    button: string;
    href: string;
    image: string;
    imageAlt: string;
}

/** White closing card used at the bottom of every public page: headline + button, round photo in rings. */
const CtaCard = ({ title1, title2, description, button, href, image, imageAlt }: CtaCardProps) => (
    <section id="cta" className="w-full px-4 py-16 sm:px-8 sm:py-20 lg:py-24">
        <FadeIn
            className={cn(
                "relative mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-(--surface-card) sm:rounded-[2.5rem]",
                "items-center gap-10 px-6 py-12 sm:px-12 lg:grid-cols-2 lg:px-16 lg:py-20",
            )}
        >
            <div className="relative z-10 flex flex-col items-center text-center">
                <h2
                    className={cn(
                        HEADING_GRADIENT_LIGHT_CLASSNAME,
                        "font-bold text-3xl leading-tight sm:text-4xl lg:text-5xl lg:leading-[1.25]",
                    )}
                >
                    <span className="block">{title1}</span>
                    <span className="block">{title2}</span>
                </h2>
                <p className="mt-6 max-w-sm whitespace-pre-line text-xs leading-relaxed text-(--text-on-light) sm:text-sm">
                    {description}
                </p>
                <LinkCustom
                    href={href}
                    className={cn(
                        "mt-6 inline-flex items-center gap-10 rounded-full bg-(--button-on-light) px-10 py-3.5",
                        "text-base text-(--text-on-dark) sm:text-lg",
                        BUTTON_SCALE_CLASSNAME,
                    )}
                >
                    {button}
                    <ArrowUpRight size={22} strokeWidth={2} aria-hidden />
                </LinkCustom>
            </div>

            <div className="relative flex items-center justify-center">
                <svg
                    aria-hidden
                    viewBox="0 0 1000 1000"
                    className="pointer-events-none absolute left-1/2 top-1/2 size-[200%] -translate-x-1/2 -translate-y-1/2"
                    fill="none"
                    stroke="var(--text-on-light)"
                    strokeWidth={1}
                    vectorEffect="non-scaling-stroke"
                >
                    {CTA_RING_RADII.map((r) => (
                        <circle key={r} cx={500} cy={500} r={r} strokeOpacity={0.08} />
                    ))}
                </svg>
                <FillImage
                    draggable={false}
                    src={image}
                    alt={imageAlt}
                    sizes="240px"
                    wrapperClassName="relative size-48 overflow-hidden rounded-full sm:size-60"
                    className="object-cover"
                />
            </div>
        </FadeIn>
    </section>
);

export default CtaCard;
