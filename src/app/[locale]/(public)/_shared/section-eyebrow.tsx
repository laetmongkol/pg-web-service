import { CircleDot } from "lucide-react";

import cn from "@/lib/tw-merge";

interface SectionEyebrowProps {
    children: React.ReactNode;
    className?: string;
}

/** Small "⊙ LABEL" kicker above a section heading; colour comes from the parent's text colour. */
const SectionEyebrow = ({ children, className }: SectionEyebrowProps) => (
    <span className={cn("inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase", className)}>
        <CircleDot aria-hidden className="size-3" strokeWidth={2} />
        {children}
    </span>
);

export default SectionEyebrow;
