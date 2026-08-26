# src/lib

helper ที่ **ไม่มี state ของตัวเอง** และใช้ได้ข้าม feature. จัดกลุ่มตาม *เรื่องที่มันรู้*
ไม่ใช่ตามชนิดของ code — ฉะนั้นไม่มีโฟลเดอร์ชื่อ `utils/` หรือ `helpers/` ที่นี่ เพราะชื่อแบบนั้น
ไม่ได้บอกอะไรและกลายเป็นถังขยะทุกครั้ง

| โฟลเดอร์ | รู้เรื่องอะไร |
|---|---|
| [`api/`](api/README.md) | request / response ของ backend — header, origin, error shape |
| [`cms/`](cms/README.md) | shape ของ CMS content payload |
| [`editor/`](editor/README.md) | Tiptap และ HTML ที่ editor เก็บลง DB |
| [`format/`](format/README.md) | ค่าดิบ -> string ที่คนอ่านได้ (pure) |
| [`media/`](media/README.md) | storage key -> URL รูป / วิดีโอ ที่โหลดได้ |
| [`seo/`](seo/README.md) | สิ่งที่ crawler เห็น แต่ user ไม่เห็น |
| [`ui/`](ui/README.md) | helper ที่ผูกกับ React (element, prop, context) |

`tw-merge.ts` อยู่ที่ root ไม่ได้เข้าโฟลเดอร์ไหน — เป็น primitive ตัวเดียวที่แทบทุกไฟล์ใน
`src/` import ตรงๆ การซ่อนไว้ในหมวดมีแต่ทำให้ path ยาวขึ้นเปล่าๆ

## กฎเพิ่มไฟล์ใหม่

1. ตอบก่อนว่าไฟล์นี้ **รู้เรื่องอะไร** แล้วเอาชื่อโฟลเดอร์จากคำตอบนั้น
2. ตอบไม่ได้ = ยังไม่ใช่ของ `lib/` — น่าจะอยู่กับ feature ที่ใช้มันตัวเดียว
3. ตอบได้แต่ไม่ตรงโฟลเดอร์ไหนเลย = เปิดโฟลเดอร์ใหม่ + README ที่บอกขอบเขต ห้ามโยนไว้ root
4. ชื่อไฟล์ kebab-case ไม่ต้องมี suffix — `.lib.ts` เลิกใช้แล้ว
5. server-only ใส่ directive `"server-only"` บนสุด (`.server.ts` suffix ใช้เฉพาะกรณีที่ต้อง
   สื่อสารกับ bundler ว่าห้าม static import)
