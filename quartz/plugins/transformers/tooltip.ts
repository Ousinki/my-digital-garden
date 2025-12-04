import { QuartzTransformerPlugin } from "../types"
import { JSResource, CSSResource } from "../../util/resources"
// @ts-ignore
import tooltipScript from "../../components/scripts/tooltip.inline"
import tooltipStyle from "../../components/styles/tooltip.inline.scss"

export const Tooltip: QuartzTransformerPlugin = () => {
  return {
    name: "Tooltip",
    externalResources() {
      return {
        js: [
          {
            script: tooltipScript,
            loadTime: "afterDOMReady",
            contentType: "inline",
          },
        ],
        css: [
          {
            content: tooltipStyle,
            inline: true,
          },
        ],
      }
    },
  }
}

