import {
  indexByItemName,
  type RegistryDemoComponent,
} from "./registry-modules";

const demoModules = import.meta.glob("../../../registry/*/demo.tsx", {
  eager: true,
});

const demos = indexByItemName(demoModules, (module) => {
  const demo = (module as { RegistryDemo?: RegistryDemoComponent })
    .RegistryDemo;
  return demo ?? null;
});

export function hasRegistryDemo(name: string) {
  return demos[name] != null;
}

export function RegistryPreview({
  name,
  variant = "page",
}: {
  name: string;
  variant?: "card" | "page";
}) {
  const Demo = demos[name];
  if (!Demo) return null;
  return (
    <div className="relative isolate overflow-hidden [transform:translateZ(0)]">
      <Demo variant={variant} />
    </div>
  );
}
