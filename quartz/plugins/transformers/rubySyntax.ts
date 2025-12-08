import { QuartzTransformerPlugin } from "../types"
import { Root } from "mdast"
import { ReplaceFunction, findAndReplace as mdastFindReplace } from "mdast-util-find-and-replace"
import { PluggableList } from "unified"

// 匹配 [原文|上標]{註釋} 或 [原文|上標]
// 支持可选的 {註釋} 部分
// 注意：这个正则必须在 HoverReveal 之前运行，以避免冲突
// 匹配规则：必须包含 | 符号，且 | 前后都有内容
const rubySyntaxRegex = /\[([^|\[\]]+)\|([^\[\]]+)\](?:\{([^\}]*)\})?/g

export const RubySyntax: QuartzTransformerPlugin = () => {
  return {
    name: "RubySyntax",
    textTransform(_ctx, src) {
      // 在文本阶段处理
      // [原文|上標] → <ruby>原文<rt>上標</rt></ruby>
      // [原文|上標]{註釋} → [<ruby>原文<rt>上標</rt></ruby>]{註釋} (让 HoverReveal 处理注释)
      return src.replace(rubySyntaxRegex, (match, baseText, rtText, comment) => {
        // 转义 HTML 以防止 XSS，但保留 ruby 标签结构
        const escapedBase = escapeHtml(baseText)
        const escapedRt = escapeHtml(rtText)
        
        const rubyHtml = `<ruby>${escapedBase}<rt>${escapedRt}</rt></ruby>`
        
        // 如果有注释，外面再包一层 [ruby]{注释} 让 HoverReveal 处理
        if (comment) {
          return `[${rubyHtml}]{${comment}}`
        }
        
        // 没有注释，直接返回 ruby 标签
        return rubyHtml
      })
    },
    markdownPlugins() {
      const plugins: PluggableList = []
      
      plugins.push(() => {
        return (tree: Root) => {
          const replacements: [RegExp, string | ReplaceFunction][] = []
          
          replacements.push([
            rubySyntaxRegex,
            (_value: string, baseText: string, rtText: string, comment?: string) => {
              // 转义 HTML 以防止 XSS
              const escapedBase = escapeHtml(baseText)
              const escapedRt = escapeHtml(rtText)
              
              const rubyHtml = `<ruby>${escapedBase}<rt>${escapedRt}</rt></ruby>`
              
              // 如果有注释，外面再包一层 [ruby]{注释} 让 HoverReveal 处理
              if (comment) {
                return {
                  type: "html",
                  value: `[${rubyHtml}]{${escapeHtml(comment)}}`,
                }
              }
              
              // 没有注释，直接返回 ruby 标签
              return {
                type: "html",
                value: rubyHtml,
              }
            },
          ])
          
          mdastFindReplace(tree, replacements)
        }
      })
      
      return plugins
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

