import { ResponseError } from "@/services/generated-cli/api-app-service";

import { StatusToastVariant } from "@/components/toasts/status.toast";

function logParseApiError(scope: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  const trace = error instanceof Error ? error.stack : undefined;
  console.log(`[parse-api-error][error][${scope}] ${message}`);
  if (trace) console.log(trace);
}

export interface ApiErrorBody {
  header: string;
  message: string;
  statusCode: number;
  toastColor: StatusToastVariant;
}

const TOAST_VARIANTS = new Set<string>(["success", "warning", "error", "info"]);

function normalizeToastColor(value: unknown): StatusToastVariant {
  return typeof value === "string" && TOAST_VARIANTS.has(value)
    ? (value as StatusToastVariant)
    : "error";
}

/** Duck-type: Next bundling can break `instanceof ResponseError` across chunks. */
function getResponseError(error: unknown): ResponseError | null {
  if (error instanceof ResponseError) return error;
  if (
    typeof error === "object" &&
    error !== null &&
    (error as Error).name === "ResponseError" &&
    "response" in error &&
    (error as { response?: unknown }).response instanceof Response
  ) {
    return error as ResponseError;
  }
  return null;
}

function defaultHeader(statusCode: number): string {
  if (statusCode >= 500) return "Internal Server Error";
  if (statusCode === 401 || statusCode === 403) return "Unauthorized";
  if (statusCode === 404) return "Not Found";
  return "Bad Request";
}

export async function parseApiError(error: unknown): Promise<ApiErrorBody | null> {
  try {
    const responseError = getResponseError(error);
    if (!responseError) return null;

    const statusCode = responseError.response.status;
    let body: Partial<ApiErrorBody> = {};

    try {
      const contentType = responseError.response.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        body = (await responseError.response.clone().json()) as Partial<ApiErrorBody>;
      }
    } catch (parseError) {
      logParseApiError("json", parseError);
    }

    const header =
      typeof body.header === "string" && body.header.trim()
        ? body.header.trim()
        : defaultHeader(statusCode);
    const message =
      typeof body.message === "string" && body.message.trim()
        ? body.message.trim()
        : responseError.message || "Please try again";

    return {
      header,
      message,
      statusCode: typeof body.statusCode === "number" ? body.statusCode : statusCode,
      toastColor: normalizeToastColor(body.toastColor),
    };
  } catch (error) {
    logParseApiError("parse", error);
    return null;
  }
}
