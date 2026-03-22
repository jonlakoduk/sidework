import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── PALETTE ────────────────────────────────────────────────────────────
const navy       = "#0F1923";
const navyMid    = "#172130";
const navyCard   = "#1E2D3D";
const navyBorder = "#2A3F55";
const orange     = "#FF5C28";
const orangeL    = "#FF7A4A";
const orangeGlow = "rgba(255,92,40,0.12)";
const muted      = "#8A9BB0";
const green      = "#22C55E";
const greenGlow  = "rgba(34,197,94,0.1)";
const white      = "#FFFFFF";
const cream      = "#FAF8F4";
const ink        = "#1A1612";

// ── SCREENS ────────────────────────────────────────────────────────────
// landing → role → signup_candidate | signup_employer → verify → success
// landing → signin → success

export default function AuthFlow() {
  const [screen,   setScreen]   = useState("landing");   // landing | signin | role | signup | verify | success
  const [userType, setUserType] = useState(null);         // "candidate" | "employer"
  const [step,     setStep]     = useState(0);            // signup sub-steps

  // Form state
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [name,      setName]      = useState("");
  const [company,   setCompany]   = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [errors,    setErrors]    = useState({});
  const [verifyCode,setVerifyCode]= useState(["","","","","",""]);

  function validate(fields) {
    const e = {};
    if (fields.includes("email")    && !email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = "Enter a valid email address";
    if (fields.includes("password") && password.length < 8)                   e.password = "Password must be at least 8 characters";
    if (fields.includes("name")     && name.trim().length < 2)                e.name = "Enter your full name";
    if (fields.includes("company")  && company.trim().length < 2)             e.company = "Enter your company name";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function fakeLoad(cb, ms = 900) {
    setLoading(true);
    setTimeout(() => { setLoading(false); cb(); }, ms);
  }

  function handleSignIn() {
    if (!validate(["email","password"])) return;
    fakeLoad(() => navigate("/dashboard"));
  }

  function handleSignUp() {
    const fields = userType === "candidate" ? ["email","password","name"] : ["email","password","name","company"];
    if (!validate(fields)) return;
    fakeLoad(() => setScreen("verify"));
  }

  function handleVerify() {
    const code = verifyCode.join("");
    if (code.length < 6) { setErrors({ code: "Enter the full 6-digit code" }); return; }
    fakeLoad(() => navigate(userType === "employer" ? "/employer" : "/evaluate"), 1200);
  }

  function updateVerifyDigit(i, val) {
    if (!/^\d?$/.test(val)) return;
    const next = [...verifyCode];
    next[i] = val;
    setVerifyCode(next);
    if (val && i < 5) {
      document.getElementById(`vcode-${i+1}`)?.focus();
    }
  }

  function handleVerifyKeyDown(i, e) {
    if (e.key === "Backspace" && !verifyCode[i] && i > 0) {
      document.getElementById(`vcode-${i-1}`)?.focus();
    }
  }

  const Topbar = () => (
    <div style={{ background: navyMid, borderBottom: `1px solid ${navyBorder}`, height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", position: "sticky", top: 0, zIndex: 100, flexShrink: 0 }}>
      <div onClick={() => setScreen("landing")} style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.05rem", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: orange, boxShadow: `0 0 8px ${orange}`, display: "inline-block" }} onClick={() => navigate("/")} style={{cursor:"pointer"}} /> sidework
      </div>
      {screen !== "success" && (
        <button onClick={() => setScreen(screen === "signin" ? "landing" : "signin")}
          style={{ background: "transparent", border: `1px solid ${navyBorder}`, color: muted, padding: "6px 16px", borderRadius: 8, fontFamily: "DM Sans,sans-serif", fontSize: "0.8rem", cursor: "pointer", transition: "all 0.15s" }}
          onMouseOver={e => { e.currentTarget.style.color = white; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
          onMouseOut={e => { e.currentTarget.style.color = muted; e.currentTarget.style.borderColor = navyBorder; }}>
          {screen === "signin" ? "Create account" : "Sign in"}
        </button>
      )}
    </div>
  );

  const Card = ({ children, maxW = 440 }) => (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: maxW, animation: "fadeUp 0.38s ease both" }}>
        {children}
      </div>
    </div>
  );

  const Label = ({ children, error }) => (
    <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.58rem", color: error ? "#FCA5A5" : muted, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>{children}</div>
  );

  const Input = ({ label, type = "text", value, onChange, placeholder, error, suffix }) => (
    <div style={{ marginBottom: 14 }}>
      <Label error={!!error}>{label}</Label>
      <div style={{ position: "relative" }}>
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={{ width: "100%", background: navy, border: `1.5px solid ${error ? "#EF4444" : navyBorder}`, borderRadius: 10, padding: suffix ? "11px 44px 11px 14px" : "11px 14px", color: white, fontFamily: "DM Sans,sans-serif", fontSize: "0.88rem", transition: "border-color 0.18s" }} />
        {suffix}
      </div>
      {error && <div style={{ fontFamily: "DM Sans,sans-serif", fontSize: "0.72rem", color: "#FCA5A5", marginTop: 5 }}>{error}</div>}
    </div>
  );

  const PrimaryBtn = ({ children, onClick, disabled, loading: ld }) => (
    <button onClick={onClick} disabled={disabled || ld}
      style={{ width: "100%", background: disabled || ld ? navyBorder : orange, border: "none", color: disabled || ld ? muted : white, padding: "14px", borderRadius: 12, fontFamily: "Syne,sans-serif", fontSize: "0.92rem", fontWeight: 700, cursor: disabled || ld ? "not-allowed" : "pointer", boxShadow: disabled || ld ? "none" : `0 4px 18px rgba(255,92,40,0.38)`, letterSpacing: "0.02em", transition: "all 0.18s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
      onMouseOver={e => { if (!disabled && !ld) e.currentTarget.style.background = orangeL; }}
      onMouseOut={e =>  { if (!disabled && !ld) e.currentTarget.style.background = orange; }}>
      {ld ? <><span style={{ animation: "spin 0.7s linear infinite", display: "inline-block" }}>↻</span> Just a sec...</> : children}
    </button>
  );

  const Divider = ({ label }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}>
      <div style={{ flex: 1, height: 1, background: navyBorder }} />
      <span style={{ fontFamily: "DM Mono,monospace", fontSize: "0.56rem", color: muted, letterSpacing: "0.12em" }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: navyBorder }} />
    </div>
  );

  const OAuthBtn = ({ icon, label }) => (
    <button style={{ width: "100%", background: "transparent", border: `1px solid ${navyBorder}`, color: "rgba(255,255,255,0.8)", padding: "12px 16px", borderRadius: 10, fontFamily: "DM Sans,sans-serif", fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all 0.15s", marginBottom: 10 }}
      onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = white; }}
      onMouseOut={e =>  { e.currentTarget.style.borderColor = navyBorder; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}>
      <span style={{ fontSize: "1rem" }}>{icon}</span> {label}
    </button>
  );

  const Eyebrow = ({ children }) => (
    <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.6rem", color: orange, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 10 }}>{children}</div>
  );

  const Headline = ({ children }) => (
    <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "clamp(1.6rem,4vw,2.2rem)", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 10 }}>{children}</h1>
  );

  const Sub = ({ children }) => (
    <p style={{ fontSize: "0.88rem", color: muted, lineHeight: 1.7, marginBottom: 28 }}>{children}</p>
  );

  // ── SCREENS ──────────────────────────────────────────────────────────

  // LANDING
  if (screen === "landing") return (
    <div style={{ background: navy, minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: white }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing:border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        input:focus { outline:none; border-color:${orange} !important; }
        .role-card { transition:all 0.2s; cursor:pointer; }
        .role-card:hover { border-color:rgba(255,92,40,0.5) !important; transform:translateY(-3px); }
      `}</style>
      <Topbar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ textAlign: "center", maxWidth: 540, animation: "fadeUp 0.4s ease both" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: orangeGlow, border: `1px solid rgba(255,92,40,0.25)`, borderRadius: 20, padding: "5px 14px", fontFamily: "DM Mono,monospace", fontSize: "0.6rem", color: orange, letterSpacing: "0.12em", marginBottom: 20 }}>
            ✦ FREE TO GET STARTED · NO CREDIT CARD
          </div>
          <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "clamp(2rem,5vw,3rem)", letterSpacing: "-0.02em", lineHeight: 1.08, marginBottom: 16 }}>
            It's last call.<br /><span style={{ color: orange }}>Now what?</span>
          </h1>
          <p style={{ fontSize: "0.95rem", color: muted, lineHeight: 1.75, marginBottom: 36, maxWidth: 440, margin: "0 auto 36px" }}>
            The job board built for people who've spent years in hospitality and are ready to show the world what that's actually worth.
          </p>

          {/* Role selector cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
            {[
              { type: "candidate", icon: "🍸", title: "I'm looking for work", sub: "Build your skills profile and get matched with employers who get it", cta: "Find My Next Role →" },
              { type: "employer",  icon: "🏢", title: "I'm hiring",           sub: "Post jobs and find candidates with real-world people skills", cta: "Post a Job →" },
            ].map(opt => (
              <div key={opt.type} className="role-card"
                onClick={() => { setUserType(opt.type); setScreen("role"); }}
                style={{ background: navyCard, border: `1px solid ${navyBorder}`, borderRadius: 14, padding: "24px 20px", textAlign: "left" }}>
                <div style={{ fontSize: "1.8rem", marginBottom: 12 }}>{opt.icon}</div>
                <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.95rem", marginBottom: 8 }}>{opt.title}</div>
                <div style={{ fontSize: "0.78rem", color: muted, lineHeight: 1.55, marginBottom: 14 }}>{opt.sub}</div>
                <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.6rem", color: orange, letterSpacing: "0.08em" }}>{opt.cta}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: "0.75rem", color: muted, lineHeight: 1.6 }}>
            Already have an account?{" "}
            <span onClick={() => setScreen("signin")} style={{ color: orange, cursor: "pointer", textDecoration: "underline" }}>Sign in</span>
          </div>
        </div>
      </div>
    </div>
  );

  // SIGN IN
  if (screen === "signin") return (
    <div style={{ background: navy, minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: white }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap'); *{box-sizing:border-box} @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}} @keyframes spin{to{transform:rotate(360deg)}} input:focus{outline:none;border-color:${orange}!important}`}</style>
      <Topbar />
      <Card>
        <Eyebrow>Welcome back</Eyebrow>
        <Headline>Clock back in.</Headline>
        <Sub>Pick up right where you left off.</Sub>

        <OAuthBtn icon="G" label="Continue with Google" />        <Divider label="or sign in with email" />

        <Input label="Email" type="email" value={email} onChange={v => { setEmail(v); setErrors({}); }} placeholder="you@email.com" error={errors.email} />
        <Input label="Password" type={showPass ? "text" : "password"} value={password} onChange={v => { setPassword(v); setErrors({}); }} placeholder="••••••••" error={errors.password}
          suffix={<button onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: muted, cursor: "pointer", fontSize: "0.75rem", fontFamily: "DM Mono,monospace", letterSpacing: "0.06em" }}>{showPass ? "HIDE" : "SHOW"}</button>} />

        <div style={{ textAlign: "right", marginTop: -8, marginBottom: 18 }}>
          <span style={{ fontFamily: "DM Mono,monospace", fontSize: "0.58rem", color: muted, cursor: "pointer", letterSpacing: "0.08em", transition: "color 0.15s" }}
            onMouseOver={e => e.currentTarget.style.color = orange} onMouseOut={e => e.currentTarget.style.color = muted}>
            Forgot password?
          </span>
        </div>

        <PrimaryBtn onClick={handleSignIn} loading={loading}>Sign In →</PrimaryBtn>

        <div style={{ textAlign: "center", marginTop: 18, fontSize: "0.78rem", color: muted }}>
          No account yet?{" "}
          <span onClick={() => setScreen("landing")} style={{ color: orange, cursor: "pointer", textDecoration: "underline" }}>Create one free</span>
        </div>
      </Card>
    </div>
  );

  // ROLE CONFIRM (after clicking a card on landing)
  if (screen === "role") return (
    <div style={{ background: navy, minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: white }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap'); *{box-sizing:border-box} @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}} @keyframes spin{to{transform:rotate(360deg)}} input:focus{outline:none;border-color:${orange}!important}`}</style>
      <Topbar />
      <Card>
        <Eyebrow>{userType === "candidate" ? "Candidate Sign Up" : "Employer Sign Up"}</Eyebrow>
        <Headline>{userType === "candidate" ? "Let's build your profile." : "Let's find your people."}</Headline>
        <Sub>{userType === "candidate"
          ? "Start with your skills evaluation — free, 5 minutes, no signup required to see your results."
          : "Post your first job and start receiving matched candidate profiles within 24 hours."
        }</Sub>

        {/* Path options */}
        {userType === "candidate" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {[
              { icon: "⚡", label: "Start with the free skills evaluation", sub: "Answer 10 questions, get your Skills Check, then create your account", cta: () => setScreen("signup"), highlight: true },
              { icon: "📝", label: "Go straight to sign up", sub: "Create your account first, then build your profile", cta: () => setScreen("signup"), highlight: false },
            ].map((opt, i) => (
              <div key={i} onClick={opt.cta}
                style={{ background: opt.highlight ? orangeGlow : navyCard, border: `1px solid ${opt.highlight ? "rgba(255,92,40,0.35)" : navyBorder}`, borderRadius: 12, padding: "16px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, transition: "all 0.18s" }}
                onMouseOver={e => { e.currentTarget.style.borderColor = orange; e.currentTarget.style.transform = "translateX(3px)"; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = opt.highlight ? "rgba(255,92,40,0.35)" : navyBorder; e.currentTarget.style.transform = "translateX(0)"; }}>
                <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>{opt.icon}</span>
                <div>
                  <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.9rem", marginBottom: 3 }}>{opt.label}</div>
                  <div style={{ fontSize: "0.75rem", color: muted, lineHeight: 1.5 }}>{opt.sub}</div>
                </div>
                <span style={{ marginLeft: "auto", color: orange, fontSize: "1rem", flexShrink: 0 }}>→</span>
              </div>
            ))}
          </div>
        )}

        {userType === "employer" && (
          <PrimaryBtn onClick={() => setScreen("signup")}>Create Employer Account →</PrimaryBtn>
        )}

        <div style={{ marginTop: 16, textAlign: "center", fontSize: "0.75rem", color: muted }}>
          Already have an account?{" "}
          <span onClick={() => setScreen("signin")} style={{ color: orange, cursor: "pointer", textDecoration: "underline" }}>Sign in</span>
        </div>

        <Divider label="or sign up with" />
        <OAuthBtn icon="G" label="Google" />      </Card>
    </div>
  );

  // SIGN UP FORM
  if (screen === "signup") return (
    <div style={{ background: navy, minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: white }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap'); *{box-sizing:border-box} @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}} @keyframes spin{to{transform:rotate(360deg)}} input:focus{outline:none;border-color:${orange}!important}`}</style>
      <Topbar />
      <Card>
        <Eyebrow>{userType === "candidate" ? "Step 1 of 3 — Account" : "Step 1 of 2 — Account"}</Eyebrow>
        <Headline>{userType === "candidate" ? "Who's behind the bar?" : "Who's doing the hiring?"}</Headline>
        <Sub>Create your free account. No credit card, no commitment.</Sub>

        <OAuthBtn icon="G" label="Continue with Google" />        <Divider label="or fill in the details" />

        <Input label="Full Name" value={name} onChange={v => { setName(v); setErrors({}); }} placeholder={userType === "candidate" ? "Alex Rivera" : "Jordan Smith"} error={errors.name} />
        {userType === "employer" && (
          <Input label="Company Name" value={company} onChange={v => { setCompany(v); setErrors({}); }} placeholder="EquipmentShare" error={errors.company} />
        )}
        <Input label="Email" type="email" value={email} onChange={v => { setEmail(v); setErrors({}); }} placeholder="you@email.com" error={errors.email} />
        <Input label="Password" type={showPass ? "text" : "password"} value={password} onChange={v => { setPassword(v); setErrors({}); }} placeholder="Min. 8 characters" error={errors.password}
          suffix={<button onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: muted, cursor: "pointer", fontSize: "0.75rem", fontFamily: "DM Mono,monospace", letterSpacing: "0.06em" }}>{showPass ? "HIDE" : "SHOW"}</button>} />

        {/* Password strength */}
        {password.length > 0 && (
          <div style={{ marginTop: -8, marginBottom: 14 }}>
            <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: password.length >= i*3 ? (i <= 2 ? amber : i === 3 ? orangeL : green) : navyBorder, transition: "background 0.3s" }} />
              ))}
            </div>
            <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.52rem", color: password.length < 6 ? amber : password.length < 10 ? orangeL : green, letterSpacing: "0.1em" }}>
              {password.length < 6 ? "WEAK" : password.length < 10 ? "GOOD" : "STRONG"}
            </div>
          </div>
        )}

        <PrimaryBtn onClick={handleSignUp} loading={loading}>
          {userType === "candidate" ? "Create My Account →" : "Create Employer Account →"}
        </PrimaryBtn>

        <div style={{ marginTop: 14, fontSize: "0.72rem", color: muted, lineHeight: 1.65, textAlign: "center" }}>
          By creating an account you agree to our{" "}
          <span style={{ color: orange, cursor: "pointer" }}>Terms of Service</span> and{" "}
          <span style={{ color: orange, cursor: "pointer" }}>Privacy Policy</span>.
        </div>

        <div style={{ marginTop: 14, textAlign: "center", fontSize: "0.78rem", color: muted }}>
          Already have an account?{" "}
          <span onClick={() => setScreen("signin")} style={{ color: orange, cursor: "pointer", textDecoration: "underline" }}>Sign in</span>
        </div>
      </Card>
    </div>
  );

  // EMAIL VERIFICATION
  if (screen === "verify") return (
    <div style={{ background: navy, minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: white }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap'); *{box-sizing:border-box} @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}} @keyframes spin{to{transform:rotate(360deg)}} input:focus{outline:none;border-color:${orange}!important; box-shadow:0 0 0 3px ${orangeGlow};}`}</style>
      <Topbar />
      <Card>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: orangeGlow, border: `1px solid rgba(255,92,40,0.3)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", margin: "0 auto 16px" }}>✉️</div>
          <Eyebrow>Check your inbox</Eyebrow>
          <Headline>We sent you a code.</Headline>
          <p style={{ fontSize: "0.88rem", color: muted, lineHeight: 1.7 }}>
            Enter the 6-digit code we sent to <strong style={{ color: white }}>{email || "your email"}</strong>. Should be there in under a minute.
          </p>
        </div>

        {/* 6-digit code input */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 8 }}>
          {verifyCode.map((digit, i) => (
            <input key={i} id={`vcode-${i}`} type="text" inputMode="numeric" maxLength={1}
              value={digit} onChange={e => updateVerifyDigit(i, e.target.value)} onKeyDown={e => handleVerifyKeyDown(i, e)}
              style={{ width: 48, height: 56, textAlign: "center", background: navyCard, border: `1.5px solid ${digit ? orange : navyBorder}`, borderRadius: 10, color: white, fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.3rem", transition: "border-color 0.18s" }} />
          ))}
        </div>

        {errors.code && <div style={{ textAlign: "center", fontFamily: "DM Sans,sans-serif", fontSize: "0.72rem", color: "#FCA5A5", marginBottom: 14 }}>{errors.code}</div>}

        <div style={{ textAlign: "center", marginBottom: 20, marginTop: 8 }}>
          <span style={{ fontFamily: "DM Mono,monospace", fontSize: "0.58rem", color: muted, letterSpacing: "0.08em", cursor: "pointer", transition: "color 0.15s" }}
            onMouseOver={e => e.currentTarget.style.color = orange} onMouseOut={e => e.currentTarget.style.color = muted}>
            Didn't get it? Resend the code
          </span>
        </div>

        <PrimaryBtn onClick={handleVerify} loading={loading} disabled={verifyCode.join("").length < 6}>
          Verify & Continue →
        </PrimaryBtn>

        <div style={{ marginTop: 16, textAlign: "center", fontSize: "0.78rem", color: muted }}>
          Wrong email?{" "}
          <span onClick={() => setScreen("signup")} style={{ color: orange, cursor: "pointer", textDecoration: "underline" }}>Go back</span>
        </div>
      </Card>
    </div>
  );

  // SUCCESS / REDIRECT
  if (screen === "success") return (
    <div style={{ background: navy, minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: white }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap'); *{box-sizing:border-box} @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}} @keyframes spin{to{transform:rotate(360deg)}} @keyframes pop{0%{transform:scale(0.5);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}`}</style>
      <Topbar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 420, animation: "fadeUp 0.4s ease both" }}>

          {/* Check mark */}
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: greenGlow, border: `2px solid rgba(34,197,94,0.3)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", animation: "pop 0.5s ease both", fontSize: "1.8rem" }}>✓</div>

          <Eyebrow>You're in</Eyebrow>
          <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.4rem)", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 12 }}>
            {name ? `Welcome, ${name.split(" ")[0]}.` : "Welcome."}
          </h1>
          <p style={{ fontSize: "0.9rem", color: muted, lineHeight: 1.75, marginBottom: 32 }}>
            {userType === "employer"
              ? "Your employer account is ready. Post your first job and start receiving matched candidates."
              : "Your account is set up. Time to build your skills profile and let employers find you."}
          </p>

          {/* Next steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
            {(userType === "employer"
              ? [{ icon: "🏢", label: "Complete your company profile", sub: "Tell candidates why you hire hospitality backgrounds" },
                 { icon: "📋", label: "Post your first job", sub: "We'll translate it for hospitality workers automatically" },
                 { icon: "👥", label: "Review matched candidates", sub: "Surfaced by skills score, not keywords" }]
              : [{ icon: "⚡", label: "Take the skills evaluation", sub: "5 minutes, free, no fluff" },
                 { icon: "📝", label: "Build your profile", sub: "Pre-filled from your eval results" },
                 { icon: "💼", label: "Browse matched jobs", sub: "Ranked by how closely your background fits" }]
            ).map((step, i) => (
              <div key={i} style={{ background: navyCard, border: `1px solid ${navyBorder}`, borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, textAlign: "left", animation: `fadeUp 0.35s ease ${0.1 + i*0.1}s both` }}>
                <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>{step.icon}</span>
                <div>
                  <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.85rem", marginBottom: 2 }}>{step.label}</div>
                  <div style={{ fontSize: "0.73rem", color: muted }}>{step.sub}</div>
                </div>
                <div style={{ marginLeft: "auto", width: 22, height: 22, borderRadius: "50%", border: `1.5px solid ${navyBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Mono,monospace", fontSize: "0.6rem", color: muted, flexShrink: 0 }}>{i+1}</div>
              </div>
            ))}
          </div>

          <button style={{ width: "100%", background: orange, border: "none", color: white, padding: "14px", borderRadius: 12, fontFamily: "Syne,sans-serif", fontSize: "0.92rem", fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 18px rgba(255,92,40,0.38)`, letterSpacing: "0.02em" }}
            onMouseOver={e => e.currentTarget.style.background = orangeL}
            onMouseOut={e => e.currentTarget.style.background = orange}>
            {userType === "employer" ? "Set Up Company Profile →" : "Take the Skills Evaluation →"}
          </button>
        </div>
      </div>
    </div>
  );

  return null;
}
