import type { ReactNode } from "react";

import { Clock, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";

import cn from "@/lib/tw-merge";

import {
    COMPANY_ADDRESS,
    COMPANY_EMAIL,
    COMPANY_LEGAL_NAME,
    COMPANY_OFFICE_HOURS,
    COMPANY_PHONE,
} from "@/shared/constants/company.constants";

const nowrapTokens = (text: string): ReactNode[] =>
    text.split(" ").flatMap((token, index) => {
        const held = (
            <span key={index} className="whitespace-nowrap">
                {token}
            </span>
        );
        return index === 0 ? [held] : [" ", held];
    });

type OfficeDetail = {
    key: string;
    Icon: LucideIcon;
    label: string;
    value: string;
};

const OFFICE_DETAILS: OfficeDetail[] = [
    { key: "address", Icon: MapPin, label: "ที่อยู่", value: COMPANY_ADDRESS },
    { key: "phone", Icon: Phone, label: "เบอร์โทร", value: COMPANY_PHONE },
    { key: "email", Icon: Mail, label: "อีเมล", value: COMPANY_EMAIL },
    { key: "hours", Icon: Clock, label: "เวลาทำการ", value: COMPANY_OFFICE_HOURS },
];

/** Google ยังไม่มี listing ของ PIP Group เอง — หมุดจึงชี้อาคารเกษรอัมรินทร์ ซึ่งเป็นที่ตั้งจริง */
const OFFICE_PLACE_NAME = "เกษรอัมรินทร์";
/** feature id ของสถานที่บน Google Maps — ทำให้ embed ขึ้นหมุดพร้อมการ์ดชื่อ/ที่อยู่จากในแมพเอง */
const OFFICE_PLACE_FTID = "0x30e29eda9b36b1d3:0xbcc1bbe09f2e2d36";

const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(OFFICE_PLACE_NAME)}&ftid=${OFFICE_PLACE_FTID}&hl=th&z=17&output=embed`;

const HeadOffice = () => {
    return (
        <div className="flex flex-col gap-6">
            <h2
                className={cn(
                    "font-bold text-(--text-primary)",
                    "text-2xl sm:text-3xl",
                )}
            >
                {"Head Office"}
            </h2>

            <dl className="flex flex-col gap-5">
                {OFFICE_DETAILS.map(({ key, Icon, label, value }) => (
                    <div key={key} className="flex flex-col gap-1">
                        <dt
                            className={cn(
                                "flex items-center gap-2 font-medium text-(--text-primary)",
                                "text-xs sm:text-sm",
                            )}
                        >
                            <Icon
                                className="size-4 shrink-0 text-(--color-secondary)"
                                strokeWidth={1.8}
                            />
                            {label}
                        </dt>
                        <dd
                            className={cn(
                                "pl-6 text-(--text-secondary)",
                                "text-xs sm:text-sm",
                            )}
                        >
                            {nowrapTokens(value)}
                        </dd>
                    </div>
                ))}
            </dl>

            <div className="relative overflow-hidden rounded-2xl">
                <iframe
                    src={MAP_EMBED_SRC}
                    title={`แผนที่ ${COMPANY_LEGAL_NAME}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                    className="block aspect-square w-full border-0 lg:aspect-[4/3]"
                />
            </div>
        </div>
    );
};

export default HeadOffice;
