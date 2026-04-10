import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, MailOpen, Trash2, X } from "lucide-react";
import api from "../../lib/api";
import { Header, priBtn, secBtn, icoBtn } from "./AProfile";

export default function AMessages() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [confirm,  setConfirm]  = useState(null);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages"],
    queryFn: () => api.get("/api/messages").then(r => r.data),
  });

  const readMut = useMutation({
    mutationFn: (id) => api.patch(`/api/messages/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages"] }),
  });

  const delMut = useMutation({
    mutationFn: (id) => api.delete(`/api/messages/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["messages"] }); setConfirm(null); setSelected(null); },
  });

  const openMsg = (m) => {
    setSelected(m);
    if (!m.read) readMut.mutate(m._id);
  };

  const unread = messages.filter(m => !m.read).length;

  return (
    <div>
      <Header title="Messages" sub={`${messages.length} total${unread > 0 ? ` · ${unread} unread` : ""}`} />

      {isLoading
        ? <p style={{ color:"var(--text3)" }}>Loading…</p>
        : messages.length === 0
          ? <div style={{ textAlign:"center", padding:"4rem", color:"var(--text3)" }}>
              <Mail size={36} style={{ margin:"0 auto 1rem", display:"block", opacity:0.3 }} />
              <p>No messages yet.</p>
            </div>
          : (
            <div style={{ display:"flex", flexDirection:"column", gap:"0.55rem" }}>
              {messages.map(m => (
                <div key={m._id} onClick={() => openMsg(m)}
                  style={{ background:"var(--surface)",
                    border:`1px solid ${!m.read ? "rgba(124,109,250,0.3)" : "var(--border)"}`,
                    borderRadius:10, padding:"0.9rem 1.1rem",
                    display:"flex", alignItems:"flex-start", gap:"0.9rem",
                    cursor:"pointer", transition:"border-color 0.15s" }}>
                  <div style={{ width:34, height:34, borderRadius:"50%", flexShrink:0,
                    background: !m.read ? "var(--glow)" : "var(--surface2)",
                    border:`1px solid ${!m.read ? "rgba(124,109,250,0.3)" : "var(--border)"}`,
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {m.read ? <MailOpen size={14} style={{ color:"var(--text3)" }} /> : <Mail size={14} style={{ color:"var(--accent2)" }} />}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.18rem" }}>
                      <span style={{ fontWeight: m.read ? 500 : 700, fontSize:"0.9rem" }}>{m.name}</span>
                      <span style={{ color:"var(--text3)", fontSize:"0.73rem", flexShrink:0 }}>
                        {new Date(m.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}
                      </span>
                    </div>
                    <p style={{ color:"var(--text3)", fontSize:"0.76rem", marginBottom:"0.2rem" }}>{m.email}</p>
                    {m.subject && <p style={{ color:"var(--text2)", fontSize:"0.82rem", fontWeight:600, marginBottom:"0.15rem" }}>{m.subject}</p>}
                    <p style={{ color:"var(--text2)", fontSize:"0.82rem", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.message}</p>
                  </div>
                  <button onClick={e => { e.stopPropagation(); setConfirm(m._id); }}
                    style={{ ...icoBtn, flexShrink:0, color:"var(--red)", borderColor:"rgba(248,113,113,0.2)" }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )
      }

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100, padding:"1rem" }}
            onClick={e => e.target===e.currentTarget && setSelected(null)}>
            <motion.div initial={{ scale:0.95, y:14 }} animate={{ scale:1, y:0 }} exit={{ scale:0.95, opacity:0 }}
              style={{ background:"#ffffff", border:"1px solid var(--border)", borderRadius:16, padding:"2rem", width:"100%", maxWidth:540, maxHeight:"90vh", overflowY:"auto" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
                <h2 style={{ fontWeight:800, fontSize:"1.05rem" }}>Message from {selected.name}</h2>
                <button onClick={() => setSelected(null)} style={icoBtn}><X size={16}/></button>
              </div>
              <div style={{ display:"flex", gap:"1.5rem", flexWrap:"wrap", marginBottom:"1.4rem" }}>
                {[["From", selected.name], ["Email", selected.email], ["Date", new Date(selected.createdAt).toLocaleString()]].map(([l,v]) => (
                  <div key={l}>
                    <p style={{ fontSize:"0.72rem", fontWeight:700, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"0.2rem" }}>{l}</p>
                    <p style={{ fontSize:"0.88rem", fontWeight:500 }}>{v}</p>
                  </div>
                ))}
              </div>
              {selected.subject && (
                <p style={{ fontWeight:700, marginBottom:"0.75rem", fontSize:"0.95rem" }}>{selected.subject}</p>
              )}
              <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:10, padding:"1.1rem", color:"var(--text2)", fontSize:"0.9rem", lineHeight:1.8, whiteSpace:"pre-wrap", marginBottom:"1.5rem" }}>
                {selected.message}
              </div>
              <div style={{ display:"flex", gap:"0.75rem", justifyContent:"flex-end" }}>
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || "Your message"}`}
                  style={{ ...priBtn, textDecoration:"none" }}>
                  <Mail size={14} /> Reply
                </a>
                <button onClick={() => { setConfirm(selected._id); setSelected(null); }}
                  style={{ ...secBtn, color:"var(--red)", borderColor:"rgba(248,113,113,0.25)" }}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {confirm && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:110, padding:"1rem" }}>
            <motion.div initial={{ scale:0.95 }} animate={{ scale:1 }}
              style={{ background:"#ffffff", border:"1px solid var(--border)", borderRadius:16, padding:"2rem", maxWidth:340, width:"100%" }}>
              <h3 style={{ fontWeight:800, marginBottom:"0.6rem" }}>Delete message?</h3>
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
