import { CoverGradientLayers } from "@/components/cover-gradient-layers"
import {
  CUSTOM_LOGO_ID,
  getLogoPath,
  isBuiltinLogoId,
  type LogoId,
} from "@/lib/logos"
import { absoluteUrl } from "@/lib/url"
import { CANVAS, THEMES, type ThemeVariant } from "@/lib/themes"

export type CoverRenderInput = {
  title: string
  subtitle: string
  logoId: LogoId
  customLogoDataUrl?: string | null
  variant: ThemeVariant
  titleSize?: number
  subtitleSize?: number
}

export function resolveLogoSrc(
  logoId: LogoId,
  customLogoDataUrl?: string | null
): string {
  if (logoId === CUSTOM_LOGO_ID) {
    if (!customLogoDataUrl) {
      return absoluteUrl(getLogoPath("nestjs"))
    }
    return customLogoDataUrl
  }
  if (isBuiltinLogoId(logoId)) {
    return absoluteUrl(getLogoPath(logoId))
  }
  return absoluteUrl(getLogoPath("nestjs"))
}

export function CoverTemplate({
  title,
  subtitle,
  logoId,
  customLogoDataUrl,
  variant,
  titleSize = 64,
  subtitleSize = 32,
}: CoverRenderInput) {
  const theme = THEMES[variant]
  const logoUrl = resolveLogoSrc(logoId, customLogoDataUrl)

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
        {/* eslint-disable-next-line @next/next/no-img-element */}
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
