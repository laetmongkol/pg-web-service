import {
    HEADING_GRADIENT_DARK_CLASSNAME,
    HEADING_GRADIENT_LIGHT_CLASSNAME,
    HOME_LIGHT_SURFACE_CLASSNAME,
    PIP_MOCK_IMAGE,
} from "../_shared/styles";

/**
 * Mockup copy + images for the homepage sections until their CMS rows exist.
 * Each section reads `data?.<key>?.value || HOME_MOCK.<section>.<key>`, so seeding
 * translate_contents replaces these without a code change.
 */

export const HOME_MOCK_IMAGE = PIP_MOCK_IMAGE;

const PROJECT_DESCRIPTION =
    "ให้บริการโซลูชันเทคโนโลยีที่ครบวงจร\nด้วยทีมผู้เชี่ยวชาญที่มีประสบการณ์มากกว่า 10 ปี\nพร้อมสนับสนุนธุรกิจของคุณให้เติบโตอย่างยั่งยืน";

export const HOME_MOCK = {
    hero: {
        title1: "เราสร้างเทคโนโลยี",
        title2: "ให้ธุรกิจไปได้ไกลกว่าเดิม",
        description:
            "PIP Evolution พัฒนา Software และ Digital Solution\nที่ออกแบบให้เหมาะกับธุรกิจ ตั้งแต่แนวคิด การพัฒนา\nไปจนถึงการใช้งานจริง",
        ctaPrimary: "ติดต่อเรา",
        ctaPrimaryLink: "contact-us",
        ctaSecondary: "เรียนรู้เกี่ยวกับเรา",
        ctaSecondaryLink: "about-us",
    },
    partners: {
        title1: "พาร์ทเนอร์ที่พร้อม",
        title2: "เติบโตไปพร้อมกับคุณ",
        description:
            "เราเชื่อในการทำงานร่วมกันระยะยาว\nเพื่อสร้างโซลูชันที่ตอบโจทย์และสร้างคุณค่าให้กับธุรกิจอย่างแท้จริง",
        rows: [
            ["Logoipsum", "offmax", "offmax", "offmax", "logoipsum", "logoipsum", "Logoipsum"],
            ["Logoipsum", "offmax", "offmax", "LOGO IPSUM", "logoipsum", "Logoipsum", "offmax"],
        ],
    },
    about: {
        eyebrow: "ABOUT PIP EVOLUTION",
        title: "ทำความรู้จัก PIP Evolution",
        description:
            "PIP Evolution บริการให้คำปรึกษาด้านการเงินอย่างมืออาชีพ\nและบริการวางแผนการเงินเชิงกลยุทธ์ด้วยเครื่องมือและทีมงานที่มีความเชี่ยวชาญสูง",
        button: "เกี่ยวกับเรา",
        buttonLink: "about-us",
        stats: [
            { value: "3", label: "ประสบการณ์กว่า 3 ปี\nในอุตสาหกรรม" },
            { value: "50+", label: "ทีมงานผู้เชี่ยวชาญ" },
            { value: "ครบวงจร", label: "บริการและให้คำ\nปรึกษา" },
        ],
        mindsetTitle: "วิธีคิดของเรา",
        mindsetDescription: "ให้บริการโซลูชันเทคโนโลยีครบวงจร ด้วยทีมผู้เชี่ยวชาญที่มีประสบการณ์",
        mindsets: [
            { title: "เข้าใจธุรกิจ", description: "เราเห็นโอกาส\nในความซับซ้อน" },
            { title: "คิดอย่างเป็นระบบ", description: "เราสร้างโซลูชัน\nที่ยั่งยืน" },
            { title: "สร้างไปด้วยกัน", description: "เราเติบโต\nไปกับลูกค้า" },
        ],
    },
    services: {
        eyebrow: "OUR SERVICES",
        title: "บริการของเรา",
        subTitle: "ครบทุกความต้องการ เพื่อการเติบโตของธุรกิจ",
        description:
            "เรามอบโซลูชันแบบครบวงจร ตั้งแต่การพัฒนาเทคโนโลยี\nการตลาด ไปจนถึงการให้คำปรึกษาด้าน Trading และ FinTech",
        button: "ดูบริการทั้งหมด",
        buttonLink: "services",
        items: [
            "ให้บริการพัฒนาและ\nดูแลระบบเทรด\nอัตโนมัติ (EA)",
            "ออกแบบโครงสร้าง\nโปรแกรมและ Logic\nการเทรดเฉพาะทาง",
            "มุ่งเน้นความเสถียร\nการบริหารความเสี่ยง\nและการใช้งานจริง",
            "มีการทดสอบ ปรับแต่ง\nและพัฒนาระบบ\nอย่างต่อเนื่อง",
            "ให้คำแนะนำและ\nบริการหลังการใช้งาน\nอย่างเป็นระบบ",
        ],
    },
    whyUs: {
        eyebrow: "WHY PIP EVOLUTION",
        title1: "ทำไมต้อง",
        title2: "PIP EVOLUTION?",
        description:
            "เราไม่ได้เป็นเพียงผู้พัฒนาเทคโนโลยี\nแต่เราคือพันธมิตรที่พร้อมเติบโตไปกับคุณในทุกขั้นตอนของการเติบโต",
        items: [
            { title: "ความเชี่ยวชาญของทีมงาน", cardTitle: "ความเชี่ยวชาญ\nของทีมงาน" },
            { title: "ระบบพัฒนาเอง 100%โดยทีมงาน", cardTitle: "ระบบพัฒนาเอง\n100% โดยทีมงาน" },
            { title: "ความโปร่งใสในการให้บริการ", cardTitle: "ความโปร่งใส\nในการให้บริการ" },
            { title: "ดูแลลูกค้าตลอด 24 ชั่วโมง", cardTitle: "ดูแลลูกค้า\nตลอด 24 ชั่วโมง" },
        ],
    },
    portfolio: {
        title1: "ผลงานที่เรา",
        title2: "สร้างและพัฒนา",
        description:
            "ตัวอย่างโปรเจกต์และ Digital Solution ที่เราออกแบบและพัฒนา\nเพื่อช่วยให้ธุรกิจทำงานได้ง่ายและมีประสิทธิภาพมากขึ้น",
        projects: Array.from({ length: 5 }, () => ({ name: "ชื่อโปรเจกต์", description: PROJECT_DESCRIPTION })),
        cta: "ดูผลงานทั้งหมด",
        ctaLink: "services",
    },
    testimonials: {
        title1: "เสียงจาก",
        title2: "ลูกค้าของเรา",
        description: "ความไว้วางใจจากลูกค้า คือสิ่งที่ผลักดันให้เราพัฒนาและส่งมอบงานที่ดียิ่งขึ้นในทุกโปรเจกต์",
        items: [
            {
                role: "CEO, Brokerage Firm",
                quote: "“ทีมงานมีอาชีพ\nเข้าใจธุรกิจเราอย่างแท้จริง\nช่วยให้เราพัฒนาแพลตฟอร์มได้ตามเป้าหมาย และเติบโตต่อเนื่อง”",
            },
            {
                role: "Founder, FinTech Startup",
                quote: "“PIP Evolution ไม่ได้แค่ส่งโค้ด\nแต่ให้คำปรึกษา\nและความเชี่ยวชาญที่ช่วยให้เราต่อยอดธุรกิจ ได้อย่างมั่นใจ”",
            },
            {
                role: "Marketing Director",
                quote: "“งานมีคุณภาพ ตรงเวลา\nและทีมให้การดูแลดีมาก\nถือเป็นพาร์ทเนอร์ที่เราไว้วางใจระยะยาว”",
            },
        ],
    },
    cta: {
        title1: "มีไอเดียอยู่แล้ว?",
        title2: "มาสร้างให้เกิดขึ้นจริงกัน",
        description:
            "ไม่ว่าจะเป็นเว็บไซต์ ระบบหลังบ้าน หรือ Software Solution สำหรับธุรกิจ ทีม PIP Evolution พร้อมช่วยคุณตั้งแต่แนวคิดจนถึงการใช้งานจริง",
        button: "ติดต่อเรา",
        buttonLink: "contact-us",
    },
};

export const HOME_HEADING_GRADIENT_CLASSNAME = HEADING_GRADIENT_DARK_CLASSNAME;
export const HOME_HEADING_GRADIENT_LIGHT_CLASSNAME = HEADING_GRADIENT_LIGHT_CLASSNAME;
export { HOME_LIGHT_SURFACE_CLASSNAME };
