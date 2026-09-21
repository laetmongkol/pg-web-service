import cn from "@/lib/tw-merge";

import FadeIn from "@/app/component/fade-in.components";

import { COMPANY_LEGAL_NAME } from "@/shared/constants/company.constants";

/**
 * The building the office sits in — Google has no listing for the company itself. Querying the
 * place by name drops its pin and brings up Google's own place card, so the map carries the
 * address on its own instead of us drawing a second card over it.
 */
const OFFICE_PLACE_NAME = "แกรนด์ เซนเตอร์ พอยต์ ลุมพินี";
const OFFICE_PLACE_ADDRESS = "1188 ถ. พระรามที่ 4 แขวงทุ่งมหาเมฆ เขตสาทร กรุงเทพมหานคร 10120";

const MAP_QUERY = `${OFFICE_PLACE_NAME} ${OFFICE_PLACE_ADDRESS}`;
const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&hl=th&z=17&output=embed`;

const OfficeMap = () => {
    return (
        <section id="office-map" className="w-full bg-(--surface-elevated) pb-16 sm:pb-20 lg:pb-24">
            <div className={cn("mx-auto w-full max-w-7xl", "px-4 sm:px-8")}>
                <FadeIn delay={100} className="overflow-hidden rounded-2xl border border-(--border-default)">
                    <iframe
                        src={MAP_EMBED_SRC}
                        title={`แผนที่ ${COMPANY_LEGAL_NAME}`}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                        className="block aspect-[4/3] w-full border-0 sm:aspect-[21/9]"
                    />
                </FadeIn>
            </div>
        </section>
    );
};

export default OfficeMap;
