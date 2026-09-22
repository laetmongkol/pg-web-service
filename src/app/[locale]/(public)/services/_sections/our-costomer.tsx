import { convertObjectToArrayByPrefix, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";

import DragMarquee from "../../_sections/components/drag-marquee";

/** attributes on `customer*` — the logo; the brand name is the row value. */
interface Customer {
    name: string;
    image: string;
    width?: number;
    height?: number;
}


const COPIES_PER_HALF = 2;

const ROW_HEIGHT = "h-8 sm:h-9";

const CustomerRow = ({ customers }: { customers: Customer[] }) => (
    <div className="flex w-max items-center">
        {customers.map(({ name, image, width, height }) => (
            <span key={name} className="mx-6 flex shrink-0 items-center gap-2.5 sm:mx-8">
                {image ? (
                    <FillImage
                        src={image}
                        alt={name}
                        width={width}
                        height={height}
                        /* eager: an unloaded logo measures 0 wide and would collapse the track */
                        loading="eager"
                        draggable={false}
                        wrapperClassName={cn("w-auto shrink-0", ROW_HEIGHT)}
                        className="aspect-auto h-full w-auto max-w-none object-contain"
                    />
                ) : (
                    <span
                        className={cn(
                            "whitespace-nowrap font-semibold text-(--text-primary)",
                            "text-lg sm:text-xl",
                        )}
                    >
                        {name}
                    </span>
                )}
            </span>
        ))}
    </div>
);

interface OurCustomerProps {
    data?: Record<string, TranslateContentResponseDto>;
}

const OurCustomer = ({ data }: OurCustomerProps) => {
    if (!data) return null;

    const EYEBROW = data?.eyebrow?.value;
    const TITLE = data?.title?.value;
    const customers: Customer[] = convertObjectToArrayByPrefix<PictureAttributes>(data, "customer").map(
        (customer) => ({
            name: customer.value ?? "",
            image: customer.attributes?.mediaStorageKey ?? "",
            width: customer.attributes?.width,
            height: customer.attributes?.height,
        }),
    );

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
                        <CustomerRow customers={customers} />
                    </DragMarquee>
                </FadeIn>
            </div>
        </section>
    );
};

export default OurCustomer;
