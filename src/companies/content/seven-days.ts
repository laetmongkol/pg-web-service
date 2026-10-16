import type { CompanyContent } from "../types"

export const content: CompanyContent = {
  hero: {
    eyebrow: { th: "7DAYS ACADEMY", en: "7DAYS ACADEMY" },
    title: { th: "เรียนรู้ เพื่อเทรด อย่างมั่นใจ", en: "Learn to trade, with confidence" },
    accent: { th: "อย่างมั่นใจ", en: "with confidence" },
    lead: {
      th: "ยกระดับความรู้และทักษะด้านการเทรด ผ่านบทเรียนที่ออกแบบให้เข้าใจง่าย เป็นขั้นตอน และนำไปประยุกต์ใช้ได้จริง เพื่อให้คุณพร้อมพัฒนาในทุกก้าวของการเทรด",
      en: "Build your trading knowledge and skills through clear, step-by-step lessons you can actually apply — ready for every stage of your trading journey.",
    },
    primaryCta: { th: "ดูคอร์สเรียนทั้งหมด", en: "Browse all courses" },
    secondaryCta: { th: "ปรึกษาเรา", en: "Talk to us" },
  },
  partners: {
    label: { th: "ได้รับการสนับสนุน", en: "Supported by" },
    title: { th: "ได้รับการสนับสนุนจากแบรนด์ชั้นนำ", en: "Backed by leading brands" },
    names: ["Samsung", "Intel", "Cisco", "Google", "VISA", "frog", "Leica", "Autodesk"],
  },
  about: {
    label: { th: "สถิติ", en: "Results" },
    title: {
      th: "เราไม่ได้วัดผลด้วยกำไรระยะสั้น แต่วัดจากความเข้าใจ แผนที่เขียนได้และวินัยที่ทำซ้ำได้",
      en: "We don't measure short-term profit. We measure understanding, a written plan and repeatable discipline.",
    },
    body: {
      th: "ข้อมูลจากแบบประเมินหลังเรียนและการส่งการบ้านของผู้เรียนรุ่น 1–11 ผลลัพธ์แตกต่างกันในแต่ละบุคคล",
      en: "Based on post-course surveys and assignments from cohorts 1–11. Individual results vary.",
    },
    stats: [
      { value: "1,280+", label: { th: "ผู้เรียนผ่านคลาส", en: "Students trained" } },
      { value: "92%", label: { th: "ทำ Trading plan สำเร็จ", en: "Completed a trading plan" } },
      { value: "4.8/5", label: { th: "คะแนนบทเรียน", en: "Lesson rating" } },
      { value: "18 ชม.", label: { th: "เนื้อหาและ Workshop", en: "Hours of lessons & workshops" } },
    ],
  },
  pillars: {
    label: { th: "Features", en: "Features" },
    title: { th: "ทุกเรื่องเกี่ยวกับการเทรด รวมอยู่ในที่นี่ที่เดียว", en: "Everything about trading, in one place" },
    items: [
      {
        title: { th: "เนื้อหาครบ", en: "Complete curriculum" },
        body: {
          th: "ตั้งแต่พื้นฐานการเทรด ไปจนถึงการวิเคราะห์และวางแผนอย่างเป็นระบบ",
          en: "From trading basics to systematic analysis and planning.",
        },
      },
      {
        title: { th: "เครื่องมือช่วยเทรด", en: "Trading tools" },
        body: {
          th: "แบบฝึกหัด เนื้อหาประกอบ และเครื่องมือที่ช่วยให้คุณฝึกฝนได้อย่างต่อเนื่อง",
          en: "Exercises, materials and tools that keep you practising.",
        },
      },
      {
        title: { th: "เรียนได้ทุกที่ทุกเวลา", en: "Learn anywhere, anytime" },
        body: {
          th: "เข้าถึงบทเรียนและทบทวนเนื้อหาได้ตามเวลาที่เหมาะกับคุณ",
          en: "Open lessons and review content whenever it suits you.",
        },
      },
      {
        title: { th: "ชุมชนนักเทรด", en: "Trader community" },
        body: {
          th: "แลกเปลี่ยนความรู้ แนวคิด และประสบการณ์ไปพร้อมกับผู้เรียนคนอื่น ๆ",
          en: "Share knowledge, ideas and experience with fellow students.",
        },
      },
    ],
  },
  services: {
    label: { th: "บริการของ 7Days Academy", en: "What 7Days Academy offers" },
    title: { th: "ครบทุกการเทรดในที่เดียว", en: "Everything for trading, in one place" },
    lead: {
      th: "ตั้งแต่การเรียนรู้ พัฒนาซอฟต์แวร์ ไปจนถึงการดูแลคุณในระยะยาว",
      en: "From learning and software to long-term support.",
    },
    items: [
      {
        name: { th: "Training — เรียนจากพื้นฐานสู่ระบบ", en: "Training — from basics to a system" },
        body: {
          th: "หลักสูตรเข้มข้น เวิร์กช็อป และสัมมนาที่ทำให้คุณเข้าใจกลยุทธ์ก่อนลงเงินจริง",
          en: "Intensive courses, workshops and seminars so you understand the strategy before risking real money.",
        },
        icon: "cap",
        tag: "01",
      },
      {
        name: { th: "Development — เทคโนโลยีที่สร้างเพื่อเทรดเดอร์", en: "Development — technology built for traders" },
        body: {
          th: "พัฒนา EA และซอฟต์แวร์ให้สอดคล้องกับตลาด พร้อมทดสอบและปรับปรุงอย่างต่อเนื่อง",
          en: "EAs and software built for the market, tested and refined continuously.",
        },
        icon: "code",
        tag: "02",
      },
      {
        name: { th: "Support — ไม่ปล่อยให้คุณเดินคนเดียว", en: "Support — you never trade alone" },
        body: {
          th: "ทีมงานคนไทยช่วยติดตั้ง แก้ปัญหา และติดตามการใช้งานอย่างเป็นระบบ",
          en: "A Thai support team for installation, troubleshooting and ongoing follow-up.",
        },
        icon: "headset",
        tag: "03",
      },
    ],
  },
  showcase: {
    label: { th: "FEATURED SOFTWARE", en: "FEATURED SOFTWARE" },
    title: { th: "ระบบที่ทำงาน เมื่อคุณพัก", en: "Systems that work while you rest" },
    lead: {
      th: "ซอฟต์แวร์และกลยุทธ์อัตโนมัติที่ช่วยให้การเทรดมีวินัย บริหารความเสี่ยงได้ และทำซ้ำได้อย่างเป็นระบบ",
      en: "Automated software and strategies that keep trading disciplined, risk-managed and repeatable.",
    },
    items: [
      {
        title: { th: "EA KUB", en: "EA KUB" },
        body: {
          th: "ระบบอัตโนมัติสำหรับการจัดการคำสั่งและความเสี่ยง",
          en: "Automation for order handling and risk control.",
        },
        tags: ["EA", "Automation"],
      },
      {
        title: { th: "SONIC", en: "SONIC" },
        body: {
          th: "จับจังหวะตลาดด้วย logic ที่ชัดเจนและปรับใช้ได้",
          en: "Reads market timing with clear, adjustable logic.",
        },
        tags: ["Signals", "Crypto"],
      },
      {
        title: { th: "Martin", en: "Martin" },
        body: {
          th: "Smart Risk Management บริหารความเสี่ยงอย่างเป็นระบบ",
          en: "Smart risk management, applied systematically.",
        },
        tags: ["Risk"],
      },
      {
        title: { th: "Star Series", en: "Star Series" },
        body: {
          th: "กลุ่มกลยุทธ์ที่ออกแบบเพื่อกระจายรูปแบบการเทรด",
          en: "A family of strategies designed to diversify how you trade.",
        },
        tags: ["Strategy", "Portfolio"],
      },
      {
        title: { th: "คอร์ส: พื้นฐานการเทรด", en: "Course: Trading Fundamentals" },
        body: {
          th: "เข้าใจตลาด โครงสร้าง และวิธีการเทรดอย่างถูกต้อง เริ่มต้นสู่เส้นทางเทรดเดอร์อย่างมั่นคง",
          en: "Understand the market, its structure and how to trade properly — a steady start on the trader's path.",
        },
        tags: ["Featured course"],
        metric: { value: "24", label: { th: "บทเรียน · 4.5 ชม.", en: "Lessons · 4.5 hrs" } },
      },
      {
        title: { th: "คอร์ส: Technical Analysis", en: "Course: Technical Analysis" },
        body: {
          th: "วิเคราะห์กราฟอย่างเป็นระบบ เรียนรู้แนวโน้มและเครื่องมือพื้นฐานสำหรับการวิเคราะห์ราคา",
          en: "Read charts systematically — trends and the core tools of price analysis.",
        },
        tags: ["Course"],
      },
    ],
  },
  testimonials: {
    label: { th: "เสียงจากผู้เรียน", en: "Student voices" },
    title: { th: "เสียงจากผู้เรียนของเรา", en: "What our students say" },
    lead: {
      th: "ประสบการณ์และความประทับใจจากผู้ที่เข้ามาเรียนรู้และพัฒนาทักษะไปกับ 7Days Academy",
      en: "Experiences from people who learned and built their skills with 7Days Academy.",
    },
    items: [
      {
        quote: {
          th: "เนื้อหาเข้าใจง่ายมาก จากที่ไม่ค่อยมีพื้นฐาน เนื้อหาเรียงเป็นขั้นตอน ทำให้ตามบทเรียนได้ง่ายขึ้น",
          en: "Really easy to follow. I had little background, but the step-by-step order made every lesson manageable.",
        },
        name: { th: "ผู้เรียนรุ่นที่ 9", en: "Cohort 9 student" },
        role: { th: "นักเทรดมือใหม่", en: "New trader" },
      },
      {
        quote: {
          th: "เรียนเป็นระบบมากขึ้น ชอบที่ไม่ได้มีแค่เนื้อหา แต่ช่วยให้เข้าใจว่าควรเริ่มเรียนจากตรงไหนและพัฒนาต่ออย่างไร",
          en: "Much more structured. It's not just content — it shows you where to start and how to keep improving.",
        },
        name: { th: "ผู้เรียนรุ่นที่ 7", en: "Cohort 7 student" },
        role: { th: "พนักงานบริษัท เทรดนอกเวลา", en: "Part-time trader" },
      },
      {
        quote: {
          th: "กลับมาทบทวนได้ตลอด สามารถเลือกเรียนตามเวลาที่สะดวก และกลับมาดูเนื้อหาที่ต้องการได้ทุกเมื่อ",
          en: "I can revisit anything, learn on my own schedule and jump back to exactly the lesson I need.",
        },
        name: { th: "ผู้เรียนรุ่นที่ 11", en: "Cohort 11 student" },
        role: { th: "เจ้าของธุรกิจ", en: "Business owner" },
      },
    ],
  },
  cta: {
    label: { th: "เริ่มต้นวันนี้", en: "Start today" },
    title: { th: "เรียนรู้ เข้าใจ แล้วลงมือเทรด ไปกับ 7Days Academy", en: "Learn, understand, then trade — with 7Days Academy" },
    lead: {
      th: "จุดเริ่มต้นเล็ก ๆ วันนี้ อาจเปลี่ยนอนาคตการเงินของคุณตลอดไป",
      en: "A small start today could change your financial future for good.",
    },
    button: { th: "สนใจเรียน", en: "Enrol now" },
  },
  contact: {
    address: {
      th: "เลขที่ 8 ซ. ริมทางด่วน 2 แขวงพระโขนงใต้ เขตพระโขนง กรุงเทพมหานคร 10260",
      en: "8 Soi Rim Thang Duan 2, Phra Khanong Tai, Phra Khanong, Bangkok 10260",
    },
    email: "sevendaysacademy@gmail.com",
    phone: "080-081-1878",
  },
  footer: {
    blurb: {
      th: "พื้นที่เรียนรู้การวิเคราะห์ตลาดและบริหารความเสี่ยงอย่างมีระบบ เพื่อการตัดสินใจที่รับผิดชอบและยั่งยืน",
      en: "A place to learn market analysis and risk management systematically, for responsible, sustainable decisions.",
    },
    note: {
      th: "คำเตือนความเสี่ยง: การซื้อขายสินทรัพย์มีความเสี่ยงสูงและอาจสูญเสียเงินลงทุนทั้งหมด เนื้อหาในหลักสูตรจัดทำเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน ผลการดำเนินงานในอดีตไม่รับประกันผลลัพธ์ในอนาคต",
      en: "Risk warning: trading is high-risk and you may lose all of your capital. Course content is for education only and is not investment advice. Past performance does not guarantee future results.",
    },
  },
}
