import { useState, useEffect, useRef } from "react";
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
const receiptRule= "#E2DDD6";

const ME = { id: "me", name: "Alex Rivera", initials: "AR" };

// ── THREAD DATA ────────────────────────────────────────────────────────
const THREADS = [
  {
    id: 1,
    company: "EquipmentShare",
    companyInitials: "ES",
    companyColor: "#1a6b3a",
    contact: "Jordan Smith",
    contactTitle: "Head of Talent",
    role: "Territory Sales Manager",
    verified: true,
    unread: 2,
    lastTime: "2:14 PM",
    lastMsg: "We'd love to set up a 30-minute intro call this week. Are you available Thursday or Friday?",
    messages: [
      { id:1, from:"them", text:"Hi Alex — I came across your Sidework profile and wanted to reach out. Your background managing Miracle on First caught my attention. We're hiring Territory Sales Managers and your experience building a loyal room from scratch is exactly the instinct we look for. Would you be open to a quick conversation?", time:"Mon 9:12 AM", read:true },
      { id:2, from:"me",   text:"Hey Jordan — thanks for reaching out. I've actually been looking at EquipmentShare for a few weeks, the territory structure looks really interesting. I'd definitely be open to a conversation. What does the onboarding typically look like for someone coming from outside traditional sales?", time:"Mon 11:45 AM", read:true },
      { id:3, from:"them", text:"Great question. Honestly, we've found that the people who ramp fastest are the ones who already know how to build relationships from scratch — and that's not something we can teach. The product knowledge comes in the first 30 days. We give you a territory, a quota, and a lot of autonomy. Former hospitality folks tend to hit their stride around month two.", time:"Mon 2:30 PM", read:true },
      { id:4, from:"me",   text:"That timeline actually makes sense to me. I ran a seasonal bar — the first 30 days of every season was basically the same thing. New systems, new team, new regulars to earn. What's the territory look like for this role specifically?", time:"Mon 4:01 PM", read:true },
      { id:5, from:"them", text:"It's a five-state Midwest territory — ND, SD, MN, WI, and IA. Primarily construction and ag equipment rental companies. Travel is real but manageable, maybe 40% of the time. Your Minot location is actually ideal for the northern part of the territory.", time:"Tue 9:55 AM", read:true },
      { id:6, from:"them", text:"We'd love to set up a 30-minute intro call this week. Are you available Thursday or Friday?", time:"Wed 2:14 PM", read:false },
    ],
  },
  {
    id: 2,
    company: "SevenRooms",
    companyInitials: "7R",
    companyColor: "#7c3aed",
    contact: "Maya Patel",
    contactTitle: "Senior Recruiter",
    role: "Hospitality Tech AE",
    verified: true,
    unread: 1,
    lastTime: "Yesterday",
    lastMsg: "Your profile was saved by our hiring manager — wanted to connect before the role fills.",
    messages: [
      { id:1, from:"them", text:"Hi Alex — your Sidework profile was saved by our hiring manager for the Hospitality Tech AE role. I wanted to reach out directly before the position fills. Your bar ownership background is genuinely rare in our candidate pool — most applicants have never actually used a reservation system under real service pressure. Would love to tell you more about the role.", time:"Yesterday 10:30 AM", read:false },
    ],
  },
  {
    id: 3,
    company: "Regional Health Network",
    companyInitials: "RH",
    companyColor: "#0e7490",
    contact: "Chris Larson",
    contactTitle: "Patient Experience Director",
    role: "Patient Experience Coordinator",
    verified: true,
    unread: 0,
    lastTime: "Mon",
    lastMsg: "Thanks for applying — we'll be in touch by end of week.",
    messages: [
      { id:1, from:"them", text:"Hi Alex, thanks for submitting your application for the Patient Experience Coordinator role. We reviewed your Sidework Skills Check and your background aligns really well with what we're building here. We're actively interviewing and will be in touch by end of week.", time:"Mon 3:00 PM", read:true },
      { id:2, from:"me",   text:"Appreciate the update, Chris. Looking forward to hearing more. Happy to answer any questions about my background in the meantime.", time:"Mon 4:22 PM", read:true },
      { id:3, from:"them", text:"Thanks for applying — we'll be in touch by end of week.", time:"Mon 4:45 PM", read:true },
    ],
  },
  {
    id: 4,
    company: "Fintech Startup",
    companyInitials: "FS",
    companyColor: "#b45309",
    contact: "Sam Wu",
    contactTitle: "Recruiting Lead",
    role: "Client Success Manager",
    verified: false,
    unread: 0,
    lastTime: "Last week",
    lastMsg: "We've moved forward with other candidates at this time.",
    messages: [
      { id:1, from:"them", text:"Hi Alex, we reviewed your profile for the Client Success Manager role. Your hospitality background is impressive but we're looking for candidates with prior SaaS experience for this particular opening. We'll keep your profile on file for future roles.", time:"Last week", read:true },
      { id:2, from:"me",   text:"Thanks for letting me know, Sam. Appreciate the transparency. If a more entry-level CS role opens up I'd love to be considered — I learn product quickly.", time:"Last week", read:true },
      { id:3, from:"them", text:"We've moved forward with other candidates at this time.", time:"Last week", read:true },
    ],
  },
];

