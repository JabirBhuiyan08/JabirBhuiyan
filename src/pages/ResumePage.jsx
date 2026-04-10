import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import api from "../lib/api";

export default function ResumePage() {
  const { data: resume={experience:[],education:[],skills:[]} } = useQuery({ queryKey:["resume"], queryFn:()=>api.get("/api/resume").then(r=>r.data) });
  return (
    <>
      <Helmet><title>Resume — Portfolio</title></Helmet>
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.4}}>
        <div style={{marginBottom:"clamp(1.5rem,4vw,2.5rem)"}}>
          <p className="label-caps" style={{marginBottom:"0.5rem"}}>Background</p>
          <h1 style={{fontFamily:"var(--font-display)",fontWeight:600,fontSize:"clamp(1.75rem,5vw,3rem)",lineHeight:1.1}}>Resume</h1>
        </div>

        {/* Experience */}
        <section style={{marginBottom:"clamp(1.5rem,4vw,2.5rem)"}}>
          <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"clamp(1rem,2.5vw,1.5rem)"}}>
            <h2 style={{fontFamily:"var(--font-display)",fontSize:"clamp(0.95rem,2vw,1.2rem)",fontWeight:600,color:"var(--text)",whiteSpace:"nowrap"}}>Experience</h2>
            <div style={{flex:1,height:"1px",background:"var(--border)"}}/>
          </div>
          
          {resume.experience?.length===0 && <p style={{color:"var(--text-muted)",fontSize:"clamp(0.8rem,1.5vw,0.9rem)"}}>Nothing added yet.</p>}
          {resume.experience?.map((e,i)=>(
            <motion.div key={i} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.05}}
              style={{paddingBottom:"clamp(1rem,2.5vw,1.5rem)",marginBottom:"clamp(1rem,2.5vw,1.5rem)",borderBottom:"1px solid var(--border-light)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"0.5rem",marginBottom:"0.25rem",flexWrap:"wrap"}}>
                <h3 style={{fontFamily:"var(--font-display)",fontSize:"clamp(0.95rem,2vw,1.15rem)",fontWeight:600,lineHeight:1.2}}>{e.role}</h3>
                <span style={{fontSize:"clamp(0.6rem,1.1vw,0.7rem)",fontWeight:600,color:"var(--text-muted)",whiteSpace:"nowrap",background:"var(--bg-alt)",padding:"2px 6px",borderRadius:"var(--r)"}}>{e.startDate} — {e.current?"Present":e.endDate}</span>
              </div>
              <p style={{fontSize:"clamp(0.7rem,1.3vw,0.8rem)",fontWeight:600,color:"var(--text-secondary)",marginBottom:"0.35rem"}}>{e.company}</p>
              {e.description && <p style={{color:"var(--text-secondary)",fontSize:"clamp(0.7rem,1.3vw,0.85rem)",lineHeight:1.5}}>{e.description}</p>}
            </motion.div>
          ))}
        </section>

        {/* Education */}
        <section style={{marginBottom:"clamp(1.5rem,4vw,2.5rem)"}}>
          <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"clamp(1rem,2.5vw,1.5rem)"}}>
            <h2 style={{fontFamily:"var(--font-display)",fontSize:"clamp(0.95rem,2vw,1.2rem)",fontWeight:600,color:"var(--text)",whiteSpace:"nowrap"}}>Education</h2>
            <div style={{flex:1,height:"1px",background:"var(--border)"}}/>
          </div>
          
          {resume.education?.length===0 && <p style={{color:"var(--text-muted)",fontSize:"clamp(0.8rem,1.5vw,0.9rem)"}}>Nothing added yet.</p>}
          {resume.education?.map((e,i)=>(
            <div key={i} style={{paddingBottom:"clamp(0.75rem,2vw,1.25rem)",marginBottom:"clamp(0.75rem,2vw,1.25rem)",borderBottom:"1px solid var(--border-light)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"0.5rem",marginBottom:"0.25rem",flexWrap:"wrap"}}>
                <h3 style={{fontFamily:"var(--font-display)",fontSize:"clamp(0.95rem,2vw,1.15rem)",fontWeight:600,lineHeight:1.2}}>{e.degree} in {e.field}</h3>
                <span style={{fontSize:"clamp(0.6rem,1.1vw,0.7rem)",fontWeight:600,color:"var(--text-muted)",whiteSpace:"nowrap",background:"var(--bg-alt)",padding:"2px 6px",borderRadius:"var(--r)"}}>{e.startDate} — {e.endDate}</span>
              </div>
              <p style={{color:"var(--text-secondary)",fontSize:"clamp(0.7rem,1.3vw,0.85rem)"}}>{e.institution}</p>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section>
          <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"clamp(1rem,2.5vw,1.5rem)"}}>
            <h2 style={{fontFamily:"var(--font-display)",fontSize:"clamp(0.95rem,2vw,1.2rem)",fontWeight:600,color:"var(--text)",whiteSpace:"nowrap"}}>Skills</h2>
            <div style={{flex:1,height:"1px",background:"var(--border)"}}/>
          </div>
          
          {resume.skills?.length===0 && <p style={{color:"var(--text-muted)",fontSize:"clamp(0.8rem,1.5vw,0.9rem)"}}>Nothing added yet.</p>}
          {resume.skills?.map((g,i)=>(
            <div key={i} style={{marginBottom:"clamp(0.75rem,2vw,1.25rem)"}}>
              <p className="label-caps" style={{marginBottom:"0.4rem",fontSize:"clamp(0.6rem,1.1vw,0.7rem)"}}>{g.category}</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:"0.35rem"}}>
                {g.items?.map(sk=>(
                  <span key={sk} style={{border:"1px solid var(--border)",padding:"0.2rem 0.5rem",fontSize:"clamp(0.65rem,1.2vw,0.78rem)",color:"var(--text-secondary)",borderRadius:"var(--r)",transition:"all 0.15s",cursor:"default"}}
                    onMouseEnter={e=>{e.currentTarget.style.background="var(--accent)";e.currentTarget.style.color="white";e.currentTarget.style.borderColor="var(--accent)"}}
                    onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="var(--text-secondary)";e.currentTarget.style.borderColor="var(--border)"}}>
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>
      </motion.div>
    </>
  );
}