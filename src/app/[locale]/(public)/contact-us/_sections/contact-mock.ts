/**
 * Mockup copy for the contact page until its PIP Evolution CMS rows exist. Sections read
 * `data?.<key>?.value || CONTACT_MOCK.<section>.<key>`, so seeding translate_contents replaces these.
 */
export const CONTACT_MOCK = {
    hero: {
        eyebrow: "ติดต่อ PIP Evolution",
        titleLines: ["มาสร้างอนาคตของเทคโนโลยีด้วยกัน"],
        description:
            "ไม่ว่าคุณจะมีไอเดียสำหรับโปรเจกต์ใหม่ ต้องการพัฒนาระบบ หรือต้องการคำปรึกษาด้านเทคโนโลยี\nทีม PIP Evolution พร้อมพูดคุยและค้นหาโซลูชันที่เหมาะกับคุณ",
    },
    channels: [
        { icon: "phone", label: "เบอร์โทร", title: "โทรหาเรา", value: "Office: 062 149 2446", href: "tel:0621492446" },
        {
            icon: "mail",
            label: "ติดต่อทางอีเมล",
            title: "ส่งอีเมลถึงเรา",
            value: "General: pipoffice1001@gmail.com",
            href: "mailto:pipoffice1001@gmail.com",
        },
        {
            icon: "pin",
            label: "สำนักงานใหญ่",
            title: "สำนักงานของเรา",
            value: "72/1 ถนนรามอินทรา แขวงอนุสาวรีย์ เขตบางเขน\nกรุงเทพฯ 10220",
            href: "",
        },
    ] as const,
    office: {
        title: "สำนักงานใหญ่ PIP Evolution",
        address: "72/1 ถนนรามอินทรา แขวงอนุสาวรีย์ เขตบางเขน กรุงเทพฯ 10220",
        mapQuery: "72/1 ซอยรามอินทรา 19 แขวงอนุสาวรีย์ เขตบางเขน กรุงเทพมหานคร 10220",
        hoursTitle: "ตารางเวลาทำการ",
        hours: [
            { day: "จันทร์ - ศุกร์", time: "09:00 น. - 18:00 น." },
            { day: "เสาร์", time: "10:00 น. - 15:00 น." },
            { day: "อาทิตย์", time: "ปิดทำการ" },
        ],
    },
    form: {
        title: "ส่งข้อความถึงเรา",
        description:
            "กรอกแบบฟอร์มที่ปลอดภัยด้านล่าง\nทีมวิศวกรรมและพันธมิตรผสานรวมของเราจะตอบกลับภายใน 1-2 ชั่วโมงทำการ",
        fullName: { label: "ชื่อ-นามสกุล", placeholder: "เช่น สมชาย ใจดี" },
        email: { label: "อีเมล", placeholder: "เช่น somchai@company.com" },
        phone: { label: "หมายเลขโทรศัพท์ (ไม่บังคับ)", placeholder: "เช่น +66 81 234 5678" },
        topic: { label: "หัวข้อสอบถาม", placeholder: "เลือกหัวข้อ" },
        topics: ["พัฒนา Software / ระบบ", "Digital Solution", "ระบบเทรดอัตโนมัติ (EA)", "ขอคำปรึกษา", "อื่น ๆ"],
        message: {
            label: "ข้อความ",
            placeholder: "อธิบายรายละเอียดเกี่ยวกับโปรเจกต์ ระบบซอฟต์แวร์ หรือข้อสอบถามทั่วไปของคุณ...",
        },
        submit: "ส่งข้อความ",
        submitting: "กำลังส่ง...",
        successTitle: "ส่งข้อความเรียบร้อย",
        successMessage: "ทีมงานจะติดต่อกลับโดยเร็วที่สุด",
        errorTitle: "ส่งข้อความไม่สำเร็จ",
        errorMessage: "กรุณาลองใหม่อีกครั้ง",
    },
};
