import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import CopyIcon from "@/icons/actions/copy.svg?react";
import CheckMarkIcon from "@/icons/actions/check-mark.svg?react";

interface CommandTabsProps {
  registryUrl: string;
}

export function CommandTabs({ registryUrl }: CommandTabsProps) {
  const [activeTab, setActiveTab] = React.useState("npm");
  const [copied, setCopied] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const commands = React.useMemo<Record<string, string>>(
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
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex items-center justify-between mb-2">
        <TabsList className="bg-transparent p-0 h-auto gap-0">
          {Object.keys(commands).map((pm) => (
            <TabsTrigger key={pm} value={pm}>
              {pm}
            </TabsTrigger>
          ))}
        </TabsList>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 hover:bg-muted/50 rounded transition-colors"
              aria-label="Copy command"
            >
              {copied ? (
                <CheckMarkIcon className="w-4 h-4 text-muted-foreground" />
              ) : (
                <CopyIcon className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
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
