import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { RegistryDemoProps } from "@/components/registry/registry-modules";
import {
  Nav01,
  Nav01Actions,
  Nav01Brand,
  Nav01Link,
  Nav01Links,
  Nav01Title,
} from "./nav-01";

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
        "overflow-y-auto overscroll-contain bg-muted/40",
        page ? "h-[32rem] rounded-xl border border-border" : "h-72",
      )}
    >
      <Nav01 position="contained">
        <Nav01Brand href="#overview">
          <img
            src="/assets/logo/orange-1200x1200.svg"
            alt=""
            className="h-8 w-auto @sm:h-10"
          />
          <span className="flex flex-col items-start gap-1">
            <Nav01Title>ACME</Nav01Title>
          </span>
        </Nav01Brand>
        <Nav01Links>
          {links.map((link) => (
            <Nav01Link key={link.href} href={link.href}>
              {link.label}
            </Nav01Link>
          ))}
        </Nav01Links>
        <Nav01Actions>
          <Button variant="outline" size="sm" type="button">
            Sign in
          </Button>
        </Nav01Actions>
      </Nav01>
      <div className="mx-auto flex max-w-3xl flex-col gap-16 px-6 pt-12 pb-24">
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
  );
}
