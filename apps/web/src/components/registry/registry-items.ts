import {
  indexByItemName,
  type RegistryPropRow,
} from "./registry-modules";

const metaModules = import.meta.glob("../../../registry/*/meta.ts", {
  eager: true,
});

const propsByItem = indexByItemName(metaModules, (module) => {
  const props = (module as { props?: RegistryPropRow[] }).props;
  return props ?? null;
});

export function propsFor(name: string) {
  return propsByItem[name] ?? [];
}
