"use client"

import ReactCountryFlag from "react-country-flag"
import { usePathname, useRouter } from "next/navigation"

import { Check, ChevronDown } from "lucide-react"
import { DropdownMenu } from "radix-ui"

import cn from "@/lib/tw-merge"
import { LanguageResponseDto } from "@/services/generated-cli/api-app-service"

import { LANGUAGE } from "@/shared/constants/common.constants"

interface LanguageSelectorProps {
  currentLanguage: string
  languages: LanguageResponseDto[]
  variant?: "dropdown" | "mobile"
}

const FLAG_ICON_SIZE_CLASS: Record<number, string> = {
  16: "size-4",
  20: "size-5",
}

export const FlagIcon = ({ countryCode, size = 16 }: { countryCode: string; size?: number }) => (
  <span
    className={cn(
      "flag-icon relative inline-block shrink-0 overflow-hidden rounded-full",
      FLAG_ICON_SIZE_CLASS[size] ?? "size-4",
    )}
  >
    <ReactCountryFlag countryCode={countryCode} svg aria-label={countryCode} />
  </span>
)

function MobileLanguageToggle({
  currentLanguage,
  languages,
}: {
  currentLanguage: string
  languages: LanguageResponseDto[]
}) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = (newLanguageCode: LANGUAGE) => {
    const pathParts = pathname.split("/")
    pathParts[1] = newLanguageCode
    router.replace(pathParts.join("/"))
  }

  if (languages.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col p-1 gap-2">
      {languages.map((language) => {
        const isActive = language.languageCode === currentLanguage
        const flag = (language.languageFlag ?? language.languageCode).toUpperCase()

        return (
          <button
            key={language.languageCode}
            type="button"
            onClick={() => handleLanguageChange(language.languageCode as LANGUAGE)}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm transition-all",
              "hover:cursor-pointer",
              isActive
                ? "bg-(--surface-default) text-(--text-primary) shadow-sm"
                : "text-(--text-secondary) hover:text-(--text-primary)",
            )}
            aria-pressed={isActive}
          >
            <FlagIcon countryCode={flag} size={16} />
            <span>{language.languageLabel}</span>
          </button>
        )
      })}
    </div>
  )
}

const LanguageSelector = ({ currentLanguage, languages, variant = "dropdown" }: LanguageSelectorProps) => {
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = (newLanguageCode: LANGUAGE) => {
    const pathParts = pathname.split("/")
    pathParts[1] = newLanguageCode
    router.replace(pathParts.join("/"))
  }

  if (variant === "mobile") {
    return <MobileLanguageToggle currentLanguage={currentLanguage} languages={languages} />
  }

  const currentLanguageData = languages.find((l) => l.languageCode === currentLanguage)
  const currentFlag = (currentLanguageData?.languageFlag ?? currentLanguage).toUpperCase()

  if (languages.length === 0) {
    return (
      <button
        disabled
        className="inline-flex items-center gap-1.5 px-1 py-1.5 opacity-50 cursor-not-allowed "
        aria-label="language selector"
      >
        {/* <FlagIcon countryCode={currentFlag} size={16} /> */}
        <span className="text-sm text-(--text-invert)">{currentLanguage.toUpperCase()}</span>
        <ChevronDown size={14} strokeWidth={3.5} className="text-(--text-invert)" />
      </button>
    )
  }

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 px-6 py-1.5",
            "text-(--text-primary) transition-opacity outline-none",
            "hover:opacity-80",
            "bg-(--surface-default)/15 border border-(--surface-default)/12 rounded-full backdrop-blur-xs"
          )}
          aria-label="language selector"
        >
          {/* <FlagIcon countryCode={currentFlag} size={16} /> */}
          <span className="text-sm text-(--text-invert)">{currentLanguage.toUpperCase()}</span>
          <ChevronDown size={16} strokeWidth={3.5} className="text-(--text-invert) ml-2" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        align="end"
        sideOffset={6}
        collisionPadding={10}
        className={cn(
          "min-w-35 bg-(--surface-default)/15 border border-(--surface-default)/12 rounded-full backdrop-blur-xs",
          "p-1 shadow-lg",
          "max-h-[min(var(--radix-dropdown-menu-content-available-height),20rem)] overflow-y-auto overscroll-contain",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "z-50",
        )}
      >
        {languages.map((language) => (
          <DropdownMenu.Item
            key={language.languageCode}
            onSelect={() => handleLanguageChange(language.languageCode as LANGUAGE)}
            className={cn(
              "flex items-center justify-between gap-2 px-2 py-1.5 rounded-sm",
              "text-sm text-(--text-invert) cursor-pointer outline-none",
              "hover:bg-(--color-primary)/10 focus:bg-(--color-primary)/10",
              "mb-0.5 last:mb-0",
            )}
          >
            <div className="flex items-center gap-2">
              <FlagIcon countryCode={(language.languageFlag ?? language.languageCode).toUpperCase()} size={16} />
              <span>{language.languageLabel}</span>
            </div>
            {language.languageCode === currentLanguage && (
              <Check size={14} className="text-(--text-invert)" />
            )}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default LanguageSelector
