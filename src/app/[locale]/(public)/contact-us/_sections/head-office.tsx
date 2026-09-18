import type { ReactNode } from "react";

import { Clock, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";

import { convertObjectToArrayByPrefix } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import { COMPANY_LEGAL_NAME } from "@/shared/constants/company.constants";

interface HeadOfficeProps {
    data?: Record<string, TranslateContentResponseDto>;
}

/** attributes on `detail*` — the address / phone / email text itself is the row value. */
interface OfficeDetailAttributes {
    icon?: string;
    label?: string;
}

const OFFICE_ICONS: Record<string, LucideIcon> = {
    MapPin,
    Phone,
    Mail,
    Clock,
};

const resolveOfficeIcon = (icon?: string | null): LucideIcon =>
    (icon && OFFICE_ICONS[icon]) || MapPin;

const nowrapTokens = (text: string): ReactNode[] =>
    text.split(" ").flatMap((token, index) => {
        const held = (
            <span key={index} className="whitespace-nowrap">
                {token}
            </span>
        );
        return index === 0 ? [held] : [" ", held];
    });

/** Google ยังไม่มี listing ของ PIP Group เอง — หมุดจึงชี้อาคารเกษรอัมรินทร์ ซึ่งเป็นที่ตั้งจริง */
const OFFICE_PLACE_NAME = "เกษรอัมรินทร์";
/** feature id ของสถานที่บน Google Maps — ทำให้ embed ขึ้นหมุดพร้อมการ์ดชื่อ/ที่อยู่จากในแมพเอง */
const OFFICE_PLACE_FTID = "0x30e29eda9b36b1d3:0xbcc1bbe09f2e2d36";

const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(OFFICE_PLACE_NAME)}&ftid=${OFFICE_PLACE_FTID}&hl=th&z=17&output=embed`;

const HeadOffice = ({ data }: HeadOfficeProps) => {
    if (!data) return null;

    const details = convertObjectToArrayByPrefix<OfficeDetailAttributes>(data, "detail");

    return (
        <div className="flex flex-col gap-6">
            <h2
                className={cn(
                    "font-bold text-(--text-primary)",
                    "text-2xl sm:text-3xl",
                )}
            >
                {data?.title?.value}
            </h2>

            <dl className="flex flex-col gap-5">
                {details.map((item) => {
                    const Icon = resolveOfficeIcon(item.attributes?.icon);
                    return (
                        <div key={item.key} className="flex flex-col gap-1">
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
                                {item.attributes?.label}
                            </dt>
                            <dd
                                className={cn(
                                    "pl-6 text-(--text-secondary)",
                                    "text-xs sm:text-sm",
                                )}
                            >
                                {nowrapTokens(item.value ?? "")}
                            </dd>
                        </div>
                    );
                })}
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
