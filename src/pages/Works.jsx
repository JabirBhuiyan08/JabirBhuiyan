import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ExternalLink, Github } from "lucide-react";
import api from "../lib/api";

export default function Works() {
  const [active, setActive] = useState("All");
  const { data: projects=[] } = useQuery({ queryKey:["projects"], queryFn:()=>api.get("/api/projects").then(r=>r.data) });
  const { data: cfg={} }      = useQuery({ queryKey:["settings"], queryFn:()=>api.get("/api/settings").then(r=>r.data) });
  const cats = ["All",...(cfg.portfolioCategories||[])];
  const list = active==="All" ? projects : projects.filter(p=>p.category===active);

  return (
    <>
      <Helmet><title>Works — Portfolio</title></Helmet>
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.4}}>
        <div style={{marginBottom:"clamp(1.5rem,4vw,2.5rem)"}}>
          <p className="label-caps" style={{marginBottom:"0.5rem"}}>Portfolio</p>
          <h1 style={{fontFamily:"var(--font-display)",fontWeight:600,fontSize:"clamp(1.75rem,5vw,3rem)",lineHeight:1.1}}>Works</h1>
        </div>

        <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap",marginBottom:"clamp(1.25rem,3vw,2rem)"}}>
          {cats.map(c=>(
            <button key={c} onClick={()=>setActive(c)} style={{
              padding:"clamp(0.35rem,1vw,0.45rem) clamp(0.6rem,1.5vw,1rem)",
              border:active===c?"none":"1px solid var(--border)",
              background:active===c?"var(--accent)":"var(--surface)",
              color:active===c?"white":"var(--text-secondary)",
              fontSize:"clamp(0.65rem,1.2vw,0.75rem)",fontWeight:600,textTransform:"uppercase",
              borderRadius:"var(--r)",transition:"all 0.15s",cursor:"pointer"
            }}>
              {c}
            </button>
          ))}
        </div>

        {list.length===0 ? (
          <p style={{color:"var(--text-muted)"}}>No projects yet.</p>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(clamp(200px,85vw,1fr),1fr))",gap:"clamp(0.75rem,2vw,1.25rem)"}}>
            <AnimatePresence mode="popLayout">
              {list.map((p,i)=>(
                <motion.article key={p._id} layout initial={{opacity:0,scale:0.97}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.97}} transition={{delay:i*0.03}}
                  style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r2)",overflow:"hidden",display:"flex",flexDirection:"column",transition:"all 0.2s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--accent)";e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.08)"}} onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.boxShadow="none"}}>
                  {p.imageUrl?
                    <img src={p.imageUrl} alt={p.title} style={{width:"100%",height:"clamp(100px,20vw,140px)",objectFit:"cover"}}/>:
                    <div style={{height:"clamp(100px,20vw,140px)",background:"var(--bg-alt)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-display)",fontSize:"clamp(1.5rem,4vw,2.5rem)",fontWeight:600,color:"var(--text-light)"}}>{p.title[0]}</div>
                  }
                  <div style={{padding:"clamp(0.75rem,2vw,1.25rem)",flex:1,display:"flex",flexDirection:"column"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"0.5rem",marginBottom:"0.4rem"}}>
                      <h3 style={{fontFamily:"var(--font-display)",fontSize:"clamp(0.9rem,2vw,1.1rem)",fontWeight:600,lineHeight:1.2}}>{p.title}</h3>
                    </div>
                    <span className="chip" style={{alignSelf:"flex-start",marginBottom:"0.5rem",fontSize:"clamp(0.6rem,1vw,0.7rem)"}}>{p.category}</span>
                    <p style={{color:"var(--text-secondary)",fontSize:"clamp(0.7rem,1.3vw,0.85rem)",lineHeight:1.5,marginBottom:"clamp(0.5rem,1.2vw,0.75rem)",flex:1}}>{p.description}</p>
                    <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap",marginBottom:"0.5rem"}}>
                      {p.tags?.slice(0,3).map(t=><span key={t} style={{fontSize:"clamp(0.55rem,1vw,0.65rem)",color:"var(--text-light)",background:"var(--bg-alt)",padding:"2px 5px",borderRadius:"2px"}}>{t}</span>)}
                    </div>
                    <div style={{display:"flex",gap:"0.5rem",marginTop:"auto"}}>
                      {p.liveUrl&&<a href={p.liveUrl} target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",gap:3,color:"var(--accent)",fontSize:"clamp(0.6rem,1vw,0.7rem)",fontWeight:600,textTransform:"uppercase"}}><ExternalLink size={10}/> Live</a>}
                      {p.repoUrl&&<a href={p.repoUrl} target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",gap:3,color:"var(--text-muted)",fontSize:"clamp(0.6rem,1vw,0.7rem)",fontWeight:600,textTransform:"uppercase"}}><Github size={10}/> Code</a>}
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </>
  );
}