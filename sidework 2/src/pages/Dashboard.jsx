import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── PALETTE ────────────────────────────────────────────────────────────
const navy      = "#0F1923";
const navyMid   = "#172130";
const navyCard  = "#1E2D3D";
const navyBorder= "#2A3F55";
const orange    = "#FF5C28";
const orangeL   = "#FF7A4A";
const orangeGlow= "rgba(255,92,40,0.12)";
const muted     = "#8A9BB0";
const green     = "#22C55E";
const greenGlow = "rgba(34,197,94,0.1)";
const amber     = "#F59E0B";
const red       = "#EF4444";
const cream     = "#FAF8F4";
const ink       = "#1A1612";
const white     = "#FFFFFF";

// ── MOCK DATA ──────────────────────────────────────────────────────────
const CANDIDATE = {
  name: "Alex Rivera",
  headline: "10-yr bar operator turned revenue-focused people leader",
  location: "Minot, ND — open to remote",
  avail: "Immediately",
  score: 84,
  tier: "Executive Chef Material",
  profilePct: 78,
  skills: ["Conflict De-escalation","Consultative Upselling","P&L Ownership","Team Leadership","Vendor Negotiation"],
  targetRoles: ["Territory Sales Manager","Client Success Manager","Hospitality Tech AE"],
};

const MATCHED_JOBS = [
  {
    id: 1, match: 94, new: true,
    title: "Territory Sales Manager",
    hospTitle: "Territory Sales Manager (Your regulars follow you everywhere)",
    company: "EquipmentShare", industry: "Construction Tech",
    location: "Remote / Midwest", type: "Full-time", salary: "$75–95k + commission",
    posted: "2 days ago",
    why: "You built a loyal room from scratch. That's exactly what territory development looks like.",
    tags: ["Upselling","Relationship Building","P&L"],
    saved: false, applied: false,
  },
  {
    id: 2, match: 88, new: true,
    title: "Hospitality Tech Account Executive",
    hospTitle: "Hospitality Tech AE (Sell the tool you wished you had)",
    company: "SevenRooms", industry: "Hospitality Tech",
    location: "Remote", type: "Full-time", salary: "$70–90k + OTE",
    posted: "3 days ago",
    why: "You've lived on both sides of the reservation system. That credibility closes deals.",
    tags: ["Industry Knowledge","Consultative Sales","Demo Skills"],
    saved: true, applied: false,
  },
  {
    id: 3, match: 81,  new: false,
    title: "Client Success Manager",
    hospTitle: "Client Success Manager (Retention is your native language)",
    company: "Fintech Startup", industry: "SaaS / Finance",
    location: "Remote", type: "Full-time", salary: "$65–80k",
    posted: "5 days ago",
    why: "You turned one-time guests into regulars. CSMs do the exact same thing with accounts.",
    tags: ["Retention","De-escalation","Communication"],
    saved: false, applied: false,
  },
  {
    id: 4, match: 76, new: false,
    title: "Patient Experience Coordinator",
    hospTitle: "Patient Experience Coordinator (Hospitality, higher stakes)",
    company: "Regional Health Network", industry: "Healthcare",
    location: "Minot, ND", type: "Full-time", salary: "$52–64k",
    posted: "1 week ago",
    why: "Hospitals are hiring hospitality pros specifically. The skill overlap is near-perfect.",
    tags: ["De-escalation","Empathy","Multi-tasking"],
    saved: false, applied: true,
  },
  {
    id: 5, match: 71, new: false,
    title: "People & Culture Manager",
    hospTitle: "People & Culture Manager (You were already doing this)",
    company: "Distribution Co.", industry: "Logistics",
    location: "Hybrid / ND", type: "Full-time", salary: "$60–75k",
    posted: "1 week ago",
    why: "You hired, trained, scheduled, and let people go. That's an HR resume without the title.",
    tags: ["Hiring","Training","Conflict Resolution"],
    saved: false, applied: false,
  },
];

