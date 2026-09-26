"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUp, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
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

  el.scrollIntoView({
    behavior: prefersReducedMotion() ? "instant" : "smooth",
    block: "start",
  });
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion() ? "instant" : "smooth",
  });
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
}: {
  headings: TocHeading[];
  activeId: string | null;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-col gap-1", className)}>
      {headings.map((heading) => {
        const isActive = activeId === heading.slug;
        return (
          <li key={heading.slug}>
            <a
              href={`#${heading.slug}`}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "block rounded-md py-1 text-sm leading-snug transition-colors duration-150 motion-reduce:transition-none",
                heading.depth > 2 ? "pl-3" : "pl-0",
                isActive
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
              onClick={(event) => {
                event.preventDefault();
                scrollToId(heading.slug);
                history.replaceState(null, "", `#${heading.slug}`);
                onNavigate?.();
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
}: {
  className?: string;
  enabled: boolean;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="Scroll to top"
      disabled={!enabled}
      className={cn(
        "size-10 bg-background/90 shadow-sm backdrop-blur-sm transition-opacity duration-200 ease-out motion-reduce:transition-none",
        enabled ? "opacity-100" : "opacity-0",
        className,
      )}
      onClick={scrollToTop}
    >
      <ArrowUp />
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
  const hasToc = tocHeadings.length > 0;

  if (!hasToc) {
    if (!scrolled) return null;

    return (
      <div className="fixed right-4 bottom-4 z-40 md:right-6 md:bottom-6">
        <ScrollTopButton enabled />
      </div>
    );
  }

  return (
    // Single grid cell: desktop rail in-flow, mobile cluster fixed.
    <div className="relative min-h-0">
      <aside aria-label="Table of contents" className="hidden h-full xl:block">
        <div className="sticky top-28 flex max-h-[calc(100vh-8rem)] flex-col gap-4 overflow-y-auto">
          <div>
            <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              On this page
            </p>
            <nav>
              <TocLinkList headings={tocHeadings} activeId={activeId} />
            </nav>
          </div>
          <ScrollTopButton enabled={scrolled} className="self-start" />
        </div>
      </aside>

      <div className="fixed right-4 bottom-4 z-40 xl:hidden">
        <div className="flex items-center gap-1 rounded-xl border border-border bg-background/90 p-1 shadow-sm backdrop-blur-sm">
          <Popover open={mobileOpen} onOpenChange={setMobileOpen}>
            <PopoverTrigger
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
            </PopoverTrigger>
            <PopoverContent
              align="end"
              side="top"
              sideOffset={10}
              className="max-h-[min(60vh,24rem)] w-72 overflow-y-auto p-3"
            >
              <PopoverHeader className="mb-2">
                <PopoverTitle>On this page</PopoverTitle>
                <PopoverDescription className="sr-only">
                  Jump to a section in this article
                </PopoverDescription>
              </PopoverHeader>
              <TocLinkList
                headings={tocHeadings}
                activeId={activeId}
                onNavigate={() => setMobileOpen(false)}
              />
            </PopoverContent>
          </Popover>

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
