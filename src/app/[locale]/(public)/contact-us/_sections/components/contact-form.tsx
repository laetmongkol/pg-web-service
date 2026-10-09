"use client";

import { useEffect, useRef, useState } from "react";

import { ChevronDown } from "lucide-react";

import { parseApiError } from "@/lib/api/parse-api-error";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";
import { BUTTON_SCALE_SUBTLE_CLASSNAME } from "@/shared/ui/classes/base.classes";

import { errorToast, successToast } from "@/components/toasts";
import useContactAppService from "@/services/modules/app-service/hooks/contact.app-service.hook";

import type { FormEvent } from "react";

import { HEADING_GRADIENT_LIGHT_CLASSNAME } from "../../../_shared/styles";

const TOPIC_KEYS = ["topic1", "topic2", "topic3", "topic4", "topic5", "topic6", "topic7", "topic8"] as const;

/**
 * `contact_messages.topic_code` is a filter column in the console, so the picked topic goes into
 * the message body and the row is tagged with one code. Swap for codes from parameter group
 * `ContactUsTopic` when that group is filled in for this domain.
 */
const TOPIC_CODE = "general";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldName = "fullName" | "email" | "phone" | "topic" | "message";

const EMPTY_FORM: Record<FieldName, string> = {
    fullName: "",
    email: "",
    phone: "",
    topic: "",
    message: "",
};

const FIELD_CLASSNAME = cn(
    "w-full rounded-lg border border-(--border-on-light) bg-(--surface-card) px-3.5 py-3 text-sm text-(--text-on-light)",
    "placeholder:text-(--text-muted-on-light) outline-none transition-colors focus:border-(--icon-accent)",
    "aria-invalid:border-(--color-danger-500)",
);

const LABEL_CLASSNAME = "text-xs font-semibold text-(--text-label)";

type FormData = Record<string, TranslateContentResponseDto>;

/** Validation copy comes from the `form` section rows validation* (value). */
const validate = (form: Record<FieldName, string>, data: FormData): Partial<Record<FieldName, string>> => {
    const errors: Partial<Record<FieldName, string>> = {};

    if (!form.fullName.trim()) errors.fullName = data?.validationFullName?.value;
    if (!form.email.trim()) errors.email = data?.validationEmailRequired?.value;
    else if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = data?.validationEmailInvalid?.value;
    if (form.phone.trim().length > 32) errors.phone = data?.validationPhoneTooLong?.value;
    if (!form.topic) errors.topic = data?.validationTopic?.value;
    if (!form.message.trim()) errors.message = data?.validationMessage?.value;

    return errors;
};

/** topic1..8 — one dropdown option per row value. */
function getTopics(data: FormData): string[] {
    return TOPIC_KEYS.flatMap((key) => {
        const topic = data?.[key]?.value;
        return topic ? [topic] : [];
    });
}

interface ContactFormProps {
    /** `form` section — fieldName / fieldEmail / fieldPhone / fieldTopic / fieldMessage (value = label,
     *  attribute1 = placeholder), topic1..8, validation*, submit / success / error copy. */
    data?: FormData;
}

