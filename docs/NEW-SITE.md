# ขึ้นเว็บใหม่จาก template นี้

ค่าแบรนด์ถูกเคลียร์ไว้แล้ว. ไฟล์ว่าง = ช่องใส่. อย่าเดา path — copy ตัวอย่างแล้วเปลี่ยนเฉพาะ string.

ข้อความ i18n (`t("navbar.signIn")`, `t("Home")`) มาจาก API แปล ไม่ได้อยู่ใน repo. หลังใส่ `key` ใน nav/footer ต้องมีแถวแปลใน CMS ให้ตรง key นั้น.

อย่าแก้ `src/services/generated-cli/**`.

---

## ลำดับงาน

1. Env + ไฟล์ใน `public/`
2. SEO constants + `SITE_METADATA`
3. Nav + CTA + footer
4. Routing guard + หน้า `page.tsx`
5. สีใน `theme-tokens.css`
6. Sitemap prefix (optional)
7. `package.json` name

ตัวอย่างด้านล่างใช้แบรนด์สมมติ **Acme**.

---

## 0. Env + ไฟล์ static


| อะไร                                      | ที่ไหน                                                                      |
| ----------------------------------------- | --------------------------------------------------------------------------- |
| origin ของเว็บ (canonical / sitemap / OG) | `.env` → `NEXT_PUBLIC_APP_URL=https://www.acme.com`                         |
| tenant ใน dev                             | `.env` → `NEXT_PUBLIC_DEV_DOMAIN_CODE=acme`                                 |
| backend                                   | `.env` → `APP_SERVICE_ORIGIN=...`                                           |
| โลโก้ light/dark                          | `public/logo.svg` (ตอนนี้ `logo.tsx` ชี้ไฟล์นี้ — **ยังไม่มีใน** `public/`) |
| โลโก้ JSON-LD / OG                        | `public/logo.png` (ค่า `ORGANIZATION.logoPath`)                             |
| รูป OG default                            | `public/og-default.png` (ค่า `SITE_METADATA.ogImage`)                       |
| favicon                                   | `src/app/favicon.ico`, `src/app/icon.png`, `src/app/apple-icon.png`         |


`src/lib/seo/json-ld.ts` และ `src/app/layout.tsx` **ไม่ต้องแก้** — อ่านจาก constants.

---



## 1. `src/shared/constants/seo.constants.ts`

จุดเดียวของชื่อองค์กร, เส้นทาง public, blog path, map ไป `page_seo.page_code`.

`href` ในนี้ = path **ไม่มี locale**. `""` = หน้าแรก (`/th`, `/en`).

```ts
export const SEO_DEFAULT_LOCALE = LANGUAGE.TH;
export const SEO_X_DEFAULT_LOCALE = LANGUAGE.TH;

// มีบล็อก → "/blogs"  ไม่มี → ปล่อย ""
export const BLOG_BASE_PATH = "/blogs";

export const PUBLIC_STATIC_ROUTES = [
  "",
  "/about-us",
  "/contact-us",
] as const;

export const STATIC_ROUTE_PAGE_CODE: Record<PublicStaticRoute, string> = {
  "": "Home",
  "/about-us": "AboutUs",
  "/contact-us": "ContactUs",
};

export const ORGANIZATION = {
  name: "Acme",
  alternateName: "Acme Co.",
  legalName: "Acme Company Limited",
  description: "Short org description for JSON-LD.",
  logoPath: "/logo.png",
  sameAs: [
    "https://www.facebook.com/acme",
    "https://www.linkedin.com/company/acme",
  ],
  knowsAbout: ["topic-a", "topic-b"],
} as const;

export const SERVICE = {
  name: "Acme Services",
  serviceType: "Consulting",
  description: "What the company sells.",
} as const;
```

ต้องตรงกับ:

- `page.tsx` ที่เรียก `buildPageMetadata({ pageCode: "Home" })` — `pageCode` = ค่าใน `STATIC_ROUTE_PAGE_CODE`
- แถว `page_seo` ใน DB (PascalCase เดียวกัน)
- ถ้ามีบล็อก: route จริงต้องเป็น `src/app/[locale]/(public)/blogs/...` ให้ตรง `BLOG_BASE_PATH`

---



## 2. `src/lib/seo/metadata.ts`

แก้เฉพาะ `SITE_METADATA` ด้านบน. ฟังก์ชันด้านล่างอย่าแตะ.

```ts
export const SITE_METADATA = {
  name: "Acme",
  defaultTitle: "Acme — tagline",
  description: "Fallback meta description when page_seo is empty.",
  titleTemplate: "%s | Acme",
  keywords: ["acme", "keyword-2"],
  ogImage: "/og-default.png",
} as const
```

หน้าใหม่ที่ต้องมี metadata:

```ts
// src/app/[locale]/(public)/about-us/page.tsx
import { buildPageMetadata } from "@/lib/seo/metadata"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return buildPageMetadata({
    locale,
    pathname: "/about-us",
    pageCode: "AboutUs",
  })
}
```

