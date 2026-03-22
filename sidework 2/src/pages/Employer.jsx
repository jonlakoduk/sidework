import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── CONSTANTS ──────────────────────────────────────────────────────────
const navy     = "#0F1923";
const navyMid  = "#172130";
const navyCard = "#1E2D3D";
const navyBorder = "#2A3F55";
const orange   = "#FF5C28";
const orangeLight = "#FF7A4A";
const orangeGlow  = "rgba(255,92,40,0.12)";
const muted    = "#8A9BB0";
const green    = "#22C55E";
const amber    = "#F59E0B";
const cream    = "#FAF8F4";
const ink      = "#1A1612";
const receiptRule = "#E2DDD6";
const receiptFade = "#9B8E7E";
const white    = "#FFFFFF";

const INDUSTRIES = [
  "Hospitality Tech","SaaS / Software","Healthcare","Sales & BD",
  "HR / People Ops","Event Management","Food & Beverage (corporate)",
  "Retail Operations","Logistics","Finance",
];

const COMP_SIZES = ["1–10","11–50","51–200","201–500","500+"];

const HOSP_SKILLS = [
  "Conflict de-escalation","Consultative upselling","P&L management",
  "Team hiring & training","Vendor negotiation","Crisis response",
  "Customer retention","Inventory management","Event coordination",
  "Revenue optimization","Staff scheduling","Cultural intelligence",
];

const JOB_TYPES   = ["Full-time","Part-time","Contract","Remote","Hybrid","On-site"];
const EXP_LEVELS  = ["Entry-level","Mid-level (3–6 yrs)","Senior (6+ yrs)","Manager","Director+"];
const SALARY_RANGES = [
  "Under $40k","$40–55k","$55–70k","$70–90k","$90–120k","$120k+","DOE",
];

const uid = () => Math.random().toString(36).slice(2, 8);

// ── MOCK MATCHED CANDIDATES ────────────────────────────────────────────
const MOCK_CANDIDATES = [
  { id: 1, name: "Sam T.",    score: 91, tier: "James Beard Nominee",    role: "Bar Manager → Territory Sales",      yrs: "11 yrs", avail: "Immediately",    tags: ["Upselling","Vendor Negotiation","P&L"] },
  { id: 2, name: "Jordan K.", score: 84, tier: "Executive Chef Material", role: "GM → Client Success",                yrs: "8 yrs",  avail: "2 weeks",        tags: ["Team Leadership","Crisis Response","Retention"] },
  { id: 3, name: "Riley M.",  score: 78, tier: "Executive Chef Material", role: "Server → Patient Experience",        yrs: "6 yrs",  avail: "30 days",        tags: ["De-escalation","Cultural Intelligence","Communication"] },
  { id: 4, name: "Casey B.",  score: 71, tier: "Sous Chef Ready",         role: "Bartender → SaaS CS Rep",            yrs: "5 yrs",  avail: "Immediately",    tags: ["Upselling","Customer Retention","Tech-savvy"] },
  { id: 5, name: "Morgan L.", score: 67, tier: "Sous Chef Ready",         role: "Event Staff → Ops Coordinator",      yrs: "4 yrs",  avail: "2 weeks",        tags: ["Event Coordination","Logistics","Adaptability"] },
];

