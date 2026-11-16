import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Nav01 } from "../../../registry/default/ui/nav-01";

const links = [
  { href: "#overview", label: "Overview" },
  { href: "#work", label: "Work" },
  { href: "#notes", label: "Notes" },
];

const sections = [
  {
    id: "overview",
    title: "Overview",
    body: "The bar stays pinned to this frame. Scroll the preview and it tightens, picking up a shadow as the page moves underneath.",
  },
  {
    id: "work",
    title: "Work",
    body: "Logo, wordmark, and links stay in one row once the bar is wide enough. The slot on the right is whatever you pass in.",
  },
  {
    id: "notes",
    title: "Notes",
    body: "Narrow the window and the links move into the menu. Escape closes it and returns focus to the button.",
  },
];

export function Nav01Demo({ variant = "page" }: { variant?: "card" | "page" }) {
  const page = variant === "page";

  return (
    <div
      className={cn(
        "overflow-y-auto overscroll-contain bg-muted/40",
        page ? "h-[32rem] rounded-xl border border-border" : "h-72",
      )}
    >
      <Nav01
        position="contained"
        logo={{
          src: "/assets/logo/orange-1200x1200.svg",
          alt: "",
        }}
        title="rtcs"
        subtitle="dev"
        homeHref="#overview"
        links={links}
        trailing={
          <Button variant="outline" size="sm" type="button">
            Sign in
          </Button>
        }
      />
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
