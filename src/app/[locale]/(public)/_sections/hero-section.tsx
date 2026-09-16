import Image from "next/image";
import cn from "@/lib/tw-merge";
import LinkCustom from "@/components/link-custom.component";
import { ArrowUpRight } from "lucide-react";

const mockUpImage = "/api/app/image/gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp";


const HeroSection = () => {
    return (
        <section className="relative mt-14 lg:mt-0 h-fit flex flex-col h-[1080px] items-center">
            <div className="hidden lg:block">
                <Image
                    src={mockUpImage}
                    alt="Hero Section Desktop"
                    width={2560}
                    height={1440}
                    className={cn("object-cover aspect-[16/8]",
                    )} />
            </div>
            <div className="block lg:hidden">
                <Image
                    src={mockUpImage}
                    alt="Hero Section Mobile"
                    width={2560}
                    height={1440}
                    className={cn("object-cover aspect-square object-left",
                    )} />
            </div>
            <div className={cn("absolute flex flex-col justify-center h-full w-full max-w-6xl mx-auto px-6 sm:px-12 md:px-16",
                "items-center",
                "sm:items-start gap-14"
            )}>
                <div className={cn("flex flex-col",
                    "text-center items-center gap-8 lg:max-xl:pt-5 pt-0",
                    "sm:text-start sm:items-start",
                )}>
                    <span className={cn("font-medium text-(--text-invert) flex items-center gap-2",
                        "text-base sm:text-lg xl:text-xl",
                    )}>
                        <div className="bg-(--color-amber-500) w-2 h-2 inline-block " />{"PIP Group Holding"}
                    </span>
                    <h1 className={cn("font-bold text-(--text-invert) ",
                        "text-3xl leading-snug",
                        "sm:text-5xl sm:leading-tight xl:text-6xl"
                    )}>
                        {"สร้างรากฐานที่แข็งแกร่ง"}
                        <p className={cn("text-(--color-amber-500)",
                        )}>
                            {"เพื่อการเติบโตอย่างยั่งยืน"}
                        </p>
                    </h1>
                    <p className={cn("text-(--text-invert) whitespace-pre-line",
                        "text-base sm:text-lg xl:text-xl",
                    )}>
                        {"PIP Group Holding เชื่อมต่อธุรกิจ โอกาส และศักยภาพเชิงกลยุทธ์ \nเพื่อสร้างคุณค่าระยะยาวให้กับทุกภาคส่วน"}
                    </p>
                </div>
                <LinkCustom href="https://i.pinimg.com/474x/70/f7/a0/70f7a070665b34a456809a905eb5f45e.jpg" target="_blank" className="w-fit hidden sm:block">
                    <span className={cn(
                        "font-medium text-(--text-invert) flex items-center gap-2",
                        "bg-(--surface-default)/15 border border-(--surface-default)/12 rounded-full backdrop-blur-xs",
                        "hover:bg-(--surface-default)/30 hover:scale-105 transition-all duration-300",
                        "text-base px-6 py-4 xl:text-xl xl:px-8 xl:py-6"
                    )}>
                        {"ค้นหาข้อมูลของเรา"}
                        <ArrowUpRight className={cn("inline-block",
                            "w-8 h-8"
                        )} />
                    </span>
                </LinkCustom>
            </div>
        </section>
    )
}

export default HeroSection;