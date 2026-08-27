# lib/ui

helper ชั้น React — ตัวที่ **return React element หรือรับ component prop** จึงอยู่ที่นี่ไม่ใช่ `format/`

| ไฟล์ | หน้าที่ |
|---|---|
| `form-field-state.ts` | รวม `isDisabled` / `isReadOnly` จาก prop กับ field context -> `{ isDisabled, isReadOnly, isInactive }` |
| `text-utils.ts` | `splitByLineBreak` — `\n` ใน string จาก CMS -> `<span>` ที่ break จริง |

**เข้าที่นี่เมื่อ** logic ใช้ได้หลาย component แต่ยังผูกกับ React (element, prop, context)

**ไม่เข้าที่นี่** — component จริงอยู่ `src/components/`, class string ของ design system อยู่ `src/shared/ui/classes/`
