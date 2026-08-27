import type { NavLinkItem } from "@/components/layout/navbar";

import { BLOG_BASE_PATH } from "./seo.constants";

const NAV_LINKS: NavLinkItem[] = [
  {
    key: "Home",
    href: "",
  },
];

type NavLinkKey = (typeof NAV_LINKS)[number]["key"];

export { NAV_LINKS, type NavLinkKey };
