import cn from "@/lib/tw-merge";

import FillImage from "@/components/fill-image.component";

import { COMPANY_BRAND_NAME } from "@/shared/constants/company.constants";

export type AppLogoProps = {
  width?: number;
  className?: string;
};

const LOGO_SRC = "/sriwilai.png";

const AppLogo = ({ width = 80, className }: AppLogoProps) => {
  const height = Math.round(width * 0.4);

  return (
    <span className="relative inline-block select-none">
      <FillImage
        src={LOGO_SRC}
        alt={COMPANY_BRAND_NAME}
        width={width}
        height={height}
        sizes={`${width}px`}
        className={cn("h-8 w-auto object-contain object-left opacity-0 sm:h-9", className)}
        unoptimized
        priority
      />
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 bg-(--brand-grey)",
          "[mask-image:url(/sriwilai.png)] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:left_center]",
          "[-webkit-mask-image:url(/sriwilai.png)] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:left_center]",
        )}
      />
    </span>
  );
};

export default AppLogo;
