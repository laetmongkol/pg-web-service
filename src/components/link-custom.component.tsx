"use client";

import { type ComponentPropsWithoutRef, type ReactNode, type Ref,useState } from "react";
import Link, { type LinkProps } from "next/link";

export interface LinkCustomProps extends ComponentPropsWithoutRef<typeof Link> {
  href: NonNullable<LinkProps["href"]>; // "/en/about" | "https://example.com"
  children: ReactNode;
  className?: string; // "text-(--color-primary) hover:underline"
  as?: LinkProps["as"]; // legacy dynamic route path
  replace?: boolean; // true — replace history entry instead of push
  scroll?: boolean; // false — keep scroll position after navigate
  shallow?: boolean; // false — Pages Router only
  passHref?: boolean; // false — use with legacyBehavior
  prefetch?: boolean | "auto" | null; // false | true | null (auto)
  prefetchDelay?: number; // 800
  locale?: string | false; // "en" | false — Pages Router only
  target?: string; // "_blank" | "_self"
  rel?: string; // "noopener noreferrer" — merged & enforced for external links
  download?: string | boolean; // true | "filename.pdf"
  title?: string; // "About us page"
  id?: string; // "nav-about-link"
  onClick?: LinkProps["onClick"]; // (e) => e.preventDefault()
  onMouseEnter?: LinkProps["onMouseEnter"];
  onMouseLeave?: React.MouseEventHandler<HTMLAnchorElement>;
  onMouseMove?: React.MouseEventHandler<HTMLAnchorElement>;
  onTouchStart?: LinkProps["onTouchStart"];
  onNavigate?: LinkProps["onNavigate"]; // (e) => e.preventDefault()
  transitionTypes?: string[]; // ["slide-in"]
  ref?: Ref<HTMLAnchorElement>;
}

const APP_HOSTNAME = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_APP_URL ?? "").hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
})();

function isExternalLink(href: string): boolean {
  if (
    href.startsWith("/") ||
    href.startsWith("#") ||
    href.startsWith("?") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return false;
  }

  if (!APP_HOSTNAME) {
    return false;
  }

  try {
    const url = new URL(href);
    return url.hostname.replace(/^www\./, "") !== APP_HOSTNAME;
  } catch {
    return false;
  }
}

function resolveRel(href: string, userRel?: string): string | undefined {
  if (!isExternalLink(href)) {
    return userRel;
  }

  const tokens = new Set((userRel ?? "").split(/\s+/).filter(Boolean));
  tokens.add("noopener");

  return Array.from(tokens).join(" ");
}

export default function LinkCustom({
  href,
  children,
  className,
  as,
  replace,
  scroll,
  shallow,
  passHref,
  prefetch = undefined,
  prefetchDelay = 800,
  locale,
  target,
  rel,
  download,
  title,
  id,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onTouchStart,
  onNavigate,
  transitionTypes,
  ref,
  ...props // aria-label and other anchor attrs
}: LinkCustomProps) {
  const [active, setActive] = useState(false);
  const [isHoveringTimer, setIsHoveringTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const hrefString = typeof href === "string" ? href : href.pathname ?? "";
  const resolvedRel = resolveRel(hrefString, rel);

  return (
    <Link
      ref={ref}
      href={href}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref={passHref}
      prefetch={prefetch !== undefined ? prefetch : active ? null : false} // null = auto, fetch ตอน hover
      onMouseEnter={(e) => {
        setIsHoveringTimer(setTimeout(() => {
          setActive(true);
        }, prefetchDelay));
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (isHoveringTimer && !active) {
          clearTimeout(isHoveringTimer);
          setIsHoveringTimer(null);
        }
        onMouseLeave?.(e);
      }}
      locale={locale}
      className={className}
      target={target}
      rel={resolvedRel}
      download={download}
      title={title}
      id={id}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onTouchStart={onTouchStart}
      onNavigate={onNavigate}
      transitionTypes={transitionTypes}
      {...props}
    >
      {children}
    </Link>
  );
}