import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// --- CONFIGURATION START ---

// Define the Explorer component ONCE here to ensure consistency across all pages
const explorerComponent = Component.Explorer({
  title: "Contents",
  // FIXED: Changed to 'true' so folders stay open when navigating
  useSavedState: true, 
  // FIXED FILTER FUNCTION
  filterFn: (node) => {
    // list of folders to hide (all lowercase)
    const omit = new Set(["glossary", "tags"])
    // check if the folder name (converted to lowercase) is in the omit list
    return !omit.has(node.name.toLowerCase())
  },
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
})

// --- CONFIGURATION END ---

// 1. SHARED COMPONENTS
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      // Add your links here
    },
  }),
}

// 2. HOME PAGE LAYOUT
export const defaultHomePageLayout: PageLayout = {
  beforeBody: [
    Component.ArticleTitle(),
    Component.ContentMeta(),
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
    Component.HomeLink(), 
    explorerComponent, // <--- Using the unified explorer here
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// 3. CONTENT PAGE LAYOUT (Single Notes)
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
    Component.HomeLink(),
    explorerComponent, // <--- Using the unified explorer here
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// 4. LIST PAGE LAYOUT (Folders/Tags)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(), 
    Component.ArticleTitle(),
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
    Component.HomeLink(),
    explorerComponent, // <--- Using the unified explorer here
  ],
  right: [],
  afterBody: [],
}
