import { ReactNode } from "react";
import toast, { Toast, ToastOptions } from "react-hot-toast";

import { X } from "lucide-react";

import cn from "@/lib/tw-merge";

interface TemplateToastProps {
    render: (t: Toast) => ReactNode;
    options?: ToastOptions;
    showClose?: boolean;
}

const templateToast = ({ render, options, showClose = true }: TemplateToastProps) => {
    return toast.custom(
        (t) => (
            <div
                className={cn(
                    t.visible ? "animate-custom-enter" : "animate-custom-leave",
                    "pointer-events-auto relative w-full max-w-md rounded-xl",
                    "border border-(--border-default) bg-(--surface-elevated)",
                    "shadow-(--shadow-md)",
                )}
            >
                {showClose && (
                    <div className="absolute top-3 right-3">
                        <button
                            type="button"
                            onClick={() => toast.dismiss(t.id)}
                            aria-label="Close"
                            className="flex items-center justify-center rounded p-0.5 opacity-50 hover:opacity-100 transition-opacity text-(--text-secondary) hover:text-(--text-primary)"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}
                {render(t)}
            </div>
        ),
        options,
    );
};

export default templateToast;
