/**
 * Mockup copy for the about page until its PIP Evolution CMS rows exist. Sections read
 * `data?.<key>?.value || ABOUT_MOCK.<section>.<key>`, so seeding translate_contents replaces these.
 */
export const ABOUT_MOCK = {
    hero: {
        eyebrow: "เกี่ยวกับ PIP Evolution",
        titleLines: ["เชื่อมธุรกิจกับเทคโนโลยี", "ให้ทุกความซับซ้อนเป็นเรื่องง่าย"],
        description:
            "PIP Evolution พัฒนา Software และ Digital Solution ที่เชื่อมเทคโนโลยีเข้ากับความต้องการของธุรกิจ เพื่อสร้างระบบที่ใช้งานได้จริง ยืดหยุ่น และพร้อมเติบโตไปกับองค์กร",
        primary: "บริการของเรา",
        primaryLink: "services",
        secondary: "ติดต่อเรา",
        secondaryLink: "contact-us",
    },
    history: {
        label: "ประวัติการเริ่มต้นของเรา",
        title: "จุดเริ่มต้นของการเดินทาง",
        description:
            "Pip Evolution ก่อตั้งขึ้นในปี พ.ศ. 2567 (ค.ศ. 2024) โดยมีทุนจดทะเบียน 3,000,000 บาท เรามีบริการให้คำปรึกษาด้านการเงินอย่างมืออาชีพ และบริการวางแผนการเงินเชิงกลยุทธ์ด้วยเครื่องมือและทีมงานที่มีความเชี่ยวชาญสูง ด้านการแลกเปลี่ยนเงินตราต่างประเทศ รวมถึงการซื้อขายสกุลเงินหลากหลายประเภท",
        stats: [
            { value: "ตั้งแต่ปี 2024", label: "ประสบการณ์" },
            { value: "99.9%", label: "เติบโต\nอย่างไม่หยุดยั้ง" },
            { value: "10,000+", label: "ลูกค้า\nที่ใช้งาน" },
            { value: "50+", label: "ทีมงาน\nผู้เชี่ยวชาญ" },
        ],
    },
    journey: {
        label: "การเดินทางของเรา",
        title: "เส้นทางการเติบโตของเรา",
        description:
            "จากจุดเริ่มต้นสู่การเป็น Technology Partner\nเราพัฒนาอย่างต่อเนื่อง ทั้งด้านเทคโนโลยี ทีมงานและความเชี่ยวชาญ\nเพื่อรองรับความต้องการของธุรกิจที่เปลี่ยนแปลงอยู่เสมอ",
        milestones: [
            {
                year: "2024",
                title: "จุดเริ่มต้น",
                description:
                    "เริ่มต้น PIP Evolution ด้วยเป้าหมาย\nในการพัฒนาเทคโนโลยีที่ช่วยแก้ปัญหา\nและเพิ่มประสิทธิภาพให้กับธุรกิจ",
            },
            {
                year: "2025",
                title: "ขยายทีมงาน",
                description:
                    "ต่อยอดความเชี่ยวชาญด้าน Software\nDevelopment และพัฒนาโซลูชัน\nที่รองรับความต้องการที่ซับซ้อนมากขึ้น",
            },
            {
                year: "2026",
                title: "ขยายขีดความสามารถ",
                description:
                    "ขยายจำนวนทีมงานผู้เชี่ยวชาญ\nเฉพาะทางพร้อมให้คำปรึกษา\nและให้บริการอย่างเต็มรูปแบบ",
            },
            {
                year: "2027",
                title: "ขยายแบรนด์ขององค์กร",
                description:
                    "มุ่งสู่การเป็นพาร์ทเนอร์ด้านเทคโนโลยีที่\nพร้อมสนับสนุนธุรกิจ ตั้งแต่แนวคิด\nการพัฒนาไปจนถึงการเติบโตในระยะยาว",
            },
        ],
    },
    missionVision: {
        items: [
            {
                icon: "mission",
                title: "พันธกิจของเรา",
                description:
                    "สร้าง Software และ Digital Solution ที่ตอบโจทย์ธุรกิจจริง\nด้วยเทคโนโลยีที่เหมาะสม การออกแบบที่เข้าใจผู้ใช้\nและมาตรฐานการพัฒนาที่เชื่อถือได้",
            },
            {
                icon: "vision",
                title: "วิสัยทัศน์ของเรา",
                description:
                    "มุ่งเป็น Technology Partner ที่ธุรกิจไว้วางใจ\nพร้อมสร้างสรรค์โซลูชันที่ช่วยให้องค์กรเติบโต ปรับตัว\nและก้าวทันโลกดิจิทัลอย่างยั่งยืน",
            },
        ] as const,
    },
    team: {
        label: "ทีมงานคุณภาพของเรา",
        title: "ผู้นำเบื้องหลังแห่งความสำเร็จ",
        description: "ทีมผู้นำที่หลากหลายของเราผสมผสานประสบการณ์การซื้อขายเชิงปริมาณกับวิศวกรรมเครือข่ายหลัก",
        members: [
            { name: "Surachai Kertbanjok ( Tum )", role: "Headquarters", initials: "", hasPhoto: true },
            { name: "Preeyawade Koman (June)", role: "Assistant", initials: "", hasPhoto: true },
            { name: "Mudmee", role: "Sale in House", initials: "MM", hasPhoto: false },
            { name: "Gun", role: "Content in House", initials: "GU", hasPhoto: false },
            { name: "Pim", role: "Developer", initials: "PM", hasPhoto: false },
        ],
    },
    trusted: {
        title: "ได้รับความไว้วางใจจากหลากหลายธุรกิจ",
        names: ["Vanguard", "Apex Trading", "Offmax Corp", "BlueBridge", "Equitable Systems", "Nexa Cloud"],
    },
    cta: {
        title1: "พร้อมสร้างสิ่งต่อไป",
        title2: "ไปด้วยกันหรือยัง?",
        description:
            "ไม่ว่าคุณกำลังมองหา Software ใหม่ ต้องการพัฒนาระบบเดิม\nหรือมีไอเดียที่อยากทำให้เกิดขึ้นจริง ทีม PIP Evolution\nพร้อมพูดคุยและค้นหาโซลูชันไปพร้อมกับคุณ",
        button: "ติดต่อเรา",
        buttonLink: "contact-us",
    },
};
