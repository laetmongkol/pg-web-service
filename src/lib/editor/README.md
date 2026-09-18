# lib/editor

Tiptap / rich-text. HTML ที่ editor ผลิต และ HTML ที่หน้าเว็บต้อง render กลับ

| ไฟล์ | หน้าที่ |
|---|---|
| `editor-html.ts` | sanitize + normalize HTML ระหว่าง editor กับหน้าแสดงผล |
| `color.ts` | normalize ค่าสีเป็น hex 6 หลัก รับ hex / rgb() / `var(--token)` (legacy Tiptap mark) |

**เข้าที่นี่เมื่อ** logic รู้จัก Tiptap หรือรู้จักรูปแบบ HTML ที่ editor เก็บลง DB

**ไม่เข้าที่นี่** — Tiptap extension อยู่ `src/shared/ui/extensions/tiptap/`
