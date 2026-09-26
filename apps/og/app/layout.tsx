import type { Metadata } from "next"

import "./globals.css"

import { EditorStoreProvider } from "@/providers/editor-store-provider"

export const metadata: Metadata = {
  title: "OG cover editor",
  description:
    "Local Open Graph / cover image editor for this blog’s publishing workflow.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-sm font-semibold tracking-tight">OG covers</p>
            <p className="text-xs text-muted-foreground">
              Adapted from clerk/og.new · original editor by Fady
            </p>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 pb-10">
          <EditorStoreProvider>{children}</EditorStoreProvider>
        </main>
      </body>
    </html>
  )
}
