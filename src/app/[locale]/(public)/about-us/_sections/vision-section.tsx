import cn from "@/lib/tw-merge";

import VisionSlide, { type VisionItem } from "./components/vision-slide";

interface VisionSectionProps {
    data: any;
    language: string;
}

const mockUpImage = "/api/app/image/gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp";

const VISION_ITEMS: VisionItem[] = [
    {
        tag: "VISION",
        titleAccent: "วิสัยทัศน์",
        title: "ของเรา",
        image: mockUpImage,
        quote: "\"เป็นผู้นำด้านการสร้างสรรค์กลุ่มธุรกิจที่เติบโตอย่างยั่งยืน มีจริยธรรม และส่งมอบผลลัพธ์ที่เป็นเลิศแก่ลูกค้าและผู้มีส่วนได้ส่วนเสียในระดับสากล\"",
        description: "เรามุ่งมั่นผลักดันการพัฒนาโครงสร้างพื้นฐาน นวัตกรรมทางการเงิน และแพลตฟอร์มเทคโนโลยีที่จะเปลี่ยนผ่านสังคมและสร้างอนาคตที่ดีกว่า",
    },
    {
        tag: "MISSION",
        titleAccent: "พันธกิจ",
        title: "ของเรา",
        image: mockUpImage,
        reverse: true,
        points: [
            {
                title: "การจัดการสินทรัพย์",
                description: "บริหารสินทรัพย์และกองทุนด้วยหลักการที่ปลอดภัย โปร่งใส และสร้างผลตอบแทนสูงสุด",
            },
            {
                title: "สนับสนุนนวัตกรรม",
                description: "ลงทุนในเทคโนโลยีและระบบที่จะช่วยอำนวยความสะดวกในการทำธุรกิจอย่างรอบด้าน",
            },
            {
                title: "พันธกิจเพื่อสังคม",
                description: "ดำเนินธุรกิจด้วยธรรมาภิบาลและการกำกับดูแลกิจการที่ดีเพื่อสังคมและสิ่งแวดล้อม",
            },
        ],
    },
];

const VisionSection = ({ data, language }: VisionSectionProps) => {
    return (
        <section className={cn("flex flex-col max-w-7xl mx-auto px-6 sm:px-12 md:px-16 w-full",
            "py-16",
        )}>
            <VisionSlide items={VISION_ITEMS} />
        </section>
    );
};

export default VisionSection;
