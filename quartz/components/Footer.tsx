import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"
import { i18n } from "../i18n"

interface FooterOptions {
  links: Record<string, string>
}

export default ((opts?: FooterOptions) => {
  const Footer: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const links = opts?.links ?? []
    return (
      <footer class={`${displayClass ?? ""}`}>
        <hr />
        <p>
          <a href="https://kausharmahetaji.com">Kaushar Mahetaji</a> @ {year}
        </p>
        <ul>
          {Object.entries(links).map(([text, link]) => (
            <li>
              <a href={link}>{text}</a>
            </li>
          ))}
        </ul>

        {/* --- PURE JS PASSWORD PROTECTION --- */}
        {/* We do not use HTML templates anymore. We build it in the script. */}
        <script dangerouslySetInnerHTML={{ __html: `
        (function() {
            // ==========================================
            // 👇 PASSWORD SETTING
            // ==========================================
            const correctPassword = "kitten"; 
            // ==========================================

            function checkLock() {
                // 1. If already unlocked, ensure scroll is enabled and exit
                if (localStorage.getItem('site_unlocked') === 'true') {
                    document.body.style.overflow = ""; 
                    return; 
                }

                // 2. If lock already exists, don't create another one
                if (document.getElementById('site-lock-overlay')) return;

                // 3. CREATE THE LOCK SCREEN (Pure JS)
                const overlay = document.createElement('div');
                overlay.id = 'site-lock-overlay';
                
                // Styling (Dark Mode, Fixed Position, Max Z-Index)
                overlay.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background-color:#000000; z-index:2147483647; display:flex; flex-direction:column; align-items:center; justify-content:center; touch-action:none;";

                // Inner HTML (The Box)
                overlay.innerHTML = \`
                    <div style="text-align:center; background-color:#202327; padding:2rem; border-radius:8px; border:1px solid #444; box-shadow:0 0 100px rgba(255,255,255,0.1); max-width:400px; width:90%; font-family:sans-serif;">
                        <h2 style="margin-top:0; margin-bottom:1rem; color:#fff;">🔒 Restricted Access</h2>
                        <p style="margin-bottom:1rem; color:#ccc;">Please enter the password.</p>
                        <input type="password" id="password-input" placeholder="Password" style="padding:12px; border-radius:4px; border:1px solid #555; background-color:#111; color:white; margin-bottom:10px; width:100%; font-size:16px; box-sizing:border-box;">
                        <button id="password-submit" style="width:100%; padding:12px; border-radius:4px; border:none; background-color:#3a6ea5; color:white; font-weight:bold; cursor:pointer; font-size:16px;">Unlock</button>
                        <p id="error-msg" style="color:#ff6b6b; margin-top:1rem; display:none;">Incorrect password.</p>
                    </div>
                \`;

                // 4. Inject into Body
                document.body.appendChild(overlay);
                document.body.style.overflow = "hidden"; // Freeze scrolling

                // 5. Add Event Listeners
                const btn = document.getElementById('password-submit');
                const input = document.getElementById('password-input');
                const errorMsg = document.getElementById('error-msg');

                function validate() {
                    if (input.value === correctPassword) {
                        localStorage.setItem('site_unlocked', 'true');
                        overlay.remove();
                        document.body.style.overflow = "";
                    } else {
                        errorMsg.style.display = 'block';
                        input.value = "";
                        input.focus();
                    }
                }

                if (btn) btn.onclick = validate;
                if (input) {
                    input.addEventListener("keypress", function(event) {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            validate();
                        }
                    });
                    // Focus immediately
                    setTimeout(() => input.focus(), 100);
                }
            }

            // Run Immediately
            checkLock();

            // Run on Page Navigation (Quartz SPA)
            document.addEventListener('nav', checkLock);
        })();
        `}} />
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
