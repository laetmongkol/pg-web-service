-- =====================================================================================
-- CMS seed — ทุกหน้าของเว็บ + label ของ navbar/footer  (domain_code = 'sriwilai')
--
-- หน้าที่อยู่ในไฟล์นี้: Home, AboutUs, Services, ContactUs  (ภาษา th + en)
--
-- ปลอดภัยกับ domain อื่น: ทุก statement ฝัง domain_code = 'sriwilai' ตายตัว
-- ไม่มี DELETE / TRUNCATE / UPDATE ที่ไม่ผูก domain — ข้อมูลโดเมนอื่นไม่ถูกแตะ
-- รันซ้ำได้ (idempotent): ON CONFLICT DO UPDATE ทับเฉพาะแถวของ sriwilai
--
-- ต้องมีอยู่ก่อน: domains.domain_code = 'sriwilai' และ languages (th, en) ของ domain นี้
-- ถ้าไม่มี -> RAISE EXCEPTION แล้ว rollback ทั้งไฟล์ (ไม่เขียนอะไรเลย)
--
-- รูปภาพ: media_storage_key เก็บ key แบบไม่มีชื่อโดเมนนำหน้า (contents/...) — api-app-service
-- เติม '{domain}/' ให้เองตอนไปอ่านจาก S3 ส่วนเว็บอ่านจาก attributes.mediaStorageKey
-- =====================================================================================

BEGIN;

-- 0) preflight ---------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM domains WHERE domain_code = 'sriwilai') THEN
    RAISE EXCEPTION 'domains.domain_code = % not found — create the tenant first', 'sriwilai';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM languages WHERE domain_code = 'sriwilai' AND language_code = 'th' AND status = 'Y') THEN
    RAISE EXCEPTION 'languages (th) missing for domain %', 'sriwilai';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM languages WHERE domain_code = 'sriwilai' AND language_code = 'en' AND status = 'Y') THEN
    RAISE EXCEPTION 'languages (en) missing for domain %', 'sriwilai';
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
  media_key    varchar(1024),
  value_th     text,
  value_en     text,
  attrs_th     jsonb,
  attrs_en     jsonb
) ON COMMIT DROP;

INSERT INTO tmp_pages (page_code, page_name, description) VALUES
  ('Home', 'Home', 'หน้าแรกของเว็บไซต์ Sriwilai'),
  ('AboutUs', 'About Us', 'หน้าเกี่ยวกับเรา'),
  ('Services', 'Services', 'หน้าบริการของเรา'),
  ('ContactUs', 'Contact Us', 'หน้าติดต่อเรา');

INSERT INTO tmp_sections (page_code, section_code, description, sequence) VALUES
  ('Home', '1', 'Hero banner', 1),
  ('Home', '2', 'Trusted partners', 2),
  ('Home', '3', 'About Sriwilai + stats', 3),
  ('Home', '4', 'We & our mission', 4),
  ('Home', '5', 'Consulting Pro board', 5),
  ('Home', '6', 'Our services', 6),
  ('Home', '7', 'Client reviews', 7),
  ('Home', '8', 'Closing CTA', 8),
  ('ContactUs', '1', 'Hero banner', 1),
  ('ContactUs', '2', 'Contact channels', 2),
  ('ContactUs', '3', 'Send message form', 3),
  ('ContactUs', '4', 'Office map', 4),
  ('AboutUs', '1', 'Hero banner', 1),
  ('AboutUs', '2', 'Our history', 2),
  ('AboutUs', '3', 'Our journey', 3),
  ('AboutUs', '4', 'Mission and vision', 4),
  ('AboutUs', '5', 'Our value', 5),
  ('AboutUs', '6', 'Mission / vision pictures', 6),
  ('AboutUs', '7', 'Workplace pictures', 7),
  ('AboutUs', '8', 'Closing CTA', 8),
  ('AboutUs', '9', 'Reviewer avatars', 9),
  ('Services', '1', 'Hero banner', 1),
  ('Services', '2', 'Who we are', 2),
  ('Services', '3', 'Service accordion', 3),
  ('Services', '4', 'Our customers', 4),
  ('Services', '5', 'Why choose us', 5),
  ('Services', '6', 'Closing CTA', 6);

