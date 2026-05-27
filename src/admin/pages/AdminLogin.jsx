import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";

export default function AdminLogin() {
  const { login, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

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
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-3)" }}>
      Loading…
    </div>
  );

  return (
    <div className="login-page">
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="login-icon">
          <Lock size={20} />
        </div>

        <h1>Admin Login</h1>
        <p>Enter your credentials to continue.</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label className="mono">Email</label>
            <div className="input-wrapper">
              <Mail size={14} className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label className="mono">Password</label>
            <div className="input-wrapper">
              <Lock size={14} className="input-icon" />
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button type="button" onClick={() => setShow(s => !s)} className="toggle-pw">
                {show ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={busy} className="login-submit">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </motion.div>

      <style>{`
        .login-page {
          min-height: 100vh;
          background: var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .login-card {
          width: 100%;
          max-width: 380px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 2rem;
        }

        .login-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-lg);
          background: var(--accent-muted);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-2);
          margin: 0 auto 1.25rem;
        }

        .login-card h1 {
          font-size: 1.25rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 0.25rem;
        }

        .login-card > p {
          color: var(--text-3);
          font-size: 0.8rem;
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .login-error {
          background: var(--red-bg);
          border: 1px solid var(--red);
          border-radius: var(--radius);
          padding: 0.6rem 0.85rem;
          color: var(--red);
          font-size: 0.8rem;
          margin-bottom: 1rem;
          text-align: center;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .login-field label {
          display: block;
          font-size: 0.7rem;
          font-weight: 500;
          color: var(--text-3);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 0.3rem;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-4);
          pointer-events: none;
        }

        .input-wrapper input {
          width: 100%;
          padding: 0.6rem 0.85rem 0.6rem 2.25rem;
          background: var(--bg-alt);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          color: var(--text);
          font-size: 0.85rem;
          outline: none;
          transition: border-color 0.15s;
          font-family: var(--font-sans);
        }

        .input-wrapper input:focus {
          border-color: var(--text-3);
        }

        .toggle-pw {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-4);
          cursor: pointer;
          padding: 0;
          display: flex;
        }

        .toggle-pw:hover {
          color: var(--text-2);
        }

        .login-submit {
          width: 100%;
          padding: 0.65rem;
          background: var(--accent);
          color: var(--accent-fg);
          border: none;
          border-radius: var(--radius);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          margin-top: 0.25rem;
          transition: opacity 0.15s;
          font-family: var(--font-sans);
        }

        .login-submit:hover:not(:disabled) {
          opacity: 0.85;
        }

        .login-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
