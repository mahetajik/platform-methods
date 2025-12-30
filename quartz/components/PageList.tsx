import { FullSlug, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { Date, getDate } from "./Date"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { GlobalConfiguration } from "../cfg"
import { i18n } from "../i18n"

export type SortFn = (f1: QuartzPluginData, f2: QuartzPluginData) => number

export function byDateAndAlphabetical(cfg: GlobalConfiguration): SortFn {
  return (f1, f2) => {
    if (f1.dates && f2.dates) {
      // sort descending
      return getDate(cfg, f2)!.getTime() - getDate(cfg, f1)!.getTime()
    } else if (f1.dates && !f2.dates) {
      // prioritize files with dates
      return -1
    } else if (!f1.dates && f2.dates) {
      return 1
    }

    // otherwise, sort lexographically by title
    const f1Title = f1.frontmatter?.title.toLowerCase() ?? ""
    const f2Title = f2.frontmatter?.title.toLowerCase() ?? ""
    return f1Title.localeCompare(f2Title)
  }
}

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
    } else {
      list.sort(byDateAndAlphabetical(cfg))
    }

    return (
      <ul class="section-ul">
        {list.map((page) => {
          const title = page.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title
          const tags = page.frontmatter?.tags ?? []

          return (
            <li class="section-li">
              <div class="section">
                {/* DATE COMPONENT REMOVED FROM HERE */}
                <div class="desc">
                  <h3>
                    <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal">
                      {title}
                    </a>
                  </h3>
                </div>
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
}) satisfies QuartzComponentConstructor
