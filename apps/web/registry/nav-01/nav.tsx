"use client"

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { motion } from "motion/react"
import { IconPlaceholder } from "@/components/icon-placeholder"
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
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
import { useScrollShrink } from "@/hooks/use-scroll-shrink"

type NavLinksPlacement = "desktop" | "mobile"

type NavContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  menuId: string
  menuButtonRef: RefObject<HTMLButtonElement | null>
}

const NavContext = createContext<NavContextValue | null>(null)
const NavLinksPlacementContext = createContext<NavLinksPlacement>("desktop")

function useNav() {
  const context = useContext(NavContext)
  if (!context) {
    throw new Error("useNav must be used within Nav.")
  }
  return context
}

function Nav({
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  className,
  style,
  children,
  ...props
}: ComponentProps<"header"> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const open = openProp ?? uncontrolledOpen
  const rootRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()
  const scrolled = useScrollShrink(rootRef)

  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [openProp, onOpenChange],
  )

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setOpen(false)
      menuButtonRef.current?.focus()
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, setOpen])

  const parts = slotChildren(children)

  return (
    <NavContext.Provider value={{ open, setOpen, menuId, menuButtonRef }}>
      <header
        {...props}
        ref={rootRef}
        data-slot="nav"
        data-state={open ? "open" : "closed"}
        data-scrolled={scrolled ? "true" : "false"}
        style={
          {
            ...style,
            "--nav-pad": scrolled ? "0.75rem" : "1.5rem",
          } as CSSProperties
        }
        className={cn("fixed inset-x-0 top-0 z-30 w-full", className)}
      >
        <nav
          data-slot="nav-bar"
          aria-label="Primary"
          className="@container px-3 pt-2"
        >
          <div
            data-slot="nav-surface"
            className={cn(
              "mx-auto max-w-7xl rounded-3xl bg-background/80 px-4 backdrop-blur-2xl transition-shadow duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] motion-reduce:transition-none @sm:px-8",
              scrolled && "shadow-lg shadow-foreground/5",
            )}
          >
            <motion.div className="relative flex flex-wrap items-center justify-between gap-4 py-3 transition-[padding] duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] motion-reduce:transition-none @sm:py-(--nav-pad)">
              <div className="flex w-full items-center justify-between gap-8 @sm:w-auto">
                {parts.brand}
                {parts.menu ?? <NavMenu />}
                {renderLinks(parts.links, "desktop")}
              </div>
              <div
                id={menuId}
                data-slot="nav-panel"
                className={cn(
                  "w-full flex-col gap-6 rounded-2xl border border-border bg-background p-4 shadow-lg @sm:w-auto @sm:flex-row @sm:items-center @sm:rounded-none @sm:border-transparent @sm:bg-transparent @sm:p-0 @sm:shadow-none",
                  open ? "flex" : "hidden @sm:flex",
                )}
              >
                {renderLinks(parts.links, "mobile")}
                {parts.actions}
              </div>
            </motion.div>
          </div>
        </nav>
      </header>
    </NavContext.Provider>
  )
}

function NavBrand({
  className,
  render,
  ...props
}: useRender.ComponentProps<"a"> & ComponentProps<"a">) {
  return useRender({
    defaultTagName: "a",
    render,
    props: mergeProps<"a">(
      {
        "data-slot": "nav-brand",
        className: cn(
          "flex items-center gap-3 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          className,
        ),
      } as ComponentProps<"a">,
      props,
    ),
  })
}

function NavTitle({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="nav-title"
      className={cn(
        "text-base font-semibold leading-none tracking-tight text-foreground @sm:text-lg",
        className,
      )}
      {...props}
    />
  )
}

function NavSubtitle({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="nav-subtitle"
      className={cn(
        "hidden text-[0.7rem] font-medium leading-none tracking-[0.16em] text-primary uppercase @sm:inline",
        className,
      )}
      {...props}
    />
  )
}

function NavMenu({ className, onClick, ...props }: ComponentProps<"button">) {
  const { open, setOpen, menuId, menuButtonRef } = useNav()

  return (
    <button
      type="button"
      data-slot="nav-menu"
      aria-expanded={open}
      aria-controls={menuId}
      aria-label={open ? "Close menu" : "Open menu"}
      {...props}
      ref={menuButtonRef}
      className={cn(
        "relative size-11 cursor-pointer rounded-lg text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50 @sm:hidden",
        className,
      )}
      onClick={(event) => {
        onClick?.(event)
        setOpen(!open)
      }}
    >
      <span
        className={cn(
          "m-auto grid size-6 place-items-center transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.19,1,0.22,1)] motion-reduce:transition-none [&_svg]:size-6",
          open
            ? "scale-0 rotate-180 opacity-0 motion-reduce:scale-100 motion-reduce:rotate-0"
            : "scale-100 rotate-0 opacity-100",
        )}
      >
        <IconPlaceholder
          lucide="MenuIcon"
          tabler="IconMenu2"
          hugeicons="Menu01Icon"
          phosphor="ListIcon"
          remixicon="RiMenuLine"
          aria-hidden="true"
        />
      </span>
      <span
        className={cn(
          "absolute inset-0 m-auto grid size-6 place-items-center transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.19,1,0.22,1)] motion-reduce:transition-none [&_svg]:size-6",
          open
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-180 scale-0 opacity-0 motion-reduce:rotate-0 motion-reduce:scale-100",
        )}
      >
        <IconPlaceholder
          lucide="XIcon"
          tabler="IconX"
          hugeicons="Cancel01Icon"
          phosphor="XIcon"
          remixicon="RiCloseLine"
          aria-hidden="true"
        />
      </span>
    </button>
  )
}

function NavLinks({ className, ...props }: ComponentProps<"ul">) {
  const placement = useContext(NavLinksPlacementContext)

  return (
    <ul
      data-slot="nav-links"
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

function NavLink({
  className,
  render,
  ...props
}: useRender.ComponentProps<"a"> & ComponentProps<"a">) {
  const { setOpen } = useNav()

  return (
    <li data-slot="nav-item">
      {useRender({
        defaultTagName: "a",
        render,
        props: mergeProps<"a">(
          {
            "data-slot": "nav-link",
            className: cn(
              "rounded-md text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none group-data-[placement=mobile]/links:py-1 group-data-[placement=mobile]/links:text-base",
              className,
            ),
            onClick: () => {
              setOpen(false)
            },
          } as ComponentProps<"a">,
          props,
        ),
      })}
    </li>
  )
}

function NavActions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="nav-actions"
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

  for (const child of Children.toArray(children)) {
    if (!isValidElement(child)) continue
    if (child.type === NavBrand) parts.brand = child
    else if (child.type === NavMenu) parts.menu = child
    else if (child.type === NavLinks) parts.links = child
    else if (child.type === NavActions) parts.actions = child
  }

  return parts
}

function renderLinks(links: ReactNode, placement: NavLinksPlacement) {
  if (!isValidElement(links) || links.type !== NavLinks) return null
  return (
    <NavLinksPlacementContext.Provider value={placement}>
      {cloneElement(links as ReactElement)}
    </NavLinksPlacementContext.Provider>
  )
}

export {
  Nav,
  NavActions,
  NavBrand,
  NavLink,
  NavLinks,
  NavMenu,
  NavSubtitle,
  NavTitle,
  useNav,
}
