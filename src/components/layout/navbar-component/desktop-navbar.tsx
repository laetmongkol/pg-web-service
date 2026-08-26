import cn from "@/lib/tw-merge";
import { LanguageResponseDto } from "@/services/generated-cli/api-app-service";

import LinkCustom from "@/components/link-custom.component";

// import ToggleTheme from "./toggle-theme";
import { LANGUAGE } from "@/shared/constants/common.constants";

import AppLogo from "../logo";
import { NavbarLabels,NavLinkItem } from "../navbar";
import LanguageSelector from "./language-selector";
import { NavMenuLinks } from "./nav-links";
import NavbarActions from "./navbar-actions";

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
            {showLogo && (
                <LinkCustom href={`/${language}`} className="shrink-0">
                    <AppLogo/>
                </LinkCustom>
            )}

            <div className={cn("navbar-nav-scroll min-w-0 flex-1 overflow-x-auto overflow-y-clip overscroll-x-contain")}>
                <NavMenuLinks language={language} links={navLinks} labels={labels.navLinks} />
            </div>

            <div className={cn("flex shrink-0 items-center gap-3")}>
                {/* <ToggleTheme /> */}
                <LanguageSelector currentLanguage={language} languages={languages} />
                <div className="h-5 w-px shrink-0 bg-(--border-default)" aria-hidden="true" />
                <NavbarActions
                    language={language}
                    signInLabel={labels.signIn}
                    startTradingLabel={labels.startTrading}
                />
            </div>
        </div>
    )
}
