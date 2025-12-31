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

        {/* --- NUCLEAR PASSWORD PROTECTION --- */}
        <div id="site-lock" style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "#161618", // Hardcoded dark color
            backgroundImage: "linear-gradient(to bottom, #161618, #000000)", // Double layer to ensure opacity
            zIndex: "2147483647", // Maximum CSS value (32-bit integer)
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "default", // Stop cursor interaction with background
            userSelect: "none", // Prevent highlighting text behind
            touchAction: "none" // Prevent scrolling on mobile
        }}>
            <div style={{
                textAlign: "center", 
                backgroundColor: "#202327", 
                padding: "2rem", 
                borderRadius: "8px",
                border: "1px solid #444",
                boxShadow: "0 0 50px rgba(0,0,0,0.9)", // massive shadow to cover edges
                maxWidth: "400px",
                width: "90%"
            }}>
                <h2 style={{marginTop: 0, marginBottom: "1rem", color: "#fff"}}>🔒 Restricted Access</h2>
                <p style={{marginBottom: "1rem", color: "#ccc"}}>
                  This site is password protected.
                </p>
                
                <input type="password" id="password-input" placeholder="Enter Password" style={{
                    padding: "12px",
                    borderRadius: "4px",
                    border: "1px solid #555",
                    backgroundColor: "#111",
                    color: "white",
                    marginRight: "0",
                    marginBottom: "10px",
                    width: "100%",
                    outline: "none",
                    fontSize: "1rem"
                }}/>
                
                <button id="password-submit" style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor: "#3a6ea5",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    cursor: "pointer",
                    marginTop: "5px"
                }}>Unlock Site</button>
                
                <p id="error-msg" style={{color: "#ff6b6b", marginTop: "1rem", display: "none"}}>
                    Incorrect password.
                </p>
            </div>
        </div>

        {/* --- LOGIC SCRIPT --- */}
        <script dangerouslySetInnerHTML={{ __html: `
        (function() {
            // ==========================================
            // 👇 CHANGE YOUR PASSWORD HERE 👇
            // ==========================================
            const correctPassword = "YOUR_PASSWORD_HERE"; 
            // ==========================================

            const lock = document.getElementById('site-lock');
            const btn = document.getElementById('password-submit');
            const input = document.getElementById('password-input');
            const errorMsg = document.getElementById('error-msg');

            // Function to lock scrolling
            function disableScroll() {
                document.body.style.overflow = "hidden";
                document.body.style.height = "100vh";
            }

            // Function to unlock scrolling
            function enableScroll() {
                document.body.style.overflow = "";
                document.body.style.height = "";
            }

            // 1. Initial Check
            if (sessionStorage.getItem('auth_token') === correctPassword) {
                if(lock) lock.style.display = 'none';
                enableScroll();
            } else {
                // Force lock if not authenticated
                if(lock) lock.style.display = 'flex';
                disableScroll();
            }

            // 2. Validate Password
            function checkPass() {
                if (input.value === correctPassword) {
                    sessionStorage.setItem('auth_token', correctPassword);
                    lock.style.display = 'none';
                    enableScroll();
                } else {
                    if(errorMsg) errorMsg.style.display = 'block';
                    input.value = "";
                    // Shake animation effect
                    input.style.borderColor = "red";
                    setTimeout(() => input.style.borderColor = "#555", 500);
                }
            }

            // 3. Listeners
            if(btn) btn.onclick = checkPass;
            if(input) input.addEventListener("keypress", function(event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    checkPass();
                }
            });

            // 4. Trap Focus & Prevent "Flipping" (Aggressive)
            // If the lock is visible, stop specific key presses
            document.addEventListener('keydown', function(e) {
                if (lock && lock.style.display !== 'none') {
                    // Prevent generic keys, allow typing in input
                    if (e.target !== input) {
                        // Allow F5/Refresh, but block other navigation
                        if (e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === " " || e.key === "j" || e.key === "k") {
                           e.stopPropagation();
                           // optional: e.preventDefault(); 
                        }
                        input.focus();
                    }
                }
            });

        })();
        `}} />
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
