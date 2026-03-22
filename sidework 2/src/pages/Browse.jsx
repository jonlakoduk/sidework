import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const navy="#0F1923",navyMid="#172130",navyCard="#1E2D3D",navyBorder="#2A3F55";
const orange="#FF5C28",orangeL="#FF7A4A",orangeGlow="rgba(255,92,40,0.12)";
const muted="#8A9BB0",green="#22C55E",greenGlow="rgba(34,197,94,0.1)",amber="#F59E0B",white="#FFFFFF";

const ALL_JOBS=[
  {id:1,match:94,featured:true,title:"Territory Sales Manager",hospTitle:"Territory Sales Manager",hospHook:"Your regulars follow you everywhere — now get paid for it.",company:"EquipmentShare",companyType:"verified",industry:"Construction Tech",location:"Remote / Midwest",remote:true,type:"Full-time",salary:"75000",salaryMax:"95000",salaryDisplay:"$75–95k + commission",posted:"2 days ago",postedDays:2,why:"You built a loyal room from scratch every season. Territory development is that exact skill with a company card and a car allowance.",desc:"EquipmentShare is looking for a Territory Sales Manager to grow our dealer and contractor network across the Midwest. You'll be the face of the brand in your region — building relationships from cold to close, managing an existing book, and identifying new opportunities. This is a hunter role. We want someone who thrives on autonomy and knows how to read a room before they've said a word.",requirements:["3+ years of relationship-based sales or customer-facing experience","Proven track record of building and retaining a client base","Comfortable managing a multi-state territory independently","Strong communicator — written, verbal, on the phone, in person"],hospWhy:["Running a bar short-staffed on a Saturday → Managing a territory solo without hand-holding","Getting regulars to order top shelf → Consultative upselling without being pushy","Training new staff from zero → Onboarding new accounts to your process"],tags:["Upselling","Territory Mgmt","Relationship Building","P&L"],hiringFor:"Jordan S., Head of Sales",saved:false,applied:false},
  {id:2,match:91,featured:true,title:"Hospitality Tech AE",hospTitle:"Hospitality Tech AE",hospHook:"Sell the tool you wished you had behind the bar.",company:"SevenRooms",companyType:"verified",industry:"Hospitality Tech",location:"Remote",remote:true,type:"Full-time",salary:"70000",salaryMax:"90000",salaryDisplay:"$70–90k + OTE",posted:"3 days ago",postedDays:3,why:"You've lived on both sides of the reservation system. That credibility is worth more than any sales training.",desc:"SevenRooms builds guest experience and CRM software used by restaurants, hotels, and venues worldwide. We're looking for an AE who has actually worked in hospitality — someone who can speak to operators as a peer, not a vendor. You'll run a full sales cycle from demo to close and help operators understand why their data is their most valuable asset.",requirements:["Direct hospitality or F&B operations experience preferred","Comfort running a full sales cycle with multiple stakeholders","Ability to deliver compelling product demos","Strong follow-through and CRM hygiene"],hospWhy:["Knowing which vendors to trust → Instant credibility with skeptical operators","Running nightly reports and tracking covers → You already speak the product's language","Managing a team of regulars → Account management is the same relationship, different software"],tags:["Industry Cred","Consultative Sales","SaaS","Demo Skills"],hiringFor:"Morgan T., VP Sales",saved:true,applied:false},
  {id:3,match:86,featured:false,title:"Client Success Manager",hospTitle:"Client Success Manager",hospHook:"Retention is your native language.",company:"Fintech Startup",companyType:"standard",industry:"SaaS / Finance",location:"Remote",remote:true,type:"Full-time",salary:"65000",salaryMax:"80000",salaryDisplay:"$65–80k",posted:"5 days ago",postedDays:5,why:"You turned first-time guests into regulars who asked for you by name. CSMs do the exact same thing with software accounts.",desc:"We're a Series B fintech building expense management tools for mid-size businesses. Our CSM team owns the post-sale relationship — onboarding new clients, driving adoption, handling escalations, and renewing contracts. We want someone with deep people skills and a genuine instinct for anticipating what someone needs before they ask.",requirements:["2+ years in a customer-facing role","Experience managing multiple accounts simultaneously","Comfortable with usage metrics and health scores","Strong written communication for async client work"],hospWhy:["Running a section of 8 tables → Managing a book of 30+ accounts","Knowing a regular's drink before they sit down → Proactive outreach before churn signals appear","Handling a complaint while the kitchen is backed up → Escalation management under pressure"],tags:["Retention","De-escalation","Multi-tasking","Communication"],hiringFor:"Casey B., Head of CS",saved:false,applied:false},
  {id:4,match:82,featured:false,title:"Patient Experience Coordinator",hospTitle:"Patient Experience Coordinator",hospHook:"Hospitality — just higher stakes.",company:"Regional Health Network",companyType:"verified",industry:"Healthcare",location:"Minot, ND",remote:false,type:"Full-time",salary:"52000",salaryMax:"64000",salaryDisplay:"$52–64k",posted:"1 week ago",postedDays:7,why:"Hospitals are actively recruiting hospitality crossovers for this exact role. The skill overlap is documented and direct.",desc:"Our health network is expanding its patient experience team across three facilities in western North Dakota. We're looking for coordinators who can bring genuine hospitality instincts to patient and family interactions — managing wait-time communication, resolving concerns before they escalate, and ensuring every touchpoint feels seen.",requirements:["Experience in a high-volume, people-facing environment","Demonstrated ability to de-escalate difficult interactions","Strong organizational skills across concurrent priorities","Comfort working within regulated environments (training provided)"],hospWhy:["Managing a difficult guest at last call → De-escalating a scared or frustrated patient","Coordinating FOH and BOH during a rush → Bridging patient-facing and clinical teams","Reading a table's mood before they wave you over → Anticipating patient needs proactively"],tags:["De-escalation","Empathy","Multi-tasking","Communication"],hiringFor:"Riley M., Patient Experience Lead",saved:false,applied:true},
  {id:5,match:78,featured:false,title:"People & Culture Manager",hospTitle:"People & Culture Manager",hospHook:"You were already doing this — just without the title.",company:"Distribution Co.",companyType:"standard",industry:"Logistics",location:"Hybrid / ND",remote:false,type:"Full-time",salary:"60000",salaryMax:"75000",salaryDisplay:"$60–75k",posted:"1 week ago",postedDays:7,why:"You hired, trained, scheduled, coached, and let people go. That is an HR resume — it just never had that title on it.",desc:"We're a regional distribution company building our first P&C function. We want someone with practical experience managing real humans — not just an HR certification and no floor time. You'll own recruiting, onboarding, performance management, and culture initiatives.",requirements:["Direct experience hiring and managing a team of 5+ people","Comfort with conflict resolution and difficult conversations","Organized enough to manage HR admin (compliance training provided)","Genuine care for people and how they experience their workplace"],hospWhy:["Hiring a line for a seasonal pop-up → Full-cycle recruiting for hourly and salaried roles","Dealing with a staff conflict mid-shift → Performance management and PIPs","Building a team culture from scratch → Culture initiatives in a growing company"],tags:["Hiring","Training","Conflict Resolution","Culture"],hiringFor:"Sam T., COO",saved:false,applied:false},
  {id:6,match:74,featured:false,title:"Operations Coordinator",hospTitle:"Operations Coordinator",hospHook:"You ran the floor. Now run the ops.",company:"Regional Distributor",companyType:"standard",industry:"Logistics",location:"Fargo, ND",remote:false,type:"Full-time",salary:"50000",salaryMax:"62000",salaryDisplay:"$50–62k",posted:"2 weeks ago",postedDays:14,why:"Operations coordination is shift management with a different uniform. You already know how to keep moving pieces from colliding.",desc:"Looking for an operations coordinator to support our regional logistics team. You'll manage scheduling, vendor communication, shipment tracking, and daily ops reporting. High-volume and detail-oriented — rewards people who stay calm when everything needs to happen at once.",requirements:["Experience managing schedules, logistics, or vendor relationships","Comfortable with spreadsheets and basic reporting","Strong communicator across multiple teams","Thrives in fast-paced, reactive environments"],hospWhy:["Managing delivery schedules from three distributors → Coordinating inbound shipments","Tracking par levels and flagging low stock → Inventory monitoring and reorder management","Running a crew of 8 across a busy Saturday → Shift coordination with cross-functional teams"],tags:["Vendor Mgmt","Scheduling","Logistics","Inventory"],hiringFor:"Alex K., Operations Director",saved:false,applied:false},
  {id:7,match:69,featured:false,title:"Recruiting Coordinator",hospTitle:"Recruiting Coordinator",hospHook:"You interviewed candidates under pressure. Now do it full time.",company:"Staffing Agency",companyType:"standard",industry:"HR / People Ops",location:"Remote",remote:true,type:"Contract",salary:"45000",salaryMax:"58000",salaryDisplay:"$45–58k",posted:"2 weeks ago",postedDays:14,why:"Hospitality managers interview more candidates per year than most corporate HR teams. You're already a recruiter.",desc:"We're a staffing agency specializing in hospitality placements. We want people with direct industry experience who can screen candidates with credibility, build relationships with hiring managers, and keep a high-volume pipeline organized.",requirements:["Experience interviewing or hiring in a fast-paced environment","Strong interpersonal and phone skills","Organized — manages 50+ candidate touchpoints weekly","Familiarity with hospitality roles"],hospWhy:["Screening servers for a seasonal hire → Coordinating candidate pipelines","Knowing within 2 minutes if someone can handle a rush → Instinct-based screening","Managing your own hire-to-fire cycles → Full ATS recruiting coordination (training provided)"],tags:["Hiring","Screening","Communication","Organization"],hiringFor:"Dana P., Director of Recruiting",saved:false,applied:false},
];

