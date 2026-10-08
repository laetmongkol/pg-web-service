import { BACKEND_IMAGE_PREFIX } from "@/lib/media/image-loader";

/** One placeholder used for every image across the public pages while they are mockups. */
export const PIP_MOCK_IMAGE = `${BACKEND_IMAGE_PREFIX}contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png`;

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