`pathname` ต้องอยู่ใน `PUBLIC_STATIC_ROUTES`. `pageCode` ต้องตรง `STATIC_ROUTE_PAGE_CODE`.

---



## 3. `src/shared/constants/nav-links.constants.ts`

เมนู navbar. `key` = translation key ที่ `navbar.tsx` เรียก `t(key)`.

```ts
const NAV_LINKS: NavLinkItem[] = [
  { key: "Home", href: "" },
  { key: "About Us", href: "/about-us" },
  {
    key: "Our Businesses",
    href: "/our-businesses",
    children: [
      { key: "ProductA", href: "/our-businesses/product-a" },
      { key: "ProductB", href: "/our-businesses/product-b" },
    ],
  },
  { key: "Contact Us", href: "/contact-us" },
];
```

ทุก `href` ต้องมี `page.tsx` ใต้ `src/app/[locale]/(public)/...` ไม่เช่นนั้นคลิกแล้ว 404.

`BLOG_BASE_PATH` import ไว้แล้ว — ถ้ามีบล็อก เพิ่ม `{ key: "Blogs", href: BLOG_BASE_PATH }`.

---



## 4. `src/components/layout/navbar-component/nav-links.tsx`

ไอคอนเมนู. key **ต้องตรง** `NAV_LINKS[].key`.

```ts
import { Home, Info, Briefcase, MessageCircleQuestion } from "lucide-react"

const NAV_LINK_ICONS: Partial<Record<NavLinkKey, LucideIcon>> = {
  Home: Home,
  "About Us": Info,
  "Our Businesses": Briefcase,
  "Contact Us": MessageCircleQuestion,
}
```

ไม่ใส่ไอคอนก็ได้ — เมนูยังขึ้น แค่ไม่มี icon.

---



## 5. `src/components/layout/navbar-component/navbar-actions.tsx`

ปุ่มขวา (sign-in / CTA). URL ว่าง = ลิงก์พัง.

```ts
export const NAVBAR_ROUTES = {
  signIn: "https://app.acme.com/login",
  startTrading: "/contact-us",
} as const
```

- ขึ้นต้น `http://` / `https://` → ไม่วน locale
- path ในเว็บ (`/contact-us`) → กลายเป็น `/{locale}/contact-us`

ป้ายปุ่มมาจากแปล `navbar.signIn` และ `navbar.startTrading` ใน `src/components/layout/navbar.tsx`. อยากเปลี่ยนชื่อ key (เช่น `startTrading` → `getStarted`) ต้องแก้ `navbar.tsx` + `NavbarLabels` + CMS ด้วย.

---



## 6. `src/components/layout/logo.tsx`

```tsx
<FillImage src="/logo.svg" alt="Acme" ... />
```

มี 2 บล็อก: `dark:block` และ `dark:hidden`. ถ้าโลโก้คนละไฟล์:

- dark → `/logo-dark.svg`
- light → `/logo.svg`

ใส่ไฟล์ใน `public/` ให้ path ตรง.

---



## 7. `src/components/layout/footer.tsx`

จุดที่ต้องใส่:


| ตัวแปร / จุด                            | ใส่อะไร                                                                                                                  |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `LINE_QR_STORAGE_KEY`                   | media key จาก CMS/S3 ไม่ใช่ URL เต็ม. ว่าง = กล่องว่าง                                                                   |
| `SOCIAL_LINKS`                          | URL จริง + icon จาก `react-icons`                                                                                        |
| `COMPANY_LINKS` / `GROUP_COMPANY_LINKS` | `key` = translation key, `href` = `"/about-us"` หรือ `"#"` ถ้ายังไม่มีหน้า                                               |
| `LEGAL_LINKS`                           | แถวล่าง — ตอนนี้ `href={t(link.href)}` ดังนั้น `href` ใน array ต้องเป็น **translation key ที่คืน URL** ไม่ใช่ path ตรง ๆ |
| `<h2>Name</h2>`                         | ชื่อบริษัท                                                                                                               |
| `<p>Description</p>`                    | คำโปรย                                                                                                                   |
| `title` / `subtitle` ที่ hardcode       | ข้อความหรือ `t("footer.xxx")`                                                                                            |
| `© … rights.`                           | ข้อความลิขสิทธิ์                                                                                                         |


ตัวอย่างลิงก์:

```ts
import { IoLogoFacebook, IoLogoInstagram } from "react-icons/io5"

const LINE_QR_STORAGE_KEY = "contents/....png"

const SOCIAL_LINKS: FooterSocialItem[] = [
  { label: "Facebook", href: "https://www.facebook.com/acme", icon: IoLogoFacebook },
  { label: "Instagram", href: "https://www.instagram.com/acme", icon: IoLogoInstagram },
]

const COMPANY_LINKS: FooterLinkItem[] = [
  { key: "footer.aboutUs", href: "/about-us" },
  { key: "footer.contactUs", href: "/contact-us" },
]
```

