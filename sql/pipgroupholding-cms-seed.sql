-- =====================================================================================
-- CMS seed — ทุกหน้าของเว็บ + label ของ navbar  (domain_code = 'pipgroupholding')
--
-- หน้าที่อยู่ในไฟล์นี้: Home, AboutUs, OurBusinesses, ContactUs  (ภาษา th + en)
--
-- ปลอดภัยกับ domain อื่น: ทุก statement ฝัง domain_code = 'pipgroupholding' ตายตัว
-- ไม่มี DELETE / TRUNCATE / UPDATE ที่ไม่ผูก domain — ข้อมูล gocprime ไม่ถูกแตะ
-- รันซ้ำได้ (idempotent): ON CONFLICT DO UPDATE ทับเฉพาะแถวของ pipgroupholding
--
-- ต้องมีอยู่ก่อน: domains.domain_code = 'pipgroupholding' และ languages (th, en) ของ domain นี้
-- ถ้าไม่มี -> RAISE EXCEPTION แล้ว rollback ทั้งไฟล์ (ไม่เขียนอะไรเลย)
-- =====================================================================================

BEGIN;

-- 0) preflight ---------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM domains WHERE domain_code = 'pipgroupholding') THEN
    RAISE EXCEPTION 'domains.domain_code = % not found — create the tenant first', 'pipgroupholding';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM languages WHERE domain_code = 'pipgroupholding' AND language_code = 'th' AND status = 'Y') THEN
    RAISE EXCEPTION 'languages (th) missing for domain %', 'pipgroupholding';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM languages WHERE domain_code = 'pipgroupholding' AND language_code = 'en' AND status = 'Y') THEN
    RAISE EXCEPTION 'languages (en) missing for domain %', 'pipgroupholding';
  END IF;
END $$;

-- 1) staging tables (drop อัตโนมัติตอน COMMIT) --------------------------------------
CREATE TEMP TABLE tmp_pages (
  page_code    varchar(128) NOT NULL,
  page_name    varchar(255),
  description  text
) ON COMMIT DROP;

CREATE TEMP TABLE tmp_sections (
  page_code    varchar(128) NOT NULL,
  section_code varchar(64)  NOT NULL,
  description  text,
  sequence     integer      NOT NULL
) ON COMMIT DROP;

CREATE TEMP TABLE tmp_contents (
  page_code    varchar(128) NOT NULL,
  section_code varchar(64)  NOT NULL,
  content_code varchar(512) NOT NULL,
  sequence     integer      NOT NULL,
  content_type varchar(32)  NOT NULL,
  link_url     varchar(1024),
  value_th     text,
  value_en     text,
  attrs_th     jsonb,
  attrs_en     jsonb
) ON COMMIT DROP;

INSERT INTO tmp_pages (page_code, page_name, description) VALUES
  ('Home', 'Home', 'หน้าแรก (Home)'),
  ('AboutUs', 'About Us', 'หน้าเกี่ยวกับเรา (About Us)'),
  ('OurBusinesses', 'Our Businesses', 'หน้าธุรกิจในเครือ (Our Businesses)'),
  ('ContactUs', 'Contact Us', 'หน้าติดต่อเรา (Contact Us)');

INSERT INTO tmp_sections (page_code, section_code, description, sequence) VALUES
  ('Home', '1', 'Hero banner', 1),
  ('Home', '2', 'About us', 2),
  ('Home', '3', 'Why choose us', 3),
  ('Home', '4', 'Our services', 4),
  ('Home', '5', 'Portfolio', 5),
  ('Home', '6', 'Our subsidiaries', 6),
  ('Home', '7', 'Partners', 7),
  ('Home', '8', 'Join our team', 8),
  ('Home', '9', 'Reviews', 9),
  ('Home', '10', 'Closing CTA', 10),
  ('AboutUs', '1', 'Hero banner', 1),
  ('AboutUs', '2', 'History', 2),
  ('AboutUs', '3', 'Our journey', 3),
  ('AboutUs', '4', 'Our value', 4),
  ('AboutUs', '5', 'Trusted by', 5),
  ('AboutUs', '6', 'Vision and mission', 6),
  ('AboutUs', '7', 'Our impact', 7),
  ('AboutUs', '8', 'Message from founder', 8),
  ('AboutUs', '9', 'Our people', 9),
  ('AboutUs', '10', 'Closing CTA', 10),
  ('OurBusinesses', '1', 'Banner', 1),
  ('OurBusinesses', '2', 'Our ecosystem', 2),
  ('OurBusinesses', '3', 'Our company', 3),
  ('OurBusinesses', '4', 'Our philosophy', 4),
  ('OurBusinesses', '5', 'Contact CTA', 5),
  ('ContactUs', '1', 'Banner', 1),
  ('ContactUs', '2', 'Head office', 2),
  ('ContactUs', '3', 'Contact form', 3);

