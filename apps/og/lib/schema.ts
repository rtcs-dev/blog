import { z } from "zod"

import type { LogoId } from "./logos"
import type { ThemeVariant } from "./themes"

export const coverParamsSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string(),
  logoId: z.enum(["nestjs", "nodejs", "blog"]),
  filename: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Use lowercase kebab-case (e.g. configuring-nest)",
    }),
})

export type CoverParams = z.infer<typeof coverParamsSchema>

export type CoverTemplate = {
  title: string
  subtitle: string
  logoId: LogoId
  variant: ThemeVariant
  titleSize: number
  subtitleSize: number
}
