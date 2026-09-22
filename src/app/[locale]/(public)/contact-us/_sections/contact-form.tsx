"use client";

import { useEffect, useRef, useState } from "react";

import { parseApiError } from "@/lib/api/parse-api-error";
import { extractAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import FadeIn from "@/app/component/fade-in.components";
import { errorToast, successToast } from "@/components/toasts";
import useContactAppService from "@/services/modules/app-service/hooks/contact.app-service.hook";

import type { FormEvent } from "react";

/**
 * `contact_messages.topic_code` is a filter column in the console, so the free-text subject from
 * the design goes into the message body and the row is tagged with one code. Swap for a dropdown
 * bound to parameter group `ContactUsTopic` when that group is filled in for this domain.
 */
const TOPIC_CODE = "general";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldName = "fullName" | "email" | "phone" | "subject" | "message";

/** CMS row code for each field — the label is the row value, the placeholder an attribute. */
const FIELD_CODE: Record<FieldName, string> = {
    fullName: "fieldName",
    email: "fieldEmail",
    phone: "fieldPhone",
    subject: "fieldSubject",
    message: "fieldMessage",
};

const EMPTY_FORM: Record<FieldName, string> = {
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
};

const FIELD_CLASSNAME = cn(
    "w-full rounded-lg border border-(--border-default) bg-(--surface-elevated)",
    "px-4 py-3 text-sm text-(--text-primary) placeholder:text-(--text-muted)",
    "outline-none transition-colors focus:border-(--text-primary)",
);

const LABEL_CLASSNAME = "text-xs font-medium text-(--text-primary)";

/** Kept in the component: these fire before anything is sent, so they never reach the CMS copy. */
const VALIDATION = {
    fullName: "กรุณากรอกชื่อ-นามสกุล",
    emailRequired: "กรุณากรอกอีเมล",
    emailInvalid: "รูปแบบอีเมลไม่ถูกต้อง",
    phoneTooLong: "เบอร์โทรศัพท์ยาวเกินไป",
    subject: "กรุณาระบุหัวข้อที่ต้องการติดต่อ",
    message: "กรุณากรอกข้อความ",
};

const validate = (form: Record<FieldName, string>): Partial<Record<FieldName, string>> => {
    const errors: Partial<Record<FieldName, string>> = {};

    if (!form.fullName.trim()) errors.fullName = VALIDATION.fullName;
    if (!form.email.trim()) errors.email = VALIDATION.emailRequired;
    else if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = VALIDATION.emailInvalid;
    if (form.phone.trim().length > 32) errors.phone = VALIDATION.phoneTooLong;
    if (!form.subject.trim()) errors.subject = VALIDATION.subject;
    if (!form.message.trim()) errors.message = VALIDATION.message;

    return errors;
};

interface ContactFormProps {
    data?: Record<string, TranslateContentResponseDto>;
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

    const label = (name: FieldName) => data?.[FIELD_CODE[name]]?.value ?? "";
    const placeholder = (name: FieldName) =>
        extractAttributes<{ placeholder?: string }>(data?.[FIELD_CODE[name]])?.placeholder ?? "";

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
                    message: `${label("subject")}: ${form.subject.trim()}\n\n${form.message.trim()}`,
                },
                botTrap: {
                    honeypot,
                    elapsedMs: renderedAt.current ? Date.now() - renderedAt.current : 0,
                },
            });

            successToast({
                title: data?.successTitle?.value ?? "",
                message: data?.successMessage?.value ?? "",
            });
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

    const renderError = (name: FieldName) =>
        errors[name] ? <span className="text-xs text-(--color-danger-500)">{errors[name]}</span> : null;

    if (!data) return null;

    return (
        <form
            onSubmit={onSubmit}
            noValidate
            className={cn(
                "flex w-full flex-col gap-5 rounded-2xl p-6 sm:p-8",
                "border border-(--border-default) bg-(--surface-elevated)",
            )}
        >
            <FadeIn>
                <h2 className={cn("font-bold text-(--text-primary)", "text-xl sm:text-2xl")}>
                    {data?.title?.value}
                </h2>
            </FadeIn>

            <FadeIn delay={100} className="flex flex-col gap-2">
                <label className={LABEL_CLASSNAME} htmlFor="contact-fullName">
                    {label("fullName")}
                </label>
                <input
                    id="contact-fullName"
                    name="fullName"
                    autoComplete="name"
                    placeholder={placeholder("fullName")}
                    value={form.fullName}
                    onChange={(event) => setField("fullName", event.target.value)}
                    aria-invalid={Boolean(errors.fullName)}
                    className={FIELD_CLASSNAME}
                />
                {renderError("fullName")}
            </FadeIn>

            <FadeIn delay={200} className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <label className={LABEL_CLASSNAME} htmlFor="contact-email">
                        {label("email")}
                    </label>
                    <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder={placeholder("email")}
                        value={form.email}
                        onChange={(event) => setField("email", event.target.value)}
                        aria-invalid={Boolean(errors.email)}
                        className={FIELD_CLASSNAME}
                    />
                    {renderError("email")}
                </div>

                <div className="flex flex-col gap-2">
                    <label className={LABEL_CLASSNAME} htmlFor="contact-phone">
                        {label("phone")}
                    </label>
                    <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder={placeholder("phone")}
                        value={form.phone}
                        onChange={(event) => setField("phone", event.target.value)}
                        aria-invalid={Boolean(errors.phone)}
                        className={FIELD_CLASSNAME}
                    />
                    {renderError("phone")}
                </div>
            </FadeIn>

            <FadeIn delay={300} className="flex flex-col gap-2">
                <label className={LABEL_CLASSNAME} htmlFor="contact-subject">
                    {label("subject")}
                </label>
                <input
                    id="contact-subject"
                    name="subject"
                    placeholder={placeholder("subject")}
                    value={form.subject}
                    onChange={(event) => setField("subject", event.target.value)}
                    aria-invalid={Boolean(errors.subject)}
                    className={FIELD_CLASSNAME}
                />
                {renderError("subject")}
            </FadeIn>

            <FadeIn delay={400} className="flex flex-col gap-2">
                <label className={LABEL_CLASSNAME} htmlFor="contact-message">
                    {label("message")}
                </label>
                <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    placeholder={placeholder("message")}
                    value={form.message}
                    onChange={(event) => setField("message", event.target.value)}
                    aria-invalid={Boolean(errors.message)}
                    className={cn(FIELD_CLASSNAME, "resize-y")}
                />
                {renderError("message")}
            </FadeIn>

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

            <FadeIn delay={500}>
                <button
                    type="submit"
                    disabled={createContactMessage.isPending}
                    className={cn(
                        "mt-1 w-full cursor-pointer rounded-xl px-6 py-3.5",
                        "bg-(--text-primary) text-sm font-medium text-(--text-invert)",
                        "transition-opacity hover:opacity-90",
                        "disabled:cursor-not-allowed disabled:opacity-60",
                    )}
                >
                    {createContactMessage.isPending
                        ? data?.submittingLabel?.value
                        : data?.submitButton?.value}
                </button>
            </FadeIn>
        </form>
    );
};

export default ContactForm;
