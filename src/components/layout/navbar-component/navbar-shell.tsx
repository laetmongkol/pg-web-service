"use client"

import { useEffect, useState, type ReactNode } from "react"

import cn from "@/lib/tw-merge"

const SCROLLED_OFFSET = 24

const NavbarShell = ({ children }: { children: ReactNode }) => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const syncScrolled = () => setIsScrolled(window.scrollY > SCROLLED_OFFSET)

    // Run once: a reload partway down the page starts already scrolled.
    syncScrolled()
    window.addEventListener("scroll", syncScrolled, { passive: true })

    return () => window.removeEventListener("scroll", syncScrolled)
  }, [])

  return (
    <nav
      data-scrolled={isScrolled}
      className={cn(
        "fixed inset-x-0 top-0 z-100 border-b",
        "transition-[background-color,border-color,box-shadow] duration-300",
        "bg-(--color-primary)",
        "lg:border-transparent lg:bg-transparent",
        isScrolled && [
          "lg:border-(--surface-default)/15 lg:bg-(--color-primary)/30",
          "lg:shadow-[0_1px_0_0_color-mix(in_oklab,var(--surface-default)_5%,transparent),0_12px_28px_-4px_color-mix(in_oklab,var(--surface-default)_22%,transparent)]",
          "lg:backdrop-blur-lg",
        ],
      )}
    >
      <div className={cn("mx-auto flex min-h-14 max-w-6xl items-center justify-between gap-3 px-6 p-4")}>
        {children}
      </div>
    </nav>
  )
}

export default NavbarShell
