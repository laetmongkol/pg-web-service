# lib/format

ค่า -> string ที่คนอ่านได้ (หรือหน่วยเวลาที่เครื่องอ่านได้). **pure function ทั้งหมด** ไม่แตะ DOM ไม่แตะ network

| ไฟล์ | หน้าที่ |
|---|---|
| `format-count-up-value.ts` | ตัวเลข animate ของ count-up (prefix / suffix / decimals / K -> M) |
| `time-calculator.ts` | day / hour / minute -> millisecond สำหรับตั้งค่า staleTime, timeout |

**เข้าที่นี่เมื่อ** input เป็นค่าดิบ output เป็น string หรือตัวเลขหน่วยอื่น และไม่ต้องรู้อะไรเกี่ยวกับ React
