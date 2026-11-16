"use client"

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { motion } from "motion/react"
import { IconPlaceholder } from "@/components/icon-placeholder"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react"
import { cn } from "@/lib/utils"
import { useScrollShrink } from "@/hooks/use-scroll-shrink"

type NavContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  menuId: string
  menuButtonRef: RefObject<HTMLButtonElement | null>
  scrolled: boolean
}

const NavContext = createContext<NavContextValue | null>(null)

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
  children?: ReactNode
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

  return (
    <NavContext.Provider
      value={{ open, setOpen, menuId, menuButtonRef, scrolled }}
    >
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
            <motion.div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 py-3 transition-[padding] duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] motion-reduce:transition-none @sm:grid-cols-[auto_minmax(0,1fr)_auto] @sm:gap-x-8 @sm:py-(--nav-pad)">
              {children}
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
          "col-start-1 row-start-1 flex min-w-0 items-center gap-3 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
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
        "relative col-start-2 row-start-1 size-11 cursor-pointer justify-self-end rounded-lg text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50 @sm:hidden",
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

function NavLinks({ className, children, ...props }: ComponentProps<"ul">) {
  const { open, menuId } = useNav()

  return (
    <>
      <ul
        data-slot="nav-links"
        data-placement="desktop"
        className={cn(
          "group/links col-span-full row-start-2 hidden min-w-0 items-center gap-6 @sm:col-span-1 @sm:col-start-2 @sm:row-start-1 @sm:flex",
          className,
        )}
        {...props}
      >
        {children}
      </ul>
      <div
        id={menuId}
        data-slot="nav-panel"
        className={cn(
          "col-span-full row-start-2 mt-4 flex-col gap-4 rounded-t-2xl border border-b-0 bg-background px-4 pt-4 shadow-lg @sm:hidden",
          open ? "flex" : "hidden",
        )}
      >
        <ul
          data-slot="nav-links"
          data-placement="mobile"
          className={cn("group/links flex flex-col gap-4", className)}
        >
          {children}
        </ul>
      </div>
    </>
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
  const { open } = useNav()

  return (
    <div
      data-slot="nav-actions"
      className={cn(
        "col-span-full row-start-3 flex-col gap-3 rounded-b-2xl border border-t-0 bg-background px-4 pt-6 pb-4 @sm:col-span-1 @sm:col-start-3 @sm:row-start-1 @sm:flex @sm:flex-row @sm:items-center @sm:justify-self-end @sm:rounded-none @sm:border-0 @sm:bg-transparent @sm:p-0 @sm:shadow-none",
        open ? "flex" : "hidden",
        className,
      )}
      {...props}
    />
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
