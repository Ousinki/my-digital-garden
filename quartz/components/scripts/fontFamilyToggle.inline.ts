type FontFamily = "default" | "songti" | "kaiti"

const FONT_FAMILY_KEY = "font-family"
const DEFAULT_FONT_FAMILY: FontFamily = "default"

const fontFamilies: Record<FontFamily, string> = {
  default: "", // 使用默认字体（--bodyFont）
  songti: "STSong, SimSun, 宋体, Songti SC, serif", // 宋体（支持 macOS 和 Windows）
  kaiti: "KaiTi, 楷体, KaiTi_GB2312, STKaiti, serif", // 楷体（支持 macOS 和 Windows）
}

function getFontFamily(): FontFamily {
  const saved = localStorage.getItem(FONT_FAMILY_KEY)
  if (saved === "default" || saved === "songti" || saved === "kaiti") {
    return saved as FontFamily
  }
  return DEFAULT_FONT_FAMILY
}

function setFontFamily(family: FontFamily) {
  const fontFamily = fontFamilies[family]
  if (fontFamily) {
    // 设置自定义字体变量
    document.documentElement.style.setProperty("--custom-body-font", fontFamily)
  } else {
    // 移除自定义字体，使用默认字体
    document.documentElement.style.removeProperty("--custom-body-font")
  }
  document.documentElement.setAttribute("font-family", family)
  localStorage.setItem(FONT_FAMILY_KEY, family)
}

function cycleFontFamily() {
  const currentFamily = (document.documentElement.getAttribute("font-family") || DEFAULT_FONT_FAMILY) as FontFamily
  const families: FontFamily[] = ["default", "songti", "kaiti"]
  const currentIndex = families.indexOf(currentFamily)
  const nextIndex = (currentIndex + 1) % families.length
  const nextFamily = families[nextIndex]
  setFontFamily(nextFamily)
}

function setupFontFamily() {
  // Apply saved font family
  const savedFamily = getFontFamily()
  setFontFamily(savedFamily)

  // Setup button listeners
  const buttons = document.querySelectorAll(".font-family-toggle")
  buttons.forEach((button) => {
    const handler = () => cycleFontFamily()
    button.addEventListener("click", handler)
    // @ts-ignore
    if (window.addCleanup) {
      // @ts-ignore
      window.addCleanup(() => button.removeEventListener("click", handler))
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

