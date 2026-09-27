import { z } from "zod"

import type { ThemeVariant } from "./themes"

export const coverParamsObjectSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string(),
  logoId: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Invalid logo id",
    }),
  filename: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Use lowercase kebab-case (e.g. configuring-nest)",
    }),
})

export const coverParamsSchema = coverParamsObjectSchema

export type CoverParams = z.infer<typeof coverParamsObjectSchema>

export type CoverTemplate = {
  title: string
  subtitle: string
  logoId: string
  logoPath?: string | null
  variant: ThemeVariant
  titleSize: number
  subtitleSize: number
}
