// @ts-ignore
import rubyControlsScript from "./scripts/rubyControls.inline"
import styles from "./styles/rubyControls.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const RubyControls: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div class={classNames(displayClass, "ruby-controls")}>
      <button class="ruby-swap" aria-label="切换 Ruby 原文与上标位置" title="切换 Ruby 原文与上标位置">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 3L4 7l4 4"></path>
          <path d="M4 7h16"></path>
          <path d="M16 21l4-4-4-4"></path>
          <path d="M20 17H4"></path>
        </svg>
      </button>
      <button class="ruby-hide" aria-label="隐藏 Ruby 上标" title="隐藏 Ruby 上标">
        <svg class="eye-open" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        <svg class="eye-closed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
      </button>
    </div>
  )
}

RubyControls.beforeDOMLoaded = rubyControlsScript
RubyControls.css = styles

export default (() => RubyControls) satisfies QuartzComponentConstructor

