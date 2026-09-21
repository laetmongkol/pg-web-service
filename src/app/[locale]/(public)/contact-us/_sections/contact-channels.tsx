import { Mail, type LucideIcon, Map, Phone } from "lucide-react";

import cn from "@/lib/tw-merge";

import FadeIn from "@/app/component/fade-in.components";

const TITLE = "ช่องทางการติดต่อเรา";
const DESCRIPTION = "เราพร้อมให้คำปรึกษา แนะนำแนวคิด และวางแผนไปด้วยกันในทุกขั้นตอน";

/** `href` turns the value into a tel:/mailto: link; the address is plain text. */
const CHANNELS: { label: string; value: string; href?: string; Icon: LucideIcon }[] = [
    {
        label: "OUR OFFICE",
        value: "1188 อาคารโรงแรมแกรนด์ เซนเตอร์ พอยต์ ลุมพินี (สำนักงานเวิร์กแล็บ) ห้องเลขที่ 1606 ถนนพระราม 4 แขวงทุ่งมหาเมฆ เขตสาทร กรุงเทพมหานคร 10120",
        Icon: Map,
    },
    {
        label: "PHONE NUMBER",
        value: "02 000 0000",
        href: "tel:020000000",
        Icon: Phone,
    },
    {
        label: "EMAIL ADDRESS",
        value: "Sriwilai.support@gmail.com",
        href: "mailto:Sriwilai.support@gmail.com",
        Icon: Mail,
    },
];

const OFFICE_HOURS_TITLE = "เวลาทำการ (Office Hours)";
const OFFICE_HOURS = ["จันทร์ – ศุกร์: 10:00 น. – 19:00 น.", "หยุดวันเสาร์ และ อาทิตย์"];

const ContactChannels = () => {
    return (
        <FadeIn className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
                <h2
                    className={cn(
                        "font-bold text-(--text-primary)",
                        "text-2xl leading-snug sm:text-3xl",
                    )}
                >
                    {TITLE}
                </h2>
                <p className="text-xs text-(--text-secondary) md:text-sm">{DESCRIPTION}</p>
            </div>

            <dl className="flex flex-col gap-6">
                {CHANNELS.map(({ label, value, href, Icon }) => (
                    <div key={label} className="flex items-start gap-4">
                        <span
                            className={cn(
                                "flex size-10 shrink-0 items-center justify-center rounded-lg",
                                "border border-(--border-default) bg-(--surface-elevated)",
                            )}
                        >
                            <Icon className="size-4 text-(--text-primary)" strokeWidth={1.6} />
                        </span>

                        <div className="flex min-w-0 flex-col gap-1">
                            <dt className="text-[11px] font-medium tracking-wide text-(--text-muted) uppercase">
                                {label}
                            </dt>
                            <dd className="text-sm leading-relaxed text-(--text-primary)">
                                {href ? (
                                    <a href={href} className="transition-opacity hover:opacity-70">
                                        {value}
                                    </a>
                                ) : (
                                    value
                                )}
                            </dd>
                        </div>
                    </div>
                ))}
            </dl>

            <div
                className={cn(
                    "flex flex-col gap-3 rounded-2xl p-6",
                    "border border-(--border-default) bg-(--surface-page)",
                )}
            >
                <span className="font-bold text-(--text-primary)">{OFFICE_HOURS_TITLE}</span>
                <div className="flex flex-col gap-1">
                    {OFFICE_HOURS.map((line) => (
                        <span key={line} className="text-xs text-(--text-secondary) md:text-sm">
                            {line}
                        </span>
                    ))}
                </div>
            </div>
        </FadeIn>
    );
};

export default ContactChannels;
