import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"

const HomeLink: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  return (
    <div class={displayClass}>
      <p style={{ margin: "0.5rem 0", fontWeight: "bold" }}>
        {/* Link to "index" but show text "About" */}
        <a href={resolveRelative(fileData.slug!, "index")} class="internal">
          About
        </a>
      </p>
    </div>
  )
}

export default (() => HomeLink) satisfies QuartzComponentConstructor
