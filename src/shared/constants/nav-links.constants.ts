import type { NavLinkItem } from "@/components/layout/navbar";

// key = translation key. Labels come from translate_values (CMS), not from this file.
const NAV_LINKS: NavLinkItem[] = [
  {
    key: "navbar.home",
    href: "",
  },
  {
    key: "navbar.about",
    href: "about-us",
  },
  {
    key: "navbar.ourBusinesses",
    href: "our-businesses",
  },
  {
    key: "navbar.contactUs",
    href: "contact-us",
  },
];

type NavLinkKey = (typeof NAV_LINKS)[number]["key"];

export { NAV_LINKS, type NavLinkKey };
