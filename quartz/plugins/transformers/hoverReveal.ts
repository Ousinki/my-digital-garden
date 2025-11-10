import { QuartzTransformerPlugin } from "../types"
import { Root } from "mdast"
import { ReplaceFunction, findAndReplace as mdastFindReplace } from "mdast-util-find-and-replace"
import { PluggableList } from "unified"
import { JSResource, CSSResource } from "../../util/resources"
// @ts-ignore
import hoverRevealScript from "../../components/scripts/hoverReveal.inline"
import hoverRevealStyle from "../../components/styles/hoverReveal.inline.scss"

const hoverRevealRegex = /\[([^\[\]]+?)\]\{([^\}]+?)\}/gs

export const HoverReveal: QuartzTransformerPlugin = () => {
  return {
    name: "HoverReveal",
    markdownPlugins() {
      const plugins: PluggableList = []
      
      plugins.push(() => {
        return (tree: Root) => {
          const replacements: [RegExp, string | ReplaceFunction][] = []
          
          replacements.push([
            hoverRevealRegex,
            (_value: string, visibleText: string, tooltipText: string) => {
              return {
                type: "html",
                value: `<span class="hover-reveal" contenteditable="false"><span>${escapeHtml(visibleText)}</span><span class="hover-reveal-tooltip" data-visible-text="${escapeHtml(visibleText)}" data-tooltip-text="${escapeHtml(tooltipText)}"><span dir="auto">${escapeHtml(tooltipText)}</span></span></span>`,
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

