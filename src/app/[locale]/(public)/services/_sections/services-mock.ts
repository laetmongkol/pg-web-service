/**
 * Mockup copy for the services page until its PIP Evolution CMS rows exist. Sections read
 * `data?.<key>?.value || SERVICES_MOCK.<section>.<key>`, so seeding translate_contents replaces these.
 */
export const SERVICES_MOCK = {
    hero: {
        eyebrow: "บริการจาก PIP Evolution",
        titleLines: ["บริการและโซลูชัน", "ที่ออกแบบเพื่อธุรกิจของคุณ"],
        description:
            "ตั้งแต่การพัฒนาซอฟต์แวร์ ระบบสำหรับองค์กร ไปจนถึง Digital Solution\nเราพร้อมออกแบบและพัฒนาเทคโนโลยีให้เหมาะกับเป้าหมายและการทำงานของธุรกิจคุณ",
        primary: "ติดต่อเรา",
        primaryLink: "contact-us",
    },
    list: {
        label: "บริการของเรา",
        title: "เราช่วยธุรกิจของคุณได้อย่างไร",
        description:
            "เราดูแลตั้งแต่การวางแนวคิด ออกแบบ พัฒนา ไปจนถึงการดูแลระบบ เพื่อให้ทุกโซลูชันพร้อมใช้งานจริงและเติบโตไปพร้อมกับธุรกิจ",
        button: "ติดต่อเรา",
        buttonLink: "contact-us",
        items: [
            "ให้บริการพัฒนาและดูแลระบบเทรดอัตโนมัติ (EA)",
            "ออกแบบโครงสร้างโปรแกรมและ Logic การเทรดเฉพาะทาง",
            "มุ่งเน้นความเสถียร การบริหารความเสี่ยง และการใช้งานจริง",
            "มีการทดสอบ ปรับแต่ง และพัฒนาระบบอย่างต่อเนื่อง",
            "ให้คำแนะนำและบริการหลังการใช้งานอย่างเป็นระบบ",
        ],
    },
    whyChoose: {
        title1: "ทำไมลูกค้า",
        title2: "ถึงเลือกเรา",
        description:
            "เพราะเราไม่ได้เริ่มจากเทคโนโลยี แต่เริ่มจากการเข้าใจธุรกิจ\nเพื่อออกแบบโซลูชันที่เหมาะกับเป้าหมาย งบประมาณ\nและการใช้งานจริง",
        stats: [
            { value: "50+", label: "โปรเจกต์ที่ส่งมอบ" },
            { value: "99%", label: "ความพึงพอใจของลูกค้า" },
            { value: "24/7", label: "การดูแลและให้คำปรึกษา" },
        ],
    },
    capabilities: {
        label: "เราให้บริการลูกค้า",
        title1: "Everything you need.",
        title2: "We can do.",
        description:
            "มากกว่าการพัฒนาซอฟต์แวร์ เราพร้อมสนับสนุนทุกองค์ประกอบด้านเทคโนโลยีที่ช่วยให้ธุรกิจของคุณทำงานได้อย่างเต็มประสิทธิภาพ",
        items: [
            "Cloud Migration",
            "AI Integration",
            "Security Audit",
            "Data Pipeline",
            "DevOps",
            "API Development",
            "Technical Support",
            "24/7 Support",
        ],
    },
    cta: {
        title1: "มีโปรเจกต์ในใจ?",
        title2: "มาสร้างให้เกิดขึ้นจริงกัน",
        description: "บอกเราว่าธุรกิจของคุณต้องการอะไร ทีม PIP Evolution พร้อมช่วยวางแผน\nออกแบบ และพัฒนาโซลูชันที่เหมาะกับคุณ",
        button: "ติดต่อเรา",
        buttonLink: "contact-us",
    },
};
