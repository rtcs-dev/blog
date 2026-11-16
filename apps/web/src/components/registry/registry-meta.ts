export type RegistryPropRow = {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
};

export const registryProps: Record<string, RegistryPropRow[]> = {
  "nav-01": [
    {
      name: "logo",
      type: "{ src: string; alt: string }",
      defaultValue: "—",
      description: "The image next to the name.",
    },
    {
      name: "title",
      type: "string",
      defaultValue: "—",
      description: "The name next to the logo.",
    },
    {
      name: "subtitle",
      type: "string",
      defaultValue: "—",
      description:
        "An optional second line under the name. It only shows when the bar has room.",
    },
    {
      name: "links",
      type: "{ href: string; label: string }[]",
      defaultValue: "—",
      description:
        "The links in the bar. On a small screen they move into the menu.",
    },
    {
      name: "trailing",
      type: "ReactNode",
      defaultValue: "—",
      description:
        "Anything you want at the end, like a button. On a small screen it sits in the menu.",
    },
    {
      name: "menuIcon",
      type: "ReactNode",
      defaultValue: "—",
      description:
        "The icon that opens the menu. Leave it out and the bar uses your project's icon set.",
    },
    {
      name: "closeIcon",
      type: "ReactNode",
      defaultValue: "—",
      description:
        "The icon that closes the menu. Leave it out and the bar uses your project's icon set.",
    },
    {
      name: "position",
      type: '"fixed" | "contained"',
      defaultValue: '"fixed"',
      description:
        "fixed sticks the bar to the window. contained keeps it inside a scrolling box, which is how this preview works.",
    },
    {
      name: "homeHref",
      type: "string",
      defaultValue: '"/"',
      description: "Where the logo and name go.",
    },
    {
      name: "className",
      type: "string",
      defaultValue: "—",
      description: "Extra classes on the bar.",
    },
  ],
};
