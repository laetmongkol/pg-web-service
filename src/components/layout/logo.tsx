import cn from "@/lib/tw-merge";

import FillImage from "@/components/fill-image.component";

import { COMPANY_BRAND_NAME } from "@/shared/constants/company.constants";

export type AppLogoProps = {
  width?: number;
  className?: string;
  /** `invert` = white mark for dark glass nav */
  tone?: "brand" | "invert";
};

const LOGO_SRC = "/PIPEvolution.png";

const AppLogo = ({ width = 80, className, tone = "brand" }: AppLogoProps) => {
  const height = Math.round(width * 0.4);

  return (
    <span className="relative inline-flex select-none items-center align-middle">
      <FillImage
        draggable={false}
        src={LOGO_SRC}
        alt={COMPANY_BRAND_NAME}
        width={width}
        height={height}
        sizes={`${width}px`}
        className={cn("block h-8 w-auto object-contain object-left opacity-0 sm:h-9", className)}
        unoptimized
        priority
      />
      <span
        aria-hidden
        className={cn(
          "absolute inset-0",
          tone === "invert" ? "bg-white" : "bg-(--brand-primary)",
          "[mask-image:url(/PIPEvolution.png)] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:left_center]",
          "[-webkit-mask-image:url(/PIPEvolution.png)] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:left_center]",
        )}
      />
    </span>
  );
};

export default AppLogo;
