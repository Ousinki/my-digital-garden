import { FilePath, joinSegments } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import fs from "fs"
import { resolve } from "path"

export const Katex: QuartzEmitterPlugin = () => ({
  name: "Katex",
  async *emit({ argv }) {
    // Get the path to katex in node_modules from project root
    const projectRoot = process.cwd()
    const katexPath = resolve(projectRoot, "node_modules/katex/dist")
    const katexContribPath = resolve(projectRoot, "node_modules/katex/dist/contrib")
    
    const outputKatexPath = joinSegments(argv.output, "static/katex")
    await fs.promises.mkdir(outputKatexPath, { recursive: true })
    
    // Copy katex.min.css
    const cssSrc = resolve(katexPath, "katex.min.css")
    const cssDest = joinSegments(outputKatexPath, "katex.min.css") as FilePath
    if (fs.existsSync(cssSrc)) {
      await fs.promises.copyFile(cssSrc, cssDest)
      yield cssDest
    }
    
    // Copy copy-tex.min.js
    const jsSrc = resolve(katexContribPath, "copy-tex.min.js")
    const jsDest = joinSegments(outputKatexPath, "copy-tex.min.js") as FilePath
    if (fs.existsSync(jsSrc)) {
      await fs.promises.copyFile(jsSrc, jsDest)
      yield jsDest
    }
  },
  async *partialEmit() {},
})

