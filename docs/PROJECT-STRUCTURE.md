# คู่มือโครงสร้าง pip-group-holding-web-service

เอกสารนี้สำหรับ junior ที่เพิ่งเข้าโปรเจกต์  
เป้าหมาย: อ่านแล้วรู้ว่า **ไฟล์ไหนทำอะไร**, **ต่อกับใคร**, และ **ต่างจาก** `create-next-app` **ตรงไหน**

โครงนี้ copy มาจากเว็บ GOC แล้วค่อย ๆ เปลี่ยนเป็นเว็บ PIP Group Holding  
บางไฟล์ยังมีชื่อ/คอมเมนต์ของ GOC ค้างอยู่ — ท้ายเอกสารมีรายการนั้น

อย่าใส่ค่าจากไฟล์ `.env` จริงลงเอกสารหรือ git เด็ดขาด ใช้แค่ชื่อตัวแปรจาก `.env.example`

---

## สารบัญ

1. [ภาพใหญ่ในหนึ่งหน้า](#1-ภาพใหญ่ในหนึ่งหน้า)
2. [คำขอหนึ่งวิ่งผ่านอะไรบ้าง](#2-คำขอหนึ่งวิ่งผ่านอะไรบ้าง)
3. [ต่างจาก Next.js ปกติตรงไหน](#3-ต่างจาก-nextjs-ปกติตรงไหน)
4. [ไฟล์รากโปรเจกต์](#4-ไฟล์รากโปรเจกต์)
5. `src/proxy.ts` [— ประตูทุก request](#5-srcproxyts--ประตูทุก-request)
6. `src/proxies/` [— ผู้ช่วยของ proxy](#6-srcproxies--ผู้ช่วยของ-proxy)
7. `src/i18n/` [— ภาษาใน URL](#7-srci18n--ภาษาใน-url)
8. `src/app/` [— หน้าและโครง HTML](#8-srcapp--หน้าและโครง-html)
9. `src/components/` [— ชิ้น UI](#9-srccomponents--ชิ้น-ui)
10. `src/lib/` [— helper ไม่มี state](#10-srclib--helper-ไม่มี-state)
11. `src/services/` [— คุยกับ backend](#11-srcservices--คุยกับ-backend)
12. `src/shared/` [— ค่าคงที่และตาราง class](#12-srcshared--ค่าคงที่และตาราง-class)
13. `src/providers/` [และ](#13-srcproviders-และ-srcstores) `src/stores/`
14. `src/styles/` [และ](#14-srcstyles-และ-globalscss) `globals.css`
15. [ตัวแปรแวดล้อม](#15-ตัวแปรแวดล้อม)
16. [กฎสำคัญเวลาแก้โค้ด](#16-กฎสำคัญเวลาแก้โค้ด)
17. [สถานะปัจจุบันของ PIP (ยังไม่เสร็จ)](#17-สถานะปัจจุบันของ-pip-ยังไม่เสร็จ)

---



## 1. ภาพใหญ่ในหนึ่งหน้า

โปรเจกต์นี้เป็น **เว็บสาธารณะ** (marketing site) ของ PIP Group Holding  
สร้างด้วย **Next.js App Router** (ไฟล์ใน `src/app/`)

มันไม่ใช่เว็บเดี่ยว ๆ ที่เก็บข้อมูลในตัวเอง มันเป็น **หน้าบ้าน** ที่ดึงข้อมูลจาก backend อีกตัวชื่อ `api-app-service` (NestJS)

```
เบราว์เซอร์
    │
    │  เปิด /th  หรือ ยิง /api/app/...
    ▼
Next.js (โปรเจกต์นี้  พอร์ต 3000)
    │
    ├─ หน้าเว็บ  →  render HTML (navbar, เนื้อหา, footer)
    │
    └─ /api/app/*  →  rewrite ไป backend (พอร์ต 8091 โดยค่าเริ่มต้น)
           │
           ▼
     api-app-service  (users, ภาษา, แปล, SEO, บล็อก, รูป, …)
```

คิดง่าย ๆ:


| ชั้น              | โฟลเดอร์                         | หน้าที่แบบประโยคเดียว                        |
| ----------------- | -------------------------------- | -------------------------------------------- |
| ประตู             | `src/proxy.ts` + `src/proxies/`  | ก่อนเข้าหน้า: ภาษา, ธีม, redirect, token API |
| หน้า              | `src/app/`                       | URL → HTML                                   |
| ชิ้น UI           | `src/components/`                | ปุ่ม, ลิงก์, navbar, footer                  |
| ตัวช่วย           | `src/lib/`                       | รวม class, SEO, แปลง URL รูป                 |
| คุย API           | `src/services/`                  | ห้าม `fetch` ตรง ๆ ไป backend                |
| ค่ากลาง           | `src/shared/`                    | enum ภาษา, เมนู, ตาราง Tailwind              |
| ภาษา              | `src/i18n/`                      | `/th/...` `/en/...` + ข้อความจาก DB          |
| สี/อนิเมชัน       | `src/styles/`                    | CSS variables ที่ Tailwind ใช้               |
| state ฝั่ง client | `src/stores/` + `src/providers/` | ธีม, React Query                             |


Next.js ปกติที่ `create-next-app` ให้มา มีแค่ `app/page.tsx` + `layout.tsx` + `globals.css`  
โปรเจกต์นี้ **เพิ่มชั้นด้านบนทั้งหมด** เพราะต้องรองรับหลายภาษา, SEO, และ backend คนละ origin

---



## 2. คำขอหนึ่งวิ่งผ่านอะไรบ้าง

สมมติผู้ใช้เปิด `http://localhost:3000/th`

```
1. เบราว์เซอร์ ขอ GET /th
2. src/proxy.ts ทำงานก่อน React (เหมือน middleware)
      - ไม่ใช่ /api/app → ไม่ติด token API
      - ไม่ใช่ / เปล่า → ไม่ 301
      - slug แรกคือ th → ภาษาที่รองรับ
      - ใส่ cookie ภาษา/ธีม + Cache-Control
3. next-intl อ่าน locale จาก URL
4. src/app/layout.tsx
      - <html lang="th">
      - ฟอนต์, สคริปต์ธีม, JsonLd, AppProvider
5. src/app/[locale]/layout.tsx
      - ตรวจว่า th อยู่ในรายการ locale
      - โหลดข้อความแปล (getMessages)
      - ห่อ NextIntlClientProvider
6. src/app/[locale]/(public)/layout.tsx
      - Navbar + Footer
      - ดึงรายการภาษาจาก backend สำหรับตัวสลับภาษา
7. src/app/[locale]/(public)/page.tsx
      - เนื้อหาหน้าแรก
8. ส่ง HTML กลับเบราว์เซอร์
```

ถ้าผู้ใช้เปิดแค่ `/` (ไม่มี `th`):

- ข้อ 2 จะ **301 ไป** `/th` (หรือ locale จาก cookie)  
- จากนั้นเดินข้อ 3–8 ตามปกติ

ถ้าผู้ใช้เปิด `/th/about-us` แต่ยังไม่มีไฟล์หน้า:

- เดินถึงข้อ 7 ไม่เจอ `page.tsx` → `src/app/not-found.tsx`

---



## 3. ต่างจาก Next.js ปกติตรงไหน

ตารางนี้คือสิ่งที่ junior มักงง


| เรื่อง                     | Next.js จาก create-next-app           | โปรเจกต์นี้                                                          |
| -------------------------- | ------------------------------------- | -------------------------------------------------------------------- |
| หน้าแรก                    | `src/app/page.tsx` = URL `/`          | **ไม่มี** `app/page.tsx` ที่ root แล้ว หน้าแรกคือ `/th`              |
| middleware                 | มักเป็น `middleware.ts` ที่ราก `src/` | ใช้ `src/proxy.ts` (Next 16 เรียกไฟล์นี้แทน middleware)              |
| ภาษา                       | มักเป็นเว็บภาษาเดียว `lang="en"`      | ทุก URL มี prefix `/th` หรือ `/en` บังคับ (`localePrefix: "always"`) |
| แปลข้อความ                 | ไฟล์ JSON ใน repo                     | ดึงจาก **backend ตารางแปล** (`translateAppServiceServer`)            |
| เรียก API                  | `fetch('https://...')` ในหน้า         | **ห้าม** ยิง app-service ตรง ๆ ต้องผ่าน generated client             |
| รูป `<Image>`              | loader ของ Vercel                     | custom loader ไป `/api/app/image/` ของ backend                       |
| CSS                        | `globals.css` สั้น ๆ                  | Tailwind v4 + ไฟล์ token ใน `src/styles/`                            |
| ธีมมืด                     | มักใช้ `prefers-color-scheme`         | class `.dark` / `.light` บน `<html>` จาก cookie + localStorage       |
| คุย backend จากเบราว์เซอร์ | CORS ไป origin อื่น                   | same-origin `/api/app/*` แล้ว **rewrite** ใน `next.config.ts`        |


ประโยคจำ: **หน้าบ้าน (Next) ไม่ถือข้อมูลธุรกิจ ข้อมูลอยู่ที่ Nest แล้วเว็บมาอ่านผ่าน SDK ที่ generate**

---



## 4. ไฟล์รากโปรเจกต์



### `package.json`

บอกชื่อแพ็กเกจ, สคริปต์, dependency

สคริปต์ที่ใช้บ่อย:

```json
"dev": "next dev -p 3000",
"build": "next build",
"start": "next start -p 3000",
"lint": "eslint",
"typecheck": "npx tsc --noEmit --watch"
```

ต่างจาก Next ปกติ: ล็อกพอร์ต **3000** ชัดเจน (GOC ใช้ 3001 เพื่อไม่ชนกันตอนเปิดคู่)

ไลบรารีสำคัญที่ create-next-app ไม่ใส่ให้:

- `next-intl` — ภาษาใน URL
- `@tanstack/react-query` — cache ฝั่ง client ตอนเรียก API จากเบราว์เซอร์
- `zustand` — state เล็ก ๆ เช่น ธีม
- `react-hook-form` + `zod` — ฟอร์ม (ยังไม่ใช้มากใน PIP)
- `server-only` — กันเผลอ import โค้ดเซิร์ฟเวอร์เข้า client bundle
- `@vercel/oidc` — token ตอนยิง staging ของ backend ที่ติด Deployment Protection



### `pnpm-lock.yaml`

ล็อกเวอร์ชันทุกแพ็กเกจที่ติดตั้งจริง  
อย่าแก้มือ ปล่อยให้ `pnpm install` อัปเดต

### `pnpm-workspace.yaml`

ไม่ใช่ monorepo เต็มรูปแบบของ pnpm ในโฟลเดอร์นี้  
ไฟล์นี้แค่บอกว่า native binary ไหน **ไม่ต้อง rebuild** (`sharp`, `esbuild`, …) เพื่อให้ `pnpm install` บน Windows เสถียรขึ้น

### `tsconfig.json`

ตั้ง TypeScript

จุดสำคัญที่ต่างจากเทมเพลตบางตัว:

```json
"paths": {
  "@/*": ["./src/*"]
}
```

แปลว่าเขียน `@/lib/tw-merge` ได้ แทน `../../../lib/tw-merge`  
ต้องชี้ `./src/*` ไม่ใช่ `./*` ไม่งั้น import หาไฟล์ไม่เจอ

`"noEmit": true` — `tsc` ตรวจชนิดอย่างเดียว ไม่สร้างไฟล์ JS  
Next เป็นคน compile จริงตอน `next build`

### `tsconfig.tsbuildinfo`

ไฟล์แคชของ TypeScript (โหมด `incremental`)  
**ไม่ใช่ซอร์ส** อยู่ใน `.gitignore` ห้าม commit ห้ามแก้

### `next-env.d.ts`

Next สร้างให้อัตโนมัติ เพื่อให้ TypeScript รู้จัก type ของ Next  
คอมเมนต์ในไฟล์บอกว่า **อย่าแก้**  
โปรเจกต์นี้ `.gitignore` ใส่ `next-env.d.ts` ไว้ด้วย — จะถูกสร้างใหม่ตอน `next dev`

### `next.config.ts`

สมองของ Next นอกเหนือจากหน้า

1. **ปลั๊กอิน next-intl** ชี้ไป `src/i18n/request.ts`
  ทำให้ทุก SSR โหลด locale + ข้อความแปล
2. `turbopack.root` ล็อก workspace เป็นโฟลเดอร์นี้
  เพราะข้าง ๆ มี `api-app-service` Turbopack อาจเดาผิดว่า root อยู่โฟลเดอร์แม่ แล้ว Tailwind พัง
3. **custom image loader** → `src/lib/media/image-loader.ts`
4. **rewrite**

```ts
{ source: "/api/app/:path*", destination: `${appServiceOrigin}/api/app/:path`* }
```

แปลเป็นภาษาคน: เบราว์เซอร์ยิง `http://localhost:3000/api/app/languages`  
Next แอบไปขอ `http://localhost:8091/api/app/languages` ให้  
cookie ยังเป็นโดเมนเดียวกัน (same-origin)

`APP_SERVICE_ORIGIN` มาจาก env ค่าว่างใช้ `http://localhost:8091`

### `postcss.config.mjs`

เปิด Tailwind v4 ผ่าน `@tailwindcss/postcss`  
ไม่มี `tailwind.config.ts` ที่เต็มไปด้วย theme — สีอยู่ใน `src/styles/theme-tokens.css`

### `eslint.config.mjs`

กฎ lint ของ Next (core-web-vitals + typescript)  
ignore `.next/`, `out/`, `build/`, `next-env.d.ts`

### `.gitignore`

ไม่ commit:

- `node_modules`
- `.next/`
- `.env*` (รวม `.env` จริง)
- `*.tsbuildinfo`
- `next-env.d.ts`

`.env.example` ควรอยู่ใน git เพราะมีแค่ชื่อตัวแปร ไม่มี secret — ถ้าถูก ignore เพราะแพทเทิร์น `.env*` ต้องเช็คว่าทีมตั้งข้อยกเว้น `!.env.example` หรือไม่

### `README.md`

ยังเป็นข้อความของ create-next-app (บอกให้แก้ `app/page.tsx`)  
**ล้าสมัย** เทียบกับโครงจริง — ใช้เอกสารนี้แทนตอนเรียนโครงสร้าง

### `AGENTS.md` และ `CLAUDE.md`

ไฟล์สำหรับ AI/agent ในเครื่อง

- `CLAUDE.md` มีแค่ `@AGENTS.md` คือชี้ไปไฟล์เดียวกัน
- บล็อกบนสุดของ `AGENTS.md` ถูก `next dev` เขียนซ้ำว่า “Next เวอร์ชันนี้ไม่เหมือนที่โมเดลจำได้”

เวลาทำงานใน Cursor ให้ทำตามกฎโปรเจกต์ (generated client, ไม่แก้ schema ด้วย SQL มือ ฯลฯ) ที่อยู่ใน sibling repo ด้วย

### `favicon.ico`

ไอคอนแท็บเบราว์เซอร์  
Next ใช้ **file convention**: วางที่ `src/app/favicon.ico` จะกลายเป็น `/favicon.ico` อัตโนมัติ ไม่ต้องใส่ใน metadata

---



## 5. `src/proxy.ts` — ประตูทุก request



### คืออะไร

ในบทเรียน Next เก่า ไฟล์นี้ชื่อ `middleware.ts`  
Next 16 ในโปรเจกต์นี้ใช้ชื่อ `proxy.ts` ที่ `src/proxy.ts`  
มันรัน **ก่อน** layout และ page ทุกครั้งที่ matcher ตรง

มัน **ไม่เรนเดอร์ JSX**  
มันได้แค่:

- ปล่อยผ่าน (`NextResponse.next`)
- redirect
- rewrite (โชว์ URL หนึ่ง แต่ภายในไปอีก path)
- ใส่ header / cookie



### `config.matcher`

```ts
matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/api/app/:path*"]
```

อ่านเป็นภาษาคน:

- จับเกือบทุกหน้า
- **ไม่จับ** `/api/...` ทั่วไป, `/_next`, `/_vercel`, ไฟล์มีนามสกุล (เช่น `.css` `.png`)
- **จับเพิ่ม** `/api/app/...` โดยเฉพาะ เพื่อติด token ก่อน rewrite



### ลำดับในฟังก์ชัน `proxy`

อ่านโค้ดตามนี้ทุกครั้งที่ debug “ทำไมเด้ง / ทำไม 404”

**กิ่ง A — เรียก API จากเบราว์เซอร์**

```ts
if (request.nextUrl.pathname.startsWith("/api/app/")) {
  await applyTrustedSourceHeader(apiHeaders);
  return NextResponse.next({ request: { headers: apiHeaders } });
}
```

ไม่ทำ i18n ไม่ทำธีม  
เหตุผล: เบราว์เซอร์ไม่มี OIDC token แต่ staging ของ backend อาจติด Vercel Deployment Protection  
rewrite ใน `next.config.ts` ใส่ header ให้ไม่ได้ เลยต้องใส่ที่นี่

**กิ่ง B — หน้าเว็บ**

1. แยก path เป็นชิ้น เช่น `/th/about-us` → `["th", "about-us"]`
2. `getPreferredLanguage` — URL ถูกใช้ URL, ไม่ถูกใช้ cookie, ไม่มีใช้ `th`
3. `resolveHomeRedirect` — ถ้า path ว่าง (`/`) → 301 ไป `/{locale}`
4. `setPathnameRequestHeader` — locale ไม่รู้จัก → rewrite ไปหน้า 404; ถ้ารู้จักใส่ `x-pathname`
5. อ่านธีมจาก cookie ใส่ `x-theme`
6. ใส่ `x-language` และ `x-next-intl-locale`
7. `resolveRoutingGuardResponse` — สวิตช์ปิดหน้า (ตอนนี้รายการเป็น `"Y"` = เปิด)
8. ให้ next-intl middleware จัดการ prefix ภาษา ถ้ามันตอบ 3xx (redirect) ส่งต่อเลย
9. `NextResponse.next` พร้อม header ที่สะสม
10. copy `x-middleware-rewrite` จาก intl ถ้ามี
11. Set-Cookie ภาษา + ธีม
12. ถ้าเป็น Vercel Preview ใส่ `x-robots-tag: noindex`
13. ใส่ `Cache-Control` แบบ `private` สั้น ๆ (ค่าเริ่มต้น 5 นาที)

ถ้า `try` พัง: log แล้ว `NextResponse.next()` — **ไม่ทำให้ทั้งไซต์ล่ม** แต่จะข้าม logic ภาษา

### เชื่อมกับใคร

```
proxy.ts
  ├─ i18n/routing.ts          รายการ locale
  ├─ proxies/language.proxy   ภาษาที่ใช้ได้ + cookie x-language
  ├─ proxies/pathname.proxy   / → /th และ locale เพี้ยน → 404
  ├─ proxies/theme.proxy      cookie theme
  ├─ proxies/routing-guard    ปิดหน้าเป็นราย path
  ├─ lib/api/trusted-source   OIDC บน /api/app
  └─ lib/seo/metadata         isPreviewDeployment()
```

---



## 6. `src/proxies/` — ผู้ช่วยของ proxy

โฟลเดอร์นี้ **ไม่ใช่ HTTP reverse proxy**  
เป็นไฟล์ TypeScript ที่ `proxy.ts` เรียก เพื่อไม่ให้ไฟล์ประตูยาวเกินไป

### `language.proxy.ts`

ถามว่า string นี้เป็นภาษาที่ใช้ได้ไหม

กติกาสำคัญ:

1. ต้องอยู่ใน enum `LANGUAGE` (`th`, `en`) ที่ `i18n/routing.ts` ใช้
  เพราะ `[locale]/layout` มี `dynamicParams = false` — locale นอกลิสต์เรนเดอร์ไม่ได้
2. `th` (default) **ผ่านเสมอ** แม้ backend ดับ — ไซต์ไม่ถูกล็อก
3. `en` ต้องมีในตารางภาษาของ backend (status เปิด)
  ถ้าตารางคืนแค่ `[th]` แล้วเปิด `/en` จะ 404

`getPreferredLanguage`: URL → cookie `x-language` → `th`

### `pathname.proxy.ts`

สองงาน:

```ts
// /  →  /th   (301)
export const resolveHomeRedirect = ...

// /fr/xxx ที่ fr ไม่รองรับ  →  rewrite ไป 404
export const setPathnameRequestHeader = ...
```

ทำไมไม่ให้ next-intl redirect `/fr` ไป `/th` เอง?  
เพราะ SEO: Google จะสับสนถ้า slug มั่วถูกเด้งเป็นหน้าแรก

### `theme.proxy.ts`

อ่าน cookie `theme` (`light` / `dark`)  
ใส่ request header `x-theme`  
ยังไม่แตะ DOM — DOM ทำทีหลังในสคริปต์ของ `layout.tsx` และ Zustand

### `routing-guard.proxy.ts`

สมุดรายชื่อ path (ตัด locale แล้ว) เช่น `/about-us` → `"Y"` | `"N"` | `"D"`

- `Y` = เปิด
- `N` / `D` = rewrite ไป 404 (ไซต์นี้ไม่มี login ดู draft)

path ที่ไม่มีในสมุด **default เป็น Y**  
ดังนั้นการมีรายการในสมุดไม่ได้แปลว่ามีหน้าแล้ว — ถ้าไม่มี `page.tsx` ก็ 404 จาก Next ตามปกติ

---



## 7. `src/i18n/` — ภาษาใน URL



### `routing.ts`

สัญญาเรื่อง URL:

```ts
defineRouting({
  locales: ["th", "en"],      // จาก enum LANGUAGE
  defaultLocale: "th",
  localePrefix: "always",     // ห้ามมี /about-us โดยไม่มี /th
  alternateLinks: false,      // ไม่ใส่ Link header อัตโนมัติ
})
```

`alternateLinks: false` เพราะ next-intl จะโฆษณา hreflang จากลิสต์ `locales` ซึ่งกว้างกว่าที่ DB เปิดจริง  
hreflang จริงสร้างใน `lib/seo/active-locales.ts` จากตารางภาษา

### `request.ts`

ถูกเรียกทุก SSR โดยปลั๊กอินใน `next.config.ts`

1. อ่าน locale จาก middleware
2. ถ้าไม่มี/ผิด → `th`
3. `getMessages(locale)` จาก `fetch-translations.ts`
4. ถ้าคีย์แปลหาย: โชว์ชื่อคีย์ (`Home`) ไม่เว้นว่าง



### `fetch-translations.ts`

ดึงแคตตาล็อกแปลจาก backend แล้ว `cache()` ของ React กันยิงซ้ำใน request เดียวกัน

ตอนนี้ถ้า API พัง **throw** ไม่คืน `{}`  
เหตุผลในคอมเมนต์: กัน ISR จำ HTML ว่างแล้ว Google index  
ผลข้างเคียงตอน PIP ยังไม่มี tenant ครบ: **ทั้งหน้า 500** ไม่ใช่หน้าว่าง

ต่อไปนี้คือโซ่ที่ junior ต้องจำ:

```
URL /th
  → proxy ใส่ x-next-intl-locale
  → i18n/request.ts โหลดข้อความ
  → [locale]/layout.tsx ส่งเข้า NextIntlClientProvider
  → ใน component ใช้ getTranslations() / useTranslations()
```

ตัวอย่างใน navbar:

```ts
const t = await getTranslations()
const labels = {
  signIn: t("navbar.signIn"),
  // ถ้า DB ไม่มีคีย์นี้ จะได้สตริง "navbar.signIn"
}
```

---



## 8. `src/app/` — หน้าและโครง HTML

App Router ใช้ **ชื่อโฟลเดอร์ = URL**  
โฟลเดอร์ที่ขึ้นต้นด้วย `_` หรืออยู่ใน `(ชื่อ)` แบบ route group **ไม่โผล่ใน URL**

โครงตอนนี้:

```
src/app/
├── layout.tsx                 ← html/body ทั้งไซต์
├── app-provider.tsx           ← client providers
├── globals.css
├── loading.tsx                ← ตอนโหลดหน้า
├── not-found.tsx              ← 404 ทั้งไซต์
├── favicon.ico
├── robots.ts                  ← /robots.txt
├── sitemap.xml/route.ts       ← /sitemap.xml
├── sitemap.csv/route.ts       ← /sitemap.csv ดาวน์โหลด
└── [locale]/
    ├── layout.tsx             ← ล็อก locale + ข้อความแปล
    └── (public)/              ← วงเล็บ = กลุ่ม ไม่ใช่ URL
        ├── layout.tsx         ← navbar + footer
        └── page.tsx           ← หน้าแรก = /th หรือ /en
```

ไม่มี `(admin)` ใน PIP (GOC เคยมี console)

### `layout.tsx` (root)

ต่างจากเทมเพลต Geist:

- ฟอนต์ **Roboto + Noto Sans Thai** เป็น CSS variables `--font-roboto` `--font-thai`
- `getLocale()` จาก next-intl เพื่อ `lang` บน `<html>`
- สคริปต์จิ๋วใน `<head>` ใส่ class `light`/`dark` **ก่อน** React hydrate กันหน้ากระพริบ (FOUC)
- JsonLd องค์กร / เว็บไซต์ / บริการ สำหรับ Google
- `AppProvider` + `Toaster`

`export const metadata = createRootMetadata()` ดึงชื่อเว็บจาก `lib/seo/metadata.ts`

### `app-provider.tsx`

`"use client"` เพราะ React Query และ theme sync ต้องอยู่ฝั่งเบราว์เซอร์

```tsx
<QueryProvider>
  <ThemeSyncProvider>
    {children}
  </ThemeSyncProvider>
</QueryProvider>
```

Root layout เป็น Server Component เลยแยกไฟล์นี้ไว้ ห้ามใส่ `"use client"` ทั้ง root layout โดยไม่จำเป็น

### `[locale]/layout.tsx`

```ts
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
export const dynamicParams = false
```

แปลว่า Next สร้าง `/th` กับ `/en` เป็นพิเศษ  
เซ็กเมนต์อื่นในตำแหน่ง locale เช่น `/xx` **ไม่สร้างหน้า** → 404

จากนั้น `setRequestLocale(locale)` + `getMessages()` + `NextIntlClientProvider`

### `(public)/layout.tsx`

`(public)` ไม่ปรากฏใน URL  
หน้าที่อยู่ในนี้ได้โครงเดียวกัน: Navbar บน, เนื้อหา, Footer ล่าง

ดึงภาษาจาก `languageAppServiceServer.getLanguagesCached()`  
ถ้า API พัง คืน `[]` — ตัวสลับภาษาว่าง แต่หน้ายังเปิดได้

`robots: PUBLIC_INDEX_ROBOTS` = ให้ Google index ได้

### `(public)/page.tsx`

หน้าแรกปัจจุบันยังเป็น UI ของ create-next-app (โลโก้ Next, ปุ่ม Deploy)  
ยังไม่ดึง CMS  
อยู่ใน `(public)` แล้ว ดังนั้นมี navbar/footer คร่อมอยู่

### `loading.tsx`

UI ตอน Next กำลังโหลดหน้า (React Suspense)  
ใช้โลโก้ + จุดกระพริบจาก keyframe `loading-wave` ใน `custom-animations.css`

### `not-found.tsx`

หน้า 404 ที่ออกแบบเอง (เลขใหญ่เด้ง, ปุ่มกลับบ้าน)  
เรียก `LinkCustom` ไป `/${language}`

เลขพื้นหลังใช้ `opacity-10` สี `--border-default` บนพื้น `--surface-page` จึงจางมาก — อนิเมชันทำงานอยู่แต่มองแทบไม่เห็น

### `robots.ts`

Next จะเสิร์ฟที่ `/robots.txt`

- Preview ของ Vercel: ห้ามครอว์ลทั้งไซต์
- อื่น: อนุญาต `/` ห้าม `/api/` ชี้ sitemap



### `sitemap.xml/route.ts` และ `sitemap.csv/route.ts`

ไม่ใช้ `app/sitemap.ts` แบบช่วย ๆ ของ Next  
เขียน `route.ts` เองเพื่อควบคุม XML

- XML สำหรับ Google
- CSV สำหรับคนโหลดไปดูใน Excel

ข้อมูลราย URL มาจาก `lib/seo/sitemap-entries.ts` (หน้า static + บล็อก + author ถ้า backend มี)

ไฟล์ XML ยังมี namespace `gocprime.net` ค้างจาก GOC — ตอนเรียนใหรู้ว่าเป็น XML attribute ไม่กระทบการเรนเดอร์หน้า

`revalidate = 3600` = สร้างใหม่ได้อย่างน้อยทุกชั่วโมง

---



## 9. `src/components/` — ชิ้น UI

กติกาชื่อไฟล์:

- `*.component.tsx` ชิ้นใช้ซ้ำ
- `*.part.tsx` ชิ้นย่อยของชิ้นใหญ่
- โฟลเดอร์ `layout/` โครงไซต์
- โฟลเดอร์ `toasts/` แจ้งเตือน
- โฟลเดอร์ `parts/` ชิ้นประกอบของฟอร์ม/ตาราง



### ที่หน้า PIP ใช้จริงตอนนี้


| ไฟล์                                       | ใครเรียก                                       |
| ------------------------------------------ | ---------------------------------------------- |
| `layout/navbar.tsx` + `navbar-component/*` | `(public)/layout`                              |
| `layout/footer.tsx`                        | `(public)/layout`                              |
| `layout/logo.tsx`                          | navbar, loading                                |
| `link-custom.component.tsx`                | navbar, footer, 404                            |
| `fill-image.component.tsx`                 | logo, footer                                   |
| `json-ld.component.tsx`                    | root layout                                    |
| `toasts/*`                                 | `lib/api/query-client.ts` เรียก `successToast` |


`link-custom` สำคัญเพราะลิงก์ในแอปต้องใส่ locale (`/th/about-us`) ให้ถูก  
อย่าใช้ `<a href="/about-us">` เปล่า ๆ ถ้าต้องการอยู่ใต้ locale

### แพทเทิร์นปุ่ม (design system)

ไม่ใส่ Tailwind ยาว ๆ ซ้ำในทุกหน้า  
แยกตาราง class ไว้ที่ `shared/ui/classes/button.classes.ts` แล้วประกอบใน `button-custom.component.tsx`

```ts
// shared = “ปุ่มขนาด md สีอะไร”
BUTTON_SIZE_CLASSNAME.md
BUTTON_COLOR_VARIANT_CLASSNAME.primary.solid

// component = เอาตารางมาประกอบ + รับ className จากผู้เรียกท้ายสุด
```

`cn()` จาก `lib/tw-merge` รวม class แล้วตัดของที่ชนกัน (เช่น `px-2` กับ `px-4` เหลืออันหลัง)

### ชิ้นที่ copy มาแต่หน้า PIP ยังไม่ใช้

เช่น ฟอร์มทั้งชุด (`input-custom`, `table-custom`, `pagination-*`)  
เป็น kit กลาง ไม่ใช่หน้า GOC โดยตรง — เก็บไว้ได้ถ้าจะมีฟอร์มติดต่อ

ชิ้นที่ผูกหน้า GOC โดยเฉพาะ (FAQ accordion, review stars, ฯลฯ) อาจถูกลบไปแล้วหรือยังค้าง — ถ้าเจอไฟล์ที่ไม่มี import จาก `app/` แปลว่ายังไม่มีคนใช้

### `navbar-actions.tsx`

ปุ่มขวาสุดของ navbar  
ตอนนี้ยังชี้ URL ของ GOC (`my.gocprime.com`) และ `/register`  
เป็นจุดที่ต้องเปลี่ยนเมื่อ PIP มีลิงก์จริง

---



## 10. `src/lib/` — helper ไม่มี state

อ่าน `src/lib/README.md` เป็นกติกาทีม:

- **ไม่มี** โฟลเดอร์ชื่อ `utils/` เพราะจะกลายเป็นถังขยะ
- จัดตาม **เรื่องที่ไฟล์รู้**


| โฟลเดอร์  | รู้เรื่อง                                   |
| --------- | ------------------------------------------- |
| `api/`    | header, origin, รูป error, QueryClient      |
| `cms/`    | shape เนื้อหา CMS                           |
| `editor/` | HTML จาก Tiptap                             |
| `format/` | ตัวเลข/เวลา → ข้อความคนอ่าน                 |
| `media/`  | storage key → URL รูป                       |
| `seo/`    | metadata, sitemap, json-ld, 404 vs redirect |
| `ui/`     | helper ที่เกี่ยวกับ React เล็ก ๆ            |


`tw-merge.ts` อยู่ที่ราก `lib/` เพราะถูก import ทั่วโปรเจกต์

### ตัวอย่างที่เจอบ่อย

`cn()`

```ts
import cn from "@/lib/tw-merge"
cn("px-2 text-sm", isActive && "text-(--color-primary)")
```

`image-loader.ts` คู่กับ `next.config.ts`

ถ้า `src` ขึ้นต้น `/api/app/image/` จะเติม `w`, `q`, `fmt=webp` ให้ backend ย่อรูป  
รูปอื่นส่ง query `w` อย่างเดียว

`metadata.ts`

- `getSiteUrl()` อ่าน `NEXT_PUBLIC_APP_URL` ถ้าไม่มีใน dev ใช้ `http://localhost:3000`  
production ถ้าไม่มี env จะ **throw** กันเผลอปล่อย URL localhost ไป sitemap
- `buildPageMetadata({ locale, pathname, pageCode })` ดึงแถว SEO จาก backend

`redirect-or-not-found.ts`

หน้าไดนามิก (เช่นบทความ) ถ้าไม่เจอข้อมูล: ถามตาราง `url_redirects` ก่อน ถ้ามีก็ redirect ถ้าไม่มีค่อย `notFound()`  
ทำในหน้า ไม่ทำใน proxy เพราะ Data Cache เข้าถึงโค้ด middleware ไม่ได้

`trusted-source.ts`

ขอ OIDC จาก Vercel ใส่ header  
local ไม่มี token → เงียบ ๆ ไม่ใส่ — พัฒนาเครื่องตัวเองได้

`dev-domain.ts`

ตอน dev ใส่รหัสโดเมนชั่วคราวจาก `NEXT_PUBLIC_DEV_DOMAIN_CODE` ให้ backend รู้ว่าเป็น tenant ไหน

---



## 11. `src/services/` — คุยกับ backend

สองชั้น ห้ามสลับหน้าที่

```
src/services/
├── generated-cli/api-app-service/    ← เครื่องสร้างจาก Swagger  ห้ามแก้มือ
└── modules/app-service/              ← คนเขียน: ห่อให้หน้าเรียกง่าย
      ├── api-configuration.ts
      ├── *.app-service.ts            ← ฟังก์ชัน + query key
      ├── hooks/                      ← React Query สำหรับคลิก/ฟอร์ม
      └── server/                     ← cache() + tag สำหรับ SSR
```



### ทำไมห้ามแก้ `generated-cli`

ไฟล์พวก `LanguagesApi.ts`, `models/*.ts` มาจาก `./generate-cli.sh` ใน repo `api-app-service`  
แก้มือแล้วรัน generate ใหม่จะทับหาย  
ถ้า DTO ผิด แก้ที่ Nest (decorator Swagger) แล้ว generate ใหม่

### `api-configuration.ts`

จุดรวมว่า SDK ยิงไปที่ไหน


| รันอยู่ที่   | `basePath`                                        |
| ------------ | ------------------------------------------------- |
| Server (SSR) | `APP_SERVICE_ORIGIN` เช่น `http://localhost:8091` |
| Browser      | `""` → ยิง `/api/app/...` โดเมนเดียวกับเว็บ       |


ทุก request ใส่ header `x-domain-name` ให้ backend แมปว่าเป็นเว็บไหน (tenant)

SSR **ต้องมี** `NEXT_PUBLIC_APP_URL` ไม่งั้น throw

### ตัวกลางที่หน้า PIP ใช้จริงวันนี้

- `language` + `server` — layout, proxy, hreflang
- `translate` + `server` — i18n
- `page-seo` + `server` — metadata
- `url-redirect` + `server` — 404 vs redirect
- `blog-*` / `author` + `server` — sitemap ยังเรียกอยู่

ตัวกลางหน้า GOC ที่ไม่มีหน้าใน PIP (ลบได้ถ้าทีมโอเค):  
`register-trading`, `point-mall`, `faqs`, `contact`, `countries`, `parameter`, `translate-content`, `system` (health)

อย่าลบไฟล์ใน `generated-cli` แม้ API นั้น PIP ยังไม่ใช้ — generate ทั้งก้อนอยู่แล้ว

### แพทเทิร์นเรียกข้อมูล (จำสูตรนี้)

**SSR / หน้าสาธารณะ**

```ts
const languages = await languageAppServiceServer.getLanguagesCached()
```

มี `"server-only"` + `cache()` + `revalidate` tag

**คลิกในเบราว์เซอร์ (ฟอร์ม)**

```ts
const { mutate } = useContactAppService()
```

React Query จัดการ loading/error

ห้าม:

```ts
await fetch("http://localhost:8091/api/app/...")  // ❌
```

---



## 12. `src/shared/` — ค่าคงที่และตาราง class

```
shared/
├── constants/     ค่าที่ไม่เปลี่ยนตอนรัน (หรือเปลี่ยนทั้งแอปทีเดียว)
├── types/         type ร่วม (ขนาดปุ่ม, pagination)
└── ui/classes/    ตาราง Tailwind ของแต่ละชิ้น
```



### `constants/common.constants.ts`

แหล่งความจริงของ locale:

```ts
enum LANGUAGE {
  TH = "th",
  EN = "en",
}
```

เพิ่มภาษาที่ URL ได้ ต้องเพิ่มที่นี่ก่อน แล้วตารางภาษาใน DB ค่อยเปิดใช้  
`i18n/routing.ts` อ่านจาก enum นี้

มี `THEME`, `HTTP_STATUS` ฯลฯ ให้ทั้งโปรเจกต์ใช้ตัวเลขเดียวกัน (เช่น 301)

### `constants/nav-links.constants.ts`

เมนู navbar  
ตอนนี้มี Home, About Us, Our Businesses (ลูก), Contact Us  
**การมีในเมนู ≠ มีหน้า** ถ้ายังไม่มี `page.tsx` กดแล้ว 404

### `constants/seo.constants.ts`

ชื่อองค์กร, โลโก้ path, รายการ path ที่ใส่ sitemap  
ต้อง sync กับหน้าจริงและ `page_seo.page_code` ใน DB

### `ui/classes/*.classes.ts`

เช่น `button.classes.ts` map `size` / `color` / `variant` → class string  
component ห้าม copy ชุด class ยาวไปทั่ว

---



## 13. `src/providers/` และ `src/stores/`



### ทำไมแยกสองโฟลเดอร์

- **Provider** = ห่อต้นไม้ React (ต้องอยู่เหนือ children)
- **Store** = กล่องข้อมูลที่ component ไหนก็อ่านได้โดยไม่ต้องส่ง props ลงลึก



### `providers/query.provider.tsx`

สร้าง `QueryClient` ครั้งเดียวต่อแท็บ (`useState(() => getQueryClient())`)  
dev เปิด React Query Devtools

### `providers/theme-sync.provider.tsx`

ตอน mount อ่าน `localStorage` แล้วเรียก `useThemeStore.changeTheme`  
class บน `<html>` ถูกสคริปต์ใน root layout ใส่แล้ว — ที่นี่แค่ให้ Zustand ตรงกับที่บันทึก

### `stores/theme.store.ts`

Zustand:

```ts
changeTheme(theme) {
  localStorage.setItem("preferred-theme", t)
  document.cookie = `theme=${t}; path=/; max-age=31536000`
  document.documentElement.classList.add(t)  // "light" หรือ "dark"
}
```

รอบถัดไปที่เปิดเว็บ: สคริปต์ใน layout อ่านค่านี้ทันที ไม่รอ React

### `stores/loading.store.ts`

ธง `isLoading` กลาง ๆ สำหรับ overlay ในอนาคต  
หน้า PIP ยังไม่ผูกมาก

### `providers/hooks/count-up.hook.ts`

hook นับเลขวิ่งขึ้น (หน้าแรก GOC เคยใช้)  
PIP อาจยังไม่เรียก

---



## 14. `src/styles/` และ `globals.css`



### `app/globals.css` คือทางเข้าเดียว

```css
@import "tailwindcss";
@import "@radix-ui/themes/styles.css";
@variant dark (&:is(.dark *));
@import "../styles/theme-tokens.css";
@import "../styles/base-foundation.css";
@import "../styles/base-transitions.css";
@import "../styles/custom-animations.css";
@import "../styles/component.navbar.css";
@import "../styles/component.text-editor.css";
@import "../styles/component.blog-article.css";
```

ต่างจาก create-next-app ที่กำหนด `--background` ในไฟล์เดียว  
ที่นี่สีอยู่ที่ **token** แล้ว component เขียน `bg-(--surface-page)` (Tailwind v4 arbitrary property)

`@variant dark (&:is(.dark *))` = โหมดมืดตาม **class** `.dark` ไม่ตาม OS โดยตรง  
เลยสลับธีมในเว็บได้โดยไม่ต้องเปลี่ยนเครื่อง

### ไฟล์ใน `styles/`


| ไฟล์                                             | ทำอะไร                                                                        |
| ------------------------------------------------ | ----------------------------------------------------------------------------- |
| `theme-tokens.css`                               | สเกลสี, `--surface-*`, `--text-*`, `--color-primary` ทั้ง light และ `.dark`   |
| `base-foundation.css`                            | reset/ฐานเล็กน้อย                                                             |
| `base-transitions.css`                           | transition กลาง                                                               |
| `custom-animations.css`                          | `@keyframes` เช่น `blob-pulse-soft`, `loading-wave`, `bounce` ใช้คู่ Tailwind |
| `component.navbar.css`                           | `--navbar-height`, underline เมนู, ปุ่ม CTA ที่ต้องใช้ CSS จริง               |
| `component.text-editor.css` / `blog-article.css` | บทความ/editor — PIP ยังไม่มีหน้าบล็อกก็ import ไว้แล้ว                        |


ทำไม navbar บางส่วนไม่ใช้แค่ Tailwind?  
ทีมมีข้อยกเว้น: `before`/`after` ซับซ้อน, `color-mix` กับ token, ตัวแปร JS บนปุ่ม CTA

---



## 15. ตัวแปรแวดล้อม

มีสองไฟล์คนละบทบาท


| ไฟล์           | อยู่ใน git? | ใส่ secret?                  |
| -------------- | ----------- | ---------------------------- |
| `.env.example` | ควรอยู่     | ไม่ แค่ชื่อตัวแปร + คำอธิบาย |
| `.env`         | ไม่         | ค่าจริงของเครื่องคุณ         |


ชื่อที่โค้ดอ่าน (จาก `.env.example` และโค้ด):


| ชื่อ                                                               | ใช้ทำอะไร                                                                              |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| `APP_SERVICE_ORIGIN`                                               | SSR ยิง backend ที่ไหน                                                                 |
| `NEXT_PUBLIC_APP_URL`                                              | URL สาธารณะของเว็บ (canonical, `x-domain-name`) มี `NEXT_PUBLIC_` = เบราว์เซอร์เห็นได้ |
| `NEXT_PUBLIC_DEV_DOMAIN_CODE`                                      | รหัส tenant ตอน dev เท่านั้น                                                           |
| `REVALIDATE_SECRET`                                                | กันคนแปลกหน้าเรียก bust cache                                                          |
| `NEXT_CONTENT_REVALIDATE_SECONDS` / `NEXT_BLOG_REVALIDATE_SECONDS` | อายุ cache ฝั่ง Next                                                                   |
| `NEXT_BROWSER_CACHE_SECONDS` / `NEXT_BROWSER_STALE_SECONDS`        | Cache-Control ที่ proxy ใส่                                                            |
| `NEXT_PUBLIC_GA_ID` ฯลฯ                                            | analytics ถ้าใส่                                                                       |


อย่า commit `.env`  
อย่า paste ค่าใน PR หรือแชท

ถ้า `NEXT_PUBLIC_DEV_DOMAIN_CODE` ยังเป็นของเว็บอื่น ข้อมูลภาษา/แปลที่ดึงมาจะเป็น tenant นั้น — หน้าอาจขึ้นแต่ข้อความไม่ใช่ของ PIP

---



## 16. กฎสำคัญเวลาแก้โค้ด

1. **อย่าแก้** `src/services/generated-cli/`**
2. เพิ่ม endpoint ที่ backend แล้วต้อง generate client ก่อน แล้วค่อยเขียน `*.app-service.ts`
3. หน้าใหม่ใส่ใต้ `src/app/[locale]/(public)/ชื่อหน้า/page.tsx`
  URL จะเป็น `/th/ชื่อหน้า`
4. ลิงก์ในไซต์ใช้ `LinkCustom` หรืออย่างน้อยต้องมี locale
5. สีใช้ token `bg-(--...)` ไม่แอบ hex กระจาย ยกเว้นที่ styles มีเหตุผล
6. อย่าสร้าง `middleware.ts` ใหม่มาแข่งกับ `proxy.ts`
7. เพิ่มภาษาใน URL = เพิ่ม `LANGUAGE` enum ก่อน แล้วเปิดใน DB

---



## 17. สถานะปัจจุบันของ PIP (ยังไม่เสร็จ)

โครงชั้นโครงสร้างพร้อมแล้ว หน้าคอนเทนต์ยังไม่ครบ

ยังขาด / ยังเป็นของเก่า (ตอนเขียนเอกสารนี้):

- หน้าแรกยัง UI Next starter
- เมนูชี้ `/about-us` `/contact-us` `/our-businesses/*` แต่ยังไม่มี `page.tsx`
- ไม่มีไฟล์โลโก้จริงใน `public/` (`logo.tsx` ยังชี้ `/next.svg`)
- ไม่มี `og-default.png` / `logo.png` ตาม SEO constants
- ไม่มี `src/app/api/revalidate/route.ts`
- `navbar-actions` ยังมี URL GOC
- `sitemap.xml` ยังมี XML namespace ชื่อ goc
- wrapper `register-trading` / `point-mall` ฯลฯ ยังอยู่ใน `services/modules` โดยหน้าไม่เรียก
- `fetch-translations` throw เมื่อ API พัง

สิ่งที่ทำแล้วเทียบ create-next-app:

- `@/` ชี้ `src/`
- next-intl + `proxy.ts`
- หน้าแรกอยู่ `/th`
- rewrite `/api/app`
- design tokens + navbar/footer
- generated client + language/translate/page-seo

---



## แผนภาพความสัมพันธ์ (ย่อ)

```
next.config.ts ──┬── withNextIntl ──► i18n/request.ts ──► fetch-translations
                 ├── rewrites /api/app ──► APP_SERVICE_ORIGIN
                 └── images.loader ──► lib/media/image-loader.ts

proxy.ts ──► proxies/* ──► language table (ผ่าน languageAppServiceServer)
       └──► /api/app ──► trusted-source header

app/layout.tsx ──► AppProvider ──► providers + stores
               └──► globals.css ──► styles/*

app/[locale]/layout.tsx ──► NextIntlClientProvider
app/[locale]/(public)/layout.tsx ──► Navbar/Footer ──► components + NAV_LINKS

หน้า / SEO ──► lib/seo ──► page-seo / blog server wrappers
ฟอร์ม (อนาคต) ──► hooks ──► *.app-service.ts ──► generated-cli
```

ถ้าจำได้แค่ประโยคเดียว:

> **proxy ตัดสินก่อนเรนเดอร์, layout ห่อภาษาและโครง, services เป็นทางเดียวไป backend, lib/shared เป็นของใช้ซ้ำที่ไม่มีหน้าเป็นของตัวเอง**

