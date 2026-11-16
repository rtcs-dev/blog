import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
} from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CopyIcon from "@/icons/actions/copy.svg?react";
import CheckMarkIcon from "@/icons/actions/check-mark.svg?react";

interface CommandTabsProps {
  registryUrl: string;
  variant?: "tabs" | "compact";
}

type PackageManager = "npm" | "pnpm" | "bun" | "yarn";

const packageManagers: PackageManager[] = ["npm", "pnpm", "bun", "yarn"];

const installPrefix: Record<PackageManager, string> = {
  npm: "npx shadcn@latest add",
  pnpm: "pnpm dlx shadcn@latest add",
  yarn: "yarn dlx shadcn@latest add",
  bun: "bunx --bun shadcn@latest add",
};

const storageKey = "rtcs-package-manager";

let packageManager: PackageManager = "npm";
let packageManagerHydrated = false;
const packageManagerListeners = new Set<() => void>();

function isPackageManager(value: string): value is PackageManager {
  return packageManagers.some((manager) => manager === value);
}

function readStoredPackageManager() {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored && isPackageManager(stored)) packageManager = stored;
  } catch {
    return;
  }
}

function emitPackageManager() {
  for (const listener of packageManagerListeners) listener();
}

function subscribePackageManager(listener: () => void) {
  packageManagerListeners.add(listener);
  return () => {
    packageManagerListeners.delete(listener);
  };
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key !== storageKey || !event.newValue) return;
    if (!isPackageManager(event.newValue)) return;
    if (packageManager === event.newValue) return;
    packageManager = event.newValue;
    emitPackageManager();
  });
}

function getPackageManagerSnapshot() {
  if (!packageManagerHydrated) {
    packageManagerHydrated = true;
    readStoredPackageManager();
  }
  return packageManager;
}

function getServerPackageManager(): PackageManager {
  return "npm";
}

function rememberPackageManager(next: PackageManager) {
  if (packageManager === next) return;
  packageManager = next;
  packageManagerHydrated = true;
  try {
    localStorage.setItem(storageKey, next);
  } catch {
    return emitPackageManager();
  }
  emitPackageManager();
}

function usePackageManager() {
  return useSyncExternalStore(
    subscribePackageManager,
    getPackageManagerSnapshot,
    getServerPackageManager,
  );
}

function installCommands(registryUrl: string) {
  return {
    npm: `${installPrefix.npm} ${registryUrl}`,
    pnpm: `${installPrefix.pnpm} ${registryUrl}`,
    bun: `${installPrefix.bun} ${registryUrl}`,
    yarn: `${installPrefix.yarn} ${registryUrl}`,
  } satisfies Record<PackageManager, string>;
}

function useCommandCopy(command: string) {
  const [copied, setCopied] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  async function copy(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTooltipOpen(true);
      if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        setCopied(false);
        setTooltipOpen(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }

  return { copied, tooltipOpen, setTooltipOpen, copy };
}

function CopyStatus({ message }: { message: string }) {
  return (
    <span className="sr-only" role="status" aria-live="polite">
      {message}
    </span>
  );
}

function stopCardNavigation(event: { stopPropagation(): void }) {
  event.stopPropagation();
}

function CopyCommandButton({ command }: { command: string }) {
  const { copied, tooltipOpen, setTooltipOpen, copy } = useCommandCopy(command);
  const copiedLabel = "Copied install command";
  const idleLabel = `Copy install command: ${command}`;

  return (
    <div className="relative shrink-0">
      <TooltipProvider>
        <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
          <TooltipTrigger
            render={
              <Button
                type="button"
                onClick={copy}
                onPointerDown={stopCardNavigation}
                variant="ghost"
                size="icon-sm"
                aria-label={copied ? copiedLabel : idleLabel}
                data-copied={copied ? "true" : "false"}
              />
            }
          >
            <span className="grid" aria-hidden="true">
              <CopyIcon
                className={cn(
                  "col-start-1 row-start-1 text-muted-foreground",
                  copied && "invisible",
                )}
              />
              <CheckMarkIcon
                className={cn(
                  "col-start-1 row-start-1 text-muted-foreground",
                  !copied && "invisible",
                )}
              />
            </span>
          </TooltipTrigger>
          <TooltipContent>{copied ? "Copied!" : "Copy command"}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <CopyStatus message={copied ? copiedLabel : ""} />
    </div>
  );
}

function PackageManagerTabs({
  manager,
  onChange,
  compact = false,
}: {
  manager: PackageManager;
  onChange: (manager: PackageManager) => void;
  compact?: boolean;
}) {
  return (
    <Tabs
      value={manager}
      onValueChange={(value) => {
        if (isPackageManager(value)) onChange(value);
      }}
      className={compact ? "min-w-0 gap-2" : undefined}
    >
      <div className="flex min-w-0 items-center justify-between gap-2">
        <TabsList variant="line" className="min-w-0">
          {packageManagers.map((item) => (
            <TabsTrigger
              key={item}
              value={item}
              className={compact ? "px-1.5 text-xs" : undefined}
            >
              {item}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
}

export function CommandTabs({
  registryUrl,
  variant = "tabs",
}: CommandTabsProps) {
  const manager = usePackageManager();
  const commands = useMemo(() => installCommands(registryUrl), [registryUrl]);
  const command = commands[manager];

  const selectManager = (next: PackageManager) => {
    rememberPackageManager(next);
  };

  if (variant === "compact") {
    return (
      <div
        className="flex min-w-0 flex-col gap-2"
        data-package-manager={manager}
        onClick={stopCardNavigation}
        onPointerDown={stopCardNavigation}
      >
        <div className="flex min-w-0 items-center justify-between gap-2">
          <PackageManagerTabs
            manager={manager}
            onChange={selectManager}
            compact
          />
          <CopyCommandButton key={manager} command={command} />
        </div>
        <p className="truncate font-mono text-xs text-foreground">{command}</p>
      </div>
    );
  }

  return (
    <div data-package-manager={manager} onClick={stopCardNavigation}>
      <Tabs
        value={manager}
        onValueChange={(value) => {
          if (isPackageManager(value)) selectManager(value);
        }}
      >
        <div className="mb-2 flex items-center justify-between">
          <TabsList variant="line">
            {packageManagers.map((item) => (
              <TabsTrigger key={item} value={item}>
                {item}
              </TabsTrigger>
            ))}
          </TabsList>
          <CopyCommandButton key={manager} command={command} />
        </div>
        {packageManagers.map((item) => (
          <TabsContent key={item} value={item} className="mt-0">
            <div className="relative">
              <input
                type="text"
                readOnly
                className="w-full rounded border border-border bg-muted px-3 py-2 font-mono text-sm text-foreground"
                value={commands[item]}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
