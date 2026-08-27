import Image, { type ImageProps } from "next/image";

import cn from "@/lib/tw-merge";

/** Tiny service-card glyph — `w-12 sm:w-14`. */
export const FILL_IMAGE_SIZES_ICON_SM = "(max-width: 640px) 100px, 150px";
/** Blog / recommend card thumb — 1 / 2 / 3 / 4 cols at sm / md / lg. */
export const FILL_IMAGE_SIZES_GRID_4 =
    "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw";
/** Portrait promo slide — `w-62.5` mobile, 3-up from md. */
export const FILL_IMAGE_SIZES_SLIDE = "(max-width: 768px) 250px, 33vw";
/** Register-step illustration — `max-w-[250px] lg:max-w-[480px]`. */
export const FILL_IMAGE_SIZES_STEP = "(max-width: 1024px) 250px, 480px";

export interface FillImageProps extends Omit<ImageProps, "width" | "height" | "fill" | "sizes"> {
    wrapperClassName?: string;
    sizes?: string;
    /** Intrinsic pixels from media (CMS). Caps srcset + sets img width/height. */
    width?: number;
    height?: number;
}

const isUsablePx = (value?: number): value is number =>
    typeof value === "number" && Number.isFinite(value) && value >= 1;

const FillImage = ({
    src,
    alt,
    wrapperClassName,
    className,
    sizes,
    width,
    height,
    ...imageProps
}: FillImageProps) => {
    if (!src) return null;

    const hasIntrinsic = isUsablePx(width) && isUsablePx(height);

    return (
        <div className={cn("relative", wrapperClassName)}>
            {hasIntrinsic ? (
                <Image
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    sizes={sizes}
                    className={cn("h-full w-full", className)}
                    {...imageProps}
                />
            ) : (
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes={sizes}
                    className={className}
                    {...imageProps}
                />
            )}
        </div>
    );
};

export default FillImage;