// ── MAIN ───────────────────────────────────────────────────────────────
export default function SideworkEmployer() {
  const navigate = useNavigate();
  const [view, setView] = useState("profile"); // profile | post | dashboard
  const [profileSaved, setProfileSaved] = useState(false);
  const [jobPosted, setJobPosted] = useState(false);

  // Profile state
  const [compName,    setCompName]    = useState("");
  const [compIndustry,setCompIndustry]= useState("");
  const [compSize,    setCompSize]    = useState("");
  const [compWebsite, setCompWebsite] = useState("");
  const [compAbout,   setCompAbout]   = useState("");
  const [compWhy,     setCompWhy]     = useState("");
  const [hiringName,  setHiringName]  = useState("");
  const [hiringTitle, setHiringTitle] = useState("");
  const [hiringEmail, setHiringEmail] = useState("");
  const [hospHires,   setHospHires]   = useState([
    { id: uid(), name: "", fromRole: "", toRole: "", quote: "" }
  ]);

  // Job post state
  const [jobTitle,    setJobTitle]    = useState("");
  const [jobType,     setJobType]     = useState([]);
  const [expLevel,    setExpLevel]    = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobDesc,     setJobDesc]     = useState("");
  const [hospSkills,  setHospSkills]  = useState([]);
  const [translating, setTranslating] = useState(false);
  const [hospTranslation, setHospTranslation] = useState(null);
  const [showStdDesc, setShowStdDesc] = useState(false);

  function toggleJobType(v) {
    setJobType(a => a.includes(v) ? a.filter(x => x !== v) : [...a, v]);
  }
  function toggleHospSkill(v) {
    setHospSkills(a => a.includes(v) ? a.filter(x => x !== v) : [...a, v]);
  }
  function addHire() {
    setHospHires(h => [...h, { id: uid(), name: "", fromRole: "", toRole: "", quote: "" }]);
  }
  function updateHire(id, field, val) {
    setHospHires(h => h.map(x => x.id === id ? { ...x, [field]: val } : x));
  }
  function removeHire(id) {
    setHospHires(h => h.filter(x => x.id !== id));
  }

  async function translateJob() {
    if (!jobTitle || !jobDesc) return;
    setTranslating(true);
    setHospTranslation(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          messages: [{ role: "user", content: `You write job postings for Sidework — a job board where hospitality workers (bartenders, servers, managers, owners) find careers outside the industry. Your job is to take a standard corporate job posting and rewrite it in language that resonates with hospitality workers — connecting the role's requirements to skills they already have from service industry experience.

Job title: ${jobTitle}
Job description: ${jobDesc}
Hospitality skills the employer tagged: ${hospSkills.join(", ") || "none specified"}

Return ONLY raw JSON — no markdown, no backticks:
{
  "hospTitle": "<rewritten job title that connects to hospitality experience, e.g. 'Territory Sales Manager (Your regulars follow you everywhere)'>",
  "hook": "<one punchy sentence that speaks directly to a hospitality worker, references something specific from their world>",
  "whyYouFit": "<3-4 bullet points as a JSON array of strings, each connecting a requirement from the job to a specific hospitality skill. Start each with the hospitality thing, arrow to the corporate need. E.g. 'Running a Saturday night short-staffed → Exactly what operational crisis management looks like here'>",
  "rewrittenDesc": "<the full job description rewritten in hospitality-friendly language, same info but framed around transferable skills. 3-4 short paragraphs. Warm, direct, no corporate jargon.>",
  "skillTags": "<array of 3-5 short hospitality skill phrases this role values>"
}` }]
        })
      });
      const data = await res.json();
      const raw = data.content.map(b => b.text || "").join("");
      const first = raw.indexOf("{"), last = raw.lastIndexOf("}");
      setHospTranslation(JSON.parse(raw.slice(first, last + 1)));
    } catch (e) { /* silent */ }
    setTranslating(false);
  }

  const canSaveProfile = compName && compIndustry && hiringEmail;
  const canPostJob = jobTitle && jobDesc && jobType.length > 0 && expLevel;

  return (
    <div style={{ background: navy, minHeight: "100vh", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: white }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .fadeup { animation: fadeUp 0.38s ease forwards; }
        input:focus, textarea:focus { border-color: ${orange} !important; outline: none; }
        .nav-tab:hover { color: ${white} !important; }
        .chip:hover { border-color:${orange} !important; color:${orange} !important; background:${orangeGlow} !important; cursor:pointer; }
        .chip.on { border-color:${orange} !important; color:${orange} !important; background:${orangeGlow} !important; }
        .cand-row:hover { border-color: rgba(255,92,40,0.35) !important; background: rgba(30,45,61,0.9) !important; }
        .hire-card:hover .hire-remove { opacity:1 !important; }
        @keyframes spin { to{transform:rotate(360deg)} }
        .spin { animation: spin 0.7s linear infinite; display:inline-block; }
        .btn-primary:hover { background: ${orangeLight} !important; transform:translateY(-1px); }
        .btn-ghost:hover { border-color:rgba(255,255,255,0.25) !important; color:${white} !important; }
        .toggle-desc:hover { color:${white} !important; }
      `}</style>

      {/* TOPBAR */}
      <div style={{ background: navyMid, borderBottom: `1px solid ${navyBorder}`, height: 52, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 28px", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"1.05rem", letterSpacing:"0.04em", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ width:8, height:8, borderRadius:"50%", background:orange, boxShadow:`0 0 8px ${orange}`, display:"inline-block" }} onClick={()=>navigate("/")} style={{cursor:"pointer"}} />
          sidework
        </div>
        <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.62rem", color:muted, letterSpacing:"0.15em", background:"rgba(255,255,255,0.05)", border:`1px solid ${navyBorder}`, padding:"4px 12px", borderRadius:20 }}>
          EMPLOYER PORTAL
        </div>
      </div>

      {/* SUB NAV */}
      <div style={{ background:navyMid, borderBottom:`1px solid ${navyBorder}`, display:"flex", gap:0, padding:"0 28px" }}>
        {[
          { id:"profile", label:"Company Profile" },
          { id:"post",    label:"Post a Job" },
          { id:"dashboard", label:"Matched Candidates" },
        ].map(tab => (
          <button key={tab.id} className="nav-tab" onClick={() => setView(tab.id)}
            style={{ background:"transparent", border:"none", borderBottom:`2px solid ${view === tab.id ? orange : "transparent"}`, color: view === tab.id ? white : muted, padding:"14px 18px", fontFamily:"DM Sans,sans-serif", fontSize:"0.82rem", fontWeight: view === tab.id ? 600 : 400, cursor:"pointer", transition:"all 0.15s", letterSpacing:"0.01em" }}>
            {tab.label}
            {tab.id === "dashboard" && <span style={{ marginLeft:6, background:orange, color:white, fontSize:"0.55rem", fontFamily:"DM Mono,monospace", padding:"2px 6px", borderRadius:10, fontWeight:700 }}>{MOCK_CANDIDATES.length}</span>}
          </button>
        ))}
      </div>

      <div style={{ maxWidth:780, margin:"0 auto", padding:"40px 24px 80px" }}>

        {/* ══ COMPANY PROFILE ══ */}
        {view === "profile" && (
          <div className="fadeup">
            <SectionHead
              eyebrow="Step 1 of 2 — Company Profile"
              title="Tell candidates who you are."
              sub="Hospitality workers read employer profiles carefully. They've had bad bosses. Make it count."
            />

            {/* Basic info */}
            <Card label="Company Info">
              <TwoCol>
                <Field label="Company Name" required>
                  <In value={compName} set={setCompName} placeholder="EquipmentShare" />
                </Field>
                <Field label="Website">
                  <In value={compWebsite} set={setCompWebsite} placeholder="https://equipmentshare.com" />
                </Field>
              </TwoCol>
              <Field label="Industry">
                <ChipRow options={INDUSTRIES} selected={[compIndustry]} onToggle={setCompIndustry} single wrap />
              </Field>
              <Field label="Company Size">
                <ChipRow options={COMP_SIZES} selected={[compSize]} onToggle={setCompSize} single />
              </Field>
              <Field label="About the company" hint="2-4 sentences. What do you do, who are your customers, what's the culture?">
                <Ta value={compAbout} set={setCompAbout} placeholder="We're a construction technology company..." rows={3} />
              </Field>
            </Card>

            {/* Why hospitality */}
            <Card label="Why You Hire Hospitality Backgrounds">
              <Field label="What draws you to candidates from the service industry?" hint="This shows up prominently on your profile. Be specific — vague answers get skipped.">
                <Ta value={compWhy} set={setCompWhy} placeholder="Our best territory reps came from bartending. They already know how to build a room, read a customer, and close without being pushy. We stopped looking for resumes and started looking for that instinct." rows={4} />
              </Field>
              <div style={{ marginTop:12, padding:"12px 16px", background:"rgba(255,92,40,0.06)", border:`1px solid rgba(255,92,40,0.2)`, borderRadius:10 }}>
                <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.6rem", color:orange, letterSpacing:"0.12em", marginBottom:6 }}>WHY THIS MATTERS</div>
                <div style={{ fontSize:"0.78rem", color:muted, lineHeight:1.65 }}>Candidates on Sidework have often been told their experience "doesn't count." A specific, honest answer here is the single highest-converting element on an employer profile.</div>
              </div>
            </Card>

            {/* Social proof — past hospitality hires */}
            <Card label="Past Hospitality Hires (Optional but powerful)">
              <div style={{ fontSize:"0.82rem", color:muted, lineHeight:1.65, marginBottom:16 }}>
                Real people who made the jump to your company. Names can be first-name only. This is the most trusted signal for candidates considering a career change.
              </div>
              {hospHires.map((h, i) => (
                <div key={h.id} className="hire-card" style={{ background:navyCard, border:`1px solid ${navyBorder}`, borderRadius:12, padding:"16px 18px", marginBottom:10, position:"relative" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                    <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.58rem", color:muted, letterSpacing:"0.14em" }}>HIRE {i+1}</div>
                    {hospHires.length > 1 && (
                      <button className="hire-remove" onClick={() => removeHire(h.id)}
                        style={{ opacity:0, background:"transparent", border:"none", color:"#EF4444", fontSize:"0.68rem", cursor:"pointer", fontFamily:"DM Mono,monospace", letterSpacing:"0.08em", transition:"opacity 0.15s" }}>REMOVE ×</button>
                    )}
                  </div>
                  <TwoCol>
                    <Field label="First name" compact>
                      <In value={h.name} set={v => updateHire(h.id,"name",v)} placeholder="Jamie" />
                    </Field>
                    <Field label="Previous hospitality role" compact>
                      <In value={h.fromRole} set={v => updateHire(h.id,"fromRole",v)} placeholder="Bar Manager, 8 yrs" />
                    </Field>
                  </TwoCol>
                  <Field label="Current role at your company" compact>
                    <In value={h.toRole} set={v => updateHire(h.id,"toRole",v)} placeholder="Territory Sales Manager" />
                  </Field>
                  <Field label="Quote (optional)">
                    <Ta value={h.quote} set={v => updateHire(h.id,"quote",v)} placeholder='"The skills translated better than I expected. I was closing deals in month two."' rows={2} />
                  </Field>
                </div>
              ))}
              <AddBtn onClick={addHire} label="+ Add Another Hire" />
            </Card>

            {/* Hiring contact */}
            <Card label="Hiring Contact">
              <TwoCol>
                <Field label="Name" required>
                  <In value={hiringName} set={setHiringName} placeholder="Jordan Smith" />
                </Field>
                <Field label="Title">
                  <In value={hiringTitle} set={setHiringTitle} placeholder="Head of Talent" />
                </Field>
              </TwoCol>
              <Field label="Email" required>
                <In value={hiringEmail} set={setHiringEmail} placeholder="hiring@company.com" type="email" />
              </Field>
            </Card>

            <div style={{ display:"flex", gap:12, justifyContent:"flex-end", marginTop:8 }}>
              <button className="btn-ghost" onClick={() => setView("post")}
                style={{ background:"transparent", border:`1px solid ${navyBorder}`, color:muted, padding:"12px 22px", borderRadius:10, fontFamily:"DM Sans,sans-serif", fontSize:"0.85rem", cursor:"pointer", transition:"all 0.15s" }}>
                Skip to Job Post →
              </button>
              <button className="btn-primary" onClick={() => { setProfileSaved(true); setView("post"); }}
                disabled={!canSaveProfile}
                style={{ background: canSaveProfile ? orange : navyBorder, border:"none", color: canSaveProfile ? white : muted, padding:"12px 28px", borderRadius:10, fontFamily:"Syne,sans-serif", fontSize:"0.88rem", fontWeight:700, cursor: canSaveProfile ? "pointer":"not-allowed", boxShadow: canSaveProfile ? `0 3px 14px rgba(255,92,40,0.35)`:"none", transition:"all 0.18s", letterSpacing:"0.02em" }}>
                Save & Post a Job →
              </button>
            </div>
          </div>
        )}

        {/* ══ POST A JOB ══ */}
        {view === "post" && (
          <div className="fadeup">
            {profileSaved && (
              <div style={{ background:"rgba(34,197,94,0.08)", border:`1px solid rgba(34,197,94,0.2)`, borderRadius:10, padding:"10px 16px", marginBottom:24, display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ color:green, fontSize:"0.8rem" }}>✓</span>
                <span style={{ fontFamily:"DM Mono,monospace", fontSize:"0.65rem", color:green, letterSpacing:"0.1em" }}>COMPANY PROFILE SAVED — NOW POST YOUR FIRST JOB</span>
              </div>
            )}
            <SectionHead
              eyebrow="Step 2 of 2 — Job Posting"
              title="Ring in your next hire."
              sub="Fill in the standard details. We'll translate it into language that actually reaches hospitality workers."
            />

            {/* Standard job info */}
            <Card label="The Role">
              <TwoCol>
                <Field label="Job Title" required>
                  <In value={jobTitle} set={setJobTitle} placeholder="Territory Sales Manager" />
                </Field>
                <Field label="Location">
                  <In value={jobLocation} set={setJobLocation} placeholder="Remote / Multi-state" />
                </Field>
              </TwoCol>
              <TwoCol>
                <Field label="Job Type" required>
                  <ChipRow options={JOB_TYPES} selected={jobType} onToggle={toggleJobType} />
                </Field>
                <Field label="Experience Level" required>
                  <ChipRow options={EXP_LEVELS} selected={[expLevel]} onToggle={setExpLevel} single scroll />
                </Field>
              </TwoCol>
              <Field label="Salary Range">
                <ChipRow options={SALARY_RANGES} selected={[salaryRange]} onToggle={setSalaryRange} single scroll />
              </Field>
            </Card>

            <Card label="Job Description">
              <Field label="Describe the role" hint="Write it normally — your standard job description is fine here." required>
                <Ta value={jobDesc} set={setJobDesc} rows={8}
                  placeholder={`What this person will do day-to-day:\n- Build and manage a multi-state territory\n- Develop relationships with new accounts\n- Hit monthly revenue targets\n\nWhat we're looking for:\n- Strong communicator who builds trust fast\n- Self-starter who doesn't need hand-holding\n- Someone who knows how to read a room`} />
              </Field>
            </Card>

            {/* Hospitality skill tags */}
            <Card label="Which Hospitality Skills Does This Role Value?">
              <div style={{ fontSize:"0.82rem", color:muted, lineHeight:1.65, marginBottom:14 }}>
                Tag the skills from hospitality that directly apply. This powers our matching — candidates with these skills get surfaced to you first.
              </div>
              <ChipRow options={HOSP_SKILLS} selected={hospSkills} onToggle={toggleHospSkill} wrap />
            </Card>

            {/* Translation engine */}
            <Card label="Hospitality Translation" highlight>
              <div style={{ fontSize:"0.82rem", color:muted, lineHeight:1.65, marginBottom:16 }}>
                Once your description is written, we'll rewrite it in hospitality language — the version candidates actually see first. Your original stays accessible one click away.
              </div>

              {!hospTranslation && (
                <button onClick={translateJob} disabled={translating || !canPostJob}
                  style={{ background: canPostJob ? orange : navyBorder, border:"none", color: canPostJob ? white : muted, padding:"13px 24px", borderRadius:10, fontFamily:"Syne,sans-serif", fontSize:"0.88rem", fontWeight:700, cursor: canPostJob ? "pointer":"not-allowed", boxShadow: canPostJob ? `0 3px 14px rgba(255,92,40,0.35)`:"none", transition:"all 0.18s", display:"flex", alignItems:"center", gap:10, letterSpacing:"0.02em" }}>
                  {translating ? <><span className="spin">↻</span> Translating...</> : "✦ Translate for Hospitality Workers"}
                </button>
              )}

              {hospTranslation && (
                <div className="fadeup">
                  {/* Hosp title + hook */}
                  <div style={{ background:navyCard, border:`1px solid ${navyBorder}`, borderRadius:12, padding:"18px 20px", marginBottom:12 }}>
                    <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.58rem", color:orange, letterSpacing:"0.16em", textTransform:"uppercase", marginBottom:8 }}>Candidate-Facing Title</div>
                    <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"1.05rem", marginBottom:6 }}>{hospTranslation.hospTitle}</div>
                    <div style={{ fontSize:"0.82rem", color:muted, fontStyle:"italic", lineHeight:1.6 }}>{hospTranslation.hook}</div>
                  </div>

                  {/* Why you fit bullets */}
                  <div style={{ background:navyCard, border:`1px solid ${navyBorder}`, borderRadius:12, padding:"18px 20px", marginBottom:12 }}>
                    <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.58rem", color:orange, letterSpacing:"0.16em", textTransform:"uppercase", marginBottom:12 }}>Why Hospitality Workers Fit</div>
                    {(hospTranslation.whyYouFit || []).map((pt, i) => (
                      <div key={i} style={{ display:"flex", gap:10, padding:"7px 0", borderBottom:`1px solid rgba(255,255,255,0.05)`, alignItems:"flex-start" }}>
                        <span style={{ color:orange, fontSize:"0.7rem", paddingTop:2, flexShrink:0 }}>→</span>
                        <span style={{ fontSize:"0.82rem", color:"#E2E8F0", lineHeight:1.55 }}>{pt}</span>
                      </div>
                    ))}
                  </div>

                  {/* Skill tags */}
                  {hospTranslation.skillTags?.length > 0 && (
                    <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:12 }}>
                      {hospTranslation.skillTags.map(t => (
                        <span key={t} style={{ background:orangeGlow, border:`1px solid rgba(255,92,40,0.25)`, color:orangeLight, fontFamily:"DM Mono,monospace", fontSize:"0.65rem", padding:"4px 11px", borderRadius:6, letterSpacing:"0.03em" }}>{t}</span>
                      ))}
                    </div>
                  )}

                  {/* Toggle standard desc */}
                  <button className="toggle-desc" onClick={() => setShowStdDesc(s => !s)}
                    style={{ background:"transparent", border:"none", color:muted, fontFamily:"DM Mono,monospace", fontSize:"0.62rem", letterSpacing:"0.1em", cursor:"pointer", padding:"8px 0", transition:"color 0.15s", display:"flex", alignItems:"center", gap:6 }}>
                    {showStdDesc ? "▲" : "▼"} {showStdDesc ? "Hide" : "View"} standard job description
                  </button>

                  {showStdDesc && (
                    <div style={{ background:"rgba(255,255,255,0.02)", border:`1px solid ${navyBorder}`, borderRadius:10, padding:"16px 18px", marginTop:8 }}>
                      <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.58rem", color:muted, letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:10 }}>Standard Description (also visible to candidates)</div>
                      <div style={{ fontSize:"0.82rem", color:"rgba(244,246,248,0.6)", lineHeight:1.75, whiteSpace:"pre-line" }}>{jobDesc}</div>
                    </div>
                  )}

                  <button onClick={() => setHospTranslation(null)}
                    style={{ background:"transparent", border:`1px solid ${navyBorder}`, color:muted, padding:"8px 16px", borderRadius:8, fontFamily:"DM Mono,monospace", fontSize:"0.62rem", cursor:"pointer", marginTop:12, letterSpacing:"0.08em", transition:"all 0.15s" }}>
                    ↻ Re-translate
                  </button>
                </div>
              )}
            </Card>

            <div style={{ display:"flex", gap:12, justifyContent:"flex-end", marginTop:8 }}>
              <button className="btn-ghost" onClick={() => setView("profile")}
                style={{ background:"transparent", border:`1px solid ${navyBorder}`, color:muted, padding:"12px 22px", borderRadius:10, fontFamily:"DM Sans,sans-serif", fontSize:"0.85rem", cursor:"pointer", transition:"all 0.15s" }}>
                ← Edit Profile
              </button>
              <button className="btn-primary" onClick={() => { setJobPosted(true); setView("dashboard"); }}
                disabled={!canPostJob}
                style={{ background: canPostJob ? orange : navyBorder, border:"none", color: canPostJob ? white : muted, padding:"12px 28px", borderRadius:10, fontFamily:"Syne,sans-serif", fontSize:"0.88rem", fontWeight:700, cursor: canPostJob ? "pointer":"not-allowed", boxShadow: canPostJob ? `0 3px 14px rgba(255,92,40,0.35)`:"none", transition:"all 0.18s", letterSpacing:"0.02em" }}>
                Post Job & See Matches →
              </button>
            </div>
          </div>
        )}

        {/* ══ MATCHED CANDIDATES DASHBOARD ══ */}
        {view === "dashboard" && (
          <div className="fadeup">
            {jobPosted && (
              <div style={{ background:"rgba(34,197,94,0.08)", border:`1px solid rgba(34,197,94,0.2)`, borderRadius:10, padding:"10px 16px", marginBottom:24, display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ color:green }}>✓</span>
                <span style={{ fontFamily:"DM Mono,monospace", fontSize:"0.65rem", color:green, letterSpacing:"0.1em" }}>JOB POSTED — HERE ARE YOUR TOP MATCHES</span>
              </div>
            )}
            <SectionHead
              eyebrow="Matched Candidates"
              title="Your table is ready."
              sub="Candidates surfaced by match score — ranked by how closely their hospitality background aligns with what you posted."
            />

            {/* Active job summary */}
            {jobTitle && (
              <div style={{ background:navyCard, border:`1px solid rgba(255,92,40,0.25)`, borderRadius:12, padding:"16px 20px", marginBottom:20, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
                <div>
                  <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.58rem", color:orange, letterSpacing:"0.14em", marginBottom:4 }}>ACTIVE POSTING</div>
                  <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"1rem" }}>{jobTitle}</div>
                  <div style={{ fontSize:"0.75rem", color:muted, marginTop:2 }}>{jobType.join(" · ")} {jobLocation && `· ${jobLocation}`}</div>
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <StatPill label="Matches" value={MOCK_CANDIDATES.length} />
                  <StatPill label="Avg Score" value="78" />
                  <StatPill label="Available Now" value="2" color={green} />
                </div>
              </div>
            )}

            {/* Candidate list */}
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {MOCK_CANDIDATES.map((c, i) => (
                <CandidateRow key={c.id} candidate={c} rank={i + 1} />
              ))}
            </div>

            <div style={{ marginTop:24, padding:"20px 24px", background:navyCard, border:`1px dashed ${navyBorder}`, borderRadius:12, textAlign:"center" }}>
              <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"0.95rem", marginBottom:6 }}>Want to see more candidates?</div>
              <div style={{ fontSize:"0.8rem", color:muted, marginBottom:16, lineHeight:1.6 }}>Upgrade to search the full candidate pool and filter by location, availability, and skill depth.</div>
              <button style={{ background:orange, border:"none", color:white, padding:"11px 24px", borderRadius:10, fontFamily:"Syne,sans-serif", fontSize:"0.85rem", fontWeight:700, cursor:"pointer", boxShadow:`0 3px 12px rgba(255,92,40,0.35)`, letterSpacing:"0.02em" }}>
                Unlock Full Candidate Search
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ── SUB-COMPONENTS ─────────────────────────────────────────────────────

function SectionHead({ eyebrow, title, sub }) {
  return (
    <div style={{ marginBottom:32 }}>
      <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.62rem", color:orange, letterSpacing:"0.22em", textTransform:"uppercase", marginBottom:10 }}>{eyebrow}</div>
      <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"clamp(1.5rem,3vw,2.1rem)", letterSpacing:"-0.01em", lineHeight:1.1, marginBottom:8 }}>{title}</h2>
      <p style={{ fontSize:"0.88rem", color:muted, lineHeight:1.65 }}>{sub}</p>
    </div>
  );
}

function Card({ label, children, highlight }) {
  return (
    <div style={{ background: highlight ? `linear-gradient(135deg,${navyCard},rgba(255,92,40,0.06))` : navyCard, border:`1px solid ${highlight ? "rgba(255,92,40,0.25)" : navyBorder}`, borderRadius:14, padding:"22px 24px", marginBottom:16 }}>
      <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.58rem", color:highlight ? orange : muted, letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:18, display:"flex", alignItems:"center", gap:8 }}>
        {highlight && <span style={{ color:orange }}>✦</span>}{label}
        <span style={{ flex:1, height:1, background:navyBorder, display:"inline-block" }} />
      </div>
      {children}
    </div>
  );
}

function Field({ label, hint, required, compact, children }) {
  return (
    <div style={{ marginBottom: compact ? 10 : 14 }}>
      <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.59rem", color:muted, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:6, display:"flex", gap:5, alignItems:"center", flexWrap:"wrap" }}>
        {label}{required && <span style={{ color:orange }}>*</span>}
        {hint && <span style={{ fontSize:"0.57rem", color:"rgba(138,155,176,0.55)", textTransform:"none", letterSpacing:0, fontFamily:"DM Sans,sans-serif" }}>— {hint}</span>}
      </div>
      {children}
    </div>
  );
}

function In({ value, set, placeholder, type = "text" }) {
  return (
    <input type={type} value={value} onChange={e => set(e.target.value)} placeholder={placeholder}
      style={{ width:"100%", minWidth:0, background:navy, border:`1.5px solid ${navyBorder}`, borderRadius:10, padding:"11px 14px", color:white, fontFamily:"DM Sans,sans-serif", fontSize:"0.88rem", transition:"border-color 0.18s" }} />
  );
}

function Ta({ value, set, placeholder, rows = 3 }) {
  const minH = rows * 1.65 * 0.88 * 16 + 28; // rows × line-height × font-size + padding
  return (
    <textarea value={value} onChange={e => set(e.target.value)} placeholder={placeholder} rows={rows}
      style={{ width:"100%", minWidth:0, background:navy, border:`1.5px solid ${navyBorder}`, borderRadius:10, padding:"11px 14px", color:white, fontFamily:"DM Sans,sans-serif", fontSize:"0.88rem", lineHeight:1.65, resize:"vertical", transition:"border-color 0.18s", minHeight:`${minH}px`, display:"block" }} />
  );
}

function TwoCol({ children }) {
  return <div style={{ display:"grid", gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr)", gap:12, marginBottom:12 }}>{children}</div>;
}

function ChipRow({ options, selected, onToggle, single, wrap, scroll }) {
  return (
    <div style={{ display:"flex", flexWrap: wrap ? "wrap" : "nowrap", gap:6, overflowX: scroll ? "auto" : "visible", paddingBottom:2 }}>
      {options.map(opt => {
        const active = selected.includes(opt);
        return (
          <button key={opt} className={`chip${active ? " on" : ""}`} onClick={() => onToggle(opt)}
            style={{ background: active ? orangeGlow : "transparent", border:`1px solid ${active ? orange : navyBorder}`, color: active ? orange : muted, padding:"5px 12px", borderRadius:20, fontFamily:"DM Mono,monospace", fontSize:"0.62rem", cursor:"pointer", letterSpacing:"0.04em", whiteSpace:"nowrap", transition:"all 0.15s", flexShrink:0 }}>
            {active && "✓ "}{opt}
          </button>
        );
      })}
    </div>
  );
}

function AddBtn({ onClick, label }) {
  return (
    <button onClick={onClick}
      style={{ background:"transparent", border:`1px dashed ${navyBorder}`, color:muted, padding:"11px", borderRadius:10, cursor:"pointer", fontFamily:"DM Sans,sans-serif", fontSize:"0.8rem", width:"100%", transition:"all 0.15s" }}
      onMouseOver={e => { e.currentTarget.style.borderColor = orange; e.currentTarget.style.color = orange; }}
      onMouseOut={e => { e.currentTarget.style.borderColor = navyBorder; e.currentTarget.style.color = muted; }}>
      {label}
    </button>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${navyBorder}`, borderRadius:10, padding:"8px 14px", textAlign:"center" }}>
      <div style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"1.1rem", color: color || orange }}>{value}</div>
      <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.56rem", color:muted, letterSpacing:"0.1em", marginTop:2 }}>{label}</div>
    </div>
  );
}

