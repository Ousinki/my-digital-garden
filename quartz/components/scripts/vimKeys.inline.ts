// Vim 风格的快捷键
let vimKeyBuffer = ""
let vimKeyTimeout: number | null = null

function handleVimKeys(e: KeyboardEvent) {
  // 检查是否在可编辑元素中
  const target = e.target as HTMLElement
  if (!target) return
  
  const isEditable = target.tagName === "INPUT" || 
                    target.tagName === "TEXTAREA" || 
                    target.isContentEditable ||
                    (target.closest && target.closest("input, textarea, [contenteditable]"))
  
  // 如果在可编辑元素中，不触发快捷键
  if (isEditable) {
    vimKeyBuffer = ""
    return
  }

  // 清除之前的超时
  if (vimKeyTimeout) {
    clearTimeout(vimKeyTimeout)
  }

  const key = e.key.toLowerCase()
  const keyCode = e.code
  
  // 先处理 G (滚动到底部) - 检测 Shift+G 或大写 G
  // 只有当缓冲区为空时才处理 G，避免和 gg 冲突
  if (vimKeyBuffer === "" && keyCode === "KeyG" && (e.shiftKey || e.key === "G")) {
    e.preventDefault()
    e.stopPropagation()
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" })
    vimKeyBuffer = ""
    return
  }
  
  // 处理 gg (滚动到顶部) - 只处理小写 g
  if (key === "g" && !e.shiftKey && e.key === "g") {
    if (vimKeyBuffer === "g") {
      // 连续按两次 g
      e.preventDefault()
      e.stopPropagation()
      window.scrollTo({ top: 0, behavior: "smooth" })
      vimKeyBuffer = ""
      return
    } else {
      // 第一次按 g
      vimKeyBuffer = "g"
      // 设置超时，如果 1 秒内没有继续输入，重置缓冲区
      vimKeyTimeout = window.setTimeout(() => {
        vimKeyBuffer = ""
      }, 1000)
      return
    }
  }

  // 如果按键不是 'g'，重置缓冲区
  if (key !== "g") {
    vimKeyBuffer = ""
  }
}

function setupVimKeys() {
  document.addEventListener("keydown", handleVimKeys, true)
  // @ts-ignore
  if (window.addCleanup) {
    // @ts-ignore
    window.addCleanup(() => {
      document.removeEventListener("keydown", handleVimKeys, true)
    })
  }
}

// 在导航事件中设置
document.addEventListener("nav", () => {
  vimKeyBuffer = ""
  if (vimKeyTimeout) {
    clearTimeout(vimKeyTimeout)
    vimKeyTimeout = null
  }
  setupVimKeys()
})

// 初始设置
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setupVimKeys()
  })
} else {
  setupVimKeys()
}

// 也尝试立即设置（以防万一）
try {
  setupVimKeys()
} catch (e) {
  // 静默失败，将在 DOM 就绪后设置
}

