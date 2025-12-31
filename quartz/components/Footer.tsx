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
          {/* Custom Copyright Text with Link */}
          <a href="https://kausharmahetaji.com">Kaushar Mahetaji</a> @ {year}
        </p>
        <ul>
          {Object.entries(links).map(([text, link]) => (
            <li>
              <a href={link}>{text}</a>
            </li>
          ))}
        </ul>

        {/* --- PASSWORD PROTECTION OVERLAY --- */}
        {/* This covers the screen until the correct password is entered */}
        <div id="site-lock" style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#161618", // Dark background to hide content
            zIndex: 99999, // Sit on top of everything
            display: "flex", // Visible by default
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontFamily: "var(--bodyFont)",
        }}>
            <div style={{
                textAlign: "center", 
                backgroundColor: "#202327", 
                padding: "2rem", 
                borderRadius: "8px",
                border: "1px solid #333",
                boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
            }}>
                <h2 style={{marginTop: 0, marginBottom: "1rem"}}>🔒 Protected Site</h2>
                <p style={{marginBottom: "1rem", color: "#aaa"}}>Please enter the password to view this content.</p>
                
                <input type="password" id="password-input" placeholder="Enter Password" style={{
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #444",
                    backgroundColor: "#161618",
                    color: "white",
                    marginRight: "10px",
                    outline: "none"
                }}/>
                
                <button id="password-submit" style={{
                    padding: "10px 20px",
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor: "#3a6ea5", // Blue accent color
                    color: "white",
                    fontWeight: "bold",
                    cursor: "pointer"
                }}>Enter</button>
                
                <p id="error-msg" style={{color: "#ff6b6b", marginTop: "1rem", display: "none", fontSize: "0.9rem"}}>
                    Incorrect password. Try again.
                </p>
            </div>
        </div>

        {/* --- PASSWORD LOGIC SCRIPT --- */}
        <script dangerouslySetInnerHTML={{ __html: `
        (function() {
            // ==========================================
            // 👇 CHANGE YOUR PASSWORD HERE 👇
            // ==========================================
            const correctPassword = "kitten"; 
            
            // ==========================================

            const lock = document.getElementById('site-lock');
            const btn = document.getElementById('password-submit');
            const input = document.getElementById('password-input');
            const errorMsg = document.getElementById('error-msg');

            // 1. Check if user already entered the password previously (Session Storage)
            if (sessionStorage.getItem('auth_token') === correctPassword) {
                if(lock) lock.style.display = 'none';
            }

            // 2. Function to validate password
            function checkPass() {
                if (input.value === correctPassword) {
                    // Save access for this session
                    sessionStorage.setItem('auth_token', correctPassword);
                    // Hide the lock screen
                    lock.style.display = 'none';
                } else {
                    // Show error
                    if(errorMsg) errorMsg.style.display = 'block';
                    input.value = "";
                }
            }

            // 3. Attach Event Listeners
            if(btn) btn.onclick = checkPass;
            
            if(input) input.addEventListener("keypress", function(event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    checkPass();
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
