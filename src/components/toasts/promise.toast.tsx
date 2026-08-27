import toast, { ToastOptions } from "react-hot-toast";

import loadingToast from "./loading.toast";
import { renderStatusToast, StatusToastVariant } from "./status.toast";

interface LoadingContent {
    title: string;
    message?: string;
}

interface ResultContent {
    title: string;
    message?: string;
    variant?: StatusToastVariant;
}

interface PromiseToastConfig<T> {
    loading: LoadingContent;
    success: ResultContent | ((data: T) => ResultContent);
    error: ResultContent | ((error: unknown) => ResultContent);
}

const resolveContent = <T,>(
    content: ResultContent | ((value: T) => ResultContent),
    value: T,
): ResultContent => (typeof content === "function" ? content(value) : content);

const promiseToast = async <T,>(
    promise: Promise<T>,
    config: PromiseToastConfig<T>,
    options?: ToastOptions,
): Promise<T> => {
    const loadingId = loadingToast({ ...config.loading, options });

    try {
        const data = await promise;
        toast.dismiss(loadingId);
        const result = resolveContent(config.success, data);
        renderStatusToast(result.variant ?? "success", {
            title: result.title,
            message: result.message,
            options,
        });
        return data;
    } catch (error) {
        toast.dismiss(loadingId);
        const result = resolveContent(config.error, error);
        renderStatusToast(result.variant ?? "error", {
            title: result.title,
            message: result.message,
            options,
        });
        throw error;
    }
};

export default promiseToast;