// ── AI REPLY SUGGESTIONS ───────────────────────────────────────────────
const SUGGESTIONS = {
  1: ["Thursday works great — morning or afternoon both open for me.", "I'm free Thursday after 10am or anytime Friday.", "Thursday or Friday both work. What time zone are you in?"],
  2: ["Thanks Maya — I'd love to learn more. What does the AE role look like day to day?", "Really appreciate the outreach. Happy to connect this week.", "Definitely interested. Can you share more about the territory and quota structure?"],
  3: ["Thank you — looking forward to it.", "Sounds great, I'll keep an eye out.", "No problem, take your time. I'm available for a call anytime this week."],
  4: [],
};

export default function Messaging() {
  const navigate = useNavigate();
  const [activeId,    setActiveId]    = useState(1);
  const [threads,     setThreads]     = useState(THREADS);
  const [draft,       setDraft]       = useState("");
  const [generating,  setGenerating]  = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(SUGGESTIONS[1] || []);
  const [loadingSugg, setLoadingSugg] = useState(false);
  const [sending,     setSending]     = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  const active = threads.find(t => t.id === activeId);
  const totalUnread = threads.reduce((n, t) => n + t.unread, 0);

  // Mark thread as read when opened
  useEffect(() => {
    setThreads(ts => ts.map(t => t.id === activeId ? { ...t, unread: 0, messages: t.messages.map(m => ({ ...m, read: true })) } : t));
    setAiSuggestions(SUGGESTIONS[activeId] || []);
    setDraft("");
  }, [activeId]);

  // Scroll to bottom on thread change or new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeId, threads]);

  function sendMessage(text) {
    if (!text.trim()) return;
    setSending(true);
    const newMsg = { id: Date.now(), from: "me", text: text.trim(), time: "Just now", read: true };
    setThreads(ts => ts.map(t => t.id === activeId
      ? { ...t, messages: [...t.messages, newMsg], lastMsg: text.trim(), lastTime: "Just now" }
      : t
    ));
    setDraft("");
    setAiSuggestions([]);
    setTimeout(() => setSending(false), 300);
    setTimeout(() => inputRef.current?.focus(), 350);
  }

  async function generateReplies() {
    if (!active) return;
    setLoadingSugg(true);
    setAiSuggestions([]);
    const lastFew = active.messages.slice(-3).map(m => `${m.from === "me" ? "Candidate" : active.contact}: ${m.text}`).join("\n");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 400,
          messages: [{ role: "user", content: `You write reply suggestions for Sidework — a job board for hospitality workers transitioning careers. The candidate is Alex Rivera, a 10-year bar owner/manager now looking for roles in sales, client success, or hospitality tech.

Recent conversation:
${lastFew}

Write exactly 3 short reply options for the candidate. Each should be 1-2 sentences max, warm and direct, no corporate jargon. Return ONLY raw JSON — no markdown, no backticks:
["reply one", "reply two", "reply three"]` }]
        })
      });
      const data = await res.json();
      const raw = data.content.map(b => b.text || "").join("");
      const first = raw.indexOf("["), last = raw.lastIndexOf("]");
      const parsed = JSON.parse(raw.slice(first, last + 1));
      setAiSuggestions(parsed.slice(0, 3));
    } catch (e) {
      setAiSuggestions(SUGGESTIONS[activeId] || []);
    }
    setLoadingSugg(false);
  }

  function Avatar({ initials, color, size = 34 }) {
    return (
      <div style={{ width: size, height: size, borderRadius: "50%", background: color || `linear-gradient(135deg,${orange},#c0392b)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: size * 0.32, color: white, flexShrink: 0, letterSpacing: "0.02em" }}>
        {initials}
      </div>
    );
  }

  return (
    <div style={{ background: navy, height: "100vh", display: "flex", flexDirection: "column", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: white, overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        textarea:focus { outline: none; border-color: ${orange} !important; }
        .thread-row { transition: background 0.15s; cursor: pointer; }
        .thread-row:hover { background: rgba(255,255,255,0.04) !important; }
        .thread-row.active { background: ${orangeGlow} !important; border-left: 3px solid ${orange} !important; }
        .sugg-btn { transition: all 0.15s; cursor: pointer; text-align: left; }
        .sugg-btn:hover { border-color: ${orange} !important; color: ${white} !important; background: ${orangeGlow} !important; }
        .send-btn:hover:not(:disabled) { background: ${orangeL} !important; transform: translateY(-1px); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${navyBorder}; border-radius: 2px; }
      `}</style>

      {/* TOPBAR */}
      <div style={{ background: navyMid, borderBottom: `1px solid ${navyBorder}`, height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", flexShrink: 0, zIndex: 10 }}>
        <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.05rem", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: orange, boxShadow: `0 0 8px ${orange}`, display: "inline-block" }} onClick={() => navigate("/")} style={{cursor:"pointer"}} /> sidework
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {totalUnread > 0 && (
            <div style={{ background: orange, color: white, fontFamily: "DM Mono,monospace", fontSize: "0.58rem", fontWeight: 700, padding: "3px 9px", borderRadius: 20, letterSpacing: "0.06em" }}>
              {totalUnread} UNREAD
            </div>
          )}
          <Avatar initials="AR" size={32} />
        </div>
      </div>

      {/* BODY: sidebar + thread */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "300px 1fr", overflow: "hidden" }}>

        {/* ── INBOX SIDEBAR ── */}
        <div style={{ borderRight: `1px solid ${navyBorder}`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Sidebar header */}
          <div style={{ padding: "16px 18px 12px", borderBottom: `1px solid ${navyBorder}`, flexShrink: 0 }}>
            <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.05rem", marginBottom: 2 }}>Messages</div>
            <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.58rem", color: muted, letterSpacing: "0.1em" }}>
              {threads.filter(t => t.unread > 0).length > 0
                ? `${threads.filter(t => t.unread > 0).length} conversations need a reply`
                : "You're all caught up"}
            </div>
          </div>

          {/* Thread list */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {threads.map(t => (
              <div key={t.id} className={`thread-row${activeId === t.id ? " active" : ""}`}
                onClick={() => setActiveId(t.id)}
                style={{ padding: "13px 18px", borderLeft: `3px solid transparent`, borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <Avatar initials={t.companyInitials} color={t.companyColor} size={36} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.83rem", color: t.unread > 0 ? white : "rgba(255,255,255,0.7)" }}>{t.company}</span>
                        {t.verified && <span style={{ color: green, fontSize: "0.6rem" }}>✓</span>}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <span style={{ fontFamily: "DM Mono,monospace", fontSize: "0.52rem", color: muted, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{t.lastTime}</span>
                        {t.unread > 0 && <span style={{ background: orange, color: white, width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.5rem", fontWeight: 700, fontFamily: "DM Mono,monospace", flexShrink: 0 }}>{t.unread}</span>}
                      </div>
                    </div>
                    <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.56rem", color: orange, letterSpacing: "0.06em", marginBottom: 4, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{t.role}</div>
                    <div style={{ fontSize: "0.73rem", color: t.unread > 0 ? "rgba(255,255,255,0.65)" : muted, lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{t.lastMsg}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── MESSAGE THREAD ── */}
        {active && (
          <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Thread header */}
            <div style={{ padding: "14px 22px", borderBottom: `1px solid ${navyBorder}`, flexShrink: 0, background: navyMid, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar initials={active.companyInitials} color={active.companyColor} size={38} />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.95rem" }}>{active.company}</span>
                    {active.verified && <span style={{ fontFamily: "DM Mono,monospace", fontSize: "0.52rem", color: green, background: greenGlow, border: `1px solid rgba(34,197,94,0.2)`, padding: "2px 6px", borderRadius: 4, letterSpacing: "0.06em" }}>✓ VERIFIED</span>}
                  </div>
                  <div style={{ fontSize: "0.73rem", color: muted }}>{active.contact} · {active.contactTitle}</div>
                </div>
              </div>
              {/* Job context pill */}
              <div style={{ background: orangeGlow, border: `1px solid rgba(255,92,40,0.25)`, borderRadius: 20, padding: "5px 14px", fontFamily: "DM Mono,monospace", fontSize: "0.58rem", color: orangeL, letterSpacing: "0.06em", flexShrink: 0, whiteSpace: "nowrap" }}>
                Re: {active.role}
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
              {active.messages.map((msg, i) => {
                const isMe = msg.from === "me";
                const showAvatar = i === 0 || active.messages[i-1].from !== msg.from;
                return (
                  <div key={msg.id} style={{ display: "flex", flexDirection: isMe ? "row-reverse" : "row", alignItems: "flex-end", gap: 8, animation: `fadeUp 0.2s ease ${Math.min(i,6)*0.04}s both` }}>
                    {!isMe && (
                      <div style={{ width: 30, flexShrink: 0 }}>
                        {showAvatar && <Avatar initials={active.companyInitials} color={active.companyColor} size={28} />}
                      </div>
                    )}
                    <div style={{ maxWidth: "70%", display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start", gap: 4 }}>
                      <div style={{
                        background: isMe ? orange : navyCard,
                        border: isMe ? "none" : `1px solid ${navyBorder}`,
                        borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        padding: "10px 14px",
                        fontSize: "0.85rem",
                        lineHeight: 1.65,
                        color: isMe ? white : "rgba(244,246,248,0.9)",
                        boxShadow: isMe ? `0 2px 10px rgba(255,92,40,0.25)` : "none",
                      }}>
                        {msg.text}
                      </div>
                      <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.5rem", color: muted, letterSpacing: "0.06em", paddingLeft: isMe ? 0 : 4, paddingRight: isMe ? 4 : 0 }}>
                        {isMe ? "You" : active.contact} · {msg.time}
                      </div>
                    </div>
                    {isMe && (
                      <div style={{ width: 30, flexShrink: 0, display: "flex", justifyContent: "flex-end" }}>
                        {showAvatar && <Avatar initials="AR" size={28} />}
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* AI reply suggestions */}
            <div style={{ padding: "10px 22px 0", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.54rem", color: muted, letterSpacing: "0.12em", textTransform: "uppercase" }}>Quick Replies</div>
                <button onClick={generateReplies} disabled={loadingSugg}
                  style={{ background: "transparent", border: `1px solid ${navyBorder}`, color: muted, padding: "2px 10px", borderRadius: 20, fontFamily: "DM Mono,monospace", fontSize: "0.52rem", cursor: "pointer", letterSpacing: "0.08em", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 5 }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = orange; e.currentTarget.style.color = orange; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = navyBorder; e.currentTarget.style.color = muted; }}>
                  {loadingSugg ? <span style={{ animation: "spin 0.7s linear infinite", display: "inline-block" }}>↻</span> : "↻"} {loadingSugg ? "Generating..." : "AI Suggestions"}
                </button>
              </div>

              {aiSuggestions.length > 0 && (
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 10 }}>
                  {aiSuggestions.map((s, i) => (
                    <button key={i} className="sugg-btn" onClick={() => sendMessage(s)}
                      style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${navyBorder}`, color: muted, padding: "7px 12px", borderRadius: 10, fontFamily: "DM Sans,sans-serif", fontSize: "0.75rem", lineHeight: 1.4, maxWidth: 260, animation: `fadeUp 0.2s ease ${i*0.07}s both` }}>
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {loadingSugg && aiSuggestions.length === 0 && (
                <div style={{ display: "flex", gap: 7, marginBottom: 10 }}>
                  {[1,2,3].map(i => (
                    <div key={i} style={{ height: 36, flex: 1, background: navyCard, borderRadius: 10, border: `1px solid ${navyBorder}`, opacity: 0.5 }} />
                  ))}
                </div>
              )}
            </div>

            {/* Compose */}
            <div style={{ padding: "10px 22px 18px", flexShrink: 0, borderTop: `1px solid ${navyBorder}` }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                <textarea
                  ref={inputRef}
                  rows={2}
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(draft); } }}
                  placeholder={`Reply to ${active.contact}... (Enter to send, Shift+Enter for new line)`}
                  style={{ flex: 1, background: navyCard, border: `1.5px solid ${navyBorder}`, borderRadius: 12, padding: "11px 14px", color: white, fontFamily: "DM Sans,sans-serif", fontSize: "0.88rem", lineHeight: 1.55, resize: "none", transition: "border-color 0.18s" }}
                />
                <button className="send-btn" onClick={() => sendMessage(draft)} disabled={!draft.trim() || sending}
                  style={{ background: draft.trim() ? orange : navyBorder, border: "none", color: draft.trim() ? white : muted, width: 44, height: 44, borderRadius: 12, cursor: draft.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", boxShadow: draft.trim() ? `0 3px 12px rgba(255,92,40,0.35)` : "none", transition: "all 0.18s", flexShrink: 0 }}>
                  →
                </button>
              </div>
              <div style={{ fontFamily: "DM Mono,monospace", fontSize: "0.52rem", color: muted, letterSpacing: "0.08em", marginTop: 6, paddingLeft: 2 }}>
                Enter to send · Shift+Enter for new line
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
