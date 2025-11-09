// @ts-ignore
import fontSizeToggleScript from "./scripts/fontSizeToggle.inline"
import styles from "./styles/fontSizeToggle.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const FontSizeToggle: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <button class={classNames(displayClass, "font-size-toggle")} aria-label="切换字号">
      <span>A</span>
    </button>
  )
}

FontSizeToggle.beforeDOMLoaded = fontSizeToggleScript
FontSizeToggle.css = styles

export default (() => FontSizeToggle) satisfies QuartzComponentConstructor

