import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Pencil, Trash2, X, ExternalLink, Github } from "lucide-react";
import { useForm } from "react-hook-form";
import api from "../../lib/api";
import { Header, F, Grid2, priBtn, secBtn, danBtn, icoBtn } from "./AProfile";

function Modal({ title, onClose, children }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex",
        alignItems: "center", justifyContent: "center", zIndex: 100, padding: "1rem" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
        style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: 16,
          padding: "2rem", width: "100%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontWeight: 800, fontSize: "1.15rem" }}>{title}</h2>
          <button onClick={onClose} style={icoBtn}><X size={16} /></button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function Confirm({ msg, onConfirm, onCancel, busy }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex",
        alignItems: "center", justifyContent: "center", zIndex: 110, padding: "1rem" }}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
        style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: 16, padding: "2rem", maxWidth: 360, width: "100%" }}>
        <h3 style={{ fontWeight: 800, marginBottom: "0.75rem" }}>Are you sure?</h3>
        <p style={{ color: "var(--text2)", fontSize: "0.88rem", marginBottom: "1.5rem" }}>{msg}</p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={secBtn}>Cancel</button>
          <button onClick={onConfirm} disabled={busy} style={{ ...priBtn, background: "var(--red)" }}>
            {busy ? "Deleting…" : "Delete"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AProjects() {
  const qc = useQueryClient();
  const [modal, setModal]     = useState(null);   // null | "new" | project
  const [confirm, setConfirm] = useState(null);   // null | id

  const { data: projects  = [] } = useQuery({ queryKey: ["projects"],  queryFn: () => api.get("/api/projects").then(r => r.data) });
  const { data: settings  = {} } = useQuery({ queryKey: ["settings"],  queryFn: () => api.get("/api/settings").then(r => r.data) });
  const cats = settings.portfolioCategories || [];

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const openNew  = ()  => { reset({}); setModal("new"); };
  const openEdit = (p) => { reset({ ...p, tags: p.tags?.join(", ") }); setModal(p); };

  const saveMut = useMutation({
    mutationFn: async (data) => {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => { if (k !== "image" && v !== undefined) fd.append(k, String(v)); });
      if (data.image?.[0]) fd.append("image", data.image[0]);
      return modal === "new" ? api.post("/api/projects", fd) : api.put(`/api/projects/${modal._id}`, fd);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["projects"] }); setModal(null); },
  });

  const delMut = useMutation({
    mutationFn: (id) => api.delete(`/api/projects/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["projects"] }); setConfirm(null); },
  });

  return (
    <div>
      <Header title="Projects" sub={`${projects.length} total`}>
        <button onClick={openNew} style={priBtn}><Plus size={14} /> Add project</button>
      </Header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: "1rem" }}>
        {projects.map(p => (
          <div key={p._id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
            {p.imageUrl
              ? <img src={p.imageUrl} alt={p.title} style={{ width: "100%", height: 160, objectFit: "cover" }} />
              : <div style={{ height: 160, background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text3)", fontSize: "2rem" }}>🗂</div>
            }
            <div style={{ padding: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.4rem" }}>
                <h3 style={{ fontWeight: 700, fontSize: "0.93rem" }}>{p.title}</h3>
                <span style={{ background: "var(--surface2)", color: "var(--text3)", border: "1px solid var(--border)", borderRadius: 6, padding: "1px 7px", fontSize: "0.7rem", flexShrink: 0 }}>{p.category}</span>
              </div>
              <p style={{ color: "var(--text2)", fontSize: "0.82rem", lineHeight: 1.6, marginBottom: "0.75rem" }}>{p.description?.slice(0, 80)}…</p>
              <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={icoBtn}><ExternalLink size={13} /></a>}
                {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noreferrer" style={icoBtn}><Github size={13} /></a>}
                <button onClick={() => openEdit(p)} style={icoBtn}><Pencil size={13} /></button>
                <button onClick={() => setConfirm(p._id)} style={{ ...icoBtn, color: "var(--red)", borderColor: "rgba(248,113,113,0.25)" }}><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {modal && (
          <Modal title={modal === "new" ? "Add project" : "Edit project"} onClose={() => setModal(null)}>
            <form onSubmit={handleSubmit(d => saveMut.mutate(d))} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <F label="Title"><input {...register("title", { required: true })} className="field-input" placeholder="Project title" /></F>
              <F label="Description"><textarea {...register("description", { required: true })} rows={3} className="field-input" style={{ resize: "vertical" }} placeholder="What is this?" /></F>
              <Grid2>
                <F label="Category">
                  <select {...register("category")} className="field-input">
                    {cats.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </F>
                <F label="Tags (comma separated)"><input {...register("tags")} className="field-input" placeholder="tag1, tag2" /></F>
                <F label="Live URL"><input {...register("liveUrl")} className="field-input" placeholder="https://…" /></F>
                <F label="Repo URL"><input {...register("repoUrl")} className="field-input" placeholder="https://github.com/…" /></F>
              </Grid2>
              <F label="Image"><input {...register("image")} type="file" accept="image/*" className="field-input" style={{ padding: "0.45rem" }} /></F>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.87rem", color: "var(--text2)", cursor: "pointer" }}>
                <input {...register("featured")} type="checkbox" /> Show on homepage as featured
              </label>
              {saveMut.isError && <p style={{ color: "var(--red)", fontSize: "0.82rem" }}>Save failed.</p>}
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setModal(null)} style={secBtn}>Cancel</button>
                <button type="submit" disabled={isSubmitting || saveMut.isPending} style={priBtn}>
                  {saveMut.isPending ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </Modal>
        )}
        {confirm && (
          <Confirm msg="This project will be permanently deleted."
            onConfirm={() => delMut.mutate(confirm)} onCancel={() => setConfirm(null)} busy={delMut.isPending} />
        )}
      </AnimatePresence>
    </div>
  );
}
