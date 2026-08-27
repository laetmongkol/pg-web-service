import { getVercelOidcToken } from "@vercel/oidc"

const TRUSTED_SOURCE_HEADER = "x-vercel-trusted-oidc-idp-token"

/**
 * Vercel Trusted Sources — the app-service project keeps Deployment Protection on and lets this
 * project through when the request carries this project's short-lived OIDC token. Without it a
 * server-to-server call to a protected (staging/preview) deployment is answered with a 302 to the
 * Vercel SSO login page, and every `res.json()` fails on `<!DOCTYPE`.
 *
 * Read per call on purpose: the token lives one hour and arrives per invocation (request header,
 * else env), so a value cached at module scope goes stale and locks the site out of the API.
 *
 * A missing token is not an error — local development talks to an unprotected origin, and
 * production custom domains are exempt from protection. Let those through unstamped.
 */
export async function applyTrustedSourceHeader(headers: Headers): Promise<void> {
  try {
    headers.set(TRUSTED_SOURCE_HEADER, await getVercelOidcToken())
  } catch {
    // No OIDC token in this environment — nothing to bypass.
  }
}
