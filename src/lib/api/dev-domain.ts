/** Development only: sent as `x-domain-code` when localhost has no real web_url mapping. */
export const X_DOMAIN_CODE_HEADER = "x-domain-code";

/**
 * Development only. Prefer NEXT_PUBLIC_ so CSR can stamp x-domain-code
 * (server/middleware can read NEXT_PUBLIC_* too — one env, no duplicate).
 */
export function resolveDevDomainCode(): string | undefined {
  if (process.env.NODE_ENV !== "development") return undefined;
  const code = process.env.NEXT_PUBLIC_DEV_DOMAIN_CODE?.trim();
  return code || undefined;
}

/** Apply `x-domain-code` when NEXT_PUBLIC_DEV_DOMAIN_CODE is set (development only). */
export function applyDevDomainCodeHeader(headers: Headers): void {
  const code = resolveDevDomainCode();
  if (!code) return;
  headers.set(X_DOMAIN_CODE_HEADER, code);
}
