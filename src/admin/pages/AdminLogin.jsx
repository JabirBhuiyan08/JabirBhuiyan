import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";

export default function AdminLogin() {
  const { login, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [show,     setShow]     = useState(false);
  const [error,    setError]    = useState("");
  const [busy,     setBusy]     = useState(false);

  useEffect(() => {
    if (!loading && isAdmin) navigate("/admin", { replace: true });
  }, [isAdmin, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email.trim(), password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex",
      alignItems: "center", justifyContent: "center", color: "var(--text3)" }}>Loading…</div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: "var(--surface)", border: "1px solid var(--border2)",
          borderRadius: 20, padding: "2.5rem", width: "100%", maxWidth: 400 }}>

        <div style={{ width: 52, height: 52, borderRadius: 14,
          background: "rgba(124,109,250,0.12)", border: "1px solid rgba(124,109,250,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
          <Lock size={22} style={{ color: "var(--accent2)" }} />
        </div>

        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, textAlign: "center", marginBottom: "0.4rem" }}>Admin Login</h1>
        <p style={{ color: "var(--text2)", fontSize: "0.87rem", textAlign: "center", marginBottom: "2rem" }}>
          Enter your credentials to continue.
        </p>

        {error && (
          <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)",
            borderRadius: 10, padding: "0.75rem 1rem", color: "var(--red)",
            fontSize: "0.85rem", marginBottom: "1.25rem", textAlign: "center" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={lbl}>Email</label>
            <div style={{ position: "relative" }}>
              <Mail size={14} style={icon} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com" required style={{ ...inp, paddingLeft: "2.4rem" }} />
            </div>
          </div>
          <div>
            <label style={lbl}>Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={14} style={icon} />
              <input type={show ? "text" : "password"} value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required style={{ ...inp, paddingLeft: "2.4rem", paddingRight: "2.6rem" }} />
              <button type="button" onClick={() => setShow(s => !s)}
                style={{ position: "absolute", right: "0.8rem", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: "var(--text3)", cursor: "pointer", padding: 0 }}>
                {show ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={busy}
            style={{ width: "100%", background: busy ? "var(--surface2)" : "var(--accent)",
              color: "#fff", border: "none", borderRadius: 10, padding: "0.85rem",
              fontSize: "0.92rem", fontWeight: 700, cursor: busy ? "not-allowed" : "pointer",
              fontFamily: "var(--font-body)", opacity: busy ? 0.7 : 1, marginTop: "0.25rem" }}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

const lbl = { display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.4rem" };
const inp = { width: "100%", background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 9, padding: "0.7rem 0.9rem", color: "var(--text)", fontSize: "0.9rem", fontFamily: "var(--font-body)", outline: "none" };
const icon = { position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text3)", pointerEvents: "none" };
