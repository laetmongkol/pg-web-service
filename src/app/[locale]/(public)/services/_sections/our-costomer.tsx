import { FaApple, FaMicrosoft } from "react-icons/fa6";
import { SiGooglemeet, SiMeta, SiXiaomi, SiZoom } from "react-icons/si";

import cn from "@/lib/tw-merge";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";

import DragMarquee from "../../_sections/components/drag-marquee";

import type { IconType } from "react-icons";

const EYEBROW = "Our Customer";

const TITLE = "แบรนด์ชั้นนำที่ไว้วางใจเรา";

interface Customer {
    name: string;
    image: string;
    width: number;
    height: number;
    Icon?: IconType;
    iconClassName?: string;
}

const CUSTOMERS: Customer[] = [
    { name: "Meta", image: "", width: 400, height: 160, Icon: SiMeta, iconClassName: "text-[#0081FB]" },
    { name: "Google Meet", image: "", width: 400, height: 160, Icon: SiGooglemeet, iconClassName: "text-[#00AC47]" },
    { name: "Microsoft", image: "", width: 400, height: 160, Icon: FaMicrosoft, iconClassName: "text-[#F25022]" },
    { name: "zoom", image: "", width: 400, height: 160, Icon: SiZoom, iconClassName: "text-[#0B5CFF]" },
    { name: "Apple", image: "", width: 400, height: 160, Icon: FaApple, iconClassName: "text-(--text-primary)" },
    { name: "ธนาคารกสิกรไทย", image: "", width: 400, height: 160 },
    { name: "xiaomi", image: "", width: 400, height: 160, Icon: SiXiaomi, iconClassName: "text-[#FF6900]" },
    { name: "andreessen horowitz", image: "", width: 400, height: 160 },
];

const COPIES_PER_HALF = 2;

const ROW_HEIGHT = "h-8 sm:h-9";

const CustomerRow = () => (
    <div className="flex w-max items-center">
        {CUSTOMERS.map(({ name, image, width, height, Icon, iconClassName }) => (
            <span key={name} className="mx-6 flex shrink-0 items-center gap-2.5 sm:mx-8">
                {image ? (
                    <FillImage
                        src={image}
                        alt={name}
                        width={width}
                        height={height}
                        sizes="200px"
                        loading="eager"
                        draggable={false}
                        wrapperClassName={cn("w-auto shrink-0", ROW_HEIGHT)}
                        className="aspect-auto h-full w-auto max-w-none object-contain"
                    />
                ) : (
                    <>
                        {Icon && (
                            <Icon
                                aria-hidden
                                className={cn("size-7 shrink-0 sm:size-8", iconClassName)}
                            />
                        )}
                        <span
                            className={cn(
                                "whitespace-nowrap font-semibold text-(--text-primary)",
                                "text-lg sm:text-xl",
                            )}
                        >
                            {name}
                        </span>
                    </>
                )}
            </span>
        ))}
    </div>
);

const OurCustomer = () => {
    return (
        <section
            id="our-customer"
            className={cn("w-full bg-(--surface-page)", "py-16 sm:py-20 lg:py-28")}
        >
            <div className={cn("mx-auto flex max-w-7xl flex-col items-center", "px-4 sm:px-8")}>
                <FadeIn>
                    <span
                        className={cn(
                            "inline-flex items-center gap-2 rounded-full",
                            "border border-(--border-default) bg-(--surface-default)",
                            "px-4 py-1.5 text-xs font-medium text-(--text-primary) md:text-sm",
                        )}
                    >
                        <span className="bg-(--color-primary) size-1.5 shrink-0 rounded-full" />
                        {EYEBROW}
                    </span>
                </FadeIn>

                <FadeIn delay={90}>
                    <h2
                        className={cn(
                            "mt-8 text-center font-bold text-balance text-(--text-primary)",
                            "text-2xl leading-snug sm:text-3xl lg:text-4xl lg:leading-tight",
                        )}
                    >
                        {TITLE}
                    </h2>
                </FadeIn>

                <FadeIn delay={180} className="mt-12 w-full lg:mt-14">
                    <DragMarquee copiesPerHalf={COPIES_PER_HALF}>
                        <CustomerRow />
                    </DragMarquee>
                </FadeIn>
            </div>
        </section>
    );
};

export default OurCustomer;
