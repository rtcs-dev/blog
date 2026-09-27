export const LOGOS = [
  {
    id: "nestjs",
    label: "NestJS",
    path: "/logos/nestjs.svg",
  },
  {
    id: "nodejs",
    label: "Node.js",
    path: "/logos/nodejs.svg",
  },
  {
    id: "blog",
    label: "Blog mark",
    path: "/logos/blog.png",
  },
] as const

export const BUILTIN_LOGO_IDS = LOGOS.map((logo) => logo.id)
export const CUSTOM_LOGO_ID = "custom" as const

export type BuiltinLogoId = (typeof LOGOS)[number]["id"]
export type LogoId = BuiltinLogoId | typeof CUSTOM_LOGO_ID

export function isBuiltinLogoId(id: LogoId): id is BuiltinLogoId {
  return id !== CUSTOM_LOGO_ID
}

export function getLogoPath(id: BuiltinLogoId) {
  return LOGOS.find((logo) => logo.id === id)?.path ?? LOGOS[0].path
}

/** MIME types accepted by the logo upload control. */
export const LOGO_UPLOAD_ACCEPT = ".svg,.png,.webp,image/svg+xml,image/png,image/webp"

export const LOGO_UPLOAD_MIME_TYPES = [
  "image/svg+xml",
  "image/png",
  "image/webp",
] as const

/**
 * Read an uploaded logo as a data URL suitable for Satori.
 * WebP is converted to PNG because Satori does not reliably decode WebP.
 */
export async function fileToLogoDataUrl(file: File): Promise<string> {
  const type = file.type || guessMimeFromName(file.name)
  if (!LOGO_UPLOAD_MIME_TYPES.includes(type as (typeof LOGO_UPLOAD_MIME_TYPES)[number])) {
    throw new Error("Upload an SVG, PNG, or WebP image")
  }

  if (type === "image/webp") {
    return webpFileToPngDataUrl(file)
  }

  return readFileAsDataUrl(file)
}

function guessMimeFromName(name: string): string {
  const lower = name.toLowerCase()
  if (lower.endsWith(".svg")) return "image/svg+xml"
  if (lower.endsWith(".png")) return "image/png"
  if (lower.endsWith(".webp")) return "image/webp"
  return ""
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result)
      else reject(new Error("Failed to read logo file"))
    }
    reader.onerror = () => reject(new Error("Failed to read logo file"))
    reader.readAsDataURL(file)
  })
}

async function webpFileToPngDataUrl(file: File): Promise<string> {
  const objectUrl = URL.createObjectURL(file)
  try {
    const img = await loadHtmlImage(objectUrl)
    const canvas = document.createElement("canvas")
    canvas.width = img.naturalWidth || img.width
    canvas.height = img.naturalHeight || img.height
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Failed to convert WebP logo")
    ctx.drawImage(img, 0, 0)
    return canvas.toDataURL("image/png")
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

function loadHtmlImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("Failed to decode logo image"))
    img.src = src
  })
}
