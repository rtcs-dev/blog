import type { ReactNode } from "react";

export type RegistryPropRow = {
  component: string;
  name: string;
  type: string;
  defaultValue: string;
  description: string;
};

export type RegistryDemoProps = {
  variant?: "card" | "page";
};

export type RegistryDemoComponent = (
  props: RegistryDemoProps,
) => ReactNode;

export function registryItemName(modulePath: string) {
  return modulePath.match(/\/registry\/([^/]+)\//)?.[1] ?? null;
}

export function indexByItemName<TModule, TValue>(
  modules: Record<string, TModule>,
  pick: (module: TModule) => TValue | null,
) {
  const indexed: Record<string, TValue> = {};

  for (const [modulePath, module] of Object.entries(modules)) {
    const name = registryItemName(modulePath);
    const value = name ? pick(module) : null;
    if (name && value) indexed[name] = value;
  }

  return indexed;
}

export function registryTypeLabel(type: string) {
  if (type === "registry:ui") return "Blocks";
  if (type === "registry:lib") return "Utilities";
  return type.replace("registry:", "");
}
