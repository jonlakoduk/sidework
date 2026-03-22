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
const amber      = "#F59E0B";
const white      = "#FFFFFF";
const cream      = "#FAF8F4";
const ink        = "#1A1612";
const receiptRule= "#E2DDD6";
const receiptFade= "#9B8E7E";

// ── DATA ───────────────────────────────────────────────────────────────
const TRANSLATIONS = [
  { from: "Handling a drunk guest at closing",            to: "Crisis de-escalation & conflict resolution under pressure" },
  { from: "Getting regulars to order the good stuff",     to: "Consultative upselling & revenue-per-customer optimization" },
  { from: "Covering a no-call no-show at 4pm Saturday",   to: "Workforce agility & real-time operational problem solving" },
  { from: "Training a new hire from scratch",             to: "Onboarding design & adult learning facilitation" },
  { from: "Watching pour costs and ordering inventory",   to: "Cost center management & supply chain oversight" },
  { from: "Remembering what every regular drinks",        to: "Relationship-led CRM & customer retention strategy" },
];

const JOB_CATEGORIES = [
  { icon: "💼", label: "Sales & BD",          count: 84,  tags: ["Territory Sales","Account Manager","BD Rep"] },
  { icon: "🍻", label: "Hospitality Tech",    count: 47,  tags: ["Toast AE","SevenRooms CS","OpenTable"] },
  { icon: "🏥", label: "Healthcare",          count: 61,  tags: ["Patient Experience","Care Coordinator"] },
  { icon: "👥", label: "HR & People Ops",     count: 38,  tags: ["People Manager","Recruiting","Culture"] },
  { icon: "📋", label: "Operations",          count: 53,  tags: ["Ops Manager","Logistics","Regional Mgr"] },
  { icon: "📣", label: "Marketing & Events",  count: 29,  tags: ["Event Coord","Brand Mgr","Comms"] },
];

const TESTIMONIALS = [
  { name: "Danielle R.",  from: "Bar Manager, 9 yrs",   to: "Territory Sales Manager · EquipmentShare",      score: 88, quote: "I applied to 40 jobs on Indeed and heard back from two. I applied to six on sidework and had three interviews in two weeks. The hospitality translation made my resume make sense to people who'd never set foot in a bar." },
  { name: "Marcus T.",   from: "GM, 12 yrs",            to: "Patient Experience Director · Regional Health",  score: 91, quote: "My Skills Check said EXCEPTIONAL transferability. I didn't believe it at first. Then I read what it actually translated my experience into and realized I'd been underselling myself for years. That's on me and on every resume guide that told me to hide it." },
  { name: "Priya S.",    from: "Server/Trainer, 6 yrs", to: "SaaS Customer Success Mgr · Fintech Co.",        score: 79, quote: "The 'why you fit' section on every job was the thing. Not 'here are requirements' — 'here is how what you did connects to what we need.' I felt like someone finally got it." },
];

const HOW_STEPS = [
  { num: "01", icon: "⚡", title: "Take the free Skills Check",  body: "10 questions. 5 minutes. No account required to see your results. We'll show you exactly what your hospitality background translates to — in language employers actually respond to." },
  { num: "02", icon: "📝", title: "Build your profile",          body: "Your Skills Check pre-fills your profile. Edit anything. Add your work history in your own words — we translate it. Target the roles and industries that match what you actually want." },
  { num: "03", icon: "🔍", title: "Browse jobs that get it",     body: "Every listing shows the hospitality-translated title first, a 'why you fit' explanation, and a match score. No more wondering if they'd even consider you." },
  { num: "04", icon: "🤝", title: "Clock in to something new",   body: "Apply directly, get matched, hear from employers. When a company views or saves your profile you'll know. The industry isn't leaving you — it's launching you." },
];

const EMPLOYER_LOGOS = ["EquipmentShare","SevenRooms","Regional Health","Toast","OpenTable","Fintech Co.","Distribution Co.","B2B Services"];

