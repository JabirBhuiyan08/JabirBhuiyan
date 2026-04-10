import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Send, CheckCircle, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export default function ContactPage() {
  const [sent,setSent] = useState(false);
  const [err,setErr]   = useState("");
  const { data: profile={} } = useQuery({ queryKey:["profile"],  queryFn:()=>api.get("/api/profile").then(r=>r.data) });
  const { register, handleSubmit, reset, formState:{errors,isSubmitting} } = useForm();

  const onSubmit = async(data)=>{
    setErr("");
    try { await api.post("/api/contact",data); setSent(true); reset(); }
    catch(e){ setErr(e.response?.data?.error||"Failed to send."); }
  };

  const items = [
    {icon:Mail,   label:"Email",    val:profile.email,    href:`mailto:${profile.email}`},
    {icon:Phone,  label:"Phone",    val:profile.phone,    href:`tel:${profile.phone}`},
    {icon:MapPin, label:"Location", val:profile.location, href:null},
  ].filter(r=>r.val);

  return (
    <>
      <Helmet><title>Contact — Portfolio</title></Helmet>
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.4}}>
        <div style={{marginBottom:"clamp(1.5rem,4vw,2.5rem)"}}>
          <p className="label-caps" style={{marginBottom:"0.5rem"}}>Get in Touch</p>
          <h1 style={{fontFamily:"var(--font-display)",fontWeight:600,fontSize:"clamp(1.75rem,5vw,3rem)",lineHeight:1.1}}>Contact</h1>
        </div>

        {/* Contact Info - stacked on mobile */}
        <div style={{marginBottom:"clamp(1.5rem,4vw,2.5rem)"}}>
          {items.map(({icon:Icon,label,val,href})=>(
            <div key={label} style={{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.75rem 0",borderBottom:"1px solid var(--border-light)"}}>
              <Icon size={14} color="var(--text-muted)"/>
              <div>
                <span className="label-caps" style={{fontSize:"0.6rem",marginRight:"0.5rem"}}>{label}</span>
                {href?
                  <a href={href} style={{fontSize:"clamp(0.85rem,1.5vw,1rem)",color:"var(--accent)",fontWeight:500}}>{val}</a>:
                  <span style={{fontSize:"clamp(0.85rem,1.5vw,1rem)",fontWeight:500}}>{val}</span>
                }
              </div>
            </div>
          ))}
        </div>

        {/* Form or Success message */}
        {sent ? (
          <motion.div initial={{opacity:0,scale:0.98}} animate={{opacity:1,scale:1}}
            style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r2)",padding:"clamp(1.25rem,3vw,2rem)",textAlign:"center"}}>
            <CheckCircle size={28} style={{color:"var(--success)",margin:"0 auto 0.75rem",display:"block"}}/>
            <h3 style={{fontFamily:"var(--font-display)",fontSize:"clamp(1.1rem,2.5vw,1.5rem)",fontWeight:600,marginBottom:"0.5rem"}}>Message Sent</h3>
            <p style={{color:"var(--text-muted)",fontSize:"clamp(0.8rem,1.5vw,0.9rem)",marginBottom:"1.25rem"}}>Thank you! I'll get back to you soon.</p>
            <button onClick={()=>setSent(false)} style={{border:"1px solid var(--border)",padding:"0.5rem 1rem",fontSize:"clamp(0.6rem,1.2vw,0.7rem)",fontWeight:600,textTransform:"uppercase",borderRadius:"var(--r)",background:"transparent",color:"var(--text-secondary)",cursor:"pointer"}}>Send Another</button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} style={{display:"flex",flexDirection:"column",gap:"clamp(0.75rem,2vw,1.25rem)"}}>
            {/* Name & Email - stack on mobile */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:"clamp(0.5rem,1.5vw,1rem)"}}>
              <div>
                <label style={{display:"block",fontSize:"clamp(0.6rem,1.2vw,0.7rem)",fontWeight:600,textTransform:"uppercase",color:"var(--text-muted)",marginBottom:"0.3rem"}}>Name *</label>
                <input {...register("name",{required:"Required"})} placeholder="Your name" className="field-input"/>
                {errors.name && <p style={{color:"var(--error)",fontSize:"clamp(0.65rem,1.2vw,0.75rem)",marginTop:"0.2rem"}}>{errors.name.message}</p>}
              </div>
              <div>
                <label style={{display:"block",fontSize:"clamp(0.6rem,1.2vw,0.7rem)",fontWeight:600,textTransform:"uppercase",color:"var(--text-muted)",marginBottom:"0.3rem"}}>Email *</label>
                <input {...register("email",{required:"Required",pattern:{value:/^\S+@\S+\.\S+$/,message:"Invalid"}})} placeholder="you@email.com" className="field-input"/>
                {errors.email && <p style={{color:"var(--error)",fontSize:"clamp(0.65rem,1.2vw,0.75rem)",marginTop:"0.2rem"}}>{errors.email.message}</p>}
              </div>
            </div>
            <div>
              <label style={{display:"block",fontSize:"clamp(0.6rem,1.2vw,0.7rem)",fontWeight:600,textTransform:"uppercase",color:"var(--text-muted)",marginBottom:"0.3rem"}}>Subject</label>
              <input {...register("subject")} placeholder="What is this about?" className="field-input"/>
            </div>
            <div>
              <label style={{display:"block",fontSize:"clamp(0.6rem,1.2vw,0.7rem)",fontWeight:600,textTransform:"uppercase",color:"var(--text-muted)",marginBottom:"0.3rem"}}>Message *</label>
              <textarea {...register("message",{required:"Required",minLength:{value:10,message:"At least 10 characters"}})} rows={4} placeholder="Tell me about your project..." className="field-input" style={{resize:"vertical",minHeight:"100px"}}/>
              {errors.message && <p style={{color:"var(--error)",fontSize:"clamp(0.65rem,1.2vw,0.75rem)",marginTop:"0.2rem"}}>{errors.message.message}</p>}
            </div>
            {err && <div style={{border:"1px solid var(--error)",padding:"0.5rem",color:"var(--error)",fontSize:"clamp(0.75rem,1.3vw,0.85rem)",borderRadius:"var(--r)"}}>{err}</div>}
            <button type="submit" disabled={isSubmitting} style={{alignSelf:"flex-start",display:"inline-flex",alignItems:"center",gap:6,background:"var(--accent)",color:"white",border:"none",padding:"clamp(0.5rem,1.2vw,0.75rem) clamp(1rem,2.5vw,1.75rem)",fontSize:"clamp(0.65rem,1.2vw,0.75rem)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",borderRadius:"var(--r)",cursor:isSubmitting?"not-allowed":"pointer",opacity:isSubmitting?0.7:1}}>
              <Send size={12}/> {isSubmitting?"Sending...":"Send Message"}
            </button>
          </form>
        )}
      </motion.div>
    </>
  );
}