INSERT INTO tmp_contents (page_code, section_code, content_code, sequence, content_type, link_url, value_th, value_en, attrs_th, attrs_en) VALUES
  -- Home
  ('Home', '1', 'eyebrow', 10, 'text', NULL, 'PIP Group Holding', 'PIP Group Holding', NULL, NULL),
  ('Home', '1', 'title1', 20, 'text', NULL, 'สร้างรากฐานที่แข็งแกร่ง', 'Building Strong Foundations', NULL, NULL),
  ('Home', '1', 'title2', 30, 'text', NULL, 'เพื่อการเติบโตอย่างยั่งยืน', 'For Sustainable Growth', NULL, NULL),
  ('Home', '1', 'subTitle', 40, 'text', NULL, E'PIP Group Holding เชื่อมต่อธุรกิจ โอกาส และศักยภาพเชิงกลยุทธ์ \nเพื่อสร้างคุณค่าระยะยาวให้กับทุกภาคส่วน', E'PIP Group Holding connects businesses, opportunities and strategic potential \nto create long-term value for every stakeholder', NULL, NULL),
  ('Home', '1', 'ctaButton', 50, 'button', 'about-us', 'ค้นหาข้อมูลของเรา', 'Explore who we are', NULL, NULL),
  ('Home', '1', 'scrollDown', 60, 'text', NULL, 'Scroll down', 'Scroll down', NULL, NULL),
  ('Home', '1', 'bgImg', 70, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Home banner", "width": 2560, "height": 1440}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Home banner", "width": 2560, "height": 1440}'::jsonb),
  ('Home', '2', 'badge', 10, 'text', NULL, 'เกี่ยวกับเรา', 'About Us', NULL, NULL),
  ('Home', '2', 'title1', 20, 'text', NULL, 'มรดกแห่งความไว้วางใจ', 'A Legacy of Trust', NULL, NULL),
  ('Home', '2', 'title2', 30, 'text', NULL, 'สร้างขึ้นเพื่อตลาดระดับสากล', 'Built for Global Markets', NULL, NULL),
  ('Home', '2', 'description', 40, 'text', NULL, 'ด้วยประสบการณ์กว่าสามทศวรรษ เราเป็นหลักยึดที่มั่นคงให้กับองค์กรที่เผชิญกับการเปลี่ยนแปลงเชิงโครงสร้างเราดำเนินงานที่จุดตัดระหว่างกลยุทธ์ ทางธุรกิจ ข้อมูลเชิงกฎระเบียบ และทุนเพื่อการเปลี่ยนแปลง', 'With more than three decades of experience, we are a steady anchor for organisations facing structural change. We work at the intersection of business strategy, regulatory insight and transformative capital.', NULL, NULL),
  ('Home', '2', 'moreButton', 50, 'button', 'about-us', 'ดูเพิ่มเติมเกี่ยวกับเรา', 'Learn more about us', NULL, NULL),
  ('Home', '2', 'stat1', 60, 'text', NULL, '10+', '10+', '{"icon": "Calendar", "label": "ปีแห่งประสบการณ์"}'::jsonb, '{"icon": "Calendar", "label": "Years of experience"}'::jsonb),
  ('Home', '2', 'stat2', 70, 'text', NULL, '6', '6', '{"icon": "Briefcase", "label": "บริษัทในเครือ"}'::jsonb, '{"icon": "Briefcase", "label": "Subsidiaries"}'::jsonb),
  ('Home', '2', 'stat3', 80, 'text', NULL, '20+', '20+', '{"icon": "Globe", "label": "ผู้เข้าร่วมประสบการณ์"}'::jsonb, '{"icon": "Globe", "label": "Partners and collaborators"}'::jsonb),
  ('Home', '2', 'image', 90, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "About Us", "width": 1000, "height": 1000}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "About Us", "width": 1000, "height": 1000}'::jsonb),
  ('Home', '2', 'highlightValue', 100, 'text', NULL, '100%', '100%', NULL, NULL),
  ('Home', '2', 'highlightLabel', 110, 'text', NULL, 'ความสำเร็จของลูกค้า', 'Client success', NULL, NULL),
  ('Home', '2', 'highlightQuote', 120, 'text', NULL, '"ช่วยเพิ่มประสิทธิภาพและผลกำไรสุทธิองค์กรเฉลี่ยกว่า 35% ตั้งแต่ปีแรก"', '"Lifting organisational efficiency and net profit by an average of 35% from the first year"', NULL, NULL),
  ('Home', '3', 'badge', 10, 'text', NULL, 'ทำไมต้องเลือกเรา', 'Why choose us', NULL, NULL),
  ('Home', '3', 'title1', 20, 'text', NULL, 'สร้างขึ้นเพื่อ', 'Built for ', NULL, NULL),
  ('Home', '3', 'title2', 30, 'text', NULL, 'คุณค่าระยะยาว', 'long-term value', NULL, NULL),
  ('Home', '3', 'item1', 40, 'text', NULL, 'รากฐานที่แข็งแกร่ง', 'Strong foundations', '{"icon": "AlignVerticalJustifyEnd", "number": "01", "description": "วางรากฐานที่มั่นคงให้กับทุกธุรกิจในกลุ่มด้วยระบบ บริหารจัดการที่มีวินัยและการวาง แผนระยะยาว"}'::jsonb, '{"icon": "AlignVerticalJustifyEnd", "number": "01", "description": "A solid base for every business in the group, built on disciplined management and long-term planning"}'::jsonb),
  ('Home', '3', 'item2', 50, 'text', NULL, 'เติบโตอย่างมีกลยุทธ์', 'Strategic growth', '{"icon": "TrendingUp", "number": "02", "description": "ขยายธุรกิจอย่างมีแบบแผน ผ่านกลยุทธ์ ที่ยั่งยืนและปรับให้เหมาะกับแต่ละหน่วยธุรกิจ"}'::jsonb, '{"icon": "TrendingUp", "number": "02", "description": "Expanding to a clear plan, through sustainable strategies tailored to each business unit"}'::jsonb),
  ('Home', '3', 'item3', 60, 'text', NULL, 'โอกาสที่เชื่อมต่อกัน', 'Connected opportunities', '{"icon": "Share2", "number": "03", "description": "สร้างพลังร่วมระหว่างกลุ่ม เชื่อมโยง ทรัพยากร บุคลากร และโอกาสที่ธุรกิจเดียวทำไม่ได้"}'::jsonb, '{"icon": "Share2", "number": "03", "description": "Creating synergy across the group, linking resources, people and opportunities no single business could reach alone"}'::jsonb),
  ('Home', '3', 'item4', 70, 'text', NULL, 'คุณค่าระยะยาว', 'Long-term value', '{"icon": "Clock", "number": "04", "description": "สร้างคุณค่าที่ยั่งยืนให้กับธุรกิจ พาร์ทเนอร์ และผู้มี ส่วนได้ส่วนเสีย วัดผลเป็นทศวรรษ ไม่ใช่รายไตรมาส"}'::jsonb, '{"icon": "Clock", "number": "04", "description": "Building lasting value for our businesses, partners and stakeholders, measured in decades rather than quarters"}'::jsonb),
  ('Home', '4', 'badge', 10, 'text', NULL, 'บริการของเรา', 'Our services', NULL, NULL),
  ('Home', '4', 'titleHighlight1', 20, 'text', NULL, 'การบริการ', 'Our services', NULL, NULL),
  ('Home', '4', 'titleRest1', 30, 'text', NULL, 'และ', ' and', NULL, NULL),
  ('Home', '4', 'titleHighlight2', 40, 'text', NULL, 'ความเชี่ยวชาญ', 'expertise', NULL, NULL),
  ('Home', '4', 'titleRest2', 50, 'text', NULL, 'ของเรา', '', NULL, NULL),
  ('Home', '4', 'description', 60, 'text', NULL, 'เรามีบริการที่หลากหลายเพื่อตอบโจทย์ธุรกิจของคุณ ตั้งแต่ให้คำปรึกษาด้านการเทรด ผลิตคอนเทนต์ ดูแลระบบหลังบ้าน ไปจนถึงพัฒนาระบบต่างๆ', 'From trading advisory and content production to back-office operations and system development, our services are built around what your business needs.', NULL, NULL),
  ('Home', '4', 'service1', 70, 'image', NULL, 'ให้คำปรึกษาด้านการเทรด1', 'Trading advisory 1', '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "ให้คำปรึกษาด้านการเทรด1", "description": "วิเคราะห์ตลาด วางแผนกลยุทธ์การลงทุน ให้คำปรึกษาแบบตัวต่อตัว เพื่อเพิ่มโอกาสในการทำกำไร1"}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Trading advisory 1", "description": "Market analysis, investment strategy and one-on-one advisory to improve your odds of profit 1"}'::jsonb),
  ('Home', '4', 'service2', 80, 'image', NULL, 'ให้คำปรึกษาด้านการเทรด2', 'Trading advisory 2', '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "ให้คำปรึกษาด้านการเทรด2", "description": "วิเคราะห์ตลาด วางแผนกลยุทธ์การลงทุน ให้คำปรึกษาแบบตัวต่อตัว เพื่อเพิ่มโอกาสในการทำกำไร2"}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Trading advisory 2", "description": "Market analysis, investment strategy and one-on-one advisory to improve your odds of profit 2"}'::jsonb),
  ('Home', '4', 'service3', 90, 'image', NULL, 'ให้คำปรึกษาด้านการเทรด3', 'Trading advisory 3', '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "ให้คำปรึกษาด้านการเทรด3", "description": "วิเคราะห์ตลาด วางแผนกลยุทธ์การลงทุน ให้คำปรึกษาแบบตัวต่อตัว เพื่อเพิ่มโอกาสในการทำกำไร3"}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Trading advisory 3", "description": "Market analysis, investment strategy and one-on-one advisory to improve your odds of profit 3"}'::jsonb),
  ('Home', '4', 'service4', 100, 'image', NULL, 'ให้คำปรึกษาด้านการเทรด4', 'Trading advisory 4', '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "ให้คำปรึกษาด้านการเทรด4", "description": "วิเคราะห์ตลาด วางแผนกลยุทธ์การลงทุน ให้คำปรึกษาแบบตัวต่อตัว เพื่อเพิ่มโอกาสในการทำกำไร4"}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Trading advisory 4", "description": "Market analysis, investment strategy and one-on-one advisory to improve your odds of profit 4"}'::jsonb),
  ('Home', '4', 'service5', 110, 'image', NULL, 'ให้คำปรึกษาด้านการเทรด5', 'Trading advisory 5', '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "ให้คำปรึกษาด้านการเทรด5", "description": "วิเคราะห์ตลาด วางแผนกลยุทธ์การลงทุน ให้คำปรึกษาแบบตัวต่อตัว เพื่อเพิ่มโอกาสในการทำกำไร5"}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Trading advisory 5", "description": "Market analysis, investment strategy and one-on-one advisory to improve your odds of profit 5"}'::jsonb),
  ('Home', '4', 'service6', 120, 'image', NULL, 'ให้คำปรึกษาด้านการเทรด6', 'Trading advisory 6', '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "ให้คำปรึกษาด้านการเทรด6", "description": "วิเคราะห์ตลาด วางแผนกลยุทธ์การลงทุน ให้คำปรึกษาแบบตัวต่อตัว เพื่อเพิ่มโอกาสในการทำกำไร6"}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Trading advisory 6", "description": "Market analysis, investment strategy and one-on-one advisory to improve your odds of profit 6"}'::jsonb),
  ('Home', '5', 'badge', 10, 'text', NULL, 'Portfolio', 'Portfolio', NULL, NULL),
  ('Home', '5', 'titleHighlight', 20, 'text', NULL, 'ผลงาน', 'Our work', NULL, NULL),
  ('Home', '5', 'titleRest', 30, 'text', NULL, 'ที่ผ่านมา', ' to date', NULL, NULL),
  ('Home', '5', 'description', 40, 'text', NULL, 'ให้คำปรึกษาด้านการเทรด วางแผนกลยุทธ์การลงทุน ผลิตคอนเทนต์สื่อออนไลน์ ดูแลระบบหลังบ้าน พัฒนาและออกแบบระบบต่างๆ ให้ตอบโจทย์ธุรกิจ', 'Trading advisory, investment strategy, online content production, back-office operations, and system design and development built around each business.', NULL, NULL),
  ('Home', '5', 'image01', 50, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "gocprime/contents/2026-09-08T05-15-37_c1c30aef-34dc-4a9c-8a7d-c522c784bd81.webp", "mediaAltText": "Portfolio 1"}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-09-08T05-15-37_c1c30aef-34dc-4a9c-8a7d-c522c784bd81.webp", "mediaAltText": "Portfolio 1"}'::jsonb),
  ('Home', '5', 'image02', 60, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "gocprime/contents/2026-08-31T07-37-40_c6c231f6-f4cc-4256-af39-2d4253aed3bc.webp", "mediaAltText": "Portfolio 2"}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-31T07-37-40_c6c231f6-f4cc-4256-af39-2d4253aed3bc.webp", "mediaAltText": "Portfolio 2"}'::jsonb),
  ('Home', '5', 'image03', 70, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "gocprime/contents/2026-08-17T02-43-48_3811bcb8-c7a9-454f-9c63-c57b564c5312.jpg", "mediaAltText": "Portfolio 3"}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-17T02-43-48_3811bcb8-c7a9-454f-9c63-c57b564c5312.jpg", "mediaAltText": "Portfolio 3"}'::jsonb),
  ('Home', '5', 'image04', 80, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "gocprime/contents/2026-08-15T05-56-59_2620bc35-3a18-4e6a-ac1d-8bb4e8eb9c5c.png", "mediaAltText": "Portfolio 4"}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-15T05-56-59_2620bc35-3a18-4e6a-ac1d-8bb4e8eb9c5c.png", "mediaAltText": "Portfolio 4"}'::jsonb),
  ('Home', '5', 'image05', 90, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_684083c7-1a5c-41a7-8b85-74bf53785c17.jpg", "mediaAltText": "Portfolio 5"}'::jsonb, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_684083c7-1a5c-41a7-8b85-74bf53785c17.jpg", "mediaAltText": "Portfolio 5"}'::jsonb),
  ('Home', '5', 'image06', 100, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "contents/2026-06-23T11-25-00_ab1b23b4-d065-4c2d-97a0-c37c0c5f00ff.png", "mediaAltText": "Portfolio 6"}'::jsonb, '{"mediaStorageKey": "contents/2026-06-23T11-25-00_ab1b23b4-d065-4c2d-97a0-c37c0c5f00ff.png", "mediaAltText": "Portfolio 6"}'::jsonb),
  ('Home', '5', 'image07', 110, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "contents/2026-06-25T04-51-10_953220f5-da2a-4230-8110-ed90cde194d8.png", "mediaAltText": "Portfolio 7"}'::jsonb, '{"mediaStorageKey": "contents/2026-06-25T04-51-10_953220f5-da2a-4230-8110-ed90cde194d8.png", "mediaAltText": "Portfolio 7"}'::jsonb),
  ('Home', '5', 'image08', 120, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "contents/2026-06-25T04-17-13_1b71f88f-e68f-4d1e-81a7-7007497bed38.jpg", "mediaAltText": "Portfolio 8"}'::jsonb, '{"mediaStorageKey": "contents/2026-06-25T04-17-13_1b71f88f-e68f-4d1e-81a7-7007497bed38.jpg", "mediaAltText": "Portfolio 8"}'::jsonb),
  ('Home', '5', 'image09', 130, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "contents/2026-06-25T04-17-13_46eb786f-0fdd-49a1-8013-1705d2495e32.jpg", "mediaAltText": "Portfolio 9"}'::jsonb, '{"mediaStorageKey": "contents/2026-06-25T04-17-13_46eb786f-0fdd-49a1-8013-1705d2495e32.jpg", "mediaAltText": "Portfolio 9"}'::jsonb),
  ('Home', '5', 'image10', 140, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "contents/2026-06-30T10-39-13_8788ef0a-1bbe-49ed-be3b-030a1df126c0.jpg", "mediaAltText": "Portfolio 10"}'::jsonb, '{"mediaStorageKey": "contents/2026-06-30T10-39-13_8788ef0a-1bbe-49ed-be3b-030a1df126c0.jpg", "mediaAltText": "Portfolio 10"}'::jsonb),
  ('Home', '5', 'image11', 150, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "contents/2026-07-10T05-16-03_0fff04bc-1b96-4b89-9bfb-de0216e2ccd8.jpg", "mediaAltText": "Portfolio 11"}'::jsonb, '{"mediaStorageKey": "contents/2026-07-10T05-16-03_0fff04bc-1b96-4b89-9bfb-de0216e2ccd8.jpg", "mediaAltText": "Portfolio 11"}'::jsonb),
  ('Home', '5', 'image12', 160, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Portfolio 12"}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Portfolio 12"}'::jsonb),
  ('Home', '6', 'badge', 10, 'text', NULL, 'OUR SUBSIDIARIES', 'OUR SUBSIDIARIES', NULL, NULL),
  ('Home', '6', 'title1', 20, 'text', NULL, 'บริษัทในเครือ', 'Subsidiaries of', NULL, NULL),
  ('Home', '6', 'title2', 30, 'text', NULL, 'PIP Group Holding', 'PIP Group Holding', NULL, NULL),
  ('Home', '6', 'description', 40, 'text', NULL, 'กลุ่มบริษัทในเครือของเราผสานจุดแข็งจากหลากหลายอุตสาหกรรมหลัก เพื่อสร้างระบบนิเวศทางธุรกิจที่สมบูรณ์แบบ แข็งแกร่ง และพร้อมขับเคลื่อนเศรษฐกิจในระดับสากล', 'Our subsidiaries combine strengths from several core industries into a complete, resilient business ecosystem ready to drive the economy on a global stage.', NULL, NULL),
  ('Home', '6', 'moreButton', 50, 'button', 'https://www.google.com', 'ดูข้อมูลบริษัทในเครือเพิ่มเติม', 'See more about our subsidiaries', NULL, NULL),
  ('Home', '6', 'company1', 60, 'image', 'https://www.pipgroup.com', 'PIP Evolution', 'PIP Evolution', '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "PIP Evolution", "thaiName": "พิพ อีโวลูชั่น", "description": "PIP Evolution is a leading provider of integrated financial services, offering a wide range of products and solutions to meet the needs of our clients."}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "PIP Evolution", "thaiName": "พิพ อีโวลูชั่น", "description": "PIP Evolution is a leading provider of integrated financial services, offering a wide range of products and solutions to meet the needs of our clients."}'::jsonb),
  ('Home', '6', 'company2', 70, 'image', 'https://www.pipgroup.com', 'Sriwilai Bangkok', 'Sriwilai Bangkok', '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Sriwilai Bangkok", "thaiName": "ศรีวิไล แบงค์คอก", "description": "Sriwilai Bangkok is a leading provider of integrated financial services, offering a wide range of products and solutions to meet the needs of our clients."}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Sriwilai Bangkok", "thaiName": "ศรีวิไล แบงค์คอก", "description": "Sriwilai Bangkok is a leading provider of integrated financial services, offering a wide range of products and solutions to meet the needs of our clients."}'::jsonb),
  ('Home', '6', 'company3', 80, 'image', 'https://www.pipgroup.com', '7Days Academy', '7Days Academy', '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "7Days Academy", "thaiName": "เซเว่นเดย์ อคาเดมี่", "description": "7Days Academy is a leading provider of integrated financial services, offering a wide range of products and solutions to meet the needs of our clients."}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "7Days Academy", "thaiName": "เซเว่นเดย์ อคาเดมี่", "description": "7Days Academy is a leading provider of integrated financial services, offering a wide range of products and solutions to meet the needs of our clients."}'::jsonb),
  ('Home', '6', 'company4', 90, 'image', 'https://www.pipgroup.com', 'DMS Infinite', 'DMS Infinite', '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "DMS Infinite", "thaiName": "ดีเอ็มเอส อินฟินิตี้", "description": "DMS Infinite is a leading provider of integrated financial services, offering a wide range of products and solutions to meet the needs of our clients."}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "DMS Infinite", "thaiName": "ดีเอ็มเอส อินฟินิตี้", "description": "DMS Infinite is a leading provider of integrated financial services, offering a wide range of products and solutions to meet the needs of our clients."}'::jsonb),
  ('Home', '6', 'company5', 100, 'image', 'https://www.pipgroup.com', 'Sabaidee Finx', 'Sabaidee Finx', '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Sabaidee Finx", "thaiName": "สบายดี ฟินซ์", "description": "Sabaidee Finx is a leading provider of integrated financial services, offering a wide range of products and solutions to meet the needs of our clients."}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Sabaidee Finx", "thaiName": "สบายดี ฟินซ์", "description": "Sabaidee Finx is a leading provider of integrated financial services, offering a wide range of products and solutions to meet the needs of our clients."}'::jsonb),
  ('Home', '6', 'company6', 110, 'image', 'https://www.pipgroup.com', 'PG Solution', 'PG Solution', '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "PG Solution", "thaiName": "พีจี โซลูชั่น", "description": "PG Solution is a leading provider of integrated financial services, offering a wide range of products and solutions to meet the needs of our clients."}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "PG Solution", "thaiName": "พีจี โซลูชั่น", "description": "PG Solution is a leading provider of integrated financial services, offering a wide range of products and solutions to meet the needs of our clients."}'::jsonb),
  ('Home', '7', 'eyebrow', 10, 'text', NULL, 'PARTNERS', 'PARTNERS', NULL, NULL),
  ('Home', '7', 'title1', 20, 'text', NULL, 'พาร์ทเนอร์ที่ไว้วางใจ', 'Partners who trust us', NULL, NULL),
  ('Home', '7', 'title2', 30, 'text', NULL, 'เติบโตไปด้วยกัน', 'Growing together', NULL, NULL),
  ('Home', '7', 'quote', 40, 'text', NULL, '"การร่วมมือกับทีมงานของเราช่วยขยายธุรกิจในตลาดเอเชียตะวันออกเฉียงใต้ได้อย่างมีประสิทธิภาพ ด้วยกลยุทธ์ที่แม่นยำและวิสัยทัศน์ที่ชัดเจน"', '"Working with this team let us expand across Southeast Asia efficiently, with precise strategy and a clear vision"', NULL, NULL),
  ('Home', '7', 'logo1', 50, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png", "mediaAltText": "Partner 1"}'::jsonb, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png", "mediaAltText": "Partner 1"}'::jsonb),
  ('Home', '7', 'logo2', 60, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png", "mediaAltText": "Partner 2"}'::jsonb, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png", "mediaAltText": "Partner 2"}'::jsonb),
  ('Home', '7', 'logo3', 70, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png", "mediaAltText": "Partner 3"}'::jsonb, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png", "mediaAltText": "Partner 3"}'::jsonb),
  ('Home', '7', 'logo4', 80, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png", "mediaAltText": "Partner 4"}'::jsonb, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png", "mediaAltText": "Partner 4"}'::jsonb),
  ('Home', '7', 'logo5', 90, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png", "mediaAltText": "Partner 5"}'::jsonb, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png", "mediaAltText": "Partner 5"}'::jsonb),
  ('Home', '7', 'logo6', 100, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png", "mediaAltText": "Partner 6"}'::jsonb, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png", "mediaAltText": "Partner 6"}'::jsonb),
  ('Home', '7', 'logo7', 110, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png", "mediaAltText": "Partner 7"}'::jsonb, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png", "mediaAltText": "Partner 7"}'::jsonb),
  ('Home', '7', 'logo8', 120, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png", "mediaAltText": "Partner 8"}'::jsonb, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png", "mediaAltText": "Partner 8"}'::jsonb),
  ('Home', '7', 'logo9', 130, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png", "mediaAltText": "Partner 9"}'::jsonb, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png", "mediaAltText": "Partner 9"}'::jsonb),
  ('Home', '8', 'badge', 10, 'text', NULL, 'JOIN OUR TEAM', 'JOIN OUR TEAM', NULL, NULL),
  ('Home', '8', 'title1', 20, 'text', NULL, 'ร่วม', 'Join us in ', NULL, NULL),
  ('Home', '8', 'title2', 30, 'text', NULL, 'ขับเคลื่อนการเติบโต', 'driving growth', NULL, NULL),
  ('Home', '8', 'title3', 40, 'text', NULL, 'เพื่อสร้างอนาคตที่ยั่งยืน', 'to build a sustainable future', NULL, NULL),
  ('Home', '8', 'description', 50, 'text', NULL, 'เราดำเนินธุรกิจที่ยึดมั่นในธรรมาภิบาลมุ่งเน้นการสร้างสังคมและระบบเศรษฐกิจเชิงบวกเพื่อ เป็นส่วนหนึ่งในการขับเคลื่อนการพัฒนาอย่างยั่งยืนให้กับสังคมไทยและระดับภูมิภาค', 'We run our businesses on strong governance, focused on positive social and economic impact, as part of driving sustainable development for Thailand and the wider region.', NULL, NULL),
  ('Home', '8', 'benefit1', 60, 'text', NULL, 'วัฒนธรรมองค์กรที่ดี', 'A culture that works', '{"description": "สภาพแวดล้อมการทำงานที่เปิดกว้าง สนับสนุนความคิด สร้างสรรค์ และเติบโตไปด้วยกัน"}'::jsonb, '{"description": "An open working environment that supports creative thinking and growing together"}'::jsonb),
  ('Home', '8', 'benefit2', 70, 'text', NULL, 'โอกาสเติบโต', 'Room to grow', '{"description": "โอกาสเรียนรู้และพัฒนาทักษะ อย่างต่อเนื่องเพื่อเติบโตไปพร้อม กับบริษัท"}'::jsonb, '{"description": "Continuous learning and skill development so you grow along with the company"}'::jsonb),
  ('Home', '8', 'benefit3', 80, 'text', NULL, 'สวัสดิการครบ', 'Full benefits', '{"description": "สวัสดิการและผลประโยชน์ที่ดี เพื่อความมั่นคงและความสุข ของทีมงาน"}'::jsonb, '{"description": "Comprehensive benefits for the security and wellbeing of the team"}'::jsonb),
  ('Home', '8', 'benefit4', 90, 'text', NULL, 'ทีมงานคุณภาพ', 'A strong team', '{"description": "ทีมงานที่มีความเชี่ยวชาญและเป็นมืออาชีพ มาร่วมสร้างผลงานด้วยกัน"}'::jsonb, '{"description": "Skilled, professional colleagues to build great work with"}'::jsonb),
  ('Home', '8', 'ctaButton', 100, 'button', 'contact-us', 'ร่วมงานกับเรา', 'Work with us', NULL, NULL),
  ('Home', '9', 'badge', 10, 'text', NULL, 'ลูกค้าพูดถึงเรา', 'What clients say', NULL, NULL),
  ('Home', '9', 'titleHighlight', 20, 'text', NULL, 'รีวิว', 'Reviews', NULL, NULL),
  ('Home', '9', 'titleRest', 30, 'text', NULL, 'จากลูกค้า', ' from our clients', NULL, NULL),
  ('Home', '9', 'description', 40, 'text', NULL, 'เสียงตอบรับจากลูกค้าที่ไว้วางใจให้เราดูแล', 'Feedback from the clients who trust us with their business.', NULL, NULL),
  ('Home', '9', 'review1', 50, 'text', NULL, 'ทีมงานมีความเป็นมืออาชีพมาก ทั้งการให้คำปรึกษาและบริการด้านการซื้อขายที่ครบวงจร ทำให้เรามั่นใจในการตัดสินใจและขยายธุรกิจได้อย่างมั่นคง', 'The team is highly professional, both in advisory and in end-to-end trading services. It gave us the confidence to decide and to expand steadily.', '{"name": "คุณสมชาย และ คุณวิภา", "role": "ผู้บริหาร, บริษัท ABC Trading"}'::jsonb, '{"name": "Somchai and Wipa", "role": "Executives, ABC Trading"}'::jsonb),
  ('Home', '9', 'review2', 60, 'text', NULL, 'ทีมงานตอบสนองเร็วและเชื่อถือได้ ทำให้เรารู้สึกมั่นใจในความเป็นหุ้นส่วนและสามารถวางแผนต่อเนื่องได้อย่างราบรื่น', 'The team responds fast and is dependable, which makes the partnership feel safe and lets us plan ahead smoothly.', '{"name": "คุณพิมพ์ใจ", "role": "Managing Director, Vertex Solutions"}'::jsonb, '{"name": "Pimjai", "role": "Managing Director, Vertex Solutions"}'::jsonb),
  ('Home', '9', 'review3', 70, 'text', NULL, 'บริการ CRM และการตลาดครบวงจร ช่วยให้เราสามารถติดตามลูกค้าและขยายโอกาสได้อย่างมีประสิทธิภาพมากขึ้น', 'Their end-to-end CRM and marketing services help us track customers and grow opportunities far more effectively.', '{"name": "คุณณัฐพล", "role": "CEO, Golden Capital"}'::jsonb, '{"name": "Nattapon", "role": "CEO, Golden Capital"}'::jsonb),
  ('Home', '9', 'review4', 80, 'text', NULL, 'ระบบหลังบ้านที่วางให้ใช้งานง่ายและลดงานซ้ำซ้อนของทีมไปได้มาก ทำให้เราโฟกัสกับการขายได้เต็มที่', 'The back-office system they set up is easy to use and cut a lot of duplicated work, so the team can focus fully on selling.', '{"name": "คุณอารยา", "role": "COO, Siam Logistics"}'::jsonb, '{"name": "Araya", "role": "COO, Siam Logistics"}'::jsonb),
  ('Home', '9', 'review5', 90, 'text', NULL, 'ประทับใจที่ทีมเข้าใจธุรกิจของเราจริงๆ ไม่ได้เสนอแค่เครื่องมือ แต่ช่วยวางกลยุทธ์ให้เห็นภาพระยะยาวด้วย', 'What impressed us is that the team really understood our business, not just selling tools but helping shape a long-term strategy.', '{"name": "คุณธนกฤต", "role": "ผู้ก่อตั้ง, Nexus Ventures"}'::jsonb, '{"name": "Thanakrit", "role": "Founder, Nexus Ventures"}'::jsonb),
  ('Home', '10', 'title1', 10, 'text', NULL, 'เราไม่ได้แค่สร้างธุรกิจ', 'We do not just build businesses', NULL, NULL),
  ('Home', '10', 'title2', 20, 'text', NULL, 'เราสร้างรากฐานเพื่อการเติบโตที่ยั่งยืน', 'We build foundations for sustainable growth', NULL, NULL),
  ('Home', '10', 'caption', 30, 'text', NULL, 'PIP Group Holding — ประเทศไทย', 'PIP Group Holding — Thailand', NULL, NULL),
  ('Home', '10', 'ctaButton', 40, 'button', 'contact-us', 'ติดต่อเรา', 'Contact us', NULL, NULL),
  ('Home', '10', 'bgImg', 50, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "contents/2026-06-23T11-25-00_ab1b23b4-d065-4c2d-97a0-c37c0c5f00ff.png", "mediaAltText": "", "width": 2000, "height": 1000}'::jsonb, '{"mediaStorageKey": "contents/2026-06-23T11-25-00_ab1b23b4-d065-4c2d-97a0-c37c0c5f00ff.png", "mediaAltText": "", "width": 2000, "height": 1000}'::jsonb),
  -- AboutUs
  ('AboutUs', '1', 'eyebrow', 10, 'text', NULL, 'เรียนรู้เกี่ยวกับ PIP Group Holding', 'Get to know PIP Group Holding', NULL, NULL),
  ('AboutUs', '1', 'title1', 20, 'text', NULL, 'ความเชี่ยวชาญระดับสากล', 'World-class expertise', NULL, NULL),
  ('AboutUs', '1', 'title2', 30, 'text', NULL, 'เพื่อรากฐานและอนาคตที่ยั่งยืน', 'for a strong and sustainable future', NULL, NULL),
  ('AboutUs', '1', 'subTitle', 40, 'text', NULL, E'เราคือกลุ่มบริษัทโฮลดิ้งชั้นนำที่ขับเคลื่อนการเติบโตเชิงกลยุทธ์ \nด้วยการบริหารสินทรัพย์และการดำเนินงานในธุรกิจที่มีศักยภาพสูงอย่างมืออาชีพ', E'We are a leading holding group driving strategic growth \nthrough professional asset management and operations in high-potential businesses', NULL, NULL),
  ('AboutUs', '1', 'scrollDown', 50, 'text', NULL, 'Scroll down', 'Scroll down', NULL, NULL),
  ('AboutUs', '1', 'bgImg', 60, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "About us banner", "width": 2560, "height": 1440}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "About us banner", "width": 2560, "height": 1440}'::jsonb),
  ('AboutUs', '2', 'badge', 10, 'text', NULL, 'HISTORY', 'HISTORY', NULL, NULL),
  ('AboutUs', '2', 'title1', 20, 'text', NULL, 'ประวัติ', 'Our ', NULL, NULL),
  ('AboutUs', '2', 'title2', 30, 'text', NULL, 'ความเป็นมา', 'history', NULL, NULL),
  ('AboutUs', '2', 'subTitle', 40, 'text', NULL, 'เรื่องราวของ Pip Group จากจุดเริ่มต้นจนถึงการเติบโตที่ยั่งยืน', 'The story of Pip Group, from the first step to sustainable growth', NULL, NULL),
  ('AboutUs', '2', 'image', 50, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Pip Group History", "width": 1000, "height": 1000}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Pip Group History", "width": 1000, "height": 1000}'::jsonb),
  ('AboutUs', '2', 'heading1', 60, 'text', NULL, 'เริ่มต้นจากความต้องการที่แท้จริง —', 'It started from a real need —', NULL, NULL),
  ('AboutUs', '2', 'heading2', 70, 'text', NULL, 'ลดช่องว่างระหว่างทีมและประสิทธิภาพ', 'closing the gap between teams and efficiency', NULL, NULL),
  ('AboutUs', '2', 'paragraph1', 80, 'text', NULL, 'Pip Group เกิดขึ้นจากความเชื่อที่ว่าซอฟต์แวร์ไม่ควรยุ่งยากจนเสียเวลา เราเริ่มต้นจากทีมเล็ก ๆ ที่ต้องการแก้ปัญหาการทำงานร่วมกันและประสิทธิภาพให้กับองค์กรที่เติบโตอย่างรวดเร็ว โดยมีวิสัยทัศน์หลักคือการเปลี่ยนความซับซ้อนให้เป็นระบบที่แข็งแกร่งและสวยงาม', 'Pip Group began from a belief that software should not be so complicated that it wastes your time. We started as a small team set on fixing collaboration and efficiency for fast-growing organisations, with one guiding vision: turn complexity into systems that are both robust and beautiful.', NULL, NULL),
  ('AboutUs', '2', 'paragraph2', 90, 'text', NULL, 'ผู้ก่อตั้งเห็นโอกาสที่จะเชื่อมช่องว่างระหว่างทีมวิศวกรรมและทีมออกแบบ โดยไม่บังคับให้ทีมต้องประนีประนอม เราเริ่มสร้างเครื่องมือภายในเพื่อแก้ปัญหาของเราเอง — และสุดท้ายก็กลายเป็นแพลตฟอร์มที่หลาย ๆ องค์กรต้องการ', 'Our founders saw a chance to close the gap between engineering and design without forcing either side to compromise. We built internal tools to solve our own problems — and they became the platform many organisations were looking for.', NULL, NULL),
  ('AboutUs', '2', 'paragraph3', 100, 'text', NULL, 'วันนี้ Pip Group เติบโตเป็นแพลตฟอร์มที่ช่วยให้ธุรกิจสร้างนวัตกรรมอย่างปลอดภัย ขยายขนาดด้วยความมั่นใจ และสร้างความสัมพันธ์ที่ยั่งยืน เรายังคงยึดค่านิยมเรื่องความเรียบง่าย ความโปร่งใส และความพยายามอย่างไม่หยุดยั้งเพื่อความพึงพอใจของผู้ใช้', 'Today Pip Group is a platform that helps businesses innovate safely, scale with confidence and build lasting relationships. We still hold to the same values: simplicity, transparency and a relentless focus on the people who use what we build.', NULL, NULL),
  ('AboutUs', '2', 'stat1', 110, 'text', NULL, '10+', '10+', '{"title": "ปีแห่งความสำเร็จ", "description": "มั่นคงและเติบโตอย่างต่อเนื่อง"}'::jsonb, '{"title": "Years of success", "description": "Stable and continuously growing"}'::jsonb),
  ('AboutUs', '2', 'stat2', 120, 'text', NULL, '20+', '20+', '{"title": "บุคลากรผู้เชี่ยวชาญ", "description": "ทำงานอย่างมืออาชีพ"}'::jsonb, '{"title": "Specialists", "description": "Working professionally"}'::jsonb),
  ('AboutUs', '2', 'stat3', 130, 'text', NULL, '5', '5', '{"title": "บริษัทในเครือ", "description": "เชื่อมโยงระบบธุรกิจที่แข็งแกร่ง"}'::jsonb, '{"title": "Subsidiaries", "description": "A connected, resilient business system"}'::jsonb),
  ('AboutUs', '2', 'stat4', 140, 'text', NULL, '50+', '50+', '{"title": "พาร์ทเนอร์ระดับสากล", "description": "ร่วมสร้างโอกาสระดับสากล"}'::jsonb, '{"title": "Global partners", "description": "Building global opportunities together"}'::jsonb),
  ('AboutUs', '3', 'badge', 10, 'text', NULL, 'OUR JOURNEY', 'OUR JOURNEY', NULL, NULL),
  ('AboutUs', '3', 'title1', 20, 'text', NULL, 'เส้นทาง', 'Our ', NULL, NULL),
  ('AboutUs', '3', 'title2', 30, 'text', NULL, 'การเติบโตของเรา', 'growth journey', NULL, NULL),
  ('AboutUs', '3', 'subTitle', 40, 'text', NULL, 'เรื่องราวสำคัญที่พาเรามาถึงจุดนี้', 'The milestones that brought us here', NULL, NULL),
  ('AboutUs', '3', 'milestone1', 50, 'text', NULL, '2018', '2018', '{"title": "ก่อตั้ง Pip Group", "description": "เริ่มต้นจากทีมเล็ก ๆ ที่มีเป้าหมายสร้างซอฟต์แวร์ที่ดีกว่า เพื่อแก้ปัญหาการทำงานร่วมกันและประสิทธิภาพขององค์กร"}'::jsonb, '{"title": "Pip Group is founded", "description": "A small team set out to build better software, fixing collaboration and efficiency inside organisations"}'::jsonb),
  ('AboutUs', '3', 'milestone2', 60, 'text', NULL, '2020', '2020', '{"title": "ขยายทีมและผลิตภัณฑ์", "description": "เพิ่มทีมวิศวกรรมและออกแบบ ขยายฟีเจอร์หลักและปรับปรุงประสบการณ์ผู้ใช้ให้ดียิ่งขึ้น"}'::jsonb, '{"title": "Team and product grow", "description": "Engineering and design teams grew, core features expanded and the user experience improved"}'::jsonb),
  ('AboutUs', '3', 'milestone3', 70, 'text', NULL, '2022', '2022', '{"title": "ขยายธุรกิจระดับโลก", "description": "ขยายบริการไปยังลูกค้าหลายภูมิภาค พร้อมเสริมความสามารถด้านความปลอดภัยและความน่าเชื่อถือ"}'::jsonb, '{"title": "Going global", "description": "Services expanded to clients across regions, backed by stronger security and reliability"}'::jsonb),
  ('AboutUs', '3', 'milestone4', 80, 'text', NULL, '2023', '2023', '{"title": "ความสำเร็จระดับองค์กร", "description": "ติดอันดับพันธมิตรที่เชื่อถือได้ ร่วมงานกับองค์กรขนาดใหญ่และขยายฐานลูกค้าอย่างต่อเนื่อง"}'::jsonb, '{"title": "Enterprise milestones", "description": "Recognised as a trusted partner, working with large organisations and steadily growing the client base"}'::jsonb),
  ('AboutUs', '3', 'milestone5', 90, 'text', NULL, '2024', '2024', '{"title": "ขยายนวัตกรรม", "description": "เพิ่มฟีเจอร์ใหม่ มาตรฐานความปลอดภัยระดับสูง เพื่อรองรับธุรกิจที่เติบโตอย่างรวดเร็ว"}'::jsonb, '{"title": "Scaling innovation", "description": "New features and high security standards to support fast-growing businesses"}'::jsonb),
  ('AboutUs', '3', 'milestone6', 100, 'text', NULL, '2025', '2025', '{"title": "ก้าวสู่อนาคต", "description": "มุ่งสู่การเป็นแพลตฟอร์มชั้นนำด้านเทคโนโลยีที่ขับเคลื่อนนวัตกรรมสำหรับทุกองค์กร"}'::jsonb, '{"title": "Into the future", "description": "Aiming to be the leading technology platform driving innovation for every organisation"}'::jsonb),
  ('AboutUs', '4', 'badge', 10, 'text', NULL, 'OUR VALUE', 'OUR VALUE', NULL, NULL),
  ('AboutUs', '4', 'titleHighlight1', 20, 'text', NULL, 'จุดแข็ง', 'Our strengths', NULL, NULL),
  ('AboutUs', '4', 'titleRest1', 30, 'text', NULL, 'และ', ' and ', NULL, NULL),
  ('AboutUs', '4', 'titleHighlight2', 40, 'text', NULL, 'ศักยภาพ', 'capabilities', NULL, NULL),
  ('AboutUs', '4', 'titleRest2', 50, 'text', NULL, 'ของเรา', '', NULL, NULL),
  ('AboutUs', '4', 'subTitle', 60, 'text', NULL, 'เราผสมผสานนวัตกรรม ศักยภาพ และทรัพยากรระดับสูงเพื่อความสำเร็จที่โดดเด่นและเป็นเอกลักษณ์', 'We combine innovation, capability and high-grade resources into results that stand apart', NULL, NULL),
  ('AboutUs', '4', 'value1', 70, 'text', NULL, 'นวัตกรรมล้ำสมัย', 'Leading-edge innovation', '{"icon": "Sparkles", "description": "พัฒนาเทคโนโลยีและโซลูชันใหม่อย่างต่อเนื่องเพื่อตอบโจทย์ความต้องการที่ เปลี่ยนแปลงของตลาด"}'::jsonb, '{"icon": "Sparkles", "description": "Continuously developing new technology and solutions for a market that keeps changing"}'::jsonb),
  ('AboutUs', '4', 'value2', 80, 'text', NULL, 'ความปลอดภัยระดับสูง', 'High-grade security', '{"icon": "ShieldCheck", "description": "ระบบรักษาความปลอดภัยได้มาตรฐานสากลปกป้องข้อมูลและทรัพย์สินดิจิทัลของลูกค้า"}'::jsonb, '{"icon": "ShieldCheck", "description": "Security to international standards, protecting client data and digital assets"}'::jsonb),
  ('AboutUs', '4', 'value3', 90, 'text', NULL, 'เครือข่ายระดับสากล', 'A global network', '{"icon": "Globe", "description": "ดำเนินงานและให้บริการลูกค้าทั่วโลก พร้อมทีมผู้เชี่ยวชาญในหลายภูมิภาค"}'::jsonb, '{"icon": "Globe", "description": "Serving clients worldwide, with specialist teams across regions"}'::jsonb),
  ('AboutUs', '4', 'value4', 100, 'text', NULL, 'ประสิทธิภาพเหนือชั้น', 'Outstanding performance', '{"icon": "TrendingUp", "description": "แพลตฟอร์มที่ออกแบบเพื่อความเร็วและความเสถียร รองรับองค์กรขนาดใหญ่"}'::jsonb, '{"icon": "TrendingUp", "description": "A platform designed for speed and stability, built for large organisations"}'::jsonb),
  ('AboutUs', '5', 'badge', 10, 'text', NULL, 'TRUSTED BY', 'TRUSTED BY', NULL, NULL),
  ('AboutUs', '5', 'title1', 20, 'text', NULL, 'ได้รับ', 'Backed and ', NULL, NULL),
  ('AboutUs', '5', 'title2', 30, 'text', NULL, 'การสนับสนุน', 'trusted', NULL, NULL),
  ('AboutUs', '5', 'subTitle', 40, 'text', NULL, 'เสริมพลังให้กับธุรกิจยุคใหม่ ตั้งแต่สตาร์ทอัพจนถึงผู้นำระดับโลก', 'Powering modern businesses, from startups to global leaders', NULL, NULL),
  ('AboutUs', '5', 'logo1', 50, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png", "mediaAltText": "Trusted by 1"}'::jsonb, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png", "mediaAltText": "Trusted by 1"}'::jsonb),
  ('AboutUs', '5', 'logo2', 60, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png", "mediaAltText": "Trusted by 2"}'::jsonb, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png", "mediaAltText": "Trusted by 2"}'::jsonb),
  ('AboutUs', '5', 'logo3', 70, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png", "mediaAltText": "Trusted by 3"}'::jsonb, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png", "mediaAltText": "Trusted by 3"}'::jsonb),
  ('AboutUs', '5', 'logo4', 80, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png", "mediaAltText": "Trusted by 4"}'::jsonb, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png", "mediaAltText": "Trusted by 4"}'::jsonb),
  ('AboutUs', '5', 'logo5', 90, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png", "mediaAltText": "Trusted by 5"}'::jsonb, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png", "mediaAltText": "Trusted by 5"}'::jsonb),
  ('AboutUs', '5', 'logo6', 100, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png", "mediaAltText": "Trusted by 6"}'::jsonb, '{"mediaStorageKey": "contents/2026-06-20T06-16-45_ae03dc50-fba6-4fac-b83e-46440adc58ac.png", "mediaAltText": "Trusted by 6"}'::jsonb),
  ('AboutUs', '6', 'visionTag', 10, 'text', NULL, 'VISION', 'VISION', NULL, NULL),
  ('AboutUs', '6', 'visionTitleAccent', 20, 'text', NULL, 'วิสัยทัศน์', 'Our vision', NULL, NULL),
  ('AboutUs', '6', 'visionTitle', 30, 'text', NULL, 'ของเรา', '', NULL, NULL),
  ('AboutUs', '6', 'visionImage', 40, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Vision", "width": 1200, "height": 900}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Vision", "width": 1200, "height": 900}'::jsonb),
  ('AboutUs', '6', 'visionQuote', 50, 'text', NULL, '"เป็นผู้นำด้านการสร้างสรรค์กลุ่มธุรกิจที่เติบโตอย่างยั่งยืน มีจริยธรรม และส่งมอบผลลัพธ์ที่เป็นเลิศแก่ลูกค้าและผู้มีส่วนได้ส่วนเสียในระดับสากล"', '"To lead in building a group of businesses that grow sustainably and ethically, delivering outstanding results for clients and stakeholders worldwide"', NULL, NULL),
  ('AboutUs', '6', 'visionDescription', 60, 'text', NULL, 'เรามุ่งมั่นผลักดันการพัฒนาโครงสร้างพื้นฐาน นวัตกรรมทางการเงิน และแพลตฟอร์มเทคโนโลยีที่จะเปลี่ยนผ่านสังคมและสร้างอนาคตที่ดีกว่า', 'We push forward infrastructure development, financial innovation and technology platforms that transform society and build a better future', NULL, NULL),
  ('AboutUs', '6', 'missionTag', 70, 'text', NULL, 'MISSION', 'MISSION', NULL, NULL),
  ('AboutUs', '6', 'missionTitleAccent', 80, 'text', NULL, 'พันธกิจ', 'Our mission', NULL, NULL),
  ('AboutUs', '6', 'missionTitle', 90, 'text', NULL, 'ของเรา', '', NULL, NULL),
  ('AboutUs', '6', 'missionImage', 100, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Mission", "width": 1200, "height": 900}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Mission", "width": 1200, "height": 900}'::jsonb),
  ('AboutUs', '6', 'missionPoint1', 110, 'text', NULL, 'การจัดการสินทรัพย์', 'Asset management', '{"description": "บริหารสินทรัพย์และกองทุนด้วยหลักการที่ปลอดภัย โปร่งใส และสร้างผลตอบแทนสูงสุด"}'::jsonb, '{"description": "Managing assets and funds safely and transparently, for the strongest possible return"}'::jsonb),
  ('AboutUs', '6', 'missionPoint2', 120, 'text', NULL, 'สนับสนุนนวัตกรรม', 'Backing innovation', '{"description": "ลงทุนในเทคโนโลยีและระบบที่จะช่วยอำนวยความสะดวกในการทำธุรกิจอย่างรอบด้าน"}'::jsonb, '{"description": "Investing in technology and systems that make doing business easier on every side"}'::jsonb),
  ('AboutUs', '6', 'missionPoint3', 130, 'text', NULL, 'พันธกิจเพื่อสังคม', 'A duty to society', '{"description": "ดำเนินธุรกิจด้วยธรรมาภิบาลและการกำกับดูแลกิจการที่ดีเพื่อสังคมและสิ่งแวดล้อม"}'::jsonb, '{"description": "Running our business on good governance, for both society and the environment"}'::jsonb),
  ('AboutUs', '7', 'badge', 10, 'text', NULL, 'OUR IMPACT', 'OUR IMPACT', NULL, NULL),
  ('AboutUs', '7', 'title1', 20, 'text', NULL, 'ทำงานร่วมกัน', 'Working together, ', NULL, NULL),
  ('AboutUs', '7', 'title2', 30, 'text', NULL, 'สร้างสรรค์สิ่งที่ยิ่งใหญ่', 'building something great', NULL, NULL),
  ('AboutUs', '7', 'subTitle', 40, 'text', NULL, 'วัฒนธรรมของเราส่งเสริมความคิดสร้างสรรค์ การทำงานเป็นทีม และการพัฒนาตนเองอย่างต่อเนื่อง เพื่อสร้างผลงานที่ยั่งยืนและเติบโตไปด้วยกัน', 'Our culture backs creativity, teamwork and continuous self-development, so the work lasts and we grow together', NULL, NULL),
  ('AboutUs', '7', 'videoTitle', 50, 'text', NULL, 'บรรยากาศการทำงาน', 'Life at work', NULL, NULL),
  ('AboutUs', '7', 'expandLabel', 60, 'text', NULL, 'ขยายคลิป', 'Expand video', NULL, NULL),
  ('AboutUs', '7', 'collapseLabel', 70, 'text', NULL, 'ย่อคลิป', 'Collapse video', NULL, NULL),
  ('AboutUs', '7', 'stat1', 80, 'text', NULL, '90%', '90%', '{"label": "ความพึงพอใจของพนักงาน"}'::jsonb, '{"label": "Employee satisfaction"}'::jsonb),
  ('AboutUs', '7', 'stat2', 90, 'text', NULL, '50%', '50%', '{"label": "การเติบโตของทีม"}'::jsonb, '{"label": "Team growth"}'::jsonb),
  ('AboutUs', '7', 'image1', 100, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "ทีมงาน", "width": 1200, "height": 900}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Our team", "width": 1200, "height": 900}'::jsonb),
  ('AboutUs', '7', 'image2', 110, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "การทำงานร่วมกัน", "width": 1200, "height": 900}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Collaboration", "width": 1200, "height": 900}'::jsonb),
  ('AboutUs', '8', 'badge', 10, 'text', NULL, 'MESSAGE FROM FOUNDER', 'MESSAGE FROM FOUNDER', NULL, NULL),
  ('AboutUs', '8', 'title1', 20, 'text', NULL, 'คำพูด', 'A message ', NULL, NULL),
  ('AboutUs', '8', 'title2', 30, 'text', NULL, 'จากผู้ก่อตั้ง', 'from our founder', NULL, NULL),
  ('AboutUs', '8', 'paragraph1', 40, 'text', NULL, 'ก่อนเริ่มเดินทางนี้ ทีมของเราตั้งเป้าที่จะแก้ปัญหาการทำงานที่ยุ่งยากแต่เกิดขึ้นซ้ำ ๆ ในโครงสร้างการทำงานร่วมสมัย เราเชื่อว่าเครื่องมือไม่ควรบังคับให้ทีมวิศวกรรม หรือทีมออกแบบต้องประนีประนอม', 'Before this journey began, our team set out to fix the awkward, repetitive work that modern collaboration keeps producing. We believe tools should never force engineering or design to compromise.', NULL, NULL),
  ('AboutUs', '8', 'paragraph2', 50, 'text', NULL, 'สิ่งที่เริ่มต้นจากทีมวิจัยภายในได้เติบโตเป็นแพลตฟอร์มระดับโลก เราจัดการพัฒนาอย่างปลอดภัย ออโตเมตการปล่อยสู่ตลาดอย่างราบรื่น และนำเสนอข้อมูลเชิงลึกที่ชัดเจนจากชุดข้อมูลที่ซับซ้อน', 'What began as an internal research team has grown into a global platform. We keep development safe, automate releases smoothly, and turn complex data into clear insight.', NULL, NULL),
  ('AboutUs', '8', 'paragraph3', 60, 'text', NULL, 'ขอขอบคุณที่ไว้วางใจเราในการดูแลซอฟต์แวร์ของคุณ เรารอคอยที่จะสร้างสิ่งที่จะเกิดขึ้นต่อไปไปด้วยกัน', 'Thank you for trusting us with your software. We look forward to building what comes next, together.', NULL, NULL),
  ('AboutUs', '8', 'founderName', 70, 'text', NULL, 'ผู้ก่อตั้ง', 'Founder', NULL, NULL),
  ('AboutUs', '8', 'founderRole', 80, 'text', NULL, 'ผู้ก่อตั้งและซีอีโอ, Indiglo', 'Founder and CEO, Indiglo', NULL, NULL),
  ('AboutUs', '8', 'image', 90, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "ผู้ก่อตั้ง", "width": 1200, "height": 900}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Founder", "width": 1200, "height": 900}'::jsonb),
  ('AboutUs', '9', 'badge', 10, 'text', NULL, 'OUR PEOPLE', 'OUR PEOPLE', NULL, NULL),
  ('AboutUs', '9', 'title1', 20, 'text', NULL, 'รู้จัก', 'Meet the ', NULL, NULL),
  ('AboutUs', '9', 'title2', 30, 'text', NULL, 'ทีมงาน', 'team', NULL, NULL),
  ('AboutUs', '9', 'subTitle', 40, 'text', NULL, 'เบื้องหลังทุกโครงการคือทีมงาน Pip Group ที่มุ่งมั่นสร้างสรรค์นวัตกรรม ด้วยประสบการณ์และความเชี่ยวชาญกว่า 15 ปี', 'Behind every project is the Pip Group team, driving innovation with more than 15 years of experience', NULL, NULL),
  ('AboutUs', '9', 'person1', 50, 'image', NULL, 'Ethan Clarke', 'Ethan Clarke', '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Ethan Clarke", "role": "CEO"}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Ethan Clarke", "role": "CEO"}'::jsonb),
  ('AboutUs', '9', 'person2', 60, 'image', NULL, 'Grace Turner', 'Grace Turner', '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Grace Turner", "role": "หัวหน้าทีมออกแบบ"}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Grace Turner", "role": "Head of Design"}'::jsonb),
  ('AboutUs', '9', 'person3', 70, 'image', NULL, 'Esther Howard', 'Esther Howard', '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Esther Howard", "role": "นักพัฒนาหลักทรัพย์"}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Esther Howard", "role": "Securities Developer"}'::jsonb),
  ('AboutUs', '9', 'person4', 80, 'image', NULL, 'Jhonni Dee', 'Jhonni Dee', '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Jhonni Dee", "role": "หัวหน้าทีมวิศวกรรม"}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Jhonni Dee", "role": "Head of Engineering"}'::jsonb),
  ('AboutUs', '9', 'person5', 90, 'image', NULL, 'Marcus Reid', 'Marcus Reid', '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Marcus Reid", "role": "ผู้จัดการฝ่ายการตลาด"}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Marcus Reid", "role": "Marketing Manager"}'::jsonb),
  ('AboutUs', '10', 'title', 10, 'text', NULL, 'ก้าวไปข้างหน้า อย่างมั่นคงด้วยกัน', 'Moving forward, steadily, together', NULL, NULL),
  ('AboutUs', '10', 'subTitle', 20, 'text', NULL, 'มุ่งมั่นสร้างการเติบโตที่ยั่งยืน ด้วยวิสัยทัศน์และความร่วมมือที่แข็งแกร่ง', 'Committed to sustainable growth, through clear vision and strong partnership', NULL, NULL),
  ('AboutUs', '10', 'ctaButton', 30, 'button', 'contact-us', 'ติดต่อเรา', 'Contact us', NULL, NULL),
  ('AboutUs', '10', 'bgImg', 40, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "", "width": 2000, "height": 1000}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "", "width": 2000, "height": 1000}'::jsonb),
  -- OurBusinesses
  ('OurBusinesses', '1', 'eyebrow', 10, 'text', NULL, 'กลุ่มธุรกิจในเครือ PIP Group Holding', 'The PIP Group Holding family of businesses', NULL, NULL),
  ('OurBusinesses', '1', 'title1', 20, 'text', NULL, 'กลุ่มธุรกิจที่เชื่อมโยงกัน', 'Businesses that connect', NULL, NULL),
  ('OurBusinesses', '1', 'title2', 30, 'text', NULL, 'เพื่อการเติบโตอย่างยั่งยืน', 'for sustainable growth', NULL, NULL),
  ('OurBusinesses', '1', 'scrollDown', 40, 'text', NULL, 'Scroll down', 'Scroll down', NULL, NULL),
  ('OurBusinesses', '1', 'bgImg', 50, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Our Businesses banner", "width": 2560, "height": 1440}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Our Businesses banner", "width": 2560, "height": 1440}'::jsonb),
  ('OurBusinesses', '2', 'badge', 10, 'text', NULL, 'OUR ECOSYSTEM', 'OUR ECOSYSTEM', NULL, NULL),
  ('OurBusinesses', '2', 'title1', 20, 'text', NULL, 'เชื่อมโยงธุรกิจ ', 'Connecting businesses, ', NULL, NULL),
  ('OurBusinesses', '2', 'title2', 30, 'text', NULL, 'สร้างคุณค่าอย่างยั่งยืน', 'creating lasting value', NULL, NULL),
  ('OurBusinesses', '2', 'descriptionLead', 40, 'text', NULL, 'PIP Group Holding', 'PIP Group Holding', NULL, NULL),
  ('OurBusinesses', '2', 'description', 50, 'text', NULL, 'ดำเนินธุรกิจ​ผ่าน​บริษัทในเครือ​ที่มี​ความเชี่ยวชาญ​ใน​หลากหลายอุตสาหกรรม เพื่อสร้าง​การเติบโต​อย่างต่อเนื่อง​และยั่งยืน', 'operates​through​subsidiaries​with​expertise​across​many industries, building​growth​that is​continuous and sustainable', NULL, NULL),
  ('OurBusinesses', '2', 'stat1', 60, 'text', NULL, '6 +', '6 +', '{"icon": "Building2", "label": "บริษัทในเครือ"}'::jsonb, '{"icon": "Building2", "label": "Subsidiaries"}'::jsonb),
  ('OurBusinesses', '2', 'stat2', 70, 'text', NULL, '5', '5', '{"icon": "LayoutGrid", "label": "กลุ่มอุตสาหกรรม"}'::jsonb, '{"icon": "LayoutGrid", "label": "Industries"}'::jsonb),
  ('OurBusinesses', '2', 'stat3', 80, 'text', NULL, '99%', '99%', '{"icon": "TrendingUp", "label": "โอกาสในการเติบโต"}'::jsonb, '{"icon": "TrendingUp", "label": "Growth potential"}'::jsonb),
  ('OurBusinesses', '3', 'badge', 10, 'text', NULL, 'OUR COMPANY', 'OUR COMPANY', NULL, NULL),
  ('OurBusinesses', '3', 'title1', 20, 'text', NULL, 'ธุรกิจในเครือ ', 'Companies in ', NULL, NULL),
  ('OurBusinesses', '3', 'title2', 30, 'text', NULL, 'PIP Group Holding', 'PIP Group Holding', NULL, NULL),
  ('OurBusinesses', '3', 'description', 40, 'text', NULL, 'เราดำเนินธุรกิจในหลากหลายอุตสาหกรรม ครอบคลุมตั้งแต่เทคโนโลยี การศึกษา การตลาด ไปจนถึงโลจิสติกส์ขององค์กร เพื่อสร้างคุณค่าให้กับลูกค้าและสังคม', 'We operate across many industries — technology, education, marketing and enterprise logistics — to create value for our clients and for society.', NULL, NULL),
  ('OurBusinesses', '3', 'detailLabel', 50, 'text', NULL, 'ดูรายละเอียด', 'View details', NULL, NULL),
  ('OurBusinesses', '3', 'company1', 60, 'image', '#', 'PIP EVOLUTION', 'PIP EVOLUTION', '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "PIP EVOLUTION", "width": 1200, "height": 800, "number": "01", "category": "INVESTMENT & DIGITAL", "description": "ธุรกิจด้านการลงทุน และพัฒนาธุรกิจดิจิทัล มุ่งสร้างโอกาสใหม่ในอนาคตที่มีศักยภาพ", "tags": ["Investment", "Digital Business", "Venture"]}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "PIP EVOLUTION", "width": 1200, "height": 800, "number": "01", "category": "INVESTMENT & DIGITAL", "description": "Investment and digital business development, building new opportunities with real potential", "tags": ["Investment", "Digital Business", "Venture"]}'::jsonb),
  ('OurBusinesses', '3', 'company2', 70, 'image', '#', 'SRIWILAI ENTERPRISE', 'SRIWILAI ENTERPRISE', '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "SRIWILAI ENTERPRISE", "width": 1200, "height": 800, "number": "02", "category": "DIGITAL MARKETING AGENCY", "description": "ธุรกิจด้านการวางแผนและการตลาดออนไลน์ ครบวงจร สำหรับธุรกิจยุคดิจิทัล", "tags": ["Marketing", "Consulting", "Digital Solutions"]}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "SRIWILAI ENTERPRISE", "width": 1200, "height": 800, "number": "02", "category": "DIGITAL MARKETING AGENCY", "description": "End-to-end online marketing and planning for businesses in the digital era", "tags": ["Marketing", "Consulting", "Digital Solutions"]}'::jsonb),
  ('OurBusinesses', '3', 'company3', 80, 'image', '#', '7DAYS ACADEMY', '7DAYS ACADEMY', '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "7DAYS ACADEMY", "width": 1200, "height": 800, "number": "03", "category": "EDUCATION & UPSKILLING", "description": "ธุรกิจด้านการศึกษา และพัฒนาศักยภาพ บุคคลและองค์กร", "tags": ["Education", "Training", "Personal Development"]}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "7DAYS ACADEMY", "width": 1200, "height": 800, "number": "03", "category": "EDUCATION & UPSKILLING", "description": "Education and capability development for individuals and organisations", "tags": ["Education", "Training", "Personal Development"]}'::jsonb),
  ('OurBusinesses', '3', 'company4', 90, 'image', '#', 'DMS INFINITE', 'DMS INFINITE', '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "DMS INFINITE", "width": 1200, "height": 800, "number": "04", "category": "TECH & DIGITAL SOLUTIONS", "description": "ธุรกิจด้านเทคโนโลยีและโซลูชันดิจิทัล เพื่อเพิ่มประสิทธิภาพการดำเนินงาน", "tags": ["Technology", "Innovation", "Business Solution"]}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "DMS INFINITE", "width": 1200, "height": 800, "number": "04", "category": "TECH & DIGITAL SOLUTIONS", "description": "Technology and digital solutions that make operations more efficient", "tags": ["Technology", "Innovation", "Business Solution"]}'::jsonb),
  ('OurBusinesses', '3', 'company5', 100, 'image', '#', 'SABAIDEE FINX', 'SABAIDEE FINX', '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "SABAIDEE FINX", "width": 1200, "height": 800, "number": "05", "category": "FINANCE & MEDIA", "description": "ธุรกิจด้านการเงินและคอนเทนต์ เพื่อเสริมสร้างความรู้ทางการเงิน", "tags": ["Finance", "Content", "Community"]}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "SABAIDEE FINX", "width": 1200, "height": 800, "number": "05", "category": "FINANCE & MEDIA", "description": "Finance and content, strengthening financial literacy", "tags": ["Finance", "Content", "Community"]}'::jsonb),
  ('OurBusinesses', '3', 'company6', 110, 'image', '#', 'PG SOLUTION', 'PG SOLUTION', '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "PG SOLUTION", "width": 1200, "height": 800, "number": "06", "category": "ENTERPRISE IT ARCHITECTURE", "description": "ธุรกิจด้านระบบไอทีและโซลูชันองค์กร เพื่อรองรับการเติบโตของธุรกิจ", "tags": ["IT Solution", "System Integration", "Enterprise"]}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "PG SOLUTION", "width": 1200, "height": 800, "number": "06", "category": "ENTERPRISE IT ARCHITECTURE", "description": "Enterprise IT systems and solutions that support business growth", "tags": ["IT Solution", "System Integration", "Enterprise"]}'::jsonb),
  ('OurBusinesses', '4', 'badge', 10, 'text', NULL, 'OUR PHILOSOPHY', 'OUR PHILOSOPHY', NULL, NULL),
  ('OurBusinesses', '4', 'quote', 20, 'text', NULL, E'เราดำเนินงานในกลุ่มบริษัทที่มีความสอดคล้องกัน ในทุกส่วนของการเติบโตที่สำคัญ\nโดยใช้ประโยชน์จากความเชี่ยวชาญร่วมกัน เพื่อขับเคลื่อนความเป็นเลิศขององค์กร\nและสร้างอนาคตที่ยั่งยืนในระยะยาว', E'We operate as a group of businesses aligned across every part of growth that matters,\ndrawing on shared expertise to drive organisational excellence\nand build a future that lasts.', NULL, NULL),
  ('OurBusinesses', '5', 'title', 10, 'text', NULL, 'ร่วมสร้างอนาคตไปด้วยกัน', 'Let us build the future together', NULL, NULL),
  ('OurBusinesses', '5', 'description1', 20, 'text', NULL, 'เชื่อมต่อกับ PIP Group Holding เพื่อสำรวจโอกาสใหม่ ', 'Connect with PIP Group Holding to explore new opportunities, ', NULL, NULL),
  ('OurBusinesses', '5', 'descriptionNowrap', 30, 'text', NULL, 'ความร่วมมือ', 'partnerships', NULL, NULL),
  ('OurBusinesses', '5', 'description2', 40, 'text', NULL, E'\nและการเติบโตที่ยั่งยืน', E'\nand sustainable growth', NULL, NULL),
  ('OurBusinesses', '5', 'ctaButton', 50, 'button', 'contact-us', 'ติดต่อเรา', 'Contact us', NULL, NULL),
  ('OurBusinesses', '5', 'bgImg', 60, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": ""}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": ""}'::jsonb),
  -- ContactUs
  ('ContactUs', '1', 'eyebrow', 10, 'text', NULL, 'ติดต่อ PIP Group Holding', 'Contact PIP Group Holding', NULL, NULL),
  ('ContactUs', '1', 'title1', 20, 'text', NULL, 'ติดต่อ', 'Talk ', NULL, NULL),
  ('ContactUs', '1', 'title2', 30, 'text', NULL, 'พูดคุยกับเรา', 'with us', NULL, NULL),
  ('ContactUs', '1', 'description', 40, 'text', NULL, 'ติดต่อ​PIP Group Holding เรายินดี​รับ​ข้อสอบถาม​เกี่ยวกับ​โอกาส​การลงทุน การประชาสัมพันธ์ และ​การกำกับดูแล​กิจการ', 'Contact​PIP Group Holding. We welcome​enquiries​about​investment​opportunities, media relations and​corporate​governance', NULL, NULL),
  ('ContactUs', '1', 'scrollDown', 50, 'text', NULL, 'Scroll down', 'Scroll down', NULL, NULL),
  ('ContactUs', '1', 'bgImg', 60, 'image', NULL, NULL, NULL, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Contact Us banner", "width": 2560, "height": 1440}'::jsonb, '{"mediaStorageKey": "gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp", "mediaAltText": "Contact Us banner", "width": 2560, "height": 1440}'::jsonb),
  ('ContactUs', '2', 'title', 10, 'text', NULL, 'Head Office', 'Head Office', NULL, NULL),
  ('ContactUs', '2', 'detail1', 20, 'text', NULL, '502 อาคารเกษร อัมรินทร์ ห้องเลขที่ 8A ชั้น 9 ถนนเพลินจิต แขวงลุมพินี เขตปทุมวัน กรุงเทพมหานคร 10330', '502 Gaysorn Amarin Building, Unit 8A, 9th Floor, Ploenchit Road, Lumphini, Pathum Wan, Bangkok 10330', '{"icon": "MapPin", "label": "ที่อยู่"}'::jsonb, '{"icon": "MapPin", "label": "Address"}'::jsonb),
  ('ContactUs', '2', 'detail2', 30, 'text', NULL, '02 000 0000', '02 000 0000', '{"icon": "Phone", "label": "เบอร์โทร"}'::jsonb, '{"icon": "Phone", "label": "Phone"}'::jsonb),
  ('ContactUs', '2', 'detail3', 40, 'text', NULL, 'support@pipgroup.com', 'support@pipgroup.com', '{"icon": "Mail", "label": "อีเมล"}'::jsonb, '{"icon": "Mail", "label": "Email"}'::jsonb),
  ('ContactUs', '2', 'detail4', 50, 'text', NULL, 'จันทร์ - ศุกร์: 10:00น. - 19:00น.', 'Mon - Fri: 10:00 - 19:00', '{"icon": "Clock", "label": "เวลาทำการ"}'::jsonb, '{"icon": "Clock", "label": "Office hours"}'::jsonb),
  ('ContactUs', '3', 'title', 10, 'text', NULL, 'ส่งข้อความถึงเรา', 'Send us a message', NULL, NULL),
  ('ContactUs', '3', 'subTitle', 20, 'text', NULL, 'กรุณา​กรอก​ข้อมูล​ด้านล่าง แล้ว​ทีมงาน​ของเรา​จะ​ติดต่อกลับ​หาคุณ​โดยเร็วที่สุด', 'Fill in​the form​below and our team​will get back​to you​as soon as possible', NULL, NULL),
  ('ContactUs', '3', 'field1', 30, 'text', NULL, 'ชื่อ – นามสกุล', 'Full name', '{"name": "fullName", "type": "text", "autoComplete": "name", "placeholder": "กรอกชื่อผู้ติดต่อ หรือชื่อแบรนด์ของคุณ"}'::jsonb, '{"name": "fullName", "type": "text", "autoComplete": "name", "placeholder": "Your name or your brand"}'::jsonb),
  ('ContactUs', '3', 'field2', 40, 'text', NULL, 'อีเมล', 'Email', '{"name": "email", "type": "email", "autoComplete": "email", "placeholder": "email@example.com"}'::jsonb, '{"name": "email", "type": "email", "autoComplete": "email", "placeholder": "email@example.com"}'::jsonb),
  ('ContactUs', '3', 'field3', 50, 'text', NULL, 'เบอร์โทรศัพท์', 'Phone', '{"name": "phone", "type": "tel", "autoComplete": "tel", "placeholder": "000-000-0000"}'::jsonb, '{"name": "phone", "type": "tel", "autoComplete": "tel", "placeholder": "000-000-0000"}'::jsonb),
  ('ContactUs', '3', 'topicLabel', 60, 'text', NULL, 'ระบุหัวข้อที่ต้องการติดต่อ', 'What is this about?', NULL, NULL),
  ('ContactUs', '3', 'topicPlaceholder', 70, 'text', NULL, 'กรุณาเลือกหัวข้อที่ต้องการติดต่อ', 'Please choose a topic', NULL, NULL),
  ('ContactUs', '3', 'topic1', 80, 'text', NULL, 'โอกาสทางธุรกิจ', 'Business opportunity', '{"code": "business"}'::jsonb, '{"code": "business"}'::jsonb),
  ('ContactUs', '3', 'topic2', 90, 'text', NULL, 'การลงทุน', 'Investment', '{"code": "investment"}'::jsonb, '{"code": "investment"}'::jsonb),
  ('ContactUs', '3', 'topic3', 100, 'text', NULL, 'ความร่วมมือและพันธมิตร', 'Partnership', '{"code": "partnership"}'::jsonb, '{"code": "partnership"}'::jsonb),
  ('ContactUs', '3', 'topic4', 110, 'text', NULL, 'การประชาสัมพันธ์', 'Media and press', '{"code": "press"}'::jsonb, '{"code": "press"}'::jsonb),
  ('ContactUs', '3', 'topic5', 120, 'text', NULL, 'ร่วมงานกับเรา', 'Careers', '{"code": "career"}'::jsonb, '{"code": "career"}'::jsonb),
  ('ContactUs', '3', 'topic6', 130, 'text', NULL, 'อื่น ๆ', 'Other', '{"code": "other"}'::jsonb, '{"code": "other"}'::jsonb),
  ('ContactUs', '3', 'messageLabel', 140, 'text', NULL, 'ข้อความของคุณ', 'Your message', NULL, NULL),
  ('ContactUs', '3', 'messagePlaceholder', 150, 'text', NULL, 'พิมพ์ข้อความของคุณที่นี่', 'Type your message here', NULL, NULL),
  ('ContactUs', '3', 'submitButton', 160, 'button', NULL, 'ส่งข้อความ', 'Send message', NULL, NULL),
  ('ContactUs', '3', 'footnote', 170, 'text', NULL, 'ทีมงานของเราจะติดต่อกลับภายใน 24 ชั่วโมงในวันทำการ', 'Our team will get back to you within 24 hours on business days', NULL, NULL);

-- 2) content_pages -----------------------------------------------------------------
INSERT INTO content_pages
  (id, uuid, status, created_date, created_by, updated_date, updated_by, created_program, updated_program, version,
   domain_code, page_code, page_name, page_slug, description, fallback_language_code, parent_page_code)
