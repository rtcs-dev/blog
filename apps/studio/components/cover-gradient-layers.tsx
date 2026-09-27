import { THEMES, type ThemeVariant } from "@/lib/themes"

/**
 * Homepage page-backdrop glows (`background.astro`), as Satori-friendly layers.
 * One div per gradient (Satori is unreliable with comma-joined backgrounds).
 */
export function CoverGradientLayers({ variant }: { variant: ThemeVariant }) {
  const { gradients } = THEMES[variant]

  if (gradients.length === 0) {
    return null
  }

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        display: "flex",
      }}
    >
      {gradients.map((gradient) => (
        <div
          key={gradient}
          style={{
            height: "100%",
            width: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            display: "flex",
            backgroundImage: gradient,
          }}
        />
      ))}
    </div>
  )
}
