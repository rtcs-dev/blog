import NestIcon from "@/icons/resume/nest.svg?react";
import type { SeriesIcon } from "@/lib/posts/series-icon";
import { cn } from "@/lib/utils";

const seriesMarks = {
  nest: {
    Icon: NestIcon,
    className: "text-[#e0234e]",
  },
} satisfies Record<SeriesIcon, { Icon: typeof NestIcon; className: string }>;

type Props = {
  name: string;
  icon?: SeriesIcon;
};

export function SeriesTitle({ name, icon }: Props) {
  const mark = icon ? seriesMarks[icon] : undefined;
  if (!mark) return name;

  const Icon = mark.Icon;

  return (
    <>
      <Icon
        aria-hidden="true"
        className={cn(
          "me-[0.25em] inline-block size-[1em] shrink-0 align-middle [background-clip:border-box] [-webkit-background-clip:border-box] [-webkit-text-fill-color:currentcolor]",
          mark.className,
        )}
      />
      {name}
    </>
  );
}
