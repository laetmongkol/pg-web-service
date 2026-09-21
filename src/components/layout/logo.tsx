import cn from "@/lib/tw-merge";

import FillImage from "@/components/fill-image.component";

import { COMPANY_BRAND_NAME } from "@/shared/constants/company.constants";

export type AppLogoProps = {
  width?: number;
  /** Merged onto the <img> — e.g. a brightness filter where the mark sits on a light panel. */
  className?: string;
};

const AppLogo = ({ width = 80, className }: AppLogoProps) => {
  const height = Math.round(width * 0.4);

  return (
    <FillImage
      src="/sriwilai.png"
      alt={COMPANY_BRAND_NAME}
      width={width}
      height={height}
      sizes={`${width}px`}
      wrapperClassName="select-none"
      className={cn("h-8 w-auto object-contain object-left sm:h-9", className)}
      unoptimized
      priority
    />
  );
};

export default AppLogo;
