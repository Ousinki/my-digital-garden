// @ts-ignore
import fontFamilyToggleScript from "./scripts/fontFamilyToggle.inline"
import styles from "./styles/fontFamilyToggle.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const FontFamilyToggle: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <button class={classNames(displayClass, "font-family-toggle")} aria-label="切换字体">
      <span>Aa</span>
    </button>
  )
}

FontFamilyToggle.beforeDOMLoaded = fontFamilyToggleScript
FontFamilyToggle.css = styles

export default (() => FontFamilyToggle) satisfies QuartzComponentConstructor