INSERT INTO tmp_contents (page_code, section_code, content_code, sequence, content_type,
    link_url, media_key, value_th, value_en, attrs_th, attrs_en) VALUES
  ('Home', '1', 'eyebrow', 1, 'text', NULL, NULL, 'Sriwilai Bangkok', 'Sriwilai Bangkok', NULL, NULL),
  ('Home', '1', 'title1', 2, 'text', NULL, NULL, 'พาธุรกิจของคุณ', 'Move your business', NULL, NULL),
  ('Home', '1', 'title2', 3, 'text', NULL, NULL, 'ไปข้างหน้าอย่างมั่นคง', 'forward with confidence', NULL, NULL),
  ('Home', '1', 'description', 4, 'text', NULL, NULL, 'ที่ปรึกษาด้านกลยุทธ์ธุรกิจและการตลาดที่ทำงานเคียงข้างคุณตั้งแต่วางแผนจนถึงลงมือทำ เปลี่ยนข้อมูลและความเข้าใจตลาดให้เป็นการเติบโตที่วัดผลได้จริง', 'A business strategy and marketing consultancy that works beside you from planning through execution, turning data and market insight into measurable growth.', NULL, NULL),
  ('Home', '1', 'ctaSecondary', 5, 'button', 'services', NULL, 'ดูบริการของเรา', 'Our services', NULL, NULL),
  ('Home', '1', 'ctaPrimary', 6, 'button', 'contact-us', NULL, 'ติดต่อปรึกษา', 'Talk to us', NULL, NULL),
  ('Home', '1', 'scrollDown', 7, 'text', NULL, NULL, 'Scroll Down to explore', 'Scroll Down to explore', NULL, NULL),
  ('Home', '1', 'figureImg', 8, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "ที่ปรึกษาของ Sriwilai"}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "A Sriwilai consultant"}'::jsonb),
  ('Home', '2', 'title', 1, 'text', NULL, NULL, 'Trusted Partner', 'Trusted Partner', NULL, NULL),
  ('Home', '2', 'partner1', 2, 'image', NULL, 'contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png', 'Meta', 'Meta', '{"mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png", "width": 1920, "height": 417, "mediaAltText": "Meta"}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png", "width": 1920, "height": 417, "mediaAltText": "Meta"}'::jsonb),
  ('Home', '2', 'partner2', 3, 'image', NULL, 'contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png', 'Google Meet', 'Google Meet', '{"mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png", "width": 1920, "height": 417, "mediaAltText": "Google Meet"}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png", "width": 1920, "height": 417, "mediaAltText": "Google Meet"}'::jsonb),
  ('Home', '2', 'partner3', 4, 'image', NULL, 'contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png', 'Microsoft', 'Microsoft', '{"mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png", "width": 1920, "height": 417, "mediaAltText": "Microsoft"}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png", "width": 1920, "height": 417, "mediaAltText": "Microsoft"}'::jsonb),
  ('Home', '2', 'partner4', 5, 'image', NULL, 'contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png', 'Zoom', 'Zoom', '{"mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png", "width": 1920, "height": 417, "mediaAltText": "Zoom"}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png", "width": 1920, "height": 417, "mediaAltText": "Zoom"}'::jsonb),
  ('Home', '3', 'badge', 1, 'text', NULL, NULL, 'Sriwilai Bangkok', 'Sriwilai Bangkok', NULL, NULL),
  ('Home', '3', 'title', 2, 'text', NULL, NULL, 'เราเชื่อว่ากลยุทธ์ที่ดี ต้องนำไปใช้ได้จริง', 'We believe a good strategy is one you can actually run', NULL, NULL),
  ('Home', '3', 'description', 3, 'text', NULL, NULL, 'ประกอบกิจการให้บริการด้านการวางแผนกลยุทธ์การตลาดออนไลน์แบบครบวงจร สำหรับธุรกิจในยุคดิจิทัล ครอบคลุมตั้งแต่การวิเคราะห์ธุรกิจและกลุ่มเป้าหมาย การวางแผนและกำหนดทิศทางการตลาด
การสร้างแบรนด์และการสื่อสาร การผลิตคอนเทนต์ ตลอดจนการวางแผนและบริหารสื่อโฆษณาออนไลน์ทุกรูปแบบ เพื่อช่วยเพิ่มการรับรู้ สร้างโอกาสทางธุรกิจ เข้าถึงกลุ่มลูกค้าได้อย่างมีประสิทธิภาพ
และสนับสนุนการเติบโตของธุรกิจอย่างยั่งยืน', 'A full-service digital marketing consultancy for modern businesses: market and audience analysis, marketing direction and planning,
branding and communication, content production, and the planning and management of every kind of online media — all of it aimed at wider reach,
better-qualified opportunities and growth that lasts.', NULL, NULL),
  ('Home', '3', 'stat1', 4, 'json', NULL, NULL, '20+', '20+', '{"label": "ทีมงานผู้เชี่ยวชาญ"}'::jsonb, '{"label": "Specialists on the team"}'::jsonb),
  ('Home', '3', 'stat2', 5, 'json', NULL, NULL, '99%', '99%', '{"label": "ความพึงพอใจจากลูกค้า"}'::jsonb, '{"label": "Client satisfaction"}'::jsonb),
  ('Home', '3', 'stat3', 6, 'json', NULL, NULL, '10+', '10+', '{"label": "โปรเจกต์ที่ส่งมอบแล้ว"}'::jsonb, '{"label": "Projects delivered"}'::jsonb),
  ('Home', '3', 'stat4', 7, 'json', NULL, NULL, '3', '3', '{"label": "รางวัลการันตี"}'::jsonb, '{"label": "Industry awards"}'::jsonb),
  ('Home', '3', 'officeImg', 8, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "สำนักงาน Sriwilai Consulting & Marketing Agency"}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "The Sriwilai Consulting & Marketing Agency office"}'::jsonb),
  ('Home', '4', 'badge', 1, 'text', NULL, NULL, 'We & Our Mission', 'We & Our Mission', NULL, NULL),
  ('Home', '4', 'titleLead', 2, 'text', NULL, NULL, '“เราเป็นพาร์ทเนอร์ทางธุรกิจของคุณ
เพื่อสร้าง', '“We are your business partner,
building ', NULL, NULL),
  ('Home', '4', 'titleHighlight', 3, 'text', NULL, NULL, 'การเติบโตที่ยั่งยืน', 'growth that lasts', NULL, NULL),
  ('Home', '4', 'titleTail', 4, 'text', NULL, NULL, 'ร่วมกัน”', ' together”', NULL, NULL),
  ('Home', '4', 'description', 5, 'text', NULL, NULL, 'มุ่งมั่นส่งมอบกลยุทธ์และโซลูชันทางการตลาดที่สร้างผลลัพธ์ได้จริง เพื่อให้ธุรกิจของคุณเติบโตอย่างแข็งแกร่งและยั่งยืน', 'We deliver marketing strategy and solutions that produce real results, so your business grows strong and stays that way.', NULL, NULL),
  ('Home', '4', 'mission1', 6, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', 'เข้าใจธุรกิจ', 'Understand the business', '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "เข้าใจธุรกิจ", "description": "เราเริ่มจากการเข้าใจธุรกิจ เป้าหมาย และความต้องการอย่างแท้จริง", "badge": "Understand", "value": "92%", "caption": "ของลูกค้ามีความพึงพอใจในการทำธุรกิจอย่างต่อเนื่อง"}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "Understand the business", "description": "We start by genuinely understanding your business, your goals and your needs.", "badge": "Understand", "value": "92%", "caption": "of clients keep working with us year after year"}'::jsonb),
  ('Home', '4', 'mission2', 7, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', 'วางกลยุทธ์', 'Set the strategy', '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "วางกลยุทธ์", "description": "เปลี่ยน Insight ให้เป็นกลยุทธ์การตลาดที่ชัดเจนและเหมาะกับแต่ละธุรกิจ", "badge": "Strategy", "value": "3 เท่า", "caption": "การเข้าถึงกลุ่มเป้าหมายที่เพิ่มขึ้นหลังปรับกลยุทธ์"}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "Set the strategy", "description": "We turn insight into a clear marketing strategy built for your business.", "badge": "Strategy", "value": "3 เท่า", "caption": "more audience reach after the strategy reset"}'::jsonb),
  ('Home', '4', 'mission3', 8, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', 'เติบโตไปด้วยกัน', 'Grow together', '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "เติบโตไปด้วยกัน", "description": "ลงมือทำ วัดผล และพัฒนาอย่างต่อเนื่อง เพื่อสร้างการเติบโตที่ยั่งยืน", "badge": "Grow", "value": "40%", "caption": "ยอดขายเฉลี่ยที่เติบโตขึ้นหลังทำงานร่วมกัน"}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "Grow together", "description": "We execute, measure and refine continuously to build growth that lasts.", "badge": "Grow", "value": "40%", "caption": "average sales growth after working together"}'::jsonb),
  ('Home', '5', 'badge', 1, 'text', NULL, NULL, 'Introducing Consulting Pro', 'Introducing Consulting Pro', NULL, NULL),
  ('Home', '5', 'titleLead', 2, 'text', NULL, NULL, 'ทีมเดียวครบ ', 'One team for ', NULL, NULL),
  ('Home', '5', 'titleHighlight1', 3, 'text', NULL, NULL, 'Strategy, Creative ', 'Strategy, Creative ', NULL, NULL),
  ('Home', '5', 'titleMid', 4, 'text', NULL, NULL, 'และ ', 'and ', NULL, NULL),
  ('Home', '5', 'titleHighlight2', 5, 'text', NULL, NULL, 'Marketing', 'Marketing', NULL, NULL),
  ('Home', '5', 'description', 6, 'text', NULL, NULL, 'เราดูแลตั้งแต่วางกลยุทธ์ธุรกิจ วางแผนสื่อสาร สร้างแบรนด์ ไปจนถึงการทำการตลาดออนไลน์
ผลักดันทุกการสื่อสารให้เป็นไปในทิศทางเดียวกันกับเป้าหมายของธุรกิจ', 'From business strategy and communication planning to branding and online marketing —
every message pushed in the same direction as your goals.', NULL, NULL),
  ('Home', '5', 'portfolioImg1', 7, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "ผลงานออกแบบกลยุทธ์ของ Sriwilai"}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "Strategy work by Sriwilai"}'::jsonb),
  ('Home', '5', 'portfolioImg2', 8, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "ผลงานสื่อสารแบรนด์ของ Sriwilai"}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "Brand communication work by Sriwilai"}'::jsonb),
  ('Home', '5', 'consultantImg', 9, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "Amara Robinson"}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "Amara Robinson"}'::jsonb),
  ('Home', '5', 'timelineImg', 10, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "ตัวอย่างงานวางกลยุทธ์ที่ผ่านมา"}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "A past strategy engagement"}'::jsonb),
  ('Home', '6', 'badge', 1, 'text', NULL, NULL, 'Our Service', 'Our Service', NULL, NULL),
  ('Home', '6', 'title', 2, 'text', NULL, NULL, 'การบริการของเรา', 'What we do', NULL, NULL),
  ('Home', '6', 'description', 3, 'text', NULL, NULL, 'ครบทุกมิติการตลาดและกลยุทธ์ที่ธุรกิจของคุณต้องการ จบในที่เดียว', 'Every side of strategy and marketing your business needs, in one place.', NULL, NULL),
  ('Home', '6', 'ctaButton', 4, 'button', 'services', NULL, 'ดูรายละเอียด', 'See details', NULL, NULL),
  ('Home', '6', 'service1', 5, 'json', NULL, NULL, 'Business Consulting', 'Business Consulting', '{"icon": "consulting", "description": "ให้คำปรึกษาเชิงกลยุทธ์ วิเคราะห์ธุรกิจ\nและวางแผนการเติบโตที่วัดผลได้จริง"}'::jsonb, '{"icon": "consulting", "description": "Strategic consulting, business analysis\nand growth plans you can measure."}'::jsonb),
  ('Home', '6', 'service2', 6, 'json', NULL, NULL, 'Marketing Strategy', 'Marketing Strategy', '{"icon": "strategy", "description": "วางกลยุทธ์การตลาดที่เข้าถึงกลุ่มเป้าหมาย\nผ่านทุกช่องทางอย่างมีทิศทาง"}'::jsonb, '{"icon": "strategy", "description": "Marketing strategy that reaches your audience\nacross every channel with intent."}'::jsonb),
  ('Home', '6', 'service3', 7, 'json', NULL, NULL, 'Branding', 'Branding', '{"icon": "branding", "description": "สร้างแบรนด์ให้โดดเด่น มีจุดยืน\nและเป็นที่จดจำในใจลูกค้า"}'::jsonb, '{"icon": "branding", "description": "Branding that stands out, takes a position\nand stays in the customer''s memory."}'::jsonb),
  ('Home', '6', 'service4', 8, 'json', NULL, NULL, 'Content & Creative', 'Content & Creative', '{"icon": "content", "description": "สร้างสรรค์คอนเทนต์และงานครีเอทีฟ\nที่สื่อสารแบรนด์ได้อย่างเป็นมืออาชีพ"}'::jsonb, '{"icon": "content", "description": "Content and creative work that carries\nthe brand professionally."}'::jsonb),
  ('Home', '7', 'badge', 1, 'text', NULL, NULL, 'Review from client', 'Review from client', NULL, NULL),
  ('Home', '7', 'title', 2, 'text', NULL, NULL, 'รีวิวจากลูกค้าที่ไว้วางใจเรา', 'What our clients say', NULL, NULL),
  ('Home', '7', 'description', 3, 'text', NULL, NULL, 'ความสำเร็จของลูกค้าคือความภูมิใจของเรา นี่คือส่วนหนึ่งของเสียงตอบรับจากผู้ที่ใช้บริการ', 'Our clients'' success is what we are proud of — here is some of what they told us.', NULL, NULL),
  ('Home', '7', 'review1', 4, 'json', NULL, NULL, '“กลยุทธ์ที่ทีมศรีวิไลวางแผนให้ ช่วยเพิ่มยอดขายของเราได้ถึง 40%
ภายในเวลาเพียง 3 เดือน ข้อมูลเชิงลึกของพวกเขามีค่ามากจริง ๆ”', '“The strategy Sriwilai built lifted our sales by 40%
in just three months. Their insight is genuinely valuable.”', '{"name": "คุณวิภา", "role": "บริษัท ABC Trading", "meta": "5 min read", "accent": "#2F80ED"}'::jsonb, '{"name": "Wipa", "role": "ABC Trading", "meta": "5 min read", "accent": "#2F80ED"}'::jsonb),
  ('Home', '7', 'review2', 5, 'json', NULL, NULL, '“การสร้างแบรนด์ใหม่กับทีมงานมืออาชีพชุดนี้
ทำให้เราโดดเด่นในตลาดที่มีการแข่งขันสูง
ลูกค้าจำเราได้ขึ้นอย่างเห็นได้ชัด”', '“Rebranding with this team made us stand out in a crowded market.
Customers remember us now.”', '{"name": "คุณศิรินี รัตนภาส", "role": "Managing Director", "meta": "5 min read", "accent": "#EB5757"}'::jsonb, '{"name": "Sirinee Rattanapas", "role": "Managing Director", "meta": "5 min read", "accent": "#EB5757"}'::jsonb),
  ('Home', '7', 'review3', 6, 'json', NULL, NULL, '“Growth Hacking ของที่นี่ไม่ใช่แค่คำโฆษณา
แต่เป็นผลลัพธ์ที่จับต้องได้จริง
เราขยายฐานลูกค้าได้รวดเร็วอย่างที่ไม่เคยเป็นมาก่อน”', '“Their growth hacking is not a slogan — the results are real.
We grew our customer base faster than ever.”', '{"name": "คุณสมชาย วิริยะ", "role": "Marketing Director, GreenLife", "meta": "5 min read", "accent": "#7B61FF"}'::jsonb, '{"name": "Somchai Wiriya", "role": "Marketing Director, GreenLife", "meta": "5 min read", "accent": "#7B61FF"}'::jsonb),
  ('Home', '7', 'review4', 7, 'json', NULL, NULL, '“ทีมงานเข้าใจธุรกิจของเราตั้งแต่ครั้งแรกที่คุยกัน
แผนที่ได้จึงลงมือทำได้ทันที ไม่ใช่รายงานที่วางบนหิ้ง”', '“They understood our business from the first conversation,
so the plan was something we could act on, not a report on a shelf.”', '{"name": "คุณธนกฤต ชัยพร", "role": "เจ้าของธุรกิจค้าปลีก", "meta": "5 min read", "accent": "#27AE60"}'::jsonb, '{"name": "Thanakrit Chaiporn", "role": "Retail business owner", "meta": "5 min read", "accent": "#27AE60"}'::jsonb),
  ('Home', '7', 'review5', 8, 'json', NULL, NULL, '“คอนเทนต์ที่ทีมทำให้ช่วยให้ลูกค้าเข้าใจสินค้าของเราง่ายขึ้นมาก
ยอดทักเข้ามาสอบถามเพิ่มขึ้นเท่าตัวภายในไตรมาสเดียว”', '“Their content made our products far easier to understand.
Enquiries doubled within a single quarter.”', '{"name": "คุณพิมพ์ชนก แสงทอง", "role": "Head of Marketing, Bloom Cosmetics", "meta": "5 min read", "accent": "#F2994A"}'::jsonb, '{"name": "Pimchanok Sangthong", "role": "Head of Marketing, Bloom Cosmetics", "meta": "5 min read", "accent": "#F2994A"}'::jsonb),
  ('Home', '8', 'title', 1, 'text', NULL, NULL, 'พร้อมเริ่มต้นการเติบโตครั้งสำคัญ', 'Ready to start the growth that matters', NULL, NULL),
  ('Home', '8', 'description', 2, 'text', NULL, NULL, 'ปรึกษากับทีมงาน Sriwilai เพื่อค้นหาโอกาสใหม่ ๆ ให้ธุรกิจของคุณ ไม่ว่าจะเป็นกลยุทธ์ การตลาด หรือการสร้างแบรนด์', 'Talk to the Sriwilai team about the next opportunity for your business — strategy, marketing or brand.', NULL, NULL),
  ('Home', '8', 'emailPlaceholder', 3, 'text', NULL, NULL, 'Enter your Email', 'Enter your Email', NULL, NULL),
  ('Home', '8', 'submitButton', 4, 'button', 'contact-us', NULL, 'Subscribe', 'Subscribe', NULL, NULL),
  ('Home', '8', 'bgImg', 5, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": ""}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": ""}'::jsonb),
  ('ContactUs', '1', 'eyebrow', 1, 'text', NULL, NULL, 'Contact Us', 'Contact Us', NULL, NULL),
  ('ContactUs', '1', 'title', 2, 'text', NULL, NULL, 'ติดต่อเรา', 'Contact us', NULL, NULL),
  ('ContactUs', '1', 'description', 3, 'text', NULL, NULL, 'เริ่มต้นพูดคุยเพื่อวางกลยุทธ์และการตลาดที่เป็นเอกลักษณ์เฉพาะธุรกิจของคุณ', 'Start the conversation about strategy and marketing built for your business alone.', NULL, NULL),
  ('ContactUs', '1', 'bgImg', 4, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "สำนักงาน Sriwilai Consulting & Marketing Agency"}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "The Sriwilai Consulting & Marketing Agency office"}'::jsonb),
  ('ContactUs', '2', 'title', 1, 'text', NULL, NULL, 'ช่องทางการติดต่อเรา', 'How to reach us', NULL, NULL),
  ('ContactUs', '2', 'description', 2, 'text', NULL, NULL, 'เราพร้อมให้คำปรึกษา แนะนำแนวคิด และวางแผนไปด้วยกันในทุกขั้นตอน', 'We are here to advise, share ideas and plan with you at every step.', NULL, NULL),
  ('ContactUs', '2', 'detail1', 3, 'json', NULL, NULL, '1188 อาคารโรงแรมแกรนด์ เซนเตอร์ พอยต์ ลุมพินี (สำนักงานเวิร์กแล็บ) ห้องเลขที่ 1606 ถนนพระราม 4 แขวงทุ่งมหาเมฆ เขตสาทร กรุงเทพมหานคร 10120', '1188 Grande Centre Point Lumpini (WorkLab), Room 1606, Rama 4 Road, Thung Maha Mek, Sathon, Bangkok 10120', '{"icon": "Map", "label": "OUR OFFICE"}'::jsonb, '{"icon": "Map", "label": "OUR OFFICE"}'::jsonb),
  ('ContactUs', '2', 'detail2', 4, 'json', NULL, NULL, '02 000 0000', '02 000 0000', '{"icon": "Phone", "label": "PHONE NUMBER", "href": "tel:020000000"}'::jsonb, '{"icon": "Phone", "label": "PHONE NUMBER", "href": "tel:020000000"}'::jsonb),
  ('ContactUs', '2', 'detail3', 5, 'json', NULL, NULL, 'Sriwilai.support@gmail.com', 'Sriwilai.support@gmail.com', '{"icon": "Mail", "label": "EMAIL ADDRESS", "href": "mailto:Sriwilai.support@gmail.com"}'::jsonb, '{"icon": "Mail", "label": "EMAIL ADDRESS", "href": "mailto:Sriwilai.support@gmail.com"}'::jsonb),
  ('ContactUs', '2', 'hoursTitle', 6, 'text', NULL, NULL, 'เวลาทำการ (Office Hours)', 'Office Hours', NULL, NULL),
  ('ContactUs', '2', 'hours1', 7, 'text', NULL, NULL, 'จันทร์ – ศุกร์: 10:00 น. – 19:00 น.', 'Monday – Friday: 10:00 – 19:00', NULL, NULL),
  ('ContactUs', '2', 'hours2', 8, 'text', NULL, NULL, 'หยุดวันเสาร์ และ อาทิตย์', 'Closed Saturday and Sunday', NULL, NULL),
  ('ContactUs', '3', 'title', 1, 'text', NULL, NULL, 'ส่งข้อความถึงเรา (Send Message)', 'Send Message', NULL, NULL),
  ('ContactUs', '3', 'fieldName', 2, 'json', NULL, NULL, 'ชื่อ-นามสกุล / Name', 'Full name', '{"placeholder": "กรอกชื่อ-นามสกุลของคุณ"}'::jsonb, '{"placeholder": "Your full name"}'::jsonb),
  ('ContactUs', '3', 'fieldEmail', 3, 'json', NULL, NULL, 'อีเมล / Email', 'Email', '{"placeholder": "example@domain.com"}'::jsonb, '{"placeholder": "example@domain.com"}'::jsonb),
  ('ContactUs', '3', 'fieldPhone', 4, 'json', NULL, NULL, 'เบอร์โทรศัพท์ / Phone', 'Phone', '{"placeholder": "089-XXX-XXXX"}'::jsonb, '{"placeholder": "089-XXX-XXXX"}'::jsonb),
  ('ContactUs', '3', 'fieldSubject', 5, 'json', NULL, NULL, 'หัวข้อ / Subject', 'Subject', '{"placeholder": "ระบุเรื่องที่ต้องการติดต่อ"}'::jsonb, '{"placeholder": "What is this about?"}'::jsonb),
  ('ContactUs', '3', 'fieldMessage', 6, 'json', NULL, NULL, 'ข้อความ / Message', 'Message', '{"placeholder": "รายละเอียดธุรกิจ เป้าหมาย หรือคำถามเพิ่มเติม..."}'::jsonb, '{"placeholder": "Your business, your goals, or any question..."}'::jsonb),
  ('ContactUs', '3', 'submitButton', 7, 'text', NULL, NULL, 'ส่งข้อมูลการติดต่อ', 'Send message', NULL, NULL),
  ('ContactUs', '3', 'submittingLabel', 8, 'text', NULL, NULL, 'กำลังส่ง...', 'Sending...', NULL, NULL),
  ('ContactUs', '3', 'successTitle', 9, 'text', NULL, NULL, 'ส่งข้อมูลเรียบร้อย', 'Message sent', NULL, NULL),
  ('ContactUs', '3', 'successMessage', 10, 'text', NULL, NULL, 'ทีมงานจะติดต่อกลับโดยเร็วที่สุด', 'Our team will get back to you shortly.', NULL, NULL),
  ('ContactUs', '3', 'errorTitle', 11, 'text', NULL, NULL, 'ส่งข้อมูลไม่สำเร็จ', 'Could not send', NULL, NULL),
  ('ContactUs', '3', 'errorMessage', 12, 'text', NULL, NULL, 'กรุณาลองใหม่อีกครั้ง', 'Please try again.', NULL, NULL),
  ('ContactUs', '4', 'placeName', 1, 'text', NULL, NULL, 'แกรนด์ เซนเตอร์ พอยต์ ลุมพินี', 'Grande Centre Point Lumpini', NULL, NULL),
  ('ContactUs', '4', 'placeAddress', 2, 'text', NULL, NULL, '1188 ถ. พระรามที่ 4 แขวงทุ่งมหาเมฆ เขตสาทร กรุงเทพมหานคร 10120', '1188 Rama 4 Road, Thung Maha Mek, Sathon, Bangkok 10120', NULL, NULL),
  ('AboutUs', '1', 'eyebrow', 1, 'text', NULL, NULL, 'About Us', 'About Us', NULL, NULL),
  ('AboutUs', '1', 'title1', 2, 'text', NULL, NULL, 'จุดเริ่มต้นที่สร้าง', 'A beginning that builds', NULL, NULL),
  ('AboutUs', '1', 'title2', 3, 'text', NULL, NULL, 'ความเติบโตอย่างมีความหมาย', 'growth with meaning', NULL, NULL),
  ('AboutUs', '1', 'subTitle', 4, 'text', NULL, NULL, 'ศรีวิไลก่อตั้งขึ้นจากความตั้งใจที่จะเป็นที่ปรึกษาที่เข้าใจธุรกิจจากภายใน', 'Sriwilai was founded to be the consultancy that understands a business from the inside.', NULL, NULL),
  ('AboutUs', '1', 'ctaButton', 5, 'button', 'contact-us', NULL, 'ติดต่อเรา', 'Contact us', NULL, NULL),
  ('AboutUs', '1', 'scrollDown', 6, 'text', NULL, NULL, 'Scroll down', 'Scroll down', NULL, NULL),
  ('AboutUs', '1', 'bgImg', 7, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "สำนักงาน Sriwilai"}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "The Sriwilai office"}'::jsonb),
  ('AboutUs', '2', 'eyebrow', 1, 'text', NULL, NULL, 'Our History', 'Our History', NULL, NULL),
  ('AboutUs', '2', 'titleLead', 2, 'text', NULL, NULL, '“เราขับเคลื่อนการเติบโตด้วย', '“We drive growth with ', NULL, NULL),
  ('AboutUs', '2', 'titleHighlight1', 3, 'text', NULL, NULL, 'กลยุทธ์', 'strategy', NULL, NULL),
  ('AboutUs', '2', 'titleMid', 4, 'text', NULL, NULL, 'และ', ' and ', NULL, NULL),
  ('AboutUs', '2', 'titleHighlight2', 5, 'text', NULL, NULL, 'นวัตกรรม', 'innovation', NULL, NULL),
  ('AboutUs', '2', 'titleTail', 6, 'text', NULL, NULL, '”', '”', NULL, NULL),
  ('AboutUs', '2', 'subTitle', 7, 'text', NULL, NULL, 'จากจุดเริ่มต้น สู่การเดินทางที่สร้างคุณค่าและเติบโตไปพร้อมกับลูกค้า', 'From day one, a journey of building value alongside our clients.', NULL, NULL),
  ('AboutUs', '2', 'description', 8, 'text', NULL, NULL, 'ศรีวิไลก่อตั้งขึ้นจากความตั้งใจที่จะเป็นที่ปรึกษาที่เข้าใจธุรกิจจากภายใน ไม่ใช่แค่ผู้ส่งมอบ รายงานหรือแผนสวยงามที่วางบนหิ้ง เราทำงานเคียงข้างเจ้าของธุรกิจ และทีมผู้บริหาร เพื่อแปลงข้อมูลและความเข้าใจตลาดให้กลายเป็นแผนงานที่ลงมือทำได้จริงทีมของเราผสมผสานทักษะด้านกลยุทธ์ธุรกิจ การสร้างแบรนด์ และการตลาดดิจิทัลเข้าไว้ด้วยกัน เพื่อให้ทุกคำแนะนำ มีทั้งความแม่นยำเชิงตัวเลขและความเข้าใจในพฤติกรรมของผู้บริโภคอย่างแท้จริง', 'Sriwilai was founded to be a consultancy that understands a business from the inside — not one that hands over a handsome report to sit on a shelf. We work beside owners and leadership teams, turning data and market understanding into plans that can actually be run. Our team combines business strategy, brand building and digital marketing, so every recommendation carries both numerical precision and a real grasp of consumer behaviour.', NULL, NULL),
  ('AboutUs', '3', 'eyebrow', 1, 'text', NULL, NULL, 'Our Journey', 'Our Journey', NULL, NULL),
  ('AboutUs', '3', 'titleLead', 2, 'text', NULL, NULL, 'เส้นทาง', 'Our road to ', NULL, NULL),
  ('AboutUs', '3', 'titleHighlight', 3, 'text', NULL, NULL, 'ความสำเร็จ', 'success', NULL, NULL),
  ('AboutUs', '3', 'titleTail', 4, 'text', NULL, NULL, 'ของเรา', '', NULL, NULL),
  ('AboutUs', '3', 'step1', 5, 'json', NULL, NULL, 'ก่อตั้งบริษัท', 'The company begins', '{"icon": "Wrench", "body": "เริ่มต้นด้วยทีมงานขนาดเล็กที่มีวิสัยทัศน์กว้างไกลในการพลิกโฉมวงการที่ปรึกษา"}'::jsonb, '{"icon": "Wrench", "body": "A small team with a wide vision for reshaping the consulting industry."}'::jsonb),
  ('AboutUs', '3', 'step2', 6, 'json', NULL, NULL, 'ขยายฐานลูกค้า', 'A wider client base', '{"icon": "Expand", "body": "ขยายการให้บริการสู่องค์กรระดับองค์กรข้ามชาติ สร้างผลกระทบเชิงบวกในหลายอุตสาหกรรม"}'::jsonb, '{"icon": "Expand", "body": "Serving multinational organisations and making an impact across industries."}'::jsonb),
  ('AboutUs', '3', 'step3', 7, 'json', NULL, NULL, 'ขยายขีดความสามารถ', 'Deeper capability', '{"icon": "UserRoundPlus", "body": "ต่อยอดองค์ความรู้และพัฒนากระบวนการทำงานด้วยเทคโนโลยีและเครื่องมือที่ทันสมัย"}'::jsonb, '{"icon": "UserRoundPlus", "body": "Extending our knowledge and sharpening our process with modern tooling."}'::jsonb),
  ('AboutUs', '3', 'step4', 8, 'json', NULL, NULL, 'เติบโตอย่างไม่หยุดยั้ง', 'Growth without pause', '{"icon": "ChartNoAxesCombined", "body": "ได้รับความไว้วางใจจากแบรนด์และองค์กรชั้นนำในหลากหลาย"}'::jsonb, '{"icon": "ChartNoAxesCombined", "body": "Trusted by leading brands and organisations across many sectors."}'::jsonb),
  ('AboutUs', '4', 'eyebrow', 1, 'text', NULL, NULL, 'Mission & Vision', 'Mission & Vision', NULL, NULL),
  ('AboutUs', '4', 'titleLead', 2, 'text', NULL, NULL, 'เปลี่ยนวิสัยทัศน์', 'Turning vision ', NULL, NULL),
  ('AboutUs', '4', 'titleHighlight', 3, 'text', NULL, NULL, 'ให้กลายเป็นความจริง', 'into reality', NULL, NULL),
  ('AboutUs', '4', 'subTitle', 4, 'text', NULL, NULL, 'จากแนวคิดสู่ผลลัพธ์เราทำให้วิสัยทัศน์ของคุณเป็นจริงด้วยโซลูชันที่เป็นนวัตกรรมซึ่งทั้งทรงพลังและมีประสิทธิภาพ', 'From idea to outcome, we make your vision real with solutions that are both powerful and efficient.', NULL, NULL),
  ('AboutUs', '4', 'pillar1', 5, 'json', NULL, NULL, 'Our mission', 'Our mission', '{"body": "ยกระดับศักยภาพของธุรกิจผ่านกลยุทธ์ที่เฉียบคมและการวิเคราะห์ข้อมูลเชิงลึก เรามุ่งมั่นที่จะเป็นหุ้นส่วนเชิงกลยุทธ์ที่น่าเชื่อถือที่สุด สร้างความได้เปรียบทางการแข่งขันที่ยั่งยืนในทุกอุตสาหกรรม"}'::jsonb, '{"body": "To raise what a business is capable of through sharp strategy and deep analysis — and to be the most dependable strategic partner, building durable advantage in any industry."}'::jsonb),
  ('AboutUs', '4', 'pillar2', 6, 'json', NULL, NULL, 'Our vision', 'Our vision', '{"body": "เป็นผู้นำด้านที่ปรึกษาธุรกิจระดับภูมิภาคที่กำหนดนิยามใหม่ของความสำเร็จด้วยนวัตกรรมทางความคิดและการปฏิบัติที่ส่งมอบผลลัพธ์ที่จับต้องได้ในระดับสากล"}'::jsonb, '{"body": "To lead regional business consulting and redefine success through original thinking and practice that delivers tangible results internationally."}'::jsonb),
  ('AboutUs', '4', 'stat1', 7, 'json', NULL, NULL, '20+', '20+', '{"title": "ทีมงานผู้เชี่ยวชาญ", "lines": ["เรามีทีมงาน", "ผู้เชี่ยวชาญด้านต่างๆ", "พร้อมช่วยเหลือคุณ"], "review": false}'::jsonb, '{"title": "Specialists on the team", "lines": ["A team of specialists", "across every discipline", "ready to help you"], "review": false}'::jsonb),
  ('AboutUs', '4', 'stat2', 8, 'json', NULL, NULL, '99%', '99%', '{"title": "ลูกค้าพึงพอใจทั่วโลก", "lines": ["ลูกค้ายังคงใช้บริการ", "ของเราเพราะคุณภาพและ", "ผลลัพธ์ที่ได้"], "review": true}'::jsonb, '{"title": "Client satisfaction worldwide", "lines": ["Clients stay with us", "for the quality and", "the results"], "review": true}'::jsonb),
  ('AboutUs', '4', 'stat3', 9, 'json', NULL, NULL, '10+', '10+', '{"title": "โปรเจกต์ที่ส่งมอบแล้ว", "lines": ["ส่งมอบประสบการณ์", "ที่ดีให้แก่ทุกคน"], "review": false}'::jsonb, '{"title": "Projects delivered", "lines": ["A good experience", "delivered to everyone"], "review": false}'::jsonb),
  ('AboutUs', '4', 'stat4', 10, 'json', NULL, NULL, '3', '3', '{"title": "รางวัล", "lines": ["ความเชี่ยวชาญที่", "นำไปสู่ผลลัพธ์ที่", "มีความหมาย"], "review": false}'::jsonb, '{"title": "Awards", "lines": ["Expertise that leads", "to results that", "actually matter"], "review": false}'::jsonb),
  ('AboutUs', '5', 'eyebrow', 1, 'text', NULL, NULL, 'Our Value', 'Our Value', NULL, NULL),
  ('AboutUs', '5', 'titleLead', 2, 'text', NULL, NULL, 'ค่านิยม', 'The values ', NULL, NULL),
  ('AboutUs', '5', 'titleHighlight', 3, 'text', NULL, NULL, 'ขององกรณ์เรา', 'of our organisation', NULL, NULL),
  ('AboutUs', '5', 'value1', 4, 'json', NULL, NULL, 'ความโปร่งใส', 'Transparency', '{"body": "เราทำงานด้วยความซื่อสัตย์ ตรวจสอบได้และยึดมั่นในจริยธรรมสูงสุด"}'::jsonb, '{"body": "We work honestly, in the open, and hold to the highest ethics."}'::jsonb),
  ('AboutUs', '5', 'value2', 5, 'json', NULL, NULL, 'ความเชี่ยวชาญ', 'Expertise', '{"body": "ทีมที่ปรึกษาที่เข้าใจธุรกิจจากภายในและลงมือทำจริงเคียงข้างคุณ"}'::jsonb, '{"body": "Consultants who understand the business from the inside and do the work beside you."}'::jsonb),
  ('AboutUs', '5', 'value3', 6, 'json', NULL, NULL, 'ความสำเร็จของลูกค้า', 'Client success', '{"body": "เราวัดความสำเร็จของเราจากผลลัพธ์ที่ลูกค้าได้รับ"}'::jsonb, '{"body": "We measure our success by the results our clients get."}'::jsonb),
  ('AboutUs', '5', 'value4', 7, 'json', NULL, NULL, 'นวัตกรรม', 'Innovation', '{"body": "มองหาวิธีใหม่ที่ทำให้ธุรกิจเติบโตได้เร็วและยั่งยืน"}'::jsonb, '{"body": "Looking for new ways to grow a business faster, and for longer."}'::jsonb),
  ('AboutUs', '6', 'missionImage', 1, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "ภารกิจของศรีวิไล"}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "The Sriwilai mission"}'::jsonb),
  ('AboutUs', '6', 'visionImage', 2, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "วิสัยทัศน์ของศรีวิไล"}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "The Sriwilai vision"}'::jsonb),
  ('AboutUs', '7', 'image1', 1, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "บรรยากาศการทำงานของทีม", "label": "บรรยากาศการทำงาน", "progress": 45}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "The team at work", "label": "Life at the studio", "progress": 45}'::jsonb),
  ('AboutUs', '7', 'image2', 2, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "ความเชี่ยวชาญของทีม", "label": "ความเชี่ยวชาญ", "progress": 75}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "The team''s expertise", "label": "Expertise", "progress": 75}'::jsonb),
  ('AboutUs', '8', 'title', 1, 'text', NULL, NULL, 'มาร่วมเป็นส่วนหนึ่งกับเรา', 'Come and join us', NULL, NULL),
  ('AboutUs', '8', 'subTitle', 2, 'text', NULL, NULL, 'เรากำลังมองหาผู้ที่มีความมุ่งมั่นและพร้อมที่จะสร้างการเปลี่ยนแปลงในอุตสาหกรรม หากคุณรักความท้าทาย นี่คือที่ของคุณ', 'We are looking for people ready to change an industry. If you like a challenge, this is your place.', NULL, NULL),
  ('AboutUs', '8', 'ctaButton', 3, 'button', 'contact-us', NULL, 'ดูตำแหน่งงาน', 'See open roles', NULL, NULL),
  ('AboutUs', '8', 'bgImg', 4, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": ""}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": ""}'::jsonb),
  ('AboutUs', '9', 'person1', 1, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "ลูกค้าของศรีวิไล"}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "A Sriwilai client"}'::jsonb),
  ('AboutUs', '9', 'person2', 2, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "ลูกค้าของศรีวิไล"}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "A Sriwilai client"}'::jsonb),
  ('AboutUs', '9', 'person3', 3, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "ลูกค้าของศรีวิไล"}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "A Sriwilai client"}'::jsonb),
  ('Services', '1', 'eyebrow', 1, 'text', NULL, NULL, 'Our Services', 'Our Services', NULL, NULL),
  ('Services', '1', 'title1', 2, 'text', NULL, NULL, 'บริการของเรา', 'Our services', NULL, NULL),
  ('Services', '1', 'subTitle', 3, 'text', NULL, NULL, 'ครบทุกมิติการตลาดและกลยุทธ์ที่ธุรกิจของคุณต้องการ จบในที่เดียว', 'Every side of strategy and marketing your business needs, in one place.', NULL, NULL),
  ('Services', '1', 'scrollDown', 4, 'text', NULL, NULL, 'Scroll down', 'Scroll down', NULL, NULL),
  ('Services', '1', 'bgImg', 5, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "สำนักงาน Sriwilai"}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "The Sriwilai office"}'::jsonb),
  ('Services', '2', 'eyebrow', 1, 'text', NULL, NULL, 'Who We Are', 'Who We Are', NULL, NULL),
  ('Services', '2', 'line1', 2, 'text', NULL, NULL, 'เราสร้างสรรค์และวางแผนกลยุทธ์สื่อสารดิจิทัลแบบครบวงจร ที่ไม่ใช่เพียงแค่สร้างความตระหนักรู้', 'We build and plan end-to-end digital communication strategy — not just awareness,', NULL, NULL),
  ('Services', '2', 'line2', 3, 'text', NULL, NULL, 'แต่เป็นการขับเคลื่อนยอดขายและการเติบโตของแบรนด์อย่างยั่งยืนในยุคดิจิทัล', 'but sales and brand growth that hold up in a digital market.', NULL, NULL),
  ('Services', '3', 'eyebrow', 1, 'text', NULL, NULL, 'Our Service', 'Our Service', NULL, NULL),
  ('Services', '3', 'title', 2, 'text', NULL, NULL, 'บริการด้านการตลาดดิจิทัลที่ครบวงจร', 'Digital marketing, end to end', NULL, NULL),
  ('Services', '3', 'subTitle1', 3, 'text', NULL, NULL, 'เราออกแบบโซลูชันการตลาดดิจิทัลที่เหมาะสมกับขนาดและ', 'We design digital marketing solutions that fit the size and', NULL, NULL),
  ('Services', '3', 'subTitle2', 4, 'text', NULL, NULL, 'เป้าหมายของธุรกิจคุณโดยเฉพาะ', 'the goals of your business specifically.', NULL, NULL),
  ('Services', '3', 'ctaButton', 5, 'button', 'contact-us', NULL, 'ติดต่อเรา', 'Contact us', NULL, NULL),
  ('Services', '3', 'service1', 6, 'json', NULL, NULL, 'กลยุทธ์การตลาด', 'Marketing strategy', '{"lines": ["วิเคราะห์โครงสร้างตลาด พฤติกรรมผู้บริโภค", "และค้นหาโอกาสใหม่ทางธุรกิจเพื่อสร้างความได้เปรียบในการแข่งขันอย่างยั่งยืน"]}'::jsonb, '{"lines": ["Market structure and consumer behaviour analysis,", "finding the openings that build durable competitive advantage."]}'::jsonb),
  ('Services', '3', 'service2', 7, 'json', NULL, NULL, 'คอนเทนต์มาร์เก็ตติ้ง', 'Content marketing', '{"lines": ["วางแผนและผลิตคอนเทนต์ที่ตรงกับกลุ่มเป้าหมาย", "เพื่อสร้างการจดจำและความเชื่อมั่นในแบรนด์อย่างต่อเนื่อง"]}'::jsonb, '{"lines": ["Planning and producing content aimed at the right audience,", "building recall and trust in the brand over time."]}'::jsonb),
  ('Services', '3', 'service3', 8, 'json', NULL, NULL, 'โฆษณาดิจิทัล', 'Digital advertising', '{"lines": ["บริหารงบโฆษณาบนทุกแพลตฟอร์มอย่างแม่นยำ", "วัดผลได้จริงและปรับปรุงประสิทธิภาพอย่างสม่ำเสมอ"]}'::jsonb, '{"lines": ["Managing ad budget precisely across every platform,", "measured for real and tuned continuously."]}'::jsonb),
  ('Services', '3', 'service4', 9, 'json', NULL, NULL, 'โซเชียลมีเดีย', 'Social media', '{"lines": ["ดูแลช่องทางโซเชียลมีเดียของแบรนด์แบบครบวงจร", "ตั้งแต่การวางคอนเซปต์ไปจนถึงการสื่อสารกับผู้ติดตาม"]}'::jsonb, '{"lines": ["Running the brand''s social channels end to end,", "from concept through to talking with followers."]}'::jsonb),
  ('Services', '3', 'service5', 10, 'json', NULL, NULL, 'วิเคราะห์ข้อมูล', 'Data analysis', '{"lines": ["เปลี่ยนข้อมูลจากทุกช่องทางให้เป็นข้อมูลเชิงลึก", "ที่ใช้ตัดสินใจทางธุรกิจได้จริงและต่อยอดการเติบโต"]}'::jsonb, '{"lines": ["Turning data from every channel into insight", "you can decide on, and grow from."]}'::jsonb),
  ('Services', '3', 'serviceImg', 11, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "ตัวอย่างงานบริการของศรีวิไล"}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "Sriwilai service work"}'::jsonb),
  ('Services', '4', 'eyebrow', 1, 'text', NULL, NULL, 'Our Customer', 'Our Customer', NULL, NULL),
  ('Services', '4', 'title', 2, 'text', NULL, NULL, 'แบรนด์ชั้นนำที่ไว้วางใจเรา', 'The brands that trust us', NULL, NULL),
  ('Services', '4', 'customer1', 3, 'image', NULL, 'contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png', 'Meta', 'Meta', '{"mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png", "width": 1920, "height": 417, "mediaAltText": "Meta"}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png", "width": 1920, "height": 417, "mediaAltText": "Meta"}'::jsonb),
  ('Services', '4', 'customer2', 4, 'image', NULL, 'contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png', 'Google Meet', 'Google Meet', '{"mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png", "width": 1920, "height": 417, "mediaAltText": "Google Meet"}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png", "width": 1920, "height": 417, "mediaAltText": "Google Meet"}'::jsonb),
  ('Services', '4', 'customer3', 5, 'image', NULL, 'contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png', 'Microsoft', 'Microsoft', '{"mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png", "width": 1920, "height": 417, "mediaAltText": "Microsoft"}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png", "width": 1920, "height": 417, "mediaAltText": "Microsoft"}'::jsonb),
  ('Services', '4', 'customer4', 6, 'image', NULL, 'contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png', 'Zoom', 'Zoom', '{"mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png", "width": 1920, "height": 417, "mediaAltText": "Zoom"}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png", "width": 1920, "height": 417, "mediaAltText": "Zoom"}'::jsonb),
  ('Services', '4', 'customer5', 7, 'image', NULL, 'contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png', 'Apple', 'Apple', '{"mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png", "width": 1920, "height": 417, "mediaAltText": "Apple"}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png", "width": 1920, "height": 417, "mediaAltText": "Apple"}'::jsonb),
  ('Services', '4', 'customer6', 8, 'image', NULL, 'contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png', 'ธนาคารกสิกรไทย', 'ธนาคารกสิกรไทย', '{"mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png", "width": 1920, "height": 417, "mediaAltText": "ธนาคารกสิกรไทย"}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png", "width": 1920, "height": 417, "mediaAltText": "ธนาคารกสิกรไทย"}'::jsonb),
  ('Services', '4', 'customer7', 9, 'image', NULL, 'contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png', 'xiaomi', 'xiaomi', '{"mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png", "width": 1920, "height": 417, "mediaAltText": "xiaomi"}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png", "width": 1920, "height": 417, "mediaAltText": "xiaomi"}'::jsonb),
  ('Services', '4', 'customer8', 10, 'image', NULL, 'contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png', 'andreessen horowitz', 'andreessen horowitz', '{"mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png", "width": 1920, "height": 417, "mediaAltText": "andreessen horowitz"}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png", "width": 1920, "height": 417, "mediaAltText": "andreessen horowitz"}'::jsonb),
  ('Services', '5', 'eyebrow', 1, 'text', NULL, NULL, 'Why Choose us', 'Why Choose us', NULL, NULL),
  ('Services', '5', 'title', 2, 'text', NULL, NULL, 'ทำไมลูกค้าเลือกเรา', 'Why clients choose us', NULL, NULL),
  ('Services', '5', 'subTitle', 3, 'text', NULL, NULL, 'เพราะเราไม่ได้ส่งมอบแค่แผนงาน แต่ส่งมอบผลลัพธ์ที่ธุรกิจของคุณวัดได้จริง', 'Because we do not hand over a plan — we hand over results your business can measure.', NULL, NULL),
  ('Services', '5', 'coverImg', 4, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "ทีมที่ปรึกษาของศรีวิไลทำงานร่วมกับลูกค้า"}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": "Sriwilai consultants working with a client"}'::jsonb),
  ('Services', '5', 'reason1', 5, 'json', NULL, NULL, 'เข้าใจธุรกิจก่อนเริ่มงาน', 'We understand the business first', '{"icon": "Target", "body": "เราให้ความสำคัญกับการเข้าใจธุรกิจ เป้าหมาย และความท้าทายอย่างลึกซึ้ง"}'::jsonb, '{"icon": "Target", "body": "We take the time to understand the business, its goals and its real constraints."}'::jsonb),
  ('Services', '5', 'reason2', 6, 'json', NULL, NULL, 'ผสานกลยุทธ์และความคิดสร้างสรรค์', 'Strategy and creative together', '{"icon": "Sparkles", "body": "ทำงานร่วมกันแบบไร้รอยต่อเพื่อส่งมอบผลลัพธ์ที่เป็นเลิศและมีมิติ"}'::jsonb, '{"icon": "Sparkles", "body": "The two work as one, so the result has both edge and depth."}'::jsonb),
  ('Services', '5', 'reason3', 7, 'json', NULL, NULL, 'ขับเคลื่อนด้วยข้อมูลจริง', 'Driven by real data', '{"icon": "ChartNoAxesColumn", "body": "วิเคราะห์ผลอย่างโปร่งใสและนำข้อมูลมาปรับปรุงแคมเปญสม่ำเสมอ"}'::jsonb, '{"icon": "ChartNoAxesColumn", "body": "Transparent analysis, feeding straight back into the campaign."}'::jsonb),
  ('Services', '5', 'reason4', 8, 'json', NULL, NULL, 'ดูแลครบ จบในที่เดียว', 'Everything under one roof', '{"icon": "SquareCheckBig", "body": "ตั้งแต่การวางแผน สร้างสรรค์ จนถึงการลงมือทำ"}'::jsonb, '{"icon": "SquareCheckBig", "body": "From planning through creative to execution."}'::jsonb),
  ('Services', '6', 'title', 1, 'text', NULL, NULL, 'พร้อมเริ่มต้นการเติบโตครั้งสำคัญไปกับเรา', 'Ready to grow with us', NULL, NULL),
  ('Services', '6', 'subTitle', 2, 'text', NULL, NULL, 'ให้ทีมงานคุณภาพของเราให้คำปรึกษาและออกแบบกลยุทธ์การตลาดที่เหมาะกับธุรกิจของคุณ', 'Let our team advise you and design the marketing strategy that fits your business.', NULL, NULL),
  ('Services', '6', 'ctaButton', 3, 'button', 'contact-us', NULL, 'ติดต่อปรึกษาเรา', 'Talk to us', NULL, NULL),
  ('Services', '6', 'bgImg', 4, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": ""}'::jsonb, '{"mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png", "width": 1536, "height": 1024, "mediaAltText": ""}'::jsonb);

-- 2) content_pages -----------------------------------------------------------------
INSERT INTO content_pages
  (id, uuid, status, created_date, created_by, updated_date, updated_by, created_program, updated_program, version,
   domain_code, page_code, page_name, page_slug, description, fallback_language_code, parent_page_code)
