import {
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
import CopyIcon from "@/icons/actions/copy.svg?react";
import CheckMarkIcon from "@/icons/actions/check-mark.svg?react";

interface CommandTabsProps {
  registryUrl: string;
}

type PackageManager = "npm" | "pnpm" | "bun" | "yarn";

const packageManagers: PackageManager[] = ["npm", "pnpm", "bun", "yarn"];

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

export function CommandTabs({ registryUrl }: CommandTabsProps) {
  const activeTab = usePackageManager();
  const [copied, setCopied] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo<Record<string, string>>(
    () => ({
      npm: `npx shadcn@latest add ${registryUrl}`,
      pnpm: `pnpm dlx shadcn@latest add ${registryUrl}`,
      bun: `bunx shadcn@latest add ${registryUrl}`,
      yarn: `yarn dlx shadcn@latest add ${registryUrl}`,
    }),
    [registryUrl],
  );

  const handleCopy = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!inputRef.current) return;

    try {
      await navigator.clipboard.writeText(inputRef.current.value);
      setCopied(true);
      setTooltipOpen(true);
      setTimeout(() => {
        setCopied(false);
        setTooltipOpen(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        if (isPackageManager(value)) rememberPackageManager(value);
      }}
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-2">
        <TabsList variant="line">
          {Object.keys(commands).map((pm) => (
            <TabsTrigger key={pm} value={pm}>
              {pm}
            </TabsTrigger>
          ))}
        </TabsList>
        <TooltipProvider>
          <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  onClick={handleCopy}
                  onPointerDown={(event) => event.stopPropagation()}
                  variant="ghost"
                  size="icon-sm"
                  aria-label={copied ? "Command copied" : "Copy command"}
                />
              }
            >
              {copied ? (
                <CheckMarkIcon className="text-muted-foreground" />
              ) : (
                <CopyIcon className="text-muted-foreground" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              {copied ? "Copied!" : "Copy command"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {Object.keys(commands).map((pm) => (
        <TabsContent key={pm} value={pm} className="mt-0">
          <div className="relative">
            <input
              ref={pm === activeTab ? inputRef : undefined}
              type="text"
              readOnly
              className="w-full bg-muted border border-border rounded px-3 py-2 text-sm font-mono text-foreground"
              value={commands[pm]}
            />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
