import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import api from "../lib/api";

export default function BlogPost() {
  const { slug } = useParams();
  const { data: post, isLoading, isError } = useQuery({ queryKey:["blog",slug], queryFn:()=>api.get(`/api/blogs/${slug}`).then(r=>r.data) });

  if (isLoading) return <p style={{color:"var(--text-muted)"}}>Loading…</p>;
  if (isError||!post) return <div><p style={{color:"var(--text-muted)",marginBottom:"1rem"}}>Post not found.</p><Link to="/blog" style={{color:"var(--accent)",fontSize:"0.9rem"}}>← Back to Journal</Link></div>;

  return (
    <>
      <Helmet><title>{post.title}</title><meta name="description" content={post.excerpt}/></Helmet>
      <motion.article initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.4}} style={{maxWidth:680}}>
        <Link to="/blog" style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:"clamp(0.65rem,1.2vw,0.75rem)",fontWeight:600,textTransform:"uppercase",color:"var(--text-muted)",marginBottom:"clamp(1rem,2.5vw,1.5rem)",transition:"color 0.15s"}} onMouseEnter={e=>e.currentTarget.style.color="var(--accent)"} onMouseLeave={e=>e.currentTarget.style.color="var(--text-muted)"}><ArrowLeft size={12}/> Back</Link>
        
        {post.coverUrl && <img src={post.coverUrl} alt={post.title} style={{width:"100%",height:"clamp(140px,30vw,220px)",objectFit:"cover",marginBottom:"clamp(1rem,2.5vw,1.5rem)",borderRadius:"var(--r2)"}}/>}
        
        <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap",marginBottom:"0.75rem"}}>
          {post.category && <span className="chip chip-dark" style={{fontSize:"clamp(0.55rem,1vw,0.65rem)"}}>{post.category}</span>}
          {post.tags?.map(t=><span key={t} className="chip" style={{fontSize:"clamp(0.55rem,1vw,0.65rem)"}}>{t}</span>)}
        </div>
        
        <h1 style={{fontFamily:"var(--font-display)",fontWeight:600,fontSize:"clamp(1.5rem,3.5vw,2.5rem)",lineHeight:1.15,marginBottom:"0.5rem"}}>{post.title}</h1>
        
        <p style={{fontSize:"clamp(0.7rem,1.2vw,0.8rem)",color:"var(--text-muted)",marginBottom:"clamp(1.25rem,3vw,2rem)",paddingBottom:"0.75rem",borderBottom:"1px solid var(--border)"}}>
          {new Date(post.createdAt).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}
        </p>
        
        <div style={{color:"var(--text-secondary)",lineHeight:1.7,fontSize:"clamp(0.85rem,1.5vw,1rem)"}} dangerouslySetInnerHTML={{__html:post.content}}/>
      </motion.article>
    </>
  );
}