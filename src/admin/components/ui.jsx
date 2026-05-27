// Shared styles and components for admin pages

export const s = {
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "1.25rem",
  },
  input: {
    width: "100%",
    padding: "0.6rem 0.85rem",
    borderRadius: "var(--radius)",
    fontSize: "0.85rem",
    background: "var(--bg-alt)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    outline: "none",
    fontFamily: "var(--font-sans)",
    transition: "border-color 0.15s",
  },
  textarea: {
    width: "100%",
    padding: "0.6rem 0.85rem",
    borderRadius: "var(--radius)",
    fontSize: "0.85rem",
    background: "var(--bg-alt)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    outline: "none",
    resize: "vertical",
    fontFamily: "var(--font-sans)",
    transition: "border-color 0.15s",
  },
  select: {
    width: "100%",
    padding: "0.6rem 0.85rem",
    borderRadius: "var(--radius)",
    fontSize: "0.85rem",
    background: "var(--bg-alt)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    outline: "none",
    fontFamily: "var(--font-sans)",
  },
  label: {
    display: "block",
    fontSize: "0.72rem",
    fontWeight: 500,
    color: "var(--text-3)",
    marginBottom: "0.3rem",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    fontFamily: "var(--font-mono)",
  },
  primary: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    background: "var(--accent)",
    color: "var(--bg)",
    border: "none",
    borderRadius: "var(--radius)",
    padding: "0.55rem 1rem",
    fontSize: "0.8rem",
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
    transition: "opacity 0.15s",
  },
  secondary: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    background: "transparent",
    color: "var(--text-2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "0.5rem 0.9rem",
    fontSize: "0.8rem",
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
    transition: "all 0.15s",
  },
  danger: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    background: "var(--red-bg)",
    color: "var(--red)",
    border: "1px solid var(--red)",
    borderRadius: "var(--radius)",
    padding: "0.4rem 0.75rem",
    fontSize: "0.75rem",
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
  },
  iconBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    background: "var(--bg-alt)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--text-2)",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
    padding: "1rem",
  },
  modal: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "1.75rem",
    width: "100%",
    maxWidth: "540px",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  modalSm: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "1.75rem",
    width: "100%",
    maxWidth: "380px",
  },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" },
  closeBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "28px",
    height: "28px",
    background: "var(--bg-alt)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--text-2)",
    cursor: "pointer",
    flexShrink: 0,
  },
  tag: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.7rem",
    background: "var(--bg-alt)",
    border: "1px solid var(--border)",
    borderRadius: "4px",
    padding: "0.15rem 0.5rem",
    color: "var(--text-2)",
  },
  greenTag: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.7rem",
    background: "var(--green-bg)",
    color: "var(--green)",
    border: "1px solid var(--green)",
    borderRadius: "4px",
    padding: "0.15rem 0.5rem",
    fontWeight: 500,
  },
  grayTag: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.7rem",
    background: "var(--bg-alt)",
    color: "var(--text-3)",
    border: "1px solid var(--border)",
    borderRadius: "4px",
    padding: "0.15rem 0.5rem",
  },
};

export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem", gap: "1rem", flexWrap: "wrap" }}>
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em" }}>{title}</h1>
        {subtitle && <p style={{ color: "var(--text-2)", marginTop: "0.2rem", fontSize: "0.85rem" }}>{subtitle}</p>}
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
      {error && <p style={{ color: "var(--red)", fontSize: "0.72rem", marginTop: "0.2rem" }}>{error}</p>}
    </div>
  );
}

export function ConfirmDelete({ onConfirm, onCancel, loading }) {
  return (
    <div style={s.overlay}>
      <div style={s.modalSm}>
        <h2 style={{ fontWeight: 700, marginBottom: "0.5rem", fontSize: "1.1rem" }}>Delete this item?</h2>
        <p style={{ color: "var(--text-2)", marginBottom: "1.25rem", fontSize: "0.85rem" }}>This action cannot be undone.</p>
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={s.secondary}>Cancel</button>
          <button onClick={onConfirm} disabled={loading} style={{ ...s.primary, background: "var(--red)", color: "#fff" }}>
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
      background: saved ? "var(--green)" : "var(--accent)",
      color: saved ? "#fff" : "var(--bg)",
      minWidth: "100px",
    }}>
      {loading ? "Saving…" : saved ? "✓ Saved" : "Save"}
    </button>
  );
}
