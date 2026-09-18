import { ToastOptions } from "react-hot-toast";

import { Loader2 } from "lucide-react";

import templateToast from "./template.toast";

interface LoadingToastProps {
    title: string;
    message?: string;
    options?: ToastOptions;
}

const loadingToast = ({ title, message, options }: LoadingToastProps) => {
    return templateToast({
        showClose: false,
        options: { ...options, duration: Infinity },
        render: () => (
            <div className="flex items-center gap-3 p-3">
                <div
                    className="shrink-0 rounded-full flex items-center justify-center"
                    style={{
                        inlineSize: 36,
                        blockSize: 36,
                        background: "var(--gray-a3)",
                        color: "var(--gray-a11)",
                    }}
                >
                    <Loader2 size={18} className="animate-spin" />
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

export default loadingToast;
