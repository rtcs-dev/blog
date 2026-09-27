import { CoverGradientLayers } from "@/components/cover-gradient-layers"
import { absoluteUrl } from "@/lib/url"
import { CANVAS, THEMES, type ThemeVariant } from "@/lib/themes"

export type CoverRenderInput = {
  title: string
  subtitle: string
  logoPath: string
  variant: ThemeVariant
  titleSize?: number
  subtitleSize?: number
}

export function CoverTemplate({
  title,
  subtitle,
  logoPath,
  variant,
  titleSize = 64,
  subtitleSize = 32,
}: CoverRenderInput) {
  const theme = THEMES[variant]
  const logoUrl = absoluteUrl(logoPath)

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
          src={logoUrl}
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