const ContactForm = ({ data }: ContactFormProps) => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
    /** Hidden field: anything typed in it came from a bot, never from a person. */
    const [honeypot, setHoneypot] = useState("");
    /** Rendered-at timestamp — the API rejects submissions filled faster than a human could. */
    const renderedAt = useRef(0);

    // set after mount, not during render: reading the clock while rendering is impure
    useEffect(() => {
        renderedAt.current = Date.now();
    }, []);

    const { useCreateContactMessage } = useContactAppService();
    const createContactMessage = useCreateContactMessage();

    const setField = (name: FieldName, value: string) => {
        setForm((current) => ({ ...current, [name]: value }));
        setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current));
    };

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!data) return;
        const nextErrors = validate(form, data);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        try {
            await createContactMessage.mutateAsync({
                request: {
                    fullName: form.fullName.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim() || undefined,
                    topicCode: TOPIC_CODE,
                    message: `${data?.fieldTopic?.value}: ${form.topic}\n\n${form.message.trim()}`,
                },
                botTrap: {
                    honeypot,
                    elapsedMs: renderedAt.current ? Date.now() - renderedAt.current : 0,
                },
            });

            successToast({ title: data?.successTitle?.value ?? "", message: data?.successMessage?.value ?? "" });
            setForm(EMPTY_FORM);
            renderedAt.current = Date.now();
        } catch (error) {
            const parsed = await parseApiError(error);
            errorToast({
                title: parsed?.header ?? data?.errorTitle?.value ?? "",
                message: parsed?.message ?? data?.errorMessage?.value ?? "",
            });
        }
    };

    const topics = data ? getTopics(data) : [];

    const renderError = (name: FieldName) =>
        errors[name] ? <span className="text-xs text-(--color-danger-500)">{errors[name]}</span> : null;

    if (!data) return null;

    return (
        <form
            onSubmit={onSubmit}
            noValidate
            className="relative flex w-full flex-col gap-6 rounded-[1.75rem] bg-(--surface-card) px-6 py-8 sm:px-10 sm:py-10"
        >
            <div className="text-center text-(--text-on-light)">
                <h2 className={cn(HEADING_GRADIENT_LIGHT_CLASSNAME, "text-2xl font-bold sm:text-[2rem]")}>{data?.title?.value}</h2>
                <p className="mt-3 whitespace-pre-line text-xs leading-relaxed sm:text-sm">{data?.description?.value}</p>
            </div>

            <div className="flex flex-col gap-2">
                <label className={LABEL_CLASSNAME} htmlFor="contact-fullName">
                    {data?.fieldName?.value}
                </label>
                <input
                    id="contact-fullName"
                    name="fullName"
                    autoComplete="name"
                    placeholder={data?.fieldName?.attribute1}
                    value={form.fullName}
                    onChange={(event) => setField("fullName", event.target.value)}
                    aria-invalid={Boolean(errors.fullName)}
                    className={FIELD_CLASSNAME}
                />
                {renderError("fullName")}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 sm:gap-4">
                <div className="flex flex-col gap-2">
                    <label className={LABEL_CLASSNAME} htmlFor="contact-email">
                        {data?.fieldEmail?.value}
                    </label>
                    <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder={data?.fieldEmail?.attribute1}
                        value={form.email}
                        onChange={(event) => setField("email", event.target.value)}
                        aria-invalid={Boolean(errors.email)}
                        className={FIELD_CLASSNAME}
                    />
                    {renderError("email")}
                </div>
                <div className="flex flex-col gap-2">
                    <label className={LABEL_CLASSNAME} htmlFor="contact-phone">
                        {data?.fieldPhone?.value}
                    </label>
                    <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder={data?.fieldPhone?.attribute1}
                        value={form.phone}
                        onChange={(event) => setField("phone", event.target.value)}
                        aria-invalid={Boolean(errors.phone)}
                        className={FIELD_CLASSNAME}
                    />
                    {renderError("phone")}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className={LABEL_CLASSNAME} htmlFor="contact-topic">
                    {data?.fieldTopic?.value}
                </label>
                <div className="relative">
                    <select
                        id="contact-topic"
                        name="topic"
                        value={form.topic}
                        onChange={(event) => setField("topic", event.target.value)}
                        aria-invalid={Boolean(errors.topic)}
                        className={cn(FIELD_CLASSNAME, "appearance-none pr-10", !form.topic && "text-(--text-muted-on-light)")}
                    >
                        <option value="" disabled>
                            {data?.fieldTopic?.attribute1}
                        </option>
                        {topics.map((topic) => (
                            <option key={topic} value={topic} className="text-(--text-on-light)">
                                {topic}
                            </option>
                        ))}
                    </select>
                    <ChevronDown
                        aria-hidden
                        className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-(--text-muted-on-light)"
                    />
                </div>
                {renderError("topic")}
            </div>

            <div className="flex flex-col gap-2">
                <label className={LABEL_CLASSNAME} htmlFor="contact-message">
                    {data?.fieldMessage?.value}
                </label>
                <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    placeholder={data?.fieldMessage?.attribute1}
                    value={form.message}
                    onChange={(event) => setField("message", event.target.value)}
                    aria-invalid={Boolean(errors.message)}
                    className={cn(FIELD_CLASSNAME, "resize-y")}
                />
                {renderError("message")}
            </div>

            {/* honeypot: off-screen and skipped by tab order, so only a bot ever fills it */}
            <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                value={honeypot}
                onChange={(event) => setHoneypot(event.target.value)}
                className="pointer-events-none absolute left-[-9999px] size-0 opacity-0"
            />

            <button
                type="submit"
                disabled={createContactMessage.isPending}
                className={cn(
                    "w-full cursor-pointer rounded-full bg-(--button-on-light) px-6 py-3.5 text-base text-(--button-text)",
                    BUTTON_SCALE_SUBTLE_CLASSNAME,
                    "hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100",
                )}
            >
                {createContactMessage.isPending ? data?.submittingLabel?.value : data?.submitButton?.value}
            </button>
        </form>
    );
};

export default ContactForm;
