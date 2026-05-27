import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ArrowUpRight, Github, Calendar, Tag, Layers } from "lucide-react";
import api from "../lib/api";

export default function ProjectDetail() {
  const { id } = useParams();
  const { data: project, isLoading, isError } = useQuery({
    queryKey: ["project", id],
    queryFn: () => api.get(`/api/projects/${id}`).then(r => r.data),
  });

  if (isLoading) return <p className="text-3" style={{ padding: "2rem 0" }}>Loading…</p>;
  if (isError || !project) return (
    <div style={{ padding: "2rem 0" }}>
      <p className="text-3" style={{ marginBottom: "1rem" }}>Project not found.</p>
      <Link to="/works" className="btn btn-secondary">← Back to Works</Link>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{project.title} — Works</title>
        <meta name="description" content={project.description || ""} />
      </Helmet>

      <motion.div
        className="project-detail"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link to="/works" className="back-link">
          <ArrowLeft size={14} /> Back to Works
        </Link>

        {/* Hero Image */}
        {project.imageUrl && (
          <div className="detail-cover">
            <img src={project.imageUrl} alt={project.title} />
          </div>
        )}

        {/* Header */}
        <div className="detail-header">
          <div className="detail-meta-row">
            {project.category && (
              <span className="detail-category tag">
                <Layers size={11} /> {project.category}
              </span>
            )}
            {project.featured && <span className="detail-featured tag">★ Featured</span>}
            {project.createdAt && (
              <span className="detail-date">
                <Calendar size={12} />
                {new Date(project.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
              </span>
            )}
          </div>

          <h1>{project.title}</h1>

          {project.description && (
            <p className="detail-description">{project.description}</p>
          )}
        </div>

        {/* Actions */}
        <div className="detail-actions">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
              Live Demo <ArrowUpRight size={14} />
            </a>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">
              <Github size={14} /> Source Code
            </a>
          )}
        </div>

        {/* Tags */}
        {project.tags?.length > 0 && (
          <div className="detail-section">
            <h3 className="detail-section-title">
              <Tag size={14} /> Tech Stack
            </h3>
            <div className="detail-tags">
              {project.tags.map(tag => (
                <span key={tag} className="detail-tag">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Long description / content */}
        {project.content && (
          <div className="detail-section">
            <h3 className="detail-section-title">About this project</h3>
            <div className="detail-content" dangerouslySetInnerHTML={{ __html: project.content }} />
          </div>
        )}

        {/* Extra fields if they exist */}
        {(project.client || project.duration || project.role) && (
          <div className="detail-section">
            <h3 className="detail-section-title">Details</h3>
            <div className="detail-info-grid">
              {project.client && (
                <div className="info-item">
                  <span className="info-label mono">Client</span>
                  <span className="info-value">{project.client}</span>
                </div>
              )}
              {project.role && (
                <div className="info-item">
                  <span className="info-label mono">Role</span>
                  <span className="info-value">{project.role}</span>
                </div>
              )}
              {project.duration && (
                <div className="info-item">
                  <span className="info-label mono">Duration</span>
                  <span className="info-value">{project.duration}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      <style>{`
        .project-detail {
          max-width: 760px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: var(--text-3);
          margin-bottom: 1.5rem;
          transition: color 0.15s;
        }

        .back-link:hover {
          color: var(--text);
        }

        .detail-cover {
          margin-bottom: 1.5rem;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--border);
          background: var(--bg-alt);
        }

        .detail-cover img {
          width: 100%;
          height: auto;
          max-height: 400px;
          object-fit: cover;
        }

        .detail-header {
          margin-bottom: 1.5rem;
        }

        .detail-meta-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 0.75rem;
        }

        .detail-category {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
        }

        .detail-featured {
          background: var(--yellow-bg);
          border-color: var(--yellow);
          color: var(--yellow);
        }

        .detail-date {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.72rem;
          color: var(--text-3);
          font-family: var(--font-mono);
        }

        .detail-header h1 {
          font-size: clamp(1.5rem, 4vw, 2rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 0.5rem;
        }

        .detail-description {
          font-size: 0.95rem;
          color: var(--text-2);
          line-height: 1.7;
        }

        .detail-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border);
        }

        .detail-section {
          margin-bottom: 2rem;
        }

        .detail-section-title {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: var(--text);
        }

        .detail-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .detail-tag {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          padding: 0.3rem 0.7rem;
          border-radius: var(--radius);
          background: var(--bg-alt);
          border: 1px solid var(--border);
          color: var(--text-2);
          transition: all 0.15s;
        }

        .detail-tag:hover {
          border-color: var(--accent);
          color: var(--text);
          background: var(--accent-muted);
        }

        .detail-content {
          color: var(--text-2);
          font-size: 0.9rem;
          line-height: 1.8;
        }

        .detail-content p {
          margin-bottom: 1rem;
        }

        .detail-content h2 {
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          font-size: 1.15rem;
        }

        .detail-content ul, .detail-content ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }

        .detail-content li {
          margin-bottom: 0.35rem;
        }

        .detail-content a {
          color: var(--text);
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .detail-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 0.75rem;
        }

        .info-item {
          padding: 0.85rem 1rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          background: var(--surface);
        }

        .info-label {
          display: block;
          font-size: 0.65rem;
          color: var(--text-3);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 0.2rem;
        }

        .info-value {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text);
        }

        @media (max-width: 640px) {
          .detail-cover img {
            max-height: 220px;
          }

          .detail-actions {
            flex-direction: column;
          }

          .detail-actions .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}
