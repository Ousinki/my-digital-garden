type FontSize = "small" | "medium" | "large"

const FONT_SIZE_KEY = "quartz-font-size"
const DEFAULT_FONT_SIZE: FontSize = "medium"

const fontSizes: Record<FontSize, number> = {
  small: 14,
  medium: 16,
  large: 18,
}

function getFontSize(): FontSize {
  const stored = localStorage.getItem(FONT_SIZE_KEY)
  if (stored === "small" || stored === "medium" || stored === "large") {
    return stored as FontSize
  }
  return DEFAULT_FONT_SIZE
}

function setFontSize(size: FontSize) {
  const fontSize = fontSizes[size]
  localStorage.setItem(FONT_SIZE_KEY, size)
  document.documentElement.style.setProperty("--article-font-size", `${fontSize}px`)
  document.documentElement.setAttribute("font-size", size)
  
  // Also update article font size
  const article = document.querySelector("article")
  if (article) {
    article.style.fontSize = `${fontSize}px`
  }
  
  // Update button text
  const sizeLabels: Record<FontSize, string> = {
    small: "小",
    medium: "中",
    large: "大",
  }
  const buttons = document.querySelectorAll(".font-size-toggle span")
  buttons.forEach((span) => {
    span.textContent = sizeLabels[size]
  })
}

function cycleFontSize() {
  const currentSize = getFontSize()
  const sizes: FontSize[] = ["small", "medium", "large"]
  const currentIndex = sizes.indexOf(currentSize)
  const nextIndex = (currentIndex + 1) % sizes.length
  const nextSize = sizes[nextIndex]
  setFontSize(nextSize)
}

function setupFontSize() {
  // Apply saved font size (this will also update button text)
  const savedSize = getFontSize()
  setFontSize(savedSize)

  // Setup button listeners
  const buttons = document.querySelectorAll(".font-size-toggle")
  buttons.forEach((button) => {
    const handler = () => cycleFontSize()
    button.addEventListener("click", handler)
    // @ts-ignore
    if (window.addCleanup) {
      // @ts-ignore
      window.addCleanup(() => button.removeEventListener("click", handler))
    }
  })
}

document.addEventListener("nav", setupFontSize)
setupFontSize()

