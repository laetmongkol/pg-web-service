import cn from "@/lib/tw-merge";

import FadeIn from "@/app/component/fade-in.components";

const EYEBROW = "Who We Are";

/** The badge is the section's label, so this statement carries the heading itself — hence the
 *  lead-paragraph weight rather than the bold h2 the other sections use. */
const STATEMENT_LINES = [
    "เราสร้างสรรค์และวางแผนกลยุทธ์สื่อสารดิจิทัลแบบครบวงจร ที่ไม่ใช่เพียงแค่สร้างความตระหนักรู้",
    "แต่เป็นการขับเคลื่อนยอดขายและการเติบโตของแบรนด์อย่างยั่งยืนในยุคดิจิทัล",
];

const WhoWeAre = () => {
    return (
        <section
            id="who-we-are"
            className={cn("w-full bg-(--surface-page)", "py-16 sm:py-20 lg:py-28")}
        >
            <div className={cn("mx-auto max-w-7xl", "px-4 sm:px-8")}>
                <div className="flex flex-col items-center text-center">
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
                                // one block per clause, so the break lands where the design puts
                                // it; each clause still wraps on its own once the screen narrows
                                "mt-8 max-w-3xl text-(--text-primary) sm:mt-10",
                                "text-sm leading-loose md:text-base",
                            )}
                        >
                            {STATEMENT_LINES.map((line) => (
                                <span key={line} className="block">
                                    {line}
                                </span>
                            ))}
                        </h2>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
};

export default WhoWeAre;
