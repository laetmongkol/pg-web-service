import cn from "@/lib/tw-merge";
import { LanguageResponseDto } from "@/services/generated-cli/api-app-service";

import LinkCustom from "@/components/link-custom.component";

// import ToggleTheme from "./toggle-theme";
import { LANGUAGE } from "@/shared/constants/common.constants";

import AppLogo from "../logo";
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
        <div className={cn("hidden min-w-0 flex-1 items-center gap-4 lg:flex")}>

            <div className={cn("navbar-nav-scroll flex  max-w-screen-2xl mx-auto flex-1 gap-12 justify-between overflow-x-auto overflow-y-clip overscroll-x-contain h-16")}>
                {showLogo && (
                    <LinkCustom href={`/${language}`} className="flex items-center shrink-0 bg-(--surface-default)/15 border border-(--surface-default)/12 rounded-full backdrop-blur-xs">
                        <AppLogo />
                    </LinkCustom>
                )}
                <NavMenuLinks language={language} links={navLinks} labels={labels.navLinks} />
                <LanguageSelector currentLanguage={language} languages={languages} />
            </div>
        </div>
    )
}
