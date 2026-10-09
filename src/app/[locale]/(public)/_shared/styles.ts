/*
 * Colour lives in src/styles/theme-tokens.css ("PUBLIC PAGES" block). These constants only bind
 * those tokens to Tailwind classes so every section uses the same role → colour mapping.
 */

/** h1/h2 on a navy section. */
export const HEADING_GRADIENT_DARK_CLASSNAME =
    "bg-[image:var(--gradient-heading-on-dark)] bg-clip-text text-transparent";

/** h1/h2 on a light panel or white card. */
export const HEADING_GRADIENT_LIGHT_CLASSNAME =
    "bg-[image:var(--gradient-heading-on-light)] bg-clip-text text-transparent";

/** Background of the light panels between the dark sections. */
export const HOME_LIGHT_SURFACE_CLASSNAME = "bg-(--section-light)";

/** Section content width used on every public page. */
export const SECTION_CONTAINER_CLASSNAME = "mx-auto w-full max-w-7xl px-4 sm:px-8";
