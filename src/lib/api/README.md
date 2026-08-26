# lib/api

ทุกอย่างที่เกี่ยวกับ **การคุยกับ backend** — header ที่ต้องแนบ, origin ที่ต้องยิงไป, และการแปล error ที่ตอบกลับมา

| ไฟล์ | หน้าที่ |
|---|---|
| `query-client.ts` | TanStack Query client กลาง + ค่า staleTime/gcTime ของทั้งแอป |
| `parse-api-error.ts` | แปลง error จาก generated client เป็นข้อความที่ UI แสดงได้ |
| `dev-domain.ts` | development เท่านั้น: แนบ `x-domain-code` ตอน localhost ไม่มี web_url mapping |
| `trusted-source.ts` | แนบ OIDC token ของ project (Vercel Trusted Sources) ให้ request ที่ยิงไป deployment ที่เปิด Deployment Protection |

**เข้าที่นี่เมื่อ** logic ผูกกับ request / response ของ backend — header, origin resolution, error shape

**ไม่เข้าที่นี่** — การเรียก endpoint จริงอยู่ `src/services/`, ที่นี่เก็บแค่ของที่ layer นั้นใช้ร่วมกัน
