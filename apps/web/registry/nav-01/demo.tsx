import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { RegistryDemoProps } from "@/components/registry/registry-modules";
import {
  Nav,
  NavActions,
  NavBrand,
  NavLink,
  NavLinks,
  NavTitle,
} from "./nav";

const links = [
  { href: "#overview", label: "Overview" },
  { href: "#work", label: "Work" },
  { href: "#notes", label: "Notes" },
];

const sections = [
  {
    id: "overview",
    title: "Overview",
    body: "Scroll down. The bar stays put and tightens as the page moves under it.",
  },
  {
    id: "work",
    title: "Work",
    body: "The name and the links share one row when there's room. Sign in is just whatever you put on the right.",
  },
  {
    id: "notes",
    title: "Notes",
    body: "Shrink the window and the links drop into the menu. Escape closes it.",
  },
];

export function RegistryDemo({ variant = "page" }: RegistryDemoProps) {
  const page = variant === "page";

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden bg-muted/40 [transform:translateZ(0)]",
        page ? "h-[32rem] rounded-xl border border-border" : "h-72",
      )}
    >
      <div className="h-full overflow-y-auto overscroll-contain [overflow-anchor:none]">
        <div className="h-28 shrink-0" aria-hidden="true" />
        <div className="mx-auto flex max-w-3xl flex-col gap-16 px-6 pb-24">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-28">
              <h3 className="mb-3 text-lg font-semibold text-foreground">
                {section.title}
              </h3>
              <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                {section.body}
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <div className="h-3 w-2/3 rounded-full bg-foreground/10" />
                <div className="h-3 w-1/2 rounded-full bg-foreground/10" />
                <div className="mt-2 h-24 rounded-xl bg-background/80" />
              </div>
            </section>
          ))}
        </div>
      </div>
      <Nav>
        <NavBrand
          href="#overview"
          onClick={(event) => event.preventDefault()}
        >
          <img
            src="/assets/logo/orange-1200x1200.svg"
            alt=""
            className="h-8 w-auto @sm:h-10"
          />
          <span className="flex flex-col items-start gap-1">
            <NavTitle>ACME</NavTitle>
          </span>
        </NavBrand>
        <NavLinks>
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              onClick={(event) => event.preventDefault()}
            >
              {link.label}
            </NavLink>
          ))}
        </NavLinks>
        <NavActions>
          <Button
            variant="outline"
            size="sm"
            type="button"
            className="active:!translate-y-0"
          >
            Sign in
          </Button>
        </NavActions>
      </Nav>
    </div>
  );
}
