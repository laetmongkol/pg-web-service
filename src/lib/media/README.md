# lib/media

รูปและวิดีโอ: จาก storage key ที่ backend เก็บ -> URL ที่ browser โหลดได้

| ไฟล์ | หน้าที่ |
|---|---|
| `image-loader.ts` | custom loader ของ `next/image`. **`next.config.ts` ชี้มาที่ไฟล์นี้ตรงๆ — ย้ายแล้วต้องแก้ `loaderFile` ด้วย** |
| `image-url.ts` | สร้าง URL รูปพร้อม transform param (w / q / fmt) |
| `media-display-url.ts` | media record (s3Url หรือ storageKey) -> URL same-origin `/api/app/image/...` |

**เข้าที่นี่เมื่อ** ต้องตอบว่า "ไฟล์นี้โหลดจาก URL ไหน" หรือ "ไฟล์นี้เป็น video ไหม"

ทุก URL ออกเป็น same-origin `/api/app/image/` เสมอ ไม่ยิง S3 ตรง — CDN cache และ format negotiation อยู่ที่ backend