const INDUSTRIES=["All Industries","Construction Tech","Hospitality Tech","SaaS / Finance","Healthcare","Logistics","HR / People Ops"];
const SALARY_OPTS=["Any","$40k+","$50k+","$60k+","$70k+","$80k+"];
const TYPE_OPTS=["All Types","Full-time","Part-time","Contract"];
const SORT_OPTS=[["match","Best Match"],["recent","Most Recent"],["salary","Highest Salary"]];
const salaryMin={"Any":0,"$40k+":40000,"$50k+":50000,"$60k+":60000,"$70k+":70000,"$80k+":80000};

export default function JobBrowse(){
  const navigate = useNavigate();
  const [query,setQuery]=useState("");
  const [industry,setIndustry]=useState("All Industries");
  const [salaryFloor,setSalaryFloor]=useState("Any");
  const [jobType,setJobType]=useState("All Types");
  const [remoteOnly,setRemoteOnly]=useState(false);
  const [sortBy,setSortBy]=useState("match");
  const [showFilters,setShowFilters]=useState(true);
  const [selectedId,setSelectedId]=useState(1);
  const [jobs,setJobs]=useState(ALL_JOBS);
  const [showStd,setShowStd]=useState(false);

  function toggleSave(id,e){e&&e.stopPropagation();setJobs(j=>j.map(x=>x.id===id?{...x,saved:!x.saved}:x));}
  function applyJob(id){setJobs(j=>j.map(x=>x.id===id?{...x,applied:true}:x));}

  const activeFilters=[query&&`"${query}"`,industry!=="All Industries"&&industry,salaryFloor!=="Any"&&salaryFloor,jobType!=="All Types"&&jobType,remoteOnly&&"Remote only"].filter(Boolean);
  function clearFilters(){setQuery("");setIndustry("All Industries");setSalaryFloor("Any");setJobType("All Types");setRemoteOnly(false);}

  const filtered=useMemo(()=>{
    let list=jobs.filter(j=>{
      const q=query.toLowerCase();
      if(q&&!j.title.toLowerCase().includes(q)&&!j.company.toLowerCase().includes(q)&&!j.industry.toLowerCase().includes(q)&&!j.tags.some(t=>t.toLowerCase().includes(q)))return false;
      if(industry!=="All Industries"&&j.industry!==industry)return false;
      if(parseInt(j.salary)<salaryMin[salaryFloor])return false;
      if(jobType!=="All Types"&&j.type!==jobType)return false;
      if(remoteOnly&&!j.remote)return false;
      return true;
    });
    if(sortBy==="match")list=[...list].sort((a,b)=>b.match-a.match);
    if(sortBy==="recent")list=[...list].sort((a,b)=>a.postedDays-b.postedDays);
    if(sortBy==="salary")list=[...list].sort((a,b)=>parseInt(b.salaryMax)-parseInt(a.salaryMax));
    return list;
  },[jobs,query,industry,salaryFloor,jobType,remoteOnly,sortBy]);

  const effectiveId=filtered.find(j=>j.id===selectedId)?selectedId:filtered[0]?.id??null;
  const selected=jobs.find(j=>j.id===effectiveId);

  return(
    <div style={{background:navy,height:"100vh",fontFamily:"'DM Sans','Segoe UI',sans-serif",color:white,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fadeUp 0.28s ease forwards;}
        input:focus,select:focus{outline:none;border-color:${orange}!important;}
        .jr{transition:all 0.15s;cursor:pointer;border-left:3px solid transparent;}
        .jr:hover{background:rgba(255,255,255,0.03)!important;border-left-color:rgba(255,92,40,0.35)!important;}
        .jr.sel{background:${orangeGlow}!important;border-left-color:${orange}!important;}
        .sb:hover{color:${amber}!important;}
        .ab:hover{background:${orangeL}!important;transform:translateY(-1px);}
        .so:hover{color:${white}!important;}
        .so.on{color:${orange}!important;}
        .chip:hover{border-color:${orange}!important;color:${orange}!important;}
        .chip.on{border-color:${orange}!important;color:${orange}!important;background:${orangeGlow}!important;}
        .std:hover{color:${white}!important;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:${navyBorder};border-radius:2px;}
        select option{background:${navy};}
      `}</style>

      {/* TOPBAR */}
      <div style={{background:navyMid,borderBottom:`1px solid ${navyBorder}`,height:52,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px",flexShrink:0,zIndex:10}}>
        <div style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"1.05rem",letterSpacing:"0.04em",display:"flex",alignItems:"center",gap:8}}>
          <span style={{width:8,height:8,borderRadius:"50%",background:orange,boxShadow:`0 0 8px ${orange}`,display:"inline-block"}} onClick={()=>navigate("/")} style={{cursor:"pointer"}}/>sidework
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontFamily:"DM Mono,monospace",fontSize:"0.6rem",color:muted,letterSpacing:"0.1em"}}>{filtered.length} OPEN ROLES</span>
          <div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${orange},#c0392b)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"0.72rem"}}>AR</div>
        </div>
      </div>

      {/* SEARCH + FILTERS */}
      <div style={{background:navyMid,borderBottom:`1px solid ${navyBorder}`,padding:"10px 20px",flexShrink:0,zIndex:9}}>
        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:showFilters?8:0}}>
          <div style={{flex:1,position:"relative"}}>
            <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:muted,fontSize:"0.85rem",pointerEvents:"none"}}>🔍</span>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search roles, companies, skills..."
              style={{width:"100%",background:navy,border:`1.5px solid ${navyBorder}`,borderRadius:9,padding:"8px 32px 8px 32px",color:white,fontFamily:"DM Sans,sans-serif",fontSize:"0.85rem",transition:"border-color 0.18s"}}/>
            {query&&<button onClick={()=>setQuery("")} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:muted,cursor:"pointer",fontSize:"1.1rem",lineHeight:1,padding:0}}>×</button>}
          </div>
          <button onClick={()=>setShowFilters(f=>!f)}
            style={{background:showFilters?orangeGlow:"transparent",border:`1px solid ${showFilters?orange:navyBorder}`,color:showFilters?orange:muted,padding:"8px 13px",borderRadius:8,fontFamily:"DM Mono,monospace",fontSize:"0.58rem",cursor:"pointer",letterSpacing:"0.08em",transition:"all 0.15s",whiteSpace:"nowrap",flexShrink:0}}>
            {showFilters?"▲":"▼"} Filters{activeFilters.length>0?` · ${activeFilters.length}`:""}
          </button>
        </div>
        {showFilters&&(
          <div className="fu" style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"center"}}>
            <Sel value={industry} onChange={setIndustry} options={INDUSTRIES}/>
            <Sel value={salaryFloor} onChange={setSalaryFloor} options={SALARY_OPTS}/>
            <Sel value={jobType} onChange={setJobType} options={TYPE_OPTS}/>
            <button className={`chip${remoteOnly?" on":""}`} onClick={()=>setRemoteOnly(r=>!r)}
              style={{background:remoteOnly?orangeGlow:"transparent",border:`1px solid ${remoteOnly?orange:navyBorder}`,color:remoteOnly?orange:muted,padding:"6px 11px",borderRadius:7,fontFamily:"DM Mono,monospace",fontSize:"0.58rem",letterSpacing:"0.06em"}}>
              {remoteOnly?"✓ ":""}Remote Only
            </button>
            {activeFilters.length>0&&<button onClick={clearFilters} style={{background:"transparent",border:"none",color:muted,fontFamily:"DM Mono,monospace",fontSize:"0.56rem",cursor:"pointer",letterSpacing:"0.08em",textDecoration:"underline",padding:"6px 2px"}}>Clear all</button>}
            {activeFilters.map(f=><span key={f} style={{background:orangeGlow,border:`1px solid rgba(255,92,40,0.25)`,color:orangeL,fontFamily:"DM Mono,monospace",fontSize:"0.56rem",padding:"3px 9px",borderRadius:20,letterSpacing:"0.04em"}}>{f}</span>)}
          </div>
        )}
      </div>

      {/* SPLIT BODY */}
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>

        {/* LIST */}
        <div style={{width:310,flexShrink:0,borderRight:`1px solid ${navyBorder}`,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"9px 14px 7px",borderBottom:`1px solid ${navyBorder}`,display:"flex",gap:12,alignItems:"center",flexShrink:0}}>
            <span style={{fontFamily:"DM Mono,monospace",fontSize:"0.54rem",color:muted,letterSpacing:"0.1em"}}>SORT</span>
            {SORT_OPTS.map(([val,label])=>(
              <button key={val} className={`so${sortBy===val?" on":""}`} onClick={()=>setSortBy(val)}
                style={{background:"none",border:"none",borderBottom:sortBy===val?`1px solid ${orange}`:"1px solid transparent",fontFamily:"DM Mono,monospace",fontSize:"0.56rem",color:sortBy===val?orange:muted,letterSpacing:"0.05em",padding:"1px 0",cursor:"pointer"}}>
                {label}
              </button>
            ))}
          </div>
          <div style={{flex:1,overflowY:"auto"}}>
            {filtered.length===0?(
              <div style={{padding:"48px 20px",textAlign:"center"}}>
                <div style={{fontSize:"1.8rem",marginBottom:10}}>🍽</div>
                <div style={{fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:"0.95rem",marginBottom:6}}>No roles match those filters.</div>
                <div style={{fontSize:"0.72rem",color:muted,lineHeight:1.6,marginBottom:14}}>Try broadening your search.</div>
                <button onClick={clearFilters} style={{background:"transparent",border:`1px solid ${navyBorder}`,color:muted,padding:"7px 16px",borderRadius:8,fontFamily:"DM Mono,monospace",fontSize:"0.58rem",cursor:"pointer",letterSpacing:"0.08em"}}>Clear Filters</button>
              </div>
            ):filtered.map(job=>(
              <div key={job.id} className={`jr${effectiveId===job.id?" sel":""}`} onClick={()=>setSelectedId(job.id)}
                style={{padding:"12px 14px",borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
                {job.featured&&<div style={{fontFamily:"DM Mono,monospace",fontSize:"0.5rem",color:amber,letterSpacing:"0.1em",marginBottom:4}}>★ FEATURED</div>}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:3}}>
                  <div style={{fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:"0.83rem",lineHeight:1.25,flex:1}}>{job.hospTitle}</div>
                  <div style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"0.92rem",color:job.match>=90?green:job.match>=80?orange:amber,flexShrink:0}}>{job.match}</div>
                </div>
                <div style={{fontFamily:"DM Mono,monospace",fontSize:"0.56rem",color:muted,letterSpacing:"0.03em",marginBottom:5}}>
                  {job.company}{job.companyType==="verified"&&<span style={{color:green}}> ✓</span>} · {job.location}
                </div>
                <div style={{fontSize:"0.68rem",fontStyle:"italic",color:"rgba(138,155,176,0.65)",marginBottom:7,lineHeight:1.4}}>"{job.hospHook}"</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                    <Pill>{job.type}</Pill>
                    <Pill>{job.salaryDisplay}</Pill>
                    {job.applied&&<Pill color={green} bg={greenGlow}>APPLIED</Pill>}
                  </div>
                  <button className="sb" onClick={e=>toggleSave(job.id,e)} style={{background:"transparent",border:"none",color:job.saved?amber:"rgba(138,155,176,0.35)",fontSize:"0.9rem",cursor:"pointer",padding:"2px 4px",transition:"color 0.15s"}}>
                    {job.saved?"★":"☆"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DETAIL */}
        {selected?(
          <div key={selected.id} className="fu" style={{flex:1,overflowY:"auto",padding:"26px 30px",position:"relative"}}>
            <div style={{marginBottom:20}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:14,flexWrap:"wrap",marginBottom:10}}>
                <div style={{flex:1}}>
                  {selected.featured&&<div style={{fontFamily:"DM Mono,monospace",fontSize:"0.54rem",color:amber,letterSpacing:"0.12em",marginBottom:7}}>★ FEATURED EMPLOYER</div>}
                  <h1 style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"clamp(1.2rem,2.5vw,1.7rem)",letterSpacing:"-0.01em",lineHeight:1.1,marginBottom:5}}>{selected.hospTitle}</h1>
                  <div style={{fontSize:"0.78rem",color:muted,marginBottom:5}}>
                    <strong style={{color:white}}>{selected.company}</strong>
                    {selected.companyType==="verified"&&<span style={{color:green,fontSize:"0.68rem"}}> ✓ Verified</span>}
                    {" · "}{selected.industry}{" · "}{selected.location}
                  </div>
                  <button className="std" onClick={()=>setShowStd(s=>!s)}
                    style={{background:"none",border:"none",color:muted,fontFamily:"DM Mono,monospace",fontSize:"0.54rem",cursor:"pointer",letterSpacing:"0.08em",padding:0,transition:"color 0.15s"}}>
                    {showStd?`▲ Hide standard title`:`▼ Standard title: "${selected.title}"`}
                  </button>
                </div>
                <div style={{textAlign:"center",flexShrink:0}}>
                  <div style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"2.2rem",color:selected.match>=90?green:selected.match>=80?orange:amber,lineHeight:1}}>{selected.match}</div>
                  <div style={{fontFamily:"DM Mono,monospace",fontSize:"0.5rem",color:muted,letterSpacing:"0.1em"}}>MATCH</div>
                </div>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:9}}>
                {[selected.type,selected.salaryDisplay,selected.location,`Posted ${selected.posted}`].map(m=><Pill key={m}>{m}</Pill>)}
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {selected.tags.map(t=><span key={t} style={{background:orangeGlow,border:`1px solid rgba(255,92,40,0.2)`,color:orangeL,fontFamily:"DM Mono,monospace",fontSize:"0.56rem",padding:"3px 9px",borderRadius:5,letterSpacing:"0.03em"}}>{t}</span>)}
              </div>
            </div>

            <Sec label="Why You Fit">
              <div style={{fontStyle:"italic",fontSize:"0.84rem",color:"#E2E8F0",lineHeight:1.75,paddingLeft:13,borderLeft:`3px solid ${orange}`,marginBottom:13}}>"{selected.why}"</div>
              {selected.hospWhy.map((pt,i)=>(
                <div key={i} style={{display:"flex",gap:9,alignItems:"flex-start",padding:"5px 0",borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
                  <span style={{color:orange,fontSize:"0.66rem",paddingTop:3,flexShrink:0}}>→</span>
                  <span style={{fontSize:"0.8rem",color:"rgba(228,232,240,0.85)",lineHeight:1.55}}>{pt}</span>
                </div>
              ))}
            </Sec>

            <Sec label="About the Role">
              <p style={{fontSize:"0.82rem",color:"rgba(244,246,248,0.7)",lineHeight:1.8}}>{selected.desc}</p>
            </Sec>

            <Sec label="What They're Looking For">
              {selected.requirements.map((r,i)=>(
                <div key={i} style={{display:"flex",gap:9,alignItems:"flex-start",padding:"5px 0",borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
                  <span style={{color:navyBorder,fontSize:"0.68rem",paddingTop:3,flexShrink:0}}>—</span>
                  <span style={{fontSize:"0.8rem",color:"rgba(228,232,240,0.7)",lineHeight:1.55}}>{r}</span>
                </div>
              ))}
            </Sec>

            <div style={{background:navyCard,border:`1px solid ${navyBorder}`,borderRadius:11,padding:"12px 16px",marginBottom:80,display:"flex",alignItems:"center",gap:11}}>
              <div style={{width:34,height:34,borderRadius:"50%",background:navyBorder,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"0.66rem",flexShrink:0}}>
                {selected.hiringFor.split(" ").slice(0,2).map(n=>n[0]).join("")}
              </div>
              <div>
                <div style={{fontFamily:"DM Mono,monospace",fontSize:"0.52rem",color:muted,letterSpacing:"0.12em",marginBottom:2}}>HIRING CONTACT</div>
                <div style={{fontSize:"0.78rem",fontWeight:500}}>{selected.hiringFor}</div>
              </div>
            </div>

            {/* Sticky CTA */}
            <div style={{position:"sticky",bottom:0,background:`linear-gradient(0deg,${navy} 72%,transparent)`,paddingTop:22,paddingBottom:10,display:"flex",gap:9}}>
              {!selected.applied?(
                <button className="ab" onClick={()=>applyJob(selected.id)}
                  style={{flex:1,background:orange,border:"none",color:white,padding:"13px",borderRadius:11,fontFamily:"Syne,sans-serif",fontSize:"0.9rem",fontWeight:700,cursor:"pointer",boxShadow:`0 4px 18px rgba(255,92,40,0.4)`,letterSpacing:"0.02em",transition:"all 0.18s"}}>
                  Put In My Ticket →
                </button>
              ):(
                <div style={{flex:1,background:greenGlow,border:`1px solid rgba(34,197,94,0.25)`,borderRadius:11,padding:"13px",textAlign:"center",fontFamily:"DM Mono,monospace",fontSize:"0.7rem",color:green,letterSpacing:"0.1em"}}>
                  ✓ APPLICATION SENT — {selected.company} will be in touch
                </div>
              )}
              <button className="sb" onClick={e=>toggleSave(selected.id,e)}
                style={{background:"transparent",border:`1px solid ${selected.saved?amber:navyBorder}`,color:selected.saved?amber:muted,padding:"13px 17px",borderRadius:11,fontSize:"0.9rem",cursor:"pointer",transition:"all 0.15s"}}>
                {selected.saved?"★":"☆"}
              </button>
            </div>
          </div>
        ):(
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:muted,fontFamily:"DM Mono,monospace",fontSize:"0.68rem",letterSpacing:"0.12em"}}>
            SELECT A ROLE TO VIEW DETAILS
          </div>
        )}
      </div>
    </div>
  );
}

function Sel({value,onChange,options}){
  return(
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{background:navy,border:`1.5px solid ${navyBorder}`,borderRadius:7,padding:"6px 26px 6px 10px",color:value===options[0]?muted:white,fontFamily:"DM Mono,monospace",fontSize:"0.58rem",letterSpacing:"0.04em",cursor:"pointer",appearance:"none",backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%238A9BB0'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 8px center",transition:"border-color 0.18s"}}>
      {options.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function Pill({children,color,bg}){
  return(
    <span style={{fontFamily:"DM Mono,monospace",fontSize:"0.54rem",color:color||muted,background:bg||"rgba(255,255,255,0.04)",border:`1px solid ${color?"rgba(34,197,94,0.2)":navyBorder}`,padding:"2px 7px",borderRadius:4,letterSpacing:"0.04em",whiteSpace:"nowrap"}}>
      {children}
    </span>
  );
}

function Sec({label,children}){
  return(
    <div style={{marginBottom:20}}>
      <div style={{fontFamily:"DM Mono,monospace",fontSize:"0.54rem",color:orange,letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
        {label}<span style={{flex:1,height:1,background:navyBorder,display:"inline-block"}}/>
      </div>
      {children}
    </div>
  );
}
