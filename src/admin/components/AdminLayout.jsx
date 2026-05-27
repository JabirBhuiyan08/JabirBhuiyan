import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import { useTheme } from "../../lib/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, User, Briefcase, Layers, BookOpen,
  FileText, Star, MessageSquare, Settings, LogOut,
  ExternalLink, Search, Scale, Menu, X, Sun, Moon,
} from "lucide-react";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/profile", label: "Profile", icon: User },
  { to: "/admin/projects", label: "Projects", icon: Briefcase },
  { to: "/admin/services", label: "Services", icon: Layers },
  { to: "/admin/blogs", label: "Blog", icon: BookOpen },
  { to: "/admin/resume", label: "Resume", icon: FileText },
  { to: "/admin/testimonials", label: "Testimonials", icon: Star },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare },
  { label: "divider", divider: true },
  { to: "/admin/seo", label: "SEO", icon: Search },
  { to: "/admin/legal", label: "Legal", icon: Scale },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { admin, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin-layout">
      {/* Desktop Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <span className="sidebar-logo mono">~/admin</span>
          <button onClick={toggle} className="sidebar-theme-btn" aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar mono">{admin?.email?.[0]?.toUpperCase() || "A"}</div>
          <span className="user-email">{admin?.email || "admin"}</span>
        </div>

        <nav className="sidebar-nav">
          {NAV.map((item, i) => {
            if (item.divider) return <div key={i} className="nav-divider" />;
            const { to, label, icon: Icon, end } = item;
            return (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}
              >
                <Icon size={15} />
                <span>{label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <a href="/" target="_blank" rel="noreferrer" className="admin-nav-link">
            <ExternalLink size={14} />
            <span>View site</span>
          </a>
          <button onClick={handleLogout} className="admin-nav-link logout-btn">
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="admin-mobile-header">
        <div className="mobile-header-left">
          <button onClick={() => setOpen(true)} className="mobile-menu-trigger">
            <Menu size={20} />
          </button>
          <span className="mono" style={{ fontSize: "0.85rem", fontWeight: 500 }}>~/admin</span>
        </div>
        <div className="mobile-header-right">
          <button onClick={toggle} className="sidebar-theme-btn" aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <a href="/" target="_blank" rel="noreferrer" style={{ color: "var(--text-3)", display: "flex" }}>
            <ExternalLink size={16} />
          </a>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="admin-drawer"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "tween", duration: 0.2 }}
            >
              <div className="drawer-header">
                <span className="mono" style={{ fontWeight: 500 }}>~/admin</span>
                <button onClick={() => setOpen(false)} className="drawer-close">
                  <X size={18} />
                </button>
              </div>
              <nav className="sidebar-nav">
                {NAV.map((item, i) => {
                  if (item.divider) return <div key={i} className="nav-divider" />;
                  const { to, label, icon: Icon, end } = item;
                  return (
                    <NavLink
                      key={to}
                      to={to}
                      end={end}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}
                    >
                      <Icon size={15} />
                      <span>{label}</span>
                    </NavLink>
                  );
                })}
              </nav>
              <div className="sidebar-bottom">
                <button onClick={handleLogout} className="admin-nav-link logout-btn">
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="admin-main">
        <Outlet />
      </main>

      <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
        }

        /* Sidebar */
        .admin-sidebar {
          width: 220px;
          min-width: 220px;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          z-index: 50;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1rem 0.75rem;
          border-bottom: 1px solid var(--border);
        }

        .sidebar-logo {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text);
        }

        .sidebar-theme-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-3);
          cursor: pointer;
          transition: all 0.15s;
        }

        .sidebar-theme-btn:hover {
          color: var(--text);
          border-color: var(--text-4);
        }

        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--border);
        }

        .user-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--accent-muted);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--text-2);
        }

        .user-email {
          font-size: 0.72rem;
          color: var(--text-3);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .sidebar-nav {
          flex: 1;
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .admin-nav-link {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.8rem;
          font-weight: 450;
          color: var(--text-3);
          border-radius: var(--radius);
          text-decoration: none;
          transition: all 0.12s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
        }

        .admin-nav-link:hover {
          color: var(--text);
          background: var(--bg-hover);
        }

        .admin-nav-link.active {
          color: var(--text);
          background: var(--accent-muted);
          font-weight: 500;
        }

        .nav-divider {
          height: 1px;
          background: var(--border);
          margin: 0.35rem 0.75rem;
        }

        .sidebar-bottom {
          padding: 0.5rem;
          border-top: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .logout-btn {
          color: var(--text-3);
          font-family: var(--font-sans);
        }

        .logout-btn:hover {
          color: var(--red);
          background: var(--red-bg);
        }

        /* Mobile Header */
        .admin-mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 52px;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: 0 1rem;
          align-items: center;
          justify-content: space-between;
          z-index: 60;
        }

        .mobile-header-left,
        .mobile-header-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .mobile-menu-trigger {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: var(--text-2);
          cursor: pointer;
          padding: 0.25rem;
        }

        /* Drawer */
        .drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 70;
        }

        .admin-drawer {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 260px;
          background: var(--surface);
          border-right: 1px solid var(--border);
          z-index: 80;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          border-bottom: 1px solid var(--border);
        }

        .drawer-close {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: var(--text-2);
          cursor: pointer;
        }

        /* Main */
        .admin-main {
          flex: 1;
          margin-left: 220px;
          padding: 2rem;
          min-height: 100vh;
        }

        @media (max-width: 768px) {
          .admin-sidebar {
            display: none;
          }

          .admin-mobile-header {
            display: flex;
          }

          .admin-main {
            margin-left: 0;
            margin-top: 52px;
            padding: 1.25rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}