const EMPLOYER_ACTIVITY = [
  { id: 1, type: "view",    company: "EquipmentShare",       role: "Territory Sales Manager",          time: "2 hours ago",   read: false },
  { id: 2, type: "save",    company: "SevenRooms",           role: "Hospitality Tech AE",               time: "Yesterday",     read: false },
  { id: 3, type: "message", company: "Regional Health Network", role: "Patient Experience Coordinator", time: "2 days ago",    read: false },
  { id: 4, type: "view",    company: "Fintech Startup",      role: "Client Success Manager",            time: "3 days ago",    read: true  },
  { id: 5, type: "view",    company: "Distribution Co.",     role: "People & Culture Manager",          time: "4 days ago",    read: true  },
];

const PROFILE_STEPS = [
  { label: "Skills Evaluation",  done: true  },
  { label: "Work History",       done: true  },
  { label: "Translated Skills",  done: true  },
  { label: "Target Roles",       done: true  },
  { label: "Availability",       done: false },
  { label: "Salary Preferences", done: false },
  { label: "Photo / Headshot",   done: false },
];

const activityIcon = { view: "👁", save: "⭐", message: "💬" };
const activityLabel = { view: "viewed your profile", save: "saved your profile", message: "sent you a message" };
const activityColor = { view: muted, save: amber, message: green };

