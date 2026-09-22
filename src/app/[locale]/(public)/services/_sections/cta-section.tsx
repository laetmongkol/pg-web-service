import { ArrowRight } from "lucide-react";

import cn from "@/lib/tw-merge";
import { BANNER_IMAGE_DRAG_PREVENT_CLASSNAME } from "@/shared/ui/classes/base.classes";

import FadeIn from "@/app/component/fade-in.components";
import FillImage from "@/components/fill-image.component";
import AppLogo from "@/components/layout/logo";
import LinkCustom from "@/components/link-custom.component";

interface CtaSectionProps {
    language: string;
}

const MOCK = {
    title: "พร้อมเริ่มต้นการเติบโตครั้งสำคัญไปกับเรา",
    subTitle:
        "ให้ทีมงานคุณภาพของเราให้คำปรึกษาและออกแบบกลยุทธ์การตลาดที่เหมาะกับธุรกิจของคุณ",
    buttonLabel: "ติดต่อปรึกษาเรา",
    buttonPath: "contact-us",
    backgroundSrc: "",
    backgroundAlt: "",
};

const HOVER_EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]!";

const CtaSection = ({ language }: CtaSectionProps) => {
    return (
        <section
            id="cta"
            className={cn("w-full bg-(--surface-page)", "py-16 sm:py-20 lg:py-28")}
        >
            <div className={cn("mx-auto max-w-7xl", "px-4 sm:px-8")}>
                <FadeIn>
                    <div
                        className={cn(
                            "relative w-full overflow-hidden rounded-3xl lg:rounded-[2rem]",
                            "px-6 py-12 sm:px-10 sm:py-14 lg:min-h-84 lg:px-20 lg:py-12",
                            "bg-linear-to-br from-(--color-secondary-200) via-(--surface-default) to-(--color-secondary-300)",
                        )}
                    >
                        <FillImage
                            src={MOCK.backgroundSrc}
                            alt={MOCK.backgroundAlt || MOCK.title}
                            sizes="(max-width: 1280px) 100vw, 1216px"
                            wrapperClassName="absolute inset-0 h-full w-full"
                            className={cn(
                                "h-full w-full object-cover object-center",
                                BANNER_IMAGE_DRAG_PREVENT_CLASSNAME,
                            )}
                        />

                        <div
                            className={cn(
                                "pointer-events-none absolute inset-0 bg-linear-to-r",
                                "from-(--surface-default) via-(--surface-default)/85 to-(--surface-default)/40",
                                "lg:via-(--surface-default)/70 lg:to-transparent",
                            )}
                        />

                        <div
                            className={cn(
                                "relative flex max-w-md flex-col lg:max-w-xl",
                                "mx-auto items-center text-center lg:mx-0 lg:items-start lg:text-left",
                            )}
                        >
                            <FadeIn delay={120}>
                                <AppLogo width={140} />
                            </FadeIn>

                            <FadeIn delay={210}>
                                <h2
                                    className={cn(
                                        "mt-6 font-bold text-balance text-(--text-primary)",
                                        "text-xl leading-snug sm:text-2xl",
                                    )}
                                >
                                    {MOCK.title}
                                </h2>
                            </FadeIn>

                            <FadeIn delay={300}>
                                <p
                                    className={cn(
                                        "mt-4 max-w-lg text-(--text-secondary)",
                                        "text-xs leading-loose md:text-sm",
                                    )}
                                >
                                    {MOCK.subTitle}
                                </p>
                            </FadeIn>

                            <FadeIn delay={390}>
                                <LinkCustom
                                    href={`/${language}/${MOCK.buttonPath}`}
                                    className={cn(
                                        "group mt-8 inline-flex items-center gap-3 rounded-full",
                                        "bg-(--color-primary) text-(--text-invert)",
                                        "px-8 py-3.5 text-xs font-medium md:text-sm",
                                        "transition-[background-color]! duration-300! motion-reduce:transition-none!",
                                        HOVER_EASE,
                                        "hover:bg-(--color-primary-350)",
                                    )}
                                >
                                    {MOCK.buttonLabel}
                                    <ArrowRight
                                        className={cn(
                                            "size-4 shrink-0",
                                            "transition-[translate]! duration-300! motion-reduce:transition-none!",
                                            HOVER_EASE,
                                            "group-hover:translate-x-1",
                                        )}
                                    />
                                </LinkCustom>
                            </FadeIn>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
};

export default CtaSection;
