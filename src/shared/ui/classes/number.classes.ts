/** Hides native increment/decrement controls on type="number" inputs. */
export const NUMBER_HIDE_SPINNER_CLASSNAME =
  "[appearance:textfield] [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

export function stepFromPrecision(precision: number): number {
  return 10 ** -Math.max(0, precision);
}

export function roundToPrecision(value: number, precision: number): number {
  const factor = 10 ** Math.max(0, precision);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function isWithinPrecisionInput(raw: string, precision: number): boolean {
  if (raw === "" || raw === ".") return true;
  if (precision <= 0) return /^\d+$/.test(raw);
  return new RegExp(`^\\d*(\\.\\d{0,${precision}})?$`).test(raw);
}

export function resolveNumberFieldValue(
  raw: string,
  parsed: number,
  emptyFallback = 0,
  precision?: number,
): number {
  const base =
    raw === "" || raw === "." || Number.isNaN(parsed) ? emptyFallback : parsed;
  return precision != null ? roundToPrecision(base, precision) : base;
}

export function formatNumberDisplay(value: number, precision: number): string {
  return roundToPrecision(value, precision).toFixed(precision);
}

export function normalizeNumberValue(value: unknown, emptyFallback = 0): number {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  return emptyFallback;
}

/** When value is 0, typing digits must replace — not build "01" / "10". */
export function sanitizeZeroStartInput(
  raw: string,
  previousNumeric: number,
): string {
  if (previousNumeric !== 0) return raw;
  if (raw.includes(".")) return raw;

  if (/^0[1-9]\d*$/.test(raw)) {
    return raw.slice(1);
  }

  if (/^[1-9]0$/.test(raw)) {
    return raw.charAt(0);
  }

  return raw;
}