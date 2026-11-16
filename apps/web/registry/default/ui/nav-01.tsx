"use client"

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { motion, useMotionValue, useMotionValueEvent } from "motion/react"
import { IconPlaceholder } from "@/components/icon-placeholder"
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from "react"
import { cn } from "@/lib/utils"

type Nav01Position = "fixed" | "contained"
type Nav01LinksPlacement = "desktop" | "mobile"

type Nav01ContextValue = {
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
  closeMenu: () => void
  menuId: string
  menuButtonRef: RefObject<HTMLButtonElement | null>
}

const Nav01Context = createContext<Nav01ContextValue | null>(null)

function useNav01() {
  const context = useContext(Nav01Context)
  if (!context) {
    throw new Error("Nav01 components must be used within Nav01.")
  }
  return context
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
  position = "fixed",
  className,
  style,
  children,
  ...props
}: ComponentProps<"header"> & {
  position?: Nav01Position
}) {
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
  const parts = slotChildren(children)
  const desktopLinks = cloneLinks(parts.links, "desktop")
  const mobileLinks = cloneLinks(parts.links, "mobile")

  return (
    <Nav01Context.Provider
      value={{ menuOpen, setMenuOpen, closeMenu, menuId, menuButtonRef }}
    >
      <header
        ref={rootRef}
        data-slot="nav-01"
        data-position={position}
        data-scrolled={scrolled ? "true" : "false"}
        style={
          {
            "--nav-pad": scrolled ? "0.75rem" : "1.5rem",
            ...style,
          } as CSSProperties
        }
        className={cn(
          "z-30 w-full",
          contained ? "sticky top-0" : "fixed inset-x-0 top-0",
          className,
        )}
        {...props}
      >
        <nav
          data-slot="nav-01-nav"
          aria-label="Primary"
          data-state={menuOpen ? "active" : "closed"}
          className="@container px-3 pt-2"
        >
          <div
            data-slot="nav-01-bar"
            className={cn(
              "mx-auto max-w-7xl rounded-3xl bg-background/80 px-4 backdrop-blur-2xl transition-shadow duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] motion-reduce:transition-none @sm:px-8",
              scrolled && "shadow-lg shadow-foreground/5",
            )}
          >
            <motion.div className="relative flex flex-wrap items-center justify-between gap-4 py-3 transition-[padding] duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] motion-reduce:transition-none @sm:py-(--nav-pad)">
              <div className="flex w-full items-center justify-between gap-8 @sm:w-auto">
                {parts.brand}
                {parts.menu ?? <Nav01Menu />}
                {desktopLinks}
              </div>
              <div
                id={menuId}
                data-slot="nav-01-panel"
                className={cn(
                  "w-full flex-col gap-6 rounded-2xl border border-border bg-background p-4 shadow-lg @sm:w-auto @sm:flex-row @sm:items-center @sm:rounded-none @sm:border-transparent @sm:bg-transparent @sm:p-0 @sm:shadow-none",
                  menuOpen ? "flex" : "hidden @sm:flex",
                )}
              >
                {mobileLinks}
                {parts.actions}
              </div>
            </motion.div>
          </div>
        </nav>
      </header>
    </Nav01Context.Provider>
  )
}

function Nav01Brand({
  className,
  render,
  ...props
}: useRender.ComponentProps<"a"> & ComponentProps<"a">) {
  return useRender({
    defaultTagName: "a",
    render,
    props: mergeProps<"a">(
      {
        "data-slot": "nav-01-brand",
        className: cn(
          "flex items-center gap-3 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          className,
        ),
      } as ComponentProps<"a">,
      props,
    ),
  })
}

function Nav01Title({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="nav-01-title"
      className={cn(
        "text-base font-semibold leading-none tracking-tight text-foreground @sm:text-lg",
        className,
      )}
      {...props}
    />
  )
}

function Nav01Subtitle({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="nav-01-subtitle"
      className={cn(
        "hidden text-[0.7rem] font-medium leading-none tracking-[0.16em] text-primary uppercase @sm:inline",
        className,
      )}
      {...props}
    />
  )
}

