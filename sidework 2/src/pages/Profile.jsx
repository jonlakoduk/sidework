import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ─── MOCK EVALUATOR DATA ───────────────────────────────────────────────
// In production this would be passed as props from the evaluator.
// For demo purposes we pre-load a realistic result set.
const MOCK_EVAL = {
  score: 84,
  tier: "Executive Chef Material",
  skills: [
    { raw: "Handling angry guests at last call", corporate: "Crisis De-escalation & Conflict Resolution", level: "EXPERT", note: "At 1am. Without backup." },
    { raw: "Getting regulars to order the top shelf", corporate: "Consultative Upselling & Revenue Optimization", level: "EXPERT", note: "They didn't even see the menu." },
    { raw: "Running a full P&L on a seasonal pop-up", corporate: "P&L Ownership & Financial Management", level: "ADV", note: "Real money. Real stakes. No safety net." },
    { raw: "Training new bartenders from zero", corporate: "Onboarding Design & Adult Learning Facilitation", level: "ADV", note: "They thought they knew how to pour a beer." },
    { raw: "Managing distributors and liquor reps", corporate: "Vendor Relations & Contract Negotiation", level: "ADV", note: "You knew which reps were worth the samples." },
  ],
  roles: [
    { emoji: "💼", name: "Territory Sales Manager", match: "91%" },
    { emoji: "🍻", name: "Hospitality Tech Account Executive", match: "88%" },
    { emoji: "🤝", name: "Client Success Manager", match: "82%" },
    { emoji: "👥", name: "People & Culture Manager", match: "76%" },
  ],
  transferValue: "EXCEPTIONAL",
  advice: "You ran a bar. You can run a territory.",
};

const ROLE_OPTIONS = [
  "Territory Sales Manager","Account Manager","Client Success Manager",
  "Business Development Manager","Operations Manager","People & Culture Manager",
  "Patient Experience Coordinator","Healthcare Practice Manager",
  "Hospitality Tech Account Executive","SaaS Customer Success Manager",
  "Event Coordinator","HR Generalist","Recruiting Coordinator",
  "Revenue Operations Manager","Director of Customer Experience",
];

const INDUSTRY_OPTIONS = [
  "Hospitality Tech (Toast, Square, SevenRooms)","SaaS / Software",
  "Healthcare & Patient Services","Sales & Business Development",
  "HR / People Operations","Event Management","Food & Beverage (corporate)",
  "Retail Operations","Logistics & Distribution","Finance & Banking",
];

const AVAIL_OPTIONS = ["Immediately","Within 2 weeks","Within 30 days","Within 60 days","Just exploring"];
const TYPE_OPTIONS  = ["Full-time","Part-time","Contract","Open to anything"];

// ─── HELPERS ──────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 8);

const navy     = "#0F1923";
const navyMid  = "#172130";
const navyCard = "#1E2D3D";
const navyBorder = "#2A3F55";
const orange   = "#FF5C28";
const orangeGlow = "rgba(255,92,40,0.15)";
const muted    = "#8A9BB0";
const green    = "#22C55E";
const cream    = "#FAF8F4";
const ink      = "#1A1612";
const receiptRule = "#E2DDD6";
const receiptFade = "#9B8E7E";

