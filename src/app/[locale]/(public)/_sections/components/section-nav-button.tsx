"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

import cn from "@/lib/tw-merge";

interface SectionNavButtonProps {
    direction: "prev" | "next";
    onClick: () => void;
    className?: string;
}

/** Shared round arrow for the home-page sliders — outlined going back, filled going forward. */
const SectionNavButton = ({ direction, onClick, className }: SectionNavButtonProps) => (
    <button
        type="button"
        onClick={onClick}
        aria-label={direction === "prev" ? "ก่อนหน้า" : "ถัดไป"}
        className={cn(
            "flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full",
            "border border-(--border-strong) transition-transform duration-300",
            "hover:scale-105 active:scale-95",
            direction === "next"
                ? "bg-(--text-primary) text-(--text-invert)"
                : "bg-(--surface-elevated) text-(--text-primary)",
            className,
        )}
    >
        {direction === "prev" ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
    </button>
);

export default SectionNavButton;
