import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    id: "role", pun: "☕ First things first",
    text: "What best describes your primary role in hospitality?",
    type: "single",
    options: [
      { letter: "A", text: "Bartender / Bar Back", sub: "Front bar, craft cocktails, or volume" },
      { letter: "B", text: "Server / FOH Staff", sub: "Tables, floor, guest experience" },
      { letter: "C", text: "Manager / Supervisor", sub: "Shift lead, floor manager, GM" },
      { letter: "D", text: "Owner / Operator", sub: "You ran the whole show" },
    ]
  },
  {
    id: "years", pun: "🍺 Aging like a fine whiskey",
    text: "How many years did you spend in the industry?",
    type: "single",
    options: [
      { letter: "A", text: "1–3 years", sub: "Getting your feet wet" },
      { letter: "B", text: "4–7 years", sub: "Found your groove" },
      { letter: "C", text: "8–12 years", sub: "A seasoned veteran" },
      { letter: "D", text: "13+ years", sub: "The industry is part of you" },
    ]
  },
  {
    id: "conflict", pun: "🔥 Your de-escalation degree",
    text: "How often did you handle difficult guests or high-pressure situations?",
    context: "Think: drunk guests, complaints, kitchen fires (literal or figurative), understaffed Saturdays.",
    type: "single",
    options: [
      { letter: "A", text: "Occasionally", sub: "A few times a month" },
      { letter: "B", text: "Regularly", sub: "Weekly — part of the job" },
      { letter: "C", text: "Constantly", sub: "Every single shift" },
      { letter: "D", text: "I was the one others called", sub: "Go-to when things went sideways" },
    ]
  },
  {
    id: "team", pun: "👥 Your crew",
    text: "Did you hire, train, or manage other staff?",
    type: "single",
    options: [
      { letter: "A", text: "No — individual contributor", sub: "Focused on my own performance" },
      { letter: "B", text: "Informal training only", sub: "Showed new people the ropes" },
      { letter: "C", text: "Yes — trained and supervised", sub: "Responsible for others' performance" },
      { letter: "D", text: "Yes — full hiring through firing", sub: "Built and managed teams" },
    ]
  },
  {
    id: "money", pun: "💰 The bottom line",
    text: "How much visibility did you have into the business's finances?",
    context: "Pour costs, labor percentages, weekly P&L, ordering budgets — all count.",
    type: "single",
    options: [
      { letter: "A", text: "None — not my department", sub: "Focused on guests and service" },
      { letter: "B", text: "Some — pour costs and waste", sub: "Aware of key cost metrics" },
      { letter: "C", text: "Significant — labor and inventory", sub: "Managed real budget line items" },
      { letter: "D", text: "Full — I owned the P&L", sub: "Revenue, cost, payroll — all of it" },
    ]
  },
  {
    id: "sales", pun: "📈 The upsell",
    text: "How intentional were you about driving revenue per guest?",
    type: "single",
    options: [
      { letter: "A", text: "Not really my focus", sub: "Took orders, kept guests happy" },
      { letter: "B", text: "Occasional suggestions", sub: "Recommended things when it felt right" },
      { letter: "C", text: "Consistent and intentional", sub: "Premium pours, add-ons, specials" },
      { letter: "D", text: "I built the upsell strategy", sub: "Trained others, tracked results" },
    ]
  },
  {
    id: "chaos", pun: "🌪️ The Saturday test",
    text: "No-call no-show, full house, system down. What do you do?",
    type: "single",
    options: [
      { letter: "A", text: "Follow whoever's in charge", sub: "Look to leadership for direction" },
      { letter: "B", text: "Focus on my station", sub: "Head down, do my part" },
      { letter: "C", text: "Adapt and cover gaps", sub: "Jump where needed, figure it out" },
      { letter: "D", text: "I become the plan", sub: "Rally the team, make calls, execute" },
    ]
  },
  {
    id: "relationships", pun: "🤝 Your regulars",
    text: "How strong were your relationships with repeat guests?",
    context: "Regulars who asked for you by name, followed you to a new spot, or brought friends because of you.",
    type: "single",
    options: [
      { letter: "A", text: "Friendly but transactional", sub: "Good service, not deep connections" },
      { letter: "B", text: "A handful of real regulars", sub: "Knew their names and orders" },
      { letter: "C", text: "Strong loyal following", sub: "They followed me, not the bar" },
      { letter: "D", text: "My network was the business", sub: "Community building was my superpower" },
    ]
  },
  {
    id: "vendors", pun: "📦 Back of house negotiations",
    text: "Did you work with vendors, reps, or external partners?",
    type: "single",
    options: [
      { letter: "A", text: "No vendor exposure", sub: "Not part of my role" },
      { letter: "B", text: "Some — receiving orders, checking invoices", sub: "Basic vendor interaction" },
      { letter: "C", text: "Regular relationships with reps", sub: "Tastings, ordering, negotiations" },
      { letter: "D", text: "Full vendor management", sub: "Contracts, pricing, multiple partners" },
    ]
  },
  {
    id: "story", pun: "🍸 The last call story",
    text: "What's the one thing you did in hospitality that no resume has ever captured?",
    context: "Could be a moment, a skill, a habit, a situation you navigated. Don't be modest.",
    type: "text",
    placeholder: "The night we were down three staff and I...",
  }
];

