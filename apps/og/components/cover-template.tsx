import { absoluteUrl } from "@/lib/url"
import { getLogoPath } from "@/lib/logos"
import { CANVAS, THEMES, type ThemeVariant } from "@/lib/themes"
import type { LogoId } from "@/lib/logos"

export type CoverRenderInput = {
  title: string
  subtitle: string
  logoId: LogoId
  variant: ThemeVariant
  titleSize?: number
  subtitleSize?: number
}

export function CoverTemplate({
  title,
  subtitle,
  logoId,
  variant,
  titleSize = 64,
  subtitleSize = 32,
}: CoverRenderInput) {
  const theme = THEMES[variant]
  const logoUrl = absoluteUrl(getLogoPath(logoId))

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
          backgroundImage: `url('${absoluteUrl("/noise.svg")}')`,
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