SELECT nextval('content_pages_id_seq'::regclass), gen_random_uuid(), 'Y', now(), 'seed-pipgroupholding', now(), 'seed-pipgroupholding', 'seed-pipgroupholding', 'seed-pipgroupholding', 1,
       'pipgroupholding', p.page_code, p.page_name, '', p.description, 'th', NULL
FROM tmp_pages p
ON CONFLICT (domain_code, page_code) DO UPDATE SET
  status = 'Y',
  page_name = EXCLUDED.page_name,
  description = EXCLUDED.description,
  fallback_language_code = EXCLUDED.fallback_language_code,
  updated_date = now(),
  updated_by = EXCLUDED.updated_by,
  updated_program = EXCLUDED.updated_program;

-- 3) content_headers (section ของแต่ละหน้า ตามลำดับที่แสดงจริง) ----------------------
INSERT INTO content_headers
  (id, uuid, status, created_date, created_by, updated_date, updated_by, created_program, updated_program, version,
   domain_code, page_code, section_code, description, sequence)
SELECT nextval('content_headers_id_seq'::regclass), gen_random_uuid(), 'Y', now(), 'seed-pipgroupholding', now(), 'seed-pipgroupholding', 'seed-pipgroupholding', 'seed-pipgroupholding', 1,
       'pipgroupholding', s.page_code, s.section_code, s.description, s.sequence
