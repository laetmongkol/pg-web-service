import FillImage from "@/components/fill-image.component";
import cn from "@/lib/tw-merge";
import Image from "next/image";

const mockUpImage = "/api/app/image/gocprime/contents/2026-08-06T10-33-14_6af64cfa-5bcf-45e4-b88f-333644a5769e.webp";

const AboutUs = () => {
    return (
        <section className={cn("flex flex-col max-w-6xl mx-auto px-6 sm:px-12 md:px-16",
            "py-16 gap-8"
        )}>
            <div className={cn(
                "flex flex-col gap-8 whitespace-pre-line",
                "items-center"
            )}>

                <span className={cn(
                    "text-(--color-amber-500) border border-(--color-amber-500) px-4 py-1 rounded-full text-center font-bold"
                )}>
                    {"เกี่ยวกับเรา"}
                </span>

                <h2 className={cn(
                    "font-bold text-(--text-primary)",
                    "text-3xl text-center leading-tight"
                )}>
                    {"มรดกแห่งความไว้วางใจ\nสร้างขึ้นเพื่อตลาดระดับสากล"}
                </h2>

                <p className={cn(
                    "text-(--text-secondary)",
                    "text-base text-center"
                )}>
                    {"ด้วยประสบการณ์กว่าสามทศวรรษ เราเป็นหลักยึดที่มั่นคงให้กับองค์กรที่เผชิญกับการเปลี่ยนแปลงเชิงโครงสร้างเราดำเนินงานที่จุดตัดระหว่างกลยุทธ์ ทางธุรกิจ ข้อมูลเชิงกฎระเบียบ และทุนเพื่อการเปลี่ยนแปลง"}
                </p>
                {/* image caption */}
                <div className={cn(
                    "relative rounded-xl overflow-hidden"
                )}>
                    <FillImage
                        src={mockUpImage}
                        alt="About Us"
                        width={1000}
                        height={1000}
                        wrapperClassName="aspect-square"
                        className={cn(
                            "object-cover"
                        )}
                    />
                    <div className={cn(
                        "flex flex-col justify-center absolute bottom-0 w-full bg-(--surface-invert)/50 backdrop-blur-sm",
                        "p-5 gap-4"
                    )}>
                        <span className={cn(
                            "text-(--text-invert)",
                            "flex flex-row items-center gap-3"
                        )}>
                            <span className={cn("text-3xl font-bold")}>{"100%"}</span>
                            <span className={cn("text-base")}>{"ความสำเร็จของลูกค้า"}</span>
                        </span>
                        <hr className={cn("border-(--surface-default)")} />
                        <p className={cn(
                            "text-(--text-invert)",
                            "text-sm"
                        )}>{"\"ช่วยเพิ่มประสิทธิภาพและผลกำไรสุทธิองค์กรเฉลี่ยกว่า 35% ตั้งแต่ปีแรก\""}</p>
                    </div>
                </div>
                <div className={cn(
                    "flex flex-col gap-4 w-full"
                )}>
                    <div className={cn(
                        "flex flex-row justify-center items-center gap-3 bg-(--color-amber-500) p-8 rounded-3xl",
                    )}>
                        <span className={cn("text-3xl font-bold")}>{"15+"}</span>
                        <span className={cn("text-base font-medium")}>{"ปีแห่งความเชื่อมั่น"}</span>
                    </div>
                    <div className={cn(
                        "flex flex-row justify-center items-center gap-3 bg-(--color-amber-500) p-8 rounded-3xl",
                    )}>
                        <span className={cn("text-3xl font-bold")}>{"6"}</span>
                        <span className={cn("text-base font-medium")}>{"บริษัทในเครือ"}</span>
                    </div>
                    <div className={cn(
                        "flex flex-row justify-center items-center gap-3 bg-(--color-amber-500) p-8 rounded-3xl",
                    )}>
                        <span className={cn("text-3xl font-bold")}>{"20+"}</span>
                        <span className={cn("text-base font-medium")}>{"ผู้เชี่ยวชาญ"}</span>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default AboutUs;