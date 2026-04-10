import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Briefcase, BookOpen, MessageSquare, Star, Layers, ArrowRight } from "lucide-react";
import api from "../../lib/api";

function StatCard({ icon: Icon, label, count, to, color }) {
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <motion.div whileHover={{ y: -2 }}
        style={{ background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 14, padding: "1.4rem",
          display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ color: "var(--text3)", fontSize: "0.75rem", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.4rem" }}>{label}</p>
          <p style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "var(--font-display)", color }}>{count}</p>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 11,
          background: `${color}18`, border: `1px solid ${color}30`,
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={19} style={{ color }} />
        </div>
      </motion.div>
    </Link>
  );
}

export default function Dashboard() {
  const { data: projects     = [] } = useQuery({ queryKey: ["projects"],     queryFn: () => api.get("/api/projects").then(r => r.data) });
  const { data: blogs        = [] } = useQuery({ queryKey: ["admin-blogs"],  queryFn: () => api.get("/api/blogs/admin/all").then(r => r.data) });
  const { data: messages     = [] } = useQuery({ queryKey: ["messages"],     queryFn: () => api.get("/api/messages").then(r => r.data) });
  const { data: services     = [] } = useQuery({ queryKey: ["services"],     queryFn: () => api.get("/api/services").then(r => r.data) });
  const { data: testimonials = [] } = useQuery({ queryKey: ["testimonials"], queryFn: () => api.get("/api/testimonials").then(r => r.data) });

  const unread = messages.filter(m => !m.read).length;

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800 }}>Overview</h1>
        <p style={{ color: "var(--text2)", marginTop: "0.2rem" }}>Everything at a glance.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
        <StatCard icon={Briefcase}    label="Projects"     count={projects.length}     to="/admin/projects"     color="var(--accent2)" />
        <StatCard icon={BookOpen}     label="Blog posts"   count={blogs.length}        to="/admin/blogs"        color="#34d399" />
        <StatCard icon={Layers}       label="Services"     count={services.length}     to="/admin/services"     color="#60a5fa" />
        <StatCard icon={Star}         label="Testimonials" count={testimonials.length} to="/admin/testimonials" color="#fbbf24" />
        <StatCard icon={MessageSquare} label="Messages"    count={messages.length}     to="/admin/messages"     color={unread > 0 ? "#f87171" : "var(--text3)"} />
      </div>

      {/* Recent messages */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700 }}>
            Recent messages {unread > 0 && <span style={{ color: "#f87171", fontSize: "0.85rem" }}>({unread} unread)</span>}
          </h2>
          <Link to="/admin/messages" style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--accent2)", fontSize: "0.82rem" }}>
            View all <ArrowRight size={13} />
          </Link>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
          {messages.slice(0, 6).map(m => (
            <div key={m._id} style={{ background: "var(--surface)",
              border: `1px solid ${!m.read ? "rgba(124,109,250,0.28)" : "var(--border)"}`,
              borderRadius: 10, padding: "0.9rem 1.2rem",
              display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: "0.2rem" }}>
                  <span style={{ fontWeight: 700, fontSize: "0.88rem" }}>{m.name}</span>
                  {!m.read && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />}
                </div>
                <p style={{ color: "var(--text3)", fontSize: "0.76rem", marginBottom: "0.25rem" }}>{m.email}</p>
                <p style={{ color: "var(--text2)", fontSize: "0.83rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {m.message}
                </p>
              </div>
              <span style={{ color: "var(--text3)", fontSize: "0.73rem", whiteSpace: "nowrap", flexShrink: 0 }}>
                {new Date(m.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
          {messages.length === 0 && <p style={{ color: "var(--text3)", fontSize: "0.87rem" }}>No messages yet.</p>}
        </div>
      </div>
    </div>
  );
}
