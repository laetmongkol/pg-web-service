export interface CountUpNumberConfig {
    target: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    formatThousands?: boolean;
    countThroughK?: boolean;
}

export const COUNT_THROUGH_K_ANIMATION_TARGET = 1000;

function formatCountUpDigits(value: number, decimals?: number, formatThousands?: boolean) {
    if (decimals !== undefined) {
        return value.toFixed(decimals);
    }

    const rounded = Math.round(value);
    return formatThousands ? rounded.toLocaleString("en-US") : String(rounded);
}

function formatCountUpThroughK(value: number, config: CountUpNumberConfig) {
    const { target, prefix = "", suffix = "M+", decimals } = config;
    const plusSuffix = suffix.includes("+") ? "+" : "";

    if (value < COUNT_THROUGH_K_ANIMATION_TARGET) {
        return `${prefix}${Math.round(value)}K${plusSuffix}`;
    }

    const millionDigits = decimals !== undefined ? target.toFixed(decimals) : String(target);
    return `${prefix}${millionDigits}M${plusSuffix}`;
}

export function getCountUpAnimationTarget(config: CountUpNumberConfig) {
    return config.countThroughK ? COUNT_THROUGH_K_ANIMATION_TARGET : config.target;
}

export function formatCountUpValue(value: number, config: CountUpNumberConfig) {
    const { prefix = "", suffix = "", decimals, formatThousands } = config;
    const digits = formatCountUpDigits(value, decimals, formatThousands);

    return `${prefix}${digits}${suffix}`;
}

export function formatCountUpDisplayValue(value: number, config: CountUpNumberConfig) {
    if (config.countThroughK) {
        return formatCountUpThroughK(value, config);
    }

    return formatCountUpValue(value, config);
}

export function formatCountUpTarget(config: CountUpNumberConfig) {
    if (config.countThroughK) {
        return formatCountUpThroughK(COUNT_THROUGH_K_ANIMATION_TARGET, config);
    }

    return formatCountUpValue(config.target, config);
}
