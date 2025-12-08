const RUBY_SWAPPED_KEY = "quartz-ruby-swapped"
const RUBY_HIDDEN_KEY = "quartz-ruby-hidden"

function getRubySwapped(): boolean {
  return localStorage.getItem(RUBY_SWAPPED_KEY) === "true"
}

function getRubyHidden(): boolean {
  return localStorage.getItem(RUBY_HIDDEN_KEY) === "true"
}

function setRubySwapped(swapped: boolean) {
  localStorage.setItem(RUBY_SWAPPED_KEY, swapped.toString())
  document.documentElement.setAttribute("ruby-swapped", swapped.toString())
}

function setRubyHidden(hidden: boolean) {
  localStorage.setItem(RUBY_HIDDEN_KEY, hidden.toString())
  document.documentElement.setAttribute("ruby-hidden", hidden.toString())
}

// 切换 Ruby 标签中原文和上标的位置
function swapRubyContentAdvanced() {
  const rubies = document.querySelectorAll("ruby")
  rubies.forEach((ruby) => {
    const rt = ruby.querySelector("rt")
    if (!rt) return

    // 获取所有子节点（除了 rt）
    const mainNodes: Node[] = []
    Array.from(ruby.childNodes).forEach((node) => {
      if (node !== rt) {
        mainNodes.push(node)
      }
    })

    // 保存 rt 的内容（包括 HTML）
    const rtContent = rt.innerHTML

    // 保存主内容的 HTML
    const tempDiv = document.createElement("div")
    mainNodes.forEach((node) => {
      tempDiv.appendChild(node.cloneNode(true))
    })
    const mainContent = tempDiv.innerHTML

    // 清空 Ruby 标签
    ruby.innerHTML = ""

    // 将 rt 的内容作为新的主内容
    const tempMain = document.createElement("div")
    tempMain.innerHTML = rtContent
    while (tempMain.firstChild) {
      ruby.appendChild(tempMain.firstChild)
    }

    // 创建新的 rt，包含原来的主内容
    const newRt = document.createElement("rt")
    newRt.innerHTML = mainContent
    ruby.appendChild(newRt)
  })
}

// 隐藏/显示 Ruby 上标
function toggleRubyHidden() {
  const hidden = getRubyHidden()
  setRubyHidden(!hidden)
  applyRubyHidden(!hidden)
}

function applyRubyHidden(hidden: boolean) {
  const rubies = document.querySelectorAll("ruby")
  rubies.forEach((ruby) => {
    const rt = ruby.querySelector("rt")
    if (rt) {
      if (hidden) {
        rt.style.display = "none"
      } else {
        rt.style.display = ""
      }
    }
  })
}

// 执行切换操作
function performSwap() {
  const currentSwapped = getRubySwapped()
  const currentHidden = getRubyHidden()
  setRubySwapped(!currentSwapped)
  swapRubyContentAdvanced()
  // 如果之前是隐藏状态，切换后也要保持隐藏状态
  if (currentHidden) {
    applyRubyHidden(true)
  }
  // 重新初始化 HoverReveal
  setTimeout(() => {
    // @ts-ignore
    if (typeof window !== "undefined" && window.setupHoverReveal) {
      // @ts-ignore
      window.setupHoverReveal()
    } else {
      // 如果 setupHoverReveal 不可用，触发 nav 事件
      const navEvent = new CustomEvent("nav", { 
        detail: { url: window.location.href },
        bubbles: true 
      })
      document.dispatchEvent(navEvent)
    }
  }, 50)
}

// 执行隐藏操作
function performHide() {
  toggleRubyHidden()
}

// 全局按钮点击处理器（使用事件委托）
let buttonClickHandler: ((e: MouseEvent) => void) | null = null

