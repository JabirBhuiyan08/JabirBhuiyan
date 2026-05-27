import { useEffect, useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Upload, CheckCircle } from "lucide-react";
import api from "../../lib/api";

export default function AProfile() {
  const qc = useQueryClient();
  const fileRef = useRef();
  const [f, setF] = useState({ name:"", profession:"", tagline:"", bio:"", location:"", email:"", phone:"", website:"", openToWork:false, socials:{ github:"", linkedin:"", twitter:"", instagram:"", youtube:"", dribbble:"", behance:"" } });
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: () => api.get("/api/profile").then(r => r.data) });

  useEffect(() => {
    if (profile) {
      setF({ name: profile.name||"", profession: profile.profession||"", tagline: profile.tagline||"", bio: profile.bio||"", location: profile.location||"", email: profile.email||"", phone: profile.phone||"", website: profile.website||"", openToWork: profile.openToWork||false, socials: { github: profile.socials?.github||"", linkedin: profile.socials?.linkedin||"", twitter: profile.socials?.twitter||"", instagram: profile.socials?.instagram||"", youtube: profile.socials?.youtube||"", dribbble: profile.socials?.dribbble||"", behance: profile.socials?.behance||"" } });
      setPreview(profile.avatarUrl || null);
    }
  }, [profile]);

  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const setSocial = (k, v) => setF(p => ({ ...p, socials: { ...p.socials, [k]: v } }));

  const saveMutation = useMutation({
    mutationFn: () => api.put("/api/profile", f),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["profile"] }); setSaved(true); setTimeout(() => setSaved(false), 2500); },
  });

  const uploadAvatar = async () => {
    if (!avatarFile) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("image", avatarFile);
    await api.post("/api/profile/avatar", fd);
    qc.invalidateQueries({ queryKey: ["profile"] });
    setAvatarFile(null);
    setUploading(false);
  };

  return (
    <div style={{ maxWidth: 760 }}>
      <Header title="Profile" sub="Your public identity.">
        <SaveBtn saved={saved} pending={saveMutation.isPending} onClick={() => saveMutation.mutate()} />
      </Header>

      {/* Avatar */}
      <Card title="Avatar" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          {preview
            ? <img src={preview} alt="avatar" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid var(--accent)" }} />
            : <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--surface2)", border: "3px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", color: "var(--text3)" }}>{f.name?.[0] || "?"}</div>
          }
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={e => { const file = e.target.files[0]; if (!file) return; setAvatarFile(file); setPreview(URL.createObjectURL(file)); }} />
            <button onClick={() => fileRef.current.click()} style={secBtn}><Upload size={13} /> Choose image</button>
            {avatarFile && <button onClick={uploadAvatar} disabled={uploading} style={priBtn}>{uploading ? "Uploading…" : "Upload"}</button>}
            <p style={{ color: "var(--text3)", fontSize: "0.73rem" }}>JPG, PNG or WebP · max 5 MB</p>
          </div>
        </div>
      </Card>

      {/* Basic */}
      <Card title="Basic info" style={{ marginBottom: "1.5rem" }}>
        <Grid2>
          <F label="Full name"><input value={f.name} onChange={e => set("name", e.target.value)} className="field-input" placeholder="Jane Doe" /></F>
          <F label="Profession / title (use | to separate typewriter words)"><input value={f.profession} onChange={e => set("profession", e.target.value)} className="field-input" placeholder="Doctor | Consultant | Writer" /></F>
        </Grid2>
        <F label="Tagline" style={{ marginTop: "1rem" }}><input value={f.tagline} onChange={e => set("tagline", e.target.value)} className="field-input" placeholder="Short punchy line under your name" /></F>
        <F label="Bio" style={{ marginTop: "1rem" }}><textarea value={f.bio} onChange={e => set("bio", e.target.value)} rows={5} className="field-input" style={{ resize: "vertical" }} placeholder="Tell visitors about yourself…" /></F>
        <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: "1rem", cursor: "pointer", fontSize: "0.88rem", color: "var(--text2)", userSelect: "none" }}>
          <Toggle on={f.openToWork} onClick={() => set("openToWork", !f.openToWork)} />
          Show "Available" badge on profile
        </label>
      </Card>

      {/* Contact */}
      <Card title="Contact info" style={{ marginBottom: "1.5rem" }}>
        <Grid2>
          <F label="Email"><input value={f.email} onChange={e => set("email", e.target.value)} className="field-input" placeholder="you@email.com" /></F>
          <F label="Phone"><input value={f.phone} onChange={e => set("phone", e.target.value)} className="field-input" placeholder="+1 234 567 890" /></F>
          <F label="Location"><input value={f.location} onChange={e => set("location", e.target.value)} className="field-input" placeholder="City, Country" /></F>
          <F label="Website"><input value={f.website} onChange={e => set("website", e.target.value)} className="field-input" placeholder="https://yoursite.com" /></F>
        </Grid2>
      </Card>

      {/* Socials */}
      <Card title="Social links" style={{ marginBottom: "2rem" }}>
        <Grid2>
          {["github","linkedin","twitter","instagram","youtube","dribbble","behance"].map(k => (
            <F key={k} label={k.charAt(0).toUpperCase()+k.slice(1)}>
              <input value={f.socials[k]} onChange={e => setSocial(k, e.target.value)} className="field-input" placeholder={`https://${k}.com/username`} />
            </F>
          ))}
        </Grid2>
      </Card>

      <div style={{ display: "flex", justifyContent: "flex-end", paddingBottom: "2rem" }}>
        <SaveBtn saved={saved} pending={saveMutation.isPending} onClick={() => saveMutation.mutate()} large />
      </div>
    </div>
  );
}

