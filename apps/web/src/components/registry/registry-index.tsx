import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CommandTabs } from "./command-tabs";
import { registryTypeLabel } from "./registry-modules";
import { hasRegistryDemo, RegistryPreview } from "./registry-preview";

export type RegistryIndexItem = {
  name: string;
  title: string;
  description: string;
  type: string;
  dependencies?: string[];
};

type RegistryFilter = "all" | "blocks" | "utilities";

const filters: { id: RegistryFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "blocks", label: "Blocks" },
  { id: "utilities", label: "Utilities" },
];

function matches(type: string, filter: RegistryFilter) {
  if (filter === "all") return true;
  if (filter === "blocks") return type === "registry:ui";
  return type === "registry:lib";
}

export function RegistryIndex({
  items,
  origin,
}: {
  items: RegistryIndexItem[];
  origin: string;
}) {
  const [filter, setFilter] = useState<RegistryFilter>("all");
  const visible = items.filter((item) => matches(item.type, filter));

  return (
    <div className="flex flex-col gap-6">
      <div role="radiogroup" aria-label="Filter registry" className="flex flex-wrap gap-2">
        {filters.map((item) => {
          const selected = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              data-filter={item.id}
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => setFilter(item.id)}
              onKeyDown={(event) => {
                const group = event.currentTarget.parentElement;
                if (!group) return;
                const buttons = [
                  ...group.querySelectorAll<HTMLButtonElement>("[data-filter]"),
                ];
                const index = buttons.indexOf(event.currentTarget);
                let next = index;
                if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                  next = (index + 1) % buttons.length;
                } else if (
                  event.key === "ArrowLeft" ||
                  event.key === "ArrowUp"
                ) {
                  next = (index - 1 + buttons.length) % buttons.length;
                } else {
                  return;
                }
                event.preventDefault();
                const button = buttons[next];
                const value = button?.dataset.filter;
                if (value !== "all" && value !== "blocks" && value !== "utilities") {
                  return;
                }
                setFilter(value);
                button.focus();
              }}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors duration-150 ease-out outline-none focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none",
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">No items in this group.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {visible.map((item) => {
            const preview = hasRegistryDemo(item.name);
            return (
              <article
                key={item.name}
                className={cn(
                  "flex flex-col overflow-hidden rounded-xl border border-border bg-background",
                  preview && "lg:col-span-2",
                )}
              >
                {preview ? (
                  <RegistryPreview name={item.name} variant="card" />
                ) : null}
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold">{item.title}</h2>
                      <span className="rounded bg-muted px-2 py-1 text-xs">
                        {registryTypeLabel(item.type)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  {preview ? null : (
                    <CommandTabs registryUrl={`${origin}/r/${item.name}.json`} />
                  )}
                  <a
                    className={buttonVariants({
                      variant: "link",
                      className: "self-start px-0",
                    })}
                    href={`/registry/${item.name}`}
                  >
                    View source
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