`COMPANY_LINKS` ใช้ `t(link.key)` เป็นข้อความ. ต้องมีแปลใน CMS.

---



## 8. `src/proxies/routing-guard.proxy.ts`

ปิดหน้าโดยไม่ลบไฟล์. key = logical path **ตัด locale**.

```ts
const ROUTE_REGISTRY: Record<string, PublishStatus> = {
  "/about-us": "Y",
  "/careers": "N",   // 404 ทุกคน
  "/preview-only": "D", // เว็บนี้ไม่มี admin preview → 404 เหมือน N
};
```

หน้าที่ไม่ใส่ใน map = `"Y"` (เปิด).

มีหน้าใหม่ที่ยังไม่พร้อม → ใส่ `"N"` ก่อน แล้วค่อยเปิด.

---



## 9. `src/app/[locale]/(public)/page.tsx`

ตอนนี้เป็นหน้าโชว์สี/ฟอนต์ ไม่ใช่หน้าแรกจริง.

ตอนขึ้นเว็บ:

1. แทน JSX ด้วย section ของแบรนด์
2. ใส่ `generateMetadata` แบบข้อ 2 (`pathname: ""`, `pageCode: "Home"`)

หน้าอื่นวางที่:

```
src/app/[locale]/(public)/about-us/page.tsx
src/app/[locale]/(public)/contact-us/page.tsx
src/app/[locale]/(public)/our-businesses/product-a/page.tsx
```

อย่าลืมเพิ่ม path ใน `PUBLIC_STATIC_ROUTES` + `NAV_LINKS`.

---



## 10. `src/styles/theme-tokens.css`

แก้สเกลสีใน `:root`. ชื่อตัวแปร**ห้ามเปลี่ยน** — component อ้าง `--color-primary-`* อยู่แล้ว.

จุดที่ใช้บ่อย:

- `--color-primary-400` base
- `--color-primary-500` hover
- `--color-primary-600` active
- `--color-secondary-*`
- ด้านล่างไฟล์: `--surface-*`, `--text-*`, `--navbar-height`

หน้า `page.tsx` (swatch) ใช้ดู token หลังเปลี่ยนสี.

---



## 11. `src/app/sitemap.xml/route.ts`

XML prefix ยังเป็น `goc:` (`GOC_NS`, `xmlns:goc`, `goc:index`, …). Google ใช่แค่ sitemap มาตรฐาน — prefix นี้เป็นของ stylesheet/debug.

ขึ้นเว็บใหม่ให้ rename ทั้งก้อนเป็นชื่อ generic เช่น `site`:

```ts
const SITE_NS = "https://www.acme.com/ns/sitemap"

// ใน template string:
xmlns:site="${SITE_NS}"
site:generatedAt="..."
site:label="..."
```

ต้องไล่แทนทุก `goc:` ในไฟล์นี้. ถ้ามี `public/sitemap.xsl` ที่อ่าน attr เดิม ต้องแก้ xsl ให้ตรง prefix ใหม่.

รายการ URL ใน sitemap **ไม่ได้พิมพ์ในไฟล์นี้** — มาจาก `PUBLIC_STATIC_ROUTES` + บล็อก (ถ้า `BLOG_BASE_PATH` ไม่ว่าง).

---



## 12. อื่นที่เกี่ยวกับแบรนด์ (ไม่อยู่ใน git list ล่าสุด)


| path                      | ทำอะไร                                                                    |
| ------------------------- | ------------------------------------------------------------------------- |
| `package.json` → `"name"` | ชื่อแพ็กเกจ เช่น `acme-web-service`                                       |
| `next.config.ts`          | คอมเมนต์ชื่อ repo sibling; `rewrites` ไป `APP_SERVICE_ORIGIN`             |
| `src/app/robots.ts`       | ไม่ต้องแก้ — ใช้ `getSiteUrl()`                                           |
| `src/app/layout.tsx`      | font / JSON-LD. เปลี่ยนฟอนต์ที่นี่ถ้าแบรนด์ไม่ใช้ Roboto + Noto Sans Thai |
| `src/lib/seo/json-ld.ts`  | ไม่ต้องแก้                                                                |


---



## Checklist สั้น

- [ ] `.env` มี `NEXT_PUBLIC_APP_URL` + `NEXT_PUBLIC_DEV_DOMAIN_CODE`
- [ ] `public/logo.svg`, `public/logo.png`, `public/og-default.png`
- [ ] `ORGANIZATION` / `SERVICE` / `SITE_METADATA` ไม่ว่าง
- [ ] `PUBLIC_STATIC_ROUTES` + `STATIC_ROUTE_PAGE_CODE` ตรงกับ `page.tsx` + DB
- [ ] `NAV_LINKS` + icon map + แปล CMS
- [ ] `NAVBAR_ROUTES` มี URL จริง
- [ ] footer ชื่อ / โซเชียล / ลิงก์ / QR
- [ ] สีใน `theme-tokens.css`
- [ ] (optional) เปลี่ยน `goc:` ใน sitemap
- [ ] (optional) `package.json` name