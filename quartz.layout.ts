import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// --- CONFIGURATION START ---

// Define the Explorer component ONCE here with the aggressive filter
const explorerComponent = Component.Explorer({
  title: "Contents",
  useSavedState: false, 
  
  // NUCLEAR FILTER FUNCTION: Aggressively hides glossary
  filterFn: (node) => {
    // 1. Get all possible names (safe check with lowercase)
    const name = node.name?.toLowerCase() ?? ""
    const displayName = node.displayName?.toLowerCase() ?? ""
    const path = node.file?.slug?.toLowerCase() ?? ""

    // 2. Hide "tags"
    if (name === "tags") return false

    // 3. Hide "glossary" (checks Folder Name, Title, and URL Path)
    // This catches it even if the folder is named "folder" but titled "Glossary"
    if (name.includes("glossary") || 
        displayName.includes("glossary") || 
        path.includes("glossary")) {
      return false
    }
    
    return true
  },
  
  sortFn: (a, b) => {
    const aIsFolder = a.children.length > 0
    const bIsFolder = b.children.length > 0
    
    if (!aIsFolder && bIsFolder) return -1
    if (aIsFolder && !bIsFolder) return 1
    
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
      //"GitHub": "https://github.com/mahetajik/platform-methods",
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
    Component.HomeLink(), // ✅ Kept your custom component
    explorerComponent, 
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
    Component.HomeLink(), // ✅ Kept your custom component
    explorerComponent, 
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
    Component.HomeLink(), // ✅ Kept your custom component
    explorerComponent,
  ],
  right: [],
  afterBody: [],
}
