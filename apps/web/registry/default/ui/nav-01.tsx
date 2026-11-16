"use client"

import { Menu, X } from "lucide-react"
import { motion, useMotionValue, useMotionValueEvent } from "motion/react"
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import { cn } from "@/lib/utils"

export type Nav01Link = {
  href: string
  label: string
}

export type Nav01Logo = {
  alt: string
  src: string
}

export type Nav01Props = {
  logo: Nav01Logo
  title: string
  subtitle?: string
  links: Nav01Link[]
  trailing?: ReactNode
  position?: "fixed" | "contained"
  homeHref?: string
  className?: string
}

const scrollShrinkDistance = 8

function findScrollParent(node: HTMLElement | null) {
  let current = node?.parentElement ?? null
  while (current) {
    const overflowY = getComputedStyle(current).overflowY
    if (
      overflowY === "auto" ||
      overflowY === "scroll" ||
      overflowY === "overlay"
    ) {
      return current
    }
    current = current.parentElement
  }
  return null
}

function Nav01({
  logo,
  title,
  subtitle,
  links,
  trailing,
  position = "fixed",
  homeHref = "/",
  className,
}: Nav01Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const rootRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const scrollY = useMotionValue(0)
  const menuId = useId()
  const contained = position === "contained"

  useMotionValueEvent(scrollY, "change", (latest) => {
    const next = latest > scrollShrinkDistance
    setScrolled((current) => (current === next ? current : next))
  })

  useEffect(() => {
    const root = rootRef.current
    const target: HTMLElement | Window = contained
      ? (findScrollParent(root) ?? window)
      : window

    const read = () => {
      scrollY.set(target instanceof Window ? target.scrollY : target.scrollTop)
    }

    read()
    target.addEventListener("scroll", read, { passive: true })
    return () => target.removeEventListener("scroll", read)
  }, [contained, scrollY])

  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header
      ref={rootRef}
      data-scrolled={scrolled ? "true" : "false"}
      style={{ "--nav-pad": scrolled ? "0.75rem" : "1.5rem" } as CSSProperties}
      className={cn(
        "z-30 w-full",
        contained ? "sticky top-0" : "fixed inset-x-0 top-0",
        className,
      )}
    >
      <nav aria-label={title} data-state={menuOpen ? "active" : "closed"} className="@container px-3 pt-2">
        <div
          className={cn(
            "mx-auto max-w-7xl rounded-3xl bg-background/80 px-4 backdrop-blur-2xl transition-shadow duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] motion-reduce:transition-none @sm:px-8",
            scrolled && "shadow-lg shadow-foreground/5",
          )}
        >
          <motion.div
            className={cn(
              "relative flex flex-wrap items-center justify-between gap-4 py-3 transition-[padding] duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] motion-reduce:transition-none @sm:py-(--nav-pad)",
            )}
          >
            <div className="flex w-full items-center justify-between gap-8 @sm:w-auto">
              <a
                href={homeHref}
                className="flex items-center gap-3 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="h-8 w-auto @sm:h-10"
                />
                <span className="flex flex-col items-start gap-1">
                  <span className="text-base font-semibold leading-none tracking-tight text-foreground @sm:text-lg">
                    {title}
                  </span>
                  {subtitle ? (
                    <span className="hidden text-[0.7rem] font-medium uppercase leading-none tracking-[0.16em] text-primary @sm:inline">
                      {subtitle}
                    </span>
                  ) : null}
                </span>
              </a>
              <button
                ref={menuButtonRef}
                type="button"
                className="relative size-11 cursor-pointer rounded-lg text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50 @sm:hidden"
                aria-expanded={menuOpen}
                aria-controls={menuId}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                onClick={() => setMenuOpen((open) => !open)}
              >
                <Menu
                  className={cn(
                    "m-auto size-6 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.19,1,0.22,1)] motion-reduce:transition-none",
                    menuOpen
                      ? "scale-0 rotate-180 opacity-0 motion-reduce:scale-100 motion-reduce:rotate-0"
                      : "scale-100 rotate-0 opacity-100",
                  )}
                />
                <X
                  className={cn(
                    "absolute inset-0 m-auto size-6 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.19,1,0.22,1)] motion-reduce:transition-none",
                    menuOpen
                      ? "rotate-0 scale-100 opacity-100"
                      : "-rotate-180 scale-0 opacity-0 motion-reduce:rotate-0 motion-reduce:scale-100",
                  )}
                />
              </button>
              <ul className="hidden items-center gap-6 @sm:flex">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="rounded-md text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none"
                      onClick={closeMenu}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div
              id={menuId}
              className={cn(
                "w-full flex-col gap-6 rounded-2xl border border-border bg-background p-4 shadow-lg @sm:w-auto @sm:flex-row @sm:items-center @sm:rounded-none @sm:border-transparent @sm:bg-transparent @sm:p-0 @sm:shadow-none",
                menuOpen ? "flex" : "hidden @sm:flex",
              )}
            >
              <ul className="flex flex-col gap-4 @sm:hidden">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="block rounded-md py-1 text-base text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none"
                      onClick={closeMenu}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              {trailing ? (
                <div className="flex flex-col gap-3 @sm:flex-row @sm:items-center">
                  {trailing}
                </div>
              ) : null}
            </div>
          </motion.div>
        </div>
      </nav>
    </header>
  )
}

export { Nav01 }