SELECT nextval('content_pages_id_seq'::regclass), gen_random_uuid(), 'Y', now(), 'seed-sriwilai', now(), 'seed-sriwilai', 'seed-sriwilai', 'seed-sriwilai', 1,
       'sriwilai', p.page_code, p.page_name, '', p.description, 'th', NULL
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
SELECT nextval('content_headers_id_seq'::regclass), gen_random_uuid(), 'Y', now(), 'seed-sriwilai', now(), 'seed-sriwilai', 'seed-sriwilai', 'seed-sriwilai', 1,
       'sriwilai', s.page_code, s.section_code, s.description, s.sequence
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
SELECT nextval('translate_contents_id_seq'::regclass), gen_random_uuid(), 'Y', now(), 'seed-sriwilai', now(), 'seed-sriwilai', 'seed-sriwilai', 'seed-sriwilai', 1,
       'sriwilai', c.page_code, c.section_code, c.content_code, c.content_code, c.sequence
FROM tmp_contents c
ON CONFLICT (domain_code, page_code, section_code, translate_content_code) DO UPDATE SET
  status = 'Y',
  sequence = EXCLUDED.sequence,
  updated_date = now(),
  updated_by = EXCLUDED.updated_by,
  updated_program = EXCLUDED.updated_program;

-- 5.th) translate_content_values (th) ---------------------------------------------
INSERT INTO translate_content_values
  (id, uuid, status, created_date, created_by, updated_date, updated_by, created_program, updated_program, version,
   domain_code, language_code, page_code, section_code, translate_content_code,
   value, link_url, media_storage_key, content_type, attributes)
