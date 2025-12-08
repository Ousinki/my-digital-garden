function toggleCallout(this: HTMLElement, evt?: Event) {
  evt?.preventDefault()
  evt?.stopPropagation()
  const outerBlock = this.parentElement!
  outerBlock.classList.toggle("is-collapsed")
  const content = outerBlock.getElementsByClassName("callout-content")[0] as HTMLElement
  if (!content) return
  const collapsed = outerBlock.classList.contains("is-collapsed")
  content.style.gridTemplateRows = collapsed ? "0fr" : "1fr"
}

function setupCallout() {
  const collapsible = document.getElementsByClassName(
    `callout is-collapsible`,
  ) as HTMLCollectionOf<HTMLElement>
  for (const div of collapsible) {
    const title = div.getElementsByClassName("callout-title")[0] as HTMLElement
    const content = div.getElementsByClassName("callout-content")[0] as HTMLElement
    if (!title || !content) continue

    title.addEventListener("click", toggleCallout)
    ;(window as Window & { addCleanup?: (cleanup: () => void) => void }).addCleanup?.(() =>
      title.removeEventListener("click", toggleCallout),
    )

    const collapsed = div.classList.contains("is-collapsed")
    content.style.gridTemplateRows = collapsed ? "0fr" : "1fr"
  }
}

// Fallback: ensure clicks still work even if per-callout binding misses
document.addEventListener(
  "click",
  (evt) => {
    const target = evt.target as HTMLElement | null
    // allow clicking anywhere inside a collapsible callout, not just the title
    const outer = target?.closest(".callout.is-collapsible") as HTMLElement | null
    if (!outer) return
    const title = outer.querySelector(".callout-title") as HTMLElement | null
    if (!title) return
    toggleCallout.call(title, evt)
  },
  // do not use passive to allow preventDefault when needed
  { passive: false },
)

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupCallout)
} else {
  setupCallout()
}
document.addEventListener("nav", setupCallout)
