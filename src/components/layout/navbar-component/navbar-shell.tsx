"use client"

import { useEffect, useState, type ReactNode } from "react"

import cn from "@/lib/tw-merge"

const SCROLLED_OFFSET = 24

const NavbarShell = ({ children }: { children: ReactNode }) => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const syncScrolled = () => setIsScrolled(window.scrollY > SCROLLED_OFFSET)

    syncScrolled()
    window.addEventListener("scroll", syncScrolled, { passive: true })

    return () => window.removeEventListener("scroll", syncScrolled)
  }, [])

  return (
    <nav
      data-scrolled={isScrolled}
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-100",
        "px-3 pt-3 sm:px-6 sm:pt-4",
      )}
    >
      <div
        className={cn(
          "pointer-events-auto mx-auto flex min-h-14 max-w-7xl items-center justify-between gap-4",
          "rounded-full border border-(--surface-default)/60 backdrop-blur-lg",
          "px-4 py-2 sm:px-6",
          "transition-[background-color,box-shadow] duration-300",
          isScrolled
            ? "bg-(--surface-default)/95 shadow-[var(--shadow-lg)]"
            : "bg-(--surface-default)/85 shadow-[var(--shadow-md)]",
        )}
      >
        {children}
      </div>
    </nav>
  )
}

export default NavbarShell
