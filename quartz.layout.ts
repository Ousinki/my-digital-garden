import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/Ousinki/my-digital-garden",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta({
      dateDisplay: true,
      readingTime: {
        enabled: true,
        wordsPerMinute: 200,
      },
    }),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      direction: "row",
      gap: "0.5rem",
      components: [
        { Component: Component.Search(), grow: true, align: "center" },
        { Component: Component.Darkmode(), shrink: false, align: "center" },
        { Component: Component.ReaderMode(), shrink: false, align: "center" },
        { Component: Component.FontSizeToggle(), shrink: false, align: "center" },
        { Component: Component.FontFamilyToggle(), shrink: false, align: "center" },
      ],
    }),
    Component.DesktopOnly(Component.Explorer()),
  ],
  right: [
    // Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
    // Component.RecentNotes(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      direction: "row",
      gap: "0.5rem",
      components: [
        { Component: Component.Search(), grow: true, align: "center" },
        { Component: Component.Darkmode(), shrink: false, align: "center" },
        { Component: Component.ReaderMode(), shrink: false, align: "center" },
        { Component: Component.FontSizeToggle(), shrink: false, align: "center" },
        { Component: Component.FontFamilyToggle(), shrink: false, align: "center" },
      ],
    }),
    Component.DesktopOnly(Component.Explorer()),
  ],
  right: [],
}
