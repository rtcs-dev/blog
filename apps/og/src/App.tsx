import EditorForm from "@/components/editor-form"
import PreviewRenderer from "@/components/preview-renderer"
import SaveToBlogButton from "@/components/save-to-blog-button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { EditorStoreProvider } from "@/providers/editor-store-provider"

export default function App() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <p className="text-sm font-semibold tracking-tight">Studio</p>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-10">
        <EditorStoreProvider>
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Cover</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <EditorForm />
                <SaveToBlogButton />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  Toggle light/dark in the form. Saving always writes both
                  variants.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PreviewRenderer />
              </CardContent>
            </Card>
          </div>
        </EditorStoreProvider>
      </main>
    </div>
  )
}
