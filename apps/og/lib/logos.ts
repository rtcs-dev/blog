export const LOGOS = [
  {
    id: "nestjs",
    label: "NestJS",
    path: "/logos/nestjs.svg",
  },
  {
    id: "nodejs",
    label: "Node.js",
    path: "/logos/nodejs.svg",
  },
  {
    id: "blog",
    label: "Blog mark",
    path: "/logos/blog.png",
  },
] as const

export type LogoId = (typeof LOGOS)[number]["id"]

export function getLogoPath(id: LogoId) {
  return LOGOS.find((logo) => logo.id === id)?.path ?? LOGOS[0].path
}
