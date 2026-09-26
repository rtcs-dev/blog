import { type ComponentProps, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { ThemeSwitcher } from "./theme-switcher";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/resume", label: "Resume" },
  { href: "/blog", label: "Blog" },
  { href: "/registry", label: "Registry" },
];

const navLinkClass =
  "text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:outline-none motion-reduce:transition-none";

function NavLink({
  className,
  ...props
}: ComponentProps<"a">) {
  return (
    <a className={cn(navLinkClass, className)} {...props} />
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const close = () => setMenuOpen(false);

    document.addEventListener("astro:after-swap", close);
    document.addEventListener("astro:page-load", close);

    return () => {
      document.removeEventListener("astro:after-swap", close);
      document.removeEventListener("astro:page-load", close);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <nav data-state={menuOpen ? "active" : undefined} className="group">
      <div className="site-header-blur">
        <div className="mx-auto grid h-[80px] max-w-[1112px] grid-cols-2 items-center px-6 md:grid-cols-3">
          <a
            className="justify-self-start text-2xl font-semibold text-foreground"
            href="/"
          >
            <img
              src="/assets/logo/orange-256x256.png"
              alt="rtcs logo"
              width={50}
              height={50}
              loading="eager"
            />
          </a>

          <ul className="hidden items-center justify-self-center gap-4 md:flex">
            {navItems.map(({ href, label }) => (
              <li key={href}>
                <NavLink href={href}>{label}</NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-self-end">
            <ThemeSwitcher />
            <button
              type="button"
              aria-label={menuOpen ? "Close Menu" : "Open Menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
              className="relative size-12 cursor-pointer rounded-lg outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:hidden"
            >
              <Menu
                className={cn(
                  "pointer-events-none m-auto size-6 duration-200 ease-in-out",
                  "group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0",
                  "motion-reduce:transition-none",
                )}
              />
              <X
                className={cn(
                  "pointer-events-none absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200 ease-in-out",
                  "group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100",
                  "motion-reduce:transition-none",
                )}
              />
            </button>
          </div>
        </div>
      </div>

      <div
        id="mobile-navigation"
        className={cn(
          "site-header-blur site-header-surface site-header-menu fixed inset-x-0 top-[80px] z-10 origin-top transition-[opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none md:hidden",
          menuOpen
            ? "visible translate-y-0 scale-y-100 opacity-100"
            : "invisible pointer-events-none -translate-y-2 scale-y-95 opacity-0",
        )}
      >
        <ul className="mx-auto flex max-w-[1112px] flex-col gap-6 p-6">
          {navItems.map(({ href, label }) => (
            <li key={href}>
              <NavLink
                href={href}
                className="block"
                onClick={() => {
                  if (window.location.pathname === href) {
                    setMenuOpen(false);
                  }
                }}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
