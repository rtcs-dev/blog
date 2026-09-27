import { access, mkdir, readdir, writeFile } from "node:fs/promises"
import { constants as fsConstants } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import type { IncomingMessage, ServerResponse } from "node:http"

import type { Plugin, ViteDevServer } from "vite"
import sharp from "sharp"
import { z } from "zod"

import {
  LOGO_UPLOAD_EXTENSIONS,
  LOGO_UPLOAD_MIME_TYPES,
  logosDir,
  protectedLogoFilenames,
  resolveLogoFilePath,
  safeLogoFilename,
  type LogoEntry,
} from "../lib/logos-fs"
import { coverParamsObjectSchema } from "../lib/schema"

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

function postsImagesDir() {
  return path.resolve(appRoot, "../web/public/assets/images/posts")
}

function sendJson(
  res: ServerResponse,
  status: number,
  body: Record<string, unknown>
) {
  res.statusCode = status
  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify(body))
}

async function readBody(req: IncomingMessage): Promise<Buffer> {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

function isPathInside(parent: string, child: string) {
  const relative = path.relative(parent, child)
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative))
}

const KNOWN_LABELS: Record<string, string> = {
  nestjs: "NestJS",
  nodejs: "Node.js",
  blog: "Blog mark",
}

const KNOWN_PREFERRED: Array<{ id: string; filename: string }> = [
  { id: "nestjs", filename: "nestjs.svg" },
  { id: "nodejs", filename: "nodejs.svg" },
  { id: "blog", filename: "blog.png" },
]

async function listLogos(): Promise<LogoEntry[]> {
  const dir = logosDir(appRoot)
  const files = await readdir(dir)
  const knownFilenames = new Set(KNOWN_PREFERRED.map((item) => item.filename))
  const knownStems = new Set(KNOWN_PREFERRED.map((item) => item.id))
  const logos: LogoEntry[] = []

  for (const known of KNOWN_PREFERRED) {
    if (files.includes(known.filename)) {
      logos.push({
        id: known.id,
        label: KNOWN_LABELS[known.id] ?? known.id,
        path: `/logos/${known.filename}`,
        filename: known.filename,
      })
    }
  }

  for (const file of files) {
    const ext = path.extname(file).toLowerCase()
    if (!LOGO_UPLOAD_EXTENSIONS.includes(ext as (typeof LOGO_UPLOAD_EXTENSIONS)[number])) {
      continue
    }
    if (knownFilenames.has(file)) continue
    const stem = path.parse(file).name
    if (knownStems.has(stem)) continue

    logos.push({
      id: stem,
      label: stem,
      path: `/logos/${file}`,
      filename: file,
    })
  }

  return logos
}

const saveBodySchema = coverParamsObjectSchema.extend({
  titleSize: z.number().min(24).max(120).optional(),
  subtitleSize: z.number().min(16).max(64).optional(),
})

async function handleListLogos(_req: IncomingMessage, res: ServerResponse) {
  const logos = await listLogos()
  sendJson(res, 200, { ok: true, logos })
}

async function handleUploadLogo(req: IncomingMessage, res: ServerResponse) {
  const rawName = req.headers["x-filename"]
  const filenameHeader = Array.isArray(rawName) ? rawName[0] : rawName
  if (!filenameHeader) {
    sendJson(res, 400, { ok: false, error: "Missing X-Filename header" })
    return
  }

  const contentType = (req.headers["content-type"] || "").split(";")[0].trim()
  if (
    contentType &&
    !LOGO_UPLOAD_MIME_TYPES.includes(
      contentType as (typeof LOGO_UPLOAD_MIME_TYPES)[number]
    )
  ) {
    sendJson(res, 400, { ok: false, error: "Upload an SVG, PNG, or WebP image" })
    return
  }

  let safeName: string
  try {
    safeName = safeLogoFilename(filenameHeader)
  } catch (error) {
    sendJson(res, 400, {
      ok: false,
      error: error instanceof Error ? error.message : "Invalid filename",
    })
    return
  }

  const dir = logosDir(appRoot)
  await mkdir(dir, { recursive: true })

  const protectedNames = protectedLogoFilenames()
  let targetName = safeName
  let targetPath = path.join(dir, targetName)
  if (!isPathInside(dir, targetPath)) {
    sendJson(res, 400, { ok: false, error: "Invalid logo path" })
    return
  }

  if (protectedNames.has(targetName) || (await fileExists(targetPath))) {
    const parsed = path.parse(safeName)
    let n = 1
    do {
      targetName = `${parsed.name}-${n}${parsed.ext}`
      targetPath = path.join(dir, targetName)
      n += 1
    } while (protectedNames.has(targetName) || (await fileExists(targetPath)))
  }

  if (!isPathInside(dir, targetPath)) {
    sendJson(res, 400, { ok: false, error: "Invalid logo path" })
    return
  }

  const body = await readBody(req)
  if (body.length === 0) {
    sendJson(res, 400, { ok: false, error: "Empty upload body" })
    return
  }

  await writeFile(targetPath, body)

  const logos = await listLogos()
  const logo = logos.find((entry) => entry.filename === targetName)
  sendJson(res, 200, { ok: true, logo, logos })
}

async function fileExists(filePath: string) {
  try {
    await access(filePath, fsConstants.F_OK)
    return true
  } catch {
    return false
  }
}

async function handleSave(
  req: IncomingMessage,
  res: ServerResponse,
  server: ViteDevServer
) {
  const raw = await readBody(req)
  let json: unknown
  try {
    json = JSON.parse(raw.toString("utf8"))
  } catch {
    sendJson(res, 400, { ok: false, error: "Invalid JSON body" })
    return
  }

  const parsed = saveBodySchema.safeParse(json)
  if (!parsed.success) {
    sendJson(res, 400, {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid body",
    })
    return
  }

  const logoPath = await resolveLogoFilePath(appRoot, parsed.data.logoId)
  if (!logoPath) {
    sendJson(res, 400, { ok: false, error: "Unknown logo id" })
    return
  }

  const { renderCoverSvg } = await server.ssrLoadModule("/lib/render-cover.tsx")

  const {
    title,
    subtitle,
    logoId,
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

  sendJson(res, 200, { ok: true, files: written })
}

export function ogDevApiPlugin(): Plugin {
  return {
    name: "og-dev-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.method) {
          next()
          return
        }

        const url = new URL(req.url, "http://localhost")
        try {
          if (req.method === "GET" && url.pathname === "/api/logos") {
            await handleListLogos(req, res)
            return
          }
          if (req.method === "POST" && url.pathname === "/api/logos") {
            await handleUploadLogo(req, res)
            return
          }
          if (req.method === "POST" && url.pathname === "/api/save") {
            await handleSave(req, res, server)
            return
          }
        } catch (error) {
          console.error(error)
          sendJson(res, 500, {
            ok: false,
            error: error instanceof Error ? error.message : "Request failed",
          })
          return
        }

        next()
      })
    },
  }
}
