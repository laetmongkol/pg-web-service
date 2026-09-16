import { Fragment, type ReactNode } from "react";

import { ArrowUpRight } from "lucide-react";

import cn from "@/lib/tw-merge";

import SelectCustom from "@/components/select-custom.component";

const FIELD_CLASSNAME = cn(
    "w-full rounded-lg border border-(--border-default) bg-(--surface-default)",
    "px-4 py-2.5 text-sm text-(--text-primary) placeholder:text-(--text-muted)",
    "outline-none transition-colors focus:border-(--color-primary)",
);

const LABEL_CLASSNAME = "text-sm font-medium text-(--text-primary)";

const WORD_BREAK = "​";

const FORM_INTRO_CLAUSES = [
    ["กรุณา", "กรอก", "ข้อมูล", "ด้านล่าง"],
    ["แล้ว", "ทีมงาน", "ของเรา", "จะ", "ติดต่อกลับ", "หาคุณ", "โดยเร็วที่สุด"],
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

type TextField = {
    name: string;
    label: string;
    placeholder: string;
    type: string;
    autoComplete: string;
};

const TEXT_FIELDS: TextField[] = [
    {
        name: "fullName",
        label: "ชื่อ – นามสกุล",
        placeholder: "กรอกชื่อผู้ติดต่อ หรือชื่อแบรนด์ของคุณ",
        type: "text",
        autoComplete: "name",
    },
    {
        name: "email",
        label: "อีเมล",
        placeholder: "email@example.com",
        type: "email",
        autoComplete: "email",
    },
    {
        name: "phone",
        label: "เบอร์โทรศัพท์",
        placeholder: "000-000-0000",
        type: "tel",
        autoComplete: "tel",
    },
];

const TOPICS = [
    { code: "business", label: "โอกาสทางธุรกิจ" },
    { code: "investment", label: "การลงทุน" },
    { code: "partnership", label: "ความร่วมมือและพันธมิตร" },
    { code: "press", label: "การประชาสัมพันธ์" },
    { code: "career", label: "ร่วมงานกับเรา" },
    { code: "other", label: "อื่น ๆ" },
];

const ContactForm = () => {
    return (
        <div
            className={cn(
                "flex w-full flex-col gap-5 rounded-3xl bg-(--surface-elevated) shadow-(--shadow-lg)",
                "p-6 sm:p-8",
            )}
        >
            {/* Heading and blurb centre on a phone and go back to flush-left beside the map. */}
            <div className="flex flex-col gap-2 text-center lg:text-start">
                <h2
                    className={cn(
                        "font-extrabold text-(--color-primary)",
                        "text-xl sm:text-2xl",
                    )}
                >
                    {"ส่งข้อความถึงเรา"}
                </h2>
                <p className="text-xs text-(--text-secondary) sm:text-sm">
                    {FORM_INTRO_CLAUSES.map((clause, clauseIndex) => (
                        <Fragment key={clauseIndex}>
                            {clauseIndex > 0 ? " " : null}
                            {renderClause(clause, clauseIndex)}
                        </Fragment>
                    ))}
                </p>
            </div>

            <div className="flex flex-col gap-4">
                {TEXT_FIELDS.map(({ name, label, placeholder, type, autoComplete }) => (
                    <div key={name} className="flex flex-col gap-2">
                        <label className={LABEL_CLASSNAME} htmlFor={`contact-${name}`}>
                            {label}
                        </label>
                        <input
                            id={`contact-${name}`}
                            name={name}
                            type={type}
                            autoComplete={autoComplete}
                            placeholder={placeholder}
                            className={FIELD_CLASSNAME}
                        />
                    </div>
                ))}

                <div className="flex flex-col gap-2">
                    <label className={LABEL_CLASSNAME} htmlFor="contact-topicCode">
                        {"ระบุหัวข้อที่ต้องการติดต่อ"}
                    </label>
                    <SelectCustom id="contact-topicCode" name="topicCode" defaultValue="">
                        <option value="" disabled>
                            {"กรุณาเลือกหัวข้อที่ต้องการติดต่อ"}
                        </option>
                        {TOPICS.map(({ code, label }) => (
                            <option key={code} value={code}>
                                {label}
                            </option>
                        ))}
                    </SelectCustom>
                </div>

                <div className="flex flex-col gap-2">
                    <label className={LABEL_CLASSNAME} htmlFor="contact-message">
                        {"ข้อความของคุณ"}
                    </label>
                    <textarea
                        id="contact-message"
                        name="message"
                        rows={4}
                        placeholder="พิมพ์ข้อความของคุณที่นี่"
                        className={cn(FIELD_CLASSNAME, "resize-y")}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <button
                    type="button"
                    className={cn(
                        "flex w-full items-center justify-center gap-2 rounded-full",
                        "bg-(--color-secondary-800) text-(--text-invert)",
                        "px-6 py-3 text-sm font-medium",
                        "hover:opacity-90 transition-opacity",
                    )}
                >
                    {"ส่งข้อความ"}
                    <ArrowUpRight className="size-4" strokeWidth={2} />
                </button>
                <p className="text-center text-xs text-(--text-secondary)">
                    {"ทีมงานของเราจะติดต่อกลับภายใน 24 ชั่วโมงในวันทำการ"}
                </p>
            </div>
        </div>
    );
};

export default ContactForm;
