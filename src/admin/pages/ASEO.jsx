import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Save, ChevronDown, ChevronUp, Globe, FileText, Briefcase, BookOpen } from "lucide-react";
import api from "../../lib/api";
import { Header, F, Toggle } from "./AProfile";

const STATIC_PAGES = [
  { key: "home",     label: "Home",             icon: Globe },
  { key: "works",    label: "Works / Portfolio", icon: Briefcase },
  { key: "services", label: "Services",          icon: Globe },
  { key: "blog",     label: "Blog list",         icon: BookOpen },
  { key: "resume",   label: "Resume",            icon: FileText },
  { key: "contact",  label: "Contact",           icon: Globe },
  { key: "terms",    label: "Terms & Conditions",icon: FileText },
  { key: "privacy",  label: "Privacy Policy",    icon: FileText },
];

function SeoForm({ pageKey, label }) {
  const qc  = useQueryClient();
  const [open, setOpen]   = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm]   = useState(null);

  const { data } = useQuery({
    queryKey: ["seo", pageKey],
    queryFn: () => api.get(`/api/seo/${pageKey}`).then(r => r.data),
    onSuccess: (d) => { if (!form) setForm(d || {}); },
  });

  // Initialise form when data arrives
  if (data && !form) setForm(data);
  const f = form || {};
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const saveMut = useMutation({
    mutationFn: () => api.put(`/api/seo/${pageKey}`, f),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["seo", pageKey] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
      {/* Header row */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1rem 1.25rem", background: "none", border: "none", cursor: "pointer",
          color: "var(--text)", fontFamily: "var(--font-body)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Globe size={15} style={{ color: "var(--accent2)" }} />
          <span style={{ fontWeight: 600, fontSize: "0.92rem" }}>{label}</span>
          {(f.title || f.description) && (
            <span style={{ fontSize: "0.72rem", color: "var(--green)", background: "rgba(52,211,153,0.1)",
              border: "1px solid rgba(52,211,153,0.2)", borderRadius: 6, padding: "1px 7px" }}>
              Configured
            </span>
          )}
        </div>
        {open ? <ChevronUp size={15} style={{ color: "var(--text3)" }} /> : <ChevronDown size={15} style={{ color: "var(--text3)" }} />}
      </button>

      {/* Form body */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden" }}>
            <div style={{ padding: "0 1.25rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <F label="Meta title (shown in browser tab + Google)">
                <input value={f.title || ""} onChange={e => set("title", e.target.value)}
                  className="field-input" placeholder="Page title — Site name" />
                <p style={{ color: "var(--text3)", fontSize: "0.72rem", marginTop: "0.3rem" }}>
                  Recommended: 50–60 characters. Current: {(f.title || "").length}
                </p>
              </F>
              <F label="Meta description (shown in Google results)">
                <textarea value={f.description || ""} onChange={e => set("description", e.target.value)}
                  rows={3} className="field-input" style={{ resize: "vertical" }}
                  placeholder="A compelling description of what's on this page…" />
                <p style={{ color: (f.description || "").length > 160 ? "var(--red)" : "var(--text3)", fontSize: "0.72rem", marginTop: "0.3rem" }}>
                  Recommended: 120–160 characters. Current: {(f.description || "").length}
                </p>
              </F>
              <F label="Keywords (comma separated)">
                <input value={f.keywords || ""} onChange={e => set("keywords", e.target.value)}
                  className="field-input" placeholder="keyword1, keyword2, keyword3" />
              </F>
              <F label="OG image URL (used when shared on social media)">
                <input value={f.ogImage || ""} onChange={e => set("ogImage", e.target.value)}
                  className="field-input" placeholder="https://example.com/og-image.jpg" />
                <p style={{ color: "var(--text3)", fontSize: "0.72rem", marginTop: "0.3rem" }}>
                  Recommended size: 1200×630px
                </p>
              </F>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                fontSize: "0.87rem", color: "var(--text2)", userSelect: "none" }}>
                <Toggle on={f.noIndex || false} onClick={() => set("noIndex", !f.noIndex)} />
                Hide from search engines (noindex)
              </label>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button onClick={() => saveMut.mutate()} disabled={saveMut.isPending}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6,
                    background: saved ? "rgba(52,211,153,0.12)" : "var(--accent)",
                    color: saved ? "var(--green)" : "#fff",
                    border: saved ? "1px solid rgba(52,211,153,0.3)" : "none",
                    borderRadius: 9, padding: "0.55rem 1.1rem",
                    fontSize: "0.85rem", fontWeight: 700,
                    cursor: "pointer", fontFamily: "var(--font-body)" }}>
                  <Save size={13} /> {saved ? "Saved!" : saveMut.isPending ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ASEO() {
  const { data: blogs    = [] } = useQuery({ queryKey: ["admin-blogs"], queryFn: () => api.get("/api/blogs/admin/all").then(r => r.data) });
  const { data: projects = [] } = useQuery({ queryKey: ["projects"],    queryFn: () => api.get("/api/projects").then(r => r.data) });

  return (
    <div style={{ maxWidth: 780 }}>
      <Header title="SEO" sub="Control meta titles, descriptions and social previews for every page." />

      {/* Static pages */}
      <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text2)", marginBottom: "0.75rem",
        textTransform: "uppercase", letterSpacing: "0.07em", fontSize: "0.78rem" }}>
        Static pages
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "2rem" }}>
        {STATIC_PAGES.map(p => (
          <SeoForm key={p.key} pageKey={p.key} label={p.label} />
        ))}
      </div>

      {/* Blog posts */}
      {blogs.length > 0 && (
        <>
          <h2 style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text2)", marginBottom: "0.75rem",
            textTransform: "uppercase", letterSpacing: "0.07em" }}>
            Blog posts ({blogs.length})
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "2rem" }}>
            {blogs.map(b => (
              <SeoForm key={b._id} pageKey={`blog-${b.slug}`} label={`📝 ${b.title}`} />
            ))}
          </div>
        </>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <>
          <h2 style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text2)", marginBottom: "0.75rem",
            textTransform: "uppercase", letterSpacing: "0.07em" }}>
            Projects ({projects.length})
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "2rem" }}>
            {projects.map(p => (
              <SeoForm key={p._id} pageKey={`project-${p._id}`} label={`🗂 ${p.title}`} />
            ))}
          </div>
        </>
      )}

      {/* Sitemap info */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
        padding: "1.25rem", marginBottom: "2rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.92rem", marginBottom: "0.5rem" }}>🗺 Sitemap</p>
        <p style={{ color: "var(--text2)", fontSize: "0.85rem", lineHeight: 1.7 }}>
          Your sitemap is auto-generated at{" "}
          <code style={{ background: "var(--surface2)", padding: "1px 6px", borderRadius: 5, fontSize: "0.82rem" }}>
            {window.location.origin.replace("5173", "3001")}/api/legal/sitemap.xml
          </code>
          . It includes all static pages, blog posts, and projects automatically. Submit it to{" "}
          <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer"
            style={{ color: "var(--accent2)" }}>Google Search Console</a> after deploying.
        </p>
      </div>
    </div>
  );
}
