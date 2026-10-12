import cn from "@/lib/tw-merge";

import { HOME_LIGHT_SURFACE_CLASSNAME } from "./styles";

interface LightPanelProps {
    children: React.ReactNode;
    /** Bulge the top / bottom edge into the dark section next to it, like a lens. */
    curveTop?: boolean;
    curveBottom?: boolean;
    className?: string;
}

/**
 * Light band between the dark sections. A curved edge is a full-width ellipse centred on that
 * edge, so it bulges ~2.5rem at the middle and tapers to nothing at both sides.
 */
const LightPanel = ({ children, curveTop, curveBottom, className }: LightPanelProps) => (
    <div className={cn("relative z-10 w-full", HOME_LIGHT_SURFACE_CLASSNAME, className)}>
        {curveTop ? (
            <div
                aria-hidden
                className={cn("absolute inset-x-0 -top-10 -z-10 h-20 rounded-[50%]", HOME_LIGHT_SURFACE_CLASSNAME)}
            />
        ) : null}
        {children}
        {curveBottom ? (
            <div
                aria-hidden
                className={cn("absolute inset-x-0 -bottom-10 -z-10 h-20 rounded-[50%]", HOME_LIGHT_SURFACE_CLASSNAME)}
            />
        ) : null}
    </div>
);

export default LightPanel;
