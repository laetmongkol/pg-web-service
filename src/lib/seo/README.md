# lib/seo

ทุกอย่างที่ crawler เห็นแต่ user ไม่เห็น: `<head>` metadata, structured data, sitemap, redirect

| ไฟล์ | หน้าที่ |
|---|---|
| `metadata.ts` | สร้าง Next `Metadata` (title, description, canonical, OG, hreflang) |
| `json-ld.ts` | schema.org structured data (Article, Organization, BreadcrumbList ฯลฯ) |
| `active-locales.ts` | locale ที่ทั้ง routable **และ** active ใน languages table — source เดียวของ hreflang กับ sitemap alternates |
| `sitemap-entries.ts` | ประกอบ entry ของ `sitemap.xml` |
| `redirect-or-not-found.ts` | ใช้แทน `notFound()` — เช็ค `url_redirects` ก่อน ให้ slug ที่เปลี่ยนชื่อตอบ 3xx จริงไม่ใช่ 404 |

**เข้าที่นี่เมื่อ** output ปลายทางคือ HTTP status, `<head>` tag, หรือไฟล์ที่ crawler ดึง

`active-locales.ts` กับ `redirect-or-not-found.ts` มี directive `"server-only"` — client component เรียกไม่ได้ ที่เหลือในโฟลเดอร์นี้เรียกได้ทั้งสองฝั่ง

> `redirectOrNotFound()` ต้องเรียกใน page function body **ก่อน** return JSX — Next emit redirect ได้เฉพาะตอนยังไม่ flush อะไรออกไป เรียกช้ากว่านั้นได้ meta refresh บน 200 ซึ่ง Google อ่านเป็น soft 404