SELECT nextval('translate_content_values_id_seq'::regclass), gen_random_uuid(), 'Y', now(), 'seed-sriwilai', now(), 'seed-sriwilai', 'seed-sriwilai', 'seed-sriwilai', 1,
       'sriwilai', 'th', c.page_code, c.section_code, c.content_code,
       c.value_th, c.link_url, c.media_key, c.content_type, c.attrs_th
FROM tmp_contents c
ON CONFLICT (domain_code, page_code, section_code, translate_content_code, language_code) DO UPDATE SET
  status = 'Y',
  value = EXCLUDED.value,
  link_url = EXCLUDED.link_url,
  media_storage_key = EXCLUDED.media_storage_key,
  content_type = EXCLUDED.content_type,
  attributes = EXCLUDED.attributes,
  updated_date = now(),
  updated_by = EXCLUDED.updated_by,
  updated_program = EXCLUDED.updated_program;

-- 5.en) translate_content_values (en) ---------------------------------------------
INSERT INTO translate_content_values
  (id, uuid, status, created_date, created_by, updated_date, updated_by, created_program, updated_program, version,
   domain_code, language_code, page_code, section_code, translate_content_code,
   value, link_url, media_storage_key, content_type, attributes)
SELECT nextval('translate_content_values_id_seq'::regclass), gen_random_uuid(), 'Y', now(), 'seed-sriwilai', now(), 'seed-sriwilai', 'seed-sriwilai', 'seed-sriwilai', 1,
       'sriwilai', 'en', c.page_code, c.section_code, c.content_code,
       c.value_en, c.link_url, c.media_key, c.content_type, c.attrs_en
