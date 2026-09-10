import { useMemo, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import CopyIcon from "@/icons/actions/copy.svg?react";
import CheckMarkIcon from "@/icons/actions/check-mark.svg?react";

interface CommandTabsProps {
  registryUrl: string;
}

export function CommandTabs({ registryUrl }: CommandTabsProps) {
  const [activeTab, setActiveTab] = useState("npm");
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

  const handleCopy = async () => {
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
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex items-center justify-between mb-2">
        <TabsList variant="line">
          {Object.keys(commands).map((pm) => (
            <TabsTrigger key={pm} value={pm}>
              {pm}
            </TabsTrigger>
          ))}
        </TabsList>
        <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
          <TooltipTrigger asChild>
            <Button
              type="button"
              onClick={handleCopy}
              variant="ghost"
              size="icon-sm"
              className="cursor-pointer"
              aria-label={copied ? "Command copied" : "Copy command"}
            >
              {copied ? (
                <CheckMarkIcon className="text-muted-foreground" />
              ) : (
                <CopyIcon className="text-muted-foreground" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{copied ? "Copied!" : "Copy command"}</TooltipContent>
        </Tooltip>
      </div>
      {Object.keys(commands).map((pm) => (
        <TabsContent key={pm} value={pm} className="mt-0">
          <div className="relative">
            <input
              ref={inputRef}
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
