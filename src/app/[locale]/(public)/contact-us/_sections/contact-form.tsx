"use client";

import { useEffect, useRef, useState } from "react";

import { parseApiError } from "@/lib/api/parse-api-error";
import cn from "@/lib/tw-merge";

import { errorToast, successToast } from "@/components/toasts";
import useContactAppService from "@/services/modules/app-service/hooks/contact.app-service.hook";

import type { FormEvent } from "react";

const TITLE = "ส่งข้อความถึงเรา (Send Message)";
const SUBMIT_LABEL = "ส่งข้อมูลการติดต่อ";
const SUBMITTING_LABEL = "กำลังส่ง...";

const SUCCESS_TITLE = "ส่งข้อมูลเรียบร้อย";
const SUCCESS_MESSAGE = "ทีมงานจะติดต่อกลับโดยเร็วที่สุด";
const ERROR_TITLE = "ส่งข้อมูลไม่สำเร็จ";
const ERROR_MESSAGE = "กรุณาลองใหม่อีกครั้ง";

/**
 * `contact_messages.topic_code` is a filter column in the console, so the free-text subject from
 * the design goes into the message body and the row is tagged with one code. Swap for a dropdown
 * bound to parameter group `ContactUsTopic` when that group is filled in for this domain.
 */
const TOPIC_CODE = "general";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldName = "fullName" | "email" | "phone" | "subject" | "message";

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

const validate = (form: Record<FieldName, string>): Partial<Record<FieldName, string>> => {
    const errors: Partial<Record<FieldName, string>> = {};

    if (!form.fullName.trim()) errors.fullName = "กรุณากรอกชื่อ-นามสกุล";
    if (!form.email.trim()) errors.email = "กรุณากรอกอีเมล";
    else if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    if (form.phone.trim().length > 32) errors.phone = "เบอร์โทรศัพท์ยาวเกินไป";
    if (!form.subject.trim()) errors.subject = "กรุณาระบุหัวข้อที่ต้องการติดต่อ";
    if (!form.message.trim()) errors.message = "กรุณากรอกข้อความ";

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
                    message: `หัวข้อ: ${form.subject.trim()}\n\n${form.message.trim()}`,
                },
                botTrap: {
                    honeypot,
                    elapsedMs: renderedAt.current ? Date.now() - renderedAt.current : 0,
                },
            });

            successToast({ title: SUCCESS_TITLE, message: SUCCESS_MESSAGE });
            setForm(EMPTY_FORM);
            renderedAt.current = Date.now();
        } catch (error) {
            const parsed = await parseApiError(error);
            errorToast({
                title: parsed?.header ?? ERROR_TITLE,
                message: parsed?.message ?? ERROR_MESSAGE,
            });
        }
    };

    const renderError = (name: FieldName) =>
        errors[name] ? <span className="text-xs text-(--color-danger-500)">{errors[name]}</span> : null;

    return (
        <form
            onSubmit={onSubmit}
            noValidate
            className={cn(
                "flex w-full flex-col gap-5 rounded-2xl p-6 sm:p-8",
                "border border-(--border-default) bg-(--surface-elevated)",
            )}
        >
            <h2 className={cn("font-bold text-(--text-primary)", "text-xl sm:text-2xl")}>{TITLE}</h2>

            <div className="flex flex-col gap-2">
                <label className={LABEL_CLASSNAME} htmlFor="contact-fullName">
                    ชื่อ-นามสกุล / Name
                </label>
                <input
                    id="contact-fullName"
                    name="fullName"
                    autoComplete="name"
                    placeholder="กรอกชื่อ-นามสกุลของคุณ"
                    value={form.fullName}
                    onChange={(event) => setField("fullName", event.target.value)}
                    aria-invalid={Boolean(errors.fullName)}
                    className={FIELD_CLASSNAME}
                />
                {renderError("fullName")}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <label className={LABEL_CLASSNAME} htmlFor="contact-email">
                        อีเมล / Email
                    </label>
                    <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="example@domain.com"
                        value={form.email}
                        onChange={(event) => setField("email", event.target.value)}
                        aria-invalid={Boolean(errors.email)}
                        className={FIELD_CLASSNAME}
                    />
                    {renderError("email")}
                </div>

                <div className="flex flex-col gap-2">
                    <label className={LABEL_CLASSNAME} htmlFor="contact-phone">
                        เบอร์โทรศัพท์ / Phone
                    </label>
                    <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="089-XXX-XXXX"
                        value={form.phone}
                        onChange={(event) => setField("phone", event.target.value)}
                        aria-invalid={Boolean(errors.phone)}
                        className={FIELD_CLASSNAME}
                    />
                    {renderError("phone")}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className={LABEL_CLASSNAME} htmlFor="contact-subject">
                    หัวข้อ / Subject
                </label>
                <input
                    id="contact-subject"
                    name="subject"
                    placeholder="ระบุเรื่องที่ต้องการติดต่อ"
                    value={form.subject}
                    onChange={(event) => setField("subject", event.target.value)}
                    aria-invalid={Boolean(errors.subject)}
                    className={FIELD_CLASSNAME}
                />
                {renderError("subject")}
            </div>

            <div className="flex flex-col gap-2">
                <label className={LABEL_CLASSNAME} htmlFor="contact-message">
                    ข้อความ / Message
                </label>
                <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    placeholder="รายละเอียดธุรกิจ เป้าหมาย หรือคำถามเพิ่มเติม..."
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
                    "mt-1 w-full cursor-pointer rounded-xl px-6 py-3.5",
                    "bg-(--text-primary) text-sm font-medium text-(--text-invert)",
                    "transition-opacity hover:opacity-90",
                    "disabled:cursor-not-allowed disabled:opacity-60",
                )}
            >
                {createContactMessage.isPending ? SUBMITTING_LABEL : SUBMIT_LABEL}
            </button>
        </form>
    );
};

export default ContactForm;
