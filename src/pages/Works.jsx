import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ArrowUpRight, Github } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../lib/api";

export default function Works() {
  const [active, setActive] = useState("All");
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => api.get("/api/projects").then(r => r.data) });
  const { data: cfg = {} } = useQuery({ queryKey: ["settings"], queryFn: () => api.get("/api/settings").then(r => r.data) });

  const cats = ["All", ...[...new Set((cfg.portfolioCategories || []).map(c => c?.trim()).filter(Boolean))]];
  const list = active === "All" ? projects : projects.filter(p => p.category === active);

  return (
    <>
      <Helmet><title>Works — Portfolio</title></Helmet>

      <div className="works-page">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <header className="page-header">
            <h1>Works</h1>
            <p className="text-2">Projects I've built and shipped.</p>
          </header>

          {/* Filters */}
          <div className="filter-bar">
            {cats.map(c => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`filter-btn ${active === c ? "active" : ""}`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Grid */}
          {list.length === 0 ? (
            <p className="empty-state">No projects yet.</p>
          ) : (
            <div className="works-grid">
              <AnimatePresence mode="popLayout">
                {list.map((p, i) => (
                  <motion.article
                    key={p._id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ delay: i * 0.03 }}
                    className="work-card"
                  >
                    <Link to={`/works/${p._id}`} className="work-card-link">
                      <div className="work-media">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.title} loading="lazy" />
                        ) : (
                          <div className="work-placeholder mono">{p.title[0]}</div>
                        )}
                      </div>
                      <div className="work-body">
                        <div className="work-meta">
                          <span className="tag">{p.category || "Project"}</span>
                        </div>
                        <h3>{p.title}</h3>
                        <p className="work-desc">{p.description}</p>
                        {p.tags?.length > 0 && (
                          <div className="work-tags">
                            {p.tags.slice(0, 4).map(t => (
                              <span key={t} className="tag">{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="work-links">
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noreferrer" className="work-link" onClick={e => e.stopPropagation()}>
                          <ArrowUpRight size={12} /> Live
                        </a>
                      )}
                      {p.repoUrl && (
                        <a href={p.repoUrl} target="_blank" rel="noreferrer" className="work-link" onClick={e => e.stopPropagation()}>
                          <Github size={12} /> Code
                        </a>
                      )}
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      <style>{`
        .works-page .page-header {
          margin-bottom: 1.5rem;
        }

        .works-page .page-header h1 {
          margin-bottom: 0.25rem;
        }

        .filter-bar {
          display: flex;
          gap: 0.35rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }

        .filter-btn {
          padding: 0.35rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 500;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-3);
          border-radius: var(--radius);
          cursor: pointer;
          transition: all 0.15s;
        }

        .filter-btn:hover {
          color: var(--text);
          border-color: var(--text-4);
        }

        .filter-btn.active {
          background: var(--accent);
          color: var(--bg);
          border-color: var(--accent);
        }

        .empty-state {
          color: var(--text-3);
          font-size: 0.9rem;
          padding: 2rem 0;
        }

        .works-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }

        .work-card {
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--surface);
          transition: border-color 0.2s, box-shadow 0.2s;
          display: flex;
          flex-direction: column;
        }

        .work-card:hover {
          border-color: var(--text-4);
          box-shadow: var(--shadow-md);
        }

        .work-card-link {
          display: block;
          text-decoration: none;
          color: inherit;
          flex: 1;
        }

        .work-media {
          aspect-ratio: 16/9;
          background: var(--bg-alt);
          overflow: hidden;
        }

        .work-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .work-card:hover .work-media img {
          transform: scale(1.02);
        }

        .work-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          color: var(--text-4);
          font-weight: 600;
        }

        .work-body {
          padding: 1rem 1.25rem 1.25rem;
        }

        .work-meta {
          margin-bottom: 0.5rem;
        }

        .work-body h3 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.35rem;
        }

        .work-desc {
          font-size: 0.8rem;
          color: var(--text-2);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .work-tags {
          display: flex;
          gap: 0.35rem;
          flex-wrap: wrap;
          margin-top: 0.75rem;
        }

        .work-links {
          display: flex;
          gap: 0.75rem;
          padding: 0.75rem 1.25rem;
          border-top: 1px solid var(--border);
        }

        .work-link {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.72rem;
          font-weight: 500;
          color: var(--text-3);
          text-transform: uppercase;
          letter-spacing: 0.03em;
          transition: color 0.15s;
        }

        .work-link:hover {
          color: var(--text);
        }

        @media (max-width: 640px) {
          .works-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