FROM tmp_sections s
ON CONFLICT (domain_code, page_code, section_code) DO UPDATE SET
  status = 'Y',
  description = EXCLUDED.description,
  sequence = EXCLUDED.sequence,
  updated_date = now(),
  updated_by = EXCLUDED.updated_by,
  updated_program = EXCLUDED.updated_program;

-- 4) translate_contents (คีย์ของ content) ------------------------------------------
INSERT INTO translate_contents
  (id, uuid, status, created_date, created_by, updated_date, updated_by, created_program, updated_program, version,
   domain_code, page_code, section_code, translate_content_code, description, sequence)
SELECT nextval('translate_contents_id_seq'::regclass), gen_random_uuid(), 'Y', now(), 'seed-pipgroupholding', now(), 'seed-pipgroupholding', 'seed-pipgroupholding', 'seed-pipgroupholding', 1,
       'pipgroupholding', c.page_code, c.section_code, c.content_code, NULL, c.sequence
FROM tmp_contents c
ON CONFLICT (domain_code, page_code, section_code, translate_content_code) DO UPDATE SET
  status = 'Y',
  sequence = EXCLUDED.sequence,
  updated_date = now(),
  updated_by = EXCLUDED.updated_by,
  updated_program = EXCLUDED.updated_program;

-- 5.th) translate_content_values (th) ------------------------------------------------
INSERT INTO translate_content_values
  (id, uuid, status, created_date, created_by, updated_date, updated_by, created_program, updated_program, version,
   domain_code, language_code, page_code, section_code, translate_content_code,
   value, link_url, media_storage_key, content_type, attributes)