// ─── MAIN COMPONENT ───────────────────────────────────────────────────
export default function SideworkProfile() {
  const navigate = useNavigate();
  // Seed from evaluator
  const [step, setStep]   = useState(0); // 0-3 = sections, 4 = preview
  const [saving, setSaving] = useState(false);

  // Section 1 — Identity
  const [name,     setName]     = useState("");
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [avail,    setAvail]    = useState("");
  const [jobType,  setJobType]  = useState([]);
  const [email,    setEmail]    = useState("");

  // Section 2 — Work history (pre-seeded + editable)
  const [jobs, setJobs] = useState([
    { id: uid(), title: "", company: "", years: "", highlights: "" },
  ]);

  // Section 3 — Skills (pre-filled from eval, editable)
  const [skills, setSkills] = useState(
    MOCK_EVAL.skills.map(s => ({ ...s, id: uid(), editing: false }))
  );

  // Section 4 — Targets
  const [targetRoles,      setTargetRoles]      = useState(MOCK_EVAL.roles.map(r => r.name));
  const [targetIndustries, setTargetIndustries] = useState([]);
  const [salaryMin,        setSalaryMin]        = useState("");
  const [openTo,           setOpenTo]           = useState("");

  // AI re-translation state
  const [translating, setTranslating] = useState(null); // skill id

  const STEPS = ["Identity","Work History","Skills","Targets"];

  // ── SECTION VALIDATORS ────────────────────────────────────────────
  function canAdvance() {
    if (step === 0) return name.trim() && location.trim() && avail && email.trim();
    if (step === 1) return jobs.every(j => j.title.trim() && j.company.trim() && j.years.trim());
    if (step === 2) return skills.length > 0;
    if (step === 3) return targetRoles.length > 0;
    return true;
  }

  // ── JOB HELPERS ───────────────────────────────────────────────────
  function addJob() {
    setJobs(j => [...j, { id: uid(), title: "", company: "", years: "", highlights: "" }]);
  }
  function removeJob(id) {
    setJobs(j => j.filter(x => x.id !== id));
  }
  function updateJob(id, field, val) {
    setJobs(j => j.map(x => x.id === id ? { ...x, [field]: val } : x));
  }

  // ── SKILL HELPERS ─────────────────────────────────────────────────
  function addSkill() {
    setSkills(s => [...s, { id: uid(), raw: "", corporate: "", level: "ADV", note: "" }]);
  }
  function removeSkill(id) {
    setSkills(s => s.filter(x => x.id !== id));
  }
  function updateSkill(id, field, val) {
    setSkills(s => s.map(x => x.id === id ? { ...x, [field]: val } : x));
  }

  async function retranslate(skill) {
    setTranslating(skill.id);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 300,
          messages: [{
            role: "user",
            content: `You translate hospitality job experience into corporate language for Sidework, a job board helping hospitality workers transition careers.

The candidate described this skill in their own words: "${skill.raw}"

Return ONLY a raw JSON object — no markdown, no backticks:
{
  "corporate": "<clean corporate job-posting language, 4-8 words>",
  "level": "<ENTRY | ADV | EXPERT>",
  "note": "<one short wry line, specific and a little funny, under 10 words>"
}`
          }]
        })
      });
      const data = await res.json();
      const raw = data.content.map(b => b.text || "").join("");
      const first = raw.indexOf("{"), last = raw.lastIndexOf("}");
      const parsed = JSON.parse(raw.slice(first, last + 1));
      updateSkill(skill.id, "corporate", parsed.corporate);
      updateSkill(skill.id, "level", parsed.level);
      updateSkill(skill.id, "note", parsed.note);
    } catch (e) { /* silent fail — they can edit manually */ }
    setTranslating(null);
  }

  // ── TOGGLE HELPERS ────────────────────────────────────────────────
  function toggleArr(arr, setArr, val) {
    setArr(a => a.includes(val) ? a.filter(x => x !== val) : [...a, val]);
  }

  // ─────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: navy, minHeight: "100vh", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "white" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .fadeup { animation: fadeUp 0.38s ease forwards; }
        input,textarea,select { outline:none; }
        input:focus,textarea:focus { border-color: ${orange} !important; }
        .chip:hover { border-color:${orange} !important; color:${orange} !important; background:${orangeGlow} !important; cursor:pointer; }
        .chip.active { border-color:${orange} !important; color:${orange} !important; background:${orangeGlow} !important; }
        .job-card:hover .remove-btn { opacity:1 !important; }
        .skill-row:hover .remove-skill { opacity:1 !important; }
        .btn-next:hover:not(:disabled) { background:#FF7A4A !important; transform:translateY(-1px); }
        .btn-back:hover { border-color:rgba(255,255,255,0.25) !important; color:white !important; }
        .step-dot { transition: all 0.2s; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; display:inline-block; }
        @media print {
          .no-print { display:none !important; }
          body { background: white !important; }
        }
      `}</style>

      {/* TOPBAR */}
      <div style={{ background: navyMid, borderBottom: `1px solid ${navyBorder}`, height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.05rem", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: orange, boxShadow: `0 0 8px ${orange}`, display: "inline-block" }} onClick={() => navigate("/")} style={{cursor:"pointer"}} />
          sidework
        </div>
        <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.62rem", color: muted, letterSpacing: "0.15em", background: "rgba(255,255,255,0.05)", border: `1px solid ${navyBorder}`, padding: "4px 12px", borderRadius: 20 }}>
          PROFILE BUILDER
        </div>
      </div>

      {/* PROGRESS STEPS */}
      <div style={{ background: navyMid, borderBottom: `1px solid ${navyBorder}`, padding: "14px 28px", display: "flex", alignItems: "center", gap: 0, overflowX: "auto" }} className="no-print">
        {STEPS.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: i < step ? "pointer" : "default" }} onClick={() => i < step && setStep(i)}>
              <div className="step-dot" style={{ width: 28, height: 28, borderRadius: "50%", background: i < step ? green : i === step ? orange : navyCard, border: `2px solid ${i < step ? green : i === step ? orange : navyBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontFamily: "DM Mono,monospace", color: i <= step ? "white" : muted, fontWeight: 700, flexShrink: 0 }}>
                {i < step ? "✓" : i + 1}
              </div>
              <span style={{ fontFamily: "DM Sans,sans-serif", fontSize: "0.78rem", fontWeight: i === step ? 600 : 400, color: i === step ? "white" : i < step ? green : muted, whiteSpace: "nowrap" }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ width: 32, height: 1, background: navyBorder, margin: "0 10px", flexShrink: 0 }} />}
          </div>
        ))}
        {step === 4 && (
          <div style={{ display: "flex", alignItems: "center", marginLeft: 10 }}>
            <div style={{ width: 32, height: 1, background: navyBorder, marginRight: 10 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: orange, border: `2px solid ${orange}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontFamily: "DM Mono,monospace", color: "white", fontWeight: 700 }}>✦</div>
              <span style={{ fontFamily: "DM Sans,sans-serif", fontSize: "0.78rem", fontWeight: 600, color: orange }}>Preview</span>
            </div>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* ══ STEP 0: IDENTITY ══ */}
        {step === 0 && (
          <div className="fadeup">
            <StepHeader step={1} total={4} title="Let's clock you in." sub="Basic info first. This is what employers see at the top of your profile." />
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <FieldRow label="Full Name" required>
                <Input value={name} onChange={setName} placeholder="Alex Rivera" />
              </FieldRow>
              <FieldRow label="Profile Headline" hint="One line. What you bring, not your last job title.">
                <Input value={headline} onChange={setHeadline} placeholder="10-year hospitality operator turned revenue-focused people leader" />
              </FieldRow>
              <FieldRow label="Location" required>
                <Input value={location} onChange={setLocation} placeholder="Minot, ND — open to remote" />
              </FieldRow>
              <FieldRow label="Email" required>
                <Input value={email} onChange={setEmail} placeholder="you@email.com" type="email" />
              </FieldRow>
              <FieldRow label="Available to start">
                <ChipGroup options={AVAIL_OPTIONS} selected={[avail]} onToggle={v => setAvail(v)} single />
              </FieldRow>
              <FieldRow label="Job type">
                <ChipGroup options={TYPE_OPTIONS} selected={jobType} onToggle={v => toggleArr(jobType, setJobType, v)} />
              </FieldRow>
            </div>
            <NavRow onNext={() => setStep(1)} canNext={canAdvance()} nextLabel="Work History →" hideBack />
          </div>
        )}

        {/* ══ STEP 1: WORK HISTORY ══ */}
        {step === 1 && (
          <div className="fadeup">
            <StepHeader step={2} total={4} title="Where you poured your best years." sub="Add your hospitality roles. We'll translate them — you just tell us what you actually did." />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {jobs.map((job, i) => (
                <div key={job.id} className="job-card" style={{ background: navyCard, border: `1px solid ${navyBorder}`, borderRadius: 14, padding: 20, position: "relative" }}>
                  <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.6rem", color: muted, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Role {i + 1}</span>
                    {jobs.length > 1 && (
                      <button className="remove-btn" onClick={() => removeJob(job.id)} style={{ opacity: 0, background: "transparent", border: "none", color: "#EF4444", fontSize: "0.7rem", cursor: "pointer", fontFamily: "DM Mono,monospace", letterSpacing: "0.1em", transition: "opacity 0.15s" }}>REMOVE ×</button>
                    )}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                    <FieldRow label="Job Title" compact required>
                      <Input value={job.title} onChange={v => updateJob(job.id, "title", v)} placeholder="Bar Manager / Owner" />
                    </FieldRow>
                    <FieldRow label="Establishment" compact required>
                      <Input value={job.company} onChange={v => updateJob(job.id, "company", v)} placeholder="Miracle on First, Minot ND" />
                    </FieldRow>
                  </div>
                  <FieldRow label="Years" compact required>
                    <Input value={job.years} onChange={v => updateJob(job.id, "years", v)} placeholder="2019 – 2025" style={{ maxWidth: 180 }} />
                  </FieldRow>
                  <div style={{ marginTop: 12 }}>
                    <FieldRow label="What did you actually do? (in your own words)" hint="Don't polish it — we'll handle that.">
                      <Textarea value={job.highlights} onChange={v => updateJob(job.id, "highlights", v)} placeholder="Ran a seasonal holiday pop-up, hired and trained all staff, managed inventory and P&L, built the cocktail menu from scratch, coordinated with liquor reps..." rows={3} />
                    </FieldRow>
                  </div>
                </div>
              ))}
              <button onClick={addJob} style={{ background: "transparent", border: `1px dashed ${navyBorder}`, color: muted, padding: "13px", borderRadius: 12, cursor: "pointer", fontFamily: "DM Sans,sans-serif", fontSize: "0.82rem", transition: "all 0.15s", letterSpacing: "0.01em" }}
                onMouseOver={e => { e.target.style.borderColor = orange; e.target.style.color = orange; }}
                onMouseOut={e => { e.target.style.borderColor = navyBorder; e.target.style.color = muted; }}>
                + Add Another Role
              </button>
            </div>
            <NavRow onBack={() => setStep(0)} onNext={() => setStep(2)} canNext={canAdvance()} nextLabel="Skills →" />
          </div>
        )}

        {/* ══ STEP 2: SKILLS ══ */}
        {step === 2 && (
          <div className="fadeup">
            <StepHeader step={3} total={4} title="What you brought to every shift." sub="Pre-filled from your skills evaluation. Edit anything, add more, or re-translate with AI." />

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
              {skills.map((skill, i) => (
                <div key={skill.id} className="skill-row" style={{ background: navyCard, border: `1px solid ${navyBorder}`, borderRadius: 12, padding: "16px 18px", position: "relative" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 10 }}>
                    <FieldRow label="In your words" compact>
                      <Input value={skill.raw} onChange={v => updateSkill(skill.id, "raw", v)} placeholder="What you called it on shift" />
                    </FieldRow>
                    <FieldRow label="Corporate translation" compact>
                      <Input value={skill.corporate} onChange={v => updateSkill(skill.id, "corporate", v)} placeholder="What employers call it" />
                    </FieldRow>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    {["ENTRY","ADV","EXPERT"].map(lvl => (
                      <button key={lvl} onClick={() => updateSkill(skill.id, "level", lvl)}
                        style={{ background: skill.level === lvl ? orangeGlow : "transparent", border: `1px solid ${skill.level === lvl ? orange : navyBorder}`, color: skill.level === lvl ? orange : muted, padding: "4px 12px", borderRadius: 6, fontFamily: "DM Mono,monospace", fontSize: "0.62rem", cursor: "pointer", letterSpacing: "0.08em", transition: "all 0.15s" }}>
                        {lvl}
                      </button>
                    ))}
                    <button onClick={() => retranslate(skill)} disabled={translating === skill.id}
                      style={{ marginLeft: "auto", background: "transparent", border: `1px solid ${navyBorder}`, color: translating === skill.id ? orange : muted, padding: "4px 12px", borderRadius: 6, fontFamily: "DM Mono,monospace", fontSize: "0.62rem", cursor: "pointer", letterSpacing: "0.08em", transition: "all 0.15s" }}>
                      {translating === skill.id ? <span className="spin">↻</span> : "↻ Re-translate"}
                    </button>
                    <button className="remove-skill" onClick={() => removeSkill(skill.id)}
                      style={{ opacity: 0, background: "transparent", border: "none", color: "#EF4444", fontSize: "0.7rem", cursor: "pointer", fontFamily: "DM Mono,monospace", letterSpacing: "0.08em", transition: "opacity 0.15s" }}>× Remove</button>
                  </div>
                  {skill.note && (
                    <div style={{ marginTop: 8, fontSize: "0.68rem", color: muted, fontStyle: "italic" }}>{skill.note}</div>
                  )}
                </div>
              ))}
            </div>

            <button onClick={addSkill} style={{ background: "transparent", border: `1px dashed ${navyBorder}`, color: muted, padding: "13px", borderRadius: 12, cursor: "pointer", fontFamily: "DM Sans,sans-serif", fontSize: "0.82rem", transition: "all 0.15s", width: "100%" }}
              onMouseOver={e => { e.target.style.borderColor = orange; e.target.style.color = orange; }}
              onMouseOut={e => { e.target.style.borderColor = navyBorder; e.target.style.color = muted; }}>
              + Add a Skill
            </button>
            <NavRow onBack={() => setStep(1)} onNext={() => setStep(3)} canNext={canAdvance()} nextLabel="Targets →" />
          </div>
        )}

        {/* ══ STEP 3: TARGETS ══ */}
        {step === 3 && (
          <div className="fadeup">
            <StepHeader step={4} total={4} title="What's on your menu?" sub="Tell us where you want to land. Pre-filled from your evaluation — adjust freely." />
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <FieldRow label={`Target roles${targetRoles.length > 0 ? " · " + targetRoles.length + " selected" : ""}`} hint="Toggle to select — pre-filled from your eval.">
                <ChipGroup options={ROLE_OPTIONS} selected={targetRoles} onToggle={v => toggleArr(targetRoles, setTargetRoles, v)} wrap dimUnselected />
              </FieldRow>
              <FieldRow label={`Target industries${targetIndustries.length > 0 ? " · " + targetIndustries.length + " selected" : ""}`}>
                <ChipGroup options={INDUSTRY_OPTIONS} selected={targetIndustries} onToggle={v => toggleArr(targetIndustries, setTargetIndustries, v)} wrap dimUnselected />
              </FieldRow>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <FieldRow label="Salary floor (annual)" hint="We keep this between you and matched employers.">
                  <Input value={salaryMin} onChange={setSalaryMin} placeholder="$55,000" />
                </FieldRow>
                <FieldRow label="Open to relocation?">
                  <ChipGroup options={["Yes","Remote only","No","Let's talk"]} selected={[openTo]} onToggle={setOpenTo} single />
                </FieldRow>
              </div>
            </div>
            <NavRow onBack={() => setStep(2)} onNext={() => setStep(4)} canNext={canAdvance()} nextLabel="Preview My Profile →" />
          </div>
        )}

        {/* ══ STEP 4: PREVIEW ══ */}
        {step === 4 && (
          <div className="fadeup">
            {/* Profile card */}
            <div style={{ background: navyCard, border: `1px solid ${navyBorder}`, borderRadius: 16, overflow: "hidden", marginBottom: 20 }}>
              {/* Header band */}
              <div style={{ background: `linear-gradient(135deg, ${navy} 0%, #1a2d3f 100%)`, padding: "28px 28px 24px", borderBottom: `1px solid ${navyBorder}` }}>
                <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.6rem", color: orange, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: green, display: "inline-block", boxShadow: `0 0 6px ${green}` }} /> Available · {avail || "Open"}
                </div>
                <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "clamp(1.4rem,3vw,2rem)", letterSpacing: "-0.01em", marginBottom: 6 }}>{name || "Your Name"}</h2>
                <div style={{ fontSize: "0.9rem", color: muted, marginBottom: 8 }}>{headline || "Hospitality professional in transition"}</div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  {location && <Tag icon="📍">{location}</Tag>}
                  {email && <Tag icon="✉️">{email}</Tag>}
                  {jobType.length > 0 && <Tag icon="🕐">{jobType.join(" · ")}</Tag>}
                </div>
              </div>

              {/* Eval badge */}
              <div style={{ padding: "14px 28px", borderBottom: `1px solid ${navyBorder}`, background: orangeGlow, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.5rem", color: orange }}>{MOCK_EVAL.score}</div>
                <div>
                  <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.6rem", color: muted, letterSpacing: "0.12em" }}>SIDEWORK SKILLS SCORE</div>
                  <div style={{ fontSize: "0.82rem", color: "white", fontWeight: 500 }}>{MOCK_EVAL.tier}</div>
                </div>
                <div style={{ marginLeft: "auto", fontFamily: "DM Mono,monospace", fontSize: "0.62rem", color: orange, letterSpacing: "0.08em", border: `1px solid rgba(255,92,40,0.3)`, padding: "4px 12px", borderRadius: 20 }}>
                  {MOCK_EVAL.transferValue} TRANSFERABILITY
                </div>
              </div>

              {/* Work history */}
              {jobs.some(j => j.title) && (
                <ProfileSection label="Work History">
                  {jobs.filter(j => j.title).map(job => (
                    <div key={job.id} style={{ paddingBottom: 14, marginBottom: 14, borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                        <div>
                          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.95rem" }}>{job.title}</div>
                          <div style={{ fontSize: "0.78rem", color: muted }}>{job.company}</div>
                        </div>
                        <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.65rem", color: muted, whiteSpace: "nowrap", paddingTop: 3 }}>{job.years}</div>
                      </div>
                      {job.highlights && <div style={{ fontSize: "0.78rem", color: "rgba(244,246,248,0.6)", lineHeight: 1.65, marginTop: 6 }}>{job.highlights}</div>}
                    </div>
                  ))}
                </ProfileSection>
              )}

              {/* Skills */}
              <ProfileSection label="Translated Skills">
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {skills.map(s => (
                    <div key={s.id} style={{ display: "grid", gridTemplateColumns: "1fr 28px 1fr auto", gap: 8, alignItems: "center", padding: "8px 0", borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                      <div style={{ fontSize: "0.78rem", color: muted }}>{s.raw}</div>
                      <div style={{ color: orange, textAlign: "center", fontSize: "0.8rem" }}>→</div>
                      <div style={{ fontSize: "0.78rem", color: "white", fontWeight: 500 }}>{s.corporate}</div>
                      <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.58rem", color: s.level === "EXPERT" ? orange : muted, border: `1px solid ${s.level === "EXPERT" ? "rgba(255,92,40,0.3)" : navyBorder}`, padding: "2px 7px", borderRadius: 4, whiteSpace: "nowrap" }}>{s.level}</div>
                    </div>
                  ))}
                </div>
              </ProfileSection>

              {/* Target roles */}
              {targetRoles.length > 0 && (
                <ProfileSection label="Target Roles">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {targetRoles.map(r => (
                      <span key={r} style={{ background: orangeGlow, border: "1px solid rgba(255,92,40,0.25)", color: "#FF7A4A", fontFamily: "DM Mono,monospace", fontSize: "0.65rem", padding: "4px 11px", borderRadius: 6, letterSpacing: "0.03em" }}>{r}</span>
                    ))}
                  </div>
                  {targetIndustries.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 10 }}>
                      {targetIndustries.map(r => (
                        <span key={r} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${navyBorder}`, color: muted, fontFamily: "DM Mono,monospace", fontSize: "0.65rem", padding: "4px 11px", borderRadius: 6, letterSpacing: "0.03em" }}>{r}</span>
                      ))}
                    </div>
                  )}
                </ProfileSection>
              )}
            </div>

            {/* ── GUEST CHECK VISUAL ── */}
            <div style={{ background: cream, color: ink, borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.4)", marginBottom: 20 }}>
              <div style={{ background: ink, padding: "18px 24px", textAlign: "center" }}>
                <div style={{ fontFamily: "Syne,sans-serif", fontSize: "1.15rem", fontWeight: 800, color: cream, letterSpacing: "0.1em" }}>SIDEWORK</div>
                <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.55rem", color: "rgba(250,248,244,0.4)", letterSpacing: "0.2em", marginTop: 3 }}>CANDIDATE SKILLS CHECK</div>
              </div>

              {/* Check meta */}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 24px", borderBottom: `1px solid ${receiptRule}`, background: "rgba(26,22,18,0.04)", flexWrap: "wrap", gap: 8 }}>
                {[
                  ["NAME", name || "—"],
                  ["LOCATION", location || "—"],
                  ["SCORE", `${MOCK_EVAL.score}/100`],
                  ["STATUS", "READY"],
                ].map(([label, val]) => (
                  <div key={label} style={{ fontFamily: "DM Mono,monospace", fontSize: "0.58rem", color: receiptFade, letterSpacing: "0.06em" }}>
                    {label}<strong style={{ display: "block", color: ink, marginTop: 2, fontSize: "0.65rem" }}>{val}</strong>
                  </div>
                ))}
              </div>

              <div style={{ padding: "16px 24px" }}>
                {/* Skills on the check */}
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "DM Mono,monospace", fontSize: "0.56rem", color: receiptFade, letterSpacing: "0.12em", textTransform: "uppercase", paddingBottom: 7, borderBottom: `1px solid ${receiptRule}`, marginBottom: 4 }}>
                  <span>SKILL</span><span>LEVEL</span>
                </div>
                {skills.slice(0, 6).map((s, i) => (
                  <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "7px 0", borderBottom: `1px dotted ${receiptRule}`, gap: 12 }}>
                    <div>
                      <div style={{ fontSize: "0.78rem", fontWeight: 600, color: ink, fontFamily: "DM Sans,sans-serif" }}>{s.corporate || s.raw}</div>
                      {s.note && <div style={{ fontSize: "0.63rem", color: receiptFade, fontStyle: "italic", marginTop: 1 }}>{s.note}</div>}
                    </div>
                    <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.63rem", color: ink, whiteSpace: "nowrap", paddingTop: 2, fontWeight: 500 }}>{s.level}</div>
                  </div>
                ))}

                {/* Totals */}
                <div style={{ paddingTop: 10, marginTop: 4, borderTop: `2px solid ${ink}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "DM Mono,monospace", fontSize: "0.63rem", color: receiptFade, padding: "3px 0" }}>
                    <span>TRANSFERABLE VALUE</span><span>{MOCK_EVAL.transferValue}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "DM Mono,monospace", fontSize: "0.78rem", color: ink, fontWeight: 700, borderTop: `1px solid ${receiptRule}`, paddingTop: 7, marginTop: 5 }}>
                    <span>TOTAL WORTH</span><span>PRICELESS</span>
                  </div>
                </div>
              </div>

              {/* Target roles on check */}
              {targetRoles.length > 0 && (
                <div style={{ padding: "10px 24px 16px", borderTop: `1px dashed ${receiptRule}` }}>
                  <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.56rem", color: receiptFade, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 7 }}>TARGET ROLES</div>
                  {targetRoles.slice(0, 4).map(r => (
                    <div key={r} style={{ fontSize: "0.72rem", color: ink, paddingBottom: 3, borderBottom: `1px dotted ${receiptRule}`, marginBottom: 3, fontFamily: "DM Sans,sans-serif" }}>— {r}</div>
                  ))}
                </div>
              )}

              <div style={{ background: ink, color: cream, padding: "11px 24px", textAlign: "center", fontFamily: "DM Mono,monospace", fontSize: "0.57rem", letterSpacing: "0.14em", opacity: 0.9 }}>
                IT'S LAST CALL. NOW WHAT? — SIDEWORK.IO
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }} className="no-print">
              <button onClick={() => window.print()} style={{ background: navyCard, border: `1px solid ${navyBorder}`, color: "white", padding: "14px", borderRadius: 12, fontFamily: "Syne,sans-serif", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", letterSpacing: "0.02em", transition: "all 0.15s" }}
                onMouseOver={e => e.currentTarget.style.borderColor = orange}
                onMouseOut={e => e.currentTarget.style.borderColor = navyBorder}>
                🖨 Download / Print Profile
              </button>
              <button style={{ background: orange, border: "none", color: "white", padding: "14px", borderRadius: 12, fontFamily: "Syne,sans-serif", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 16px rgba(255,92,40,0.4)`, letterSpacing: "0.02em", transition: "all 0.15s" }}
                onMouseOver={e => { e.currentTarget.style.background = "#FF7A4A"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseOut={e => { e.currentTarget.style.background = orange; e.currentTarget.style.transform = "translateY(0)"; }}>
                🔗 Share My Profile
              </button>
            </div>
            <button onClick={() => setStep(0)} style={{ background: "transparent", border: `1px solid ${navyBorder}`, color: muted, padding: "11px", borderRadius: 12, fontFamily: "DM Sans,sans-serif", fontSize: "0.82rem", cursor: "pointer", width: "100%", transition: "all 0.15s" }} className="no-print"
              onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "white"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = navyBorder; e.currentTarget.style.color = muted; }}>
              ← Edit Profile
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────

function StepHeader({ step, total, title, sub }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.62rem", color: muted, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>
        Step {step} of {total}
      </div>
      <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "clamp(1.4rem,3vw,2rem)", letterSpacing: "-0.01em", marginBottom: 8, lineHeight: 1.1 }}>{title}</h2>
      <p style={{ fontSize: "0.88rem", color: muted, lineHeight: 1.65 }}>{sub}</p>
    </div>
  );
}

function FieldRow({ label, hint, required, compact, children }) {
  return (
    <div style={{ marginBottom: compact ? 0 : 4 }}>
      <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.6rem", color: muted, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6, display: "flex", gap: 6, alignItems: "center" }}>
        {label}{required && <span style={{ color: orange }}>*</span>}
        {hint && <span style={{ fontSize: "0.58rem", color: "rgba(138,155,176,0.6)", textTransform: "none", letterSpacing: 0, fontFamily: "DM Sans,sans-serif" }}>— {hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", style = {} }) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: "100%", background: navy, border: `1.5px solid ${navyBorder}`, borderRadius: 10, padding: "11px 14px", color: "white", fontFamily: "DM Sans,sans-serif", fontSize: "0.88rem", transition: "border-color 0.18s", ...style }} />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      style={{ width: "100%", background: navy, border: `1.5px solid ${navyBorder}`, borderRadius: 10, padding: "11px 14px", color: "white", fontFamily: "DM Sans,sans-serif", fontSize: "0.88rem", lineHeight: 1.6, resize: "vertical", transition: "border-color 0.18s" }} />
  );
}

function ChipGroup({ options, selected, onToggle, single, wrap, dimUnselected }) {
  return (
    <div style={{ display: "flex", flexWrap: wrap ? "wrap" : "nowrap", gap: 7, overflowX: wrap ? "visible" : "auto", paddingBottom: 2 }}>
      {options.map(opt => {
        const active = selected.includes(opt);
        const dimmed = dimUnselected && !active;
        return (
          <button key={opt} className={`chip${active ? " active" : ""}`} onClick={() => onToggle(opt)}
            style={{
              background: active ? orangeGlow : "transparent",
              border: `1px solid ${active ? orange : dimmed ? "rgba(42,63,85,0.5)" : navyBorder}`,
              color: active ? orange : dimmed ? "rgba(138,155,176,0.35)" : muted,
              padding: "6px 13px", borderRadius: 20,
              fontFamily: "DM Mono,monospace", fontSize: "0.65rem",
              cursor: "pointer", letterSpacing: "0.04em",
              whiteSpace: "nowrap", transition: "all 0.15s", flexShrink: 0,
              opacity: dimmed ? 0.5 : 1,
            }}>
            {active && <span style={{ marginRight: 4, fontSize: "0.55rem" }}>✓</span>}{opt}
          </button>
        );
      })}
    </div>
  );
}

function NavRow({ onBack, onNext, canNext, nextLabel = "Next →", hideBack }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32 }}>
      {!hideBack
        ? <button className="btn-back" onClick={onBack} style={{ background: "transparent", border: `1px solid ${navyBorder}`, color: muted, padding: "12px 22px", borderRadius: 10, fontFamily: "DM Sans,sans-serif", fontSize: "0.85rem", cursor: "pointer", transition: "all 0.15s" }}>← Back</button>
        : <span />}
      <button className="btn-next" onClick={onNext} disabled={!canNext}
        style={{ background: canNext ? orange : navyBorder, border: "none", color: canNext ? "white" : muted, padding: "13px 28px", borderRadius: 10, fontFamily: "Syne,sans-serif", fontSize: "0.9rem", fontWeight: 700, cursor: canNext ? "pointer" : "not-allowed", boxShadow: canNext ? `0 3px 14px rgba(255,92,40,0.35)` : "none", transition: "all 0.18s", letterSpacing: "0.02em" }}>
        {nextLabel}
      </button>
    </div>
  );
}

function ProfileSection({ label, children }) {
  return (
    <div style={{ padding: "20px 28px", borderBottom: `1px solid ${navyBorder}` }}>
      <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.58rem", color: orange, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
        {label} <span style={{ flex: 1, height: 1, background: navyBorder, display: "inline-block" }} />
      </div>
      {children}
    </div>
  );
}

function Tag({ icon, children }) {
  return (
    <span style={{ fontFamily: "DM Mono,monospace", fontSize: "0.65rem", color: muted, letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: 4 }}>
      {icon} {children}
    </span>
  );
}