const roleMap = { A: "Bartender/Bar Back", B: "Server/FOH Staff", C: "Manager/Supervisor", D: "Owner/Operator" };
const yearsMap = { A: "1–3 years", B: "4–7 years", C: "8–12 years", D: "13+ years" };
const conflictMap = { A: "Occasionally", B: "Regularly", C: "Constantly", D: "Go-to person for crisis" };
const teamMap = { A: "Individual contributor", B: "Informal training only", C: "Trained and supervised", D: "Full hire-through-fire management" };
const moneyMap = { A: "No financial visibility", B: "Pour costs awareness", C: "Managed labor/inventory budgets", D: "Full P&L ownership" };
const salesMap = { A: "Not sales-focused", B: "Occasional suggestions", C: "Consistent intentional upselling", D: "Built upsell strategy" };
const chaosMap = { A: "Follows leadership", B: "Focuses on own station", C: "Adapts and covers gaps", D: "Becomes the plan" };
const relMap = { A: "Friendly but transactional", B: "Handful of real regulars", C: "Strong loyal following", D: "Community building superpower" };
const vendorMap = { A: "No vendor exposure", B: "Basic receiving/invoices", C: "Regular vendor relationships", D: "Full vendor contract management" };

const loadingPuns = [
  "Translating bar lingo to boardroom speak...",
  "Running your tab through the system...",
  "No 86s on this order...",
  "Counting your pour — the corporate kind...",
  "Checking you against the well...",
  "Ringing in your experience...",
  "Your skills check is almost ready...",
];

const punChips = ["On the house", "No reservations required", "Well-seasoned candidates", "No tipping necessary", "Last call, first step", "Your tab just cleared", "No side work required"];