SELECT nextval('translate_content_values_id_seq'::regclass), gen_random_uuid(), 'Y', now(), 'seed-pipgroupholding', now(), 'seed-pipgroupholding', 'seed-pipgroupholding', 'seed-pipgroupholding', 1,
       'pipgroupholding', 'th', c.page_code, c.section_code, c.content_code,
       c.value_th, c.link_url, NULL, c.content_type, c.attrs_th
FROM tmp_contents c
ON CONFLICT (domain_code, page_code, section_code, translate_content_code, language_code) DO UPDATE SET
  status = 'Y',
  value = EXCLUDED.value,
  link_url = EXCLUDED.link_url,
  content_type = EXCLUDED.content_type,
  attributes = EXCLUDED.attributes,
  updated_date = now(),
  updated_by = EXCLUDED.updated_by,
  updated_program = EXCLUDED.updated_program;

-- 5.en) translate_content_values (en) ------------------------------------------------
INSERT INTO translate_content_values
  (id, uuid, status, created_date, created_by, updated_date, updated_by, created_program, updated_program, version,
   domain_code, language_code, page_code, section_code, translate_content_code,
   value, link_url, media_storage_key, content_type, attributes)
SELECT nextval('translate_content_values_id_seq'::regclass), gen_random_uuid(), 'Y', now(), 'seed-pipgroupholding', now(), 'seed-pipgroupholding', 'seed-pipgroupholding', 'seed-pipgroupholding', 1,
       'pipgroupholding', 'en', c.page_code, c.section_code, c.content_code,
       c.value_en, c.link_url, NULL, c.content_type, c.attrs_en
