import type { NavLinkItem } from "@/components/layout/navbar";

import { BLOG_BASE_PATH } from "./seo.constants";

const NAV_LINKS: NavLinkItem[] = [
  {
    key: "Home",
    href: "",
  },
  {
    key: "About Us",
    href: "about-us",
  },
  {
    key: "Our Businesses",
    href: "our-businesses",
  },
  {
    key: "Contact Us",
    href: "contact-us",
  },
];

type NavLinkKey = (typeof NAV_LINKS)[number]["key"];

export { NAV_LINKS, type NavLinkKey };
