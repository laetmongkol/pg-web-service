/**
 * Prefix a /public path with the deploy base path. Next adds basePath to links and its own
 * bundles, but not to plain asset URLs (next/image src, fetch of the 3D model).
 */
export const assetPath = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`
