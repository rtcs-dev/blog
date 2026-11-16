import type { RegistryPropRow } from "@/components/registry/registry-modules";

export const props: RegistryPropRow[] = [
  {
    component: "Nav",
    name: "defaultOpen",
    type: "boolean",
    defaultValue: "false",
    description: "Whether the mobile menu starts open.",
  },
  {
    component: "Nav",
    name: "open",
    type: "boolean",
    defaultValue: "—",
    description: "Controls the mobile menu. Leave it unset to let the bar manage itself.",
  },
  {
    component: "Nav",
    name: "onOpenChange",
    type: "(open: boolean) => void",
    defaultValue: "—",
    description: "Called when the mobile menu opens or closes.",
  },
  {
    component: "Nav",
    name: "className",
    type: "string",
    defaultValue: "—",
    description:
      "Classes on the header. Use this for fixed, sticky, or absolute. Any other header prop is passed through too.",
  },
  {
    component: "NavBrand",
    name: "href",
    type: "string",
    defaultValue: "—",
    description:
      "Where the logo and name go. Pass render to use a different link component.",
  },
  {
    component: "NavTitle",
    name: "children",
    type: "ReactNode",
    defaultValue: "—",
    description: "The name next to the logo.",
  },
  {
    component: "NavSubtitle",
    name: "children",
    type: "ReactNode",
    defaultValue: "—",
    description:
      "An optional second line under the name. It only shows when the bar has room.",
  },
  {
    component: "NavLinks",
    name: "children",
    type: "ReactNode",
    defaultValue: "—",
    description:
      "The links. They show in the bar when there is room, and in the menu when there is not.",
  },
  {
    component: "NavLink",
    name: "href",
    type: "string",
    defaultValue: "—",
    description:
      "The link target. Pass render to use a different element. Clicking it closes the menu.",
  },
  {
    component: "NavMenu",
    name: "className",
    type: "string",
    defaultValue: "—",
    description: "Classes on the menu button. It uses your project's icon set.",
  },
  {
    component: "NavActions",
    name: "children",
    type: "ReactNode",
    defaultValue: "—",
    description:
      "Anything you want at the end, like a button. On a small screen it sits in the menu.",
  },
];
