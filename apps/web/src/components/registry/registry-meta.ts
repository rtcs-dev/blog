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
      description: "Image shown beside the wordmark.",
    },
    {
      name: "title",
      type: "string",
      defaultValue: "—",
      description: "Primary wordmark line.",
    },
    {
      name: "subtitle",
      type: "string",
      defaultValue: "—",
      description:
        "Second wordmark line. It renders once the bar's container is at least 40rem wide.",
    },
    {
      name: "links",
      type: "{ href: string; label: string }[]",
      defaultValue: "—",
      description:
        "Navigation links. On a narrow bar they move into the menu panel.",
    },
    {
      name: "trailing",
      type: "ReactNode",
      defaultValue: "—",
      description:
        "Slot after the links. On a narrow bar it sits at the bottom of the menu panel.",
    },
    {
      name: "position",
      type: '"fixed" | "contained"',
      defaultValue: '"fixed"',
      description:
        "fixed pins the bar to the viewport. contained sticks it to the nearest scroll parent so a preview can scroll on its own.",
    },
    {
      name: "homeHref",
      type: "string",
      defaultValue: '"/"',
      description: "Href for the logo and wordmark.",
    },
    {
      name: "className",
      type: "string",
      defaultValue: "—",
      description: "Extra classes on the header element.",
    },
  ],
};
