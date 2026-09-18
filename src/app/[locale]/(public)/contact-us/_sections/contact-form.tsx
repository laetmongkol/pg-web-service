import { ArrowUpRight } from "lucide-react";

import { convertObjectToArrayByPrefix } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { renderNowrapText } from "@/lib/ui/text-utils";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import SelectCustom from "@/components/select-custom.component";

interface ContactFormProps {
    data?: Record<string, TranslateContentResponseDto>;
}

/** attributes on `field*` — the label is the row value. */
interface FieldAttributes {
    name?: string;
    type?: string;
    autoComplete?: string;
    placeholder?: string;
}

/** attributes on `topic*` — the option label is the row value. */
interface TopicAttributes {
    code?: string;
}

const FIELD_CLASSNAME = cn(
    "w-full rounded-lg border border-(--border-default) bg-(--surface-default)",
    "px-4 py-2.5 text-sm text-(--text-primary) placeholder:text-(--text-muted)",
    "outline-none transition-colors focus:border-(--color-primary)",
);

const LABEL_CLASSNAME = "text-sm font-medium text-(--text-primary)";

const ContactForm = ({ data }: ContactFormProps) => {
    if (!data) return null;

    const fields = convertObjectToArrayByPrefix<FieldAttributes>(data, "field");
    const topics = convertObjectToArrayByPrefix<TopicAttributes>(data, "topic").filter(
        (topic) => Boolean(topic.attributes?.code),
    );

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
                    {data?.title?.value}
                </h2>
                <p className="text-xs text-(--text-secondary) sm:text-sm">
                    {renderNowrapText(data?.subTitle?.value)}
                </p>
            </div>

            <div className="flex flex-col gap-4">
                {fields.map((field) => {
                    const name = field.attributes?.name ?? field.key;
                    return (
                        <div key={field.key} className="flex flex-col gap-2">
                            <label className={LABEL_CLASSNAME} htmlFor={`contact-${name}`}>
                                {field.value}
                            </label>
                            <input
                                id={`contact-${name}`}
                                name={name}
                                type={field.attributes?.type ?? "text"}
                                autoComplete={field.attributes?.autoComplete}
                                placeholder={field.attributes?.placeholder}
                                className={FIELD_CLASSNAME}
                            />
                        </div>
                    );
                })}

                <div className="flex flex-col gap-2">
                    <label className={LABEL_CLASSNAME} htmlFor="contact-topicCode">
                        {data?.topicLabel?.value}
                    </label>
                    <SelectCustom id="contact-topicCode" name="topicCode" defaultValue="">
                        <option value="" disabled>
                            {data?.topicPlaceholder?.value}
                        </option>
                        {topics.map((topic) => (
                            <option key={topic.key} value={topic.attributes?.code}>
                                {topic.value}
                            </option>
                        ))}
                    </SelectCustom>
                </div>

                <div className="flex flex-col gap-2">
                    <label className={LABEL_CLASSNAME} htmlFor="contact-message">
                        {data?.messageLabel?.value}
                    </label>
                    <textarea
                        id="contact-message"
                        name="message"
                        rows={4}
                        placeholder={data?.messagePlaceholder?.value}
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
                    {data?.submitButton?.value}
                    <ArrowUpRight className="size-4" strokeWidth={2} />
                </button>
                <p className="text-center text-xs text-(--text-secondary)">
                    {data?.footnote?.value}
                </p>
            </div>
        </div>
    );
};

export default ContactForm;
