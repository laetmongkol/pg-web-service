"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import cn from "@/lib/tw-merge";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INVALID_EMAIL_MESSAGE = "กรุณากรอกอีเมลให้ถูกต้อง";

interface SubscribeFormProps {
    placeholder: string;
    submitLabel: string;
    /** Where the visitor lands once the address checks out. */
    contactHref: string;
}

/**
 * There is no newsletter endpoint on api-app-service yet (contact messages need a name, topic and
 * body), so a valid address hands the visitor to the contact page rather than reporting a signup
 * that never happened. Swap the router push for the mutation once the endpoint exists.
 */
const SubscribeForm = ({ placeholder, submitLabel, contactHref }: SubscribeFormProps) => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!EMAIL_PATTERN.test(email.trim())) {
            setError(INVALID_EMAIL_MESSAGE);
            return;
        }

        setError(null);
        router.push(contactHref);
    };

    return (
        <form onSubmit={onSubmit} noValidate className="flex w-full max-w-md flex-col gap-2">
            <div
                className={cn(
                    "flex items-center gap-2 rounded-full bg-(--surface-elevated) p-1.5 pl-5",
                    "border border-(--border-default) shadow-(--shadow-sm)",
                )}
            >
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(event) => {
                        setEmail(event.target.value);
                        if (error) setError(null);
                    }}
                    placeholder={placeholder}
                    aria-label={placeholder}
                    aria-invalid={Boolean(error)}
                    className={cn(
                        "min-w-0 flex-1 bg-transparent text-sm text-(--text-primary) outline-none",
                        "placeholder:text-(--text-muted)",
                    )}
                />
                <button
                    type="submit"
                    className={cn(
                        "shrink-0 cursor-pointer rounded-full px-6 py-2.5",
                        "bg-(--text-primary) text-sm font-medium text-(--text-invert)",
                        "transition-transform! duration-150! hover:scale-105 active:scale-95",
                    )}
                >
                    {submitLabel}
                </button>
            </div>
            {error ? <span className="pl-5 text-xs text-(--color-danger-500)">{error}</span> : null}
        </form>
    );
};

export default SubscribeForm;
