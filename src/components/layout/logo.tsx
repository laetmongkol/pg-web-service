import { Fragment } from "react";

import FillImage from "@/components/fill-image.component";

export type AppLogoProps = {
  width?: number;
};

const AppLogo = ({ width = 80 }: AppLogoProps) => {
  const widthStyle = { width: `${width}px` };

  return (
    <Fragment>
      <div style={widthStyle} className="hidden select-none dark:block">
        <FillImage
          wrapperClassName="aspect-[5/2] w-full"
          className="object-contain"
          src="/next.svg"
          alt="PIP Group Holding Dark Logo"
          sizes={`${width}px`}
          unoptimized
          priority
        />
      </div>
      <div style={widthStyle} className="select-none dark:hidden">
        <FillImage
          wrapperClassName="aspect-[5/2] w-full"
          className="object-contain"
          src="/next.svg"
          alt="PIP Group Holding Light Logo"
          sizes={`${width}px`}
          unoptimized
          priority
        />
      </div>
    </Fragment>
  );
};

export default AppLogo;
