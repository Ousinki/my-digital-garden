import { QuartzTransformerPlugin } from "../types"
import { Root } from "mdast"
import { ReplaceFunction, findAndReplace as mdastFindReplace } from "mdast-util-find-and-replace"
import { PluggableList } from "unified"
import { JSResource, CSSResource } from "../../util/resources"
// @ts-ignore
import hoverRevealScript from "../../components/scripts/hoverReveal.inline"
import hoverRevealStyle from "../../components/styles/hoverReveal.inline.scss"

// 修改正则表达式以支持包含 HTML 标签的内容
// 匹配 [内容]{注释}，其中内容可以包含 HTML 标签（如 <ruby>）
const hoverRevealRegex = /\[((?:[^\[\]]|<[^>]*>)+?)\]\{([^\}]+?)\}/gs

export const HoverReveal: QuartzTransformerPlugin = () => {
  return {
    name: "HoverReveal",
    textTransform(_ctx, src) {
      // 在文本阶段处理，这样可以匹配包含 HTML 标签的内容
      return src.replace(hoverRevealRegex, (match, visibleText, tooltipText) => {
        // 不转义 visibleText，允许 HTML 标签（如 ruby）正常渲染
        // 但需要转义 tooltipText 以防止 XSS
        return `<span class="hover-reveal" contenteditable="false"><span>${visibleText}</span><span class="hover-reveal-tooltip" data-visible-text="${escapeHtml(visibleText)}" data-tooltip-text="${escapeHtml(tooltipText)}"><span dir="auto">${escapeHtml(tooltipText)}</span></span></span>`
      })
    },
    markdownPlugins() {
      const plugins: PluggableList = []
      
      plugins.push(() => {
        return (tree: Root) => {
          const replacements: [RegExp, string | ReplaceFunction][] = []
          
          replacements.push([
            hoverRevealRegex,
            (_value: string, visibleText: string, tooltipText: string) => {
              // 不转义 visibleText，允许 HTML 标签（如 ruby）正常渲染
              // 但需要转义 tooltipText 以防止 XSS
              return {
                type: "html",
                value: `<span class="hover-reveal" contenteditable="false"><span>${visibleText}</span><span class="hover-reveal-tooltip" data-visible-text="${escapeHtml(visibleText)}" data-tooltip-text="${escapeHtml(tooltipText)}"><span dir="auto">${escapeHtml(tooltipText)}</span></span></span>`,
              }
            },
          ])
          
          mdastFindReplace(tree, replacements)
        }
      })
      
      return plugins
    },
    externalResources() {
      return {
        js: [
          {
            script: hoverRevealScript,
            loadTime: "afterDOMReady",
            contentType: "inline",
          },
        ],
        css: [
          {
            content: hoverRevealStyle,
            inline: true,
          },
        ],
      }
    },
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

