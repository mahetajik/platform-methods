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

        {/* --- PASSWORD PROTECTION COMPONENT --- */}
        {/* We give it a unique ID so the script can find it */}
        <div id="site-lock-template" style={{ display: "none" }}>
            <div id="site-lock-overlay" style={{
                position: "fixed",
                top: "0",
                left: "0",
                width: "100vw",
                height: "100vh",
                backgroundColor: "#000000", /* Pure Black */
                zIndex: "2147483647", /* Max Z-Index */
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                opacity: "1", /* Force Opaque */
            }}>
                <div style={{
                    textAlign: "center", 
                    backgroundColor: "#202327", 
                    padding: "2rem", 
                    borderRadius: "8px",
                    border: "1px solid #444",
                    boxShadow: "0 0 100px rgba(255,255,255,0.1)", 
                    maxWidth: "400px",
                    width: "90%"
                }}>
                    <h2 style={{marginTop: 0, marginBottom: "1rem", color: "#fff"}}>🔒 Restricted Access</h2>
                    <p style={{marginBottom: "1rem", color: "#ccc"}}>
                      Please enter the password.
                    </p>
                    
                    <input type="password" id="password-input" placeholder="Password" style={{
                        padding: "12px",
                        borderRadius: "4px",
                        border: "1px solid #555",
                        backgroundColor: "#111",
                        color: "white",
                        marginBottom: "10px",
                        width: "100%",
                        fontSize: "16px"
                    }}/>
                    
                    <button id="password-submit" style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "4px",
                        border: "none",
                        backgroundColor: "#3a6ea5",
                        color: "white",
                        fontWeight: "bold",
                        cursor: "pointer",
                        fontSize: "16px"
                    }}>Unlock</button>
                    
                    <p id="error-msg" style={{color: "#ff6b6b", marginTop: "1rem", display: "none"}}>
                        Incorrect password.
                    </p>
                </div>
            </div>
        </div>

        {/* --- LOGIC SCRIPT --- */}
        <script dangerouslySetInnerHTML={{ __html: `
        (function() {
            // ==========================================
            // 👇 CHANGE YOUR PASSWORD HERE 👇
            // ==========================================
            const correctPassword = "kitten"; 
            // ==========================================

            function initLock() {
                // 1. CHECK IF USER IS ALREADY LOGGED IN
                // We use localStorage now so it persists across tabs and sessions
                if (localStorage.getItem('site_unlocked') === 'true') {
                    // If unlocked, remove any existing lock screens and exit
                    const existing = document.getElementById('site-lock-overlay');
                    if (existing) existing.remove();
                    document.body.style.overflow = ""; // Ensure scroll is enabled
                    return; 
                }

                // 2. CHECK IF LOCK ALREADY EXISTS ON BODY
                // (Prevents creating duplicates when navigating pages)
                if (document.getElementById('site-lock-overlay')) {
                    return; 
                }

                // 3. MOVE LOCK TO BODY (Fixes Transparency)
                // We grab the template from the footer and move it to <body>
                // This ensures it sits on top of EVERYTHING and is 100% solid.
                const template = document.getElementById('site-lock-template');
                if (!template) return;

                // Clone the inner overlay content
                const overlay = template.firstElementChild.cloneNode(true);
                document.body.appendChild(overlay);
                
                // Disable scrolling
                document.body.style.overflow = "hidden";

                // 4. SETUP INTERACTION
                const btn = overlay.querySelector('#password-submit');
                const input = overlay.querySelector('#password-input');
                const errorMsg = overlay.querySelector('#error-msg');

                function checkPass() {
                    if (input.value === correctPassword) {
                        // Success!
                        localStorage.setItem('site_unlocked', 'true');
                        overlay.remove();
                        document.body.style.overflow = ""; // Re-enable scroll
                    } else {
                        // Fail
                        errorMsg.style.display = 'block';
                        input.value = "";
                        input.focus();
                    }
                }

                btn.onclick = checkPass;
                input.addEventListener("keypress", function(event) {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        checkPass();
                    }
                });
                
                // Focus the input immediately
                setTimeout(() => input.focus(), 100);
            }

            // Run immediately
            initLock();

            // Re-run on navigation (Quartz SPA events)
            document.addEventListener('nav', initLock);
            window.addEventListener('popstate', initLock);
        })();
        `}} />
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
