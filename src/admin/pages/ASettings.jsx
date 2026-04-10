import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Palette } from "lucide-react";
import { Header, F, SaveBtn, danBtn, secBtn } from "./AProfile";
import api from "../../lib/api";

const PRESET_COLORS = [
  "#7c6dfa","#6366f1","#8b5cf6","#a855f7",
  "#ec4899","#ef4444","#f97316","#f59e0b",
  "#10b981","#14b8a6","#06b6d4","#3b82f6",
  "#64748b","#ffffff","#000000",
];

export default function ASettings() {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    siteTitle: "", tagline: "", accentColor: "#7c6dfa",
    portfolioCategories: [], blogCategories: [],
  });
  const [saved, setSaved]   = useState(false);
  const [newPCat, setNewPCat] = useState("");
  const [newBCat, setNewBCat] = useState("");

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => api.get("/api/settings").then(r => r.data),
  });

  useEffect(() => {
    if (settings) setForm({
      siteTitle:           settings.siteTitle           || "",
      tagline:             settings.tagline             || "",
      accentColor:         settings.accentColor         || "#7c6dfa",
      portfolioCategories: settings.portfolioCategories || [],
      blogCategories:      settings.blogCategories      || [],
    });
  }, [settings]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const saveMut = useMutation({
    mutationFn: () => api.put("/api/settings", form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  const addCat = (type) => {
    const val = type === "portfolio" ? newPCat.trim() : newBCat.trim();
    if (!val) return;
    const key = type === "portfolio" ? "portfolioCategories" : "blogCategories";
    if (!form[key].includes(val)) set(key, [...form[key], val]);
    type === "portfolio" ? setNewPCat("") : setNewBCat("");
  };

  const removeCat = (type, cat) => {
    const key = type === "portfolio" ? "portfolioCategories" : "blogCategories";
    set(key, form[key].filter(c => c !== cat));
  };

  return (
    <div style={{ maxWidth: 700 }}>
      <Header title="Settings" sub="Site-wide configuration.">
        <SaveBtn saved={saved} pending={saveMut.isPending} onClick={() => saveMut.mutate()} />
      </Header>

      {/* General */}
      <Section title="General">
        <F label="Site title">
          <input value={form.siteTitle} onChange={e => set("siteTitle", e.target.value)}
            className="field-input" placeholder="My Portfolio" />
        </F>
        <F label="Tagline" style={{ marginTop: "1rem" }}>
          <input value={form.tagline} onChange={e => set("tagline", e.target.value)}
            className="field-input" placeholder="Short description shown in sidebar" />
        </F>
      </Section>

      {/* Accent colour */}
      <Section title="Accent colour">
        <p style={{ color: "var(--text2)", fontSize: "0.85rem", marginBottom: "1rem" }}>
          This colour is applied to buttons, active nav links, tags and highlights across the public site.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <div style={{ width: 40, height: 40, borderRadius: 10,
            background: form.accentColor, border: "2px solid var(--border2)", flexShrink: 0 }} />
          <input type="color" value={form.accentColor}
            onChange={e => set("accentColor", e.target.value)}
            style={{ width: 40, height: 40, borderRadius: 8, border: "1px solid var(--border2)",
              background: "none", cursor: "pointer", padding: 0 }} />
          <input value={form.accentColor} onChange={e => set("accentColor", e.target.value)}
            className="field-input" style={{ width: 130 }} placeholder="#7c6dfa" />
        </div>
        {/* Presets */}
        <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
          {PRESET_COLORS.map(c => (
            <button key={c} onClick={() => set("accentColor", c)}
              title={c}
              style={{ width: 26, height: 26, borderRadius: 6, background: c, cursor: "pointer",
                border: form.accentColor === c ? "2px solid var(--text)" : "1px solid var(--border2)",
                transition: "transform 0.15s", flexShrink: 0 }} />
          ))}
        </div>
      </Section>

      {/* Portfolio categories */}
      <Section title="Portfolio / Works categories">
        <p style={{ color: "var(--text2)", fontSize: "0.85rem", marginBottom: "1rem" }}>
          These appear as filter tabs on the Works page and as options when adding projects.
        </p>
        <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          {form.portfolioCategories.map(c => (
            <span key={c} style={{ display: "inline-flex", alignItems: "center", gap: 5,
              background: "var(--surface2)", color: "var(--text2)",
              border: "1px solid var(--border2)", borderRadius: 8,
              padding: "0.3rem 0.75rem", fontSize: "0.83rem" }}>
              {c}
              <button onClick={() => removeCat("portfolio", c)}
                style={{ background: "none", border: "none", cursor: "pointer",
                  color: "var(--text3)", padding: 0, lineHeight: 1, fontSize: "1rem" }}>×</button>
            </span>
          ))}
          {form.portfolioCategories.length === 0 && (
            <p style={{ color: "var(--text3)", fontSize: "0.83rem" }}>No categories yet.</p>
          )}
        </div>
        <div style={{ display: "flex", gap: "0.6rem" }}>
          <input value={newPCat} onChange={e => setNewPCat(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCat("portfolio"))}
            className="field-input" style={{ flex: 1 }} placeholder="e.g. Design, Writing, Photography" />
          <button onClick={() => addCat("portfolio")} style={secBtn}><Plus size={14} /> Add</button>
        </div>
      </Section>

      {/* Blog categories */}
      <Section title="Blog categories">
        <p style={{ color: "var(--text2)", fontSize: "0.85rem", marginBottom: "1rem" }}>
          These appear as filter tabs on the Blog page and as options when writing posts.
        </p>
        <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          {form.blogCategories.map(c => (
            <span key={c} style={{ display: "inline-flex", alignItems: "center", gap: 5,
              background: "var(--surface2)", color: "var(--text2)",
              border: "1px solid var(--border2)", borderRadius: 8,
              padding: "0.3rem 0.75rem", fontSize: "0.83rem" }}>
              {c}
              <button onClick={() => removeCat("blog", c)}
                style={{ background: "none", border: "none", cursor: "pointer",
                  color: "var(--text3)", padding: 0, lineHeight: 1, fontSize: "1rem" }}>×</button>
            </span>
          ))}
          {form.blogCategories.length === 0 && (
            <p style={{ color: "var(--text3)", fontSize: "0.83rem" }}>No categories yet.</p>
          )}
        </div>
        <div style={{ display: "flex", gap: "0.6rem" }}>
          <input value={newBCat} onChange={e => setNewBCat(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCat("blog"))}
            className="field-input" style={{ flex: 1 }} placeholder="e.g. Tutorial, Opinion, News" />
          <button onClick={() => addCat("blog")} style={secBtn}><Plus size={14} /> Add</button>
        </div>
      </Section>

      <div style={{ display: "flex", justifyContent: "flex-end", paddingBottom: "2rem" }}>
        <SaveBtn saved={saved} pending={saveMut.isPending} onClick={() => saveMut.mutate()} large />
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 14, padding: "1.4rem", marginBottom: "1.25rem" }}>
      <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text3)",
        textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "1rem" }}>{title}</p>
      {children}
    </div>
  );
}
