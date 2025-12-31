import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// --- CONFIGURATION START ---

// Define the Explorer component ONCE here to ensure consistency across all pages
const explorerComponent = Component.Explorer({
  title: "Contents",
  
  // Set to false first to unfreeze your sidebar. 
  // You can try setting it to true later, but clear your browser cache if you do!
  useSavedState: false, 
  
  // FIXED FILTER FUNCTION
  filterFn: (node) => {
    // 1. Safety check: ensure name exists
    const name = node.name ? node.name.toLowerCase() : ""
    
    // 2. Hide exact matches for folder names
    if (name === "glossary" || name === "tags") return false
    
    // 3. Hide file matches (e.g., "glossary.md")
    if (name === "glossary.md") return false
    
    return true
  },
  
  // FIXED SORT FUNCTION (Prevents crashes)
  sortFn: (a, b) => {
    const aIsFolder = a.children.length > 0
    const bIsFolder = b.children.length > 0
    
    if (!aIsFolder && bIsFolder) return -1
    if (aIsFolder && !bIsFolder) return 1
    
    // Safety check: use displayName, fallback to name, fallback to empty string
    // This prevents the "Nothing opening" bug
    const aName = a.displayName || a.name || ""
    const bName = b.displayName || b.name || ""
    
    return aName.localeCompare(bName, undefined, {
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
