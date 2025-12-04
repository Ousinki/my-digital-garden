function setupTooltip() {
  const tooltips = document.querySelectorAll(
    ".tooltip"
  ) as NodeListOf<HTMLElement>

  const cleanupFns: Array<() => void> = []

  tooltips.forEach((tooltip) => {
    const tooltipImage = tooltip.querySelector(
      ".tooltip-image"
    ) as HTMLImageElement

    if (!tooltipImage) return

    const updateTooltipPosition = () => {
      setTimeout(() => {
        const tooltipRect = tooltipImage.getBoundingClientRect()
        if (tooltipRect.width === 0) return

        const viewportLeft = 0
        const viewportRight = window.innerWidth
        const viewportTop = 0

        const triggerRect = tooltip.getBoundingClientRect()

        tooltipImage.style.left = "50%"
        tooltipImage.style.right = "auto"
        tooltipImage.style.transform = "translateX(-50%)"
        tooltipImage.style.top = "auto"
        tooltipImage.style.bottom = "100%"

        const currentRect = tooltipImage.getBoundingClientRect()

        if (currentRect.left < viewportLeft) {
          tooltipImage.style.left = "0"
          tooltipImage.style.transform = "translateX(0)"
        } else if (currentRect.right > viewportRight) {
          tooltipImage.style.left = "auto"
          tooltipImage.style.right = "0"
          tooltipImage.style.transform = "translateX(0)"
        }

        if (currentRect.top < viewportTop) {
          tooltipImage.style.top = "100%"
          tooltipImage.style.bottom = "auto"
        }

        const finalRect = tooltipImage.getBoundingClientRect()
        if (finalRect.left < viewportLeft) {
          tooltipImage.style.left = "0"
          tooltipImage.style.transform = "translateX(0)"
        }
        if (finalRect.right > viewportRight) {
          tooltipImage.style.left = "auto"
          tooltipImage.style.right = "0"
          tooltipImage.style.transform = "translateX(0)"
        }
      }, 10)
    }

    const mouseEnterHandler = () => {
      tooltipImage.style.visibility = "visible"
      tooltipImage.style.opacity = "1"
      updateTooltipPosition()
    }

    const mouseLeaveHandler = (e: MouseEvent) => {
      const relatedTarget = e.relatedTarget as Node
      if (relatedTarget && tooltip.contains(relatedTarget)) {
        return
      }

      tooltipImage.style.visibility = "hidden"
      tooltipImage.style.opacity = "0"

      setTimeout(() => {
        tooltipImage.style.left = "50%"
        tooltipImage.style.right = "auto"
        tooltipImage.style.transform = "translateX(-50%)"
        tooltipImage.style.top = "auto"
        tooltipImage.style.bottom = "100%"
      }, 200)
    }

    tooltip.addEventListener("mouseenter", mouseEnterHandler)
    tooltip.addEventListener("mouseleave", mouseLeaveHandler)

    const resizeHandler = () => {
      if (
        tooltipImage.style.visibility === "visible" ||
        tooltipImage.style.opacity === "1"
      ) {
        updateTooltipPosition()
      }
    }

    window.addEventListener("resize", resizeHandler)

    cleanupFns.push(() => {
      tooltip.removeEventListener("mouseenter", mouseEnterHandler)
      tooltip.removeEventListener("mouseleave", mouseLeaveHandler)
      window.removeEventListener("resize", resizeHandler)
    })
  })

  if (window.addCleanup) {
    cleanupFns.forEach((fn) => window.addCleanup(fn))
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupTooltip)
} else {
  setupTooltip()
}

document.addEventListener("nav", setupTooltip)

