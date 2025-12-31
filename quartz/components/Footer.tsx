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

        {/* --- PASSWORD PROTECTION TEMPLATE --- */}
        <div id="site-lock-template" style={{ display: "none" }}>
            <div id="site-lock-overlay" style={{
                position: "fixed",
                top: "0",
                left: "0",
                width: "100vw",
                height: "100vh",
                backgroundColor: "#000000",
                zIndex: "2147483647", 
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
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
            // 👇 PASSWORD CONFIGURATION
            // ==========================================
            const correctPassword = "kitten"; 
            // ==========================================

            function initLock() {
                // 1. Check if unlocked
                if (localStorage.getItem('site_unlocked') === 'true') {
                    const existing = document.getElementById('site-lock-overlay');
                    if (existing) existing.remove();
                    document.body.style.overflow = "";
                    return; 
                }

                // 2. Check if lock is already active
                if (document.getElementById('site-lock-overlay')) return;

                // 3. Find template (With Retry Logic)
                const template = document.getElementById('site-lock-template');
                if (!template) {
                    // If not found, wait 50ms and try again
                    setTimeout(initLock, 50);
                    return;
                }

                // 4. Activate Lock
                const overlay = template.firstElementChild.cloneNode(true);
                document.body.appendChild(overlay);
                document.body.style.overflow = "hidden";

                // 5. Setup Events
                const btn = overlay.querySelector('#password-submit');
                const input = overlay.querySelector('#password-input');
                const errorMsg = overlay.querySelector('#error-msg');

                function checkPass() {
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

                btn.onclick = checkPass;
                input.addEventListener("keypress", function(event) {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        checkPass();
                    }
                });
                
                setTimeout(() => input.focus(), 100);
            }

            // Run immediately
            initLock();

            // Handle Quartz Navigation
            document.addEventListener('nav', () => setTimeout(initLock, 50));
        })();
        `}} />
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
