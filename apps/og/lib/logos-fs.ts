import { readdir } from "node:fs/promises"
import path from "node:path"

export const LOGO_UPLOAD_EXTENSIONS = [".svg", ".png", ".webp"] as const

export const LOGO_UPLOAD_MIME_TYPES = [
  "image/svg+xml",
  "image/png",
  "image/webp",
] as const

export type LogoEntry = {
  id: string
  label: string
  path: string
  filename: string
}

const PROTECTED_FILENAMES = ["nestjs.svg", "nodejs.svg", "blog.png"] as const

export function logosDir(appRoot: string) {
  return path.join(appRoot, "public", "logos")
}

export function protectedLogoFilenames() {
  return new Set<string>(PROTECTED_FILENAMES)
}

/** Derive a safe on-disk filename from a user-provided name (no path segments). */
export function safeLogoFilename(originalName: string): string {
  if (
    !originalName ||
    originalName.includes("\0") ||
    originalName.includes("..")
  ) {
    throw new Error("Invalid logo filename")
  }

  const base = path.basename(originalName)
  if (!base || base === "." || base === "..") {
    throw new Error("Invalid logo filename")
  }

  const parsed = path.parse(base)
  const ext = parsed.ext.toLowerCase()
  if (!LOGO_UPLOAD_EXTENSIONS.includes(ext as (typeof LOGO_UPLOAD_EXTENSIONS)[number])) {
    throw new Error("Upload an SVG, PNG, or WebP image")
  }

  const stem =
    parsed.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 64) || "logo"

  return `${stem}${ext}`
}

export async function resolveLogoFilePath(
  appRoot: string,
  logoId: string
): Promise<string | null> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(logoId)) {
    return null
  }

  const dir = logosDir(appRoot)
  const preferred: Record<string, string> = {
    nestjs: "nestjs.svg",
    nodejs: "nodejs.svg",
    blog: "blog.png",
  }

  if (preferred[logoId]) {
    return path.join(dir, preferred[logoId])
  }

  const files = await readdir(dir)
  const match = files.find((file) => {
    const ext = path.extname(file).toLowerCase()
    return (
      LOGO_UPLOAD_EXTENSIONS.includes(ext as (typeof LOGO_UPLOAD_EXTENSIONS)[number]) &&
      path.parse(file).name === logoId
    )
  })

  if (!match) return null

  const resolved = path.resolve(dir, match)
  if (!resolved.startsWith(path.resolve(dir) + path.sep)) {
    return null
  }
  return resolved
}