export default function SideworkEvaluator() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState("intro"); // intro | quiz | loading | results
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [scoreDisplay, setScoreDisplay] = useState(0);
  const [punIdx, setPunIdx] = useState(0);
  const punTimer = useRef(null);
  const scoreTimer = useRef(null);

  const progress = screen === "intro" ? 0 : screen === "loading" || screen === "results" ? 100 : ((currentQ) / questions.length) * 100;

  useEffect(() => {
    if (screen === "loading") {
      punTimer.current = setInterval(() => setPunIdx(i => (i + 1) % loadingPuns.length), 2400);
    }
    return () => clearInterval(punTimer.current);
  }, [screen]);

  useEffect(() => {
    if (result && screen === "results") {
      let count = 0;
      const target = parseInt(result.score) || 0;
      scoreTimer.current = setInterval(() => {
        count = Math.min(count + 2, target);
        setScoreDisplay(count);
        if (count >= target) clearInterval(scoreTimer.current);
      }, 18);
    }
    return () => clearInterval(scoreTimer.current);
  }, [result, screen]);

  const q = questions[currentQ];
  const currentAnswer = answers[q?.id];
  const canProceed = currentAnswer && (q?.type === "text" ? currentAnswer.length >= 10 : true);

  function selectOption(val) {
    setAnswers(a => ({ ...a, [q.id]: val }));
  }

  function goNext() {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
    } else {
      submitEval();
    }
  }

  function goBack() {
    if (currentQ > 0) setCurrentQ(c => c - 1);
  }

  function retake() {
    setCurrentQ(0);
    setAnswers({});
    setResult(null);
    setError(null);
    setScoreDisplay(0);
    setScreen("intro");
  }

  async function submitEval() {
    setScreen("loading");
    const summary = `
Role: ${roleMap[answers.role] || answers.role}
Years: ${yearsMap[answers.years] || answers.years}
Conflict/Crisis handling: ${conflictMap[answers.conflict] || answers.conflict}
Team management: ${teamMap[answers.team] || answers.team}
Financial acumen: ${moneyMap[answers.money] || answers.money}
Sales/Upselling: ${salesMap[answers.sales] || answers.sales}
Crisis response style: ${chaosMap[answers.chaos] || answers.chaos}
Guest relationships: ${relMap[answers.relationships] || answers.relationships}
Vendor experience: ${vendorMap[answers.vendors] || answers.vendors}
Own story: ${answers.story || "Not provided"}
    `.trim();

    const prompt = `You are the AI evaluator for Sidework — a job board for hospitality workers (bartenders, servers, managers, owners) transitioning to careers outside the industry. The brand voice is warm, punchy, honest, and loves hospitality puns. These workers are chronically undervalued. A 2024 University of Surrey study identified 116 unique transferable skills from hospitality work alone. Your job is to help candidates see exactly what they bring and point them toward roles that are actually hiring for those skills right now.

Candidate answers:
${summary}

Return ONLY a raw JSON object — no markdown, no backticks, no explanation. Use this exact structure:

{
  "score": <number 0-100>,
  "tier": "<one of: Line Cook Level | Sous Chef Ready | Executive Chef Material | James Beard Nominee>",
  "headline": "<punchy 6-10 word headline celebrating their value, hospitality pun welcome>",
  "sub": "<one warm honest sentence about what their score means>",
  "scoreDesc": "<one sentence about their tier>",
  "skills": [
    { "raw": "<what they called it in hospitality>", "corporate": "<what corporate calls it>", "level": "<ENTRY | ADV | EXPERT>", "note": "<short italicized line, specific and a little funny>" }
  ],
  "translations": [
    { "from": "<hospitality phrase>", "to": "<corporate translation>" }
  ],
  "roles": [
    { "emoji": "<emoji>", "name": "<realistic job title>", "match": "<XX%>" }
  ],
  "advice": "<3-5 sentences, honest warm specific, references their actual answers, one pun allowed, no corporate fluff>",
  "transferValue": "<HIGH | VERY HIGH | EXCEPTIONAL>"
}

ROLE SUGGESTION RULES — this is the most important part. Match roles to the candidate's actual depth. Do not suggest the same roles regardless of answers. Use this framework:

Entry-level / shorter tenure (1-4 yrs, front-line only): Customer Success Associate, Inside Sales Rep, Patient Services Coordinator, Retail Operations Lead, Administrative Coordinator, Recruiting Coordinator, Hospitality Tech Support Rep

Mid-level / some leadership (4-8 yrs, some training or money visibility): Territory Sales Rep, Account Manager, Client Success Manager, Operations Coordinator, HR Generalist, Event Coordinator, SaaS Customer Success Manager, Patient Experience Coordinator

Senior / deep leadership (8+ yrs, P&L, hiring, vendor mgmt, or ownership): Director of Customer Experience, Revenue Operations Manager, Regional Sales Manager, People & Culture Manager, Operations Manager, Business Development Manager, Hospitality Tech Account Executive, Healthcare Practice Manager

TRENDING PIPELINES to prioritize when the candidate's answers support them:
- SaaS / hospitality tech (Toast, Aloha, Square, OpenTable, SevenRooms, Tripleseat are all actively hiring ex-hospitality people for sales and CS roles — they want people who've actually used the product)
- Healthcare patient experience (hospitals and clinics are aggressively recruiting hospitality crossovers for patient-facing roles — the skill overlap is near-perfect)
- Sales and business development (hospitality workers are natural closers — territory sales, account management, and B2B sales roles are the single most common and successful transition)
- HR, recruiting, and people ops (hiring, onboarding, conflict resolution, and culture-building are things hospitality managers did daily without the title)

SKILL TRANSLATION RULES: Make translations specific and a little dry/funny. Avoid generic ones like "communication skills." Go for the vivid specific version — the thing that actually happened on a shift.

SCORING: Owners/managers with 10+ years and P&L/hiring/vendor experience: 78-95. Managers 5-10 years: 65-78. Experienced front-line 4-8 years with some leadership: 52-65. Newer front-line under 4 years: 40-52. Adjust up if their free-text story is compelling and specific.

OTHER RULES: 5-6 skills, 4-5 translations, 4-5 roles. Tier names use kitchen hierarchy as a fun metaphor. Voice: warm, direct, irreverent, never condescending. One hospitality pun in the advice — max one, make it good.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [{ role: "user", content: prompt }]
        })
      });

      // Check HTTP status first
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errText.slice(0, 200)}`);
      }

      const data = await res.json();

      // Check for API-level error response
      if (data.error) {
        throw new Error(`API error: ${data.error.type} — ${data.error.message}`);
      }

      // Check content exists
      if (!data.content || !Array.isArray(data.content) || data.content.length === 0) {
        throw new Error(`Empty content. Full response: ${JSON.stringify(data).slice(0, 300)}`);
      }

      const raw = data.content.map(b => b.text || "").join("");

      if (!raw.trim()) {
        throw new Error("Model returned empty text");
      }

      // Robustly extract JSON — find the first { and last }
      const firstBrace = raw.indexOf("{");
      const lastBrace = raw.lastIndexOf("}");
      if (firstBrace === -1 || lastBrace === -1) {
        throw new Error(`No JSON found. Raw response: ${raw.slice(0, 300)}`);
      }
      const jsonStr = raw.slice(firstBrace, lastBrace + 1);
      const parsed = JSON.parse(jsonStr);
      setResult(parsed);
      setScreen("results");
    } catch (err) {
      setError(err.message);
      setScreen("results");
    }
  }

  // ── STYLES (inline Tailwind-compatible) ──
  const navy = "#0F1923";
  const navyMid = "#172130";
  const navyCard = "#1E2D3D";
  const navyBorder = "#2A3F55";
  const orange = "#FF5C28";
  const orangeGlow = "rgba(255,92,40,0.15)";
  const muted = "#8A9BB0";
  const cream = "#FAF8F4";
  const ink = "#1A1612";
  const receiptRule = "#E2DDD6";
  const receiptFade = "#9B8E7E";
  const green = "#22C55E";

  const roleLabels = { A: "Bartender", B: "Server/FOH", C: "Manager", D: "Owner/Operator" };
  const yearsLabels = { A: "1–3 YRS", B: "4–7 YRS", C: "8–12 YRS", D: "13+ YRS" };

  return (
    <div style={{ background: navy, minHeight: "100vh", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "white" }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes countUp { from { opacity:0; } to { opacity:1; } }
        .fadeup { animation: fadeUp 0.4s ease forwards; }
        .option-card { transition: all 0.18s; cursor: pointer; }
        .option-card:hover { border-color: rgba(255,92,40,0.5) !important; transform: translateX(4px); }
        .pun-chip:hover { border-color: ${orange} !important; color: ${orange} !important; background: ${orangeGlow} !important; cursor: default; }
        .role-item:hover { border-color: rgba(255,92,40,0.35) !important; background: ${orangeGlow} !important; cursor: pointer; }
        .btn-start:hover { background: #FF7A4A !important; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(255,92,40,0.5) !important; }
        .btn-next:hover:not(:disabled) { background: #FF7A4A !important; transform: translateY(-1px); }
        .btn-primary:hover { background: #FF7A4A !important; transform: translateY(-2px); }
        textarea:focus { border-color: ${orange} !important; outline: none; }
        @keyframes lineReveal { from { opacity:0; transform:scaleX(0); } to { opacity:1; transform:scaleX(1); } }
        @keyframes punFade { 0%,100%{opacity:0;transform:translateY(8px)} 15%,80%{opacity:1;transform:translateY(0)} }
        .pun-anim { animation: punFade 2.4s ease-in-out; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .pulse { animation: pulse 2s ease-in-out infinite; }
      `}</style>

      {/* TOPBAR */}
      <div style={{ background: navyMid, borderBottom: `1px solid ${navyBorder}`, height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1.05rem", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: orange, boxShadow: `0 0 8px ${orange}`, display: "inline-block" }} />
          Sidework
        </div>
        <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.62rem", color: muted, letterSpacing: "0.15em", background: "rgba(255,255,255,0.05)", border: `1px solid ${navyBorder}`, padding: "4px 12px", borderRadius: 20 }}>
          SKILLS EVALUATOR — ON THE HOUSE
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div style={{ height: 3, background: navyBorder }}>
        <div style={{ height: "100%", background: `linear-gradient(90deg, ${orange}, #FF7A4A)`, width: `${progress}%`, transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)", boxShadow: `0 0 8px rgba(255,92,40,0.5)` }} />
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "44px 24px 80px" }}>

        {/* ══ INTRO ══ */}
        {screen === "intro" && (
          <div className="fadeup">
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.62rem", letterSpacing: "0.25em", color: orange, textTransform: "uppercase", marginBottom: 14 }}>Free Skills Evaluation</div>
            <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.08, letterSpacing: "-0.02em", marginBottom: 18 }}>
              You've been<br /><span style={{ color: orange }}>86'd from ordinary.</span>
            </h1>
            <p style={{ fontSize: "0.95rem", color: muted, lineHeight: 1.75, maxWidth: 520, marginBottom: 32 }}>
              Five minutes. Ten questions. One honest look at what you actually built behind that bar, on that floor, in that kitchen. We'll translate it into language corporate America understands — and show you exactly where you belong.
            </p>

            {/* Pun chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36 }}>
              {punChips.map(p => (
                <span key={p} className="pun-chip" style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${navyBorder}`, color: muted, fontSize: "0.73rem", fontFamily: "DM Mono, monospace", padding: "5px 13px", borderRadius: 20, letterSpacing: "0.04em", transition: "all 0.2s" }}>{p}</span>
              ))}
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 36 }}>
              {[["10", "Questions\nNo fluff"], ["5min", "Faster than\na Saturday side work"], ["100%", "Free. No cover\ncharge. Ever."]].map(([val, label]) => (
                <div key={val} style={{ background: navyCard, border: `1px solid ${navyBorder}`, borderRadius: 12, padding: "18px 16px", textAlign: "center" }}>
                  <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1.6rem", color: "white" }}>{val}</div>
                  <div style={{ fontSize: "0.72rem", color: muted, marginTop: 4, lineHeight: 1.4, whiteSpace: "pre-line" }}>{label}</div>
                </div>
              ))}
            </div>

            <button className="btn-start" onClick={() => { setScreen("quiz"); setCurrentQ(0); }} style={{ background: orange, border: "none", color: "white", padding: "15px 34px", borderRadius: 12, fontFamily: "Syne, sans-serif", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 20px rgba(255,92,40,0.4)`, letterSpacing: "0.02em", transition: "all 0.2s" }}>
              Open My Tab →
            </button>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.62rem", color: muted, marginTop: 12, letterSpacing: "0.08em" }}>No signup required to see your results</div>
          </div>
        )}

        {/* ══ QUIZ ══ */}
        {screen === "quiz" && q && (
          <div className="fadeup" key={currentQ}>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.62rem", color: muted, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
              <span>Question {currentQ + 1} of {questions.length}</span>
              <span style={{ color: orange, fontSize: "0.68rem" }}>{q.pun}</span>
            </div>

            <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "clamp(1.2rem, 3vw, 1.65rem)", lineHeight: 1.25, marginBottom: 20, letterSpacing: "-0.01em" }}>{q.text}</h2>

            {q.context && (
              <div style={{ fontSize: "0.8rem", color: muted, marginBottom: 24, lineHeight: 1.6, fontStyle: "italic", padding: "11px 16px", background: "rgba(255,255,255,0.03)", borderLeft: `3px solid ${navyBorder}`, borderRadius: "0 8px 8px 0" }}>{q.context}</div>
            )}

            {/* Single choice */}
            {q.type === "single" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 32 }}>
                {q.options.map(opt => {
                  const selected = currentAnswer === opt.letter;
                  return (
                    <div key={opt.letter} className="option-card" onClick={() => selectOption(opt.letter)}
                      style={{ background: selected ? orangeGlow : navyCard, border: `1.5px solid ${selected ? orange : navyBorder}`, borderRadius: 12, padding: "15px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${selected ? orange : navyBorder}`, background: selected ? orange : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Mono, monospace", fontSize: "0.7rem", color: selected ? "white" : muted, flexShrink: 0, transition: "all 0.15s" }}>{opt.letter}</div>
                      <div>
                        <div style={{ fontSize: "0.88rem", color: "white", lineHeight: 1.4 }}>{opt.text}</div>
                        <div style={{ fontSize: "0.7rem", color: muted, marginTop: 2 }}>{opt.sub}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Text input */}
            {q.type === "text" && (
              <div style={{ marginBottom: 32 }}>
                <textarea
                  rows={4}
                  placeholder={q.placeholder}
                  value={currentAnswer || ""}
                  onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
                  style={{ width: "100%", background: navyCard, border: `1.5px solid ${navyBorder}`, borderRadius: 12, padding: "15px 18px", color: "white", fontFamily: "DM Sans, sans-serif", fontSize: "0.9rem", lineHeight: 1.6, resize: "none", transition: "border-color 0.18s" }}
                />
              </div>
            )}

            {/* Nav */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={goBack} style={{ visibility: currentQ === 0 ? "hidden" : "visible", background: "transparent", border: `1px solid ${navyBorder}`, color: muted, padding: "11px 20px", borderRadius: 10, fontFamily: "DM Sans, sans-serif", fontSize: "0.83rem", cursor: "pointer" }}>← Back</button>
              <button className="btn-next" onClick={goNext} disabled={!canProceed}
                style={{ background: canProceed ? orange : navyBorder, border: "none", color: canProceed ? "white" : muted, padding: "12px 26px", borderRadius: 10, fontFamily: "Syne, sans-serif", fontSize: "0.88rem", fontWeight: 700, cursor: canProceed ? "pointer" : "not-allowed", boxShadow: canProceed ? `0 3px 12px rgba(255,92,40,0.35)` : "none", transition: "all 0.18s", letterSpacing: "0.02em" }}>
                {currentQ === questions.length - 1 ? "Get My Skills Check →" : "Next →"}
              </button>
            </div>
          </div>
        )}

        {/* ══ LOADING ══ */}
        {screen === "loading" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center", gap: 28 }}>
            {/* Receipt animation */}
            <div style={{ width: 110, background: cream, borderRadius: 4, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", overflow: "hidden" }}>
              <div style={{ height: 20, background: ink }} />
              <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 7 }}>
                {[80,60,90,50,70,40,65].map((w, i) => (
                  <div key={i} style={{ height: 6, background: receiptRule, borderRadius: 3, width: `${w}%`, animation: `lineReveal 0.5s ease ${0.2 + i * 0.3}s forwards`, opacity: 0, transformOrigin: "left" }} />
                ))}
              </div>
            </div>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1.2rem" }}>Printing your skills check...</div>
            <div key={punIdx} className="pun-anim" style={{ fontFamily: "DM Mono, monospace", fontSize: "0.72rem", color: muted, letterSpacing: "0.08em" }}>{loadingPuns[punIdx]}</div>
          </div>
        )}

        {/* ══ RESULTS ══ */}
        {screen === "results" && (
          <div>
            {error ? (
              <div>
                <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1.8rem", marginBottom: 16 }}>Something went wrong in the kitchen.</h2>
                <div style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: 10, padding: "16px 20px", fontSize: "0.85rem", color: "#FCA5A5", lineHeight: 1.6 }}>
                  We couldn't connect to the evaluator right now. Try refreshing and submitting again.<br /><br /><em>Error: {error}</em>
                </div>
                <button onClick={retake} style={{ marginTop: 16, background: "transparent", border: `1px solid ${navyBorder}`, color: muted, padding: "10px 20px", borderRadius: 10, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>← Retake the Evaluation</button>
              </div>
            ) : result ? (
              <div>
                {/* Header */}
                <div className="fadeup" style={{ marginBottom: 28 }}>
                  <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.62rem", color: green, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", width: 20, height: 20, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem" }}>✓</span>
                    Skills Check Complete
                  </div>
                  <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "clamp(1.6rem, 4vw, 2.4rem)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 8 }}>{result.headline}</h2>
                  <p style={{ fontSize: "0.88rem", color: muted, lineHeight: 1.6 }}>{result.sub}</p>
                </div>

                {/* Score card */}
                <div className="fadeup" style={{ background: `linear-gradient(135deg, ${navyCard} 0%, rgba(255,92,40,0.07) 100%)`, border: "1px solid rgba(255,92,40,0.3)", borderRadius: 16, padding: "24px 28px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
                  <div>
                    <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.62rem", color: muted, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>Transferability Score</div>
                    <div style={{ fontFamily: "Syne, sans-serif", fontSize: "1.25rem", fontWeight: 800, marginBottom: 5 }}>{result.tier}</div>
                    <div style={{ fontSize: "0.82rem", color: muted, lineHeight: 1.55 }}>{result.scoreDesc}</div>
                  </div>
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <div style={{ fontFamily: "Syne, sans-serif", fontSize: "3rem", fontWeight: 800, color: orange, lineHeight: 1 }}>{scoreDisplay}</div>
                    <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.62rem", color: muted, letterSpacing: "0.1em", marginTop: 4 }}>/100</div>
                  </div>
                </div>

                {/* Guest Check */}
                <div className="fadeup" style={{ background: cream, color: ink, borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.4)", marginBottom: 20 }}>
                  <div style={{ background: ink, padding: "16px 22px", textAlign: "center" }}>
                    <div style={{ fontFamily: "Syne, sans-serif", fontSize: "1.15rem", fontWeight: 800, color: cream, letterSpacing: "0.1em" }}>SIDEWORK</div>
                    <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.55rem", color: "rgba(250,248,244,0.4)", letterSpacing: "0.2em", marginTop: 3 }}>YOUR SKILLS CHECK — KEEP THIS RECEIPT</div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 22px", borderBottom: `1px solid ${receiptRule}`, background: "rgba(26,22,18,0.04)" }}>
                    {[["ROLE", roleLabels[answers.role] || "Hospitality Pro"], ["EXP", yearsLabels[answers.years] || "—"], ["STATUS", "READY"]].map(([label, val]) => (
                      <div key={label} style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: receiptFade, letterSpacing: "0.06em" }}>
                        {label}<strong style={{ display: "block", color: ink, marginTop: 2, fontSize: "0.64rem" }}>{val}</strong>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: "16px 22px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "DM Mono, monospace", fontSize: "0.56rem", color: receiptFade, letterSpacing: "0.12em", textTransform: "uppercase", paddingBottom: 7, borderBottom: `1px solid ${receiptRule}`, marginBottom: 4 }}>
                      <span>SKILL</span><span>LEVEL</span>
                    </div>
                    {(result.skills || []).map((s, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "7px 0", borderBottom: `1px dotted ${receiptRule}`, gap: 12 }}>
                        <div>
                          <div style={{ fontSize: "0.78rem", fontWeight: 600, color: ink, fontFamily: "DM Sans, sans-serif" }}>{s.raw}</div>
                          <div style={{ fontSize: "0.63rem", color: receiptFade, fontStyle: "italic", marginTop: 1 }}>{s.note}</div>
                        </div>
                        <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.63rem", color: ink, whiteSpace: "nowrap", paddingTop: 2, fontWeight: 500 }}>{s.level}</div>
                      </div>
                    ))}
                    <div style={{ paddingTop: 10, marginTop: 4, borderTop: `2px solid ${ink}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "DM Mono, monospace", fontSize: "0.63rem", color: receiptFade, padding: "3px 0" }}>
                        <span>TRANSFERABLE VALUE</span><span>{result.transferValue}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "DM Mono, monospace", fontSize: "0.77rem", color: ink, fontWeight: 700, borderTop: `1px solid ${receiptRule}`, paddingTop: 7, marginTop: 5 }}>
                        <span>TOTAL WORTH</span><span>PRICELESS</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ background: ink, color: cream, padding: "10px 22px", textAlign: "center", fontFamily: "DM Mono, monospace", fontSize: "0.57rem", letterSpacing: "0.14em", opacity: 0.9 }}>
                    IT'S LAST CALL. NOW WHAT? — SIDEWORK.IO
                  </div>
                </div>

                {/* Translations */}
                {result.translations?.length > 0 && (
                  <div className="fadeup" style={{ background: navyCard, border: `1px solid ${navyBorder}`, borderRadius: 14, padding: 24, marginBottom: 16 }}>
                    <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: orange, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                      Skill Translations <span style={{ flex: 1, height: 1, background: navyBorder, display: "inline-block" }} />
                    </div>
                    {result.translations.map((t, i) => (
                      <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 24px 1fr", gap: 10, alignItems: "start", padding: "9px 0", borderBottom: i < result.translations.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                        <div style={{ fontSize: "0.8rem", color: muted, lineHeight: 1.45 }}>{t.from}</div>
                        <div style={{ color: orange, textAlign: "center", paddingTop: 2 }}>→</div>
                        <div style={{ fontSize: "0.8rem", color: "white", fontWeight: 500, lineHeight: 1.45 }}>{t.to}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Roles */}
                {result.roles?.length > 0 && (
                  <div className="fadeup" style={{ background: navyCard, border: `1px solid ${navyBorder}`, borderRadius: 14, padding: 24, marginBottom: 16 }}>
                    <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: orange, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                      Roles Worth Exploring <span style={{ flex: 1, height: 1, background: navyBorder, display: "inline-block" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {result.roles.map((r, i) => (
                        <div key={i} className="role-item" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.15s" }}>
                          <span style={{ fontSize: "1rem" }}>{r.emoji}</span>
                          <span style={{ flex: 1, fontSize: "0.85rem", fontWeight: 500 }}>{r.name}</span>
                          <span style={{ fontFamily: "DM Mono, monospace", fontSize: "0.62rem", color: green }}>{r.match} match</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Advice */}
                {result.advice && (
                  <div className="fadeup" style={{ background: navyCard, border: `1px solid ${navyBorder}`, borderRadius: 14, padding: 24, marginBottom: 20 }}>
                    <div style={{ fontFamily: "DM Mono, monospace", fontSize: "0.58rem", color: orange, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                      Honest Take <span style={{ flex: 1, height: 1, background: navyBorder, display: "inline-block" }} />
                    </div>
                    <div style={{ fontSize: "0.87rem", color: "#E2E8F0", lineHeight: 1.75 }}>{result.advice}</div>
                  </div>
                )}

                {/* CTA */}
                <div className="fadeup" style={{ background: `linear-gradient(135deg, ${navyCard} 0%, rgba(255,92,40,0.06) 100%)`, border: "1px solid rgba(255,92,40,0.25)", borderRadius: 16, padding: "28px 32px", textAlign: "center", marginBottom: 16 }}>
                  <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1.15rem", marginBottom: 8 }}>Your tab is clear. Time to open a new one.</h3>
                  <p style={{ fontSize: "0.83rem", color: muted, marginBottom: 20, lineHeight: 1.6 }}>Build your full Sidework profile and get matched with employers who actually get it.</p>
                  <button className="btn-primary" style={{ background: orange, border: "none", color: "white", padding: "14px 30px", borderRadius: 12, fontFamily: "Syne, sans-serif", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 18px rgba(255,92,40,0.4)`, letterSpacing: "0.02em", transition: "all 0.18s" }}>
                    Build My Full Profile →
                  </button>
                  <br />
                  <button onClick={retake} style={{ marginTop: 12, background: "transparent", border: `1px solid ${navyBorder}`, color: muted, padding: "9px 20px", borderRadius: 10, fontFamily: "DM Sans, sans-serif", fontSize: "0.8rem", cursor: "pointer", transition: "all 0.15s" }}>← Retake the Evaluation</button>
                </div>
              </div>
            ) : null}
          </div>
        )}

      </div>
    </div>
  );
}
