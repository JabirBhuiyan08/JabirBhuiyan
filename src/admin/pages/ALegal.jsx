import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Scale } from "lucide-react";
import { Header, F, SaveBtn } from "./AProfile";
import api from "../../lib/api";

function LegalEditor({ slug, defaultTitle }) {
  const qc = useQueryClient();
  const [form, setForm]   = useState({ title: "", content: "" });
  const [saved, setSaved] = useState(false);
  const [tab, setTab]     = useState("edit"); // "edit" | "preview"

  const { data } = useQuery({
    queryKey: ["legal", slug],
    queryFn: () => api.get(`/api/legal/${slug}`).then(r => r.data),
  });

  useEffect(() => {
    if (data) setForm({ title: data.title || defaultTitle, content: data.content || "" });
  }, [data]);

  const saveMut = useMutation({
    mutationFn: () => api.put(`/api/legal/${slug}`, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["legal", slug] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 14, padding: "1.5rem", marginBottom: "1.5rem" }}>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Scale size={16} style={{ color: "var(--accent2)" }} />
          <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>{defaultTitle}</h2>
          <a href={`/${slug}`} target="_blank" rel="noreferrer"
            style={{ fontSize: "0.75rem", color: "var(--text3)", textDecoration: "underline" }}>
            View live ↗
          </a>
        </div>
        <SaveBtn saved={saved} pending={saveMut.isPending} onClick={() => saveMut.mutate()} />
      </div>

      <F label="Page title" style={{ marginBottom: "1rem" }}>
        <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          className="field-input" placeholder={defaultTitle} />
      </F>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.75rem" }}>
        {["edit", "preview"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: "0.35rem 0.9rem", borderRadius: 7, cursor: "pointer",
              border: tab === t ? "1px solid rgba(124,109,250,0.35)" : "1px solid var(--border)",
              background: tab === t ? "var(--glow)" : "transparent",
              color: tab === t ? "var(--accent2)" : "var(--text2)",
              fontSize: "0.8rem", fontWeight: 600, fontFamily: "var(--font-body)" }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
        <span style={{ fontSize: "0.73rem", color: "var(--text3)", alignSelf: "center", marginLeft: "0.5rem" }}>
          HTML supported
        </span>
      </div>

      {tab === "edit" ? (
        <textarea
          value={form.content}
          onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
          rows={20}
          className="field-input"
          style={{ resize: "vertical", fontFamily: "monospace", fontSize: "0.82rem", lineHeight: 1.6 }}
          placeholder={`<h2>Section heading</h2>\n<p>Your content here…</p>`}
        />
      ) : (
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border2)",
          borderRadius: 8, padding: "1.25rem", minHeight: 300,
          color: "var(--text2)", lineHeight: 1.85, fontSize: "0.92rem" }}
          dangerouslySetInnerHTML={{ __html: form.content || "<p style='color:var(--text3)'>Nothing to preview yet.</p>" }}
        />
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
        <SaveBtn saved={saved} pending={saveMut.isPending} onClick={() => saveMut.mutate()} large />
      </div>
    </div>
  );
}

export default function ALegal() {
  return (
    <div style={{ maxWidth: 800 }}>
      <Header title="Legal pages" sub="Edit Terms & Conditions and Privacy Policy. HTML is fully supported." />
      <LegalEditor slug="terms"   defaultTitle="Terms & Conditions" />
      <LegalEditor slug="privacy" defaultTitle="Privacy Policy" />
    </div>
  );
}
