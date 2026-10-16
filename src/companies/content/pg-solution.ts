import type { CompanyContent } from "../types"

export const content: CompanyContent = {
  hero: {
    eyebrow: { th: "TRADING TECH / AI MARKETING", en: "TRADING TECH / AI MARKETING" },
    title: { th: "พัฒนาเทคโนโลยี ให้ธุรกิจเดินต่อ", en: "Technology that keeps business moving" },
    accent: { th: "ให้ธุรกิจเดินต่อ", en: "keeps business moving" },
    lead: {
      th: "เชื่อมข้อมูล ระบบ และ AI ให้ตอบโจทย์การทำงาน ตั้งแต่งานเทรดและการตลาด ไปจนถึงระบบธุรกิจ",
      en: "We connect data, systems and AI around the way you work — from trading and marketing to everyday business operations.",
    },
    primaryCta: { th: "เริ่มจากโจทย์ของคุณ", en: "Start with your brief" },
    secondaryCta: { th: "ดูบริการทั้งหมด", en: "See all services" },
  },
  partners: {
    label: { th: "CONNECTED ECOSYSTEM", en: "CONNECTED ECOSYSTEM" },
    title: { th: "ระบบที่เชื่อมต่อกับเครื่องมือที่ทีมใช้อยู่แล้ว", en: "Built to plug into the tools your team already uses" },
    lead: {
      th: "ข้อมูลหนึ่งชุด เดินผ่าน workflow และกลับมาเป็นการตัดสินใจ",
      en: "One set of data flows through the workflow and comes back as a decision.",
    },
    names: ["MetaTrader 5", "TradingView", "Meta Ads", "Google Ads", "LINE OA", "OpenAI", "Stripe", "AWS"],
    stat: { value: "99.98%", label: { th: "API uptime", en: "API uptime" } },
  },
  about: {
    label: { th: "เกี่ยวกับ PG", en: "About PG" },
    title: { th: "ทีมที่สร้างซอฟต์แวร์ให้ธุรกิจทำงานต่อได้จริง", en: "A team that builds software businesses actually run on" },
    body: {
      th: "PG Solution พัฒนาซอฟต์แวร์สำหรับเทคโนโลยีเทรด การตลาดด้วย AI และระบบการทำงานของธุรกิจ เราเริ่มจากทีมเล็ก ๆ ที่ทำระบบเทรดและงานการตลาดดิจิทัลให้ลูกค้าในกรุงเทพฯ วันนี้ทีมวิศวกร นักออกแบบ และนักวิเคราะห์ข้อมูลของ PG ดูแลระบบให้ธุรกิจหลายอุตสาหกรรม ตั้งแต่โบรกเกอร์ไปจนถึงร้านค้าออนไลน์",
      en: "PG Solution builds software for trading technology, AI marketing and business operations. We started as a small team building trading systems and digital marketing for Bangkok clients; today our engineers, designers and data analysts run systems for businesses across industries, from brokers to online stores.",
    },
    stats: [
      { value: "2019", label: { th: "ปีที่เริ่มทีม", en: "Founded" } },
      { value: "40+", label: { th: "วิศวกรและนักออกแบบ", en: "Engineers & designers" } },
      { value: "120+", label: { th: "โปรเจกต์ที่ส่งมอบ", en: "Projects delivered" } },
      { value: "60+", label: { th: "องค์กรที่ใช้งาน", en: "Organisations on our systems" } },
    ],
    quote: {
      th: "อธิบายสิ่งที่จะสร้าง ก่อนอธิบายว่าสิ่งนั้นจะเปลี่ยนธุรกิจอย่างไร",
      en: "Explain what we'll build before claiming how it will change the business.",
    },
  },
  pillars: {
    label: { th: "ทำไมต้องเลือก PG", en: "Why PG" },
    title: { th: "เพราะระบบของเรา เริ่มจากวิธีทำงานจริงของคุณ", en: "Because our systems start from how you really work" },
    lead: {
      th: "ทุกโปรเจกต์เริ่มจากการเข้าใจว่าใครใช้ข้อมูลอะไร ต้องตัดสินใจเมื่อไร แล้วจึงออกแบบระบบให้ลดจุดสะดุดตรงนั้น",
      en: "Every project starts with who uses which data and when they decide — then we design the system to remove the friction.",
    },
    items: [
      {
        title: { th: "เริ่มจาก requirements ที่ชัด", en: "Clear requirements first" },
        body: {
          th: "อธิบายสิ่งที่จะสร้าง ขอบเขต และจุดเชื่อมก่อนเริ่มงาน ทุกฝ่ายเห็นภาพเดียวกัน",
          en: "Scope, deliverables and integrations agreed up front, so everyone sees the same picture.",
        },
      },
      {
        title: { th: "ระบบเป็นโมดูล ต่อยอดได้", en: "Modular and extensible" },
        body: {
          th: "เริ่มจากระบบเดียวหรือวางเป็น ecosystem ข้อมูลไหลต่อกันโดยไม่ต้องรื้อของเดิม",
          en: "Start with one system or a full ecosystem — data connects without tearing out what works.",
        },
      },
      {
        title: { th: "AI ที่ทีมยังควบคุมได้", en: "AI your team controls" },
        body: {
          th: "AI ช่วยในจุดที่เหมาะสม ทีมเห็นเหตุผลและ review ได้ทุกครั้ง",
          en: "AI helps where it fits; the team sees the reasoning and reviews every time.",
        },
      },
      {
        title: { th: "เห็นความคืบหน้าทุก 2 สัปดาห์", en: "Progress every two weeks" },
        body: {
          th: "ส่งมอบเป็นรอบพร้อม demo และมีทีม support ตอบกลับภายใน 4 ชั่วโมงทำการหลังขึ้นระบบ",
          en: "Iterative delivery with demos, plus support that replies within 4 business hours after launch.",
        },
      },
    ],
  },
  services: {
    label: { th: "SERVICES", en: "SERVICES" },
    title: { th: "ระบบที่สร้างแยกส่วนได้ และเชื่อมกันเป็นภาพเดียว", en: "Modular systems that connect into one picture" },
    lead: {
      th: "เราอธิบายสิ่งที่จะสร้าง ขอบเขต และการเชื่อมต่อก่อนเริ่มงาน เพื่อให้แต่ละระบบตอบโจทย์วันนี้และมีพื้นที่พัฒนาต่อ",
      en: "We agree what we'll build, its scope and integrations first, so each system fits today and leaves room to grow.",
    },
    items: [
      {
        name: { th: "PG Broker API", en: "PG Broker API" },
        body: { th: "เชื่อมข้อมูลตลาดและคำสั่งซื้อขาย", en: "Connects market data and order flow." },
        icon: "chart",
        tag: "TRADING",
      },
      {
        name: { th: "PG Ads AI", en: "PG Ads AI" },
        body: { th: "จัดการงบและครีเอทีฟโฆษณาด้วย AI", en: "AI-assisted ad budgets and creative." },
        icon: "megaphone",
        tag: "MARKETING",
      },
      {
        name: { th: "PG AI", en: "PG AI" },
        body: { th: "โมเดลและเวิร์กโฟลว์ AI สำหรับองค์กร", en: "AI models and workflows for organisations." },
        icon: "sparkles",
        tag: "AI SYSTEM",
      },
      {
        name: { th: "PG CRM / PG HR", en: "PG CRM / PG HR" },
        body: {
          th: "ลูกค้า กระบวนการขาย พนักงาน เงินเดือน และเวลาทำงาน",
          en: "Customers, sales pipeline, staff, payroll and time.",
        },
        icon: "users",
        tag: "OPERATIONS",
      },
      {
        name: { th: "PG Commerce", en: "PG Commerce" },
        body: { th: "ร้านออนไลน์ สต็อก และการชำระเงิน", en: "Online store, inventory and payments." },
        icon: "coins",
        tag: "COMMERCE",
      },
      {
        name: { th: "PG Pages / PG Web", en: "PG Pages / PG Web" },
        body: {
          th: "แลนดิ้งเพจจากเทมเพลตพร้อมใช้ เว็บไซต์องค์กร และการดูแลระบบ",
          en: "Ready-made landing pages, corporate websites and upkeep.",
        },
        icon: "layers",
        tag: "EXPERIENCE",
      },
    ],
  },
  showcase: {
    label: { th: "USE CASES", en: "USE CASES" },
    title: { th: "ผลลัพธ์ที่อธิบายได้จากวิธีทำงาน ไม่ใช่คำสัญญาลอย ๆ", en: "Results explained by the work, not empty promises" },
    lead: {
      th: "แต่ละ use case เริ่มจากการมองงานจริงว่าใครใช้ข้อมูลอะไร ต้องตัดสินใจเมื่อไร และระบบควรช่วยลดจุดสะดุดตรงไหน",
      en: "Each use case starts from real work: who uses what data, when they decide, and where the system should remove friction.",
    },
    items: [
      {
        title: { th: "งานเทรดที่เห็นสถานะชัด", en: "Trading with clear status" },
        body: {
          th: "เชื่อมข้อมูลตลาด คำสั่ง และสถานะที่ต้องติดตามให้อยู่ใน flow เดียวกัน",
          en: "Market data, orders and status tracking in a single flow.",
        },
        tags: ["TRADING OPERATIONS"],
        metric: { value: "−40%", label: { th: "เวลาติดตามสถานะคำสั่ง", en: "Time spent tracking orders" } },
      },
      {
        title: { th: "การตลาดที่ AI ช่วยอย่างมีกรอบ", en: "AI marketing with guardrails" },
        body: {
          th: "จัดการงบ ครีเอทีฟ กลุ่มเป้าหมาย และการ review โดยทีมยังควบคุมเหตุผลได้",
          en: "Budgets, creative, audiences and review — with the team still in control.",
        },
        tags: ["AI MARKETING"],
        metric: { value: "3×", label: { th: "เวอร์ชันครีเอทีฟต่อสัปดาห์", en: "Creative versions per week" } },
      },
      {
        title: { th: "ทีมขายทำงานต่อจากข้อมูลเดียวกัน", en: "Sales working from one dataset" },
        body: {
          th: "พาลูกค้าและกิจกรรมจากช่องทางต่าง ๆ เข้าสู่กระบวนการติดตามที่ชัดเจน",
          en: "Customers and activity from every channel feed one clear follow-up process.",
        },
        tags: ["SALES WORKFLOW"],
        metric: { value: "1", label: { th: "ฐานข้อมูลลูกค้า แทน 5 ไฟล์", en: "Customer database instead of 5 files" } },
      },
      {
        title: { th: "หน้าบ้านและหลังบ้านไม่แยกขาด", en: "Front and back office, connected" },
        body: {
          th: "เชื่อมเว็บไซต์ ร้านค้า สต็อก การชำระเงิน และงานดูแลให้ข้อมูลเดินต่อ",
          en: "Website, store, inventory, payments and service share one data flow.",
        },
        tags: ["CONNECTED BUSINESS"],
        metric: { value: "4→1", label: { th: "ระบบรวมเป็น flow เดียว", en: "Systems merged into one flow" } },
      },
    ],
  },
  testimonials: {
    label: { th: "เสียงจากลูกค้า", en: "Client voices" },
    title: { th: "ทีมที่ทำงานกับเราพูดถึงเรา", en: "What teams say about working with us" },
    items: [
      {
        quote: {
          th: "เดิมข้อมูลลูกค้าเราอยู่ห้าที่ ตอนนี้ทีมขายกับทีมบริการเห็นข้อมูลชุดเดียวกัน",
          en: "Our customer data used to live in five places. Now sales and service see the same set.",
        },
        name: { th: "ผู้จัดการฝ่ายปฏิบัติการ", en: "Operations Manager" },
        role: { th: "บริษัทค้าปลีก", en: "Retail company" },
      },
      {
        quote: {
          th: "PG Broker API ทำให้ทีมดีลลิ่งเห็นสถานะคำสั่งแบบเรียลไทม์ ลดการโทรถามสถานะลงไปมาก",
          en: "PG Broker API gave our dealing desk real-time order status — the status-check calls have mostly stopped.",
        },
        name: { th: "หัวหน้าฝ่ายเทคโนโลยี", en: "Head of Technology" },
        role: { th: "บริษัทโบรกเกอร์", en: "Brokerage firm" },
      },
    ],
  },
  cta: {
    label: { th: "START A CONVERSATION", en: "START A CONVERSATION" },
    title: { th: "เริ่มจากโจทย์ของคุณ แล้วค่อยวางระบบที่ใช่", en: "Start with your brief, then design the right system" },
    lead: {
      th: "เล่าให้เราฟังว่าทีมกำลังทำงานอย่างไร ข้อมูลอยู่ที่ไหน และอยากให้ระบบช่วยตรงจุดใด เราจะเริ่มจากการทำความเข้าใจ requirements และขอบเขตที่เป็นไปได้",
      en: "Tell us how your team works, where the data lives and where a system should help. We'll start by understanding requirements and what's realistically in scope.",
    },
    button: { th: "คุยโจทย์กับทีม", en: "Talk to the team" },
  },
  contact: {
    address: {
      th: "เลขที่ 502 อาคารเกษร อัมรินทร์ ชั้นที่ 9 ถนนเพลินจิต แขวงลุมพินี เขตปทุมวัน กรุงเทพมหานคร",
      en: "502 Gaysorn Amarin Building, 9th Floor, Phloen Chit Road, Lumphini, Pathum Wan, Bangkok",
    },
    email: "hello@pgsolution.co.th",
  },
  footer: {
    blurb: {
      th: "PG Solution พัฒนาซอฟต์แวร์สำหรับเทคโนโลยีเทรด การตลาดด้วย AI และระบบการทำงานของธุรกิจ",
      en: "PG Solution develops software for trading technology, AI marketing and business operations.",
    },
    note: { th: "PG SOLUTION / สงวนลิขสิทธิ์", en: "PG SOLUTION / ALL RIGHTS RESERVED" },
  },
}
