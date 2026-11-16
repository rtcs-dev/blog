import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
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
}

type PackageManager = "npm" | "pnpm" | "bun" | "yarn";

const packageManagers: PackageManager[] = ["npm", "pnpm", "bun", "yarn"];

export function npmInstallCommand(registryUrl: string) {
  return `npx shadcn@latest add ${registryUrl}`;
}

function isPackageManager(value: string): value is PackageManager {
  return packageManagers.some((manager) => manager === value);
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

function IconCopyButton({
  copied,
  copy,
  tooltipOpen,
  setTooltipOpen,
  idleLabel,
  copiedLabel,
}: {
  copied: boolean;
  copy: (event: MouseEvent<HTMLButtonElement>) => void;
  tooltipOpen: boolean;
  setTooltipOpen: (open: boolean) => void;
  idleLabel: string;
  copiedLabel: string;
}) {
  return (
    <div className="relative">
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

function FieldCopyButton({
  command,
  copied,
  copy,
  idleLabel,
  copiedLabel,
}: {
  command: string;
  copied: boolean;
  copy: (event: MouseEvent<HTMLButtonElement>) => void;
  idleLabel: string;
  copiedLabel: string;
}) {
  return (
    <div className="relative w-full min-w-0">
      <Button
        type="button"
        variant="outline"
        onClick={copy}
        onPointerDown={stopCardNavigation}
        aria-label={copied ? copiedLabel : idleLabel}
        data-copied={copied ? "true" : "false"}
        className="h-auto w-full min-w-0 shrink justify-start gap-3 px-3 py-2 text-left"
      >
        <span className="min-w-0 flex-1 truncate font-mono text-sm">
          {command}
        </span>
        <span className="grid shrink-0">
          <span
            className={cn(
              "col-start-1 row-start-1 inline-flex items-center gap-1",
              copied && "invisible",
            )}
            aria-hidden={copied || undefined}
          >
            <CopyIcon data-icon="inline-start" />
            Copy
          </span>
          <span
            className={cn(
              "col-start-1 row-start-1 inline-flex items-center gap-1",
              !copied && "invisible",
            )}
            aria-hidden={!copied || undefined}
          >
            <CheckMarkIcon data-icon="inline-start" />
            Copied
          </span>
        </span>
      </Button>
      <CopyStatus message={copied ? copiedLabel : ""} />
    </div>
  );
}

export function CopyCommandButton({
  command,
  variant = "icon",
}: {
  command: string;
  variant?: "icon" | "field";
}) {
  const state = useCommandCopy(command);
  const copiedLabel =
    variant === "field" ? "Copied install command" : "Command copied";
  const idleLabel =
    variant === "field" ? `Copy install command: ${command}` : "Copy command";

  if (variant === "field") {
    return (
      <FieldCopyButton
        command={command}
        copied={state.copied}
        copy={state.copy}
        idleLabel={idleLabel}
        copiedLabel={copiedLabel}
      />
    );
  }

  return (
    <IconCopyButton
      copied={state.copied}
      copy={state.copy}
      tooltipOpen={state.tooltipOpen}
      setTooltipOpen={state.setTooltipOpen}
      idleLabel={idleLabel}
      copiedLabel={copiedLabel}
    />
  );
}

export function InstallCommand({ registryUrl }: { registryUrl: string }) {
  return (
    <CopyCommandButton
      command={npmInstallCommand(registryUrl)}
      variant="field"
    />
  );
}

export function CommandTabs({ registryUrl }: CommandTabsProps) {
  const [activeTab, setActiveTab] = useState<PackageManager>("npm");

  const commands = useMemo<Record<PackageManager, string>>(
    () => ({
      npm: npmInstallCommand(registryUrl),
      pnpm: `pnpm dlx shadcn@latest add ${registryUrl}`,
      bun: `bunx shadcn@latest add ${registryUrl}`,
      yarn: `yarn dlx shadcn@latest add ${registryUrl}`,
    }),
    [registryUrl],
  );

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        if (isPackageManager(value)) setActiveTab(value);
      }}
    >
      <div className="mb-2 flex items-center justify-between">
        <TabsList variant="line">
          {packageManagers.map((pm) => (
            <TabsTrigger key={pm} value={pm}>
              {pm}
            </TabsTrigger>
          ))}
        </TabsList>
        <CopyCommandButton key={activeTab} command={commands[activeTab]} />
      </div>
      {packageManagers.map((pm) => (
        <TabsContent key={pm} value={pm} className="mt-0">
          <div className="relative">
            <input
              type="text"
              readOnly
              className="w-full rounded border border-border bg-muted px-3 py-2 font-mono text-sm text-foreground"
              value={commands[pm]}
            />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
