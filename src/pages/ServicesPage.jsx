import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Mail, Play } from "lucide-react";
import api from "../lib/api";

export default function ServicesPage() {
  const { data: services=[], isLoading } = useQuery({ 
    queryKey:["services"], 
    queryFn:()=>api.get("/api/services").then(r=>r.data).catch(()=>[])
  });
  
  if (isLoading) {
    return (
      <>
        <Helmet><title>Services — Portfolio</title></Helmet>
        <div style={{marginBottom:"clamp(1.5rem,4vw,2.5rem)"}}>
          <p className="label-caps" style={{marginBottom:"0.5rem"}}>What I Offer</p>
          <h1 style={{fontFamily:"var(--font-display)",fontWeight:600,fontSize:"clamp(1.75rem,5vw,3rem)",lineHeight:1.1}}>Services</h1>
        </div>
        <p style={{color:"var(--text-muted)"}}>Loading...</p>
      </>
    );
  }
  
  return (
    <>
      <Helmet><title>Services — Portfolio</title></Helmet>
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.4}}>
        <div style={{marginBottom:"clamp(1.5rem,4vw,2.5rem)"}}>
          <p className="label-caps" style={{marginBottom:"0.5rem"}}>What I Offer</p>
          <h1 style={{fontFamily:"var(--font-display)",fontWeight:600,fontSize:"clamp(1.75rem,5vw,3rem)",lineHeight:1.1}}>Services</h1>
        </div>
        
        {!services || services.length === 0 ? (
          <p style={{color:"var(--text-muted)"}}>No services yet.</p>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:"clamp(0.75rem,2vw,1rem)"}}>
            {services.map((s,i)=>(
              <motion.div 
                key={s._id || i} 
                initial={{opacity:0,x:-12}} 
                animate={{opacity:1,x:0}} 
                transition={{delay:i*0.06}}
                style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r2)",overflow:"hidden",transition:"all 0.2s"}}
                onMouseEnter={(e)=>{e.currentTarget.style.borderColor="var(--accent)";e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.06)"}} 
                onMouseLeave={(e)=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.boxShadow="none"}}
              >
                {/* Image */}
                {s.imageUrl && (
                  <div style={{width:"100%",height:"clamp(100px,20vw,160px)",overflow:"hidden"}}>
                    <img src={s.imageUrl} alt={s.title || ""} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  </div>
                )}
                
                {/* Content */}
                <div style={{padding:"clamp(0.75rem,2.5vw,1.5rem)"}}>
                  {/* Icon + Text row */}
                  <div style={{display:"flex",gap:"clamp(0.75rem,2vw,1.25rem)",alignItems:"flex-start",marginBottom:"clamp(0.5rem,1.5vw,1rem)"}}>
                    <span style={{fontSize:"clamp(1.25rem,3vw,1.75rem)",lineHeight:1,flexShrink:0,paddingTop:"0.1rem"}}>
                      {s.icon || "★"}
                    </span>
                    <div style={{minWidth:0}}>
                      <h3 style={{fontFamily:"var(--font-display)",fontSize:"clamp(1rem,2.5vw,1.25rem)",fontWeight:600,lineHeight:1.2,marginBottom:"0.25rem"}}>
                        {s.title || "Service"}
                      </h3>
                      <p style={{color:"var(--text-secondary)",fontSize:"clamp(0.75rem,1.5vw,0.9rem)",lineHeight:1.5}}>
                        {s.description || ""}
                      </p>
                    </div>
                  </div>
                  
                  {/* Meta info row */}
                  <div style={{display:"flex",flexWrap:"wrap",gap:"0.5rem",alignItems:"center"}}>
                    {/* Pricing */}
                    {s.pricing && (
                      <span style={{background:"var(--bg-alt)",padding:"0.25rem 0.6rem",borderRadius:"var(--r)",fontSize:"clamp(0.7rem,1.2vw,0.8rem)",fontWeight:600,color:"var(--accent)"}}>
                        {s.pricing}
                      </span>
                    )}
                    
                    {/* Video Link */}
                    {s.videoUrl && (
                      <a 
                        href={s.videoUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{display:"inline-flex",alignItems:"center",gap:"0.25rem",color:"var(--text-secondary)",fontSize:"clamp(0.7rem,1.2vw,0.8rem)",transition:"color 0.15s"}}
                        onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
                      >
                        <Play size={10} /> Watch
                      </a>
                    )}
                    
                    {/* Contact */}
                    {s.contact && (
                      <span style={{display:"inline-flex",alignItems:"center",gap:"0.25rem",color:"var(--text-muted)",fontSize:"clamp(0.7rem,1.2vw,0.8rem)"}}>
                        <Mail size={10} /> {s.contact}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </>
  );
}