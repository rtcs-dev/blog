import { mkdir } from "fs/promises"
import path from "path"

import { NextResponse } from "next/server"
import sharp from "sharp"
import { z } from "zod"

import { renderCoverSvg } from "@/lib/render-cover"
import { coverParamsObjectSchema } from "@/lib/schema"

export const runtime = "nodejs"

const bodySchema = coverParamsObjectSchema
  .extend({
    titleSize: z.number().min(24).max(120).optional(),
    subtitleSize: z.number().min(16).max(64).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.logoId === "custom" && !value.customLogoDataUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Upload a logo before saving with a custom logo",
        path: ["customLogoDataUrl"],
      })
    }
  })

function postsImagesDir() {
  // apps/og → apps/web/public/assets/images/posts
  return path.resolve(
    process.cwd(),
    "../web/public/assets/images/posts"
  )
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid body" },
        { status: 400 }
      )
    }

    const {
      title,
      subtitle,
      logoId,
      customLogoDataUrl,
      filename,
      titleSize,
      subtitleSize,
    } = parsed.data
    const postsDir = postsImagesDir()
    const rawDir = path.join(postsDir, "_raw")
    await mkdir(rawDir, { recursive: true })

    const written: string[] = []

    for (const variant of ["light", "dark"] as const) {
      const svg = await renderCoverSvg({
        title,
        subtitle,
        logoId,
        customLogoDataUrl,
        variant,
        titleSize,
        subtitleSize,
      })
      const svgBuffer = Buffer.from(svg)

      const pngName = `${filename}-${variant}.png`
      const webpName = `${filename}-${variant}.webp`
      const pngPath = path.join(rawDir, pngName)
      const webpPath = path.join(postsDir, webpName)

      await sharp(svgBuffer).png().toFile(pngPath)
      await sharp(svgBuffer).webp({ quality: 85 }).toFile(webpPath)

      written.push(
        `apps/web/public/assets/images/posts/_raw/${pngName}`,
        `apps/web/public/assets/images/posts/${webpName}`
      )
    }

    return NextResponse.json({ ok: true, files: written })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Save failed",
      },
      { status: 500 }
    )
  }
}
