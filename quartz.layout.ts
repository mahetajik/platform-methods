import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
    //  "Kaushar Mahetaji": "https://kausharmahetaji.com",
    //  "Discord Community": "",
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
      ],
    }),
    Component.Explorer({
      title: "Contents",
      useSavedState: false,
      // FILTER: Hides "glossary" (lowercase) and "Glossary" (capitalized) from sidebar
      filterFn: (node) => !["glossary", "Glossary"].includes(node.name),
      sortFn: (a, b) => {
        const aIsFolder = a.children.length > 0
        const bIsFolder = b.children.length > 0
        if (!aIsFolder && bIsFolder) return -1
        if (aIsFolder && !bIsFolder) return 1
        return a.displayName.localeCompare(b.displayName, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      },
    }),
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(), 
    Component.ArticleTitle(),
    // Component.ContentMeta() <-- REMOVED (Safe for older versions)
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
      ],
    }),
    Component.Explorer({
      title: "Contents",
      useSavedState: false,
      // FILTER: Same filter as above
      filterFn: (node) => !["glossary", "Glossary"].includes(node.name),
      sortFn: (a, b) => {
        const aIsFolder = a.children.length > 0
        const bIsFolder = b.children.length > 0
        if (!aIsFolder && bIsFolder) return -1
        if (aIsFolder && !bIsFolder) return 1
        return a.displayName.localeCompare(b.displayName, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      },
    }),
  ],
  right: [],
  afterBody: [
    // REMOVED Component.PageList() here.
    // Quartz automatically renders the file list for folders using the "FolderContent" page type.
    // Adding it here manually causes the "duplicate list of everything" bug.
  ],
}
