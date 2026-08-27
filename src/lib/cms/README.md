# lib/cms

อ่านข้อมูลจาก CMS content payload. เป็น **ด่านเดียว** ที่รู้ shape ของ `TranslateContentResponseDto`

| ไฟล์ | หน้าที่ |
|---|---|
| `content-attributes.ts` | ดึง `attributes` JSON ออกจาก content record แบบ type-safe + resolve URL รูปข้างใน |

**เข้าที่นี่เมื่อ** ต้องแปล CMS key ใดๆ เป็นค่าที่ component ใช้ได้ — เขียน reader ตัวใหม่ที่นี่ อย่า parse `attributes` เองใน component
