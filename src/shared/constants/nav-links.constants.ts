import type { NavLinkItem } from "@/components/layout/navbar";

const NAV_LINKS: NavLinkItem[] = [
  {
    key: "หน้าแรก",
    href: "",
  },
  {
    key: "เกี่ยวกับเรา",
    href: "about-us",
  },
  {
    key: "บริการของเรา",
    href: "our-businesses",
  },
  {
    key: "ติดต่อเรา",
    href: "contact-us",
  },
];

type NavLinkKey = (typeof NAV_LINKS)[number]["key"];

export { NAV_LINKS, type NavLinkKey };
