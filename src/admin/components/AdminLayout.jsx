import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, User, Briefcase, Layers, BookOpen,
  FileText, Star, MessageSquare, Settings, LogOut,
  ExternalLink, Search, Scale, Menu, X,
} from "lucide-react";

const NAV = [
  { to: "/admin",              label: "Dashboard",    icon: LayoutDashboard, end: true },
  { to: "/admin/profile",      label: "Profile",      icon: User },
  { to: "/admin/projects",     label: "Projects",     icon: Briefcase },
  { to: "/admin/services",     label: "Services",     icon: Layers },
  { to: "/admin/blogs",        label: "Blog",         icon: BookOpen },
  { to: "/admin/resume",       label: "Resume",       icon: FileText },
  { to: "/admin/testimonials", label: "Testimonials", icon: Star },
  { to: "/admin/messages",     label: "Messages",     icon: MessageSquare },
  { label: "──────", divider: true },
  { to: "/admin/seo",          label: "SEO",          icon: Search },
  { to: "/admin/legal",        label: "Legal pages",  icon: Scale },
  { to: "/admin/settings",     label: "Settings",     icon: Settings },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Mobile Header */}
      <div className="admin-mobile-header" style={{
        display: "none",
        position: "fixed", top: 0, left: 0, right: 0,
        height: "56px",
        background: "#ffffff", borderBottom: "1px solid var(--border)",
        padding: "0 1rem",
        alignItems: "center", justifyContent: "space-between",
        zIndex: 60,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button onClick={() => setOpen(true)}
            style={{
              background: "none", border: "none",
              padding: "0.25rem", cursor: "pointer",
              color: "var(--text2)", display: "flex",
            }}>
            <Menu size={22} />
          </button>
          <p style={{ fontSize: "0.95rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>
            Dashboard
          </p>
        </div>
        <a href="/" target="_blank" rel="noreferrer"
          style={{ color: "var(--text2)", display: "flex", padding: "0.25rem" }}>
          <ExternalLink size={18} />
        </a>
      </div>

      {/* Desktop Sidebar */}
      <aside className="admin-sidebar" style={{
        width: 230, minWidth: 230,
        background: "var(--bg2)",
        borderRight: "1px solid var(--border)",
        padding: "1.5rem 0.85rem",
        display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh", overflowY: "auto",
      }}>
        <div style={{ padding: "0.25rem 0.65rem 1.5rem" }}>
          <p style={{ fontSize: "0.9rem", fontWeight: 800, fontFamily: "var(--font-display)" }}>⚡ Dashboard</p>
          <p style={{ fontSize: "0.7rem", color: "var(--text3)", marginTop: 2,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {admin?.email}
          </p>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
          {NAV.map((item, i) => {
            if (item.divider) return (
              <div key={i} style={{ borderTop: "1px solid var(--border)", margin: "0.5rem 0" }} />
            );
            const { to, label, icon: Icon, end } = item;
            return (
              <NavLink key={to} to={to} end={end}
                style={({ isActive }) => ({
                  display: "flex", alignItems: "center", gap: 9,
                  padding: "0.55rem 0.7rem", borderRadius: 9,
                  textDecoration: "none", fontSize: "0.84rem", fontWeight: 500,
                  transition: "all 0.15s",
                  background: isActive ? "var(--glow)" : "transparent",
                  color: isActive ? "var(--accent2)" : "var(--text2)",
                  border: isActive ? "1px solid rgba(124,109,250,0.2)" : "1px solid transparent",
                })}>
                <Icon size={14} />{label}
              </NavLink>
            );
          })}
        </nav>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "0.85rem",
          display: "flex", flexDirection: "column", gap: 2 }}>
          <a href="/" target="_blank" rel="noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 9, padding: "0.5rem 0.7rem",
              borderRadius: 9, color: "var(--text3)", fontSize: "0.82rem", textDecoration: "none" }}>
            <ExternalLink size={13} /> View site
          </a>
          <button onClick={async () => { await logout(); navigate("/admin/login", { replace: true }); }}
            style={{ display: "flex", alignItems: "center", gap: 9, padding: "0.5rem 0.7rem",
              borderRadius: 9, background: "none", border: "none", color: "var(--text3)",
              fontSize: "0.82rem", cursor: "pointer", fontFamily: "var(--font-display)",
              width: "100%", textAlign: "left" }}>
            <LogOut size={13} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{
                position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
                zIndex: 70, display: "flex",
              }}
            />
            {/* Sidebar */}
            <motion.aside
              initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: "tween", duration: 0.2 }}
              style={{
                position: "fixed", top: 0, left: 0, bottom: 0,
                width: 260,
                background: "#ffffff",
                borderRight: "1px solid var(--border)",
                padding: "1rem 0.85rem",
                display: "flex", flexDirection: "column",
                zIndex: 80,
              }}>
              <div style={{ 
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0.5rem 0.5rem 1.25rem",
                borderBottom: "1px solid var(--border)", marginBottom: "0.75rem"
              }}>
                <p style={{ fontSize: "0.9rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>⚡ Dashboard</p>
                <button onClick={() => setOpen(false)}
                  style={{
                    background: "none", border: "none",
                    padding: "0.25rem", cursor: "pointer",
                    color: "var(--text2)", display: "flex",
                  }}>
                  <X size={20} />
                </button>
              </div>

              <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, overflowY: "auto" }}>
                {NAV.map((item, i) => {
                  if (item.divider) return (
                    <div key={i} style={{ borderTop: "1px solid var(--border)", margin: "0.5rem 0" }} />
                  );
                  const { to, label, icon: Icon, end } = item;
                  return (
                    <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}
                      style={({ isActive }) => ({
                        display: "flex", alignItems: "center", gap: 9,
                        padding: "0.6rem 0.7rem", borderRadius: 9,
                        textDecoration: "none", fontSize: "0.88rem", fontWeight: 500,
                        transition: "all 0.15s",
                        background: isActive ? "var(--glow)" : "transparent",
                        color: isActive ? "var(--accent2)" : "var(--text2)",
                        border: isActive ? "1px solid rgba(124,109,250,0.2)" : "1px solid transparent",
                      })}>
                      <Icon size={15} />{label}
                    </NavLink>
                  );
                })}
              </nav>

              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "0.85rem",
                display: "flex", flexDirection: "column", gap: 2 }}>
                <a href="/" target="_blank" rel="noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 9, padding: "0.5rem 0.7rem",
                    borderRadius: 9, color: "var(--text3)", fontSize: "0.82rem", textDecoration: "none" }}>
                  <ExternalLink size={13} /> View site
                </a>
                <button onClick={async () => { await logout(); navigate("/admin/login", { replace: true }); }}
                  style={{ display: "flex", alignItems: "center", gap: 9, padding: "0.5rem 0.7rem",
                    borderRadius: 9, background: "none", border: "none", color: "var(--text3)",
                    fontSize: "0.82rem", cursor: "pointer", fontFamily: "var(--font-display)",
                    width: "100%", textAlign: "left" }}>
                  <LogOut size={13} /> Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="admin-main" style={{ flex: 1, padding: "2rem 2.5rem", overflowY: "auto", minHeight: "100vh" }}>
        <Outlet />
      </main>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { display: none !important; }
          .admin-mobile-header { display: flex !important; }
          .admin-main { padding: 1rem 1rem 3rem !important; margin-top: 56px; }
        }
        @media (min-width: 769px) {
          .admin-mobile-header { display: none !important; }
        }
      `}</style>
    </div>
  );
}