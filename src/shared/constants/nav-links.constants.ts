import type { NavLinkItem } from "@/components/layout/navbar";

import { BLOG_BASE_PATH } from "./seo.constants";

const NAV_LINKS: NavLinkItem[] = [
  {
    key: "Home",
    href: "",
  },
  {
    key: "About Us",
    href: "/about-us",
  },
  {
    key: "Our Businesses",
    href: "/our-businesses",
    children: [
      {
        key: "7days",
        href: "/our-businesses/7days",
      },
      {
        key: "PipEvo",
        href: "/our-businesses/pip-evo",
      },
      {
        key: "Sriwilai",
        href: "/our-businesses/sriwilai",
      },
      {
        key: "DMS",
        href: "/our-businesses/dms",
      },
      {
        key: "Sabaidee",
        href: "/our-businesses/sabaidee",
      },
    ],
  },
  {
    key: "Contact Us",
    href: "/contact-us",
  },
];

type NavLinkKey = (typeof NAV_LINKS)[number]["key"];

export { NAV_LINKS, type NavLinkKey };
