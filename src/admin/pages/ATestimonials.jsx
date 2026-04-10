import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Pencil, Trash2, X, Star } from "lucide-react";
import { useForm } from "react-hook-form";
import api from "../../lib/api";
import { Header, F, Grid2, priBtn, secBtn, icoBtn } from "./AProfile";

export default function ATestimonials() {
  const qc = useQueryClient();
  const [modal,   setModal]   = useState(null);
  const [confirm, setConfirm] = useState(null);

  const { data: testimonials = [] } = useQuery({ queryKey: ["testimonials"], queryFn: () => api.get("/api/testimonials").then(r => r.data) });
  const { register, handleSubmit, reset } = useForm();

  const saveMut = useMutation({
    mutationFn: async (data) => {
      const fd = new FormData();
      Object.entries(data).forEach(([k,v]) => { if (k !== "avatar" && v !== undefined) fd.append(k, String(v)); });
      if (data.avatar?.[0]) fd.append("avatar", data.avatar[0]);
      return modal === "new" ? api.post("/api/testimonials", fd) : api.put(`/api/testimonials/${modal._id}`, fd);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["testimonials"] }); setModal(null); },
  });

  const delMut = useMutation({
    mutationFn: (id) => api.delete(`/api/testimonials/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["testimonials"] }); setConfirm(null); },
  });

  return (
    <div>
      <Header title="Testimonials" sub={`${testimonials.length} entries`}>
        <button onClick={() => { reset({ rating: 5 }); setModal("new"); }} style={priBtn}><Plus size={14} /> Add testimonial</button>
      </Header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "1rem" }}>
        {testimonials.map(t => (
          <div key={t._id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "1.25rem" }}>
            <div style={{ display: "flex", gap: "3px", marginBottom: "0.75rem" }}>
              {Array.from({ length: t.rating || 5 }).map((_,i) => <Star key={i} size={13} fill="#fbbf24" color="#fbbf24" />)}
            </div>
            <p style={{ color: "var(--text2)", fontSize: "0.85rem", lineHeight: 1.7, marginBottom: "1rem" }}>"{t.text}"</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                {t.avatarUrl
                  ? <img src={t.avatarUrl} alt={t.name} style={{ width:30, height:30, borderRadius:"50%", objectFit:"cover" }} />
                  : <div style={{ width:30, height:30, borderRadius:"50%", background:"var(--surface2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.85rem", color:"var(--text3)" }}>{t.name?.[0]}</div>
                }
                <div>
                  <p style={{ fontWeight:700, fontSize:"0.82rem" }}>{t.name}</p>
                  {t.role && <p style={{ color:"var(--text3)", fontSize:"0.73rem" }}>{t.role}{t.company ? `, ${t.company}` : ""}</p>}
                </div>
              </div>
              <div style={{ display:"flex", gap:"0.4rem" }}>
                <button onClick={() => { reset({ ...t }); setModal(t); }} style={icoBtn}><Pencil size={13}/></button>
                <button onClick={() => setConfirm(t._id)} style={{ ...icoBtn, color:"var(--red)", borderColor:"rgba(248,113,113,0.25)" }}><Trash2 size={13}/></button>
              </div>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && <p style={{ color:"var(--text3)", gridColumn:"1/-1", padding:"1rem 0" }}>No testimonials yet.</p>}
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100, padding:"1rem" }}
            onClick={e => e.target===e.currentTarget && setModal(null)}>
            <motion.div initial={{ scale:0.95, y:14 }} animate={{ scale:1, y:0 }} exit={{ scale:0.95, opacity:0 }}
              style={{ background:"#ffffff", border:"1px solid var(--border)", borderRadius:16, padding:"2rem", width:"100%", maxWidth:520, maxHeight:"90vh", overflowY:"auto" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
                <h2 style={{ fontWeight:800, fontSize:"1.1rem" }}>{modal==="new" ? "Add testimonial" : "Edit testimonial"}</h2>
                <button onClick={() => setModal(null)} style={icoBtn}><X size={16}/></button>
              </div>
              <form onSubmit={handleSubmit(d => saveMut.mutate(d))} style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
                <Grid2>
                  <F label="Name"><input {...register("name", { required:true })} className="field-input" placeholder="John Smith" /></F>
                  <F label="Role"><input {...register("role")} className="field-input" placeholder="CEO" /></F>
                  <F label="Company"><input {...register("company")} className="field-input" placeholder="Acme Inc" /></F>
                  <F label="Rating (1–5)"><input {...register("rating")} type="number" min={1} max={5} className="field-input" /></F>
                </Grid2>
                <F label="Testimonial text"><textarea {...register("text", { required:true })} rows={4} className="field-input" style={{ resize:"vertical" }} placeholder="What they said…" /></F>
                <F label="Avatar image"><input {...register("avatar")} type="file" accept="image/*" className="field-input" style={{ padding:"0.45rem" }} /></F>
                <div style={{ display:"flex", gap:"0.75rem", justifyContent:"flex-end" }}>
                  <button type="button" onClick={() => setModal(null)} style={secBtn}>Cancel</button>
                  <button type="submit" disabled={saveMut.isPending} style={priBtn}>{saveMut.isPending ? "Saving…" : "Save"}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
        {confirm && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:110, padding:"1rem" }}>
            <motion.div initial={{ scale:0.95 }} animate={{ scale:1 }}
              style={{ background:"#ffffff", border:"1px solid var(--border)", borderRadius:16, padding:"2rem", maxWidth:340, width:"100%" }}>
              <h3 style={{ fontWeight:800, marginBottom:"0.6rem" }}>Delete testimonial?</h3>
              <p style={{ color:"var(--text2)", fontSize:"0.87rem", marginBottom:"1.5rem" }}>This cannot be undone.</p>
              <div style={{ display:"flex", gap:"0.75rem", justifyContent:"flex-end" }}>
                <button onClick={() => setConfirm(null)} style={secBtn}>Cancel</button>
                <button onClick={() => delMut.mutate(confirm)} disabled={delMut.isPending} style={{ ...priBtn, background:"var(--red)" }}>{delMut.isPending ? "…" : "Delete"}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
