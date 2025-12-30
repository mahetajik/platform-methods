import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  // Safe access to config and locale, with fallback for robustness
  const title = cfg?.pageTitle ?? i18n(cfg?.locale ?? "en-US").propertyDefaults.title
  // Safe access to slug, with fallback for robustness
  const baseDir = pathToRoot(fileData.slug ?? "")
  
  return (
    // This div is the single root element returned by the component
    <div class={classNames(displayClass, "page-title")}>
      <a href={baseDir}>
        <h1>{title}</h1>
        <p class="page-subtitle">Data and Methods</p>
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
  color: var(--dark); /* Use var(--dark) for consistent text color with theme */
}
.page-title h1 {
  font-size: 1.75rem;
  margin: 0;
  line-height: 1.2;
  font-weight: 700;
  font-family: var(--headerFont); /* Ensures it uses your defined header font */
}
.page-subtitle {
  font-size: 1.1rem; /* Adjusted to 1.1rem as per your last request */
  margin: 0.1rem 0 0 0;
  color: #777777; /* Specific grey color for consistency across themes */
  font-weight: 400;
  font-style: italic;
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
