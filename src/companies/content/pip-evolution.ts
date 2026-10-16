import type { CompanyContent } from "../types"

export const content: CompanyContent = {
  hero: {
    eyebrow: { th: "PIP EVOLUTION", en: "PIP EVOLUTION" },
    title: { th: "เราสร้างเทคโนโลยี ให้ธุรกิจไปได้ไกลกว่าเดิม", en: "We build technology that takes business further" },
    accent: { th: "สร้างเทคโนโลยี", en: "build technology" },
    lead: {
      th: "PIP Evolution พัฒนา Software และ Digital Solution ที่ออกแบบให้เหมาะกับธุรกิจ ตั้งแต่แนวคิด การพัฒนา ไปจนถึงการใช้งานจริง",
      en: "PIP Evolution builds software and digital solutions shaped around your business — from concept and development to real-world use.",
    },
    primaryCta: { th: "ติดต่อเรา", en: "Contact us" },
    secondaryCta: { th: "เรียนรู้เกี่ยวกับเรา", en: "Learn about us" },
  },
  partners: {
    label: { th: "PARTNERS", en: "PARTNERS" },
    title: { th: "พาร์ทเนอร์ที่พร้อม เติบโตไปพร้อมกับคุณ", en: "Partners ready to grow with you" },
    lead: {
      th: "เราเชื่อในการทำงานร่วมกันระยะยาว เพื่อสร้างโซลูชันที่ตอบโจทย์และสร้างคุณค่าให้กับธุรกิจอย่างแท้จริง",
      en: "We believe in long-term collaboration — building solutions that fit and create real value for the business.",
    },
    names: ["Stripe", "Xero", "QuickBooks", "Square", "Shopify", "Zoho", "Sage", "Slack"],
  },
  about: {
    label: { th: "ABOUT PIP EVOLUTION", en: "ABOUT PIP EVOLUTION" },
    title: { th: "ทำความรู้จัก PIP Evolution", en: "Meet PIP Evolution" },
    body: {
      th: "PIP Evolution บริการให้คำปรึกษาด้านการเงินอย่างมืออาชีพ และบริการวางแผนการเงินเชิงกลยุทธ์ด้วยเครื่องมือและทีมงานที่มีความเชี่ยวชาญสูง พร้อมพัฒนาระบบเทรดอัตโนมัติและโซลูชันดิจิทัลที่ออกแบบมาเฉพาะสำหรับธุรกิจ",
      en: "PIP Evolution offers professional financial advisory and strategic financial planning, backed by strong tools and an expert team — and builds automated trading systems and digital solutions made for each business.",
    },
    stats: [
      { value: "3+", label: { th: "ปีประสบการณ์ในอุตสาหกรรม", en: "Years in the industry" } },
      { value: "50+", label: { th: "ทีมงานผู้เชี่ยวชาญ", en: "Specialists" } },
      { value: "ครบวงจร", label: { th: "บริการและให้คำปรึกษา", en: "End-to-end service & advice" } },
      { value: "24/7", label: { th: "ดูแลลูกค้าตลอด 24 ชั่วโมง", en: "Round-the-clock support" } },
    ],
  },
  pillars: {
    label: { th: "WHY PIP EVOLUTION", en: "WHY PIP EVOLUTION" },
    title: { th: "วิธีคิดของเรา", en: "How we think" },
    lead: {
      th: "เราไม่ได้เป็นเพียงผู้พัฒนาเทคโนโลยี แต่เราคือพันธมิตรที่พร้อมเติบโตไปกับคุณในทุกขั้นตอนของการเติบโต",
      en: "We're not just technology builders — we're a partner ready to grow with you at every stage.",
    },
    items: [
      {
        title: { th: "เข้าใจธุรกิจ", en: "Understand the business" },
        body: { th: "เราเห็นโอกาสในความซับซ้อน", en: "We see opportunity in complexity." },
      },
      {
        title: { th: "คิดอย่างเป็นระบบ", en: "Think in systems" },
        body: {
          th: "เราสร้างโซลูชันที่ยั่งยืน ด้วยระบบที่พัฒนาเอง 100% โดยทีมงาน",
          en: "We build lasting solutions — 100% developed in-house.",
        },
      },
      {
        title: { th: "สร้างไปด้วยกัน", en: "Build together" },
        body: {
          th: "เราเติบโตไปกับลูกค้า ด้วยความโปร่งใสในการให้บริการ",
          en: "We grow with our clients, with full transparency in how we work.",
        },
      },
      {
        title: { th: "ดูแลตลอด 24 ชั่วโมง", en: "Care around the clock" },
        body: {
          th: "ทีมงานพร้อมดูแลระบบและให้คำแนะนำหลังการใช้งานทุกวัน",
          en: "Our team supports your systems and advises after launch, every day.",
        },
      },
    ],
  },
  services: {
    label: { th: "OUR SERVICES", en: "OUR SERVICES" },
    title: { th: "บริการของเรา", en: "Our services" },
    lead: {
      th: "เรามอบโซลูชันแบบครบวงจร ตั้งแต่การพัฒนาเทคโนโลยี การตลาด ไปจนถึงการให้คำปรึกษาด้าน Trading และ FinTech",
      en: "End-to-end solutions, from technology development and marketing to trading and FinTech advisory.",
    },
    items: [
      {
        name: { th: "ระบบเทรดอัตโนมัติ (EA)", en: "Automated trading systems (EA)" },
        body: {
          th: "ให้บริการพัฒนาและดูแลระบบเทรดอัตโนมัติ (EA)",
          en: "We build and maintain automated trading systems (EAs).",
        },
        icon: "code",
        tag: "EA",
      },
      {
        name: { th: "ออกแบบโครงสร้างโปรแกรม", en: "Program architecture" },
        body: {
          th: "ออกแบบโครงสร้างโปรแกรมและ Logic การเทรดเฉพาะทาง",
          en: "Program structure and specialised trading logic.",
        },
        icon: "chart",
        tag: "LOGIC",
      },
      {
        name: { th: "ความเสถียรและบริหารความเสี่ยง", en: "Stability & risk control" },
        body: {
          th: "มุ่งเน้นความเสถียร การบริหารความเสี่ยงและการใช้งานจริง",
          en: "Built for stability, risk management and real-world use.",
        },
        icon: "coins",
        tag: "RISK",
      },
      {
        name: { th: "ทดสอบและพัฒนาต่อเนื่อง", en: "Continuous testing" },
        body: {
          th: "มีการทดสอบ ปรับแต่งและพัฒนาระบบอย่างต่อเนื่อง",
          en: "Ongoing testing, tuning and improvement.",
        },
        icon: "cloud",
        tag: "QA",
      },
      {
        name: { th: "บริการหลังการใช้งาน", en: "After-launch support" },
        body: {
          th: "ให้คำแนะนำและบริการหลังการใช้งานอย่างเป็นระบบ",
          en: "Structured guidance and support after go-live.",
        },
        icon: "bulb",
        tag: "SUPPORT",
      },
    ],
  },
  showcase: {
    label: { th: "OUR WORK", en: "OUR WORK" },
    title: { th: "ผลงานที่เรา สร้างและพัฒนา", en: "Work we've built" },
    lead: {
      th: "ตัวอย่างโปรเจกต์และ Digital Solution ที่เราออกแบบและพัฒนา เพื่อช่วยให้ธุรกิจทำงานได้ง่ายและมีประสิทธิภาพมากขึ้น",
      en: "Projects and digital solutions we designed and built to make businesses simpler and more efficient.",
    },
    items: [
      {
        title: { th: "Cashflow Dashboard", en: "Cashflow Dashboard" },
        body: {
          th: "แดชบอร์ดการเงินที่แสดงรายรับ รายจ่าย และเงินสดสำรองแบบเรียลไทม์ ให้ผู้บริหารตัดสินใจได้เร็วขึ้น",
          en: "A real-time view of revenue, expenses and cash runway so leaders can decide faster.",
        },
        tags: ["FinTech", "Dashboard"],
        metric: { value: "26", label: { th: "วันเงินสดสำรองที่มองเห็นล่วงหน้า", en: "Days of cash buffer visible" } },
      },
      {
        title: { th: "Corporate Card App", en: "Corporate Card App" },
        body: {
          th: "แอปบัตรองค์กรสำหรับติดตามค่าใช้จ่ายรายหมวด พร้อมสรุปภาพรวมในมือถือ",
          en: "A corporate card app that tracks spend by category, with a clear mobile overview.",
        },
        tags: ["Mobile", "Payments"],
      },
      {
        title: { th: "Approval Workflow", en: "Approval Workflow" },
        body: {
          th: "ระบบแจ้งเตือนและอนุมัติคำขอแบบเรียลไทม์ ลดเวลาตอบกลับของทีมการเงิน",
          en: "Real-time alerts and approvals that cut response time for finance teams.",
        },
        tags: ["Automation", "Workflow"],
      },
      {
        title: { th: "Accounting Integrations", en: "Accounting Integrations" },
        body: {
          th: "เชื่อมต่อระบบบัญชีและการชำระเงิน เช่น Xero, QuickBooks และ Stripe ให้ข้อมูลไหลต่อกันอัตโนมัติ",
          en: "Connects accounting and payment tools like Xero, QuickBooks and Stripe so data flows automatically.",
        },
        tags: ["API", "Integration"],
      },
      {
        title: { th: "EA Trading Suite", en: "EA Trading Suite" },
        body: {
          th: "ชุดระบบเทรดอัตโนมัติพร้อม logic บริหารความเสี่ยง ผ่านการทดสอบย้อนหลังก่อนใช้งานจริง",
          en: "Automated trading suite with built-in risk logic, back-tested before going live.",
        },
        tags: ["EA", "Trading"],
      },
    ],
  },
  testimonials: {
    label: { th: "TESTIMONIALS", en: "TESTIMONIALS" },
    title: { th: "เสียงจากลูกค้าของเรา", en: "What our clients say" },
    lead: {
      th: "ความไว้วางใจจากลูกค้า คือสิ่งที่ผลักดันให้เราพัฒนาและส่งมอบงานที่ดียิ่งขึ้นในทุกโปรเจกต์",
      en: "Our clients' trust pushes us to deliver better work on every project.",
    },
    items: [
      {
        quote: {
          th: "ทีมงานมืออาชีพ เข้าใจธุรกิจเราอย่างแท้จริง ช่วยให้เราพัฒนาแพลตฟอร์มได้ตามเป้าหมาย และเติบโตต่อเนื่อง",
          en: "A professional team that truly understands our business. They helped us build the platform we planned and keep growing.",
        },
        name: { th: "ผู้บริหาร", en: "Chief Executive" },
        role: { th: "CEO, Brokerage Firm", en: "CEO, Brokerage Firm" },
      },
      {
        quote: {
          th: "PIP Evolution ไม่ได้แค่ส่งโค้ด แต่ให้คำปรึกษาและความเชี่ยวชาญที่ช่วยให้เราต่อยอดธุรกิจได้อย่างมั่นใจ",
          en: "PIP Evolution doesn't just ship code — their advice and expertise let us grow the business with confidence.",
        },
        name: { th: "ผู้ก่อตั้ง", en: "Founder" },
        role: { th: "Founder, FinTech Startup", en: "Founder, FinTech Startup" },
      },
      {
        quote: {
          th: "งานมีคุณภาพ ตรงเวลา และทีมให้การดูแลดีมาก ถือเป็นพาร์ทเนอร์ที่เราไว้วางใจระยะยาว",
          en: "Quality work, on time, and great care from the team. A partner we trust for the long term.",
        },
        name: { th: "ผู้อำนวยการฝ่ายการตลาด", en: "Marketing Director" },
        role: { th: "Marketing Director", en: "Marketing Director" },
      },
    ],
  },
  cta: {
    label: { th: "IDEAS · TECHNOLOGY · GROWTH · TOGETHER", en: "IDEAS · TECHNOLOGY · GROWTH · TOGETHER" },
    title: { th: "มีไอเดียอยู่แล้ว? มาสร้างให้เกิดขึ้นจริงกัน", en: "Got an idea? Let's make it real." },
    lead: {
      th: "ไม่ว่าจะเป็นเว็บไซต์ ระบบหลังบ้าน หรือ Software Solution สำหรับธุรกิจ ทีม PIP Evolution พร้อมช่วยคุณตั้งแต่แนวคิดจนถึงการใช้งานจริง",
      en: "Website, back-office system or business software — the PIP Evolution team is with you from concept to launch.",
    },
    button: { th: "ติดต่อเรา", en: "Contact us" },
  },
  contact: {
    address: {
      th: "72/1 ซ.รามอินทรา 19 แขวงอนุสาวรีย์ เขตบางเขน กรุงเทพมหานคร 10220",
      en: "72/1 Soi Ram Inthra 19, Anusawari, Bang Khen, Bangkok 10220",
    },
    email: "pipoffice1001@gmail.com",
    phone: "062 149 2446",
  },
  footer: {
    blurb: {
      th: "ให้บริการโซลูชันเทคโนโลยีที่ครบวงจร ด้วยทีมผู้เชี่ยวชาญที่มีประสบการณ์มากกว่า 3 ปี พร้อมสนับสนุนธุรกิจของคุณให้เติบโตอย่างยั่งยืน",
      en: "End-to-end technology solutions from a team with 3+ years of experience, helping your business grow sustainably.",
    },
    note: { th: "© 2026 PIP Evolution สงวนลิขสิทธิ์", en: "© 2026 PIP Evolution. All rights reserved." },
  },
}