export default function Homepage() {
  const navigate = useNavigate();
  const [email,     setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [activeTes, setActiveTes] = useState(0);
  const [activeTrans, setActiveTrans] = useState(0);

  function submitEmail() {
    if (!email.includes("@")) return;
    setSubmitted(true);
  }

  return (
    <div style={{ background: navy, minHeight: "100vh", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: white, overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        input:focus { outline:none; border-color:${orange}!important; }
        .cat-card { transition:all 0.2s; cursor:pointer; }
        .cat-card:hover { border-color:rgba(255,92,40,0.4)!important; transform:translateY(-4px)!important; background:rgba(30,45,61,0.9)!important; }
        .nav-link:hover { color:${white}!important; }
        .cta-primary:hover { background:${orangeL}!important; transform:translateY(-2px); box-shadow:0 8px 28px rgba(255,92,40,0.5)!important; }
        .cta-ghost:hover { border-color:rgba(255,255,255,0.3)!important; color:${white}!important; }
        .trans-row { transition:all 0.18s; cursor:pointer; }
        .trans-row:hover { background:rgba(255,255,255,0.03)!important; }
        .trans-row.active { background:${orangeGlow}!important; border-color:rgba(255,92,40,0.3)!important; }
        .employer-logo { transition:all 0.2s; }
        .employer-logo:hover { border-color:rgba(255,92,40,0.3)!important; color:${white}!important; }
        .step-card:hover { border-color:rgba(255,92,40,0.3)!important; }
        .footer-link:hover { color:${white}!important; }
        .dot-btn:hover { background:${orange}!important; }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ background:navyMid, borderBottom:`1px solid ${navyBorder}`, height:56, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 40px", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"1.1rem", letterSpacing:"0.04em", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ width:8, height:8, borderRadius:"50%", background:orange, boxShadow:`0 0 8px ${orange}`, display:"inline-block" }} /> sidework
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:24 }}>
          {[
            ["For Candidates", "/evaluate"],
            ["For Employers", "/employer"],
            ["How It Works", "/#how"],
            ["Pricing", "/pricing"],
          ].map(([l, href]) => (
            <span key={l} className="nav-link" onClick={() => navigate(href)} style={{ fontFamily:"DM Sans,sans-serif", fontSize:"0.83rem", color:muted, cursor:"pointer", transition:"color 0.15s" }}>{l}</span>
          ))}
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button className="cta-ghost" onClick={() => navigate("/auth")} style={{ background:"transparent", border:`1px solid ${navyBorder}`, color:muted, padding:"7px 18px", borderRadius:8, fontFamily:"DM Sans,sans-serif", fontSize:"0.82rem", cursor:"pointer", transition:"all 0.15s" }}>Sign In</button>
          <button className="cta-primary" onClick={() => navigate("/auth")} style={{ background:orange, border:"none", color:white, padding:"7px 18px", borderRadius:8, fontFamily:"Syne,sans-serif", fontSize:"0.82rem", fontWeight:700, cursor:"pointer", transition:"all 0.18s", boxShadow:`0 3px 12px rgba(255,92,40,0.35)`, letterSpacing:"0.02em" }}>Get Started Free</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ padding:"80px 40px 72px", maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }}>
        {/* Candidate side */}
        <div style={{ animation:"fadeUp 0.5s ease both" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:orangeGlow, border:`1px solid rgba(255,92,40,0.25)`, borderRadius:20, padding:"5px 14px", fontFamily:"DM Mono,monospace", fontSize:"0.6rem", color:orange, letterSpacing:"0.12em", marginBottom:20 }}>
            ✦ FREE TO START · NO CARD REQUIRED
          </div>
          <h1 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"clamp(2.2rem,4.5vw,3.4rem)", letterSpacing:"-0.02em", lineHeight:1.06, marginBottom:18 }}>
            It's last call.<br /><span style={{ color:orange }}>Now what?</span>
          </h1>
          <p style={{ fontSize:"1rem", color:muted, lineHeight:1.78, marginBottom:32, maxWidth:460 }}>
            The job board built for people who've spent years in hospitality and are ready to show the world what that's actually worth. Your experience translates. We prove it.
          </p>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <button className="cta-primary" onClick={() => navigate("/evaluate")} style={{ background:orange, border:"none", color:white, padding:"14px 28px", borderRadius:12, fontFamily:"Syne,sans-serif", fontSize:"0.92rem", fontWeight:700, cursor:"pointer", transition:"all 0.18s", boxShadow:`0 4px 18px rgba(255,92,40,0.4)`, letterSpacing:"0.02em" }}>
              Take the Free Skills Check →
            </button>
            <button className="cta-ghost" onClick={() => navigate("/jobs")} style={{ background:"transparent", border:`1px solid ${navyBorder}`, color:muted, padding:"14px 22px", borderRadius:12, fontFamily:"DM Sans,sans-serif", fontSize:"0.88rem", cursor:"pointer", transition:"all 0.15s" }}>
              Browse Jobs
            </button>
          </div>
        </div>

        {/* Employer side */}
        <div style={{ background:navyCard, border:`1px solid ${navyBorder}`, borderRadius:18, padding:"32px 28px", animation:"fadeUp 0.5s ease 0.15s both" }}>
          <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.58rem", color:muted, letterSpacing:"0.16em", textTransform:"uppercase", marginBottom:16, display:"flex", alignItems:"center", gap:8 }}>
            For Employers <span style={{ flex:1, height:1, background:navyBorder, display:"inline-block" }} />
          </div>
          <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"clamp(1.3rem,2.5vw,1.8rem)", letterSpacing:"-0.01em", lineHeight:1.15, marginBottom:12 }}>
            Your best hire<br />never called it "sales."
          </h2>
          <p style={{ fontSize:"0.85rem", color:muted, lineHeight:1.7, marginBottom:20 }}>
            Hospitality workers are natural closers, crisis managers, and relationship builders. They just didn't have the title. Find them here before someone else does.
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:22 }}>
            {["AI hospitality-to-corporate job translation","Skill-matched candidate surfacing","Verified employer profiles","14-day free trial on all plans"].map(f => (
              <div key={f} style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ color:green, fontSize:"0.75rem", flexShrink:0 }}>✓</span>
                <span style={{ fontSize:"0.8rem", color:"rgba(255,255,255,0.75)" }}>{f}</span>
              </div>
            ))}
          </div>
          <button className="cta-primary" onClick={() => navigate("/employer")} style={{ width:"100%", background:orange, border:"none", color:white, padding:"13px", borderRadius:10, fontFamily:"Syne,sans-serif", fontSize:"0.88rem", fontWeight:700, cursor:"pointer", transition:"all 0.18s", boxShadow:`0 3px 14px rgba(255,92,40,0.35)`, letterSpacing:"0.02em" }}>
            Post Your First Job →
          </button>
          <div style={{ textAlign:"center", marginTop:10, fontFamily:"DM Mono,monospace", fontSize:"0.56rem", color:muted, letterSpacing:"0.1em" }}>
            FROM $149/MO · SINGLE POST $199
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div style={{ background:navyMid, borderTop:`1px solid ${navyBorder}`, borderBottom:`1px solid ${navyBorder}`, padding:"24px 40px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2, background:navyBorder, borderRadius:12, overflow:"hidden" }}>
          {[["247","Open roles today"],["84","Average match score"],["$0","To get started"]].map(([val,label]) => (
            <div key={label} style={{ background:navyCard, padding:"22px 28px", textAlign:"center" }}>
              <div style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"2rem", color:orange, lineHeight:1, marginBottom:6 }}>{val}</div>
              <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.6rem", color:muted, letterSpacing:"0.12em", textTransform:"uppercase" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── LOGO BAR ── */}
      <div style={{ borderTop:`1px solid ${navyBorder}`, borderBottom:`1px solid ${navyBorder}`, padding:"16px 40px", background:navyMid }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
          <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.56rem", color:muted, letterSpacing:"0.14em", whiteSpace:"nowrap", flexShrink:0 }}>HIRING ON SIDEWORK</div>
          <div style={{ flex:1, height:1, background:navyBorder }} />
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {EMPLOYER_LOGOS.map(l => (
              <div key={l} className="employer-logo" style={{ background:navyCard, border:`1px solid ${navyBorder}`, borderRadius:8, padding:"5px 12px", fontFamily:"DM Mono,monospace", fontSize:"0.6rem", color:muted, letterSpacing:"0.06em", cursor:"default", transition:"all 0.15s" }}>{l}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TRANSLATION SHOWCASE ── */}
      <section style={{ padding:"88px 40px", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:56, alignItems:"flex-start" }}>
          <div>
            <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.62rem", color:orange, letterSpacing:"0.22em", textTransform:"uppercase", marginBottom:12 }}>The Translation</div>
            <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"clamp(1.8rem,3.5vw,2.6rem)", letterSpacing:"-0.02em", lineHeight:1.1, marginBottom:16 }}>
              What you called it.<br />What they call it.
            </h2>
            <p style={{ fontSize:"0.92rem", color:muted, lineHeight:1.75, marginBottom:24 }}>
              Every shift built skills that corporate America is actively looking for. They just don't know how to find them on a resume that says "bartender." We fix that.
            </p>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:greenGlow, border:`1px solid rgba(34,197,94,0.2)`, borderRadius:20, padding:"6px 14px", fontFamily:"DM Mono,monospace", fontSize:"0.58rem", color:green, letterSpacing:"0.1em", marginBottom:6 }}>
              ✓ 116 UNIQUE TRANSFERABLE SKILLS IDENTIFIED
            </div>
            <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.5rem", color:muted, letterSpacing:"0.06em" }}>University of Surrey · Annals of Tourism Research · 2024</div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            {TRANSLATIONS.map((t,i) => (
              <div key={i} className={`trans-row${activeTrans===i?" active":""}`} onClick={() => setActiveTrans(i)}
                style={{ display:"grid", gridTemplateColumns:"1fr 24px 1fr", gap:8, alignItems:"center", padding:"11px 13px", borderRadius:10, border:`1px solid ${activeTrans===i?"rgba(255,92,40,0.3)":"transparent"}`, background:activeTrans===i?orangeGlow:"transparent" }}>
                <div style={{ fontSize:"0.76rem", color:activeTrans===i?"rgba(255,255,255,0.8)":muted, lineHeight:1.4 }}>{t.from}</div>
                <div style={{ color:orange, textAlign:"center", fontSize:"0.8rem" }}>→</div>
                <div style={{ fontSize:"0.76rem", color:activeTrans===i?white:"rgba(255,255,255,0.45)", fontWeight:activeTrans===i?600:400, lineHeight:1.4 }}>{t.to}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EVALUATOR TEASER ── */}
      <section style={{ background:navyMid, borderTop:`1px solid ${navyBorder}`, borderBottom:`1px solid ${navyBorder}`, padding:"80px 40px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:56, alignItems:"center" }}>

          {/* Floating guest check */}
          <div style={{ display:"flex", justifyContent:"center" }}>
            <div style={{ animation:"float 4s ease-in-out infinite" }}>
              <div style={{ background:cream, color:ink, borderRadius:12, overflow:"hidden", boxShadow:"0 16px 60px rgba(0,0,0,0.5)", width:300 }}>
                <div style={{ background:ink, padding:"14px 20px", textAlign:"center" }}>
                  <div style={{ fontFamily:"Syne,sans-serif", fontSize:"0.95rem", fontWeight:800, color:cream, letterSpacing:"0.1em" }}>SIDEWORK</div>
                  <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.5rem", color:"rgba(250,248,244,0.4)", letterSpacing:"0.2em", marginTop:2 }}>CANDIDATE SKILLS CHECK</div>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 16px", borderBottom:`1px solid ${receiptRule}`, background:"rgba(26,22,18,0.04)" }}>
                  {[["ROLE","Bar Manager"],["EXP","9 YRS"],["STATUS","READY"]].map(([l,v]) => (
                    <div key={l} style={{ fontFamily:"DM Mono,monospace", fontSize:"0.54rem", color:receiptFade }}>
                      {l}<strong style={{ display:"block", color:ink, marginTop:2, fontSize:"0.6rem" }}>{v}</strong>
                    </div>
                  ))}
                </div>
                <div style={{ padding:"12px 16px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"DM Mono,monospace", fontSize:"0.52rem", color:receiptFade, letterSpacing:"0.1em", paddingBottom:5, borderBottom:`1px solid ${receiptRule}`, marginBottom:3 }}>
                    <span>SKILL</span><span>LEVEL</span>
                  </div>
                  {[["Conflict Resolution","At 1am. Without backup.","EXPERT"],["Consultative Upselling","Top shelf, every time.","EXPERT"],["P&L Ownership","Real money, real stakes.","ADV"],["Team Leadership","Hired, trained, fired.","ADV"],["Vendor Negotiation","You knew the good reps.","ADV"]].map(([skill,note,level]) => (
                    <div key={skill} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"5px 0", borderBottom:`1px dotted ${receiptRule}` }}>
                      <div>
                        <div style={{ fontSize:"0.7rem", fontWeight:600, color:ink, fontFamily:"DM Sans,sans-serif" }}>{skill}</div>
                        <div style={{ fontSize:"0.56rem", color:receiptFade, fontStyle:"italic" }}>{note}</div>
                      </div>
                      <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.58rem", color:ink, fontWeight:500, paddingTop:2 }}>{level}</div>
                    </div>
                  ))}
                  <div style={{ paddingTop:7, marginTop:3, borderTop:`2px solid ${ink}` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"DM Mono,monospace", fontSize:"0.68rem", color:ink, fontWeight:700 }}>
                      <span>TOTAL WORTH</span><span>PRICELESS</span>
                    </div>
                  </div>
                </div>
                <div style={{ background:ink, color:cream, padding:"9px 16px", textAlign:"center", fontFamily:"DM Mono,monospace", fontSize:"0.52rem", letterSpacing:"0.14em", opacity:0.85 }}>
                  IT'S LAST CALL. NOW WHAT? — SIDEWORK.IO
                </div>
              </div>
            </div>
          </div>

          {/* Pitch */}
          <div>
            <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.62rem", color:orange, letterSpacing:"0.22em", textTransform:"uppercase", marginBottom:12 }}>Free Skills Evaluation</div>
            <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"clamp(1.8rem,3.5vw,2.6rem)", letterSpacing:"-0.02em", lineHeight:1.1, marginBottom:16 }}>
              You've been<br />86'd from ordinary.
            </h2>
            <p style={{ fontSize:"0.92rem", color:muted, lineHeight:1.75, marginBottom:24 }}>
              Five minutes. Ten questions. No account required to see your results. You get a personalized Skills Check — yours to keep, share, and send to employers directly.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:28 }}>
              {[["10","Questions, no fluff"],["5min","Faster than a side work checklist"],["100%","Free. No cover charge. Ever."]].map(([val,label]) => (
                <div key={label} style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"1.1rem", color:orange, minWidth:56, flexShrink:0, textAlign:"right" }}>{val}</div>
                  <div style={{ fontSize:"0.83rem", color:muted, minHeight:"40px", display:"flex", alignItems:"center" }}>{label}</div>
                </div>
              ))}
            </div>
            <button className="cta-primary" onClick={() => navigate("/evaluate")} style={{ background:orange, border:"none", color:white, padding:"14px 28px", borderRadius:12, fontFamily:"Syne,sans-serif", fontSize:"0.92rem", fontWeight:700, cursor:"pointer", transition:"all 0.18s", boxShadow:`0 4px 18px rgba(255,92,40,0.4)`, letterSpacing:"0.02em" }}>
              Open My Tab →
            </button>
            <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.56rem", color:muted, letterSpacing:"0.1em", marginTop:10 }}>NO SIGNUP REQUIRED TO SEE YOUR RESULTS</div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding:"88px 40px", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:52 }}>
          <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.62rem", color:orange, letterSpacing:"0.22em", textTransform:"uppercase", marginBottom:12 }}>The Process</div>
          <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"clamp(1.8rem,3.5vw,2.6rem)", letterSpacing:"-0.02em", lineHeight:1.1 }}>Four steps. No sidework required.</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:2, background:navyBorder, borderRadius:16, overflow:"hidden" }}>
          {HOW_STEPS.map((s,i) => (
            <div key={i} className="step-card" style={{ background:navyCard, padding:"30px 22px", border:`1px solid transparent`, transition:"border-color 0.2s" }}>
              <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.58rem", color:orange, letterSpacing:"0.16em", marginBottom:14, display:"flex", alignItems:"center", gap:7 }}>
                {s.num} <span style={{ flex:1, height:1, background:navyBorder, display:"inline-block" }} />
              </div>
              <div style={{ fontSize:"1.5rem", marginBottom:12 }}>{s.icon}</div>
              <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"0.92rem", marginBottom:9, lineHeight:1.25 }}>{s.title}</div>
              <div style={{ fontSize:"0.76rem", color:muted, lineHeight:1.7 }}>{s.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── JOB CATEGORIES ── */}
      <section style={{ background:navyMid, borderTop:`1px solid ${navyBorder}`, borderBottom:`1px solid ${navyBorder}`, padding:"80px 40px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:36, flexWrap:"wrap", gap:16 }}>
            <div>
              <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.62rem", color:orange, letterSpacing:"0.22em", textTransform:"uppercase", marginBottom:10 }}>Browse by Category</div>
              <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"clamp(1.6rem,3vw,2.2rem)", letterSpacing:"-0.01em", lineHeight:1.1 }}>Find your next shift.</h2>
            </div>
            <span onClick={() => navigate("/jobs")} style={{ fontFamily:"DM Mono,monospace", fontSize:"0.62rem", color:orange, letterSpacing:"0.08em", cursor:"pointer" }}>View all 247 roles →</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
            {JOB_CATEGORIES.map((cat,i) => (
              <div key={i} className="cat-card" style={{ background:navyCard, border:`1px solid ${navyBorder}`, borderRadius:14, padding:"22px 20px", transition:"all 0.2s" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                  <div style={{ fontSize:"1.5rem" }}>{cat.icon}</div>
                  <div style={{ background:orangeGlow, border:`1px solid rgba(255,92,40,0.2)`, borderRadius:20, padding:"3px 10px", fontFamily:"DM Mono,monospace", fontSize:"0.56rem", color:orange, letterSpacing:"0.06em" }}>{cat.count} open</div>
                </div>
                <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"0.93rem", marginBottom:9 }}>{cat.label}</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                  {cat.tags.map(tag => (
                    <span key={tag} style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${navyBorder}`, color:muted, fontFamily:"DM Mono,monospace", fontSize:"0.54rem", padding:"3px 8px", borderRadius:5, letterSpacing:"0.03em" }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding:"88px 40px", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.62rem", color:orange, letterSpacing:"0.22em", textTransform:"uppercase", marginBottom:12 }}>From the floor</div>
          <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"clamp(1.8rem,3.5vw,2.6rem)", letterSpacing:"-0.02em", lineHeight:1.1 }}>People who made the jump.</h2>
        </div>
        <div style={{ background:`linear-gradient(135deg,${navyCard},rgba(255,92,40,0.06))`, border:`1px solid rgba(255,92,40,0.2)`, borderRadius:16, padding:"36px 40px", maxWidth:760, margin:"0 auto 20px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20, flexWrap:"wrap" }}>
            <div style={{ width:44, height:44, borderRadius:"50%", background:`linear-gradient(135deg,${orange},#c0392b)`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"0.82rem", flexShrink:0 }}>
              {TESTIMONIALS[activeTes].name.split(" ").map(n=>n[0]).join("")}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"0.88rem" }}>{TESTIMONIALS[activeTes].name}</div>
              <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.56rem", color:muted, letterSpacing:"0.06em", marginTop:2 }}>{TESTIMONIALS[activeTes].from}</div>
              <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.56rem", color:orange, letterSpacing:"0.06em", marginTop:2 }}>→ {TESTIMONIALS[activeTes].to}</div>
            </div>
            <div style={{ textAlign:"center", flexShrink:0 }}>
              <div style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"1.6rem", color:orange, lineHeight:1 }}>{TESTIMONIALS[activeTes].score}</div>
              <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.48rem", color:muted, letterSpacing:"0.08em" }}>SKILLS SCORE</div>
            </div>
          </div>
          <p style={{ fontSize:"0.92rem", color:"rgba(244,246,248,0.85)", lineHeight:1.8, fontStyle:"italic" }}>
            "{TESTIMONIALS[activeTes].quote}"
          </p>
        </div>
        <div style={{ display:"flex", justifyContent:"center", gap:8 }}>
          {TESTIMONIALS.map((_,i) => (
            <button key={i} className="dot-btn" onClick={() => setActiveTes(i)}
              style={{ width:8, height:8, borderRadius:"50%", background:i===activeTes?orange:navyBorder, border:"none", cursor:"pointer", transition:"background 0.2s", padding:0 }} />
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section style={{ background:navyMid, borderTop:`1px solid ${navyBorder}`, padding:"88px 40px" }}>
        <div style={{ maxWidth:560, margin:"0 auto", textAlign:"center" }}>
          <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.62rem", color:orange, letterSpacing:"0.22em", textTransform:"uppercase", marginBottom:14 }}>Last call</div>
          <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"clamp(2rem,4vw,3rem)", letterSpacing:"-0.02em", lineHeight:1.08, marginBottom:16 }}>
            Your tab is clear.<br />Time to open a new one.
          </h2>
          <p style={{ fontSize:"0.92rem", color:muted, lineHeight:1.75, marginBottom:32 }}>
            No cover charge. No minimum. Just a five-minute evaluation that proves what you already know — you bring more to the table than any resume has ever shown.
          </p>
          {!submitted ? (
            <div style={{ display:"flex", maxWidth:420, margin:"0 auto 12px", borderRadius:12, overflow:"hidden", border:`2px solid ${ink}`, boxShadow:`4px 4px 0 ${ink}`, background:"white" }}>
              <input value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submitEmail()} type="email" placeholder="your@email.com"
                style={{ flex:1, border:"none", outline:"none", padding:"14px 18px", fontFamily:"DM Sans,sans-serif", fontSize:"0.88rem", color:ink, background:"transparent" }} />
              <button onClick={submitEmail} style={{ background:orange, border:"none", color:white, padding:"14px 22px", fontFamily:"Syne,sans-serif", fontSize:"0.85rem", fontWeight:700, cursor:"pointer", letterSpacing:"0.02em", whiteSpace:"nowrap", transition:"background 0.15s" }}
                onMouseOver={e=>e.currentTarget.style.background=orangeL} onMouseOut={e=>e.currentTarget.style.background=orange}>
                Get Early Access
              </button>
            </div>
          ) : (
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:greenGlow, border:`1px solid rgba(34,197,94,0.25)`, borderRadius:12, padding:"14px 24px", marginBottom:12 }}>
              <span style={{ color:green }}>✓</span>
              <span style={{ fontFamily:"DM Mono,monospace", fontSize:"0.68rem", color:green, letterSpacing:"0.1em" }}>YOU'RE ON THE LIST — WE'LL BE IN TOUCH</span>
            </div>
          )}
          <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.56rem", color:muted, letterSpacing:"0.1em" }}>NO SPAM. NO UPSELLS. JUST THE CALL.</div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:navy, borderTop:`1px solid ${navyBorder}`, padding:"48px 40px 32px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:40, marginBottom:40 }}>
            <div>
              <div style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"1.05rem", letterSpacing:"0.04em", display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <span style={{ width:8, height:8, borderRadius:"50%", background:orange, boxShadow:`0 0 8px ${orange}`, display:"inline-block" }} /> sidework
              </div>
              <p style={{ fontSize:"0.78rem", color:muted, lineHeight:1.7, maxWidth:230, marginBottom:18 }}>
                The job board built for people who've spent years in hospitality and are ready for what's next.
              </p>
              <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.56rem", color:muted, letterSpacing:"0.08em" }}>hello@sidework.io</div>
            </div>
            {[
              { heading:"For Candidates", links:[["Skills Evaluation","/evaluate"],["Browse Jobs","/jobs"],["Build Profile","/profile"],["Pricing","/pricing"],["Sign Up","/auth"]] },
              { heading:"For Employers",  links:[["Post a Job","/employer"],["Company Profile","/employer"],["Browse Candidates","/employer"],["Pricing","/pricing"],["Sign Up","/auth"]] },
              { heading:"Company",        links:[["About","/#about"],["Blog","/#blog"],["Press","/#press"],["Careers","/#careers"],["Contact","mailto:hello@sidework.io"]] },
            ].map(col => (
              <div key={col.heading}>
                <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.56rem", color:muted, letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:14 }}>{col.heading}</div>
                <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
                  {col.links.map(([l, href]) => (
                    <span key={l} className="footer-link" onClick={() => href.startsWith("mailto:") ? window.location.href=href : navigate(href)} style={{ fontSize:"0.8rem", color:"rgba(255,255,255,0.45)", cursor:"pointer", transition:"color 0.15s" }}>{l}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop:`1px solid ${navyBorder}`, paddingTop:20, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
            <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.56rem", color:muted, letterSpacing:"0.08em" }}>© 2026 SIDEWORK · IT'S LAST CALL. NOW WHAT?</div>
            <div style={{ display:"flex", gap:20 }}>
              {["Privacy Policy","Terms of Service","Cookie Policy"].map(l => (
                <span key={l} className="footer-link" style={{ fontFamily:"DM Mono,monospace", fontSize:"0.54rem", color:muted, cursor:"pointer", letterSpacing:"0.06em", transition:"color 0.15s" }}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
