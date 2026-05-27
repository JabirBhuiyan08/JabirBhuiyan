import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Briefcase, BookOpen, MessageSquare, Star, Layers, ArrowRight } from "lucide-react";
import api from "../../lib/api";

function StatCard({ icon: Icon, label, count, to }) {
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <motion.div
        whileHover={{ y: -2 }}
        className="stat-card"
      >
        <div className="stat-icon">
          <Icon size={16} />
        </div>
        <div className="stat-info">
          <span className="stat-count mono">{count}</span>
          <span className="stat-label">{label}</span>
        </div>
      </motion.div>
    </Link>
  );
}

export default function Dashboard() {
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => api.get("/api/projects").then(r => r.data) });
  const { data: blogs = [] } = useQuery({ queryKey: ["admin-blogs"], queryFn: () => api.get("/api/blogs/admin/all").then(r => r.data) });
  const { data: messages = [] } = useQuery({ queryKey: ["messages"], queryFn: () => api.get("/api/messages").then(r => r.data) });
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: () => api.get("/api/services").then(r => r.data) });
  const { data: testimonials = [] } = useQuery({ queryKey: ["testimonials"], queryFn: () => api.get("/api/testimonials").then(r => r.data) });

  const unread = messages.filter(m => !m.read).length;

  return (
    <div className="dashboard">
      <div className="dash-header">
        <h1>Dashboard</h1>
        <p className="text-2">Overview of your portfolio.</p>
      </div>

      <div className="stats-grid">
        <StatCard icon={Briefcase} label="Projects" count={projects.length} to="/admin/projects" />
        <StatCard icon={BookOpen} label="Blog posts" count={blogs.length} to="/admin/blogs" />
        <StatCard icon={Layers} label="Services" count={services.length} to="/admin/services" />
        <StatCard icon={Star} label="Testimonials" count={testimonials.length} to="/admin/testimonials" />
        <StatCard icon={MessageSquare} label="Messages" count={messages.length} to="/admin/messages" />
      </div>

      {/* Recent Messages */}
      <div className="dash-section">
        <div className="dash-section-header">
          <h2>
            Recent messages
            {unread > 0 && <span className="unread-badge">{unread}</span>}
          </h2>
          <Link to="/admin/messages" className="dash-link">
            View all <ArrowRight size={12} />
          </Link>
        </div>

        <div className="messages-list">
          {messages.slice(0, 5).map(m => (
            <div key={m._id} className={`message-item ${!m.read ? "unread" : ""}`}>
              <div className="message-content">
                <div className="message-top">
                  <strong>{m.name}</strong>
                  {!m.read && <span className="unread-dot" />}
                  <time className="mono">{new Date(m.createdAt).toLocaleDateString()}</time>
                </div>
                <p className="message-email mono">{m.email}</p>
                <p className="message-text">{m.message}</p>
              </div>
            </div>
          ))}
          {messages.length === 0 && <p className="text-3" style={{ fontSize: "0.85rem" }}>No messages yet.</p>}
        </div>
      </div>

      <style>{`
        .dashboard .dash-header {
          margin-bottom: 1.5rem;
        }

        .dashboard .dash-header h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.15rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 1rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          transition: border-color 0.15s, box-shadow 0.15s;
        }

        .stat-card:hover {
          border-color: var(--text-4);
          box-shadow: var(--shadow-sm);
        }

        .stat-icon {
          width: 36px;
          height: 36px;
          border-radius: var(--radius);
          background: var(--accent-muted);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-2);
          flex-shrink: 0;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-count {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text);
          line-height: 1.2;
        }

        .stat-label {
          font-size: 0.7rem;
          color: var(--text-3);
        }

        .dash-section {
          margin-bottom: 2rem;
        }

        .dash-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border);
        }

        .dash-section-header h2 {
          font-size: 0.95rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .unread-badge {
          font-size: 0.65rem;
          font-weight: 600;
          background: var(--red-bg);
          color: var(--red);
          border: 1px solid var(--red);
          border-radius: 10px;
          padding: 0.1rem 0.4rem;
          font-family: var(--font-mono);
        }

        .dash-link {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          color: var(--text-3);
          transition: color 0.15s;
        }

        .dash-link:hover {
          color: var(--text);
        }

        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .message-item {
          padding: 0.85rem 1rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          transition: border-color 0.15s;
        }

        .message-item.unread {
          border-left: 3px solid var(--accent);
        }

        .message-item:hover {
          border-color: var(--text-4);
        }

        .message-top {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.15rem;
        }

        .message-top strong {
          font-size: 0.85rem;
          font-weight: 600;
        }

        .unread-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--accent);
          flex-shrink: 0;
        }

        .message-top time {
          margin-left: auto;
          font-size: 0.68rem;
          color: var(--text-4);
        }

        .message-email {
          font-size: 0.7rem;
          color: var(--text-3);
          margin-bottom: 0.25rem;
        }

        .message-text {
          font-size: 0.8rem;
          color: var(--text-2);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
