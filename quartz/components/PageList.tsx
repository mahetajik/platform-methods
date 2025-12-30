import { resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { i18n } from "../i18n"

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