function setupButtonHandlers() {
  // 如果已经添加过监听器，先移除
  if (buttonClickHandler) {
    document.removeEventListener("click", buttonClickHandler, true)
  }

  // 创建新的处理器
  buttonClickHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target) return
    
    // 检查点击的是按钮本身还是按钮内的元素（包括 SVG）
    const button = target.closest(".ruby-swap") || target.closest(".ruby-hide")
    if (!button) return
    
    if (button.classList.contains("ruby-swap")) {
      e.preventDefault()
      e.stopPropagation()
      performSwap()
    } else if (button.classList.contains("ruby-hide")) {
      e.preventDefault()
      e.stopPropagation()
      performHide()
    }
  }

  // 在 document 上使用事件委托
  document.addEventListener("click", buttonClickHandler, true)
  // @ts-ignore
  if (window.addCleanup) {
    // @ts-ignore
    window.addCleanup(() => {
      if (buttonClickHandler) {
        document.removeEventListener("click", buttonClickHandler, true)
      }
    })
  }
}

function setupRubyControls() {
  // 应用保存的状态
  const swapped = getRubySwapped()
  const hidden = getRubyHidden()
  
  setRubySwapped(swapped)
  setRubyHidden(hidden)

  // 如果已交换，应用交换
  if (swapped) {
    // 使用 setTimeout 确保 DOM 已完全加载
    setTimeout(() => {
      swapRubyContentAdvanced()
      // 如果已隐藏，重新应用隐藏状态
      if (hidden) {
        applyRubyHidden(true)
      }
    }, 0)
  } else {
    // 如果已隐藏，应用隐藏
    if (hidden) {
      applyRubyHidden(true)
    }
  }

  // 设置按钮事件处理器
  setupButtonHandlers()
}

// 初始设置（在 DOM 加载前执行基本设置）
const userPrefSwapped = localStorage.getItem(RUBY_SWAPPED_KEY) === "true"
const userPrefHidden = localStorage.getItem(RUBY_HIDDEN_KEY) === "true"
if (userPrefSwapped) {
  document.documentElement.setAttribute("ruby-swapped", "true")
}
if (userPrefHidden) {
  document.documentElement.setAttribute("ruby-hidden", "true")
}

// 在导航事件中设置所有功能
document.addEventListener("nav", () => {
  setupRubyControls()

  // 键盘事件处理器
  function keyboardHandler(e: KeyboardEvent) {
    // 检查是否在可编辑元素中（输入框、文本域等）
    const target = e.target as HTMLElement
    if (!target) return
    
    const isEditable = target.tagName === "INPUT" || 
                      target.tagName === "TEXTAREA" || 
                      target.isContentEditable ||
                      (target.closest && target.closest("input, textarea, [contenteditable]"))
    
    // 如果在可编辑元素中，不触发快捷键
    if (isEditable) {
      return
    }

    // Option+Q (Alt+Q) 切换
    // 在 macOS 上，Option 键对应 altKey
    // 使用 e.code 而不是 e.key，因为 Option 键会改变 e.key 的值（如 Option+Q 会变成 "∑"）
    const isOptionKey = e.altKey || e.getModifierState?.("Alt")
    
    if (isOptionKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      // 使用 e.code 来检测物理按键，而不是输入字符
      // e.code 在按下 Q 键时是 "KeyQ"，按下 W 键时是 "KeyW"
      if (e.code === "KeyQ") {
        e.preventDefault()
        e.stopPropagation()
        performSwap()
        return
      }
      
      // Option+W (Alt+W) 隐藏
      if (e.code === "KeyW") {
        e.preventDefault()
        e.stopPropagation()
        performHide()
        return
      }
    }
  }

  // 添加键盘事件监听器
  document.addEventListener("keydown", keyboardHandler, true)
  // @ts-ignore
  if (window.addCleanup) {
    // @ts-ignore
    window.addCleanup(() => document.removeEventListener("keydown", keyboardHandler, true))
  }
})

// 初始调用一次（用于首次加载）
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setupRubyControls()
  })
} else {
  setupRubyControls()
}

