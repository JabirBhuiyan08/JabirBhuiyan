import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import api from "../lib/api";

export default function BlogList() {
  const [active, setActive] = useState("All");
  const { data: blogs = [] } = useQuery({ queryKey: ["blogs"], queryFn: () => api.get("/api/blogs").then(r => r.data) });
  const { data: cfg = {} } = useQuery({ queryKey: ["settings"], queryFn: () => api.get("/api/settings").then(r => r.data) });

  const cats = ["All", ...[...new Set((cfg.blogCategories || []).map(c => c?.trim()).filter(Boolean))]];
  const list = active === "All" ? blogs : blogs.filter(b => b.category === active);

  return (
    <>
      <Helmet><title>Blog — Portfolio</title></Helmet>

      <div className="blog-page">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <header className="page-header">
            <h1>Blog</h1>
            <p className="text-2">Thoughts on code, design, and building things.</p>
          </header>

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

          {list.length === 0 ? (
            <p className="empty-state">No posts yet.</p>
          ) : (
            <div className="blog-list">
              {list.map((b, i) => (
                <motion.div
                  key={b._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link to={`/blog/${b.slug}`} className="blog-item">
                    <div className="blog-item-meta">
                      <time className="mono">{new Date(b.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</time>
                      {b.category && <span className="tag">{b.category}</span>}
                    </div>
                    <h3>{b.title}</h3>
                    {b.excerpt && <p>{b.excerpt}</p>}
                    <span className="blog-read-more">
                      Read more <ArrowRight size={12} />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <style>{`
        .blog-page .page-header {
          margin-bottom: 1.5rem;
        }

        .blog-page .page-header h1 {
          margin-bottom: 0.25rem;
        }

        .blog-page .filter-bar {
          display: flex;
          gap: 0.35rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }

        .blog-page .filter-btn {
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

        .blog-page .filter-btn:hover {
          color: var(--text);
          border-color: var(--text-4);
        }

        .blog-page .filter-btn.active {
          background: var(--accent);
          color: var(--accent-fg);
          border-color: var(--accent);
        }

        .empty-state {
          color: var(--text-3);
          font-size: 0.9rem;
          padding: 2rem 0;
        }

        .blog-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .blog-item {
          display: block;
          padding: 1.25rem 0;
          border-bottom: 1px solid var(--border);
          text-decoration: none;
          transition: background 0.15s;
        }

        .blog-item:first-child {
          padding-top: 0;
        }

        .blog-item:hover {
          opacity: 0.8;
        }

        .blog-item-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.4rem;
        }

        .blog-item-meta time {
          font-size: 0.72rem;
          color: var(--text-3);
        }

        .blog-item h3 {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 0.3rem;
          line-height: 1.3;
        }

        .blog-item p {
          font-size: 0.8rem;
          color: var(--text-2);
          line-height: 1.5;
          margin-bottom: 0.5rem;
        }

        .blog-read-more {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.72rem;
          font-weight: 500;
          color: var(--text-3);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
      `}</style>
    </>
  );
}
