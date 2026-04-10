import { useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Briefcase, Layers, BookOpen, FileText,
  MessageSquare, MapPin, Mail, Github, Linkedin,
  Twitter, Instagram, Youtube, Menu, X,
} from "lucide-react";
import api from "../../lib/api";

const NAV = [
  { to: "/",         label: "Home",     icon: Home,         end: true },
  { to: "/works",    label: "Works",    icon: Briefcase },
  { to: "/services", label: "Services", icon: Layers },
  { to: "/blog",     label: "Blog",     icon: BookOpen },
  { to: "/resume",   label: "Resume",   icon: FileText },
  { to: "/contact",  label: "Contact",  icon: MessageSquare },
];

const SOCIAL_ICONS = {
  github: Github, linkedin: Linkedin, twitter: Twitter,
  instagram: Instagram, youtube: Youtube,
};

export default function PublicLayout() {
  const [open, setOpen] = useState(false);
  const { data: profile  = {} } = useQuery({ queryKey: ["profile"],  queryFn: () => api.get("/api/profile").then(r => r.data) });
  const { data: settings = {} } = useQuery({ queryKey: ["settings"], queryFn: () => api.get("/api/settings").then(r => r.data) });

  const socials = Object.entries(profile.socials || {}).filter(([, v]) => !!v);

  return (
    <div className="layout-root">
      {/* ─── SIDEBAR ─── */}
      <aside className="layout-sidebar">

        {/* Profile block - Desktop */}
        <div className="sb-profile" style={{
          padding: "2rem 1.5rem 1.5rem",
          borderBottom: "1px solid var(--border)",
          textAlign: "center",
        }}>
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.name}
              style={{
                width: 72, height: 72, borderRadius: "50%",
                objectFit: "cover", margin: "0 auto 1rem",
                border: "2px solid var(--border)",
              }} />
          ) : (
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "var(--bg-alt)", margin: "0 auto 1rem",
              border: "2px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-display)", fontSize: "1.75rem",
              fontWeight: 600, color: "var(--text-muted)",
            }}>
              {(profile.name || "P")[0]}
            </div>
          )}

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.35rem",
            fontWeight: 600,
            marginBottom: "0.35rem",
            color: "var(--text)",
          }}>
            {profile.name || settings.siteTitle || "Portfolio"}
          </h1>

          <p style={{ 
            fontSize: "0.85rem", 
            color: "var(--text-secondary)",
            marginBottom: "0.75rem" 
          }}>
            {profile.profession || settings.tagline || ""}
          </p>

          {profile.openToWork && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: "rgba(39, 103, 73, 0.1)", color: "var(--success)",
              borderRadius: "var(--r)", padding: "4px 10px",
              fontSize: "0.65rem", fontWeight: 600,
              letterSpacing: "0.05em", textTransform: "uppercase",
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%",
                background: "var(--success)", display: "inline-block" }} />
              Available
            </span>
          )}
        </div>

        {/* Contact info - Desktop */}
        <div className="sb-info" style={{
          padding: "1rem 1.5rem",
          borderBottom: "1px solid var(--border)",
          display: "flex", flexDirection: "column", gap: "0.5rem",
        }}>
          {profile.location && (
            <InfoRow icon={<MapPin size={12} color="var(--text-muted)" />} text={profile.location} />
          )}
          {profile.email && (
            <InfoRow icon={<Mail size={12} color="var(--text-muted)" />}
              text={<a href={`mailto:${profile.email}`}
                style={{ color: "var(--accent)", transition: "color 0.15s" }}
                onMouseEnter={e => e.target.style.color = "var(--accent-light)"}
                onMouseLeave={e => e.target.style.color = "var(--accent)"}>
                {profile.email}
              </a>} />
          )}
        </div>

        {/* Socials - Desktop */}
        {socials.length > 0 && (
          <div className="sb-socials" style={{
            padding: "1rem 1.5rem",
            borderBottom: "1px solid var(--border)",
            display: "flex", gap: "0.5rem",
          }}>
            {socials.map(([key, url]) => {
              const Icon = SOCIAL_ICONS[key];
              if (!Icon) return null;
              return (
                <a key={key} href={url} target="_blank" rel="noreferrer"
                  style={{
                    width: 32, height: 32, borderRadius: "var(--r)",
                    border: "1px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--text-muted)", transition: "all 0.15s",
                    background: "transparent",
                  }}
                  onMouseEnter={e => { 
                    e.currentTarget.style.color = "var(--accent)"; 
                    e.currentTarget.style.borderColor = "var(--accent)"; 
                    e.currentTarget.style.background = "var(--bg-alt)"; 
                  }}
                  onMouseLeave={e => { 
                    e.currentTarget.style.color = "var(--text-muted)"; 
                    e.currentTarget.style.borderColor = "var(--border)"; 
                    e.currentTarget.style.background = "transparent"; 
                  }}>
                  <Icon size={14} />
                </a>
              );
            })}
          </div>
        )}

        {/* Nav - Desktop */}
        <nav className="sb-nav" style={{
          flex: 1, padding: "1rem 0.75rem",
          display: "flex", flexDirection: "column", gap: "0.25rem",
        }}>
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              style={({ isActive }) => ({
                display: "flex", alignItems: "center", gap: 10,
                padding: "0.6rem 0.85rem",
                borderRadius: "var(--r)",
                fontFamily: "var(--font-body)",
                fontSize: "0.9rem",
                fontWeight: isActive ? 600 : 400,
                transition: "all 0.15s",
                color: isActive ? "var(--accent)" : "var(--text-secondary)",
                background: isActive ? "var(--bg-alt)" : "transparent",
              })}>
              <Icon size={14} strokeWidth={1.8} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer - Desktop */}
        <div className="sb-footer" style={{
          padding: "1rem 1.5rem",
          borderTop: "1px solid var(--border)",
        }}>
          <div style={{
            display: "flex", gap: "1rem",
            fontSize: "0.7rem", fontWeight: 500,
            color: "var(--text-light)",
          }}>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/admin/login">Admin</Link>
          </div>
        </div>

        {/* ─── MOBILE NAVBAR ─── */}
        <div className="sb-mobile" style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1rem",
          height: "60px",
          flexShrink: 0,
        }}>
          {/* Left: Name + Available badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Link to="/" style={{
              fontFamily: "var(--font-display)", fontWeight: 600,
              fontSize: "1.1rem", color: "var(--text)",
            }}>
              {profile.name || settings.siteTitle || "Portfolio"}
            </Link>
            {profile.openToWork && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                background: "rgba(39, 103, 73, 0.1)", color: "var(--success)",
                borderRadius: "var(--r)", padding: "2px 6px",
                fontSize: "0.55rem", fontWeight: 600,
                letterSpacing: "0.05em", textTransform: "uppercase",
              }}>
                <span style={{ width: 4, height: 4, borderRadius: "50%",
                  background: "var(--success)", display: "inline-block" }} />
              </span>
            )}
          </div>
          
          {/* Right: Menu button */}
          <button onClick={() => setOpen(o => !o)}
            style={{ 
              background: "none", border: "none", 
              color: "var(--text-secondary)",
              padding: "0.5rem", display: "flex", alignItems: "center",
              cursor: "pointer",
            }}>
            {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
        </div>
      </aside>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
            style={{
              position: "fixed", top: 60, left: 0, right: 0, zIndex: 60,
              background: "var(--surface)", borderBottom: "1px solid var(--border)",
              padding: "0.5rem",
              display: "flex", flexDirection: "column",
            }}>
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}
                style={({ isActive }) => ({
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "0.75rem 1rem", borderRadius: "var(--r)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.95rem", fontWeight: isActive ? 600 : 400,
                  color: isActive ? "var(--accent)" : "var(--text-secondary)",
                  background: isActive ? "var(--bg-alt)" : "transparent",
                })}>
                <Icon size={16} strokeWidth={1.8} />{label}
              </NavLink>
            ))}
            {/* Mobile footer links */}
            <div style={{ 
              borderTop: "1px solid var(--border)", 
              padding: "0.75rem 1rem",
              display: "flex", gap: "1.5rem",
              fontSize: "0.75rem", fontWeight: 500, 
              color: "var(--text-light)",
            }}>
              <Link to="/terms" onClick={() => setOpen(false)}>Terms</Link>
              <Link to="/privacy" onClick={() => setOpen(false)}>Privacy</Link>
              <Link to="/admin/login" onClick={() => setOpen(false)}>Admin</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── MAIN ─── */}
      <div className="layout-main">
        <div className="layout-content">
          <Outlet />
        </div>

        <footer style={{
          borderTop: "1px solid var(--border)",
          padding: "1rem 2rem",
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: "0.5rem",
        }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 500,
            fontSize: "0.8rem", color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} {profile.name || settings.siteTitle || "Portfolio"}
          </span>
          <div style={{ display: "flex", gap: "1rem",
            fontSize: "0.7rem", fontWeight: 500, color: "var(--text-light)" }}>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

function InfoRow({ icon, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8,
      color: "var(--text-secondary)", fontSize: "0.8rem" }}>
      <span style={{ flexShrink: 0 }}>{icon}</span>
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{text}</span>
    </div>
  );
}