import { useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Menu, X, Sun, Moon, Github, Linkedin, Twitter,
  Instagram, Youtube, Mail, MapPin,
} from "lucide-react";
import { useTheme } from "../../lib/ThemeContext";
import api from "../../lib/api";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/works", label: "Works" },
  { to: "/services", label: "Services" },
  { to: "/blog", label: "Blog" },
  { to: "/resume", label: "Resume" },
  { to: "/contact", label: "Contact" },
];

const SOCIAL_ICONS = {
  github: Github, linkedin: Linkedin, twitter: Twitter,
  instagram: Instagram, youtube: Youtube,
};

export default function PublicLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggle } = useTheme();

  const { data: profile = {} } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get("/api/profile").then(r => r.data),
  });
  const { data: settings = {} } = useQuery({
    queryKey: ["settings"],
    queryFn: () => api.get("/api/settings").then(r => r.data),
  });

  const name = profile.name || settings.siteTitle || "Portfolio";
  const socials = Object.entries(profile.socials || {}).filter(([, v]) => !!v);

  return (
    <>
      <Helmet>
        {profile.avatarUrl ? (
          <link rel="icon" href={profile.avatarUrl} type="image/png" />
        ) : (
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        )}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </Helmet>

      <div className="site-layout">
        {/* ─── Navbar ─── */}
        <header className="site-nav">
          <div className="nav-inner">
            <Link to="/" className="nav-logo">
              <span className="logo-symbol">~/</span>
              <span className="logo-name">{name.split(" ")[0].toLowerCase()}</span>
            </Link>

            <nav className="nav-links">
              {NAV.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="nav-actions">
              <button
                onClick={toggle}
                className="theme-toggle"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              <button
                className="mobile-menu-btn"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </header>

        {/* ─── Mobile Menu ─── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mobile-menu"
            >
              <nav className="mobile-nav-links">
                {NAV.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => `mobile-nav-item ${isActive ? "active" : ""}`}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              {socials.length > 0 && (
                <div className="mobile-socials">
                  {socials.map(([key, url]) => {
                    const Icon = SOCIAL_ICONS[key];
                    if (!Icon) return null;
                    return (
                      <a key={key} href={url} target="_blank" rel="noreferrer" className="social-link">
                        <Icon size={16} />
                      </a>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Main Content ─── */}
        <main className="site-main">
          <div className="main-content">
            <Outlet />
          </div>
        </main>

        {/* ─── Footer ─── */}
        <footer className="site-footer">
          <div className="footer-inner">
            <div className="footer-left">
              <span className="mono">© {new Date().getFullYear()} {name}</span>
              {profile.location && (
                <span className="footer-location">
                  <MapPin size={12} />
                  {profile.location}
                </span>
              )}
            </div>
            <div className="footer-right">
              {socials.map(([key, url]) => {
                const Icon = SOCIAL_ICONS[key];
                if (!Icon) return null;
                return (
                  <a key={key} href={url} target="_blank" rel="noreferrer" className="social-link">
                    <Icon size={15} />
                  </a>
                );
              })}
              <Link to="/terms" className="footer-link">Terms</Link>
              <Link to="/privacy" className="footer-link">Privacy</Link>
              <Link to="/admin/login" className="footer-link">Admin</Link>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        .site-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* ─── Navbar ─── */
        .site-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--bg);
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(12px);
          height: var(--nav-height);
        }

        .nav-inner {
          max-width: var(--content-max);
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0;
          font-family: var(--font-mono);
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text);
          text-decoration: none;
        }

        .logo-symbol {
          color: var(--text-3);
        }

        .logo-name {
          color: var(--text);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .nav-item {
          padding: 0.4rem 0.75rem;
          font-size: 0.8rem;
          font-weight: 450;
          color: var(--text-3);
          border-radius: var(--radius);
          transition: all 0.15s;
          text-decoration: none;
        }

        .nav-item:hover {
          color: var(--text);
          background: var(--bg-hover);
        }

        .nav-item.active {
          color: var(--text);
          background: var(--accent-muted);
          font-weight: 500;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .theme-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-3);
          cursor: pointer;
          transition: all 0.15s;
        }

        .theme-toggle:hover {
          color: var(--text);
          border-color: var(--text-4);
          background: var(--bg-hover);
        }

        .mobile-menu-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-2);
          cursor: pointer;
        }

        /* ─── Mobile Menu ─── */
        .mobile-menu {
          display: none;
          position: fixed;
          top: var(--nav-height);
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 99;
          background: var(--bg);
          border-top: 1px solid var(--border);
          padding: 1.5rem;
          overflow-y: auto;
        }

        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .mobile-nav-item {
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
          font-weight: 450;
          color: var(--text-2);
          border-radius: var(--radius);
          text-decoration: none;
          transition: all 0.15s;
        }

        .mobile-nav-item:hover,
        .mobile-nav-item.active {
          color: var(--text);
          background: var(--accent-muted);
        }

        .mobile-nav-item.active {
          font-weight: 500;
        }

        .mobile-socials {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
        }

        /* ─── Main ─── */
        .site-main {
          flex: 1;
        }

        .main-content {
          max-width: var(--content-max);
          margin: 0 auto;
          padding: 3rem 1.5rem;
        }

        /* ─── Footer ─── */
        .site-footer {
          border-top: 1px solid var(--border);
          padding: 1.5rem 0;
        }

        .footer-inner {
          max-width: var(--content-max);
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .footer-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.75rem;
          color: var(--text-3);
        }

        .footer-location {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .footer-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .footer-link {
          font-size: 0.75rem;
          color: var(--text-3);
          text-decoration: none;
          transition: color 0.15s;
        }

        .footer-link:hover {
          color: var(--text);
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-3);
          transition: color 0.15s;
        }

        .social-link:hover {
          color: var(--text);
        }

        /* ─── Responsive ─── */
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }

          .mobile-menu-btn {
            display: flex;
          }

          .mobile-menu {
            display: block;
          }

          .main-content {
            padding: 2rem 1rem;
          }

          .footer-inner {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
        }
      `}</style>
    </>
  );
}
