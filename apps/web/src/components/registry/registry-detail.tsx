import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Nav01Demo } from "./nav-01-demo";

const previews: Partial<Record<string, typeof Nav01Demo>> = {
  "nav-01": Nav01Demo,
};

export function RegistryDetail({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  const Preview = previews[name];

  return (
    <Tabs defaultValue={Preview ? "preview" : "code"} className="gap-4">
      <TabsList variant="line">
        {Preview ? <TabsTrigger value="preview">Preview</TabsTrigger> : null}
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      {Preview ? (
        <TabsContent value="preview" keepMounted>
          <Preview variant="page" />
        </TabsContent>
      ) : null}
      <TabsContent value="code" keepMounted className="min-w-0">
        {children}
      </TabsContent>
    </Tabs>
  );
}
