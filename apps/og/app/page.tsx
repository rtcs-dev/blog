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

export default function HomePage() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Cover</CardTitle>
          <CardDescription>
            Match existing posts: centered logo, bold title, lighter subtitle,
            homepage-style light + dark gradients.
          </CardDescription>
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
            Toggle light/dark in the form. Saving always writes both variants.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PreviewRenderer />
        </CardContent>
      </Card>
    </div>
  )
}
