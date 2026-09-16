import type { ReactNode } from "react";

import { Clock, Mail, MapPin, Navigation, Phone, type LucideIcon } from "lucide-react";

import cn from "@/lib/tw-merge";

import LinkCustom from "@/components/link-custom.component";

const OFFICE_NAME = "PIP GROUP HOLDINGS CO., LTD.";
const OFFICE_ADDRESS =
    "502 อาคารเกษร อัมรินทร์ ห้องเลขที่ 8A ชั้น 9 ถนนเพลินจิต แขวงลุมพินี เขตปทุมวัน กรุงเทพมหานคร 10330";

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
    { key: "address", Icon: MapPin, label: "ที่อยู่", value: OFFICE_ADDRESS },
    { key: "phone", Icon: Phone, label: "เบอร์โทร", value: "02 000 0000" },
    { key: "email", Icon: Mail, label: "อีเมล", value: "support@pipgroup.com" },
    { key: "hours", Icon: Clock, label: "เวลาทำการ", value: "จันทร์ - ศุกร์: 10:00น. - 19:00น." },
];

const DIRECTIONS_HREF = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(OFFICE_ADDRESS)}`;

const MAP_EMBED_SRC = `https://maps.google.com/maps?q=${encodeURIComponent(`${OFFICE_NAME} ${OFFICE_ADDRESS}`)}&hl=th&z=17&output=embed`;

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
                    title={`แผนที่ ${OFFICE_NAME}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                    className="block aspect-square w-full border-0 lg:aspect-[4/3]"
                />

                <div
                    className={cn(
                        "pointer-events-none absolute inset-x-0 top-1/2 -translate-y-full",
                        "flex flex-col items-center gap-1",
                    )}
                >
                    <span
                        className={cn(
                            "rounded-lg shadow-md",
                            "bg-(--color-primary) text-(--text-invert)",
                            "px-4 py-1.5 text-xs font-medium",
                        )}
                    >
                        {OFFICE_NAME}
                    </span>
                    <MapPin
                        className={cn(
                            "size-7 drop-shadow-md",
                            "fill-(--color-danger-500) text-(--surface-default)",
                        )}
                        strokeWidth={1.5}
                    />
                </div>

                <div
                    className={cn(
                        "absolute inset-x-3 bottom-3 flex items-end justify-between gap-3",
                        "hidden lg:flex",
                        "rounded-xl bg-(--surface-default)/95 p-3 backdrop-blur-sm",
                    )}
                >
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-(--text-primary)">
                            {OFFICE_NAME}
                        </span>
                        <span className="text-xs text-(--text-secondary)">
                            {nowrapTokens(OFFICE_ADDRESS)}
                        </span>
                    </div>
                    <LinkCustom
                        href={DIRECTIONS_HREF}
                        target="_blank"
                        className="shrink-0"
                    >
                        <span
                            className={cn(
                                "flex items-center gap-1.5 rounded-lg",
                                "bg-(--color-primary) text-(--text-invert)",
                                "px-3 py-2 text-xs font-medium",
                                "hover:opacity-90 transition-opacity",
                            )}
                        >
                            <Navigation className="size-3.5" strokeWidth={2} />
                            {"Navigate"}
                        </span>
                    </LinkCustom>
                </div>
            </div>
        </div>
    );
};

export default HeadOffice;
