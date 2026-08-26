import { ReactNode } from "react";
import { ToastOptions } from "react-hot-toast";

import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

import templateToast from "./template.toast";

export type StatusToastVariant = "success" | "warning" | "error" | "info";

interface VariantConfig {
    color: "green" | "amber" | "red" | "blue";
    icon: ReactNode;
}

const VARIANT_CONFIG: Record<StatusToastVariant, VariantConfig> = {
    success: { color: "green", icon: <CheckCircle2 size={18} /> },
    warning: { color: "amber", icon: <AlertTriangle size={18} /> },
    error: { color: "red", icon: <XCircle size={18} /> },
    info: { color: "blue", icon: <Info size={18} /> },
};

export interface StatusToastProps {
    title: string;
    message?: string;
    options?: ToastOptions;
}

export const errorToast = (props: StatusToastProps) => renderStatusToast("error", props);
export const successToast = (props: StatusToastProps) => renderStatusToast("success", props);
export const warningToast = (props: StatusToastProps) => renderStatusToast("warning", props);

export const renderStatusToast = (
    variant: StatusToastVariant,
    { title, message, options }: StatusToastProps,
) => {
    const { color, icon } = VARIANT_CONFIG[variant] ?? VARIANT_CONFIG.error;

    return templateToast({
        options,
        render: () => (
            <div className="flex items-center gap-3 p-3 pr-7">
                <div
                    className="shrink-0 rounded-full flex items-center justify-center"
                    style={{
                        inlineSize: 36,
                        blockSize: 36,
                        background: `var(--${color}-3)`,
                        color: `var(--${color}-11)`,
                    }}
                >
                    {icon}
                </div>
                <div className="flex flex-col gap-1 flex-1">
                    <span className="text-sm font-medium text-(--text-primary)">{title}</span>
                    {message && (
                        <span className="text-sm text-(--text-secondary)">{message}</span>
                    )}
                </div>
            </div>
        ),
    });
};
