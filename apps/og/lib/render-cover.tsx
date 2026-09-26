import { readFile } from "fs/promises"
import path from "path"

import satori from "satori"

import { getFontUrl, getFontsFromParams } from "@/lib/fonts"
import type { LogoId } from "@/lib/logos"
import { getLogoPath } from "@/lib/logos"
import { CANVAS, THEMES, type ThemeVariant } from "@/lib/themes"

async function loadLogoDataUrl(logoId: LogoId): Promise<string> {
  const logoPath = getLogoPath(logoId)
  const filePath = path.join(process.cwd(), "public", logoPath)
  const buffer = await readFile(filePath)
  const ext = path.extname(filePath).toLowerCase()
  const mime =
    ext === ".png"
      ? "image/png"
      : ext === ".svg"
        ? "image/svg+xml"
        : "application/octet-stream"
  return `data:${mime};base64,${buffer.toString("base64")}`
}

async function loadNoiseDataUrl(): Promise<string> {
  const filePath = path.join(process.cwd(), "public", "noise.svg")
  const buffer = await readFile(filePath)
  return `data:image/svg+xml;base64,${buffer.toString("base64")}`
}

function ServerCover({
  title,
  subtitle,
  logoDataUrl,
  noiseDataUrl,
  variant,
  titleSize = 64,
  subtitleSize = 32,
}: {
  title: string
  subtitle: string
  logoDataUrl: string
  noiseDataUrl: string
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
      <div
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
          inset: 0,
          filter: "brightness(100%) contrast(150%)",
          opacity: theme.noise,
          backgroundImage: `url('${noiseDataUrl}')`,
          backgroundRepeat: "repeat",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.25rem",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
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
  logoId: LogoId
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
  const noiseDataUrl = await loadNoiseDataUrl()

  return satori(
    <ServerCover
      title={input.title}
      subtitle={input.subtitle}
      logoDataUrl={logoDataUrl}
      noiseDataUrl={noiseDataUrl}
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