FROM tmp_contents c
ON CONFLICT (domain_code, page_code, section_code, translate_content_code, language_code) DO UPDATE SET
  status = 'Y',
  value = EXCLUDED.value,
  link_url = EXCLUDED.link_url,
  media_storage_key = EXCLUDED.media_storage_key,
  content_type = EXCLUDED.content_type,
  attributes = EXCLUDED.attributes,
  updated_date = now(),
  updated_by = EXCLUDED.updated_by,
  updated_program = EXCLUDED.updated_program;

-- 6) navbar + footer labels — translate_groups + translate_values (next-intl) -------
INSERT INTO translate_groups
  (id, uuid, status, created_date, created_by, updated_date, updated_by, created_program, updated_program, version,
   domain_code, translate_group_code, description)
SELECT nextval('translate_groups_id_seq'::regclass), gen_random_uuid(), 'Y', now(), 'seed-sriwilai', now(), 'seed-sriwilai', 'seed-sriwilai', 'seed-sriwilai', 1,
       'sriwilai', g.translate_group_code, g.description
FROM (VALUES
  ('navbar.home', 'Layout: navbar.home'),
  ('navbar.about', 'Layout: navbar.about'),
  ('navbar.ourBusinesses', 'Layout: navbar.ourBusinesses'),
  ('navbar.contactUs', 'Layout: navbar.contactUs'),
  ('navbar.signIn', 'Layout: navbar.signIn'),
  ('navbar.startTrading', 'Layout: navbar.startTrading'),
  ('navbar.language', 'Layout: navbar.language'),
  ('footer.brandDescription', 'Layout: footer.brandDescription'),
  ('footer.followUs', 'Layout: footer.followUs'),
  ('footer.navigation.title', 'Layout: footer.navigation.title'),
  ('footer.utility.title', 'Layout: footer.utility.title'),
  ('footer.utility.property', 'Layout: footer.utility.property'),
  ('footer.utility.ourMission', 'Layout: footer.utility.ourMission'),
  ('footer.utility.ourVision', 'Layout: footer.utility.ourVision'),
  ('footer.utility.ourHistory', 'Layout: footer.utility.ourHistory'),
  ('footer.utility.notFound', 'Layout: footer.utility.notFound'),
  ('footer.contact.title', 'Layout: footer.contact.title'),
  ('footer.legal.termsOfService', 'Layout: footer.legal.termsOfService'),
  ('footer.legal.privacy', 'Layout: footer.legal.privacy')
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
SELECT nextval('translate_values_id_seq'::regclass), gen_random_uuid(), 'Y', now(), 'seed-sriwilai', now(), 'seed-sriwilai', 'seed-sriwilai', 'seed-sriwilai', 1,
       'sriwilai', v.language_code, v.translate_group_code, v.value
FROM (VALUES
  ('navbar.home', 'th', 'หน้าแรก'),
  ('navbar.home', 'en', 'Home'),
  ('navbar.about', 'th', 'เกี่ยวกับเรา'),
  ('navbar.about', 'en', 'About Us'),
  ('navbar.ourBusinesses', 'th', 'บริการของเรา'),
  ('navbar.ourBusinesses', 'en', 'Services'),
  ('navbar.contactUs', 'th', 'ติดต่อเรา'),
  ('navbar.contactUs', 'en', 'Contact Us'),
  ('navbar.signIn', 'th', 'เข้าสู่ระบบ'),
  ('navbar.signIn', 'en', 'Sign in'),
  ('navbar.startTrading', 'th', 'ติดต่อปรึกษา'),
  ('navbar.startTrading', 'en', 'Talk to us'),
  ('navbar.language', 'th', 'ภาษา'),
  ('navbar.language', 'en', 'Language'),
  ('footer.brandDescription', 'th', 'ศรีวิไลเป็นที่ปรึกษาด้านกลยุทธ์ แบรนด์ และการตลาด ที่ทำงานเคียงข้างผู้บริหาร เพื่อแปลงข้อมูลให้เป็นแผนงานที่ลงมือทำได้จริง'),
  ('footer.brandDescription', 'en', 'Sriwilai is a strategy, brand and marketing consultancy that works beside leadership teams, turning data into plans they can act on.'),
  ('footer.followUs', 'th', 'ติดตามเรา'),
  ('footer.followUs', 'en', 'Follow us'),
  ('footer.navigation.title', 'th', 'เมนู'),
  ('footer.navigation.title', 'en', 'Navigation'),
  ('footer.utility.title', 'th', 'หน้าอื่น ๆ'),
  ('footer.utility.title', 'en', 'Utility Pages'),
  ('footer.utility.property', 'th', 'ผลงาน'),
  ('footer.utility.property', 'en', 'Property'),
  ('footer.utility.ourMission', 'th', 'พันธกิจของเรา'),
  ('footer.utility.ourMission', 'en', 'Our Mission'),
  ('footer.utility.ourVision', 'th', 'วิสัยทัศน์ของเรา'),
  ('footer.utility.ourVision', 'en', 'Our Vision'),
  ('footer.utility.ourHistory', 'th', 'ประวัติของเรา'),
  ('footer.utility.ourHistory', 'en', 'Our History'),
  ('footer.utility.notFound', 'th', '404 ไม่พบหน้า'),
  ('footer.utility.notFound', 'en', '404 Not Found'),
  ('footer.contact.title', 'th', 'ติดต่อ'),
  ('footer.contact.title', 'en', 'Contact'),
  ('footer.legal.termsOfService', 'th', 'ข้อกำหนดการใช้งาน'),
  ('footer.legal.termsOfService', 'en', 'Term of service'),
  ('footer.legal.privacy', 'th', 'นโยบายความเป็นส่วนตัว'),
  ('footer.legal.privacy', 'en', 'Privacy Policy')
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
--  WHERE domain_code = 'sriwilai' AND language_code = 'th'
--  GROUP BY page_code, section_code ORDER BY page_code, section_code::int;
--
-- SELECT translate_group_code, language_code, value FROM translate_values
--  WHERE domain_code = 'sriwilai' AND translate_group_code LIKE 'navbar.%' ORDER BY 1, 2;