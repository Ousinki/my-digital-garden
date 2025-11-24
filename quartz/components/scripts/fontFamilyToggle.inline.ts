type FontFamily = "default" | "ya" | "zhuan"

const FONT_FAMILY_KEY = "font-family"
const DEFAULT_FONT_FAMILY: FontFamily = "default"

const fontFamilies: Record<FontFamily, string> = {
  default: "var(--bodyFont), system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif", // 默认模式使用系统字体和 Google Fonts
  ya: "方正屏显雅宋, var(--bodyFont), system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, serif", // 中文用方正屏显雅宋，英文用系统字体
  zhuan: "方正小篆体, var(--bodyFont), system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, serif", // 中文用方正小篆体，英文用系统字体
}

function getFontFamily(): FontFamily {
  const saved = localStorage.getItem(FONT_FAMILY_KEY)
  if (saved === "default" || saved === "ya" || saved === "zhuan") {
    return saved as FontFamily
  }
  return DEFAULT_FONT_FAMILY
}

function setFontFamily(family: FontFamily) {
  const fontFamily = fontFamilies[family]
  // 设置自定义字体变量（包括 default 模式）
  document.documentElement.style.setProperty("--custom-body-font", fontFamily)
  document.documentElement.setAttribute("font-family", family)
  localStorage.setItem(FONT_FAMILY_KEY, family)
  
  // Update button text
  const familyLabels: Record<FontFamily, string> = {
    default: "Aa",
    ya: "雅",
    zhuan: "篆",
  }
  const buttons = document.querySelectorAll(".font-family-toggle span")
  buttons.forEach((span) => {
    span.textContent = familyLabels[family]
  })
}

function cycleFontFamily() {
  // Get current family from attribute or localStorage
  let currentFamily = document.documentElement.getAttribute("font-family") as FontFamily | null
  if (!currentFamily || (currentFamily !== "default" && currentFamily !== "ya" && currentFamily !== "zhuan")) {
    currentFamily = getFontFamily()
  }
  
  const families: FontFamily[] = ["default", "ya", "zhuan"]
  const currentIndex = families.indexOf(currentFamily)
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % families.length
  const nextFamily = families[nextIndex]
  
  setFontFamily(nextFamily)
}

// Store handlers to prevent duplicate listeners
const buttonHandlers = new WeakMap<Element, () => void>()

function setupFontFamily() {
  // Apply saved font family
  const savedFamily = getFontFamily()
  setFontFamily(savedFamily)

  // Setup button listeners
  const buttons = document.querySelectorAll(".font-family-toggle")
  buttons.forEach((button) => {
    // Remove old handler if exists
    const oldHandler = buttonHandlers.get(button)
    if (oldHandler) {
      button.removeEventListener("click", oldHandler)
    }
    
    // Create and add new handler
    const handler = () => {
      cycleFontFamily()
    }
    button.addEventListener("click", handler)
    buttonHandlers.set(button, handler)
    
    // @ts-ignore
    if (window.addCleanup) {
      // @ts-ignore
      window.addCleanup(() => {
        button.removeEventListener("click", handler)
        buttonHandlers.delete(button)
      })
    }
  })
}

// Apply font family immediately (before DOM loaded)
const savedFamily = getFontFamily()
setFontFamily(savedFamily)

// Setup event listeners when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupFontFamily)
} else {
  // DOM already loaded, but buttons might not exist yet
  // Use a small delay to ensure buttons are rendered
  setTimeout(setupFontFamily, 0)
}

// Re-setup on navigation (for SPA)
document.addEventListener("nav", () => {
  // Use setTimeout to ensure DOM is updated after navigation
  setTimeout(setupFontFamily, 0)
})

