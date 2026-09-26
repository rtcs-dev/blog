import { cva, type VariantProps } from "class-variance-authority";

const typographyVariants = cva("", {
  variants: {
    variant: {
      display:
        "font-heading text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-6xl lg:text-7xl",
      lede: "font-heading text-xl leading-snug tracking-[-0.025em] sm:text-2xl lg:text-3xl",
      body: "text-base leading-7",
      bodyLarge: "text-base leading-7 sm:text-lg sm:leading-8",
      label: "font-mono text-xs font-medium uppercase tracking-[0.12em]",
    },
    tone: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
    },
  },
  defaultVariants: {
    variant: "body",
    tone: "default",
  },
});

type TypographyVariants = VariantProps<typeof typographyVariants>;

export { typographyVariants, type TypographyVariants };
