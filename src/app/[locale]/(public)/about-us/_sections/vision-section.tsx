import { convertObjectToArrayByPrefix, extractAttributes, PictureAttributes } from "@/lib/cms/content-attributes";
import cn from "@/lib/tw-merge";
import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import VisionSlide, { type VisionItem } from "./components/vision-slide";

interface VisionSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

/** attributes on `missionPoint*` — the point title is the row value. */
interface MissionPointAttributes {
    description?: string;
}

const VisionSection = ({ data }: VisionSectionProps) => {
    if (!data) return null;

    const visionPicture = extractAttributes<PictureAttributes>(data?.visionImage);
    const missionPicture = extractAttributes<PictureAttributes>(data?.missionImage);
    const missionPoints = convertObjectToArrayByPrefix<MissionPointAttributes>(data, "missionPoint").map((item) => ({
        title: item.value ?? "",
        description: item.attributes?.description ?? "",
    }));

    const items: VisionItem[] = [
        {
            tag: data?.visionTag?.value ?? "",
            titleAccent: data?.visionTitleAccent?.value ?? "",
            title: data?.visionTitle?.value ?? "",
            image: visionPicture?.mediaStorageKey ?? "",
            quote: data?.visionQuote?.value,
            description: data?.visionDescription?.value,
        },
        {
            tag: data?.missionTag?.value ?? "",
            titleAccent: data?.missionTitleAccent?.value ?? "",
            title: data?.missionTitle?.value ?? "",
            image: missionPicture?.mediaStorageKey ?? "",
            reverse: true,
            points: missionPoints,
        },
    ];

    return (
        <section className={cn("flex flex-col max-w-7xl mx-auto px-6 sm:px-12 md:px-16 w-full",
            "py-16",
        )}>
            <VisionSlide items={items} />
        </section>
    );
};

export default VisionSection;
