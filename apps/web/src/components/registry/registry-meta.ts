export type RegistryPropRow = {
  component: string;
  name: string;
  type: string;
  defaultValue: string;
  description: string;
};

export const registryProps: Record<string, RegistryPropRow[]> = {
  "nav-01": [
    {
      component: "Nav01",
      name: "position",
      type: '"fixed" | "contained"',
      defaultValue: '"fixed"',
      description:
        "fixed sticks the bar to the window. contained keeps it inside a scrolling box, which is how this preview works.",
    },
    {
      component: "Nav01",
      name: "className",
      type: "string",
      defaultValue: "—",
      description:
        "Classes on the header. Any other header prop is passed through too.",
    },
    {
      component: "Nav01Brand",
      name: "href",
      type: "string",
      defaultValue: "—",
      description:
        "Where the logo and name go. Pass render to use a different link component.",
    },
    {
      component: "Nav01Title",
      name: "children",
      type: "ReactNode",
      defaultValue: "—",
      description: "The name next to the logo.",
    },
    {
      component: "Nav01Subtitle",
      name: "children",
      type: "ReactNode",
      defaultValue: "—",
      description:
        "An optional second line under the name. It only shows when the bar has room.",
    },
    {
      component: "Nav01Links",
      name: "children",
      type: "ReactNode",
      defaultValue: "—",
      description:
        "The links. They show in the bar when there is room, and in the menu when there is not.",
    },
    {
      component: "Nav01Link",
      name: "href",
      type: "string",
      defaultValue: "—",
      description:
        "The link target. Pass render to use a different element. Clicking it closes the menu.",
    },
    {
      component: "Nav01Menu",
      name: "menuIcon",
      type: "ReactNode",
      defaultValue: "—",
      description:
        "The icon that opens the menu. Leave it out and the bar uses your project's icon set.",
    },
    {
      component: "Nav01Menu",
      name: "closeIcon",
      type: "ReactNode",
      defaultValue: "—",
      description:
        "The icon that closes the menu. Leave it out and the bar uses your project's icon set.",
    },
    {
      component: "Nav01Actions",
      name: "children",
      type: "ReactNode",
      defaultValue: "—",
      description:
        "Anything you want at the end, like a button. On a small screen it sits in the menu.",
    },
  ],
};