function CandidateRow({ candidate, rank }) {
  const [expanded, setExpanded] = useState(false);
  const scoreColor = candidate.score >= 85 ? green : candidate.score >= 70 ? orange : amber;

  return (
    <div className="cand-row" onClick={() => setExpanded(e => !e)}
      style={{ background:navyCard, border:`1px solid ${navyBorder}`, borderRadius:12, padding:"16px 20px", cursor:"pointer", transition:"all 0.15s" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>

        {/* Rank + score */}
        <div style={{ textAlign:"center", flexShrink:0 }}>
          <div style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"1.3rem", color:scoreColor, lineHeight:1 }}>{candidate.score}</div>
          <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.52rem", color:muted, letterSpacing:"0.08em" }}>MATCH</div>
        </div>

        {/* Info */}
        <div style={{ flex:1, minWidth:180 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
            <span style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"0.95rem" }}>{candidate.name}</span>
            <span style={{ fontFamily:"DM Mono,monospace", fontSize:"0.58rem", color:muted, border:`1px solid ${navyBorder}`, padding:"2px 7px", borderRadius:4 }}>{candidate.tier}</span>
          </div>
          <div style={{ fontSize:"0.75rem", color:muted }}>{candidate.role} · {candidate.yrs}</div>
        </div>

        {/* Tags */}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {candidate.tags.map(t => (
            <span key={t} style={{ background:orangeGlow, border:`1px solid rgba(255,92,40,0.2)`, color:orangeLight, fontFamily:"DM Mono,monospace", fontSize:"0.58rem", padding:"3px 9px", borderRadius:5, letterSpacing:"0.03em" }}>{t}</span>
          ))}
        </div>

        {/* Avail + expand */}
        <div style={{ textAlign:"right", flexShrink:0 }}>
          <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.6rem", color:candidate.avail === "Immediately" ? green : amber, letterSpacing:"0.08em", marginBottom:4 }}>
            {candidate.avail === "Immediately" ? "● " : "○ "}{candidate.avail}
          </div>
          <div style={{ fontFamily:"DM Mono,monospace", fontSize:"0.58rem", color:muted }}>{expanded ? "▲ Less" : "▼ More"}</div>
        </div>
      </div>

      {expanded && (
        <div className="fadeup" style={{ marginTop:16, paddingTop:16, borderTop:`1px solid rgba(255,255,255,0.06)`, display:"flex", gap:10 }}>
          <button onClick={e => e.stopPropagation()} style={{ flex:1, background:orange, border:"none", color:white, padding:"11px", borderRadius:9, fontFamily:"Syne,sans-serif", fontSize:"0.82rem", fontWeight:700, cursor:"pointer", boxShadow:`0 3px 12px rgba(255,92,40,0.3)`, letterSpacing:"0.02em" }}>
            View Full Profile
          </button>
          <button onClick={e => e.stopPropagation()} style={{ flex:1, background:"transparent", border:`1px solid ${navyBorder}`, color:muted, padding:"11px", borderRadius:9, fontFamily:"DM Sans,sans-serif", fontSize:"0.82rem", cursor:"pointer", transition:"all 0.15s" }}
            onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = white; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = navyBorder; e.currentTarget.style.color = muted; }}>
            Send Message
          </button>
        </div>
      )}
    </div>
  );
}
