function toggleCallout(evt: Event) {
  evt.preventDefault()
  evt.stopPropagation()
  const target = evt.target as HTMLElement
  const title = target.closest(".callout-title") as HTMLElement
  if (!title) return
  const outerBlock = title.closest(".callout.is-collapsible") as HTMLElement
  if (!outerBlock) return
  outerBlock.classList.toggle("is-collapsed")
  const content = outerBlock.querySelector(".callout-content") as HTMLElement
  if (!content) return
  const collapsed = outerBlock.classList.contains("is-collapsed")
  content.style.gridTemplateRows = collapsed ? "0fr" : "1fr"
}

function setupCallout() {
  const collapsible = document.querySelectorAll(
    `.callout.is-collapsible`,
  ) as NodeListOf<HTMLElement>
  for (const div of collapsible) {
    const content = div.querySelector(".callout-content") as HTMLElement
    if (!content) continue

    // Set initial state
    const collapsed = div.classList.contains("is-collapsed")
    content.style.gridTemplateRows = collapsed ? "0fr" : "1fr"
  }
}

// Use a single document-level click handler with capture phase
document.addEventListener(
  "click",
  (evt) => {
    const target = evt.target as HTMLElement | null
    if (!target) return
    
    // Check if click is on callout-title or its children
    const title = target.closest(".callout-title") as HTMLElement | null
    if (title) {
      const outer = title.closest(".callout.is-collapsible") as HTMLElement | null
      if (outer) {
        toggleCallout(evt)
        return
      }
    }
  },
  // Use capture phase to catch events early
  { capture: true, passive: false },
)

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupCallout)
} else {
  setupCallout()
}
document.addEventListener("nav", setupCallout)