FROM tmp_contents c
ON CONFLICT (domain_code, page_code, section_code, translate_content_code, language_code) DO UPDATE SET
  status = 'Y',
  value = EXCLUDED.value,
  link_url = EXCLUDED.link_url,
  content_type = EXCLUDED.content_type,
  attributes = EXCLUDED.attributes,
  updated_date = now(),
  updated_by = EXCLUDED.updated_by,
  updated_program = EXCLUDED.updated_program;

-- 6) navbar labels — translate_groups + translate_values (CSR / next-intl) ----------
INSERT INTO translate_groups
  (id, uuid, status, created_date, created_by, updated_date, updated_by, created_program, updated_program, version,
   domain_code, translate_group_code, description)
SELECT nextval('translate_groups_id_seq'::regclass), gen_random_uuid(), 'Y', now(), 'seed-pipgroupholding', now(), 'seed-pipgroupholding', 'seed-pipgroupholding', 'seed-pipgroupholding', 1,
       'pipgroupholding', g.translate_group_code, g.description
FROM (VALUES
  ('navbar.home', 'Navbar: home'),
  ('navbar.about', 'Navbar: about us'),
  ('navbar.ourBusinesses', 'Navbar: our businesses'),
  ('navbar.contactUs', 'Navbar: contact us'),
  ('navbar.signIn', 'Navbar: sign in button'),
  ('navbar.startTrading', 'Navbar: primary CTA button'),
  ('navbar.language', 'Navbar: language selector label')
) AS g(translate_group_code, description)
ON CONFLICT (domain_code, translate_group_code) DO UPDATE SET
  status = 'Y',
  description = EXCLUDED.description,
  updated_date = now(),
  updated_by = EXCLUDED.updated_by,
  updated_program = EXCLUDED.updated_program;

