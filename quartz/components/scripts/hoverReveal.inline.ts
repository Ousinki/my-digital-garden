function setupHoverReveal() {
  const containers = document.querySelectorAll(
    ".hover-reveal"
  ) as NodeListOf<HTMLElement>

  const cleanupFns: Array<() => void> = []

  containers.forEach((container) => {
    const hoverElement = container.querySelector("span:first-child") as HTMLElement
    const tooltip = container.querySelector(".hover-reveal-tooltip") as HTMLElement

    if (!hoverElement || !tooltip) return

    const updateTooltipPosition = () => {
      // 等待内容渲染完成
      setTimeout(() => {
        const tooltipRect = tooltip.getBoundingClientRect()
        if (tooltipRect.width === 0) return

        // 获取视口边界
        const viewportLeft = 0
        const viewportRight = window.innerWidth
        const viewportTop = 0
        const viewportBottom = window.innerHeight

        // 获取触发元素的边界
        const triggerRect = hoverElement.getBoundingClientRect()

        // 重置位置样式
        tooltip.style.left = "50%"
        tooltip.style.right = "auto"
        tooltip.style.transform = "translateX(-50%)"
        tooltip.style.top = "auto"
        tooltip.style.bottom = "100%"

        // 重新获取悬浮窗位置
        const currentRect = tooltip.getBoundingClientRect()

        // 水平位置调整
        if (currentRect.left < viewportLeft) {
          tooltip.style.left = "0"
          tooltip.style.transform = "translateX(0)"
        } else if (currentRect.right > viewportRight) {
          tooltip.style.left = "auto"
          tooltip.style.right = "0"
          tooltip.style.transform = "translateX(0)"
        }

        // 垂直位置调整
        if (currentRect.top < viewportTop) {
          tooltip.style.top = "100%"
          tooltip.style.bottom = "auto"
        }

        // 最终检查，确保悬浮窗完全在视口内
        const finalRect = tooltip.getBoundingClientRect()
        if (finalRect.left < viewportLeft) {
          tooltip.style.left = "0"
          tooltip.style.transform = "translateX(0)"
        }
        if (finalRect.right > viewportRight) {
          tooltip.style.left = "auto"
          tooltip.style.right = "0"
          tooltip.style.transform = "translateX(0)"
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
    cleanupFns.push(() => {
      container.removeEventListener("mouseenter", mouseEnterHandler)
      container.removeEventListener("mouseleave", mouseLeaveHandler)
      window.removeEventListener("resize", resizeHandler)
    })
  })

  // 注册清理函数
  if (window.addCleanup) {
    cleanupFns.forEach((fn) => window.addCleanup(fn))
  }
}

// 初始加载时执行
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupHoverReveal)
} else {
  setupHoverReveal()
}

// 导航时也执行
document.addEventListener("nav", setupHoverReveal)

