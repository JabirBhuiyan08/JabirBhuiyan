import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Github, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import api from "../lib/api";

const up = (d=0) => ({ initial:{opacity:0,y:16}, animate:{opacity:1,y:0}, transition:{duration:0.5,delay:d,ease:[0.22,1,0.36,1]} });

export default function Home() {
  const { data: profile={} } = useQuery({ queryKey:["profile"], queryFn:()=>api.get("/api/profile").then(r=>r.data) });
  const { data: cfg={} }     = useQuery({ queryKey:["settings"],queryFn:()=>api.get("/api/settings").then(r=>r.data) });
  const { data: projects=[] }= useQuery({ queryKey:["projects"],queryFn:()=>api.get("/api/projects").then(r=>r.data) });
  const { data: tmnls=[] }   = useQuery({ queryKey:["testimonials"],queryFn:()=>api.get("/api/testimonials").then(r=>r.data) });
  const featured = projects.filter(p=>p.featured).slice(0,3);
  const topT = tmnls.slice(0,3);

  return (
    <>
      <Helmet><title>{profile.name||cfg.siteTitle||"Portfolio"}</title><meta name="description" content={profile.bio?.slice(0,155)||cfg.tagline||""}/></Helmet>

      {/* Hero Section */}
      <section style={{marginBottom:"clamp(2rem,5vw,4rem)"}}>
        <motion.div {...up(0)}>
          <p className="label-caps" style={{marginBottom:"0.75rem", letterSpacing:"0.15em"}}>Portfolio</p>
          <h1 style={{fontFamily:"var(--font-display)",fontSize:"clamp(2rem,6vw,3.5rem)",fontWeight:600,lineHeight:1.05,marginBottom:"1rem",color:"var(--text)"}}>
            {profile.name||"—"}
          </h1>
        </motion.div>

        <motion.div {...up(0.1)} style={{marginBottom:"clamp(1.25rem,3vw,1.75rem)"}}>
          <p style={{fontSize:"clamp(0.85rem,1.5vw,1rem)",color:"var(--text-secondary)",lineHeight:1.6}}>
            {profile.bio||"Add your bio from the admin dashboard."}
          </p>
        </motion.div>

        <motion.div {...up(0.15)} style={{display:"flex",gap:"clamp(0.5rem,1.5vw,1rem)",flexWrap:"wrap"}}>
          <Link to="/works" className="btn btn-primary" style={{padding:"clamp(0.5rem,1.2vw,0.6rem) clamp(0.75rem,2vw,1.25rem)",fontSize:"clamp(0.65rem,1.2vw,0.8rem)"}}>View Works <ArrowRight size={12}/></Link>
          <Link to="/contact" className="btn btn-secondary" style={{padding:"clamp(0.5rem,1.2vw,0.6rem) clamp(0.75rem,2vw,1.25rem)",fontSize:"clamp(0.65rem,1.2vw,0.8rem)"}}>Get In Touch</Link>
        </motion.div>
      </section>

      {/* Featured Projects */}
      {featured.length>0 && (
        <motion.section {...up(0.2)} style={{marginBottom:"clamp(2rem,5vw,4rem)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"clamp(1rem,2.5vw,1.5rem)",paddingBottom:"0.5rem",borderBottom:"1px solid var(--border)"}}>
            <h2 style={{fontFamily:"var(--font-display)",fontSize:"clamp(1.1rem,2.5vw,1.5rem)",fontWeight:600}}>Selected Works</h2>
            <Link to="/works" style={{display:"flex",alignItems:"center",gap:4,fontSize:"clamp(0.6rem,1.2vw,0.7rem)",fontWeight:600,textTransform:"uppercase",color:"var(--text-muted)",transition:"color 0.15s"}} onMouseEnter={e=>e.currentTarget.style.color="var(--accent)"} onMouseLeave={e=>e.currentTarget.style.color="var(--text-muted)"}>All Works <ArrowRight size={10}/></Link>
          </div>
          
          <div style={{display:"flex",flexDirection:"column",gap:"clamp(0.5rem,1.5vw,0.75rem)"}}>
            {featured.map((p,i)=>(
              <motion.div key={p._id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.25+i*0.06}}
                style={{display:"flex",flexDirection:"column",gap:"clamp(0.75rem,2vw,1rem)",padding:"clamp(0.75rem,2vw,1.25rem)",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r2)",transition:"all 0.2s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--accent)";e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.06)"}} onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.boxShadow="none"}}>
                {/* Image row */}
                {p.imageUrl && (
                  <img src={p.imageUrl} alt={p.title} style={{width:"100%",height:"clamp(80px,15vw,120px)",objectFit:"cover",borderRadius:"var(--r)"}}/>
                )}
                {/* Content */}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"0.75rem"}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.25rem",flexWrap:"wrap"}}>
                      <h3 style={{fontFamily:"var(--font-display)",fontSize:"clamp(0.95rem,2vw,1.2rem)",fontWeight:600,lineHeight:1.2}}>{p.title}</h3>
                      <span className="chip" style={{fontSize:"clamp(0.55rem,1vw,0.65rem)"}}>{p.category}</span>
                    </div>
                    <p style={{color:"var(--text-secondary)",fontSize:"clamp(0.7rem,1.3vw,0.85rem)",lineHeight:1.5}}>{p.description.slice(0,100)}{p.description.length>100?"…":""}</p>
                    <div style={{display:"flex",gap:"0.3rem",flexWrap:"wrap",marginTop:"0.4rem"}}>
                      {p.tags?.slice(0,4).map(t=><span key={t} style={{fontSize:"clamp(0.55rem,1vw,0.65rem)",color:"var(--text-light)",background:"var(--bg-alt)",padding:"2px 5px",borderRadius:"2px"}}>{t}</span>)}
                    </div>
                  </div>
                  <div style={{display:"flex",gap:"0.3rem",flexShrink:0}}>
                    {p.liveUrl&&<a href={p.liveUrl} target="_blank" rel="noreferrer" style={{width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid var(--border)",borderRadius:"var(--r)",color:"var(--accent)"}}><ExternalLink size={10}/></a>}
                    {p.repoUrl&&<a href={p.repoUrl} target="_blank" rel="noreferrer" style={{width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid var(--border)",borderRadius:"var(--r)",color:"var(--text-muted)"}}><Github size={10}/></a>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Testimonials */}
      {topT.length>0 && (
        <motion.section {...up(0.35)}>
          <div style={{marginBottom:"clamp(1rem,2.5vw,1.5rem)",paddingBottom:"0.5rem",borderBottom:"1px solid var(--border)"}}>
            <h2 style={{fontFamily:"var(--font-display)",fontSize:"clamp(1.1rem,2.5vw,1.5rem)",fontWeight:600}}>Testimonials</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(clamp(180px,85vw,1fr),1fr))",gap:"clamp(0.75rem,2vw,1rem)"}}>
            {topT.map((t,i)=>(
              <motion.div key={t._id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.4+i*0.06}}
                style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r2)",padding:"clamp(1rem,2vw,1.25rem)"}}>
                <div style={{display:"flex",gap:2,marginBottom:"0.5rem"}}>
                  {Array.from({length:t.rating||5}).map((_i,idx)=><Star key={idx} size={10} fill="var(--accent)" color="var(--accent)" strokeWidth={0}/>)}
                </div>
                <p style={{fontSize:"clamp(0.75rem,1.4vw,0.9rem)",lineHeight:1.5,color:"var(--text-secondary)",marginBottom:"0.75rem",fontStyle:"italic"}}>"{t.text}"</p>
                <div style={{display:"flex",alignItems:"center",gap:"0.5rem",paddingTop:"0.5rem",borderTop:"1px solid var(--border-light)"}}>
                  {t.avatarUrl?<img src={t.avatarUrl} alt={t.name} style={{width:24,height:24,borderRadius:"50%",objectFit:"cover"}}/>:<div style={{width:24,height:24,borderRadius:"50%",background:"var(--bg-alt)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:600,fontSize:"0.65rem",color:"var(--text-muted)"}}>{t.name?.[0]}</div>}
                  <div>
                    <p style={{fontWeight:600,fontSize:"clamp(0.7rem,1.2vw,0.8rem)"}}>{t.name}</p>
                    {(t.role||t.company)&&<p style={{fontSize:"clamp(0.6rem,1vw,0.7rem)",color:"var(--text-muted)"}}>{t.role}{t.role&&t.company?", ":""}{t.company}</p>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </>
  );
}