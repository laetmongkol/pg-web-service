import { PictureAttributes } from "@/lib/cms/content-attributes";
import { BACKEND_IMAGE_PREFIX } from "@/lib/media/image-loader";
import cn from "@/lib/tw-merge";

import FadeIn from "@/app/component/fade-in.components";

import CapabilityBoardCards, { type CapabilityBoardMedia } from "./components/capability-board-cards";
import DragMarquee from "./components/drag-marquee";

const EYEBROW = "Introducing Consulting Pro";

const TITLE_PARTS = [
    { text: "ทีมเดียวครบ ", highlight: false },
    { text: "Strategy, Creative ", highlight: true },
    { text: "และ ", highlight: false },
    { text: "Marketing", highlight: true },
];

const DESCRIPTION =
    "เราเชื่มตั้งแต่การวิเคาะห์ธุรกิจ วางกลยุทฑ์ สร้างแบนรด์ ไปจนถึงการทำการตลาดและวัดผล เพื่อให้ทุกากรสื้อสารเดินไปในทิศทางเดียวกับเป้าหมายของธุรกิจ";

/** Width of one copy of the board — the five columns are sized from it, not from the viewport. */
const BOARD_WIDTH_PX = 1720;

/**
 * Stand-in for the picture rows of this section, hardcoded until the CMS carries them.
 *
 * Shape and field names match what a `translate_contents` picture row returns, so the swap is a
 * one-liner per slot. The wiring it is waiting for, once page `Home` section `5` has the rows:
 *
 *   const data = await translateContentAppServiceServer.getTranslateContentsCached(language, "Home");
 *   <TeamCapabilitySection data={data?.["5"]} />
 *
 *   const media: CapabilityBoardMedia = {
 *       portfolioPrimary: extractAttributes<PictureAttributes>(data?.portfolioImg1),
 *       portfolioSecondary: extractAttributes<PictureAttributes>(data?.portfolioImg2),
 *       consultantAvatar: extractAttributes<PictureAttributes>(data?.consultantImg),
 *       timelineStep: extractAttributes<PictureAttributes>(data?.timelineImg),
 *   };
 *
 * The file itself lives on `mediaStorageKey` and nowhere else — alt text and the intrinsic size
 * ride alongside it, exactly as the CMS stores them.
 */
type BoardPictureCode = "portfolioImg1" | "portfolioImg2" | "consultantImg" | "timelineImg";

const BOARD_MEDIA_ROWS: Record<BoardPictureCode, PictureAttributes> = {
    portfolioImg1: {
        mediaStorageKey: "contents/2026-09-18T10-09-01_9d3a7339-94c1-4b4c-969b-c5ee9180c920.png",
        mediaAltText: "ผลงานออกแบบกลยุทธ์ของ Sriwilai",
        width: 1536,
        height: 1024,
    },
    portfolioImg2: {
        mediaStorageKey: "contents/2026-09-18T10-09-01_9d3a7339-94c1-4b4c-969b-c5ee9180c920.png",
        mediaAltText: "ผลงานสื่อสารแบรนด์ของ Sriwilai",
        width: 1536,
        height: 1024,
    },
    // mock until a portrait is uploaded — the slot is round and cropped, so any photo holds the
    // layout; swap the key for a real headshot
    consultantImg: {
        mediaStorageKey: "contents/2026-09-18T10-09-01_9d3a7339-94c1-4b4c-969b-c5ee9180c920.png",
        mediaAltText: "Amara Robinson",
        width: 1536,
        height: 1024,
    },
    timelineImg: {
        mediaStorageKey: "contents/2026-09-18T10-09-01_9d3a7339-94c1-4b4c-969b-c5ee9180c920.png",
        mediaAltText: "ตัวอย่างงานวางกลยุทธ์ที่ผ่านมา",
        width: 1536,
        height: 1024,
    },
};

/**
 * What `extractAttributes` does to a CMS picture row: the stored key is bare, and the backend image
 * route prefix is added when it is read. Doing it here too keeps the hardcoded rows byte-identical
 * to the CMS ones.
 */
const resolvePicture = (picture: PictureAttributes): PictureAttributes =>
    picture.mediaStorageKey
        ? { ...picture, mediaStorageKey: `${BACKEND_IMAGE_PREFIX}${picture.mediaStorageKey}` }
        : picture;

const BOARD_MEDIA: CapabilityBoardMedia = {
    portfolioPrimary: resolvePicture(BOARD_MEDIA_ROWS.portfolioImg1),
    portfolioSecondary: resolvePicture(BOARD_MEDIA_ROWS.portfolioImg2),
    consultantAvatar: resolvePicture(BOARD_MEDIA_ROWS.consultantImg),
    timelineStep: resolvePicture(BOARD_MEDIA_ROWS.timelineImg),
};

const TeamCapabilitySection = () => {
    return (
        <section
            id="team-capability"
            className={cn("w-full overflow-hidden bg-(--surface-50) surface-noise", "py-16 sm:py-20 lg:py-28")}
        >
            <div>
                <div className={cn("mx-auto flex max-w-7xl flex-col", "px-4 sm:px-8")}>
                    <FadeIn>
                        <span
                            className={cn(
                                "inline-flex w-fit items-center gap-2 rounded-full",
                                "border border-(--border-default)",
                                "px-4 py-1.5 text-xs font-medium text-(--text-primary) md:text-sm",
                            )}
                        >
                            <span className="bg-(--text-primary) size-1.5 shrink-0 rounded-full" />
                            {EYEBROW}
                        </span>
                    </FadeIn>

                    <FadeIn delay={100}>
                        <h2
                            className={cn(
                                "mt-6 font-bold text-balance text-(--text-primary)",
                                "text-2xl leading-snug sm:text-3xl lg:text-4xl lg:leading-tight",
                            )}
                        >
                            {TITLE_PARTS.map(({ text, highlight }) => (
                                <span
                                    key={text}
                                    className={highlight ? "text-(--color-secondary-800)" : undefined}
                                >
                                    {text}
                                </span>
                            ))}
                        </h2>
                    </FadeIn>

                    <FadeIn
                        delay={200}
                        className={cn(
                            "mt-6 max-w-3xl whitespace-pre-line text-(--text-secondary)",
                            "text-sm leading-loose md:text-base",
                        )}
                    >
                        {DESCRIPTION}
                    </FadeIn>
                </div>
            </div>

            {/* full-bleed on purpose: the board has to overflow the frame for the drag to reveal anything */}
            {/* The board drifts, so any column can pass under the heading: pulling it up far enough
                to tuck behind the copy collides with it on a wide screen, where the centred heading
                sits right over the middle columns. mt-0 is as tight as it goes without a collision. */}
            <FadeIn delay={300} className="mt-6 lg:mt-0">
                <DragMarquee copyWidth={BOARD_WIDTH_PX}>
                    <CapabilityBoardCards media={BOARD_MEDIA} />
                </DragMarquee>
            </FadeIn>
        </section>
    );
};

export default TeamCapabilitySection;
