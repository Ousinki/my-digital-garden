// 存储所有清理函数，确保在重新初始化前能清理
let globalCleanupFns: Array<() => void> = []

function setupHoverReveal() {
  // 先清理之前的监听器
  globalCleanupFns.forEach((fn) => fn())
  globalCleanupFns = []

  const containers = document.querySelectorAll(
    ".hover-reveal"
  ) as NodeListOf<HTMLElement>

  containers.forEach((container) => {
    const hoverElement = container.querySelector("span:first-child") as HTMLElement
    const tooltip = container.querySelector(".hover-reveal-tooltip") as HTMLElement

    if (!hoverElement || !tooltip) return

    // 确保 tooltip 初始状态正确
    tooltip.style.visibility = "hidden"
    tooltip.style.opacity = "0"

    const updateTooltipPosition = () => {
      // 等待内容渲染完成
      setTimeout(() => {
        const tooltipRect = tooltip.getBoundingClientRect()
        if (tooltipRect.width === 0) return

        // 获取视口边界
        const viewportWidth = window.innerWidth
        const padding = 10 // 保持 10px 边距

        // 获取触发元素和容器的边界
        const triggerRect = hoverElement.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        
        // 1. 计算理想的水平位置 (居中对齐触发元素)
        // 目标视口坐标 left
        let targetLeft = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2)
        
        // 2. 限制在视口内
        const minLeft = padding
        const maxLeft = viewportWidth - tooltipRect.width - padding
        
        // 优先保证左边不溢出，如果宽度过大，右边可能会溢出（但 CSS max-width 应该防止了这种情况）
        // 使用 Math.min/max 确保在 minLeft > maxLeft 时也能合理表现（优先左对齐）
        if (targetLeft < minLeft) targetLeft = minLeft
        if (targetLeft > maxLeft) targetLeft = maxLeft
        
        // 3. 转换为相对坐标 (相对于 container)
        const relativeLeft = targetLeft - containerRect.left
        
        // 应用水平位置
        tooltip.style.left = `${relativeLeft}px`
        tooltip.style.right = "auto"
        tooltip.style.transform = "none" // 移除 translateX(-50%)
        
        // 4. 垂直位置调整
        // 默认 bottom: 100% (上方). 如果上方空间不足，放下方。
        if (containerRect.top - tooltipRect.height < padding) {
          tooltip.style.top = "100%"
          tooltip.style.bottom = "auto"
        } else {
          tooltip.style.top = "auto"
          tooltip.style.bottom = "100%"
        }
      }, 10)
    }

    const mouseEnterHandler = () => {
      tooltip.style.visibility = "visible"
      tooltip.style.opacity = "1"
      updateTooltipPosition()
    }

    const mouseLeaveHandler = (e: MouseEvent) => {
      const relatedTarget = e.relatedTarget as Node
      // 如果鼠标移动到容器内的其他元素（包括 tooltip），不隐藏
      if (relatedTarget && container.contains(relatedTarget)) {
        return
      }

      tooltip.style.visibility = "hidden"
      tooltip.style.opacity = "0"

      setTimeout(() => {
        tooltip.style.left = "50%"
        tooltip.style.right = "auto"
        tooltip.style.transform = "translateX(-50%)"
        tooltip.style.top = "auto"
        tooltip.style.bottom = "100%"
      }, 200)
    }

    // 将事件绑定到整个容器，这样鼠标移动到 tooltip 上时也不会消失
    container.addEventListener("mouseenter", mouseEnterHandler)
    container.addEventListener("mouseleave", mouseLeaveHandler)

    // 监听窗口大小变化
    const resizeHandler = () => {
      if (tooltip.style.visibility === "visible" || tooltip.style.opacity === "1") {
        updateTooltipPosition()
      }
    }

    window.addEventListener("resize", resizeHandler)

    // 保存清理函数
    const cleanup = () => {
      container.removeEventListener("mouseenter", mouseEnterHandler)
      container.removeEventListener("mouseleave", mouseLeaveHandler)
      window.removeEventListener("resize", resizeHandler)
    }
    
    globalCleanupFns.push(cleanup)
    
    // 注册清理函数
    if (window.addCleanup) {
      window.addCleanup(cleanup)
    }
  })
}

// 初始加载时执行
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupHoverReveal)
} else {
  setupHoverReveal()
}

// 导航时也执行
document.addEventListener("nav", setupHoverReveal)

// 暴露到全局，供其他脚本调用
// @ts-ignore
if (typeof window !== "undefined") {
  // @ts-ignore
  window.setupHoverReveal = setupHoverReveal
}

