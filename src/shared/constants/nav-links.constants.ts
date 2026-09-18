import type { NavLinkItem } from "@/components/layout/navbar";

const NAV_LINKS: NavLinkItem[] = [
  {
    key: "navbar.home",
    href: "",
    label: "Home",
  },
  {
    key: "navbar.about",
    href: "about-us",
    label: "About Us",
  },
  {
    key: "navbar.ourBusinesses",
    href: "services",
    label: "Services",
  },
  {
    key: "navbar.contactUs",
    href: "contact-us",
    label: "Contact Us",
  },
];

type NavLinkKey = (typeof NAV_LINKS)[number]["key"];

export { NAV_LINKS, type NavLinkKey };
