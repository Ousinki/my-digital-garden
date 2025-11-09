import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import path from "path" // <-- 1. (重要) 导入 'path' 模块

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "我的数字花园", // <-- 2. 修改了网站标题
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: null, // <-- 3. 关闭了默认的分析
    locale: "zh-CN", // <-- 4. 设置为中文
    baseUrl: "https://ousinki.github.io/my-digital-garden", // <-- 5. (关键) 你的 GitHub 仓库名
    
    // ⬇️ 6. (最关键的修改) ⬇️
    // Quartz 默认使用 "content" 目录，但我们可以通过命令行参数指定
    // 告诉 Quartz 要忽略什么（使用 glob 模式）
    ignorePatterns: [
      "private/**",
      "templates/**", 
      ".obsidian/**",
      "node_modules/**",
      "public/**", // build output directory (lowercase)
      ".git/**",
      "attachment/**",
      "BOOKs/**",
      "Clippings/**",
      "Dict/**",
      "English/**",
      "HUmuif/**",
      "kkyj/**",
      "Politics/**",
      "Templates/**",
      "_resources/**",
      "quartz/**",
      "scripts/**"
      // content/** - DO NOT ignore content directory, it's the source of markdown files
      // public directory (lowercase) is our content source - don't ignore it
    ],
    // ⬆️ -------------------- ⬆️

    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#faf8f8",
          lightgray: "#e5e5e5",
          gray: "#b8b8b8",
          darkgray: "#4e4e4e",
          dark: "#2b2b2b",
          secondary: "#284b63",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#fff23688",
        },
        darkMode: {
          light: "#161618",
          lightgray: "#393639",
          gray: "#646464",
          darkgray: "#d4d4d4",
          dark: "#ebebec",
          secondary: "#7b97aa",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#b3aa0288",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      // Plugin.CustomOgImages(),
    ],
  },
}

export default config
