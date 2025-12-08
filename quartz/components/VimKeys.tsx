// @ts-ignore
import vimKeysScript from "./scripts/vimKeys.inline"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const VimKeys: QuartzComponent = (_props: QuartzComponentProps) => {
  // 这个组件不需要渲染任何 UI，只需要加载脚本
  // 返回一个空的 div 占位符
  return <div style="display: none;" data-vim-keys="true"></div>
}

VimKeys.beforeDOMLoaded = vimKeysScript

export default (() => VimKeys) satisfies QuartzComponentConstructor

