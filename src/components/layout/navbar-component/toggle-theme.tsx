"use client"

import { Fragment } from "react";

import { CloudSun,Moon, Sun, SunMoon } from "lucide-react"

import cn from "@/lib/tw-merge"

import { THEME } from "@/shared/constants/common.constants"
import { useThemeStore } from "@/stores/theme.store"

export default function ToggleTheme() {
  const theme = useThemeStore((s) => s.selectedTheme)
  const changeTheme = useThemeStore((s) => s.changeTheme)

  const handleToggleTheme = () => {
    changeTheme(theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT)
  }

  return (
    <button
      onClick={handleToggleTheme}
      aria-label="Toggle to dark theme"
      className={cn("group relative flex h-8 w-8 items-center justify-center rounded-full text-(--text-primary) transition-all hover:bg-(--color-secondary) hover:cursor-pointer")}
    >
      {
        theme === THEME.LIGHT ? (
          <Fragment>
            <Sun className={cn("w-5 h-5 absolute transition-opacity group-hover:opacity-0")} />
            <CloudSun className={cn("w-5 h-5 absolute opacity-0 transition-opacity group-hover:opacity-100")} />
          </Fragment>
        ) : (
          <Fragment>
            <Moon className={cn("w-5 h-5 absolute transition-opacity group-hover:opacity-0")} />
            <SunMoon className={cn("w-5 h-5 absolute opacity-0 transition-opacity group-hover:opacity-100")} />
          </Fragment>
        )
      }
    </button>
  )
}
