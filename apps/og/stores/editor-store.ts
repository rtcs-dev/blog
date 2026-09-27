import { createStore } from "zustand/vanilla"

import type { LogoEntry } from "@/lib/logos"
import type { ThemeVariant } from "@/lib/themes"

export type EditorState = {
  title: string
  subtitle: string
  logoId: string
  logos: LogoEntry[]
  filename: string
  previewVariant: ThemeVariant
  titleSize: number
  subtitleSize: number
  previewSvg: string | null
}

export type EditorActions = {
  setTitle: (title: string) => void
  setSubtitle: (subtitle: string) => void
  setLogoId: (logoId: string) => void
  setLogos: (logos: LogoEntry[]) => void
  setFilename: (filename: string) => void
  setPreviewVariant: (variant: ThemeVariant) => void
  updatePreviewSvg: (svg: string) => void
}

export type EditorStore = EditorState & EditorActions

export const defaultInitState: EditorState = {
  title: "Configuration",
  subtitle: "In NestJS applications",
  logoId: "nestjs",
  logos: [],
  filename: "configuring-nest",
  previewVariant: "light",
  titleSize: 64,
  subtitleSize: 32,
  previewSvg: null,
}

export const createEditorStore = (
  initState: EditorState = defaultInitState
) => {
  return createStore<EditorStore>()((set) => ({
    ...initState,
    setTitle: (title) => set({ title }),
    setSubtitle: (subtitle) => set({ subtitle }),
    setLogoId: (logoId) => set({ logoId }),
    setLogos: (logos) =>
      set((state) => ({
        logos,
        logoId: logos.some((logo) => logo.id === state.logoId)
          ? state.logoId
          : (logos[0]?.id ?? state.logoId),
      })),
    setFilename: (filename) => set({ filename }),
    setPreviewVariant: (previewVariant) => set({ previewVariant }),
    updatePreviewSvg: (previewSvg) => set({ previewSvg }),
  }))
}
