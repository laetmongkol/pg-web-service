"use client";

import { useEffect, useRef, useState } from "react";

import { ChevronDown } from "lucide-react";

import { parseApiError } from "@/lib/api/parse-api-error";
import cn from "@/lib/tw-merge";
import { BUTTON_SCALE_SUBTLE_CLASSNAME } from "@/shared/ui/classes/base.classes";

import { errorToast, successToast } from "@/components/toasts";
import useContactAppService from "@/services/modules/app-service/hooks/contact.app-service.hook";

import type { FormEvent } from "react";

import { HEADING_GRADIENT_LIGHT_CLASSNAME } from "../../../_shared/styles";
import { CONTACT_MOCK } from "../contact-mock";

const COPY = CONTACT_MOCK.form;

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

/** Kept in the component: these fire before anything is sent. */
const VALIDATION = {
    fullName: "กรุณากรอกชื่อ-นามสกุล",
    emailRequired: "กรุณากรอกอีเมล",
    emailInvalid: "รูปแบบอีเมลไม่ถูกต้อง",
    phoneTooLong: "เบอร์โทรศัพท์ยาวเกินไป",
    topic: "กรุณาเลือกหัวข้อ",
    message: "กรุณากรอกข้อความ",
};

const validate = (form: Record<FieldName, string>): Partial<Record<FieldName, string>> => {
    const errors: Partial<Record<FieldName, string>> = {};

    if (!form.fullName.trim()) errors.fullName = VALIDATION.fullName;
    if (!form.email.trim()) errors.email = VALIDATION.emailRequired;
    else if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = VALIDATION.emailInvalid;
    if (form.phone.trim().length > 32) errors.phone = VALIDATION.phoneTooLong;
    if (!form.topic) errors.topic = VALIDATION.topic;
    if (!form.message.trim()) errors.message = VALIDATION.message;

    return errors;
};

const ContactForm = () => {
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

        const nextErrors = validate(form);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        try {
            await createContactMessage.mutateAsync({
                request: {
                    fullName: form.fullName.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim() || undefined,
                    topicCode: TOPIC_CODE,
                    message: `${COPY.topic.label}: ${form.topic}\n\n${form.message.trim()}`,
                },
                botTrap: {
                    honeypot,
                    elapsedMs: renderedAt.current ? Date.now() - renderedAt.current : 0,
                },
            });

            successToast({ title: COPY.successTitle, message: COPY.successMessage });
            setForm(EMPTY_FORM);
            renderedAt.current = Date.now();
        } catch (error) {
            const parsed = await parseApiError(error);
            errorToast({
                title: parsed?.header ?? COPY.errorTitle,
                message: parsed?.message ?? COPY.errorMessage,
            });
        }
    };

    const renderError = (name: FieldName) =>
        errors[name] ? <span className="text-xs text-(--color-danger-500)">{errors[name]}</span> : null;

    return (
        <form
            onSubmit={onSubmit}
            noValidate
            className="relative flex w-full flex-col gap-6 rounded-[1.75rem] bg-(--surface-card) px-6 py-8 sm:px-10 sm:py-10"
        >
            <div className="text-center text-(--text-on-light)">
                <h2 className={cn(HEADING_GRADIENT_LIGHT_CLASSNAME, "text-2xl font-bold sm:text-[2rem]")}>{COPY.title}</h2>
                <p className="mt-3 whitespace-pre-line text-xs leading-relaxed sm:text-sm">{COPY.description}</p>
            </div>

            <div className="flex flex-col gap-2">
                <label className={LABEL_CLASSNAME} htmlFor="contact-fullName">
                    {COPY.fullName.label}
                </label>
                <input
                    id="contact-fullName"
                    name="fullName"
                    autoComplete="name"
                    placeholder={COPY.fullName.placeholder}
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
                        {COPY.email.label}
                    </label>
                    <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder={COPY.email.placeholder}
                        value={form.email}
                        onChange={(event) => setField("email", event.target.value)}
                        aria-invalid={Boolean(errors.email)}
                        className={FIELD_CLASSNAME}
                    />
                    {renderError("email")}
                </div>
                <div className="flex flex-col gap-2">
                    <label className={LABEL_CLASSNAME} htmlFor="contact-phone">
                        {COPY.phone.label}
                    </label>
                    <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder={COPY.phone.placeholder}
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
                    {COPY.topic.label}
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
                            {COPY.topic.placeholder}
                        </option>
                        {COPY.topics.map((topic) => (
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
                    {COPY.message.label}
                </label>
                <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    placeholder={COPY.message.placeholder}
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
                {createContactMessage.isPending ? COPY.submitting : COPY.submit}
            </button>
        </form>
    );
};

export default ContactForm;
