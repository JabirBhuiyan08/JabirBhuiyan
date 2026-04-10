import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import api from "../../lib/api";
import { Header, F, Grid2, priBtn, secBtn, icoBtn } from "./AProfile";

function Modal({ title, onClose, children }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "1rem" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.95, y: 14 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
        style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: 16, padding: "2rem", width: "100%", maxWidth: 640, maxHeight: "92vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontWeight: 800, fontSize: "1.1rem" }}>{title}</h2>
          <button onClick={onClose} style={icoBtn}><X size={16} /></button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function ABlogs() {
  const qc = useQueryClient();
  const [modal,   setModal]   = useState(null);
  const [confirm, setConfirm] = useState(null);

  const { data: blogs    = [] } = useQuery({ queryKey: ["admin-blogs"],  queryFn: () => api.get("/api/blogs/admin/all").then(r => r.data) });
  const { data: settings = {} } = useQuery({ queryKey: ["settings"],     queryFn: () => api.get("/api/settings").then(r => r.data) });
  const cats = settings.blogCategories || [];

  const { register, handleSubmit, reset } = useForm();

  const saveMut = useMutation({
    mutationFn: async (data) => {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => { if (k !== "cover" && v !== undefined) fd.append(k, String(v)); });
      if (data.cover?.[0]) fd.append("cover", data.cover[0]);
      return modal === "new" ? api.post("/api/blogs", fd) : api.put(`/api/blogs/${modal._id}`, fd);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-blogs"] }); qc.invalidateQueries({ queryKey: ["blogs"] }); setModal(null); },
  });

  const delMut = useMutation({
    mutationFn: (id) => api.delete(`/api/blogs/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-blogs"] }); setConfirm(null); },
  });

  const openNew  = ()  => { reset({ published: false }); setModal("new"); };
  const openEdit = (b) => { reset({ ...b, tags: b.tags?.join(", ") }); setModal(b); };

  return (
    <div>
      <Header title="Blog" sub={`${blogs.length} posts`}>
        <button onClick={openNew} style={priBtn}><Plus size={14} /> New post</button>
      </Header>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
        {blogs.map(b => (
          <div key={b._id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            {b.coverUrl && <img src={b.coverUrl} alt={b.title} style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.2rem", flexWrap: "wrap" }}>
                <h3 style={{ fontWeight: 700, fontSize: "0.92rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.title}</h3>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "1px 8px", borderRadius: 6, flexShrink: 0,
                  background: b.published ? "rgba(52,211,153,0.1)" : "var(--surface2)",
                  color: b.published ? "var(--green)" : "var(--text3)",
                  border: b.published ? "1px solid rgba(52,211,153,0.25)" : "1px solid var(--border)" }}>
                  {b.published ? "Published" : "Draft"}
                </span>
              </div>
              <p style={{ color: "var(--text3)", fontSize: "0.76rem" }}>
                {new Date(b.createdAt).toLocaleDateString()} · {b.category || "Uncategorised"} · {b.slug}
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
              <button onClick={() => openEdit(b)} style={icoBtn}><Pencil size={13} /></button>
              <button onClick={() => setConfirm(b._id)} style={{ ...icoBtn, color: "var(--red)", borderColor: "rgba(248,113,113,0.25)" }}><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
        {blogs.length === 0 && <p style={{ color: "var(--text3)", padding: "1rem 0" }}>No posts yet.</p>}
      </div>

      <AnimatePresence>
        {modal && (
          <Modal title={modal === "new" ? "New post" : "Edit post"} onClose={() => setModal(null)}>
            <form onSubmit={handleSubmit(d => saveMut.mutate(d))} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <F label="Title"><input {...register("title", { required: true })} className="field-input" placeholder="Post title" /></F>
              <F label="Slug (auto if blank)"><input {...register("slug")} className="field-input" placeholder="my-post-slug" /></F>
              <Grid2>
                <F label="Category">
                  <select {...register("category")} className="field-input">
                    <option value="">— none —</option>
                    {cats.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </F>
                <F label="Tags (comma separated)"><input {...register("tags")} className="field-input" placeholder="tag1, tag2" /></F>
              </Grid2>
              <F label="Excerpt (shown in list)"><textarea {...register("excerpt", { required: true })} rows={2} className="field-input" style={{ resize: "vertical" }} /></F>
              <F label="Content (HTML)"><textarea {...register("content", { required: true })} rows={10} className="field-input" style={{ resize: "vertical", fontFamily: "monospace", fontSize: "0.82rem" }} placeholder="<p>Write your post…</p>" /></F>
              <F label="Cover image"><input {...register("cover")} type="file" accept="image/*" className="field-input" style={{ padding: "0.45rem" }} /></F>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.87rem", color: "var(--text2)", cursor: "pointer" }}>
                <input {...register("published")} type="checkbox" /> Publish immediately
              </label>
              {saveMut.isError && <p style={{ color: "var(--red)", fontSize: "0.82rem" }}>Save failed.</p>}
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setModal(null)} style={secBtn}>Cancel</button>
                <button type="submit" disabled={saveMut.isPending} style={priBtn}>{saveMut.isPending ? "Saving…" : "Save post"}</button>
              </div>
            </form>
          </Modal>
        )}
        {confirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 110, padding: "1rem" }}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
              style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: 16, padding: "2rem", maxWidth: 340, width: "100%" }}>
              <h3 style={{ fontWeight: 800, marginBottom: "0.6rem" }}>Delete post?</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.87rem", marginBottom: "1.5rem" }}>This cannot be undone.</p>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                <button onClick={() => setConfirm(null)} style={secBtn}>Cancel</button>
                <button onClick={() => delMut.mutate(confirm)} disabled={delMut.isPending} style={{ ...priBtn, background: "var(--red)" }}>{delMut.isPending ? "…" : "Delete"}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