// ── MAIN ───────────────────────────────────────────────────────────────
export default function CandidateDashboard() {
  const navigate = useNavigate();
  const [tab, setTab]         = useState("matches"); // matches | activity | profile
  const [jobs, setJobs]       = useState(MATCHED_JOBS);
  const [activity, setActivity] = useState(EMPLOYER_ACTIVITY);
  const [expandedJob, setExpandedJob] = useState(null);
  const [filter, setFilter]   = useState("all"); // all | saved | applied

  const unread = activity.filter(a => !a.read).length;
  const newMatches = jobs.filter(j => j.new).length;

  function toggleSave(id) {
    setJobs(j => j.map(x => x.id === id ? { ...x, saved: !x.saved } : x));
  }
  function applyJob(id) {
    setJobs(j => j.map(x => x.id === id ? { ...x, applied: true } : x));
  }
  function markRead(id) {
    setActivity(a => a.map(x => x.id === id ? { ...x, read: true } : x));
  }
  function markAllRead() {
    setActivity(a => a.map(x => ({ ...x, read: true })));
  }

  function changeFilter(val) {
    setFilter(val);
    setExpandedJob(null); // close any open card when switching filters
  }

  const filteredJobs = jobs.filter(j => {
    if (filter === "saved")   return j.saved;
    if (filter === "applied") return j.applied;
    return true;
  });

  return (
    <div style={{ background: navy, minHeight: "100vh", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: white }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .fadeup { animation: fadeUp 0.35s ease forwards; }
        @keyframes shimmer { 0%{opacity:0.5} 50%{opacity:1} 100%{opacity:0.5} }
        .pulse { animation: shimmer 2.5s ease-in-out infinite; }
        .job-card { transition: all 0.18s; cursor: pointer; }
        .job-card:hover { border-color: rgba(255,92,40,0.4) !important; transform: translateX(3px); }
        .job-card.expanded { border-color: rgba(255,92,40,0.5) !important; }
        .nav-tab:hover { color: ${white} !important; }
        .save-btn:hover { color: ${amber} !important; border-color: ${amber} !important; }
        .apply-btn:hover { background: ${orangeL} !important; transform: translateY(-1px); }
        .activity-row:hover { background: rgba(255,255,255,0.03) !important; }
        .filter-chip:hover { border-color:${orange} !important; color:${orange} !important; }
        .filter-chip.on { border-color:${orange} !important; color:${orange} !important; background:${orangeGlow} !important; }
        .profile-step-done { color: ${green} !important; }
        .profile-step-todo { color: ${muted} !important; }
      `}</style>

      {/* TOPBAR */}
      <div style={{ background: navyMid, borderBottom: `1px solid ${navyBorder}`, height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.05rem", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: orange, boxShadow: `0 0 8px ${orange}`, display: "inline-block" }} onClick={() => navigate("/")} style={{cursor:"pointer"}} />
          sidework
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {unread > 0 && (
            <div className="pulse" style={{ background: orangeGlow, border: `1px solid rgba(255,92,40,0.3)`, borderRadius: 20, padding: "4px 12px", fontFamily: "DM Mono,monospace", fontSize: "0.6rem", color: orange, letterSpacing: "0.1em", cursor: "pointer" }} onClick={() => navigate("/messages")}>
              {unread} NEW {unread === 1 ? "NOTIFICATION" : "NOTIFICATIONS"}
            </div>
          )}
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${orange}, #c0392b)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "0.75rem", color: white, flexShrink: 0 }}>
            {CANDIDATE.name.split(" ").map(n => n[0]).join("")}
          </div>
        </div>
      </div>

      {/* CANDIDATE HEADER */}
      <div style={{ background: `linear-gradient(180deg, ${navyMid} 0%, ${navy} 100%)`, borderBottom: `1px solid ${navyBorder}`, padding: "24px 24px 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.6rem", color: green, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: green, boxShadow: `0 0 6px ${green}`, display: "inline-block" }} />
                Available · {CANDIDATE.avail}
              </div>
              <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "clamp(1.3rem,3vw,1.8rem)", letterSpacing: "-0.01em", marginBottom: 4, lineHeight: 1.1 }}>
                Good shift, {CANDIDATE.name.split(" ")[0]}.
              </h1>
              <div style={{ fontSize: "0.82rem", color: muted, lineHeight: 1.5 }}>{CANDIDATE.headline}</div>
            </div>

            {/* Score badge */}
            <div style={{ background: `linear-gradient(135deg, ${navyCard}, rgba(255,92,40,0.08))`, border: `1px solid rgba(255,92,40,0.25)`, borderRadius: 14, padding: "14px 20px", display: "flex", gap: 16, alignItems: "center", flexShrink: 0 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "2rem", color: orange, lineHeight: 1 }}>{CANDIDATE.score}</div>
                <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.52rem", color: muted, letterSpacing: "0.1em", marginTop: 2 }}>SKILLS SCORE</div>
              </div>
              <div>
                <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.82rem", marginBottom: 3 }}>{CANDIDATE.tier}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {CANDIDATE.skills.slice(0, 3).map(s => (
                    <span key={s} style={{ fontFamily: "DM Mono,monospace", fontSize: "0.55rem", color: orangeL, background: orangeGlow, border: `1px solid rgba(255,92,40,0.2)`, padding: "2px 7px", borderRadius: 4, letterSpacing: "0.03em" }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div style={{ display: "flex", gap: 0 }}>
            {[
              { id: "matches",  label: "Matched Jobs",       badge: newMatches > 0 ? newMatches : null },
              { id: "activity", label: "Employer Activity",  badge: unread > 0 ? unread : null },
              { id: "profile",  label: "My Profile",         badge: null },
            ].map(t => (
              <button key={t.id} className="nav-tab" onClick={() => setTab(t.id)}
                style={{ background: "transparent", border: "none", borderBottom: `2px solid ${tab === t.id ? orange : "transparent"}`, color: tab === t.id ? white : muted, padding: "12px 18px", fontFamily: "DM Sans,sans-serif", fontSize: "0.82rem", fontWeight: tab === t.id ? 600 : 400, cursor: "pointer", transition: "all 0.15s", letterSpacing: "0.01em", display: "flex", alignItems: "center", gap: 7 }}>
                {t.label}
                {t.badge && <span style={{ background: orange, color: white, fontSize: "0.55rem", fontFamily: "DM Mono,monospace", padding: "2px 6px", borderRadius: 10, fontWeight: 700 }}>{t.badge}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* ══ MATCHED JOBS ══ */}
        {tab === "matches" && (
          <div className="fadeup">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.2rem", marginBottom: 3 }}>
                  {filteredJobs.length} {filter === "all" ? "roles matched" : filter === "saved" ? "saved roles" : "applications"} to your profile
                </div>
                <div style={{ fontSize: "0.78rem", color: muted }}>Ranked by how closely employers' needs match your hospitality background.</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {[["all","All"],["saved","Saved"],["applied","Applied"]].map(([val, label]) => (
                  <button key={val} className={`filter-chip${filter === val ? " on" : ""}`} onClick={() => changeFilter(val)}
                    style={{ background: filter === val ? orangeGlow : "transparent", border: `1px solid ${filter === val ? orange : navyBorder}`, color: filter === val ? orange : muted, padding: "5px 14px", borderRadius: 20, fontFamily: "DM Mono,monospace", fontSize: "0.62rem", cursor: "pointer", letterSpacing: "0.06em", transition: "all 0.15s" }}>
                    {label}
                    {val === "saved"   && jobs.filter(j=>j.saved).length > 0   && ` · ${jobs.filter(j=>j.saved).length}`}
                    {val === "applied" && jobs.filter(j=>j.applied).length > 0 && ` · ${jobs.filter(j=>j.applied).length}`}
                  </button>
                ))}
              </div>
            </div>

            {filteredJobs.length === 0 && (
              <div style={{ background: navyCard, border: `1px dashed ${navyBorder}`, borderRadius: 14, padding: "40px 24px", textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: 10 }}>🍽</div>
                <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "1rem", marginBottom: 6 }}>Nothing here yet.</div>
                <div style={{ fontSize: "0.8rem", color: muted }}>
                  {filter === "saved" ? "Save jobs from the All tab to see them here." : "No applications yet — pick a role and put in your ticket."}
                </div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filteredJobs.map(job => (
                <div key={job.id}>
                  <div className={`job-card${expandedJob === job.id ? " expanded" : ""}`}
                    onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                    style={{ background: navyCard, border: `1px solid ${expandedJob === job.id ? "rgba(255,92,40,0.45)" : navyBorder}`, borderRadius: 14, padding: "16px 20px" }}>

                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
                      {/* Match score */}
                      <div style={{ textAlign: "center", flexShrink: 0, minWidth: 44 }}>
                        <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.35rem", color: job.match >= 90 ? green : job.match >= 80 ? orange : amber, lineHeight: 1 }}>{job.match}</div>
                        <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.5rem", color: muted, letterSpacing: "0.08em" }}>MATCH</div>
                      </div>

                      {/* Job info */}
                      <div style={{ flex: 1, minWidth: 180 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                          <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.95rem" }}>{job.hospTitle}</span>
                          {job.new && <span style={{ background: green, color: ink, fontSize: "0.52rem", fontFamily: "DM Mono,monospace", padding: "2px 7px", borderRadius: 4, fontWeight: 700, letterSpacing: "0.06em" }}>NEW</span>}
                          {job.applied && <span style={{ background: "rgba(34,197,94,0.12)", border: `1px solid rgba(34,197,94,0.25)`, color: green, fontSize: "0.52rem", fontFamily: "DM Mono,monospace", padding: "2px 7px", borderRadius: 4, letterSpacing: "0.06em" }}>APPLIED</span>}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: muted, marginBottom: 8 }}>
                          {job.company} · {job.industry} · {job.location}
                        </div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {job.tags.map(t => (
                            <span key={t} style={{ background: orangeGlow, border: `1px solid rgba(255,92,40,0.2)`, color: orangeL, fontFamily: "DM Mono,monospace", fontSize: "0.58rem", padding: "3px 8px", borderRadius: 5, letterSpacing: "0.03em" }}>{t}</span>
                          ))}
                        </div>
                      </div>

                      {/* Right side */}
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.85rem", color: white, marginBottom: 2 }}>{job.salary}</div>
                        <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.58rem", color: muted, marginBottom: 8 }}>{job.type} · {job.posted}</div>
                        <button className="save-btn" onClick={e => { e.stopPropagation(); toggleSave(job.id); }}
                          style={{ background: "transparent", border: `1px solid ${job.saved ? amber : navyBorder}`, color: job.saved ? amber : muted, padding: "4px 10px", borderRadius: 6, fontFamily: "DM Mono,monospace", fontSize: "0.58rem", cursor: "pointer", letterSpacing: "0.06em", transition: "all 0.15s" }}>
                          {job.saved ? "★ Saved" : "☆ Save"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {expandedJob === job.id && (
                    <div className="fadeup" style={{ background: `linear-gradient(135deg, ${navyCard}, rgba(255,92,40,0.04))`, border: `1px solid rgba(255,92,40,0.3)`, borderTop: "none", borderRadius: "0 0 14px 14px", padding: "20px 20px 20px 20px", marginTop: -2 }}>
                      {/* Why you fit */}
                      <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.58rem", color: orange, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 10 }}>Why You Fit</div>
                      <div style={{ fontSize: "0.85rem", color: "#E2E8F0", lineHeight: 1.7, marginBottom: 18, fontStyle: "italic", paddingLeft: 12, borderLeft: `3px solid ${orange}` }}>
                        "{job.why}"
                      </div>

                      {/* Standard title */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                        <span style={{ fontFamily: "DM Mono,monospace", fontSize: "0.58rem", color: muted, letterSpacing: "0.1em" }}>POSTED AS:</span>
                        <span style={{ fontSize: "0.78rem", color: muted }}>{job.title} at {job.company}</span>
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", gap: 10 }}>
                        {!job.applied ? (
                          <button className="apply-btn" onClick={e => { e.stopPropagation(); applyJob(job.id); }}
                            style={{ flex: 1, background: orange, border: "none", color: white, padding: "12px", borderRadius: 10, fontFamily: "Syne,sans-serif", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", boxShadow: `0 3px 14px rgba(255,92,40,0.35)`, letterSpacing: "0.02em", transition: "all 0.18s" }}>
                            Put In My Ticket →
                          </button>
                        ) : (
                          <div style={{ flex: 1, background: greenGlow, border: `1px solid rgba(34,197,94,0.25)`, borderRadius: 10, padding: "12px", textAlign: "center", fontFamily: "DM Mono,monospace", fontSize: "0.72rem", color: green, letterSpacing: "0.1em" }}>
                            ✓ APPLICATION SENT
                          </div>
                        )}
                        <button onClick={e => { e.stopPropagation(); toggleSave(job.id); }}
                          style={{ background: "transparent", border: `1px solid ${job.saved ? amber : navyBorder}`, color: job.saved ? amber : muted, padding: "12px 18px", borderRadius: 10, fontFamily: "DM Sans,sans-serif", fontSize: "0.82rem", cursor: "pointer", transition: "all 0.15s" }}>
                          {job.saved ? "★ Saved" : "☆ Save"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ EMPLOYER ACTIVITY ══ */}
        {tab === "activity" && (
          <div className="fadeup">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.2rem", marginBottom: 3 }}>Employer Activity</div>
                <div style={{ fontSize: "0.78rem", color: muted }}>Who's been checking your tab.</div>
              </div>
              {unread > 0 && (
                <button onClick={markAllRead}
                  style={{ background: "transparent", border: `1px solid ${navyBorder}`, color: muted, padding: "7px 14px", borderRadius: 8, fontFamily: "DM Mono,monospace", fontSize: "0.6rem", cursor: "pointer", letterSpacing: "0.08em", transition: "all 0.15s" }}
                  onMouseOver={e => { e.currentTarget.style.color = white; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                  onMouseOut={e => { e.currentTarget.style.color = muted; e.currentTarget.style.borderColor = navyBorder; }}>
                  Mark All Read
                </button>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {activity.map(a => (
                <div key={a.id} className="activity-row" onClick={() => markRead(a.id)}
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 12, background: a.read ? "transparent" : "rgba(255,255,255,0.02)", cursor: "pointer", transition: "background 0.15s", position: "relative" }}>

                  {/* Unread dot */}
                  {!a.read && (
                    <span style={{ position: "absolute", left: 4, top: "50%", transform: "translateY(-50%)", width: 6, height: 6, borderRadius: "50%", background: orange, boxShadow: `0 0 6px ${orange}` }} />
                  )}

                  {/* Icon */}
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: navyCard, border: `1px solid ${navyBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>
                    {activityIcon[a.type]}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.85rem", color: a.read ? muted : white, lineHeight: 1.4 }}>
                      <strong style={{ color: a.read ? "rgba(255,255,255,0.6)" : white, fontWeight: 600 }}>{a.company}</strong>
                      {" "}<span style={{ color: activityColor[a.type] }}>{activityLabel[a.type]}</span>
                    </div>
                    <div style={{ fontSize: "0.72rem", color: muted, marginTop: 2 }}>{a.role}</div>
                  </div>

                  <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.6rem", color: muted, letterSpacing: "0.06em", flexShrink: 0 }}>{a.time}</div>

                  {a.type === "message" && !a.read && (
                    <button onClick={e => e.stopPropagation()}
                      style={{ background: orange, border: "none", color: white, padding: "6px 14px", borderRadius: 7, fontFamily: "Syne,sans-serif", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", flexShrink: 0, boxShadow: `0 2px 8px rgba(255,92,40,0.35)` }}>
                      Reply
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Upgrade prompt */}
            <div style={{ marginTop: 24, background: navyCard, border: `1px dashed ${navyBorder}`, borderRadius: 14, padding: "22px 24px", textAlign: "center" }}>
              <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.6rem", color: muted, letterSpacing: "0.15em", marginBottom: 8 }}>FREE PLAN</div>
              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.95rem", marginBottom: 6 }}>You can see who viewed. You can't see who almost did.</div>
              <div style={{ fontSize: "0.78rem", color: muted, marginBottom: 16, lineHeight: 1.6 }}>Upgrade to see employers who searched for your skills but didn't visit yet — and get notified the moment someone views your profile.</div>
              <button style={{ background: orange, border: "none", color: white, padding: "10px 22px", borderRadius: 10, fontFamily: "Syne,sans-serif", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", boxShadow: `0 3px 12px rgba(255,92,40,0.3)`, letterSpacing: "0.02em" }}>
                Upgrade — See the Full Picture
              </button>
            </div>
          </div>
        )}

        {/* ══ MY PROFILE ══ */}
        {tab === "profile" && (
          <div className="fadeup">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.2rem", marginBottom: 3 }}>Profile Completeness</div>
                <div style={{ fontSize: "0.78rem", color: muted }}>Complete profiles get 3x more employer views. You're {CANDIDATE.profilePct}% of the way there.</div>
              </div>
              <button onClick={() => navigate("/profile")} style={{ background: orange, border: "none", color: white, padding: "10px 20px", borderRadius: 10, fontFamily: "Syne,sans-serif", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", boxShadow: `0 3px 12px rgba(255,92,40,0.3)`, letterSpacing: "0.02em" }}>
                Edit Profile
              </button>
            </div>

            {/* Progress bar */}
            <div style={{ background: navyCard, border: `1px solid ${navyBorder}`, borderRadius: 14, padding: "22px 24px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontFamily: "DM Mono,monospace", fontSize: "0.6rem", color: muted, letterSpacing: "0.12em" }}>PROFILE STRENGTH</span>
                <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.1rem", color: orange }}>{CANDIDATE.profilePct}%</span>
              </div>
              <div style={{ height: 8, background: navyBorder, borderRadius: 4, overflow: "hidden", marginBottom: 18 }}>
                <div style={{ height: "100%", width: `${CANDIDATE.profilePct}%`, background: `linear-gradient(90deg, ${orange}, ${orangeL})`, borderRadius: 4, boxShadow: `0 0 8px rgba(255,92,40,0.4)`, transition: "width 1s ease" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {PROFILE_STEPS.map((step, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: i < PROFILE_STEPS.length - 1 ? `1px solid rgba(255,255,255,0.04)` : "none" }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: step.done ? greenGlow : "transparent", border: `1.5px solid ${step.done ? green : navyBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", color: step.done ? green : muted, flexShrink: 0 }}>
                      {step.done ? "✓" : i + 1}
                    </div>
                    <span style={{ fontSize: "0.85rem", color: step.done ? "rgba(255,255,255,0.7)" : white, flex: 1, textDecoration: step.done ? "none" : "none" }}>{step.label}</span>
                    {!step.done && (
                      <button style={{ background: "transparent", border: `1px solid ${navyBorder}`, color: muted, padding: "4px 12px", borderRadius: 6, fontFamily: "DM Mono,monospace", fontSize: "0.58rem", cursor: "pointer", letterSpacing: "0.06em", transition: "all 0.15s" }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = orange; e.currentTarget.style.color = orange; }}
                        onMouseOut={e => { e.currentTarget.style.borderColor = navyBorder; e.currentTarget.style.color = muted; }}>
                        Add →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Profile preview card */}
            <div style={{ background: navyCard, border: `1px solid ${navyBorder}`, borderRadius: 14, padding: "22px 24px", marginBottom: 16 }}>
              <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.58rem", color: muted, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                Profile Preview <span style={{ flex: 1, height: 1, background: navyBorder, display: "inline-block" }} />
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.1rem", marginBottom: 4 }}>{CANDIDATE.name}</div>
                <div style={{ fontSize: "0.8rem", color: muted, marginBottom: 8 }}>{CANDIDATE.headline}</div>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "DM Mono,monospace", fontSize: "0.62rem", color: muted }}>📍 {CANDIDATE.location}</span>
                  <span style={{ fontFamily: "DM Mono,monospace", fontSize: "0.62rem", color: green }}>● Available {CANDIDATE.avail}</span>
                </div>
              </div>

              <div style={{ borderTop: `1px solid rgba(255,255,255,0.06)`, paddingTop: 14, marginBottom: 14 }}>
                <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.56rem", color: orange, letterSpacing: "0.14em", marginBottom: 8 }}>TOP SKILLS</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {CANDIDATE.skills.map(s => (
                    <span key={s} style={{ background: orangeGlow, border: `1px solid rgba(255,92,40,0.2)`, color: orangeL, fontFamily: "DM Mono,monospace", fontSize: "0.6rem", padding: "3px 10px", borderRadius: 5, letterSpacing: "0.03em" }}>{s}</span>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: `1px solid rgba(255,255,255,0.06)`, paddingTop: 14 }}>
                <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.56rem", color: orange, letterSpacing: "0.14em", marginBottom: 8 }}>TARGET ROLES</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {CANDIDATE.targetRoles.map(r => (
                    <span key={r} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${navyBorder}`, color: muted, fontFamily: "DM Mono,monospace", fontSize: "0.6rem", padding: "3px 10px", borderRadius: 5, letterSpacing: "0.03em" }}>{r}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Share profile */}
            <div style={{ background: `linear-gradient(135deg, ${navyCard}, rgba(255,92,40,0.06))`, border: `1px solid rgba(255,92,40,0.2)`, borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
              <div>
                <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.95rem", marginBottom: 4 }}>Share your Skills Check</div>
                <div style={{ fontSize: "0.78rem", color: muted, lineHeight: 1.55 }}>Send employers your guest check visual directly — even before they post a job.</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ background: "transparent", border: `1px solid ${navyBorder}`, color: muted, padding: "9px 16px", borderRadius: 9, fontFamily: "DM Mono,monospace", fontSize: "0.62rem", cursor: "pointer", letterSpacing: "0.08em", transition: "all 0.15s" }}
                  onMouseOver={e => { e.currentTarget.style.color = white; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                  onMouseOut={e => { e.currentTarget.style.color = muted; e.currentTarget.style.borderColor = navyBorder; }}>
                  🖨 Download
                </button>
                <button style={{ background: orange, border: "none", color: white, padding: "9px 18px", borderRadius: 9, fontFamily: "Syne,sans-serif", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", boxShadow: `0 3px 10px rgba(255,92,40,0.3)`, letterSpacing: "0.02em" }}>
                  🔗 Share Link
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
