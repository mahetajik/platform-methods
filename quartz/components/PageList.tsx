import { FullSlug, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { Date, getDate } from "./Date"
import { QuartzComponent, QuartzComponentProps } from "./types"
import { GlobalConfiguration } from "../cfg"

export type SortFn = (f1: QuartzPluginData, f2: QuartzPluginData) => number

interface PageListOptions {
  limit?: number
  sort?: SortFn
}

export default ((opts?: PageListOptions) => {
  function PageList({ fileData, allFiles, cfg }: QuartzComponentProps) {
    let list = allFiles.filter((file) => {
      return file.slug !== fileData.slug
    })

    if (opts?.limit) {
      list = list.slice(0, opts.limit)
    }

    if (opts?.sort) {
      list.sort(opts.sort)
    }

    return (
      <ul class="section-ul">
        {list.map((page) => {
          const title = page.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title
          const tags = page.frontmatter?.tags ?? []

          return (
            <li class="section-li">
              <div class="section">
                {/* UPDATED: Removed the Date component here */}
                <div class="desc">
                  <h3>
                    <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal">
                      {title}
                    </a>
                  </h3>
                </div>
                {/* Only render tags if they exist */}
                {tags.length > 0 && (
                  <ul class="meta tags">
                    {tags.map((tag) => (
                      <li>
                        <a
                          class="internal tag-link"
                          href={resolveRelative(fileData.slug!, `tags/${tag}`)}
                        >
                          #{tag}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    )
  }

  PageList.css = `
  .section h3 {
    margin: 0;
  }
  .section > .tags {
    margin: 0;
  }
  `
  return PageList
}) satisfies QuartzComponent
