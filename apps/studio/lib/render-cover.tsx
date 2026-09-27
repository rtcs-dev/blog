import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import satori from "satori"

import { CoverGradientLayers } from "@/components/cover-gradient-layers"
import { resolveLogoFilePath } from "@/lib/logos-fs"
import { getFontUrl, getFontsFromParams } from "@/lib/fonts"
import { CANVAS, THEMES, type ThemeVariant } from "@/lib/themes"

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

async function loadLogoDataUrl(logoId: string): Promise<string> {
  const filePath = await resolveLogoFilePath(appRoot, logoId)
  if (!filePath) {
    throw new Error(`Unknown logo id: ${logoId}`)
  }
  const buffer = await readFile(filePath)
  const ext = path.extname(filePath).toLowerCase()
  const mime =
    ext === ".png"
      ? "image/png"
      : ext === ".svg"
        ? "image/svg+xml"
        : ext === ".webp"
          ? "image/webp"
          : "application/octet-stream"
  return `data:${mime};base64,${buffer.toString("base64")}`
}

function ServerCover({
  title,
  subtitle,
  logoDataUrl,
  variant,
  titleSize = 64,
  subtitleSize = 32,
}: {
  title: string
  subtitle: string
  logoDataUrl: string
  variant: ThemeVariant
  titleSize?: number
  subtitleSize?: number
}) {
  const theme = THEMES[variant]

  return (
    <div
      style={{
        width: CANVAS.width,
        height: CANVAS.height,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        background: theme.background,
        position: "relative",
      }}
    >
      <CoverGradientLayers variant={variant} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.25rem",
        }}
      >
        <img
          src={logoDataUrl}
          width={96}
          height={96}
          style={{ width: "6rem", height: "6rem", objectFit: "contain" }}
          alt=""
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.35rem",
          }}
        >
          <div
            style={{
              fontFamily: "inter",
              fontWeight: 700,
              fontSize: `${titleSize}px`,
              color: theme.title,
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                fontFamily: "inter",
                fontWeight: 400,
                fontSize: `${subtitleSize}px`,
                color: theme.subtitle,
                lineHeight: 1.3,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export async function renderCoverSvg(input: {
  title: string
  subtitle: string
  logoId: string
  variant: ThemeVariant
  titleSize?: number
  subtitleSize?: number
}): Promise<string> {
  const fonts = getFontsFromParams({
    title: { fontWeight: 700 },
    subtitle: { fontWeight: 400 },
  })
  const fontBuffers = await Promise.all(
    fonts.map(async (f) => {
      const res = await fetch(getFontUrl({ weight: f.weight }))
      if (!res.ok) {
        throw new Error(`Failed to fetch font weight ${f.weight}`)
      }
      return res.arrayBuffer()
    })
  )

  const logoDataUrl = await loadLogoDataUrl(input.logoId)

  return satori(
    <ServerCover
      title={input.title}
      subtitle={input.subtitle}
      logoDataUrl={logoDataUrl}
      variant={input.variant}
      titleSize={input.titleSize}
      subtitleSize={input.subtitleSize}
    />,
    {
      width: CANVAS.width,
      height: CANVAS.height,
      fonts: fonts.map((f, i) => ({
        name: f.family,
        weight: f.weight,
        data: fontBuffers[i],
        style: "normal" as const,
      })),
    }
  )
}
