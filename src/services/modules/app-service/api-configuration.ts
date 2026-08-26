import { applyDevDomainCodeHeader } from "@/lib/api/dev-domain";
import { applyTrustedSourceHeader } from "@/lib/api/trusted-source";
import {
    Configuration,
    Middleware,
} from "@/services/generated-cli/api-app-service";

/**
 * Server-side: absolute URL → gateway directly (server-to-server).
 * Client-side: "" → same-origin /api/app/* → Next.js rewrite → gateway.
 */
const basePath =
    typeof window === "undefined"
        ? (process.env.APP_SERVICE_ORIGIN ?? "http://localhost:8091").replace(/\/+$/, "")
        : "";

const X_DOMAIN_NAME_HEADER = "x-domain-name";

/**
 * This site is public-only — the console moved to console-web-service. There is no session to
 * keep alive, so the 401-refresh-and-retry middleware that used to live here is gone along with
 * `sessionDead`, the single-flight refresh, and `emitSessionExpired`. A 401 from a public endpoint
 * now surfaces to the caller as-is, which is correct: it means the endpoint needs auth and this
 * site should not be calling it.
 */

/** SSR domain name (web URL) — backend maps host → domain_code. */
function resolveSsrDomainName(): string {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "");
    if (!appUrl) {
        throw new Error("NEXT_PUBLIC_APP_URL is required for SSR app-service calls (x-domain-name)");
    }
    return `${appUrl}/`;
}

/**
 * Always send x-domain-name from the browser/SSR origin so the backend can resolve the tenant.
 * Backend maps this host → domain_code.
 */
const domainNameMiddleware: Middleware = {
    pre: async ({ url, init }) => {
        const headers = new Headers(init.headers);
        if (typeof window === "undefined") {
            headers.set(X_DOMAIN_NAME_HEADER, resolveSsrDomainName());
            applyDevDomainCodeHeader(headers);
            await applyTrustedSourceHeader(headers);
        } else {
            if (!headers.has(X_DOMAIN_NAME_HEADER)) {
                headers.set(X_DOMAIN_NAME_HEADER, `${window.location.origin}/`);
            }
            // CSR rewrite may not forward middleware-injected headers — stamp here too.
            applyDevDomainCodeHeader(headers);
        }
        return { url, init: { ...init, headers } };
    },
};

const apiConfiguration: Configuration = new Configuration({
    basePath,
    credentials: "include",
    middleware: [domainNameMiddleware],
});

export default apiConfiguration;
