// AServices.jsx
import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import api from "../../lib/api";
import { Header, F, priBtn, secBtn, icoBtn } from "./AProfile";

function Modal({ title, onClose, children }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "1rem" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
        style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: 16, padding: "2rem", width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontWeight: 800, fontSize: "1.1rem" }}>{title}</h2>
          <button onClick={onClose} style={icoBtn}><X size={16} /></button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function Confirm({ onConfirm, onCancel, busy }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 110, padding: "1rem" }}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
        style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: 16, padding: "2rem", maxWidth: 340, width: "100%" }}>
        <h3 style={{ fontWeight: 800, marginBottom: "0.6rem" }}>Delete?</h3>
        <p style={{ color: "var(--text2)", fontSize: "0.87rem", marginBottom: "1.5rem" }}>This cannot be undone.</p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={secBtn}>Cancel</button>
          <button onClick={onConfirm} disabled={busy} style={{ ...priBtn, background: "var(--red)" }}>{busy ? "…" : "Delete"}</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AServices() {
  const qc = useQueryClient();
  const fileRef = useRef();
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: () => api.get("/api/services").then(r => r.data) });
  const { register, handleSubmit, reset, setValue } = useForm();

  const handleEdit = (service) => {
    reset(service);
    setImageFile(null);
    setImagePreview(service.imageUrl || null);
    setModal(service);
  };

  const handleNew = () => {
    reset({ icon: "⚡", title: "", description: "", imageUrl: "", pricing: "", videoUrl: "", contact: "" });
    setImageFile(null);
    setImagePreview(null);
    setModal("new");
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    setUploading(true);
    const fd = new FormData();
    fd.append("image", imageFile);
    const result = await api.post("/api/upload", fd);
    setUploading(false);
    return result.data.url;
  };

  const saveMut = useMutation({
    mutationFn: async (data) => {
      let imageUrl = data.imageUrl;
      if (imageFile) {
        imageUrl = await uploadImage();
      }
      const payload = { ...data, imageUrl };
      if (modal === "new") {
        return api.post("/api/services", payload);
      } else {
        return api.put(`/api/services/${modal._id}`, payload);
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["services"] }); setModal(null); },
  });

  const delMut = useMutation({
    mutationFn: (id) => api.delete(`/api/services/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["services"] }); setConfirm(null); },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div>
      <Header title="Services" sub={`${services.length} services`}>
        <button onClick={handleNew} style={priBtn}><Plus size={14} /> Add service</button>
      </Header>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
        {services.map(s => (
          <div key={s._id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            {s.imageUrl ? (
              <img src={s.imageUrl} alt={s.title} style={{ width: 56, height: 56, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
            ) : (
              <span style={{ fontSize: "1.6rem", flexShrink: 0 }}>{s.icon}</span>
            )}
            <div style={{ flex: 1 }}>
              <h3 style={{ fontWeight: 700, fontSize: "0.93rem" }}>{s.title}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.82rem", marginTop: "0.15rem" }}>{s.description?.slice(0, 90)}…</p>
              {s.pricing && <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--accent)", marginTop: "0.25rem", display: "block" }}>{s.pricing}</span>}
            </div>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <button onClick={() => handleEdit(s)} style={icoBtn}><Pencil size={13} /></button>
              <button onClick={() => setConfirm(s._id)} style={{ ...icoBtn, color: "var(--red)", borderColor: "rgba(248,113,113,0.25)" }}><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
        {services.length === 0 && <p style={{ color: "var(--text3)", padding: "1rem 0" }}>No services yet.</p>}
      </div>
      <AnimatePresence>
        {modal && (
          <Modal title={modal === "new" ? "Add service" : "Edit service"} onClose={() => setModal(null)}>
            <form onSubmit={handleSubmit(d => saveMut.mutate(d))} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              
              {/* Image Upload */}
              <div style={{ background: "var(--surface2)", border: "1px dashed var(--border)", borderRadius: 10, padding: "1rem", textAlign: "center" }}>
                {imagePreview ? (
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <img src={imagePreview} alt="Preview" style={{ maxWidth: "100%", maxHeight: 150, borderRadius: 8 }} />
                    <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); setValue("imageUrl", ""); }} style={{ position: "absolute", top: -8, right: -8, width: 24, height: 24, borderRadius: "50%", background: "var(--red)", color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                  </div>
                ) : (
                  <div>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
                    <button type="button" onClick={() => fileRef.current.click()} style={{ ...secBtn, margin: "0 auto" }}>
                      <Upload size={13} /> Choose Image
                    </button>
                    <p style={{ color: "var(--text3)", fontSize: "0.72rem", marginTop: "0.5rem" }}>JPG, PNG or WebP</p>
                  </div>
                )}
                <input type="hidden" {...register("imageUrl")} />
              </div>

              <F label="Icon (emoji)"><input {...register("icon")} className="field-input" placeholder="⚡" /></F>
              <F label="Title"><input {...register("title", { required: true })} className="field-input" placeholder="Service name" /></F>
              <F label="Description"><textarea {...register("description", { required: true })} rows={3} className="field-input" style={{ resize: "vertical" }} placeholder="What you offer…" /></F>
              <F label="Pricing (e.g. $50-150, $100+)"><input {...register("pricing")} className="field-input" placeholder="$50-150 or $100+" /></F>
              <F label="Video/Link URL"><input {...register("videoUrl")} className="field-input" placeholder="https://youtube.com/... or https://fb.com/..." /></F>
              <F label="Contact/Note"><input {...register("contact")} className="field-input" placeholder="Email or phone for inquiries" /></F>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setModal(null)} style={secBtn}>Cancel</button>
                <button type="submit" disabled={saveMut.isPending || uploading} style={priBtn}>{uploading ? "Uploading…" : saveMut.isPending ? "Saving…" : "Save"}</button>
              </div>
            </form>
          </Modal>
        )}
        {confirm && <Confirm onConfirm={() => delMut.mutate(confirm)} onCancel={() => setConfirm(null)} busy={delMut.isPending} />}
      </AnimatePresence>
    </div>
  );
}