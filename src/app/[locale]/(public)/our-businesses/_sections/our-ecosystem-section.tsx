import { Fragment, type ReactNode } from "react";

import { Building2, LayoutGrid, TrendingUp, type LucideIcon } from "lucide-react";

import CountUpNumber from "@/app/component/count-up-number.component";
import FadeIn from "@/app/component/fade-in.components";
import cn from "@/lib/tw-merge";

const WORD_BREAK = "​";

const ECOSYSTEM_BODY_CLAUSES = [
    ["ดำเนินธุรกิจ", "ผ่าน", "บริษัทในเครือ", "ที่มี", "ความเชี่ยวชาญ", "ใน", "หลากหลายอุตสาหกรรม"],
    ["เพื่อสร้าง", "การเติบโต", "อย่างต่อเนื่อง", "และยั่งยืน"],
];

const renderClause = (clause: string[], clauseIndex: number): ReactNode[] =>
    clause.flatMap((word, wordIndex) => {
        const held = (
            <span key={`${clauseIndex}-${wordIndex}`} className="whitespace-nowrap">
                {word}
            </span>
        );
        return wordIndex === 0 ? [held] : [WORD_BREAK, held];
    });

type EcosystemStat = {
    key: string;
    Icon: LucideIcon;
    value: string;
    label: string;
};

const ECOSYSTEM_STATS: EcosystemStat[] = [
    { key: "subsidiaries", Icon: Building2, value: "6 +", label: "บริษัทในเครือ" },
    { key: "industries", Icon: LayoutGrid, value: "5", label: "กลุ่มอุตสาหกรรม" },
    { key: "growth", Icon: TrendingUp, value: "99%", label: "โอกาสในการเติบโต" },
];

const OurEcosystemSection = () => {
    return (
        <section
            id="our-businesses-content"
            className="w-full bg-(--surface-page)"
        >
            <FadeIn
                className={cn(
                    "flex flex-col lg:flex-row lg:items-center",
                    "max-w-6xl mx-auto px-6 sm:px-12 md:px-16",
                    "py-16 gap-12 lg:gap-16",
                )}
            >
                <div
                    className={cn(
                        "flex flex-1 flex-col gap-4",
                        "items-center text-center",
                    )}
                >
                    <span
                        className={cn(
                            "text-(--color-secondary) border border-(--color-secondary)",
                            "px-4 py-1 rounded-full text-center font-bold",
                            "text-xs tracking-wide",
                        )}
                    >
                        {"OUR ECOSYSTEM"}
                    </span>
                    <h2
                        className={cn(
                            "font-bold leading-tight",
                            "text-xl sm:text-3xl",
                        )}
                    >
                        <span className="text-(--color-secondary)">{"เชื่อมโยงธุรกิจ "}</span>
                        <span className="text-(--text-primary) whitespace-nowrap">{"สร้างคุณค่าอย่างยั่งยืน"}</span>
                    </h2>
                    <p
                        className={cn(
                            "text-(--text-secondary) text-xs sm:text-base",
                            "max-w-md",
                        )}
                    >
                        <span className="block">{"PIP Group Holding"}</span>
                        {ECOSYSTEM_BODY_CLAUSES.map((clause, clauseIndex) => (
                            <Fragment key={clauseIndex}>
                                {clauseIndex > 0 ? " " : null}
                                {renderClause(clause, clauseIndex)}
                            </Fragment>
                        ))}
                    </p>
                </div>

                <div
                    className={cn(
                        "flex flex-1 items-start justify-evenly",
                        "gap-2 sm:gap-4",
                    )}
                >
                    {ECOSYSTEM_STATS.map(({ key, Icon, value, label }) => (
                        <div
                            key={key}
                            className="flex flex-col items-center gap-2 text-center"
                        >
                            <Icon
                                className={cn(
                                    "text-(--color-secondary) size-12 shrink-0",
                                    "bg-(--surface-default) rounded-xl p-3 shadow-sm",
                                )}
                                strokeWidth={1.6}
                            />
                            <CountUpNumber
                                value={value}
                                className="text-2xl font-bold text-(--text-primary) sm:text-3xl"
                            />
                            <span
                                className={cn(
                                    "text-(--text-secondary)",
                                    "whitespace-nowrap",
                                    "text-xs sm:text-sm",
                                )}
                            >
                                {label}
                            </span>
                        </div>
                    ))}
                </div>
            </FadeIn>
        </section>
    );
};

export default OurEcosystemSection;