INSERT INTO translate_values
  (id, uuid, status, created_date, created_by, updated_date, updated_by, created_program, updated_program, version,
   domain_code, language_code, translate_group_code, value)
SELECT nextval('translate_values_id_seq'::regclass), gen_random_uuid(), 'Y', now(), 'seed-pipgroupholding', now(), 'seed-pipgroupholding', 'seed-pipgroupholding', 'seed-pipgroupholding', 1,
       'pipgroupholding', v.language_code, v.translate_group_code, v.value
FROM (VALUES
  ('navbar.home', 'th', 'หน้าแรก'),
  ('navbar.home', 'en', 'Home'),
  ('navbar.about', 'th', 'เกี่ยวกับเรา'),
  ('navbar.about', 'en', 'About Us'),
  ('navbar.ourBusinesses', 'th', 'บริการของเรา'),
  ('navbar.ourBusinesses', 'en', 'Our Businesses'),
  ('navbar.contactUs', 'th', 'ติดต่อเรา'),
  ('navbar.contactUs', 'en', 'Contact Us'),
  ('navbar.signIn', 'th', 'เข้าสู่ระบบ'),
  ('navbar.signIn', 'en', 'Sign in'),
  ('navbar.startTrading', 'th', 'เริ่มต้นใช้งาน'),
  ('navbar.startTrading', 'en', 'Get started'),
  ('navbar.language', 'th', 'ภาษา'),
  ('navbar.language', 'en', 'Language')
) AS v(translate_group_code, language_code, value)
ON CONFLICT (domain_code, translate_group_code, language_code) DO UPDATE SET
  status = 'Y',
  value = EXCLUDED.value,
  updated_date = now(),
  updated_by = EXCLUDED.updated_by,
  updated_program = EXCLUDED.updated_program;

COMMIT;

-- =====================================================================================
-- ตรวจผลหลังรัน (read-only)
-- =====================================================================================
-- SELECT page_code, section_code, count(*) FROM translate_content_values
--  WHERE domain_code = 'pipgroupholding' AND language_code = 'th'
--  GROUP BY page_code, section_code ORDER BY page_code, section_code::int;
--
-- SELECT translate_group_code, language_code, value FROM translate_values
--  WHERE domain_code = 'pipgroupholding' AND translate_group_code LIKE 'navbar.%' ORDER BY 1, 2;