function Nav01Menu({
  className,
  menuIcon,
  closeIcon,
  onClick,
  ...props
}: ComponentProps<"button"> & {
  menuIcon?: ReactNode
  closeIcon?: ReactNode
}) {
  const { menuOpen, setMenuOpen, menuId, menuButtonRef } = useNav01()

  return (
    <button
      type="button"
      data-slot="nav-01-menu"
      aria-expanded={menuOpen}
      aria-controls={menuId}
      aria-label={menuOpen ? "Close menu" : "Open menu"}
      {...props}
      ref={menuButtonRef}
      className={cn(
        "relative size-11 cursor-pointer rounded-lg text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50 @sm:hidden",
        className,
      )}
      onClick={(event) => {
        onClick?.(event)
        setMenuOpen(!menuOpen)
      }}
    >
      <span
        className={cn(
          "m-auto grid size-6 place-items-center transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.19,1,0.22,1)] motion-reduce:transition-none [&_svg]:size-6",
          menuOpen
            ? "scale-0 rotate-180 opacity-0 motion-reduce:scale-100 motion-reduce:rotate-0"
            : "scale-100 rotate-0 opacity-100",
        )}
      >
        {menuIcon ?? (
          <IconPlaceholder
            lucide="MenuIcon"
            tabler="IconMenu2"
            hugeicons="Menu01Icon"
            phosphor="ListIcon"
            remixicon="RiMenuLine"
            aria-hidden="true"
          />
        )}
      </span>
      <span
        className={cn(
          "absolute inset-0 m-auto grid size-6 place-items-center transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.19,1,0.22,1)] motion-reduce:transition-none [&_svg]:size-6",
          menuOpen
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-180 scale-0 opacity-0 motion-reduce:rotate-0 motion-reduce:scale-100",
        )}
      >
        {closeIcon ?? (
          <IconPlaceholder
            lucide="XIcon"
            tabler="IconX"
            hugeicons="Cancel01Icon"
            phosphor="XIcon"
            remixicon="RiCloseLine"
            aria-hidden="true"
          />
        )}
      </span>
    </button>
  )
}

function Nav01Links({
  placement = "desktop",
  className,
  ...props
}: ComponentProps<"ul"> & {
  placement?: Nav01LinksPlacement
}) {
  return (
    <ul
      data-slot="nav-01-links"
      data-placement={placement}
      className={cn(
        "group/links",
        placement === "desktop"
          ? "hidden items-center gap-6 @sm:flex"
          : "flex flex-col gap-4 @sm:hidden",
        className,
      )}
      {...props}
    />
  )
}

function Nav01Link({
  className,
  render,
  ...props
}: useRender.ComponentProps<"a"> & ComponentProps<"a">) {
  const { closeMenu } = useNav01()

  return (
    <li data-slot="nav-01-item">
      {useRender({
        defaultTagName: "a",
        render,
        props: mergeProps<"a">(
          {
            "data-slot": "nav-01-link",
            className: cn(
              "rounded-md text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none group-data-[placement=mobile]/links:py-1 group-data-[placement=mobile]/links:text-base",
              className,
            ),
            onClick: () => {
              closeMenu()
            },
          } as ComponentProps<"a">,
          props,
        ),
      })}
    </li>
  )
}

function Nav01Actions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="nav-01-actions"
      className={cn(
        "flex flex-col gap-3 @sm:flex-row @sm:items-center",
        className,
      )}
      {...props}
    />
  )
}

function slotChildren(children: ReactNode) {
  const parts: {
    brand?: ReactNode
    menu?: ReactNode
    links?: ReactNode
    actions?: ReactNode
  } = {}

  for (const child of toChildArray(children)) {
    if (child.type === Nav01Brand) parts.brand = child
    else if (child.type === Nav01Menu) parts.menu = child
    else if (child.type === Nav01Links) parts.links = child
    else if (child.type === Nav01Actions) parts.actions = child
  }

  return parts
}

function cloneLinks(links: ReactNode, placement: Nav01LinksPlacement) {
  if (!isElement(links) || links.type !== Nav01Links) return null
  return cloneElement(links, { placement })
}

function toChildArray(children: ReactNode) {
  return Children.toArray(children).filter(isElement)
}

function isElement(
  child: ReactNode,
): child is ReactElement<{ placement?: Nav01LinksPlacement }> {
  return isValidElement(child)
}

export {
  Nav01,
  Nav01Actions,
  Nav01Brand,
  Nav01Link,
  Nav01Links,
  Nav01Menu,
  Nav01Subtitle,
  Nav01Title,
}
