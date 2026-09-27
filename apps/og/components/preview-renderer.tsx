import { useEffect } from "react"
import satori from "satori"

import { CoverTemplate } from "@/components/cover-template"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { getFontUrl, getFontsFromParams } from "@/lib/fonts"
import { CANVAS } from "@/lib/themes"
import { useEditorStore } from "@/providers/editor-store-provider"

export default function PreviewRenderer() {
  const title = useEditorStore((s) => s.title)
  const subtitle = useEditorStore((s) => s.subtitle)
  const logoId = useEditorStore((s) => s.logoId)
  const logos = useEditorStore((s) => s.logos)
  const previewVariant = useEditorStore((s) => s.previewVariant)
  const titleSize = useEditorStore((s) => s.titleSize)
  const subtitleSize = useEditorStore((s) => s.subtitleSize)
  const previewSvg = useEditorStore((s) => s.previewSvg)
  const updatePreviewSvg = useEditorStore((s) => s.updatePreviewSvg)

  const logoPath =
    logos.find((logo) => logo.id === logoId)?.path ?? "/logos/nestjs.svg"

  useEffect(() => {
    let cancelled = false

    async function renderSvg() {
      const fonts = getFontsFromParams({
        title: { fontWeight: 700 },
        subtitle: { fontWeight: 400 },
      })
      const fontBuffers = await Promise.all(
        fonts.map(async (f) => {
          const res = await fetch(getFontUrl({ weight: f.weight }))
          return res.arrayBuffer()
        })
      )

      const svg = await satori(
        <CoverTemplate
          title={title}
          subtitle={subtitle}
          logoPath={logoPath}
          variant={previewVariant}
          titleSize={titleSize}
          subtitleSize={subtitleSize}
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

      if (!cancelled) {
        updatePreviewSvg(svg)
      }
    }

    void renderSvg()
    return () => {
      cancelled = true
    }
  }, [
    title,
    subtitle,
    logoPath,
    previewVariant,
    titleSize,
    subtitleSize,
    updatePreviewSvg,
  ])

  return (
    <AspectRatio ratio={16 / 9}>
      <img
        alt="Cover preview"
        className="h-full w-full object-contain"
        width={CANVAS.width}
        height={CANVAS.height}
        src={
          previewSvg
            ? `data:image/svg+xml;utf8,${encodeURIComponent(previewSvg)}`
            : "/loading.svg"
        }
      />
    </AspectRatio>
  )
}
