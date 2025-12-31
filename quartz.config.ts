import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Platform Tools and Platform Power",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    // ✅ This is correct. Do not change it.
    baseUrl: "mahetajik.github.io/platform-methods",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Libre Baskerville",
        body: "Lato",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#f7f4ed",
          lightgray: "#e5e5e5",
          gray: "#000000",
          darkgray: "#000000",
          dark: "#101419",
          secondary: "#1a3a6e",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#fff23688",
        },
        darkMode: {
          light: "#f7f4ed",
          lightgray: "#e5e5e5",
          gray: "#000000",
          darkgray: "#000000",
          dark: "#101419",
          secondary: "#1a3a6e",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#fff23688",
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
    filters: [
      // ⬇️ COMMENTED OUT TO FIX 404 ERRORS
      // If a file is accidentally marked as draft, this hides it.
      // Disabling this forces all files to show up.
      // Plugin.RemoveDrafts() 
    ],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage({
        sort: (f1, f2) => {
          const aIsFolder = f1.filePath?.endsWith("index.md")
          const bIsFolder = f2.filePath?.endsWith("index.md")
          if (!aIsFolder && bIsFolder) return -1
          if (aIsFolder && !bIsFolder) return 1
          const aTitle = f1.frontmatter?.title || f1.slug || ""
          const bTitle = f2.frontmatter?.title || f2.slug || ""
          return aTitle.localeCompare(bTitle, undefined, {
            numeric: true,
            sensitivity: "base",
          })
        },
      }),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
