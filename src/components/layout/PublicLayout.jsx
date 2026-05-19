import { useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Home, Briefcase, Layers, BookOpen, FileText,
  MessageSquare, MapPin, Mail, Github, Linkedin,
  Twitter, Instagram, Youtube, Menu, X, Sparkles,
  ChevronRight,
} from "lucide-react";
import api from "../../lib/api";

/* ═══════════════════════════════════════════════════════
   DESIGN TOKENS
═════════════════════════════════════════════════════════ */
const T = {
  surface:   "var(--surface)",
  bgAlt:     "var(--bg-alt)",
  bgHover:   "var(--bg-hover)",
  border:    "var(--border)",
  borderLt:  "var(--border-light)",
  text:      "var(--text)",
  textSec:   "var(--text-secondary)",
  textMuted: "var(--text-muted)",
  textLt:    "var(--text-light)",
  accent:    "var(--accent)",
  accentLt:  "var(--accent-light)",
  success:   "var(--success)",
  r:         "var(--r)",
  r2:        "var(--r2)",
};

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



/* ═══════════════════════════════════════════════════════
   COMPONENTS
═════════════════════════════════════════════════════════ */

function SocialIcon({ name, url }) {
  const Icon = SOCIAL_ICONS[name];
  if (!Icon) return null;
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="social-icon"
      whileHover={{ y: -2, scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <Icon size={16} />
    </motion.a>
  );
}

function InfoRow({ icon, text, isLink = false }) {
  if (isLink) {
    return (
      <motion.a
        href={`mailto:${text}`}
        className="info-row"
        whileHover={{ x: 3 }}
        transition={{ duration: 0.2 }}
      >
        <span className="info-icon">{icon}</span>
        <span className="info-text">{text}</span>
      </motion.a>
    );
  }
  return (
    <div className="info-row">
      <span className="info-icon">{icon}</span>
      <span className="info-text">{text}</span>
    </div>
  );
}

function MobileMenuItem({ to, label, icon: Icon, end, onClose }) {
  return (
    <NavLink to={to} end={end} onClick={onClose} className={({ isActive }) => `mobile-nav-item ${isActive ? "active" : ""}`}>
      {({ isActive }) => (
        <>
          <Icon size={18} className="mobile-nav-icon" />
          <span>{label}</span>
          {isActive && <div className="active-indicator" />}
        </>
      )}
    </NavLink>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN LAYOUT
═════════════════════════════════════════════════════════ */
export default function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: profile = {} } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get("/api/profile").then(r => r.data),
  });
  const { data: settings = {} } = useQuery({
    queryKey: ["settings"],
    queryFn: () => api.get("/api/settings").then(r => r.data),
  });

  const socials = Object.entries(profile.socials || {}).filter(([, v]) => !!v);
  const name = profile.name || settings.siteTitle || "Portfolio";
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map(p => p[0]).join("");
  const profileImage = profile.avatarUrl || "https://res.cloudinary.com/dgmd4ps5e/image/upload/v1773940195/portfolio/lopn6ibgwntb1vwjyxym.jpg";

  return (
    <>
      <Helmet>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Helmet>
      <div className="public-layout">
      {/* ═══════════════════════════════════════════
          DESKTOP SIDEBAR (≥ 961px)
      ═══════════════════════════════════════════ */}
      <aside className="desktop-sidebar">
        {/* Profile Section with Image */}
        <div className="sidebar-profile">
          <div className="avatar-container">
            <div className="avatar-ring" />
            <div className="avatar">
              <img src={profileImage} alt={name} />
            </div>
            {profile.openToWork && (
              <div className="status-badge available" />
            )}
          </div>

          <h1 className="sidebar-name">{name}</h1>
          <p className="sidebar-title">{profile.profession || settings.tagline || "Creative Developer"}</p>

          {profile.openToWork && (
            <div className="availability-chip">
              <Sparkles size={12} />
              <span>Available for work</span>
            </div>
          )}
        </div>

        {/* Contact Info */}
        {(profile.location || profile.email) && (
          <div className="sidebar-contact">
            {profile.location && (
              <InfoRow icon={<MapPin size={13} />} text={profile.location} />
            )}
            {profile.email && (
              <InfoRow icon={<Mail size={13} />} text={profile.email} isLink />
            )}
          </div>
        )}

        {/* Social Links */}
        {socials.length > 0 && (
          <div className="sidebar-socials">
            {socials.map(([key, url]) => (
              <SocialIcon key={key} name={key} url={url} />
            ))}
          </div>
        )}

        {/* Navigation */}
        <nav className="sidebar-nav">
          {NAV.map((item) => (
            <NavLink 
              key={item.to} 
              to={item.to} 
              end={item.end} 
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={18} className={isActive ? "nav-icon-active" : "nav-icon"} />
                  <span>{item.label}</span>
                  <ChevronRight size={14} className={`nav-arrow ${isActive ? "arrow-active" : ""}`} />
                  {isActive && <div className="active-dot" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Links */}
        <div className="sidebar-footer">
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/admin/login">Admin</Link>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════
          MOBILE HEADER (≤ 960px)
      ═══════════════════════════════════════════ */}
      <header className="mobile-header">
        <Link to="/" className="mobile-logo">
          <div className="mobile-logo-text">
            <span className="mobile-name">{name}</span>
            {profile.openToWork && (
              <span className="mobile-dot" />
            )}
          </div>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="menu-button"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="mobile-drawer"
          >
            {/* Mobile Profile Section with Image */}
            <div className="mobile-profile">
              <div className="mobile-avatar-large">
                <img src={profileImage} alt={name} />
              </div>
              <h3 className="mobile-profile-name">{name}</h3>
              <p className="mobile-profile-title">{profile.profession || settings.tagline || "Creative Developer"}</p>
              {profile.openToWork && (
                <div className="availability-chip mobile-chip">
                  <Sparkles size={12} />
                  <span>Available for work</span>
                </div>
              )}
            </div>

            <nav className="mobile-nav">
              {NAV.map((item) => (
                <MobileMenuItem
                  key={item.to}
                  {...item}
                  onClose={() => setMobileMenuOpen(false)}
                />
              ))}
            </nav>

            {(profile.location || profile.email) && (
              <div className="mobile-contact">
                {profile.location && (
                  <InfoRow icon={<MapPin size={13} />} text={profile.location} />
                )}
                {profile.email && (
                  <InfoRow icon={<Mail size={13} />} text={profile.email} isLink />
                )}
              </div>
            )}

            {socials.length > 0 && (
              <div className="mobile-socials">
                {socials.map(([key, url]) => (
                  <SocialIcon key={key} name={key} url={url} />
                ))}
              </div>
            )}

            <div className="mobile-footer-links">
              <Link to="/terms" onClick={() => setMobileMenuOpen(false)}>Terms</Link>
              <Link to="/privacy" onClick={() => setMobileMenuOpen(false)}>Privacy</Link>
              <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════
          MAIN CONTENT AREA
      ═══════════════════════════════════════════ */}
      <main className="main-content">
        <div className="content-wrapper">
          <Outlet />
        </div>

        <footer className="page-footer">
          <span>© {new Date().getFullYear()} {name}</span>
          <div className="footer-links">
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
          </div>
        </footer>
      </main>

      <style>{`
        /* ═══════════════════════════════════════════════════════
           GLOBAL LAYOUT STYLES
        ═════════════════════════════════════════════════════════ */
        .public-layout {
          display: flex;
          min-height: 100vh;
          width: 100%;
        }

        .mobile-header,
        .mobile-drawer {
          display: none;
        }

        /* ═══════════════════════════════════════════════════════
           DESKTOP SIDEBAR (≥ 961px)
        ═════════════════════════════════════════════════════════ */
        .desktop-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: var(--sidebar-w);
          background: ${T.surface};
          border-right: 1px solid ${T.border};
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          z-index: 50;
        }

        .desktop-sidebar::-webkit-scrollbar {
          width: 4px;
        }
        .desktop-sidebar::-webkit-scrollbar-track {
          background: transparent;
        }
        .desktop-sidebar::-webkit-scrollbar-thumb {
          background: ${T.border};
          border-radius: 4px;
        }

        /* Profile Section with Image */
        .sidebar-profile {
          padding: 2rem 1.5rem;
          text-align: center;
          border-bottom: 1px solid ${T.border};
        }

        .avatar-container {
          position: relative;
          width: fit-content;
          margin: 0 auto 1rem;
        }

        .avatar-ring {
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${T.accent}, #7c3aed);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .avatar-container:hover .avatar-ring {
          opacity: 1;
        }

        .avatar {
          position: relative;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: ${T.bgAlt};
          border: 3px solid ${T.border};
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }

        .avatar:hover {
          transform: scale(1.02);
        }

        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .status-badge {
          position: absolute;
          bottom: 4px;
          right: 4px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid ${T.surface};
        }

        .status-badge.available {
          background: #10b981;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .sidebar-name {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 700;
          color: ${T.text};
          margin: 0 0 0.25rem;
        }

        .sidebar-title {
          font-size: 0.8rem;
          color: ${T.textSec};
          margin: 0 0 0.75rem;
        }

        .availability-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.85rem;
          background: rgba(16, 185, 129, 0.1);
          border-radius: 40px;
          font-size: 0.7rem;
          font-weight: 600;
          color: #10b981;
        }

        /* Contact Info */
        .sidebar-contact {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid ${T.border};
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .info-row {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          font-size: 0.75rem;
          color: ${T.textSec};
          text-decoration: none;
          transition: all 0.2s;
        }

        .info-icon {
          flex-shrink: 0;
          color: ${T.textMuted};
          transition: color 0.2s;
        }

        .info-text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .info-row a {
          color: ${T.accent};
          text-decoration: none;
        }

        /* Socials */
        .sidebar-socials {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid ${T.border};
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 12px;
          border: 1px solid ${T.border};
          color: ${T.textMuted};
          transition: all 0.2s;
        }

        .social-icon:hover {
          border-color: ${T.accent};
          background: ${T.bgAlt};
          color: ${T.accent};
        }

        /* Navigation - WITH STRONG ACTIVE COLOR */
        .sidebar-nav {
          flex: 1;
          padding: 1rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.7rem 1rem;
          border-radius: 14px;
          font-size: 0.85rem;
          font-weight: 500;
          color: ${T.textSec};
          text-decoration: none;
          transition: all 0.25s ease;
          position: relative;
        }

        .nav-icon {
          color: ${T.textMuted};
          transition: all 0.25s ease;
        }

        .nav-link .nav-arrow {
          margin-left: auto;
          opacity: 0;
          transition: all 0.25s ease;
          color: ${T.accent};
        }

        /* Hover effect */
        .nav-link:hover {
          background: ${T.bgHover};
          color: ${T.text};
          transform: translateX(4px);
        }

        .nav-link:hover .nav-icon {
          color: ${T.accent};
        }

        .nav-link:hover .nav-arrow {
          opacity: 1;
          transform: translateX(4px);
        }

        /* ACTIVE STATE - STRONG COLORED BACKGROUND */
        .nav-link.active {
          background: linear-gradient(135deg, rgba(var(--accent-rgb), 0.15), rgba(var(--accent-rgb), 0.08));
          color: ${T.accent};
          font-weight: 600;
          border-left: 3px solid ${T.accent};
          border-radius: 14px 8px 8px 14px;
          box-shadow: 0 2px 8px rgba(var(--accent-rgb), 0.1);
        }

        .nav-link.active .nav-icon-active {
          color: ${T.accent};
        }

        .nav-link.active .nav-arrow {
          opacity: 1;
          color: ${T.accent};
        }

        .nav-link.active .arrow-active {
          color: ${T.accent};
          opacity: 1;
        }

        .nav-link.active:hover {
          transform: translateX(2px);
          background: linear-gradient(135deg, rgba(var(--accent-rgb), 0.2), rgba(var(--accent-rgb), 0.1));
        }

        /* Active dot indicator */
        .active-dot {
          position: absolute;
          right: 12px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${T.accent};
          box-shadow: 0 0 6px ${T.accent};
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }

        /* Sidebar Footer */
        .sidebar-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid ${T.border};
          display: flex;
          gap: 1.5rem;
          font-size: 0.7rem;
        }

        .sidebar-footer a {
          color: ${T.textLt};
          text-decoration: none;
          transition: all 0.2s;
        }

        .sidebar-footer a:hover {
          color: ${T.accent};
          transform: translateX(2px);
        }

        /* ═══════════════════════════════════════════════════════
           MAIN CONTENT
        ═══════════════════════════════════════════════════════ */
        .main-content {
          flex: 1;
          margin-left: var(--sidebar-w);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .content-wrapper {
          flex: 1;
          width: 100%;
          max-width: var(--content-max);
          padding: clamp(1.25rem, 2.5vw, 3rem) clamp(1rem, 3vw, 3rem) 1rem;
        }

        .page-footer {
          padding: 1rem 2rem;
          border-top: 1px solid ${T.border};
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.7rem;
          color: ${T.textMuted};
        }

        .footer-links {
          display: flex;
          gap: 1.5rem;
        }

        .footer-links a {
          color: ${T.textMuted};
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-links a:hover {
          color: ${T.accent};
        }

        /* ═══════════════════════════════════════════════════════
           MOBILE STYLES (≤ 960px)
        ═══════════════════════════════════════════════════════ */
        @media (max-width: 960px) {
          .public-layout {
            display: block;
            min-height: 100dvh;
          }

          .desktop-sidebar {
            display: none;
          }

          .main-content {
            margin-left: 0;
          }

          .mobile-header {
            position: sticky;
            top: 0;
            z-index: 100;
            display: flex;
            width: 100%;
            min-height: 64px;
            align-items: center;
            justify-content: space-between;
            padding: 0.75rem 1rem;
            background: rgba(var(--surface-rgb), 0.92);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid ${T.borderLt};
          }

          .mobile-logo {
            display: flex;
            align-items: center;
            gap: 0.65rem;
            text-decoration: none;
            min-width: 0;
          }

          .mobile-logo-text {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            min-width: 0;
          }

          .mobile-name {
            font-family: var(--font-display);
            font-size: 1rem;
            font-weight: 600;
            color: ${T.text};
            max-width: min(58vw, 420px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .mobile-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #10b981;
            animation: pulse 2s infinite;
          }

          .menu-button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            min-width: 40px;
            border-radius: 12px;
            background: transparent;
            border: none;
            color: ${T.textSec};
            cursor: pointer;
            transition: all 0.2s;
          }

          .menu-button:hover {
            background: ${T.bgAlt};
          }

          .mobile-drawer {
            display: block;
            position: fixed;
            top: 64px;
            left: 0;
            right: 0;
            z-index: 99;
            background: ${T.surface};
            border-top: 1px solid ${T.border};
            bottom: 0;
            overflow-y: auto;
            overscroll-behavior: contain;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
          }

          /* Mobile Profile Section */
          .mobile-profile {
            text-align: center;
            padding: 1rem 1rem 1.5rem;
            border-bottom: 1px solid ${T.borderLt};
            margin-bottom: 0.5rem;
          }

          .mobile-avatar-large {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            margin: 0 auto 0.75rem;
            overflow: hidden;
            border: 2px solid ${T.border};
          }

          .mobile-avatar-large img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .mobile-profile-name {
            font-family: var(--font-display);
            font-size: 1.1rem;
            font-weight: 600;
            margin: 0 0 0.25rem;
            color: ${T.text};
          }

          .mobile-profile-title {
            font-size: 0.75rem;
            color: ${T.textSec};
            margin: 0;
          }

          .mobile-chip {
            margin-top: 0.5rem;
            font-size: 0.65rem;
          }

          .mobile-nav {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            padding: 0.5rem;
          }

          .mobile-nav-item {
            display: flex;
            align-items: center;
            gap: 0.85rem;
            min-height: 48px;
            padding: 0.85rem 1rem;
            border-radius: 14px;
            font-size: 0.9rem;
            font-weight: 500;
            color: ${T.textSec};
            text-decoration: none;
            transition: all 0.2s;
            position: relative;
            width: 100%;
          }

          .mobile-nav-icon {
            color: ${T.textMuted};
            transition: color 0.2s;
          }

          .mobile-nav-item:hover {
            background: ${T.bgHover};
            color: ${T.text};
            transform: translateX(4px);
          }

          .mobile-nav-item:hover .mobile-nav-icon {
            color: ${T.accent};
          }

          /* Mobile Active State - STRONG COLOR */
          .mobile-nav-item.active {
            background: linear-gradient(135deg, rgba(var(--accent-rgb), 0.15), rgba(var(--accent-rgb), 0.08));
            color: ${T.accent};
            font-weight: 600;
            border-left: 3px solid ${T.accent};
            border-radius: 14px 8px 8px 14px;
          }

          .mobile-nav-item.active .mobile-nav-icon {
            color: ${T.accent};
          }

          .active-indicator {
            position: absolute;
            right: 12px;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: ${T.accent};
            box-shadow: 0 0 6px ${T.accent};
          }

          .mobile-contact {
            margin-top: 0.5rem;
            padding: 1rem;
            border-top: 1px solid ${T.borderLt};
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .mobile-socials {
            padding: 1rem;
            border-top: 1px solid ${T.borderLt};
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            justify-content: center;
          }

          .mobile-footer-links {
            padding: 1rem;
            border-top: 1px solid ${T.borderLt};
            display: flex;
            flex-wrap: wrap;
            gap: 1.5rem;
            font-size: 0.75rem;
          }

          .mobile-footer-links a {
            color: ${T.textLt};
            text-decoration: none;
            transition: all 0.2s;
          }

          .mobile-footer-links a:hover {
            color: ${T.accent};
          }
        }

        /* Tablet adjustments */
        @media (max-width: 768px) {
          .content-wrapper {
            padding: 1.25rem 1rem 0.75rem;
          }

          .page-footer {
            padding: 0.875rem 1rem;
          }
        }

        @media (max-width: 480px) {
          .mobile-header {
            padding: 0.625rem 0.75rem;
          }

          .mobile-name {
            max-width: min(64vw, 260px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .mobile-drawer {
            top: 60px;
          }

          .content-wrapper {
            padding: 1rem 0.875rem 0.5rem;
          }

          .page-footer {
            align-items: flex-start;
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
    </>
  );
}
