"use client";

import { useEffect, useRef, useState } from "react";
import toast, { Toast, ToastOptions } from "react-hot-toast";

import { Undo2 } from "lucide-react";

import cn from "@/lib/tw-merge";

const DEFAULT_DURATION_MS = 4000;

export type UndoToastProps = {
    title: string;
    message?: string;
    durationMs?: number;
    /** Runs when the timer finishes without undo. */
    onCommit: () => void | Promise<void>;
    /** Runs when user undoes (Ctrl+Z / Undo button / close). */
    onCancel?: () => void;
    options?: ToastOptions;
};

type UndoToastBodyProps = {
    t: Toast;
    title: string;
    message?: string;
    durationMs: number;
    onCommit: () => void | Promise<void>;
    onCancel?: () => void;
};

let activeUndoToastId: string | null = null;

const UndoToastBody = ({
    t,
    title,
    message,
    durationMs,
    onCommit,
    onCancel,
}: UndoToastBodyProps) => {
    const [remainingMs, setRemainingMs] = useState(durationMs);
    const [hovering, setHovering] = useState(false);
    const [pressing, setPressing] = useState(false);
    const paused = hovering || pressing;
    const settledRef = useRef(false);
    const remainingRef = useRef(durationMs);
    const pausedRef = useRef(false);
    const lastTickRef = useRef<number | null>(null);
    const rafRef = useRef<number | null>(null);

    const settle = (mode: "commit" | "cancel") => {
        if (settledRef.current) return;
        settledRef.current = true;
        if (activeUndoToastId === t.id) activeUndoToastId = null;
        toast.dismiss(t.id);
        if (mode === "commit") {
            void onCommit();
        } else {
            onCancel?.();
        }
    };

    useEffect(() => {
        pausedRef.current = paused;
        if (!paused) lastTickRef.current = performance.now();
    }, [paused]);

    useEffect(() => {
        const tick = (now: number) => {
            if (settledRef.current) return;

            if (!pausedRef.current) {
                const last = lastTickRef.current ?? now;
                const delta = now - last;
                lastTickRef.current = now;
                remainingRef.current = Math.max(0, remainingRef.current - delta);
                setRemainingMs(remainingRef.current);

                if (remainingRef.current <= 0) {
                    settle("commit");
                    return;
                }
            } else {
                lastTickRef.current = now;
            }

            rafRef.current = requestAnimationFrame(tick);
        };

        lastTickRef.current = performance.now();
        rafRef.current = requestAnimationFrame(tick);

        return () => {
            if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps -- settle once per mount
    }, []);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "z") return;
            if (event.shiftKey) return;
            const target = event.target as HTMLElement | null;
            const tag = target?.tagName?.toLowerCase();
            if (tag === "input" || tag === "textarea" || target?.isContentEditable) return;

            event.preventDefault();
            settle("cancel");
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const progress = Math.max(0, Math.min(1, remainingMs / durationMs));
    const secondsLeft = Math.ceil(remainingMs / 1000);

    return (
        <div
            className={cn(
                t.visible ? "animate-custom-enter" : "animate-custom-leave",
                "pointer-events-auto relative w-full max-w-md overflow-hidden rounded-xl",
                "border border-(--border-default) bg-(--surface-elevated) shadow-(--shadow-md)",
                paused && "ring-2 ring-(--color-primary)/40",
            )}
            onPointerEnter={() => setHovering(true)}
            onPointerLeave={() => {
                setHovering(false);
                setPressing(false);
            }}
            onPointerDown={() => setPressing(true)}
            onPointerUp={() => setPressing(false)}
            onPointerCancel={() => setPressing(false)}
        >
            <div className="flex items-start gap-3 p-3">
                <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full"
                    style={{
                        background: "var(--amber-3)",
                        color: "var(--amber-11)",
                    }}
                >
                    <Undo2 size={18} />
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1 pr-1">
                    <span className="text-sm font-medium text-(--text-primary)">{title}</span>
                    <span className="text-xs text-(--text-secondary)">
                        {message ??
                            (paused
                                ? "Paused — move away to continue"
                                : `Ctrl+Z to cancel · ${secondsLeft}s · hover to pause`)}
                    </span>
                </div>

                <button
                    type="button"
                    className="shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-(--color-primary) hover:bg-(--surface-muted)"
                    onClick={(event) => {
                        event.stopPropagation();
                        settle("cancel");
                    }}
                >
                    Undo
                </button>
            </div>

            <div className="h-1 w-full bg-(--surface-muted)">
                <div
                    className="h-full bg-(--color-primary) transition-[width] duration-100 ease-linear"
                    style={{ width: `${progress * 100}%` }}
                />
            </div>
        </div>
    );
};

/** Delayed-commit toast: waits, Ctrl+Z / Undo cancels, hold pauses the timer. */
export const undoToast = ({
    title,
    message,
    durationMs = DEFAULT_DURATION_MS,
    onCommit,
    onCancel,
    options,
}: UndoToastProps) => {
    if (activeUndoToastId) {
        toast.dismiss(activeUndoToastId);
        activeUndoToastId = null;
    }

    const id = toast.custom(
        (t) => (
            <UndoToastBody
                t={t}
                title={title}
                message={message}
                durationMs={durationMs}
                onCommit={onCommit}
                onCancel={onCancel}
            />
        ),
        {
            duration: Number.POSITIVE_INFINITY,
            id: `undo-${Date.now()}`,
            ...options,
        },
    );

    activeUndoToastId = id;
    return id;
};

export default undoToast;
