import type { CompanyContent } from "../types"

export const content: CompanyContent = {
  hero: {
    eyebrow: { th: "SABAIDEE FINX", en: "SABAIDEE FINX" },
    title: { th: "การเงินของธุรกิจ ง่ายและสบายขึ้น", en: "Business finance, made simple" },
    accent: { th: "ง่ายและสบายขึ้น", en: "made simple" },
    lead: {
      th: "Sabaidee Finx พัฒนาเทคโนโลยีการเงินสำหรับธุรกิจไทย ตั้งแต่การรับชำระเงินดิจิทัล ระบบสินเชื่อ ไปจนถึงงานการเงินหลังบ้าน ให้ทุกธุรกรรมชัดเจน ปลอดภัย และตรวจสอบได้",
      en: "Sabaidee Finx builds financial technology for Thai businesses — digital payments, lending tools and finance back-office — so every transaction is clear, secure and traceable.",
    },
    primaryCta: { th: "คุยกับทีม", en: "Talk to our team" },
    secondaryCta: { th: "ดูโซลูชัน", en: "See solutions" },
  },
  partners: {
    label: { th: "INTEGRATIONS", en: "INTEGRATIONS" },
    title: { th: "เชื่อมต่อกับระบบการเงินที่ธุรกิจใช้อยู่", en: "Works with the finance tools you already use" },
    lead: {
      th: "รองรับช่องทางชำระเงินและระบบบัญชียอดนิยม เพื่อให้เริ่มใช้งานได้โดยไม่ต้องเปลี่ยนทั้งระบบ",
      en: "Popular payment rails and accounting systems are supported, so you can start without replacing everything.",
    },
    names: ["PromptPay", "Thai QR Payment", "VISA", "Mastercard", "Xero", "QuickBooks", "LINE OA", "Shopify"],
  },
  about: {
    label: { th: "เกี่ยวกับเรา", en: "About us" },
    title: { th: "ฟินเทคที่ออกแบบมาเพื่อธุรกิจไทย", en: "Fintech designed for Thai businesses" },
    body: {
      th: "Sabaidee Finx เป็นบริษัทในเครือ PIP Group Holding ที่มุ่งช่วย SME และธุรกิจขนาดกลางจัดการเงินเข้า เงินออก และกระแสเงินสดได้ในที่เดียว เราผสานความเข้าใจด้านการเงินเข้ากับวิศวกรรมซอฟต์แวร์ที่เน้นความปลอดภัย เพื่อให้ทีมการเงินใช้เวลากับการตัดสินใจมากกว่างานเอกสาร",
      en: "Sabaidee Finx is a PIP Group Holding company helping SMEs and mid-sized businesses manage money in, money out and cash flow in one place. We combine finance know-how with security-first engineering, so finance teams spend more time deciding and less time on paperwork.",
    },
    stats: [
      { value: "2023", label: { th: "ปีที่ก่อตั้ง", en: "Founded" } },
      { value: "150+", label: { th: "ธุรกิจที่ใช้งาน", en: "Businesses onboard" } },
      { value: "1M+", label: { th: "ธุรกรรมต่อเดือน", en: "Transactions per month" } },
      { value: "99.9%", label: { th: "ความพร้อมใช้งานของระบบ", en: "Platform uptime" } },
    ],
  },
  pillars: {
    label: { th: "หลักการของเรา", en: "Our principles" },
    title: { th: "เงินของคุณ ต้องชัดเจนทุกบาท", en: "Every baht, accounted for" },
    items: [
      {
        title: { th: "ปลอดภัยเป็นอันดับแรก", en: "Security first" },
        body: {
          th: "เข้ารหัสข้อมูล ควบคุมสิทธิ์การเข้าถึง และบันทึกทุกการเปลี่ยนแปลงเพื่อการตรวจสอบ",
          en: "Encrypted data, role-based access and a full audit trail of every change.",
        },
      },
      {
        title: { th: "เรียบง่ายสำหรับทุกทีม", en: "Simple for every team" },
        body: {
          th: "หน้าจอที่ทีมขาย บัญชี และผู้บริหารเข้าใจได้ทันที โดยไม่ต้องอบรมนาน",
          en: "Screens that sales, accounting and leadership understand from day one.",
        },
      },
      {
        title: { th: "ตรวจสอบได้ทุกขั้นตอน", en: "Traceable end to end" },
        body: {
          th: "กระทบยอดอัตโนมัติ ให้ทุกรายการเชื่อมกลับไปยังเอกสารและบัญชีได้",
          en: "Automatic reconciliation links every transaction back to its documents and ledger.",
        },
      },
    ],
  },
  services: {
    label: { th: "SOLUTIONS", en: "SOLUTIONS" },
    title: { th: "โซลูชันการเงินสำหรับธุรกิจ", en: "Finance solutions for business" },
    lead: {
      th: "เลือกใช้เฉพาะส่วนที่ต้องการ หรือเชื่อมทั้งหมดเป็นระบบการเงินเดียว",
      en: "Use only what you need, or connect it all into one finance system.",
    },
    items: [
      {
        name: { th: "Finx Pay", en: "Finx Pay" },
        body: {
          th: "รับชำระเงินผ่าน QR, บัตร และลิงก์ชำระเงิน พร้อมสรุปยอดรายวัน",
          en: "Accept QR, card and payment-link payments with daily settlement reports.",
        },
        icon: "coins",
        tag: "PAYMENTS",
      },
      {
        name: { th: "Finx Lend", en: "Finx Lend" },
        body: {
          th: "ระบบบริหารสินเชื่อสำหรับผู้ให้กู้ ตั้งแต่ยื่นคำขอ พิจารณา จนถึงติดตามการชำระ",
          en: "Loan management for lenders, from application and review to repayment tracking.",
        },
        icon: "handshake",
        tag: "LENDING",
      },
      {
        name: { th: "Finx Books", en: "Finx Books" },
        body: {
          th: "ออกใบแจ้งหนี้ กระทบยอด และส่งข้อมูลเข้าระบบบัญชีอัตโนมัติ",
          en: "Invoicing, reconciliation and automatic sync to your accounting system.",
        },
        icon: "book",
        tag: "BACK-OFFICE",
      },
      {
        name: { th: "Finx Insight", en: "Finx Insight" },
        body: {
          th: "แดชบอร์ดกระแสเงินสดและการคาดการณ์ ให้ผู้บริหารเห็นภาพการเงินแบบเรียลไทม์",
          en: "Cash-flow dashboards and forecasts that give leaders a real-time view.",
        },
        icon: "chart",
        tag: "ANALYTICS",
      },
      {
        name: { th: "Finx Guard", en: "Finx Guard" },
        body: {
          th: "ตรวจจับธุรกรรมผิดปกติและควบคุมสิทธิ์การอนุมัติหลายระดับ",
          en: "Flags unusual transactions and enforces multi-level approval rights.",
        },
        icon: "shield",
        tag: "SECURITY",
      },
    ],
  },
  showcase: {
    label: { th: "CASE STUDIES", en: "CASE STUDIES" },
    title: { th: "ธุรกิจที่จัดการการเงินได้ง่ายขึ้น", en: "Businesses running finance more easily" },
    items: [
      {
        title: { th: "ร้านค้าออนไลน์หลายช่องทาง", en: "Multi-channel online retailer" },
        body: {
          th: "รวมยอดขายจากเว็บไซต์ LINE และมาร์เก็ตเพลส แล้วกระทบยอดกับบัญชีธนาคารอัตโนมัติ",
          en: "Sales from website, LINE and marketplaces reconciled automatically against the bank.",
        },
        tags: ["Finx Pay", "Finx Books"],
        metric: { value: "−70%", label: { th: "เวลากระทบยอดต่อเดือน", en: "Monthly reconciliation time" } },
      },
      {
        title: { th: "ผู้ให้สินเชื่อรายย่อย", en: "Micro-lending provider" },
        body: {
          th: "ย้ายการพิจารณาสินเชื่อจากกระดาษสู่ระบบดิจิทัล พร้อมติดตามการชำระคืนแบบเรียลไทม์",
          en: "Moved loan review from paper to digital, with real-time repayment tracking.",
        },
        tags: ["Finx Lend"],
        metric: { value: "2 วัน", label: { th: "ระยะเวลาอนุมัติ จากเดิม 7 วัน", en: "Approval time, down from 7 days" } },
      },
      {
        title: { th: "ธุรกิจบริการหลายสาขา", en: "Multi-branch service business" },
        body: {
          th: "ผู้บริหารเห็นกระแสเงินสดของทุกสาขาในแดชบอร์ดเดียว และวางแผนล่วงหน้าได้แม่นยำขึ้น",
          en: "Leaders see every branch's cash flow on one dashboard and plan ahead more accurately.",
        },
        tags: ["Finx Insight"],
        metric: { value: "12", label: { th: "สาขาในแดชบอร์ดเดียว", en: "Branches on one dashboard" } },
      },
    ],
  },
  testimonials: {
    label: { th: "เสียงจากลูกค้า", en: "Client voices" },
    title: { th: "ลูกค้าพูดถึง Sabaidee Finx", en: "What clients say about Sabaidee Finx" },
    items: [
      {
        quote: {
          th: "ปิดงบรายเดือนได้เร็วขึ้นมาก ทีมบัญชีไม่ต้องไล่จับคู่สลิปโอนเงินทีละรายการอีกต่อไป",
          en: "Month-end close is much faster. Our accountants no longer match transfer slips one by one.",
        },
        name: { th: "ผู้จัดการฝ่ายบัญชี", en: "Accounting Manager" },
        role: { th: "ธุรกิจค้าปลีกออนไลน์", en: "Online retail business" },
      },
      {
        quote: {
          th: "ระบบใช้ง่าย และทีมช่วยตั้งค่าสิทธิ์การอนุมัติให้เหมาะกับโครงสร้างองค์กรของเรา",
          en: "Easy to use, and the team set up approval rights to match how our company is organised.",
        },
        name: { th: "ผู้อำนวยการฝ่ายการเงิน", en: "Finance Director" },
        role: { th: "บริษัทบริการหลายสาขา", en: "Multi-branch services company" },
      },
    ],
  },
  cta: {
    label: { th: "เริ่มต้นใช้งาน", en: "Get started" },
    title: { th: "พร้อมให้การเงินของธุรกิจ สบายขึ้นหรือยัง", en: "Ready to make your business finance easier?" },
    lead: {
      th: "นัดคุยกับทีม Sabaidee Finx เพื่อประเมินระบบการเงินปัจจุบันและหาจุดเริ่มต้นที่เหมาะกับธุรกิจของคุณ",
      en: "Book a call with Sabaidee Finx to review your current finance setup and find the right place to start.",
    },
    button: { th: "นัดคุยกับทีม", en: "Book a call" },
  },
  contact: {
    address: {
      th: "เลขที่ 502 อาคารเกษร อัมรินทร์ ชั้นที่ 9 ถนนเพลินจิต แขวงลุมพินี เขตปทุมวัน กรุงเทพมหานคร",
      en: "502 Gaysorn Amarin Building, 9th Floor, Phloen Chit Road, Lumphini, Pathum Wan, Bangkok",
    },
    email: "hello@sabaideefinx.co.th",
  },
  footer: {
    blurb: {
      th: "เทคโนโลยีการเงินสำหรับธุรกิจไทย การรับชำระเงิน สินเชื่อ และงานการเงินหลังบ้านในที่เดียว",
      en: "Financial technology for Thai businesses — payments, lending and finance back-office in one place.",
    },
    note: {
      th: "© 2026 Sabaidee Finx Co., Ltd. บริษัทในเครือ PIP Group Holding",
      en: "© 2026 Sabaidee Finx Co., Ltd. A PIP Group Holding company.",
    },
  },
}