// ── Shared helpers ────────────────────────────────────────────────────────────
export function Header({ title, sub, children }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
      <div><h1 style={{ fontSize: "1.8rem", fontWeight: 800 }}>{title}</h1><p style={{ color: "var(--text2)", marginTop: "0.2rem" }}>{sub}</p></div>
      {children}
    </div>
  );
}

export function Card({ title, children, style }) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "1.4rem", ...style }}>
      {title && <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "1.1rem" }}>{title}</p>}
      {children}
    </div>
  );
}

export function F({ label, children, style }) {
  return (
    <div style={style}>
      <label style={{ display: "block", fontSize: "0.73rem", fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.38rem" }}>{label}</label>
      {children}
    </div>
  );
}

export function Grid2({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>{children}</div>;
}

export function Toggle({ on, onClick }) {
  return (
    <div onClick={onClick} style={{ width: 36, height: 20, borderRadius: 10, background: on ? "var(--green)" : "var(--surface2)", border: `1px solid ${on ? "rgba(52,211,153,0.4)" : "var(--border)"}`, position: "relative", cursor: "pointer", transition: "all 0.2s", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 2, left: on ? 17 : 2, width: 14, height: 14, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
    </div>
  );
}

export function SaveBtn({ saved, pending, onClick, large }) {
  return (
    <button onClick={onClick} disabled={pending}
      style={{ display: "inline-flex", alignItems: "center", gap: 6,
        background: saved ? "rgba(52,211,153,0.12)" : "var(--accent)",
        color: saved ? "var(--green)" : "var(--accent-fg)",
        border: saved ? "1px solid rgba(52,211,153,0.3)" : "none",
        borderRadius: 9, padding: large ? "0.72rem 1.75rem" : "0.58rem 1.2rem",
        fontSize: large ? "0.95rem" : "0.87rem", fontWeight: 700,
        cursor: pending ? "not-allowed" : "pointer",
        fontFamily: "var(--font-sans)", transition: "all 0.2s", minWidth: 110,
      }}>
      {saved ? <><CheckCircle size={14} /> Saved!</> : pending ? "Saving…" : <><Save size={14} /> Save</>}
    </button>
  );
}

export const priBtn = { display: "inline-flex", alignItems: "center", gap: 6, background: "var(--accent)", color: "var(--accent-fg)", border: "none", borderRadius: 8, padding: "0.52rem 1rem", fontSize: "0.84rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)" };
export const secBtn = { display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", color: "var(--text-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "0.48rem 0.9rem", fontSize: "0.82rem", fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-sans)" };
export const danBtn = { display: "inline-flex", alignItems: "center", gap: 5, background: "var(--red-bg)", color: "var(--red)", border: "1px solid var(--red)", borderRadius: 7, padding: "0.34rem 0.75rem", fontSize: "0.78rem", cursor: "pointer", fontFamily: "var(--font-sans)" };
export const icoBtn = { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, background: "var(--bg-alt)", border: "1px solid var(--border)", borderRadius: 7, color: "var(--text-2)", cursor: "pointer" };
