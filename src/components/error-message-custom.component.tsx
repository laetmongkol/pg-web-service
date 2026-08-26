import { type FieldError } from "react-hook-form";

interface ErrorMessageCustomProps {
    error?: FieldError;
    /** When false, skip the reserved error slot (filters / search bars). Default true. */
    show?: boolean;
    /** When set, `error.message` is treated as an i18n key and passed through this translator. */
    translateError?: (message: string) => string;
}

const ErrorMessageCustom = ({ error, show = true, translateError }: ErrorMessageCustomProps) => {
    if (!show) return null;

    const message = error?.message
        ? (translateError ? translateError(error.message) : error.message)
        : undefined;

    return (
        <span className="text-xs text-red-500 dark:text-red-400">{message}</span>
    );
};

export default ErrorMessageCustom;
