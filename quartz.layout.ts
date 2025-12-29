import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      "Kaushar Mahetaji": "https://kausharmahetaji.com",
      "Discord Community": "",
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
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    // UPDATED: Title is "Contents", Files sort before Folders
    Component.Explorer({
      title: "Contents",
      sortFn: (a, b) => {
        if ((!a.file && !b.file) || (a.file && b.file)) {
          // If both are files OR both are folders, sort alphabetically
          return a.displayName.localeCompare(b.displayName)
        }
        if (a.file && !b.file) {
          return -1 // File comes first
        } else {
          return 1 // Folder comes second
        }
      },
    }),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    // UPDATED: Title is "Contents", Files sort before Folders
    Component.Explorer({
      title: "Contents",
      sortFn: (a, b) => {
        if ((!a.file && !b.file) || (a.file && b.file)) {
          // If both are files OR both are folders, sort alphabetically
          return a.displayName.localeCompare(b.displayName)
        }
        if (a.file && !b.file) {
          return -1 // File comes first
        } else {
          return 1 // Folder comes second
        }
      },
    }),
  ],
  right: [],
}
