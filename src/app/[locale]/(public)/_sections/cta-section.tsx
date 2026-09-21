import cn from "@/lib/tw-merge";

import FadeIn from "@/app/component/fade-in.components";
import AppLogo from "@/components/layout/logo";

import SubscribeForm from "./components/subscribe-form";

const TITLE = "พร้อมเริ่มต้นการเติบโตครั้งสำคัญ";
const DESCRIPTION =
    "ปรึกษากับทีม Sriwilai เพื่อค้นหาโอกาสใหม่ ๆ ให้ธุรกิจของคุณ ไม่ว่าจะเป็นกลยุทธ์ การตลาด หรือการสร้างแบรนด์";
const EMAIL_PLACEHOLDER = "Enter your Email";
const SUBMIT_LABEL = "Subscribe";

interface CtaSectionProps {
    language: string;
}

const CtaSection = ({ language }: CtaSectionProps) => {
    return (
        <section id="cta" className={cn("w-full bg-(--surface-elevated)", "py-16 sm:py-20 lg:py-24")}>
            <div className={cn("mx-auto w-full max-w-7xl", "px-4 sm:px-8")}>
                <FadeIn
                    className={cn(
                        "relative overflow-hidden rounded-3xl",
                        // brand silver wash stands in for the silk artwork in the design
                        "bg-[image:var(--brand-gradient-silver)]",
                        "px-6 py-12 sm:px-12 sm:py-16",
                    )}
                >
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-linear-to-r from-(--surface-elevated) via-(--surface-elevated)/85 to-(--surface-elevated)/40"
                    />

                    <div className="relative flex flex-col items-start gap-6">
                        {/* the brand PNG is the white mark; darken it for this light panel */}
                        <AppLogo width={140} className="h-10 brightness-0 sm:h-12 dark:brightness-100" />

                        <h2
                            className={cn(
                                "font-bold text-balance text-(--text-primary)",
                                "text-xl leading-snug sm:text-2xl lg:text-3xl",
                            )}
                        >
                            {TITLE}
                        </h2>

                        <p className="max-w-2xl text-xs text-(--text-secondary) md:text-sm">
                            {DESCRIPTION}
                        </p>

                        <SubscribeForm
                            placeholder={EMAIL_PLACEHOLDER}
                            submitLabel={SUBMIT_LABEL}
                            contactHref={`/${language}/contact-us`}
                        />
                    </div>
                </FadeIn>
            </div>
        </section>
    );
};

export default CtaSection;
