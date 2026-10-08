-- =====================================================================================
-- CMS seed — ทุกหน้าของเว็บ + label ของ navbar/footer  (domain_code = 'sriwilai')
--
-- หน้าที่อยู่ในไฟล์นี้: Home, AboutUs, Services, ContactUs  (ภาษา th + en)
-- ข้อมูลล่าสุด: sync จาก dev DB (sriwilai_cms_dev) เมื่อ 2026-10-06
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
  ('AboutUs', '7', 'Workplace pictures + cover video', 7),
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
  ('Home', '1', 'title1', 2, 'text', NULL, NULL, 'ดูแลแบรนด์ของคุณ', 'Move your business', NULL, NULL),
  ('Home', '1', 'title2', 3, 'text', NULL, NULL, 'เหมือนแบรนด์ของเราเอง', 'forward with confidence', NULL, NULL),
  ('Home', '1', 'description', 4, 'text', NULL, NULL, 'เราเชื่อมั่นว่าการตลาดที่ดีไม่ใช่เพียงการสร้างแบรนด์ แต่คือการสร้างผลตอบแทนที่ยั่งยืนในระยะยาว', 'A business strategy and marketing consultancy that works beside you from planning through execution, turning data and market insight into measurable growth.', NULL, NULL),
  ('Home', '1', 'ctaSecondary', 5, 'button', 'services', NULL, 'ดูบริการของเรา', 'Our services', NULL, NULL),
  ('Home', '1', 'ctaPrimary', 6, 'button', 'contact-us', NULL, 'ติดต่อปรึกษา', 'Talk to us', NULL, NULL),
  ('Home', '1', 'scrollDown', 7, 'text', NULL, NULL, 'Scroll Down to explore', 'Scroll Down to explore', NULL, NULL),
  ('Home', '1', 'figureImg', 8, 'image', NULL, 'contents/2026-10-02T04-44-03_335a2fb1-1cac-4580-a180-020ae7449edc.gif', '', '', '{"width": "1536", "height": "1024", "mediaAltText": "ที่ปรึกษาของ Sriwilai", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb, '{"width": "1536", "height": "1024", "mediaAltText": "A Sriwilai consultant", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb),
  ('Home', '2', 'title', 1, 'text', NULL, NULL, 'Trusted Partner', 'Trusted Partner', NULL, NULL),
  ('Home', '2', 'partner1', 2, 'image', NULL, 'contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png', 'Meta', 'Meta', '{"width": 1920, "height": 417, "mediaAltText": "Meta", "mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png"}'::jsonb, '{"width": 1920, "height": 417, "mediaAltText": "Meta", "mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png"}'::jsonb),
  ('Home', '2', 'partner2', 3, 'image', NULL, 'contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png', 'Google Meet', 'Google Meet', '{"width": 1920, "height": 417, "mediaAltText": "Google Meet", "mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png"}'::jsonb, '{"width": 1920, "height": 417, "mediaAltText": "Google Meet", "mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png"}'::jsonb),
  ('Home', '2', 'partner3', 4, 'image', NULL, 'contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png', 'Microsoft', 'Microsoft', '{"width": 1920, "height": 417, "mediaAltText": "Microsoft", "mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png"}'::jsonb, '{"width": 1920, "height": 417, "mediaAltText": "Microsoft", "mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png"}'::jsonb),
  ('Home', '2', 'partner4', 5, 'image', NULL, 'contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png', 'Zoom', 'Zoom', '{"width": 1920, "height": 417, "mediaAltText": "Zoom", "mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png"}'::jsonb, '{"width": 1920, "height": 417, "mediaAltText": "Zoom", "mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png"}'::jsonb),
  ('Home', '3', 'badge', 1, 'text', NULL, NULL, 'Sriwilai Bangkok', 'Sriwilai Bangkok', NULL, NULL),
  ('Home', '3', 'title', 2, 'text', NULL, NULL, 'เราเชื่อว่ากลยุทธ์ที่ดี ต้องนำไปใช้ได้จริง', 'We believe a good strategy is one you can actually run', NULL, NULL),
  ('Home', '3', 'description', 3, 'text', NULL, NULL, 'Sriwilai Consulting & Marketing Agency ให้บริการด้านการวางแผนกลยุทธ์การตลาดออนไลน์แบบครบวงจร ครอบคลุมตั้งแต่การวิเคราะห์ธุรกิจ กำหนดกลุ่มเป้าหมาย วางแผนและกำหนดทิศทางการตลาด เพิ่มการรับรู้ของแบรนด์ผ่านการสื่อสาร ผลิตคอนเทนต์ ตลอดจนการวางแผนและบริหารสื่อโฆษณาออนไลน์ทุกรูปแบบ เพื่อธุรกิจในยุคดิจิทัล สร้างโอกาสทางธุรกิจ และเข้าถึงกลุ่มลูกค้าได้อย่างมีประสิทธิภาพและสนับสนุนการเติบโตของธุรกิจอย่างยั่งยืน', E'A full-service digital marketing consultancy for modern businesses: market and audience analysis, marketing direction and planning,\nbranding and communication, content production, and the planning and management of every kind of online media — all of it aimed at wider reach,\nbetter-qualified opportunities and growth that lasts.', NULL, NULL),
  ('Home', '3', 'stat1', 4, 'json', NULL, NULL, '20+', '20+', '{"label": "ทีมงานผู้เชี่ยวชาญ"}'::jsonb, '{"label": "Specialists on the team"}'::jsonb),
  ('Home', '3', 'stat2', 5, 'json', NULL, NULL, '99%', '99%', '{"label": "ความพึงพอใจจากลูกค้า"}'::jsonb, '{"label": "Client satisfaction"}'::jsonb),
  ('Home', '3', 'stat3', 6, 'json', NULL, NULL, '10+', '10+', '{"label": "โปรเจกต์ที่ส่งมอบแล้ว"}'::jsonb, '{"label": "Projects delivered"}'::jsonb),
  ('Home', '3', 'stat4', 7, 'json', NULL, NULL, '3', '3', '{"label": "รางวัลการันตี"}'::jsonb, '{"label": "Industry awards"}'::jsonb),
  ('Home', '3', 'officeImg', 8, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"width": 1536, "height": 1024, "mediaAltText": "สำนักงาน Sriwilai Consulting & Marketing Agency", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb, '{"width": 1536, "height": 1024, "mediaAltText": "The Sriwilai Consulting & Marketing Agency office", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb),
  ('Home', '4', 'badge', 1, 'text', NULL, NULL, 'We & Our Mission', 'We & Our Mission', NULL, NULL),
  ('Home', '4', 'titleLead', 2, 'text', NULL, NULL, E'“เราเป็นพาร์ทเนอร์ทางธุรกิจของคุณ\nเพื่อสร้าง', E'“We are your business partner,\nbuilding ', NULL, NULL),
  ('Home', '4', 'titleHighlight', 3, 'text', NULL, NULL, 'การเติบโตที่ยั่งยืน', 'growth that lasts', NULL, NULL),
  ('Home', '4', 'titleTail', 4, 'text', NULL, NULL, 'ร่วมกัน”', ' together”', NULL, NULL),
  ('Home', '4', 'description', 5, 'text', NULL, NULL, 'การเติบโตอย่างยั่งยืนของคุณ คือเป้าหมายสำคัญของเรา ด้วยการวางแผนกลยุทธ์ทางการตลาดที่สามารถวัดผลได้จริง เพื่อให้ธุรกิจของคุณเติบโตอย่างมั่นคงไม่ใช่เพียงเติบโตชั่วคราว', 'We deliver marketing strategy and solutions that produce real results, so your business grows strong and stays that way.', NULL, NULL),
  ('Home', '4', 'mission1', 6, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', 'เข้าใจธุรกิจ', 'Understand the business', '{"badge": "Understand", "value": "92%", "width": 1536, "height": 1024, "caption": "ของลูกค้ามีความพึงพอใจในการทำธุรกิจอย่างต่อเนื่อง", "description": "เราเริ่มจากการเข้าใจธุรกิจ เป้าหมาย และความต้องการอย่างแท้จริง", "mediaAltText": "เข้าใจธุรกิจ", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb, '{"badge": "Understand", "value": "92%", "width": 1536, "height": 1024, "caption": "of clients keep working with us year after year", "description": "We start by genuinely understanding your business, your goals and your needs.", "mediaAltText": "Understand the business", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb),
  ('Home', '4', 'mission2', 7, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', 'วางกลยุทธ์', 'Set the strategy', '{"badge": "Strategy", "value": "3 เท่า", "width": 1536, "height": 1024, "caption": "การเข้าถึงกลุ่มเป้าหมายที่เพิ่มขึ้นหลังปรับกลยุทธ์", "description": "เปลี่ยน Insight ให้เป็นกลยุทธ์การตลาดที่ชัดเจนและเหมาะกับแต่ละธุรกิจ", "mediaAltText": "วางกลยุทธ์", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb, '{"badge": "Strategy", "value": "3 เท่า", "width": 1536, "height": 1024, "caption": "more audience reach after the strategy reset", "description": "We turn insight into a clear marketing strategy built for your business.", "mediaAltText": "Set the strategy", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb),
  ('Home', '4', 'mission3', 8, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', 'เติบโตไปด้วยกัน', 'Grow together', '{"badge": "Grow", "value": "40%", "width": 1536, "height": 1024, "caption": "ยอดขายเฉลี่ยที่เติบโตขึ้นหลังทำงานร่วมกัน", "description": "ลงมือทำ วัดผล และพัฒนาอย่างต่อเนื่อง เพื่อสร้างการเติบโตที่ยั่งยืน", "mediaAltText": "เติบโตไปด้วยกัน", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb, '{"badge": "Grow", "value": "40%", "width": 1536, "height": 1024, "caption": "average sales growth after working together", "description": "We execute, measure and refine continuously to build growth that lasts.", "mediaAltText": "Grow together", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb),
  ('Home', '5', 'badge', 1, 'text', NULL, NULL, 'Introducing Consulting Pro', 'Introducing Consulting Pro', NULL, NULL),
  ('Home', '5', 'titleLead', 2, 'text', NULL, NULL, 'ทีมเดียวครบ ', 'One team for ', NULL, NULL),
  ('Home', '5', 'titleHighlight1', 3, 'text', NULL, NULL, 'Strategy, Creative ', 'Strategy, Creative ', NULL, NULL),
  ('Home', '5', 'titleMid', 4, 'text', NULL, NULL, 'และ ', 'and ', NULL, NULL),
  ('Home', '5', 'titleHighlight2', 5, 'text', NULL, NULL, 'Marketing', 'Marketing', NULL, NULL),
  ('Home', '5', 'description', 6, 'text', NULL, NULL, 'เรามีทีมผู้เชี่ยวชาญในด้านการวิเคราะห์ธุรกิจ วางกลยุทธ์ สร้างแบรนด์ ไปจนถึงการทำการตลาดที่สามารถวัดผลได้จริง เพื่อให้ทุกการสื่อสารเป็นไปตามเป้าหมายของธุรกิจคุณ', E'From business strategy and communication planning to branding and online marketing —\nevery message pushed in the same direction as your goals.', NULL, NULL),
  ('Home', '5', 'portfolioImg1', 7, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"width": 1536, "height": 1024, "mediaAltText": "ผลงานออกแบบกลยุทธ์ของ Sriwilai", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb, '{"width": 1536, "height": 1024, "mediaAltText": "Strategy work by Sriwilai", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb),
  ('Home', '5', 'portfolioImg2', 8, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"width": 1536, "height": 1024, "mediaAltText": "ผลงานสื่อสารแบรนด์ของ Sriwilai", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb, '{"width": 1536, "height": 1024, "mediaAltText": "Brand communication work by Sriwilai", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb),
  ('Home', '5', 'consultantImg', 9, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"width": 1536, "height": 1024, "mediaAltText": "Amara Robinson", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb, '{"width": 1536, "height": 1024, "mediaAltText": "Amara Robinson", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb),
  ('Home', '5', 'timelineImg', 10, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"width": 1536, "height": 1024, "mediaAltText": "ตัวอย่างงานวางกลยุทธ์ที่ผ่านมา", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb, '{"width": 1536, "height": 1024, "mediaAltText": "A past strategy engagement", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb),
  ('Home', '6', 'badge', 1, 'text', NULL, NULL, 'Our Service', 'Our Service', NULL, NULL),
  ('Home', '6', 'title', 2, 'text', NULL, NULL, 'การบริการของเรา', 'What we do', NULL, NULL),
  ('Home', '6', 'description', 3, 'text', NULL, NULL, 'เราให้บริการด้านการตลาดออนไลน์แบบครบวงจรเพื่อการเติบโตของธุรกิจคุณ', 'Every side of strategy and marketing your business needs, in one place.', NULL, NULL),
  ('Home', '6', 'ctaButton', 4, 'button', 'services', NULL, 'ดูรายละเอียด', 'See details', NULL, NULL),
  ('Home', '6', 'service1', 5, 'json', NULL, NULL, 'Business Consulting', 'Business Consulting', E'{"icon": "consulting", "description": "ให้คำปรึกษาเชิงกลยุทธ์ วิเคราะห์ธุรกิจ\\nและวางแผนการเติบโตที่วัดผลได้จริง"}'::jsonb, E'{"icon": "consulting", "description": "Strategic consulting, business analysis\\nand growth plans you can measure."}'::jsonb),
  ('Home', '6', 'service2', 6, 'json', NULL, NULL, 'Marketing Strategy', 'Marketing Strategy', E'{"icon": "strategy", "description": "วางกลยุทธ์การตลาดที่เข้าถึงกลุ่มเป้าหมาย\\nผ่านทุกช่องทางอย่างมีทิศทาง"}'::jsonb, E'{"icon": "strategy", "description": "Marketing strategy that reaches your audience\\nacross every channel with intent."}'::jsonb),
  ('Home', '6', 'service3', 7, 'json', NULL, NULL, 'Branding', 'Branding', E'{"icon": "branding", "description": "สร้างแบรนด์ให้โดดเด่น มีจุดยืน\\nและเป็นที่จดจำในใจลูกค้า"}'::jsonb, E'{"icon": "branding", "description": "Branding that stands out, takes a position\\nand stays in the customer''s memory."}'::jsonb),
  ('Home', '6', 'service4', 8, 'json', NULL, NULL, 'Content & Creative', 'Content & Creative', E'{"icon": "content", "description": "สร้างสรรค์คอนเทนต์และงานครีเอทีฟ\\nที่สื่อสารแบรนด์ได้อย่างเป็นมืออาชีพ"}'::jsonb, E'{"icon": "content", "description": "Content and creative work that carries\\nthe brand professionally."}'::jsonb),
  ('Home', '7', 'badge', 1, 'text', NULL, NULL, 'Review from client', 'Review from client', NULL, NULL),
  ('Home', '7', 'title', 2, 'text', NULL, NULL, 'รีวิวจากลูกค้าที่ไว้วางใจเรา', 'What our clients say', NULL, NULL),
  ('Home', '7', 'description', 3, 'text', NULL, NULL, 'ความสำเร็จของลูกค้าคือความภูมิใจของเรา นี่คือส่วนหนึ่งของเสียงตอบรับจากผู้ที่ใช้บริการ', 'Our clients'' success is what we are proud of — here is some of what they told us.', NULL, NULL),
  ('Home', '7', 'review1', 4, 'json', NULL, NULL, E'“กลยุทธ์ที่ทีมศรีวิไลวางแผนให้ ช่วยเพิ่มยอดขายของเราได้ถึง 40%\nภายในเวลาเพียง 3 เดือน ข้อมูลเชิงลึกของพวกเขามีค่ามากจริง ๆ”', E'“The strategy Sriwilai built lifted our sales by 40%\nin just three months. Their insight is genuinely valuable.”', '{"meta": "5 min read", "name": "คุณวิภา", "role": "บริษัท ABC Trading", "accent": "#2F80ED"}'::jsonb, '{"meta": "5 min read", "name": "Wipa", "role": "ABC Trading", "accent": "#2F80ED"}'::jsonb),
  ('Home', '7', 'review2', 5, 'json', NULL, NULL, E'“การสร้างแบรนด์ใหม่กับทีมงานมืออาชีพชุดนี้\nทำให้เราโดดเด่นในตลาดที่มีการแข่งขันสูง\nลูกค้าจำเราได้ขึ้นอย่างเห็นได้ชัด”', E'“Rebranding with this team made us stand out in a crowded market.\nCustomers remember us now.”', '{"meta": "5 min read", "name": "คุณศิรินี รัตนภาส", "role": "Managing Director", "accent": "#EB5757"}'::jsonb, '{"meta": "5 min read", "name": "Sirinee Rattanapas", "role": "Managing Director", "accent": "#EB5757"}'::jsonb),
  ('Home', '7', 'review3', 6, 'json', NULL, NULL, E'“Growth Hacking ของที่นี่ไม่ใช่แค่คำโฆษณา\nแต่เป็นผลลัพธ์ที่จับต้องได้จริง\nเราขยายฐานลูกค้าได้รวดเร็วอย่างที่ไม่เคยเป็นมาก่อน”', E'“Their growth hacking is not a slogan — the results are real.\nWe grew our customer base faster than ever.”', '{"meta": "5 min read", "name": "คุณสมชาย วิริยะ", "role": "Marketing Director, GreenLife", "accent": "#7B61FF"}'::jsonb, '{"meta": "5 min read", "name": "Somchai Wiriya", "role": "Marketing Director, GreenLife", "accent": "#7B61FF"}'::jsonb),
  ('Home', '7', 'review4', 7, 'json', NULL, NULL, E'“ทีมงานเข้าใจธุรกิจของเราตั้งแต่ครั้งแรกที่คุยกัน\nแผนที่ได้จึงลงมือทำได้ทันที ไม่ใช่รายงานที่วางบนหิ้ง”', E'“They understood our business from the first conversation,\nso the plan was something we could act on, not a report on a shelf.”', '{"meta": "5 min read", "name": "คุณธนกฤต ชัยพร", "role": "เจ้าของธุรกิจค้าปลีก", "accent": "#27AE60"}'::jsonb, '{"meta": "5 min read", "name": "Thanakrit Chaiporn", "role": "Retail business owner", "accent": "#27AE60"}'::jsonb),
  ('Home', '7', 'review5', 8, 'json', NULL, NULL, E'“คอนเทนต์ที่ทีมทำให้ช่วยให้ลูกค้าเข้าใจสินค้าของเราง่ายขึ้นมาก\nยอดทักเข้ามาสอบถามเพิ่มขึ้นเท่าตัวภายในไตรมาสเดียว”', E'“Their content made our products far easier to understand.\nEnquiries doubled within a single quarter.”', '{"meta": "5 min read", "name": "คุณพิมพ์ชนก แสงทอง", "role": "Head of Marketing, Bloom Cosmetics", "accent": "#F2994A"}'::jsonb, '{"meta": "5 min read", "name": "Pimchanok Sangthong", "role": "Head of Marketing, Bloom Cosmetics", "accent": "#F2994A"}'::jsonb),
  ('Home', '8', 'title', 1, 'text', NULL, NULL, 'พร้อมเริ่มต้นการเติบโตครั้งสำคัญ', 'Ready to start the growth that matters', NULL, NULL),
  ('Home', '8', 'description', 2, 'text', NULL, NULL, 'ปรึกษากับทีมงาน Sriwilai เพื่อค้นหาโอกาสใหม่ ๆ ให้ธุรกิจของคุณ ไม่ว่าจะเป็นกลยุทธ์ การตลาด หรือการสร้างแบรนด์', 'Talk to the Sriwilai team about the next opportunity for your business — strategy, marketing or brand.', NULL, NULL),
  ('Home', '8', 'emailPlaceholder', 3, 'text', NULL, NULL, 'Enter your Email', 'Enter your Email', NULL, NULL),
  ('Home', '8', 'submitButton', 4, 'button', 'contact-us', NULL, 'Subscribe', 'Subscribe', NULL, NULL),
  ('Home', '8', 'bgImg', 5, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"width": 1536, "height": 1024, "mediaAltText": "", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb, '{"width": 1536, "height": 1024, "mediaAltText": "", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb),
  ('ContactUs', '1', 'eyebrow', 1, 'text', NULL, NULL, 'Contact Us', 'Contact Us', NULL, NULL),
  ('ContactUs', '1', 'title', 2, 'text', NULL, NULL, 'ติดต่อเรา', 'Contact us', NULL, NULL),
  ('ContactUs', '1', 'description', 3, 'text', NULL, NULL, 'เริ่มต้นสร้างความเติบโตให้กับแบรนด์ของคุณอย่างยั่งยื่นไปพร้อมกับเรา', 'Start the conversation about strategy and marketing built for your business alone.', NULL, NULL),
  ('ContactUs', '1', 'bgImg', 4, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"width": 1536, "height": 1024, "mediaAltText": "สำนักงาน Sriwilai Consulting & Marketing Agency", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb, '{"width": 1536, "height": 1024, "mediaAltText": "The Sriwilai Consulting & Marketing Agency office", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb),
  ('ContactUs', '2', 'title', 1, 'text', NULL, NULL, 'ช่องทางการติดต่อเรา', 'How to reach us', NULL, NULL),
  ('ContactUs', '2', 'description', 2, 'text', NULL, NULL, 'เราพร้อมให้คำปรึกษา แนะนำแนวคิด และวางแผนไปด้วยกันในทุกขั้นตอน', 'We are here to advise, share ideas and plan with you at every step.', NULL, NULL),
  ('ContactUs', '2', 'detail1', 3, 'json', NULL, NULL, '1188 อาคารโรงแรมแกรนด์ เซนเตอร์ พอยต์ ลุมพินี (สำนักงานเวิร์กแล็บ) ห้องเลขที่ 1606 ถนนพระราม 4 แขวงทุ่งมหาเมฆ เขตสาทร กรุงเทพมหานคร 10120', '1188 Grande Centre Point Lumpini (WorkLab), Room 1606, Rama 4 Road, Thung Maha Mek, Sathon, Bangkok 10120', '{"icon": "Map", "label": "OUR OFFICE"}'::jsonb, '{"icon": "Map", "label": "OUR OFFICE"}'::jsonb),
  ('ContactUs', '2', 'detail2', 4, 'json', NULL, NULL, '02 000 0000', '02 000 0000', '{"href": "tel:020000000", "icon": "Phone", "label": "PHONE NUMBER"}'::jsonb, '{"href": "tel:020000000", "icon": "Phone", "label": "PHONE NUMBER"}'::jsonb),
  ('ContactUs', '2', 'detail3', 5, 'json', NULL, NULL, 'Sriwilai.support@gmail.com', 'Sriwilai.support@gmail.com', '{"href": "mailto:Sriwilai.support@gmail.com", "icon": "Mail", "label": "EMAIL ADDRESS"}'::jsonb, '{"href": "mailto:Sriwilai.support@gmail.com", "icon": "Mail", "label": "EMAIL ADDRESS"}'::jsonb),
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
  ('AboutUs', '1', 'title1', 2, 'text', NULL, NULL, 'จุดเริ่มต้นที่สร้างความเติบโตอย่างมีความหมาย', 'A beginning that builds', NULL, NULL),
  ('AboutUs', '1', 'title2', 3, 'text', NULL, NULL, '', 'growth with meaning', NULL, NULL),
  ('AboutUs', '1', 'subTitle', 4, 'text', NULL, NULL, '“เราไม่ได้เป็นเพียง Consulting & Marketing Agency แต่เราสร้าง Ecosystem ที่เชื่อมการตลาด สื่อ Community และ Technology เพื่อสร้างการเติบโตอย่างยั่งยืน”', 'Sriwilai was founded to be the consultancy that understands a business from the inside.', NULL, NULL),
  ('AboutUs', '1', 'ctaButton', 5, 'button', 'contact-us', NULL, 'ติดต่อเรา', 'Contact us', NULL, NULL),
  ('AboutUs', '1', 'scrollDown', 6, 'text', NULL, NULL, 'Scroll down', 'Scroll down', NULL, NULL),
  ('AboutUs', '1', 'bgImg', 7, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"width": 1536, "height": 1024, "mediaAltText": "สำนักงาน Sriwilai", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb, '{"width": 1536, "height": 1024, "mediaAltText": "The Sriwilai office", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb),
  ('AboutUs', '2', 'eyebrow', 1, 'text', NULL, NULL, 'Our History', 'Our History', NULL, NULL),
  ('AboutUs', '2', 'titleLead', 2, 'text', NULL, NULL, '“เราขับเคลื่อนด้วยกลยุทธ์ ', '“We drive growth with ', NULL, NULL),
  ('AboutUs', '2', 'titleHighlight1', 3, 'text', NULL, NULL, 'นวัตกรรม ', 'strategy', NULL, NULL),
  ('AboutUs', '2', 'titleMid', 4, 'text', NULL, NULL, 'และ ', ' and ', NULL, NULL),
  ('AboutUs', '2', 'titleHighlight2', 5, 'text', NULL, NULL, 'เทคโนโลยี', 'innovation', NULL, NULL),
  ('AboutUs', '2', 'titleTail', 6, 'text', NULL, NULL, '”', '”', NULL, NULL),
  ('AboutUs', '2', 'subTitle', 7, 'text', NULL, NULL, 'จากจุดเริ่มต้น สู่การเดินทางที่สร้างคุณค่าและเติบโตไปพร้อมกับลูกค้า', 'From day one, a journey of building value alongside our clients.', NULL, NULL),
  ('AboutUs', '2', 'description', 8, 'text', NULL, NULL, 'ศรีวิไลก่อตั้งขึ้นจากความตั้งใจที่จะเป็นที่ปรึกษาที่เข้าใจธุรกิจจากภายใน ไม่ใช่แค่ผู้ส่งมอบ รายงานหรือแผนสวยงามที่วางบนหิ้ง เราทำงานเคียงข้างเจ้าของธุรกิจ และทีมผู้บริหาร เพื่อแปลงข้อมูลและความเข้าใจตลาดให้กลายเป็นแผนงานที่ลงมือทำได้จริงทีมของเราผสมผสานทักษะด้านกลยุทธ์ธุรกิจ การสร้างแบรนด์ และการตลาดดิจิทัลเข้าไว้ด้วยกัน เพื่อให้ทุกคำแนะนำ มีทั้งความแม่นยำเชิงตัวเลขและความเข้าใจในพฤติกรรมของผู้บริโภคอย่างแท้จริง', 'Sriwilai was founded to be a consultancy that understands a business from the inside — not one that hands over a handsome report to sit on a shelf. We work beside owners and leadership teams, turning data and market understanding into plans that can actually be run. Our team combines business strategy, brand building and digital marketing, so every recommendation carries both numerical precision and a real grasp of consumer behaviour.', NULL, NULL),
  ('AboutUs', '3', 'eyebrow', 1, 'text', NULL, NULL, 'Our Journey', 'Our Journey', NULL, NULL),
  ('AboutUs', '3', 'titleLead', 2, 'text', NULL, NULL, 'เส้นทาง', 'Our road to ', NULL, NULL),
  ('AboutUs', '3', 'titleHighlight', 3, 'text', NULL, NULL, 'ความสำเร็จ', 'success', NULL, NULL),
  ('AboutUs', '3', 'titleTail', 4, 'text', NULL, NULL, 'ของเรา', '', NULL, NULL),
  ('AboutUs', '3', 'step1', 5, 'json', NULL, NULL, 'ก่อตั้งบริษัท', 'The company begins', '{"body": "เริ่มต้นด้วยทีมงานขนาดเล็กที่มีวิสัยทัศน์กว้างไกลในการพลิกโฉมวงการที่ปรึกษา", "icon": "Wrench"}'::jsonb, '{"body": "A small team with a wide vision for reshaping the consulting industry.", "icon": "Wrench"}'::jsonb),
  ('AboutUs', '3', 'step2', 6, 'json', NULL, NULL, 'ขยายฐานลูกค้า', 'A wider client base', '{"body": "ขยานฐานลูกค้าสู่ระดับสากล สร้างผลงานและความสำเร็จในหลายอุตสาหกรรม", "icon": "Expand"}'::jsonb, '{"body": "Serving multinational organisations and making an impact across industries.", "icon": "Expand"}'::jsonb),
  ('AboutUs', '3', 'step3', 7, 'json', NULL, NULL, 'ขยายขีดความสามารถ', 'Deeper capability', '{"body": "ต่อยอดองค์ความรู้และพัฒนากระบวนการทำงานด้วยเทคโนโลยีและเครื่องมือที่ทันสมัย", "icon": "UserRoundPlus"}'::jsonb, '{"body": "Extending our knowledge and sharpening our process with modern tooling.", "icon": "UserRoundPlus"}'::jsonb),
  ('AboutUs', '3', 'step4', 8, 'json', NULL, NULL, 'เติบโตอย่างไม่หยุดยั้ง', 'Growth without pause', '{"body": "ได้รับความไว้วางใจจากแบรนด์และเจ้าของธุรกิจชั้นนำในหลากหลายอุตสาหกรรม", "icon": "ChartNoAxesCombined"}'::jsonb, '{"body": "Trusted by leading brands and organisations across many sectors.", "icon": "ChartNoAxesCombined"}'::jsonb),
  ('AboutUs', '4', 'eyebrow', 1, 'text', NULL, NULL, 'Mission & Vision', 'Mission & Vision', NULL, NULL),
  ('AboutUs', '4', 'titleLead', 2, 'text', NULL, NULL, 'เปลี่ยนวิสัยทัศน์', 'Turning vision ', NULL, NULL),
  ('AboutUs', '4', 'titleHighlight', 3, 'text', NULL, NULL, 'ให้กลายเป็นความจริง', 'into reality', NULL, NULL),
  ('AboutUs', '4', 'subTitle', 4, 'text', NULL, NULL, 'จากแนวคิดแปรเปลี่ยนเป็นผลลัพธ์ที่จับต้องได้ เราพร้อมทำให้วิสัยทัศน์ของคุณเป็นจริงด้วยนวัตกรรมที่ทรงพลังและมีประสิทธิภาพ', 'From idea to outcome, we make your vision real with solutions that are both powerful and efficient.', NULL, NULL),
  ('AboutUs', '4', 'pillar1', 5, 'json', NULL, NULL, 'Our mission', 'Our mission', '{"body": "ยกระดับศักยภาพของธุรกิจผ่านกลยุทธ์ที่เฉียบคมและการวิเคราะห์ข้อมูลเชิงลึก เรามุ่งมั่นที่จะเป็นหุ้นส่วนเชิงกลยุทธ์ที่น่าเชื่อถือที่สุด สร้างความได้เปรียบทางการแข่งขันที่ยั่งยืนในทุกอุตสาหกรรม"}'::jsonb, '{"body": "To raise what a business is capable of through sharp strategy and deep analysis — and to be the most dependable strategic partner, building durable advantage in any industry."}'::jsonb),
  ('AboutUs', '4', 'pillar2', 6, 'json', NULL, NULL, 'Our vision', 'Our vision', '{"body": "เป็นผู้นำด้านที่ปรึกษาธุรกิจระดับภูมิภาคที่กำหนดนิยามใหม่ของความสำเร็จด้วยนวัตกรรมทางความคิดและการปฏิบัติที่ส่งมอบผลลัพธ์ที่จับต้องได้ในระดับสากล"}'::jsonb, '{"body": "To lead regional business consulting and redefine success through original thinking and practice that delivers tangible results internationally."}'::jsonb),
  ('AboutUs', '4', 'stat1', 7, 'json', NULL, NULL, '20+', '20+', '{"lines": ["เรามีทีมงาน", "ผู้เชี่ยวชาญด้านต่างๆ", "พร้อมช่วยเหลือคุณ"], "title": "ทีมงานผู้เชี่ยวชาญ", "review": false}'::jsonb, '{"lines": ["A team of specialists", "across every discipline", "ready to help you"], "title": "Specialists on the team", "review": false}'::jsonb),
  ('AboutUs', '4', 'stat2', 8, 'json', NULL, NULL, '99%', '99%', '{"lines": ["ลูกค้ายังคงใช้บริการ", "ของเราเพราะคุณภาพและ", "ผลลัพธ์ที่ได้"], "title": "ลูกค้าพึงพอใจทั่วโลก", "review": true}'::jsonb, '{"lines": ["Clients stay with us", "for the quality and", "the results"], "title": "Client satisfaction worldwide", "review": true}'::jsonb),
  ('AboutUs', '4', 'stat3', 9, 'json', NULL, NULL, '10+', '10+', '{"lines": ["ส่งมอบประสบการณ์", "ที่ดีให้แก่ทุกคน"], "title": "โปรเจกต์ที่ส่งมอบแล้ว", "review": false}'::jsonb, '{"lines": ["A good experience", "delivered to everyone"], "title": "Projects delivered", "review": false}'::jsonb),
  ('AboutUs', '4', 'stat4', 10, 'json', NULL, NULL, '3', '3', '{"lines": ["ความเชี่ยวชาญที่", "นำไปสู่ผลลัพธ์ที่", "มีความหมาย"], "title": "รางวัล", "review": false}'::jsonb, '{"lines": ["Expertise that leads", "to results that", "actually matter"], "title": "Awards", "review": false}'::jsonb),
  ('AboutUs', '5', 'eyebrow', 1, 'text', NULL, NULL, 'Our Value', 'Our Value', NULL, NULL),
  ('AboutUs', '5', 'titleLead', 2, 'text', NULL, NULL, 'ค่านิยม', 'The values ', NULL, NULL),
  ('AboutUs', '5', 'titleHighlight', 3, 'text', NULL, NULL, 'ขององกรณ์เรา', 'of our organisation', NULL, NULL),
  ('AboutUs', '5', 'value1', 4, 'json', NULL, NULL, 'ความโปร่งใส', 'Transparency', '{"body": "เราทำงานด้วยความซื่อสัตย์ ตรวจสอบได้และยึดมั่นในจริยธรรมสูงสุด"}'::jsonb, '{"body": "We work honestly, in the open, and hold to the highest ethics."}'::jsonb),
  ('AboutUs', '5', 'value2', 5, 'json', NULL, NULL, 'ความเชี่ยวชาญ', 'Expertise', '{"body": "ทีมที่ปรึกษาที่เข้าใจธุรกิจจากภายในและลงมือทำจริงเคียงข้างคุณ"}'::jsonb, '{"body": "Consultants who understand the business from the inside and do the work beside you."}'::jsonb),
  ('AboutUs', '5', 'value3', 6, 'json', NULL, NULL, 'ความสำเร็จของลูกค้า', 'Client success', '{"body": "เราวัดความสำเร็จของเราจากผลลัพธ์ที่ลูกค้าได้รับ"}'::jsonb, '{"body": "We measure our success by the results our clients get."}'::jsonb),
  ('AboutUs', '5', 'value4', 7, 'json', NULL, NULL, 'นวัตกรรม', 'Innovation', '{"body": "มองหาวิธีใหม่ที่ทำให้ธุรกิจเติบโตได้เร็วและยั่งยืน"}'::jsonb, '{"body": "Looking for new ways to grow a business faster, and for longer."}'::jsonb),
  ('AboutUs', '6', 'missionImage', 1, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"width": 1536, "height": 1024, "mediaAltText": "ภารกิจของศรีวิไล", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb, '{"width": 1536, "height": 1024, "mediaAltText": "The Sriwilai mission", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb),
  ('AboutUs', '6', 'visionImage', 2, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"width": 1536, "height": 1024, "mediaAltText": "วิสัยทัศน์ของศรีวิไล", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb, '{"width": 1536, "height": 1024, "mediaAltText": "The Sriwilai vision", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb),
  ('AboutUs', '7', 'image1', 1, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"label": "บรรยากาศการทำงาน", "width": 1536, "height": 1024, "progress": 45, "mediaAltText": "บรรยากาศการทำงานของทีม", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb, '{"label": "Life at the studio", "width": 1536, "height": 1024, "progress": 45, "mediaAltText": "The team at work", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb),
  ('AboutUs', '7', 'image2', 2, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"label": "ความเชี่ยวชาญ", "width": 1536, "height": 1024, "progress": 75, "mediaAltText": "ความเชี่ยวชาญของทีม", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb, '{"label": "Expertise", "width": 1536, "height": 1024, "progress": 75, "mediaAltText": "The team''s expertise", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb),
  ('AboutUs', '7', 'coverVideo', 3, 'video', NULL, 'contents/2026-10-06T08-34-56_e44be782-60ef-4504-a93e-d356220e9f9d.mp4', '', '', '{"mediaAltText": "บรรยากาศการทำงานที่ Sriwilai", "mediaStorageKey": "contents/2026-10-06T08-34-56_e44be782-60ef-4504-a93e-d356220e9f9d.mp4"}'::jsonb, '{"mediaAltText": "Inside the Sriwilai workplace", "mediaStorageKey": "contents/2026-10-06T08-34-56_e44be782-60ef-4504-a93e-d356220e9f9d.mp4"}'::jsonb),
  ('AboutUs', '8', 'title', 1, 'text', NULL, NULL, 'มาร่วมเป็นส่วนหนึ่งกับเรา', 'Come and join us', NULL, NULL),
  ('AboutUs', '8', 'subTitle', 2, 'text', NULL, NULL, 'เรากำลังมองหาผู้ที่มีความมุ่งมั่นและพร้อมที่จะสร้างการเปลี่ยนแปลงในอุตสาหกรรม หากคุณรักความท้าทาย นี่คือที่ของคุณ', 'We are looking for people ready to change an industry. If you like a challenge, this is your place.', NULL, NULL),
  ('AboutUs', '8', 'ctaButton', 3, 'button', 'contact-us', NULL, 'ดูตำแหน่งงาน', 'See open roles', NULL, NULL),
  ('AboutUs', '8', 'bgImg', 4, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"width": 1536, "height": 1024, "mediaAltText": "", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb, '{"width": 1536, "height": 1024, "mediaAltText": "", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb),
  ('AboutUs', '9', 'person1', 1, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"width": 1536, "height": 1024, "mediaAltText": "ลูกค้าของศรีวิไล", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb, '{"width": 1536, "height": 1024, "mediaAltText": "A Sriwilai client", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb),
  ('AboutUs', '9', 'person2', 2, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"width": 1536, "height": 1024, "mediaAltText": "ลูกค้าของศรีวิไล", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb, '{"width": 1536, "height": 1024, "mediaAltText": "A Sriwilai client", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb),
  ('AboutUs', '9', 'person3', 3, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"width": 1536, "height": 1024, "mediaAltText": "ลูกค้าของศรีวิไล", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb, '{"width": 1536, "height": 1024, "mediaAltText": "A Sriwilai client", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb),
  ('Services', '1', 'eyebrow', 1, 'text', NULL, NULL, 'Our Services', 'Our Services', NULL, NULL),
  ('Services', '1', 'title1', 2, 'text', NULL, NULL, 'บริการของเรา', 'Our services', NULL, NULL),
  ('Services', '1', 'subTitle', 3, 'text', NULL, NULL, 'ขับเคลื่อนการเติบโตของแบรนด์ด้วยนวัตกรรมและกลยุทธ์การตลาดที่แม่นยำ', 'Every side of strategy and marketing your business needs, in one place.', NULL, NULL),
  ('Services', '1', 'scrollDown', 4, 'text', NULL, NULL, 'Scroll down', 'Scroll down', NULL, NULL),
  ('Services', '1', 'bgImg', 5, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"width": 1536, "height": 1024, "mediaAltText": "สำนักงาน Sriwilai", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb, '{"width": 1536, "height": 1024, "mediaAltText": "The Sriwilai office", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb),
  ('Services', '2', 'eyebrow', 1, 'text', NULL, NULL, 'Who We Are', 'Who We Are', NULL, NULL),
  ('Services', '2', 'line1', 2, 'text', NULL, NULL, 'เราสร้างสรรค์และวางแผลกลยุทธ์การตลาดดิจิทัลแบบครบวงจร ที่ไม่ใช่เพียงสร้างการรับรู้', 'We build and plan end-to-end digital communication strategy — not just awareness,', NULL, NULL),
  ('Services', '2', 'line2', 3, 'text', NULL, NULL, 'แต่รวมถึงการสร้างยอดขายจริง เพื่อให้แบรนด์เติบโตได้อย่างยั่งยืน', 'but sales and brand growth that hold up in a digital market.', NULL, NULL),
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
  ('Services', '4', 'eyebrow', 1, 'text', NULL, NULL, 'Our Customer', 'Our Customer', NULL, NULL),
  ('Services', '4', 'title', 2, 'text', NULL, NULL, 'แบรนด์ชั้นนำที่ไว้วางใจเรา', 'The brands that trust us', NULL, NULL),
  ('Services', '4', 'customer1', 3, 'image', NULL, 'contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png', 'Meta', 'Meta', '{"width": 1920, "height": 417, "mediaAltText": "Meta", "mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png"}'::jsonb, '{"width": 1920, "height": 417, "mediaAltText": "Meta", "mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png"}'::jsonb),
  ('Services', '4', 'customer2', 4, 'image', NULL, 'contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png', 'Google Meet', 'Google Meet', '{"width": 1920, "height": 417, "mediaAltText": "Google Meet", "mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png"}'::jsonb, '{"width": 1920, "height": 417, "mediaAltText": "Google Meet", "mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png"}'::jsonb),
  ('Services', '4', 'customer3', 5, 'image', NULL, 'contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png', 'Microsoft', 'Microsoft', '{"width": 1920, "height": 417, "mediaAltText": "Microsoft", "mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png"}'::jsonb, '{"width": 1920, "height": 417, "mediaAltText": "Microsoft", "mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png"}'::jsonb),
  ('Services', '4', 'customer4', 6, 'image', NULL, 'contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png', 'Zoom', 'Zoom', '{"width": 1920, "height": 417, "mediaAltText": "Zoom", "mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png"}'::jsonb, '{"width": 1920, "height": 417, "mediaAltText": "Zoom", "mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png"}'::jsonb),
  ('Services', '4', 'customer5', 7, 'image', NULL, 'contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png', 'Apple', 'Apple', '{"width": 1920, "height": 417, "mediaAltText": "Apple", "mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png"}'::jsonb, '{"width": 1920, "height": 417, "mediaAltText": "Apple", "mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png"}'::jsonb),
  ('Services', '4', 'customer6', 8, 'image', NULL, 'contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png', 'ธนาคารกสิกรไทย', 'ธนาคารกสิกรไทย', '{"width": 1920, "height": 417, "mediaAltText": "ธนาคารกสิกรไทย", "mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png"}'::jsonb, '{"width": 1920, "height": 417, "mediaAltText": "ธนาคารกสิกรไทย", "mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png"}'::jsonb),
  ('Services', '4', 'customer7', 9, 'image', NULL, 'contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png', 'xiaomi', 'xiaomi', '{"width": 1920, "height": 417, "mediaAltText": "xiaomi", "mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png"}'::jsonb, '{"width": 1920, "height": 417, "mediaAltText": "xiaomi", "mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png"}'::jsonb),
  ('Services', '4', 'customer8', 10, 'image', NULL, 'contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png', 'andreessen horowitz', 'andreessen horowitz', '{"width": 1920, "height": 417, "mediaAltText": "andreessen horowitz", "mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png"}'::jsonb, '{"width": 1920, "height": 417, "mediaAltText": "andreessen horowitz", "mediaStorageKey": "contents/2026-09-22T06-32-37_794d2386-a6de-4f1b-9cd7-bd9953956959.png"}'::jsonb),
  ('Services', '5', 'eyebrow', 1, 'text', NULL, NULL, 'Why Choose us', 'Why Choose us', NULL, NULL),
  ('Services', '5', 'title', 2, 'text', NULL, NULL, 'ทำไมต้องเลือกเรา', 'Why clients choose us', NULL, NULL),
  ('Services', '5', 'subTitle', 3, 'text', NULL, NULL, 'เราเชื่อว่าความสำเร็จของแบรนด์มาจากความเข้าใจในตัวตนของแบรนด์อย่างลึกซึ้งก่อนเริ่มทำการตลาด', 'Because we do not hand over a plan — we hand over results your business can measure.', NULL, NULL),
  ('Services', '5', 'coverImg', 4, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"width": 1536, "height": 1024, "mediaAltText": "ทีมที่ปรึกษาของศรีวิไลทำงานร่วมกับลูกค้า", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb, '{"width": 1536, "height": 1024, "mediaAltText": "Sriwilai consultants working with a client", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb),
  ('Services', '5', 'reason1', 5, 'json', NULL, NULL, 'เข้าใจธุรกิจก่อนเริ่มงาน', 'We understand the business first', '{"body": "เราให้ความสำคัญกับการเข้าใจธุรกิจ เป้าหมาย และความท้าทายอย่างลึกซึ้ง", "icon": "Target"}'::jsonb, '{"body": "We take the time to understand the business, its goals and its real constraints.", "icon": "Target"}'::jsonb),
  ('Services', '5', 'reason2', 6, 'json', NULL, NULL, 'กลยุทธ์และความคิดสร้างสรรค์ทำงานร่วมกัน', 'Strategy and creative together', '{"body": "ผสานกลยุทธ์และความคิดสร้างสรรค์ เพื่อผลลัพธ์ที่มีประสิทธิภาพ", "icon": "Sparkles"}'::jsonb, '{"body": "The two work as one, so the result has both edge and depth.", "icon": "Sparkles"}'::jsonb),
  ('Services', '5', 'reason3', 7, 'json', NULL, NULL, 'ขับเคลื่อนด้วยข้อมูล', 'Driven by real data', '{"body": "ตัดสินใจบนพื้นฐานของข้อมูลจริง เพื่อเพิ่มประสิทธิภาพและผลลัพธ์", "icon": "ChartNoAxesColumn"}'::jsonb, '{"body": "Transparent analysis, feeding straight back into the campaign.", "icon": "ChartNoAxesColumn"}'::jsonb),
  ('Services', '5', 'reason4', 8, 'json', NULL, NULL, 'ดูแลครบ จบในที่เดียว', 'Everything under one roof', '{"body": "ตั้งแต่การวางแผน สร้างสรรค์ จนถึงการลงมือทำ", "icon": "SquareCheckBig"}'::jsonb, '{"body": "From planning through creative to execution.", "icon": "SquareCheckBig"}'::jsonb),
  ('Services', '6', 'title', 1, 'text', NULL, NULL, 'พร้อมเริ่มต้นการเติบโตครั้งสำคัญไปกับเรา', 'Ready to grow with us', NULL, NULL),
  ('Services', '6', 'subTitle', 2, 'text', NULL, NULL, 'ให้ทีมงานคุณภาพของเราให้คำปรึกษาและออกแบบกลยุทธ์การตลาดที่เหมาะกับธุรกิจของคุณ', 'Let our team advise you and design the marketing strategy that fits your business.', NULL, NULL),
  ('Services', '6', 'ctaButton', 3, 'button', 'contact-us', NULL, 'ติดต่อปรึกษาเรา', 'Talk to us', NULL, NULL),
  ('Services', '6', 'bgImg', 4, 'image', NULL, 'contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png', '', '', '{"width": 1536, "height": 1024, "mediaAltText": "", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb, '{"width": 1536, "height": 1024, "mediaAltText": "", "mediaStorageKey": "contents/2026-09-22T06-28-23_e8d0cdd7-e281-41e4-a085-498d799a7df3.png"}'::jsonb);

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
  ('footer.brandName', 'Layout: footer.brandName'),
  ('footer.brandDescription', 'Layout: footer.brandDescription'),
  ('footer.followUs', 'Layout: footer.followUs'),
  ('footer.navigation.title', 'Layout: footer.navigation.title'),
  ('footer.utility.title', 'Layout: footer.utility.title'),
  ('footer.utility.ourMission', 'Layout: footer.utility.ourMission'),
  ('footer.utility.ourVision', 'Layout: footer.utility.ourVision'),
  ('footer.utility.ourHistory', 'Layout: footer.utility.ourHistory'),
  ('footer.contact.title', 'Layout: footer.contact.title'),
  ('footer.contact.address', 'sriwilai-web-service src/components/layout/footer.tsx'),
  ('footer.contact.email', 'sriwilai-web-service src/components/layout/footer.tsx'),
  ('footer.contact.phone', 'sriwilai-web-service src/components/layout/footer.tsx'),
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
  ('footer.brandName', 'th', 'SRIWILAI'),
  ('footer.brandName', 'en', 'SRIWILAI'),
  ('footer.brandDescription', 'th', 'ศรีวิไล แบงค็อก ให้บริการด้าน Digital Marketing แบบครบวงจรโดยทีมการตลาดรุ่นใหม่ที่มีประสบการณ์กับแบรนด์ชั้นนำทั้งในไทยและระดับสากลเราพร้อมเป็น Growth Partner ที่ช่วยวางกลยุทธ์ สร้างแบรนด์ และขับเคลื่อนธุรกิจให้เติบโต'),
  ('footer.brandDescription', 'en', 'Sriwilai is a strategy, brand and marketing consultancy that works beside leadership teams, turning data into plans they can act on.'),
  ('footer.followUs', 'th', 'ติดตามเรา'),
  ('footer.followUs', 'en', 'Follow us'),
  ('footer.navigation.title', 'th', 'เมนู'),
  ('footer.navigation.title', 'en', 'Navigation'),
  ('footer.utility.title', 'th', 'หน้าอื่น ๆ'),
  ('footer.utility.title', 'en', 'Utility Pages'),
  ('footer.utility.ourMission', 'th', 'พันธกิจของเรา'),
  ('footer.utility.ourMission', 'en', 'Our Mission'),
  ('footer.utility.ourVision', 'th', 'วิสัยทัศน์ของเรา'),
  ('footer.utility.ourVision', 'en', 'Our Vision'),
  ('footer.utility.ourHistory', 'th', 'ประวัติของเรา'),
  ('footer.utility.ourHistory', 'en', 'Our History'),
  ('footer.contact.title', 'th', 'ติดต่อ'),
  ('footer.contact.title', 'en', 'Contact'),
  ('footer.contact.address', 'th', '1188 โรงแรมเกรนด์ เซนเตอร์ พอยต์ ลุมพินี (สำนักงานเวิร์กแล็บ) หมายเลขห้อง 1606 ถ. พระราม 4 แขวงทุ่งมหาเมฆ เขตสาทร กรุงเทพมหานคร 10120'),
  ('footer.contact.address', 'en', '1188 Grande Centre Point Lumpini (Worklab Office), Room 1606, Rama IV Road, Thung Maha Mek, Sathon, Bangkok 10120'),
  ('footer.contact.email', 'th', 'sriwilai.executive@gmail.com'),
  ('footer.contact.email', 'en', 'sriwilai.executive@gmail.com'),
  ('footer.contact.phone', 'th', ''),
  ('footer.contact.phone', 'en', ''),
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