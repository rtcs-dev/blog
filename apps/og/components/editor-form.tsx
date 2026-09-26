"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { LOGOS } from "@/lib/logos"
import { useEditorStore } from "@/providers/editor-store-provider"

export default function EditorForm() {
  const title = useEditorStore((s) => s.title)
  const subtitle = useEditorStore((s) => s.subtitle)
  const logoId = useEditorStore((s) => s.logoId)
  const filename = useEditorStore((s) => s.filename)
  const previewVariant = useEditorStore((s) => s.previewVariant)
  const setTitle = useEditorStore((s) => s.setTitle)
  const setSubtitle = useEditorStore((s) => s.setSubtitle)
  const setLogoId = useEditorStore((s) => s.setLogoId)
  const setFilename = useEditorStore((s) => s.setFilename)
  const setPreviewVariant = useEditorStore((s) => s.setPreviewVariant)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label>Logo</Label>
        <RadioGroup
          value={logoId}
          onValueChange={(value) =>
            setLogoId(value as typeof logoId)
          }
          className="grid grid-cols-3 gap-2"
        >
          {LOGOS.map((logo) => (
            <label
              key={logo.id}
              className="flex cursor-pointer flex-col items-center gap-2 rounded-md border p-3 has-[[data-state=checked]]:border-foreground"
            >
              <RadioGroupItem value={logo.id} className="sr-only" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.path}
                alt={logo.label}
                width={40}
                height={40}
                className="size-10 object-contain"
              />
              <span className="text-xs text-muted-foreground">{logo.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Configuration"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="In NestJS applications"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="filename">Filename stem</Label>
        <Input
          id="filename"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="configuring-nest"
        />
        <p className="text-xs text-muted-foreground">
          Writes {"{stem}-light"} / {"{stem}-dark"} into the blog posts images
          folder.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Preview variant</Label>
        <RadioGroup
          value={previewVariant}
          onValueChange={(value) =>
            setPreviewVariant(value as typeof previewVariant)
          }
          className="grid grid-cols-2 gap-2"
        >
          {(["light", "dark"] as const).map((variant) => (
            <label
              key={variant}
              className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 has-[[data-state=checked]]:border-foreground"
            >
              <RadioGroupItem value={variant} id={`variant-${variant}`} />
              <span className="text-sm capitalize">{variant}</span>
            </label>
          ))}
        </RadioGroup>
      </div>
    </div>
  )
}
