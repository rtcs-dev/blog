/** MIME types accepted by the logo upload control. */
export const LOGO_UPLOAD_ACCEPT =
  ".svg,.png,.webp,image/svg+xml,image/png,image/webp"

export const LOGO_UPLOAD_MIME_TYPES = [
  "image/svg+xml",
  "image/png",
  "image/webp",
] as const

/** Preferred built-ins (labels used when the directory listing includes them). */
export const BUILTIN_LOGO_META = [
  { id: "nestjs", label: "NestJS", filename: "nestjs.svg" },
  { id: "nodejs", label: "Node.js", filename: "nodejs.svg" },
  { id: "blog", label: "Blog mark", filename: "blog.png" },
] as const

export type LogoEntry = {
  id: string
  label: string
  path: string
  filename: string
}

export type LogoId = string
