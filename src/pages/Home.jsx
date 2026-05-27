import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight, MapPin, Mail, Star, Github, Linkedin, Twitter, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import api from "../lib/api";

const fadeUp = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

const SOCIAL_ICONS = {
  github: Github, linkedin: Linkedin, twitter: Twitter,
  instagram: Instagram, youtube: Youtube,
};

export default function Home() {
  const { data: profile = {} } = useQuery({ queryKey: ["profile"], queryFn: () => api.get("/api/profile").then(r => r.data) });
  const { data: settings = {} } = useQuery({ queryKey: ["settings"], queryFn: () => api.get("/api/settings").then(r => r.data) });
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => api.get("/api/projects").then(r => r.data) });
  const { data: testimonials = [] } = useQuery({ queryKey: ["testimonials"], queryFn: () => api.get("/api/testimonials").then(r => r.data) });
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: () => api.get("/api/services").then(r => r.data) });

  const featured = (projects.filter(p => p.featured).length ? projects.filter(p => p.featured) : projects).slice(0, 4);
  const socials = Object.entries(profile.socials || {}).filter(([, v]) => !!v);

  return (
    <>
      <Helmet>
        <title>{profile.name || settings.siteTitle || "Portfolio"}</title>
        <meta name="description" content={(profile.bio || profile.tagline || settings.tagline || "").slice(0, 155)} />
      </Helmet>

      <div className="home">
        {/* ─── Hero ─── */}
        <motion.section className="hero" {...fadeUp} transition={{ duration: 0.4 }}>
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-status">
                {profile.openToWork && (
                  <span className="status-badge">
                    <span className="status-dot" />
                    Available for work
                  </span>
                )}
              </div>

              <h1 className="hero-title">
                {profile.name || "Developer"}
              </h1>

              <p className="hero-subtitle mono">
                {profile.profession ? profile.profession.split("|")[0].trim() : "Full-stack developer"}
              </p>

              <p className="hero-bio">
                {profile.bio || profile.tagline || "I build web applications with clean code and thoughtful design."}
              </p>

              <div className="hero-meta">
                {profile.location && (
                  <span className="meta-item">
                    <MapPin size={14} />
                    {profile.location}
                  </span>
                )}
                {profile.email && (
                  <a href={`mailto:${profile.email}`} className="meta-item meta-link">
                    <Mail size={14} />
                    {profile.email}
                  </a>
                )}
              </div>

              <div className="hero-actions">
                <Link to="/works" className="btn btn-primary">
                  View projects
                  <ArrowRight size={14} />
                </Link>
                <Link to="/contact" className="btn btn-secondary">
                  Get in touch
                </Link>
              </div>
            </div>

            {/* Profile Image + Socials */}
            <motion.div
              className="hero-image-wrapper"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div className="hero-image-row">
                {/* Social icons - left side */}
                {socials.length > 0 && (
                  <div className="hero-socials">
                    {socials.map(([key, url]) => {
                      const Icon = SOCIAL_ICONS[key];
                      if (!Icon) return null;
                      return (
                        <a key={key} href={url} target="_blank" rel="noreferrer" className="hero-social-link">
                          <Icon size={16} />
                        </a>
                      );
                    })}
                  </div>
                )}

                {/* Image */}
                <div className="hero-image-frame">
                  <div className="hero-image">
                    {profile.avatarUrl ? (
                      <img src={profile.avatarUrl} alt={profile.name || "Profile"} />
                    ) : (
                      <div className="hero-image-placeholder mono">
                        {(profile.name || "D").split(" ").map(w => w[0]).join("").slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <div className="image-decoration" />
                </div>
              </div>

              <div className="image-label mono">
                <span className="image-dot" />
                {profile.openToWork ? "open to work" : "building things"}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ─── Featured Projects ─── */}
        {featured.length > 0 && (
          <motion.section className="section" {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }}>
            <div className="section-header">
              <h2>Selected Work</h2>
              <Link to="/works" className="section-link">
                View all <ArrowRight size={13} />
              </Link>
            </div>

            <div className="project-grid">
              {featured.map((project, i) => (
                <motion.article
                  key={project._id || project.title}
                  className="project-card"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                >
                  <div className="project-media">
                    {project.imageUrl ? (
                      <img src={project.imageUrl} alt={project.title} loading="lazy" />
                    ) : (
                      <div className="project-placeholder mono">{project.title[0]}</div>
                    )}
                  </div>
                  <div className="project-info">
                    <div className="project-top">
                      <span className="tag">{project.category || "Project"}</span>
                    </div>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    {project.tags?.length > 0 && (
                      <div className="project-tags">
                        {project.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="tag">{tag}</span>
                        ))}
                      </div>
                    )}
                    <div className="project-links">
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer" className="project-link">
                          Live <ArrowUpRight size={12} />
                        </a>
                      )}
                      {project.repoUrl && (
                        <a href={project.repoUrl} target="_blank" rel="noreferrer" className="project-link">
                          Code <ArrowUpRight size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.section>
        )}

        {/* ─── Services ─── */}
        {services.length > 0 && (
          <motion.section className="section" {...fadeUp} transition={{ duration: 0.4, delay: 0.2 }}>
            <div className="section-header">
              <h2>Services</h2>
              <Link to="/services" className="section-link">
                All services <ArrowRight size={13} />
              </Link>
            </div>

            <div className="services-grid">
              {services.slice(0, 4).map((service, i) => (
                <div key={service._id || i} className="service-card">
                  <span className="service-icon">{service.icon || "→"}</span>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  {service.pricing && <span className="service-price mono">{service.pricing}</span>}
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ─── Testimonials ─── */}
        {testimonials.length > 0 && (
          <motion.section className="section" {...fadeUp} transition={{ duration: 0.4, delay: 0.3 }}>
            <div className="section-header">
              <h2>Testimonials</h2>
            </div>

            <div className="testimonial-grid">
              {testimonials.slice(0, 3).map((item, i) => (
                <div key={item._id || i} className="testimonial-card">
                  <div className="testimonial-stars">
                    {Array.from({ length: Math.min(item.rating || 5, 5) }).map((_, s) => (
                      <Star key={s} size={13} fill="var(--yellow)" stroke="none" />
                    ))}
                  </div>
                  <p className="testimonial-text">"{item.text}"</p>
                  <div className="testimonial-author">
                    {item.avatarUrl ? (
                      <img src={item.avatarUrl} alt={item.name} className="author-avatar" />
                    ) : (
                      <div className="author-avatar-placeholder">{item.name?.[0]}</div>
                    )}
                    <div>
                      <strong>{item.name}</strong>
                      <span>{[item.role, item.company].filter(Boolean).join(" · ")}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ─── CTA ─── */}
        <motion.section className="cta-section" {...fadeUp} transition={{ duration: 0.4, delay: 0.35 }}>
          <div className="cta-content">
            <h2>Let's work together</h2>
            <p>Have a project in mind? I'm available for freelance work and collaborations.</p>
            <Link to="/contact" className="btn btn-primary">
              Start a conversation <ArrowRight size={14} />
            </Link>
          </div>
        </motion.section>
      </div>

      <style>{`
        .home {
          display: flex;
          flex-direction: column;
          gap: 4rem;
        }

        /* ─── Hero ─── */
        .hero {
          padding: 2rem 0 0;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: clamp(2rem, 5vw, 4rem);
          align-items: center;
        }

        .hero-text {
          min-width: 0;
        }

        .hero-image-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .hero-image-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .hero-socials {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .hero-social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          color: var(--text-3);
          background: var(--surface);
          transition: all 0.15s;
        }

        .hero-social-link:hover {
          color: var(--text);
          border-color: var(--text-4);
          background: var(--bg-hover);
          transform: translateY(-2px);
        }

        .hero-image-frame {
          position: relative;
          width: clamp(140px, 18vw, 200px);
          height: clamp(140px, 18vw, 200px);
        }

        .hero-image {
          width: 100%;
          height: 100%;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--border);
          background: var(--bg-alt);
          position: relative;
          z-index: 1;
        }

        .hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .hero-image-wrapper:hover .hero-image img {
          transform: scale(1.03);
        }

        .image-decoration {
          position: absolute;
          inset: 6px;
          border-radius: 16px;
          border: 1px dashed var(--text-4);
          top: 10px;
          left: 10px;
          right: -4px;
          bottom: -4px;
          z-index: 0;
          transition: all 0.3s ease;
        }

        .hero-image-wrapper:hover .image-decoration {
          top: 8px;
          left: 8px;
          right: -6px;
          bottom: -6px;
          border-color: var(--text-3);
        }

        .hero-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 600;
          color: var(--text-4);
        }

        .image-label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.65rem;
          color: var(--text-3);
          letter-spacing: 0.02em;
        }

        .image-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--green);
          animation: blink 2s infinite;
        }

        .hero-status {
          margin-bottom: 1.5rem;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--green);
          background: var(--green-bg);
          border: 1px solid var(--green);
          border-radius: 20px;
          padding: 0.3rem 0.85rem;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--green);
          animation: blink 2s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .hero-title {
          font-size: clamp(2.5rem, 6vw, 3.5rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin-bottom: 0.5rem;
        }

        .hero-subtitle {
          font-size: 0.9rem;
          color: var(--text-3);
          margin-bottom: 1.25rem;
        }

        .hero-bio {
          font-size: 1.05rem;
          color: var(--text-2);
          line-height: 1.7;
          max-width: 560px;
          margin-bottom: 1.25rem;
        }

        .hero-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.75rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: var(--text-3);
        }

        .meta-link {
          text-decoration: none;
          transition: color 0.15s;
        }

        .meta-link:hover {
          color: var(--text);
        }

        .hero-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        /* ─── Sections ─── */
        .section {
          padding-top: 0;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border);
        }

        .section-header h2 {
          font-size: 1.1rem;
          font-weight: 600;
        }

        .section-link {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          color: var(--text-3);
          transition: color 0.15s;
        }

        .section-link:hover {
          color: var(--text);
        }

        /* ─── Projects ─── */
        .project-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .project-card {
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--surface);
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .project-card:hover {
          border-color: var(--text-4);
          box-shadow: var(--shadow-md);
        }

        .project-media {
          aspect-ratio: 16/9;
          background: var(--bg-alt);
          overflow: hidden;
        }

        .project-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .project-card:hover .project-media img {
          transform: scale(1.02);
        }

        .project-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          color: var(--text-4);
          font-weight: 600;
        }

        .project-info {
          padding: 1rem 1.25rem 1.25rem;
        }

        .project-top {
          margin-bottom: 0.5rem;
        }

        .project-info h3 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.35rem;
        }

        .project-info p {
          font-size: 0.8rem;
          color: var(--text-2);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .project-tags {
          display: flex;
          gap: 0.35rem;
          flex-wrap: wrap;
          margin-top: 0.75rem;
        }

        .project-links {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.75rem;
        }

        .project-link {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-3);
          transition: color 0.15s;
        }

        .project-link:hover {
          color: var(--text);
        }

        /* ─── Services ─── */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .service-card {
          padding: 1.25rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          background: var(--surface);
          transition: border-color 0.2s;
        }

        .service-card:hover {
          border-color: var(--text-4);
        }

        .service-icon {
          display: inline-block;
          font-size: 1.25rem;
          margin-bottom: 0.75rem;
        }

        .service-card h3 {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 0.35rem;
        }

        .service-card p {
          font-size: 0.8rem;
          color: var(--text-2);
          line-height: 1.5;
        }

        .service-price {
          display: inline-block;
          margin-top: 0.75rem;
          font-size: 0.75rem;
          color: var(--green);
          font-weight: 500;
        }

        /* ─── Testimonials ─── */
        .testimonial-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }

        .testimonial-card {
          padding: 1.25rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          background: var(--surface);
        }

        .testimonial-stars {
          display: flex;
          gap: 0.15rem;
          margin-bottom: 0.75rem;
        }

        .testimonial-text {
          font-size: 0.85rem;
          color: var(--text-2);
          line-height: 1.6;
          margin-bottom: 1rem;
          font-style: italic;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border);
        }

        .testimonial-author strong {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text);
        }

        .testimonial-author span {
          font-size: 0.7rem;
          color: var(--text-3);
        }

        .author-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }

        .author-avatar-placeholder {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--bg-alt);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-3);
        }

        /* ─── CTA ─── */
        .cta-section {
          padding: 2.5rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          background: var(--bg-alt);
          text-align: center;
        }

        .cta-content h2 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .cta-content p {
          color: var(--text-2);
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }

        /* ─── Responsive ─── */
        @media (max-width: 768px) {
          .home {
            gap: 3rem;
          }

          .hero-content {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .hero-image-wrapper {
            order: -1;
            align-items: center;
          }

          .hero-image-row {
            gap: 0.75rem;
          }

          .hero-image-frame {
            width: 110px;
            height: 110px;
          }

          .hero-socials {
            flex-direction: column;
            gap: 0.4rem;
          }

          .hero-social-link {
            width: 30px;
            height: 30px;
          }

          .image-decoration {
            top: 6px;
            left: 6px;
            right: -3px;
            bottom: -3px;
          }

          .hero-text {
            text-align: center;
          }

          .hero-meta {
            justify-content: center;
          }

          .hero-actions {
            justify-content: center;
          }

          .hero-status {
            display: flex;
            justify-content: center;
          }

          .project-grid,
          .services-grid {
            grid-template-columns: 1fr;
          }

          .cta-section {
            padding: 1.75rem;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .hero-image-frame {
            width: 160px;
            height: 160px;
          }
        }
      `}</style>
    </>
  );
}
