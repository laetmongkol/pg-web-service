import FillImage from "@/components/fill-image.component";

import { COMPANY_BRAND_NAME } from "@/shared/constants/company.constants";

export type AppLogoProps = {
  width?: number;
};

const AppLogo = ({ width = 80 }: AppLogoProps) => {
  const height = Math.round(width * 0.4);

  return (
    <FillImage
      src="/sriwilai.png"
      alt={COMPANY_BRAND_NAME}
      width={width}
      height={height}
      sizes={`${width}px`}
      wrapperClassName="select-none"
      className="h-8 w-auto object-contain object-left sm:h-9"
      unoptimized
      priority
    />
  );
};

export default AppLogo;
