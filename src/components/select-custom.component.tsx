import { forwardRef, SelectHTMLAttributes } from "react";

import { ChevronDown } from "lucide-react";

import cn from "@/lib/tw-merge";

const SELECT_BASE_CLASSNAME =
    "w-full appearance-none rounded-lg border border-(--border-default) bg-(--surface-default) py-2.5 pl-4 pr-10 text-sm text-(--text-primary) focus:border-(--color-primary) focus:outline-none disabled:cursor-not-allowed disabled:opacity-60";

type SelectCustomProps = SelectHTMLAttributes<HTMLSelectElement>;

/**
 * Native `<select>` with the browser arrow suppressed and a token-colored chevron
 * inset from the edge — matches the search field's icon spacing (`right-3`) so the
 * suffix never hugs the border. Colors come from tokens (chevron via currentColor),
 * so it follows dark/light. Caller `className` wins (override size/padding).
 */
const SelectCustom = forwardRef<HTMLSelectElement, SelectCustomProps>(
    ({ className, children, ...props }, ref) => (
        <div className="relative inline-flex w-full items-center">
            <select ref={ref} {...props} className={cn(SELECT_BASE_CLASSNAME, className)}>
                {children}
            </select>
            <ChevronDown
                size={16}
                aria-hidden
                className="pointer-events-none absolute right-3 text-(--text-secondary)"
            />
        </div>
    ),
);
SelectCustom.displayName = "SelectCustom";

export default SelectCustom;
