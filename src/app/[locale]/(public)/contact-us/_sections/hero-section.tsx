import { PictureAttributes } from "@/lib/cms/content-attributes";
import { BACKEND_IMAGE_PREFIX } from "@/lib/media/image-loader";
import cn from "@/lib/tw-merge";
import { BANNER_IMAGE_DRAG_PREVENT_CLASSNAME } from "@/shared/ui/classes/base.classes";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";

const EYEBROW = "Contact Us";
const TITLE = "ติดต่อเรา";
const DESCRIPTION = "เริ่มต้นพูดคุยเพื่อสร้างสรรค์งานสถาปัตยกรรมและการก่อสร้างที่เป็นเอกลักษณ์เฉพาะตัวคุณ";

/**
 * Hardcoded stand-in for the banner picture row, in the shape a `translate_contents` picture row
 * returns — the file lives on `mediaStorageKey` and nothing else. Swap for
 * `extractAttributes<PictureAttributes>(data?.bgImg)` once page `ContactUs` section `1` is filled.
 */
const BANNER_ROW: PictureAttributes = {
    mediaStorageKey: "contents/2026-09-18T10-09-01_9d3a7339-94c1-4b4c-969b-c5ee9180c920.png",
    mediaAltText: "สำนักงาน Sriwilai Consulting & Marketing Agency",
    width: 1536,
    height: 1024,
};

/** What `extractAttributes` does to a CMS picture row: the stored key is bare until it is read. */
const BANNER: PictureAttributes = BANNER_ROW.mediaStorageKey
    ? { ...BANNER_ROW, mediaStorageKey: `${BACKEND_IMAGE_PREFIX}${BANNER_ROW.mediaStorageKey}` }
    : BANNER_ROW;

const HeroSection = () => {
    return (
        <section
            id="hero"
            className={cn(
                "relative flex w-full flex-col",
                // the radial wash in the design: page grey at the rim, near-white in the middle
                "bg-(--surface-page)",
                "lg:max-h-[1080px] aspect-square lg:aspect-[16/8] pt-(--navbar-height)",
            )}
        >
            <FillImage
                src={BANNER.mediaStorageKey ?? ""}
                alt={BANNER.mediaAltText ?? TITLE}
                width={BANNER.width}
                height={BANNER.height}
                sizes="100vw"
                priority
                wrapperClassName="absolute inset-0 h-full w-full"
                className={cn("h-full w-full object-cover", BANNER_IMAGE_DRAG_PREVENT_CLASSNAME)}
            />

            {/* the copy sits over a photo, so it carries its own contrast rather than relying on one */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-(--color-primary-400)/55"
            />

            <div className="absolute inset-0 z-10 flex">
                <div
                    className={cn(
                        "mx-auto flex w-full max-w-4xl flex-col items-center justify-center text-center",
                        "px-4 pt-(--navbar-height) sm:px-8",
                    )}
                >
                    <FadeIn>
                        <span className="text-xs text-(--text-invert)/80 md:text-sm">{EYEBROW}</span>
                    </FadeIn>

                    <FadeIn delay={100}>
                        <h1
                            className={cn(
                                "mt-4 font-bold text-balance text-(--text-invert)",
                                "text-3xl leading-tight sm:text-5xl lg:text-6xl",
                            )}
                        >
                            {TITLE}
                        </h1>
                    </FadeIn>

                    <FadeIn delay={200}>
                        <p
                            className={cn(
                                "mt-6 max-w-2xl text-(--text-invert)/85",
                                "text-xs leading-relaxed md:text-sm",
                            )}
                        >
                            {DESCRIPTION}
                        </p>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
