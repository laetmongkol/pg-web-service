import cn from "@/lib/tw-merge";
import { LanguageResponseDto } from "@/services/generated-cli/api-app-service";

import LinkCustom from "@/components/link-custom.component";
import AppLogo from "@/components/layout/logo";

// import ToggleTheme from "./toggle-theme";
import { LANGUAGE } from "@/shared/constants/common.constants";

import { NavbarLabels, NavLinkItem } from "../navbar";
import LanguageSelector from "./language-selector";
import { NavMenuLinks } from "./nav-links";

interface DesktopNavbarProps {
    language: LANGUAGE;
    navLinks: NavLinkItem[];
    languages: LanguageResponseDto[];
    showLogo?: boolean;
    labels: NavbarLabels;
}

export default function DesktopNavbar({ language, navLinks, languages, showLogo = false, labels }: DesktopNavbarProps) {
    return (
        <div className={cn("hidden min-w-0 flex-1 items-center justify-between gap-6 lg:flex")}>
            {showLogo ? (
                <LinkCustom href={`/${language}`} className="flex shrink-0 items-center">
                    <AppLogo width={80} />
                </LinkCustom>
            ) : (
                <div aria-hidden="true" className="shrink-0" />
            )}

            <div className={cn("navbar-nav-scroll flex min-w-0 flex-1 justify-center overflow-x-auto overflow-y-clip overscroll-x-contain")}>
                <NavMenuLinks language={language} links={navLinks} />
            </div>

            <LanguageSelector currentLanguage={language} languages={languages} variant="segmented" />
        </div>
    )
}
