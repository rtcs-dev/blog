"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

export type TocHeading = {
  depth: number;
  slug: string;
  text: string;
};

type PostTocProps = {
  headings: TocHeading[];
};

const TOC_DEPTHS = new Set([2, 3]);

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const header = document.querySelector("header");
  const headerBottom = header?.getBoundingClientRect().bottom ?? 0;
  const top = el.getBoundingClientRect().top + window.scrollY - headerBottom - 16;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: prefersReducedMotion() ? "instant" : "smooth",
  });
}

function scrollToTop() {
  const root = document.documentElement;
  const previous = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo({ top: 0, behavior: "instant" });
  root.style.scrollBehavior = previous;
}

function stripMarkup(text: string) {
  return text.replace(/<[^>]+>/g, "").trim();
}

function useActiveHeading(ids: string[]) {
  const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null);

  useEffect(() => {
    if (ids.length === 0) return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const visible = new Map<string, IntersectionObserverEntry>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry);
          } else {
            visible.delete(entry.target.id);
          }
        }

        if (visible.size > 0) {
          const topMost = [...visible.values()].sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
          setActiveId(topMost.target.id);
          return;
        }

        const above = elements.filter(
          (el) => el.getBoundingClientRect().top < 120,
        );
        if (above.length > 0) {
          setActiveId(above[above.length - 1].id);
        }
      },
      {
        rootMargin: "-80px 0px -55% 0px",
        threshold: [0, 1],
      },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}

function useScrolledPast(threshold = 320) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}

function TocLinkList({
  headings,
  activeId,
  onNavigate,
  className,
  variant = "rail",
}: {
  headings: TocHeading[];
  activeId: string | null;
  onNavigate?: (id: string) => void;
  className?: string;
  variant?: "rail" | "sheet";
}) {
  const sheet = variant === "sheet";

  return (
    <ul className={cn("flex flex-col", sheet ? "gap-1" : "gap-1", className)}>
      {headings.map((heading) => {
        const isActive = activeId === heading.slug;
        const nested = heading.depth > 2;
        return (
          <li key={heading.slug}>
            <a
              href={`#${heading.slug}`}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "block rounded-md text-sm transition-colors duration-150 motion-reduce:transition-none",
                sheet ? "px-2.5 py-2 leading-5" : "py-1 leading-snug",
                nested ? (sheet ? "pl-6" : "pl-3") : sheet ? "pl-2.5" : "pl-0",
                isActive
                  ? sheet
                    ? "bg-muted text-foreground"
                    : "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
              onClick={(event) => {
                event.preventDefault();
                history.replaceState(null, "", `#${heading.slug}`);
                if (onNavigate) onNavigate(heading.slug);
                else scrollToId(heading.slug);
              }}
            >
              {stripMarkup(heading.text)}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function ScrollTopButton({
  className,
  enabled,
  labeled = false,
}: {
  className?: string;
  enabled: boolean;
  labeled?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size={labeled ? "default" : "icon"}
      aria-label={labeled ? undefined : "Scroll to top"}
      disabled={!enabled}
      className={cn(
        "bg-background/90 shadow-sm backdrop-blur-sm transition-opacity duration-200 ease-out motion-reduce:transition-none",
        !labeled && "size-10",
        enabled ? "opacity-100" : "opacity-0",
        className,
      )}
      onClick={scrollToTop}
    >
      <ArrowUp data-icon={labeled ? "inline-start" : undefined} />
      {labeled ? "Scroll to top" : null}
    </Button>
  );
}

export function PostToc({ headings }: PostTocProps) {
  const tocHeadings = useMemo(
    () => headings.filter((heading) => TOC_DEPTHS.has(heading.depth)),
    [headings],
  );
  const ids = useMemo(() => tocHeadings.map((h) => h.slug), [tocHeadings]);
  const activeId = useActiveHeading(ids);
  const scrolled = useScrolledPast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pendingScrollId = useRef<string | null>(null);
  const hasToc = tocHeadings.length > 0;

  if (!hasToc) {
    if (!scrolled) return null;

    return (
      <div className="fixed right-4 bottom-4 z-40 md:right-6 md:bottom-6">
        <ScrollTopButton enabled className="xl:hidden" />
        <ScrollTopButton enabled labeled className="hidden xl:inline-flex" />
      </div>
    );
  }

  return (
    // Single grid cell: desktop rail in-flow, mobile cluster fixed.
    <div className="relative min-h-0">
      <aside aria-label="Table of contents" className="hidden h-full xl:block">
        <div className="sticky top-28 flex max-h-[calc(100vh-8rem)] flex-col gap-4 overflow-y-auto">
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">
              Table of contents
            </p>
            <nav>
              <TocLinkList headings={tocHeadings} activeId={activeId} />
            </nav>
          </div>
          <ScrollTopButton
            enabled={scrolled}
            labeled
            className="self-start"
          />
        </div>
      </aside>

      <div className="fixed right-4 bottom-4 z-40 xl:hidden">
        <div className="flex items-center gap-1 rounded-xl border border-border bg-background/90 p-1 shadow-sm backdrop-blur-sm">
          <Drawer
            open={mobileOpen}
            onOpenChange={setMobileOpen}
            onOpenChangeComplete={(open) => {
              if (open) return;
              const id = pendingScrollId.current;
              if (!id) return;
              pendingScrollId.current = null;
              scrollToId(id);
            }}
            showSwipeHandle
            snapPoints={[0.72]}
          >
            <DrawerTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Table of contents"
                  className="size-10"
                />
              }
            >
              <List />
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Table of contents</DrawerTitle>
                <DrawerDescription className="sr-only">
                  Jump to a section in this article
                </DrawerDescription>
              </DrawerHeader>
              <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <TocLinkList
                  variant="sheet"
                  headings={tocHeadings}
                  activeId={activeId}
                  onNavigate={(id) => {
                    pendingScrollId.current = id;
                    setMobileOpen(false);
                  }}
                />
              </div>
            </DrawerContent>
          </Drawer>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Scroll to top"
            className={cn(
              "size-10 transition-opacity duration-200 ease-out motion-reduce:transition-none",
              scrolled ? "opacity-100" : "opacity-40",
            )}
            disabled={!scrolled}
            onClick={scrollToTop}
          >
            <ArrowUp />
          </Button>
        </div>
      </div>
    </div>
  );
}
