import { z } from "zod"

import { CUSTOM_LOGO_ID, type LogoId } from "./logos"
import type { ThemeVariant } from "./themes"

const dataUrlLogoSchema = z
  .string()
  .regex(
    /^data:image\/(png|svg\+xml|jpeg|jpg|webp)/i,
    "Custom logo must be a PNG, SVG, or WebP data URL"
  )

export const coverParamsObjectSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string(),
  logoId: z.enum(["nestjs", "nodejs", "blog", CUSTOM_LOGO_ID]),
  customLogoDataUrl: dataUrlLogoSchema.optional(),
  filename: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Use lowercase kebab-case (e.g. configuring-nest)",
    }),
})

export const coverParamsSchema = coverParamsObjectSchema.superRefine(
  (value, ctx) => {
    if (value.logoId === CUSTOM_LOGO_ID && !value.customLogoDataUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Upload a logo before saving with a custom logo",
        path: ["customLogoDataUrl"],
      })
    }
  }
)

export type CoverParams = z.infer<typeof coverParamsObjectSchema>

export type CoverTemplate = {
  title: string
  subtitle: string
  logoId: LogoId
  customLogoDataUrl?: string | null
  variant: ThemeVariant
  titleSize: number
  subtitleSize: number
}
