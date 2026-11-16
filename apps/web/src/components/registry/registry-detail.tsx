import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hasRegistryDemo, RegistryPreview } from "./registry-preview";

export function RegistryDetail({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) {
  if (!hasRegistryDemo(name)) {
    return <div className="flex flex-col gap-6">{children}</div>;
  }

  return (
    <Tabs defaultValue="preview" className="gap-4">
      <TabsList variant="line">
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview" keepMounted>
        <RegistryPreview name={name} variant="page" />
      </TabsContent>
      <TabsContent value="code" keepMounted className="min-w-0">
        {children}
      </TabsContent>
    </Tabs>
  );
}
