import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg?.locale ?? "en-US").propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug ?? "")
  
  return (
    <div class={classNames(displayClass, "page-title")}>
      <a href={baseDir}>
        <h1>{title}</h1>
        <p class="page-subtitle">Frameworks, Data + Methods</p>
      </a>
    </div>
  )
}

PageTitle.css = `
.page-title {
  margin: 1rem 0;
}
.page-title a {
  text-decoration: none;
  color: var(--dark);
}
.page-title h1 {
  font-size: 1.75rem;
  margin: 0;
  line-height: 1.2;
  font-weight: 700;
  font-family: var(--headerFont);
}
.page-subtitle {
  font-size: 1.1rem;
  margin: 0.1rem 0 0 0;
  color: #444444; /* UPDATED: Darker grey */
  font-weight: 400;
  font-style: italic;
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
