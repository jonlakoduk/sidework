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
const ink        = "#1A1612";
const cream      = "#FAF8F4";

// ── DATA ───────────────────────────────────────────────────────────────
const EMPLOYER_PLANS = [
  {
    id: "starter",
    name: "Starter",
    tag: null,
    monthly: 149,
    annual: 119,
    desc: "For companies testing the platform or hiring occasionally.",
    pun: "Dip your toe in the well.",
    cta: "Start Free Trial",
    color: muted,
    features: [
      { text: "2 active job postings", included: true },
      { text: "Hospitality translation on all posts", included: true },
      { text: "Basic candidate matching", included: true },
      { text: "Company profile page", included: true },
      { text: "Verified employer badge", included: false },
      { text: "Messaging with candidates", included: false },
      { text: "Analytics dashboard", included: false },
      { text: "Priority placement in search", included: false },
      { text: "Passive candidate pool access", included: false },
      { text: "Featured homepage placement", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tag: "Most Popular",
    monthly: 349,
    annual: 279,
    desc: "For companies with consistent hospitality hiring needs.",
    pun: "You've found your groove.",
    cta: "Start Free Trial",
    color: orange,
    features: [
      { text: "5 active job postings", included: true },
      { text: "Hospitality translation on all posts", included: true },
      { text: "Full candidate matching + AI skill tagging", included: true },
      { text: "Company profile page", included: true },
      { text: "Verified employer badge", included: true },
      { text: "Messaging with candidates", included: true },
      { text: "Analytics dashboard", included: true },
      { text: "Priority placement in search", included: true },
      { text: "Passive candidate pool access", included: false },
      { text: "Featured homepage placement", included: false },
    ],
  },
  {
    id: "partner",
    name: "Partner",
    tag: "Best Value",
    monthly: 699,
    annual: 559,
    desc: "For high-volume hirers ready to own the space.",
    pun: "Last call for the competition.",
    cta: "Talk to Us",
    color: amber,
    features: [
      { text: "Unlimited job postings", included: true },
      { text: "Hospitality translation on all posts", included: true },
      { text: "Full candidate matching + AI skill tagging", included: true },
      { text: "Company profile page", included: true },
      { text: "Verified employer badge", included: true },
      { text: "Messaging with candidates", included: true },
      { text: "Analytics dashboard", included: true },
      { text: "Priority placement in search", included: true },
      { text: "Passive candidate pool access", included: true },
      { text: "Featured homepage placement", included: true },
    ],
  },
];

const CANDIDATE_PLANS = [
  {
    id: "free",
    name: "Free",
    tag: null,
    monthly: 0,
    annual: 0,
    desc: "Everything you need to get started. No card required.",
    pun: "On the house.",
    cta: "Get Started Free",
    color: green,
    features: [
      { text: "Skills evaluation", included: true },
      { text: "Full profile builder", included: true },
      { text: "Browse and apply to all jobs", included: true },
      { text: "Guest check visual download", included: true },
      { text: "Basic employer activity (who viewed)", included: true },
      { text: "See who searched but didn't visit", included: false },
      { text: "Instant employer view notifications", included: false },
      { text: "Profile boost in employer search", included: false },
      { text: "Pro candidate badge on applications", included: false },
      { text: "AI cover letter assistant", included: false },
    ],
  },
  {
    id: "candidate_pro",
    name: "Pro",
    tag: "Most Popular",
    monthly: 9,
    annual: 79,
    desc: "For candidates who are serious about making the move.",
    pun: "No side work required.",
    cta: "Upgrade to Pro",
    color: orange,
    features: [
      { text: "Skills evaluation", included: true },
      { text: "Full profile builder", included: true },
      { text: "Browse and apply to all jobs", included: true },
      { text: "Guest check visual download", included: true },
      { text: "Basic employer activity (who viewed)", included: true },
      { text: "See who searched but didn't visit", included: true },
      { text: "Instant employer view notifications", included: true },
      { text: "Profile boost in employer search", included: true },
      { text: "Pro candidate badge on applications", included: true },
      { text: "AI cover letter assistant", included: true },
    ],
  },
];

const SINGLE_POST = {
  price: 199,
  features: ["1 job posting (30 days)", "Full hospitality translation", "Candidate matching", "Basic messaging"],
};

const FAQS = [
  { q: "Is the skills evaluation really free?", a: "Always. No account required to see your results. We think you should know what you bring to the table before you commit to anything." },
  { q: "What does the hospitality translation actually do?", a: "When employers post a job, we rewrite the listing in language that resonates with hospitality workers — connecting corporate requirements to the specific skills you built on shift. Candidates see the hospitality version first, with the standard description one click away." },
  { q: "Can I cancel anytime?", a: "Yes. No contracts, no cancellation fees. Monthly plans cancel at end of billing period. Annual plans are non-refundable but you keep access through the end of the year." },
  { q: "How does the candidate Pro badge work?", a: "Pro candidates get a visible badge on their applications and profile. Employers see this as a signal of a serious, committed candidate — it's the equivalent of being first in line when the doors open." },
  { q: "What's the difference between viewed and searched?", a: "Free candidates see when an employer clicked their profile. Pro candidates also see when an employer ran a search that matched their skills — even if they didn't visit. That's the warm lead list." },
  { q: "Do you offer refunds on single job posts?", a: "If your post receives zero candidate matches in 30 days, we'll extend it free for another 30. If it still gets no matches, we'll refund you. We're confident that won't happen." },
];

// ── MAIN ───────────────────────────────────────────────────────────────
export default function Pricing() {
  const navigate = useNavigate();
  const [billing,   setBilling]   = useState("monthly"); // monthly | annual
  const [side,      setSide]      = useState("candidate"); // candidate | employer
  const [openFaq,   setOpenFaq]   = useState(null);

  const plans = side === "employer" ? EMPLOYER_PLANS : CANDIDATE_PLANS;
  const savings = side === "employer"
    ? { starter: (149-119)*12, pro: (349-279)*12, partner: (699-559)*12 }
    : { free: 0, candidate_pro: (9*12)-79 };

  return (
    <div style={{ background: navy, minHeight: "100vh", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: white }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .plan-card { transition: transform 0.2s, box-shadow 0.2s; }
        .plan-card:hover { transform: translateY(-4px); }
        .faq-row { transition: background 0.15s; cursor: pointer; }
        .faq-row:hover { background: rgba(255,255,255,0.03) !important; }
        .tab:hover { color: ${white} !important; }
        .billing-toggle:hover { border-color: rgba(255,255,255,0.2) !important; }
        .cta-primary:hover { background: ${orangeL} !important; transform: translateY(-1px); }
        .cta-ghost:hover { border-color: rgba(255,255,255,0.25) !important; color: ${white} !important; }
      `}</style>

      {/* TOPBAR */}
      <div style={{ background: navyMid, borderBottom: `1px solid ${navyBorder}`, height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.05rem", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: orange, boxShadow: `0 0 8px ${orange}`, display: "inline-block" }} onClick={() => navigate("/")} style={{cursor:"pointer"}} />
          sidework
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="cta-ghost" onClick={() => navigate("/auth")} style={{ background: "transparent", border: `1px solid ${navyBorder}`, color: muted, padding: "6px 16px", borderRadius: 8, fontFamily: "DM Sans,sans-serif", fontSize: "0.8rem", cursor: "pointer", transition: "all 0.15s" }}>Sign In</button>
          <button className="cta-primary" onClick={() => navigate("/auth")} style={{ background: orange, border: "none", color: white, padding: "6px 16px", borderRadius: 8, fontFamily: "Syne,sans-serif", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", transition: "all 0.15s", boxShadow: `0 2px 8px rgba(255,92,40,0.3)` }}>Get Started Free</button>
        </div>
      </div>

      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "56px 24px 80px" }}>

        {/* HERO */}
        <div style={{ textAlign: "center", marginBottom: 48, animation: "fadeUp 0.4s ease both" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: orangeGlow, border: `1px solid rgba(255,92,40,0.25)`, borderRadius: 20, padding: "5px 14px", fontFamily: "DM Mono,monospace", fontSize: "0.6rem", color: orange, letterSpacing: "0.12em", marginBottom: 18 }}>
            ✦ NO CONTRACTS · CANCEL ANYTIME
          </div>
          <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "clamp(2rem,5vw,3rem)", letterSpacing: "-0.02em", lineHeight: 1.08, marginBottom: 14 }}>
            Transparent pricing.<br /><span style={{ color: orange }}>No cover charge.</span>
          </h1>
          <p style={{ fontSize: "0.95rem", color: muted, lineHeight: 1.75, maxWidth: 480, margin: "0 auto 32px" }}>
            Candidates are always free to evaluate, build, browse, and apply. Employers pay for the access, the translation, and the match quality.
          </p>

          {/* Side toggle */}
          <div style={{ display: "inline-flex", background: navyCard, border: `1px solid ${navyBorder}`, borderRadius: 12, padding: 4, marginBottom: 28 }}>
            {[["candidate","For Candidates"],["employer","For Employers"]].map(([val, label]) => (
              <button key={val} className="tab" onClick={() => setSide(val)}
                style={{ background: side === val ? orange : "transparent", border: "none", color: side === val ? white : muted, padding: "8px 22px", borderRadius: 9, fontFamily: "Syne,sans-serif", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.02em", boxShadow: side === val ? `0 2px 10px rgba(255,92,40,0.3)` : "none" }}>
                {label}
              </button>
            ))}
          </div>

          {/* Billing toggle */}
          {side === "employer" && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
              {["monthly","annual"].map(b => (
                <button key={b} className="billing-toggle" onClick={() => setBilling(b)}
                  style={{ background: "transparent", border: `1px solid ${billing === b ? orange : navyBorder}`, color: billing === b ? orange : muted, padding: "5px 16px", borderRadius: 20, fontFamily: "DM Mono,monospace", fontSize: "0.62rem", cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase", transition: "all 0.15s" }}>
                  {b === "annual" ? "Annual (save ~20%)" : "Monthly"}
                </button>
              ))}
            </div>
          )}
          {side === "candidate" && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
              {[["monthly","Monthly"],["annual","Annual (save $29)"]].map(([b, label]) => (
                <button key={b} className="billing-toggle" onClick={() => setBilling(b)}
                  style={{ background: "transparent", border: `1px solid ${billing === b ? orange : navyBorder}`, color: billing === b ? orange : muted, padding: "5px 16px", borderRadius: 20, fontFamily: "DM Mono,monospace", fontSize: "0.62rem", cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase", transition: "all 0.15s" }}>
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PLAN CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${plans.length}, 1fr)`, gap: 16, marginBottom: 48, animation: "fadeUp 0.4s ease 0.1s both" }}>
          {plans.map((plan, i) => {
            const price = billing === "annual" ? plan.annual : plan.monthly;
            const isHighlight = plan.tag === "Most Popular" || plan.tag === "Best Value";
            const annualSavings = savings[plan.id] || 0;

            return (
              <div key={plan.id} className="plan-card"
                style={{ background: isHighlight ? `linear-gradient(160deg, ${navyCard} 0%, rgba(255,92,40,0.08) 100%)` : navyCard, border: `1.5px solid ${isHighlight ? "rgba(255,92,40,0.4)" : navyBorder}`, borderRadius: 16, overflow: "hidden", position: "relative", boxShadow: isHighlight ? `0 8px 32px rgba(255,92,40,0.15)` : "none" }}>

                {/* Tag badge — always rendered for alignment, invisible when no tag */}
                <div style={{ background: plan.tag ? (isHighlight ? orange : amber) : "transparent", color: plan.tag ? white : "transparent", fontFamily: "DM Mono,monospace", fontSize: "0.56rem", fontWeight: 700, letterSpacing: "0.1em", padding: "5px 0", textAlign: "center", minHeight: "26px" }}>
                  {plan.tag ? plan.tag.toUpperCase() : " "}
                </div>

                <div style={{ padding: "24px 22px", display: "flex", flexDirection: "column" }}>
                  {/* Plan name + pun */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.58rem", color: plan.color, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 6 }}>{plan.name}</div>
                    <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", fontStyle: "italic", marginBottom: 10 }}>"{plan.pun}"</div>
                    <p style={{ fontSize: "0.78rem", color: muted, lineHeight: 1.55, minHeight: "0" }}>{plan.desc}</p>
                  </div>

                  {/* Price */}
                  <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid rgba(255,255,255,0.07)`, minHeight: "100px" }}>
                    {plan.monthly === 0 ? (
                      <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "2.2rem", color: white, lineHeight: 1 }}>Free</div>
                    ) : (
                      <div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                          <span style={{ fontFamily: "DM Mono,monospace", fontSize: "0.85rem", color: muted }}>$</span>
                          <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "2.6rem", color: white, lineHeight: 1 }}>{price}</span>
                        </div>
                        <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.58rem", color: muted, letterSpacing: "0.1em", marginTop: 5 }}>
                          {billing === "annual" ? "PER MONTH · BILLED ANNUALLY" : "PER MONTH"}
                        </div>
                        {billing === "annual" && annualSavings > 0 && (
                          <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.58rem", color: green, letterSpacing: "0.1em", marginTop: 5 }}>
                            ↓ SAVE ${annualSavings}/YEAR
                          </div>
                        )}
                        {billing === "annual" && plan.id === "candidate_pro" && (
                          <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.58rem", color: muted, letterSpacing: "0.06em", marginTop: 4 }}>
                            billed as $79/year
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <button className={isHighlight ? "cta-primary" : "cta-ghost"}
                    style={{ width: "100%", background: isHighlight ? orange : "transparent", border: `1px solid ${isHighlight ? "none" : navyBorder}`, color: isHighlight ? white : muted, padding: "12px", borderRadius: 10, fontFamily: "Syne,sans-serif", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", letterSpacing: "0.02em", transition: "all 0.18s", marginBottom: 20, boxShadow: isHighlight ? `0 3px 12px rgba(255,92,40,0.35)` : "none" }}>
                    {plan.cta}
                  </button>

                  {/* Features */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    {plan.features.map((f, fi) => (
                      <div key={fi} style={{ display: "flex", alignItems: "flex-start", gap: 9, opacity: f.included ? 1 : 0.38 }}>
                        <span style={{ color: f.included ? green : muted, fontSize: "0.75rem", flexShrink: 0, marginTop: 1 }}>{f.included ? "✓" : "–"}</span>
                        <span style={{ fontSize: "0.78rem", color: f.included ? "rgba(255,255,255,0.85)" : muted, lineHeight: 1.45 }}>{f.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* SINGLE POST (employer only) */}
        {side === "employer" && (
          <div style={{ background: navyCard, border: `1px solid ${navyBorder}`, borderRadius: 14, padding: "22px 28px", marginBottom: 48, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap", animation: "fadeUp 0.4s ease 0.2s both" }}>
            <div>
              <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.6rem", color: muted, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6 }}>Just testing the waters?</div>
              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.15rem", marginBottom: 4 }}>Single Job Post — $199</div>
              <div style={{ fontSize: "0.8rem", color: muted, lineHeight: 1.6 }}>One posting, 30 days, full hospitality translation included. No subscription required.</div>
              <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
                {SINGLE_POST.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ color: green, fontSize: "0.68rem" }}>✓</span>
                    <span style={{ fontFamily: "DM Mono,monospace", fontSize: "0.6rem", color: muted, letterSpacing: "0.04em" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <button className="cta-primary" style={{ background: orange, border: "none", color: white, padding: "12px 28px", borderRadius: 10, fontFamily: "Syne,sans-serif", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", letterSpacing: "0.02em", transition: "all 0.18s", boxShadow: `0 3px 12px rgba(255,92,40,0.3)`, whiteSpace: "nowrap" }}>
              Post One Job →
            </button>
          </div>
        )}

        {/* REVENUE MATH (employer only — social proof) */}
        {side === "employer" && (
          <div style={{ background: `linear-gradient(135deg, ${navyCard}, rgba(255,92,40,0.06))`, border: `1px solid rgba(255,92,40,0.2)`, borderRadius: 14, padding: "24px 28px", marginBottom: 48, animation: "fadeUp 0.4s ease 0.25s both" }}>
            <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.58rem", color: orange, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              Why employers choose Sidework <span style={{ flex: 1, height: 1, background: navyBorder, display: "inline-block" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {[
                { stat: "3.2×", label: "Higher retention vs. traditional hires", sub: "Hospitality workers are used to high-pressure environments. They don't quit when it gets hard." },
                { stat: "47 days", label: "Average time to first placement", sub: "Our matching algorithm surfaces the right candidates fast. No resume spray-and-pray." },
                { stat: "$0", label: "Cost to post your first job trial", sub: "14-day free trial on all plans. No card required to see what we can find you." },
              ].map((item, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "2rem", color: orange, marginBottom: 6 }}>{item.stat}</div>
                  <div style={{ fontFamily: "DM Sans,sans-serif", fontWeight: 600, fontSize: "0.82rem", marginBottom: 6, color: white }}>{item.label}</div>
                  <div style={{ fontSize: "0.73rem", color: muted, lineHeight: 1.55 }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CANDIDATE VALUE PROP */}
        {side === "candidate" && (
          <div style={{ background: `linear-gradient(135deg, ${navyCard}, rgba(34,197,94,0.06))`, border: `1px solid rgba(34,197,94,0.2)`, borderRadius: 14, padding: "24px 28px", marginBottom: 48, animation: "fadeUp 0.4s ease 0.2s both" }}>
            <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.58rem", color: green, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              What Pro gets you <span style={{ flex: 1, height: 1, background: navyBorder, display: "inline-block" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { icon: "👁", title: "See who's watching", body: "Free candidates see who clicked. Pro candidates see who searched — the warm leads that never made it to your profile." },
                { icon: "⚡", title: "First in line", body: "Pro badge on every application tells employers you're serious. In a stack of resumes, that signal cuts through." },
                { icon: "📣", title: "Instant alerts", body: "Get notified the moment an employer views or saves your profile. Strike while the iron's hot." },
                { icon: "✍️", title: "AI cover letter", body: "Paste any job description and get a tailored cover letter that translates your hospitality experience into language that fits." },
              ].map((item, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.06)`, borderRadius: 10, padding: "14px 16px" }}>
                  <div style={{ fontSize: "1.2rem", marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.88rem", marginBottom: 5 }}>{item.title}</div>
                  <div style={{ fontSize: "0.75rem", color: muted, lineHeight: 1.6 }}>{item.body}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GUEST CHECK COMPARISON (candidate only) */}
        {side === "candidate" && (
          <div style={{ background: cream, color: ink, borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.3)", marginBottom: 48, animation: "fadeUp 0.4s ease 0.3s both" }}>
            <div style={{ background: ink, padding: "14px 22px", textAlign: "center" }}>
              <div style={{ fontFamily: "Syne,sans-serif", fontSize: "1rem", fontWeight: 800, color: cream, letterSpacing: "0.1em" }}>SIDEWORK</div>
              <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.52rem", color: "rgba(250,248,244,0.4)", letterSpacing: "0.18em", marginTop: 2 }}>FREE VS PRO — WHAT YOU GET</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              {[
                { label: "Free", items: ["Skills evaluation","Full profile","Browse & apply","Basic activity feed"], color: "#4B5563" },
                { label: "Pro — $9/mo", items: ["Everything in Free","Who searched you","Instant alerts","Profile boost","Pro badge","AI cover letter assistant"], color: ink },
              ].map((col, ci) => (
                <div key={ci} style={{ padding: "18px 22px", borderRight: ci === 0 ? `1px solid #E2DDD6` : "none" }}>
                  <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.58rem", color: ci === 1 ? orange : "#9B8E7E", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12, fontWeight: 700 }}>{col.label}</div>
                  {col.items.map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: `1px dotted #E2DDD6`, fontSize: "0.78rem", color: col.color, fontFamily: "DM Sans,sans-serif" }}>
                      <span style={{ color: ci === 1 ? orange : "#9B8E7E", fontSize: "0.7rem" }}>{ci === 1 ? "✦" : "–"}</span>
                      {item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ background: ink, color: cream, padding: "10px 22px", textAlign: "center", fontFamily: "DM Mono,monospace", fontSize: "0.54rem", letterSpacing: "0.14em", opacity: 0.85 }}>
              IT'S LAST CALL. NOW WHAT? — SIDEWORK.IO
            </div>
          </div>
        )}

        {/* FAQ */}
        <div style={{ marginBottom: 48, animation: "fadeUp 0.4s ease 0.3s both" }}>
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "clamp(1.3rem,3vw,1.8rem)", letterSpacing: "-0.01em", marginBottom: 24, textAlign: "center" }}>
            Questions from the floor.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {FAQS.map((faq, i) => (
              <div key={i} className="faq-row" onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ background: openFaq === i ? "rgba(255,255,255,0.03)" : "transparent", borderRadius: 10, padding: "16px 18px", border: `1px solid ${openFaq === i ? navyBorder : "transparent"}`, marginBottom: 2 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.9rem", color: openFaq === i ? white : "rgba(255,255,255,0.8)" }}>{faq.q}</span>
                  <span style={{ color: orange, fontSize: "1rem", flexShrink: 0, transition: "transform 0.2s", transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
                </div>
                {openFaq === i && (
                  <div style={{ marginTop: 12, fontSize: "0.83rem", color: muted, lineHeight: 1.75, animation: "fadeUp 0.2s ease both" }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM CTA */}
        <div style={{ background: `linear-gradient(135deg, ${navyCard}, rgba(255,92,40,0.07))`, border: `1px solid rgba(255,92,40,0.2)`, borderRadius: 16, padding: "36px 28px", textAlign: "center", animation: "fadeUp 0.4s ease 0.35s both" }}>
          <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.6rem", color: orange, letterSpacing: "0.2em", marginBottom: 12 }}>READY TO RING IN?</div>
          <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "clamp(1.4rem,3vw,2rem)", letterSpacing: "-0.01em", marginBottom: 10 }}>
            {side === "employer" ? "Find your next great hire." : "Find your next great role."}
          </h2>
          <p style={{ fontSize: "0.88rem", color: muted, lineHeight: 1.7, maxWidth: 420, margin: "0 auto 24px" }}>
            {side === "employer"
              ? "14-day free trial on all plans. No credit card required. Post your first job in under 10 minutes."
              : "Free to start. Always. No card, no commitment. Just a Skills Check and a profile that actually tells your story."}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="cta-primary" style={{ background: orange, border: "none", color: white, padding: "14px 32px", borderRadius: 12, fontFamily: "Syne,sans-serif", fontSize: "0.92rem", fontWeight: 700, cursor: "pointer", letterSpacing: "0.02em", transition: "all 0.18s", boxShadow: `0 4px 18px rgba(255,92,40,0.38)` }}>
              {side === "employer" ? "Start Free Trial →" : "Take the Skills Evaluation →"}
            </button>
            <button className="cta-ghost" style={{ background: "transparent", border: `1px solid ${navyBorder}`, color: muted, padding: "14px 24px", borderRadius: 12, fontFamily: "DM Sans,sans-serif", fontSize: "0.88rem", cursor: "pointer", transition: "all 0.15s" }}>
              {side === "employer" ? "Talk to Sales" : "Browse Jobs First"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
