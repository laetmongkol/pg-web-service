import { TranslateContentResponseDto } from "@/services/generated-cli/api-app-service";

import CtaCard from "../_shared/cta-card";

import { HOME_MOCK, HOME_MOCK_IMAGE } from "./home-mock";

const MOCK = HOME_MOCK.cta;

interface CtaSectionProps {
    data?: Record<string, TranslateContentResponseDto>;
    language: string;
}

const CtaSection = ({ data, language }: CtaSectionProps) => (
    <CtaCard
        title1={data?.title1?.value || MOCK.title1}
        title2={data?.title2?.value || MOCK.title2}
        description={data?.description?.value || MOCK.description}
        button={data?.button?.value || MOCK.button}
        href={`/${language}/${data?.button?.linkUrl || MOCK.buttonLink}`}
        image={HOME_MOCK_IMAGE}
    />
);

export default CtaSection;
