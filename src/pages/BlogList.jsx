import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import api from "../lib/api";

const uniqueCategories = (items = []) => {
  const seen = new Set();
  return ["All", ...items].filter((item) => {
    const key = String(item || "").trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export default function BlogList() {
  const [active, setActive] = useState("All");
  const { data: blogs=[] } = useQuery({ queryKey:["blogs"],    queryFn:()=>api.get("/api/blogs").then(r=>r.data) });
  const { data: cfg={} }   = useQuery({ queryKey:["settings"], queryFn:()=>api.get("/api/settings").then(r=>r.data) });
  const cats = uniqueCategories(cfg.blogCategories);
  const list = active==="All" ? blogs : blogs.filter(b=>b.category===active);

  return (
    <>
      <Helmet><title>Blog — Portfolio</title></Helmet>
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.4}}>
        <div style={{marginBottom:"clamp(1.5rem,4vw,2.5rem)"}}>
          <p className="label-caps" style={{marginBottom:"0.5rem"}}>Writing</p>
          <h1 style={{fontFamily:"var(--font-display)",fontWeight:600,fontSize:"clamp(1.75rem,5vw,3rem)",lineHeight:1.1}}>Journal</h1>
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
            }}>{c}</button>
          ))}
        </div>

        {list.length===0 ? <p style={{color:"var(--text-muted)"}}>No posts yet.</p> : (
          <div style={{display:"flex",flexDirection:"column",gap:"clamp(0.75rem,2vw,1rem)"}}>
            {list.map((b,i)=>(
              <motion.div key={b._id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}>
                <Link to={`/blog/${b.slug}`}>
                  <article style={{padding:"clamp(1rem,2.5vw,1.5rem)",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r2)",transition:"all 0.2s"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--accent)";e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.06)"}} onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.boxShadow="none"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.5rem",flexWrap:"wrap"}}>
                      <span style={{fontSize:"clamp(0.6rem,1.1vw,0.7rem)",color:"var(--text-muted)"}}>{new Date(b.createdAt).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}</span>
                      {b.category && <span className="chip" style={{fontSize:"clamp(0.55rem,1vw,0.65rem)"}}>{b.category}</span>}
                    </div>
                    <h2 style={{fontFamily:"var(--font-display)",fontSize:"clamp(1rem,2.5vw,1.4rem)",fontWeight:600,lineHeight:1.25,marginBottom:"0.35rem",color:"var(--text)"}}>{b.title}</h2>
                    <p style={{color:"var(--text-secondary)",fontSize:"clamp(0.75rem,1.4vw,0.88rem)",lineHeight:1.5,marginBottom:"0.5rem"}}>{b.excerpt}</p>
                    <span style={{display:"inline-flex",alignItems:"center",gap:3,fontSize:"clamp(0.6rem,1.1vw,0.7rem)",fontWeight:600,textTransform:"uppercase",color:"var(--accent)"}}>
                      Read More <ArrowRight size={10}/>
                    </span>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </>
  );
}
