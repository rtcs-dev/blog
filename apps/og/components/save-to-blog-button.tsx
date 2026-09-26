"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { coverParamsSchema } from "@/lib/schema"
import { useEditorStore } from "@/providers/editor-store-provider"

export default function SaveToBlogButton() {
  const title = useEditorStore((s) => s.title)
  const subtitle = useEditorStore((s) => s.subtitle)
  const logoId = useEditorStore((s) => s.logoId)
  const filename = useEditorStore((s) => s.filename)
  const titleSize = useEditorStore((s) => s.titleSize)
  const subtitleSize = useEditorStore((s) => s.subtitleSize)

  const [status, setStatus] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function onSave() {
    setStatus(null)
    const parsed = coverParamsSchema.safeParse({
      title,
      subtitle,
      logoId,
      filename,
    })
    if (!parsed.success) {
      setStatus(parsed.error.issues[0]?.message ?? "Invalid input")
      return
    }

    try {
      setSaving(true)
      const res = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.data,
          titleSize,
          subtitleSize,
        }),
      })
      const data = (await res.json()) as {
        ok?: boolean
        error?: string
        files?: string[]
      }
      if (!res.ok || !data.ok) {
        setStatus(data.error ?? "Save failed")
        return
      }
      setStatus(`Saved: ${data.files?.join(", ")}`)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Button onClick={onSave} disabled={saving}>
        {saving ? "Saving…" : "Save light + dark to blog"}
      </Button>
      {status ? (
        <p className="text-sm text-muted-foreground break-all">{status}</p>
      ) : null}
    </div>
  )
}
