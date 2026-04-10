// Shared styles and tiny components used across all admin pages

export const s = {
  card:       { background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"14px", padding:"1.5rem" },
  input:      { width:"100%", padding:".65rem .9rem", borderRadius:"9px", fontSize:".88rem", background:"var(--bg2)", border:"1px solid var(--border2)", color:"var(--text)", outline:"none" },
  textarea:   { width:"100%", padding:".65rem .9rem", borderRadius:"9px", fontSize:".88rem", background:"var(--bg2)", border:"1px solid var(--border2)", color:"var(--text)", outline:"none", resize:"vertical", fontFamily:"var(--font-b)" },
  select:     { width:"100%", padding:".65rem .9rem", borderRadius:"9px", fontSize:".88rem", background:"var(--bg2)", border:"1px solid var(--border2)", color:"var(--text)", outline:"none" },
  label:      { display:"block", fontSize:".74rem", fontWeight:600, color:"var(--text3)", marginBottom:".3rem", textTransform:"uppercase", letterSpacing:".06em" },
  primary:    { display:"inline-flex", alignItems:"center", gap:"6px", background:"var(--accent)", color:"#fff", border:"none", borderRadius:"9px", padding:".6rem 1.2rem", fontSize:".87rem", fontWeight:600, cursor:"pointer" },
  secondary:  { display:"inline-flex", alignItems:"center", gap:"6px", background:"transparent", color:"var(--text2)", border:"1px solid var(--border2)", borderRadius:"9px", padding:".58rem 1.1rem", fontSize:".87rem", fontWeight:500, cursor:"pointer" },
  danger:     { display:"inline-flex", alignItems:"center", gap:"5px", background:"transparent", color:"var(--red)", border:"1px solid rgba(248,113,113,.2)", borderRadius:"8px", padding:".38rem .85rem", fontSize:".8rem", cursor:"pointer" },
  iconBtn:    { display:"inline-flex", alignItems:"center", justifyContent:"center", width:"32px", height:"32px", background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:"8px", color:"var(--text2)", cursor:"pointer" },
  overlay:    { position:"fixed", inset:0, background:"rgba(0,0,0,.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:"1rem" },
  modal:      { background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"16px", padding:"2rem", width:"100%", maxWidth:"560px", maxHeight:"90vh", overflowY:"auto" },
  modalSm:    { background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"16px", padding:"2rem", width:"100%", maxWidth:"380px" },
  grid2:      { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" },
  closeBtn:   { display:"flex", alignItems:"center", justifyContent:"center", width:"30px", height:"30px", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"8px", color:"var(--text2)", cursor:"pointer", flexShrink:0 },
  tag:        { background:"var(--accentBg)", color:"var(--accent2)", border:"1px solid var(--accentBd)", borderRadius:"6px", padding:"2px 9px", fontSize:".73rem", fontWeight:500 },
  greenTag:   { background:"rgba(52,211,153,.1)", color:"var(--green)", border:"1px solid rgba(52,211,153,.2)", borderRadius:"6px", padding:"2px 9px", fontSize:".73rem", fontWeight:600 },
  grayTag:    { background:"var(--surface2)", color:"var(--text3)", border:"1px solid var(--border)", borderRadius:"6px", padding:"2px 9px", fontSize:".73rem" },
};

export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"2rem", gap:"1rem", flexWrap:"wrap" }}>
      <div>
        <h1 style={{ fontSize:"1.75rem", fontWeight:800 }}>{title}</h1>
        {subtitle && <p style={{ color:"var(--text2)", marginTop:".25rem", fontSize:".9rem" }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function Field({ label, children, error }) {
  return (
    <div>
      <label style={s.label}>{label}</label>
      {children}
      {error && <p style={{ color:"var(--red)", fontSize:".76rem", marginTop:".25rem" }}>{error}</p>}
    </div>
  );
}

export function ConfirmDelete({ onConfirm, onCancel, loading }) {
  return (
    <div style={s.overlay}>
      <div style={s.modalSm}>
        <h2 style={{ fontWeight:800, marginBottom:".75rem" }}>Delete this item?</h2>
        <p style={{ color:"var(--text2)", marginBottom:"1.5rem", fontSize:".88rem" }}>This action cannot be undone.</p>
        <div style={{ display:"flex", gap:".75rem", justifyContent:"flex-end" }}>
          <button onClick={onCancel} style={s.secondary}>Cancel</button>
          <button onClick={onConfirm} disabled={loading} style={{ ...s.primary, background:"var(--red)" }}>
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function SaveBar({ onSave, loading, saved }) {
  return (
    <button onClick={onSave} disabled={loading} style={{
      ...s.primary,
      background: saved ? "rgba(52,211,153,.15)" : "var(--accent)",
      color: saved ? "var(--green)" : "#fff",
      border: saved ? "1px solid rgba(52,211,153,.3)" : "none",
      minWidth:"110px",
    }}>
      {loading ? "Saving…" : saved ? "✓ Saved" : "Save"}
    </button>
  );
}
