import { z } from "astro/zod";

const RegistryItemFile = z.object({
  path: z.string(),
  content: z.string().optional(),
  type: z.string(),
  target: z.string().optional(),
});

export const RegistryItem = z.object({
  $schema: z.string().optional(),
  name: z.string(),
  type: z.string(),
  title: z.string(),
  description: z.string(),
  dependencies: z.array(z.string()).optional().default([]),
  registryDependencies: z.array(z.string()).optional().default([]),
  files: z.array(RegistryItemFile),
});

export type RegistryItem = z.infer<typeof RegistryItem>;
