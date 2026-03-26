import { z } from "astro:content";

const RegistryItemFile = z.object({
  path: z.string(),
  content: z.string().optional(),
  type: z.string(),
});

export const RegistryItem = z.object({
  $schema: z.string().optional(),
  name: z.string(),
  type: z.string(),
  title: z.string(),
  description: z.string(),
  dependencies: z.array(z.string()),
  files: z.array(RegistryItemFile),
});

export type RegistryItem = z.infer<typeof RegistryItem>;
