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
        "px-5 pt-4 sm:px-6",
        "transition-opacity! duration-200! motion-reduce:transition-none!",
        "[.menu-open_&]:opacity-0",
      )}
    >
      <div
        className={cn(
          "pointer-events-auto mx-auto flex min-h-12 max-w-5xl items-center justify-between gap-4",
          "rounded-full border border-(--border-navbar) backdrop-blur-xl",
          "px-5 py-2 sm:px-7",
          "transition-[background-color,box-shadow] duration-300",
          isScrolled
            ? "bg-(--surface-navbar-scrolled) shadow-[var(--shadow-lg)]"
            : "bg-(--surface-navbar) shadow-[0_8px_32px_rgba(0,0,0,0.18)]",
        )}
      >
        {children}
      </div>
    </nav>
  )
}

export default NavbarShell
