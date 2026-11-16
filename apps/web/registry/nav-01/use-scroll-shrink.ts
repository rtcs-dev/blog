"use client"

import { useEffect, useState, type RefObject } from "react"

const scrollShrinkDistance = 8

function isScrollable(node: Element) {
  const overflowY = getComputedStyle(node).overflowY
  return (
    overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay"
  )
}

export function findScrollParent(node: HTMLElement | null) {
  let current = node?.parentElement ?? null
  while (current) {
    if (isScrollable(current)) return current
    current = current.parentElement
  }
  return null
}

function findScrollTarget(node: HTMLElement | null) {
  const ancestor = findScrollParent(node)
  if (ancestor) return ancestor
  const parent = node?.parentElement
  if (!parent) return null
  for (const child of parent.children) {
    if (child !== node && child instanceof HTMLElement && isScrollable(child)) {
      return child
    }
  }
  return null
}

export function useScrollShrink(rootRef: RefObject<HTMLElement | null>) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const target = findScrollTarget(rootRef.current) ?? window
    const read = () => {
      const top = target instanceof Window ? target.scrollY : target.scrollTop
      const next = top > scrollShrinkDistance
      setScrolled((current) => (current === next ? current : next))
    }

    read()
    target.addEventListener("scroll", read, { passive: true })
    return () => target.removeEventListener("scroll", read)
  }, [rootRef])

  return scrolled
}
