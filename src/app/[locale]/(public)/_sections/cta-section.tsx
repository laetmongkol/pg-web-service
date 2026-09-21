import { PictureAttributes } from "@/lib/cms/content-attributes";
import { BACKEND_IMAGE_PREFIX } from "@/lib/media/image-loader";
import cn from "@/lib/tw-merge";
import { BANNER_IMAGE_DRAG_PREVENT_CLASSNAME } from "@/shared/ui/classes/base.classes";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";
import AppLogo from "@/components/layout/logo";

import SubscribeForm from "./components/subscribe-form";

const TITLE = "พร้อมเริ่มต้นการเติบโตครั้งสำคัญ";
const DESCRIPTION =
    "ปรึกษากับทีมงาน Sriwilai เพื่อค้นหาโอกาสใหม่ ๆ ให้ธุรกิจของคุณ ไม่ว่าจะเป็นกลยุทธ์ การตลาด หรือการสร้างแบรนด์";
const EMAIL_PLACEHOLDER = "Enter your Email";
const SUBMIT_LABEL = "Subscribe";

/**
 * Backdrop of the panel, in the shape a `translate_contents` picture row returns — the file lives
 * on `mediaStorageKey` and nothing else. A mock stands in until the silk artwork from the design is
 * uploaded; swap for `extractAttributes<PictureAttributes>(data?.bgImg)` once the CMS carries it.
 */
const BACKGROUND_ROW: PictureAttributes = {
    mediaStorageKey: "contents/2026-09-18T10-09-01_9d3a7339-94c1-4b4c-969b-c5ee9180c920.png",
    mediaAltText: "",
    width: 1536,
    height: 1024,
};

/** What `extractAttributes` does to a CMS picture row: the stored key is bare until it is read. */
const BACKGROUND: PictureAttributes = BACKGROUND_ROW.mediaStorageKey
    ? { ...BACKGROUND_ROW, mediaStorageKey: `${BACKEND_IMAGE_PREFIX}${BACKGROUND_ROW.mediaStorageKey}` }
    : BACKGROUND_ROW;

interface CtaSectionProps {
    language: string;
}

const CtaSection = ({ language }: CtaSectionProps) => {
    return (
        <section id="cta" className={cn("w-full bg-(--surface-elevated)", "py-16 sm:py-20 lg:py-24")}>
            <div className={cn("mx-auto w-full max-w-7xl", "px-4 sm:px-8")}>
                <div
                    className={cn(
                        "relative overflow-hidden rounded-3xl",
                        // the artwork carries the panel; the colour only shows while it loads
                        "bg-(--surface-page)",
                        "px-6 py-12 sm:px-12 sm:py-16",
                    )}
                >
                    {BACKGROUND.mediaStorageKey ? (
                        <FillImage
                            src={BACKGROUND.mediaStorageKey}
                            alt={BACKGROUND.mediaAltText ?? ""}
                            width={BACKGROUND.width}
                            height={BACKGROUND.height}
                            sizes="(max-width: 1280px) 100vw, 1280px"
                            draggable={false}
                            wrapperClassName="pointer-events-none absolute inset-0 h-full w-full"
                            className={cn(
                                "h-full w-full object-cover object-right",
                                BANNER_IMAGE_DRAG_PREVENT_CLASSNAME,
                            )}
                        />
                    ) : null}

                    {/* the copy sits on the light side of the artwork, so the wash only veils the left */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-linear-to-r from-(--surface-elevated) via-(--surface-elevated)/85 to-(--surface-elevated)/40"
                    />

                    <div className="relative flex flex-col items-start gap-6">
                        {/* the brand PNG is the white mark; darken it for this light panel */}
                        <FadeIn delay={100}>
                            <AppLogo width={140} className="h-10 brightness-0 sm:h-12 dark:brightness-100" />
                        </FadeIn>
                        <FadeIn delay={200}>
                            <h2
                                className={cn(
                                    "font-bold text-balance text-(--text-primary)",
                                    "text-xl leading-snug sm:text-2xl lg:text-3xl",
                                )}
                            >
                                {TITLE}
                            </h2>
                        </FadeIn>
                        <FadeIn delay={300} className="max-w-2xl text-xs text-(--text-secondary) md:text-sm">
                            {DESCRIPTION}
                        </FadeIn>
                        <FadeIn delay={400}>
                            <SubscribeForm
                                placeholder={EMAIL_PLACEHOLDER}
                                submitLabel={SUBMIT_LABEL}
                                contactHref={`/${language}/contact-us`}
                            />
                        </FadeIn>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CtaSection;
