import {
  MenuIcon,
  XIcon,
  type LucideIcon,
  type LucideProps,
} from "lucide-react"

const lucideIcons: Record<string, LucideIcon> = {
  MenuIcon,
  XIcon,
}

type IconPlaceholderProps = LucideProps & {
  lucide: string
  tabler: string
  hugeicons: string
  phosphor: string
  remixicon: string
}

export function IconPlaceholder({
  lucide,
  tabler: _tabler,
  hugeicons: _hugeicons,
  phosphor: _phosphor,
  remixicon: _remixicon,
  ...props
}: IconPlaceholderProps) {
  const Icon = lucideIcons[lucide]
  if (!Icon) return null
  return <Icon {...props} />
}
