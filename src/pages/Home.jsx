import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Briefcase,
  CheckCircle2,
  Code2,
  Layers,
  Mail,
  MapPin,
  Quote,
  Sparkles,
  Star,
  ChevronRight,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import api from "../lib/api";

const text = {
  body: "var(--text-secondary)",
  muted: "var(--text-muted)",
  title: "var(--text)",
  border: "var(--border)",
  surface: "var(--surface)",
  bgAlt: "var(--bg-alt)",
  accent: "var(--accent)",
};

function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 100,
        scaleX,
        transformOrigin: "0%",
        background: "var(--accent)",
      }}
    />
  );
}

function Eyebrow({ icon: Icon, children }) {
  return (
    <span className="home-eyebrow">
      {Icon && <Icon size={14} />}
      {children}
    </span>
  );
}

function SectionHeader({ icon, label, title, actionTo, actionLabel }) {
  return (
    <div className="home-section-head">
      <div>
        <Eyebrow icon={icon}>{label}</Eyebrow>
        <h2>{title}</h2>
      </div>
      {actionTo && (
        <Link to={actionTo} className="home-text-link">
          {actionLabel}
          <ChevronRight size={15} />
        </Link>
      )}
    </div>
  );
}

function Hero({ profile }) {
  const initials = (profile.name || "Portfolio")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  const buildingWith = ["Next.js", "PostgreSQL", "Prisma", "TanStack Query", "TanStack Table"];
  const experiencedWith = ["MERN", "React", "Node.js", "Express", "MongoDB"];

  return (
    <section className="home-hero">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="home-hero-copy"
      >
        <Eyebrow icon={Sparkles}>
          {profile.openToWork ? "✨ Available for selected work" : "✨ Independent portfolio"}
        </Eyebrow>

        <h1>
          {profile.name || "Creative Developer"}
          <span>{profile.profession ? profile.profession.split("|")[0].trim() : "Digital product builder"}</span>
        </h1>

        <p className="home-lede">
          {profile.bio || profile.tagline || "I design and build polished web experiences with clear strategy, careful interfaces, and production-ready code."}
        </p>

        <div className="home-hero-meta">
          {profile.location && (
            <span>
              <MapPin size={15} />
              {profile.location}
            </span>
          )}
          {profile.email && (
            <a href={`mailto:${profile.email}`}>
              <Mail size={15} />
              {profile.email}
            </a>
          )}
        </div>

        <div className="home-actions">
          <Link className="home-btn home-btn-primary" to="/works">
            See the work
            <ArrowUpRight size={16} />
          </Link>
          <Link className="home-btn home-btn-secondary" to="/contact">
            Start a project
          </Link>
        </div>
      </motion.div>

      <motion.aside
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="home-identity-panel"
      >
        <div className="home-portrait">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.name || "Profile"} />
          ) : (
            <span>{initials || "P"}</span>
          )}
        </div>

        <div className="home-status-row">
          <span className="is-open" />
          Currently leveling up 🚀
        </div>

        <div className="home-focus-areas">
          <p className="home-focus-label">
            <Sparkles size={12} />
            Currently building with
          </p>
          <div className="home-tech-tags">
            {buildingWith.map((tech) => (
              <span key={tech} className="learning-tag">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="home-focus-areas">
          <p className="home-focus-label">
            <CheckCircle2 size={12} />
            MERN stack foundation
          </p>
          <div className="home-tech-tags">
            {experiencedWith.map((tech) => (
              <span key={tech} className="experienced-tag">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <Link to="/contact" className="home-mini-contact">
          <Mail size={14} />
          Let's build something
          <ChevronRight size={12} />
        </Link>
      </motion.aside>
    </section>
  );
}

function FeaturedProjects({ projects }) {
  const list = (projects.filter((p) => p.featured).length ? projects.filter((p) => p.featured) : projects).slice(0, 3);
  if (!list.length) return null;

  return (
    <section className="home-section">
      <SectionHeader icon={Briefcase} label="Selected work" title="Recent projects with measurable craft." actionTo="/works" actionLabel="View all" />

      <div className="home-project-grid">
        {list.map((project, index) => (
          <motion.article
            key={project._id || project.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="home-project-card"
          >
            <div className="home-project-media">
              {project.imageUrl ? (
                <img src={project.imageUrl} alt={project.title} loading="lazy" />
              ) : (
                <Briefcase size={40} />
              )}
            </div>
            <div className="home-project-body">
              <div className="home-card-topline">
                <span>{project.category || "Project"}</span>
                {project.featured && <Award size={14} />}
              </div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              {project.tags?.length > 0 && (
                <div className="home-tags">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              )}
              <div className="home-project-links">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer">
                    Live Demo
                    <ArrowUpRight size={13} />
                  </a>
                )}
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" rel="noreferrer">
                    Source Code
                    <ArrowUpRight size={13} />
                  </a>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function ServicesPreview({ services }) {
  if (!services?.length) return null;

  return (
    <section className="home-section home-band">
      <SectionHeader icon={Layers} label="Services" title="Focused help across the product surface." actionTo="/services" actionLabel="Explore services" />

      <div className="home-service-list">
        {services.slice(0, 4).map((service, index) => (
          <motion.article
            key={service._id || service.title}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            className="home-service-row"
          >
            <span className="home-service-icon">{service.icon || <Code2 size={18} />}</span>
            <div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
            {service.pricing && <strong>{service.pricing}</strong>}
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Testimonials({ testimonials }) {
  const list = testimonials.slice(0, 2);
  if (!list.length) return null;

  return (
    <section className="home-section">
      <SectionHeader icon={Quote} label="Client notes" title="Clear communication, reliable delivery." />

      <div className="home-testimonial-grid">
        {list.map((item, index) => (
          <motion.article
            key={item._id || item.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            className="home-testimonial"
          >
            <div className="home-stars">
              {Array.from({ length: Math.min(item.rating || 5, 5) }).map((_, star) => (
                <Star key={star} size={14} fill="#b7791f" stroke="none" />
              ))}
            </div>
            <p>"{item.text}"</p>
            <div className="home-client">
              {item.avatarUrl ? <img src={item.avatarUrl} alt={item.name} loading="lazy" /> : <span>{item.name?.[0] || "C"}</span>}
              <div>
                <strong>{item.name}</strong>
                <small>{[item.role, item.company].filter(Boolean).join(", ")}</small>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function FinalCTA({ profile }) {
  return (
    <section className="home-cta">
      <div>
        <Eyebrow icon={Mail}>Next step</Eyebrow>
        <h2>Have a product, portfolio, or web experience that needs sharper execution?</h2>
        <p>{profile.email ? "Send the brief, the messy idea, or the almost-there build. I will help turn it into a clear path forward." : "Share the idea and I will help turn it into a clear path forward."}</p>
      </div>
      <Link className="home-btn home-btn-primary" to="/contact">
        Contact me
        <ArrowUpRight size={16} />
      </Link>
    </section>
  );
}

export default function Home() {
  const { data: profile = {} } = useQuery({ queryKey: ["profile"], queryFn: () => api.get("/api/profile").then((r) => r.data) });
  const { data: settings = {} } = useQuery({ queryKey: ["settings"], queryFn: () => api.get("/api/settings").then((r) => r.data) });
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => api.get("/api/projects").then((r) => r.data) });
  const { data: testimonials = [] } = useQuery({ queryKey: ["testimonials"], queryFn: () => api.get("/api/testimonials").then((r) => r.data) });
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: () => api.get("/api/services").then((r) => r.data) });

  return (
    <>
      <Helmet>
        <title>{profile.name || settings.siteTitle || "Portfolio"}</title>
        <meta name="description" content={(profile.bio || profile.tagline || settings.tagline || "").slice(0, 155)} />
      </Helmet>

      <ProgressBar />

      <main className="home-page">
        <Hero profile={profile} />
        <FeaturedProjects projects={projects} />
        <ServicesPreview services={services} />
        <Testimonials testimonials={testimonials} />
        <FinalCTA profile={profile} />
      </main>

      <style>{`
        .home-page {
          color: ${text.title};
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .home-hero {
          display: grid;
          grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.6fr);
          gap: 2rem;
          align-items: center;
          min-height: 480px;
          padding: 3rem 0 4rem;
        }

        .home-hero-copy {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 0;
        }

        .home-eyebrow {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          gap: 0.5rem;
          color: ${text.accent};
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 1.25rem;
          padding: 0.25rem 0.75rem;
          background: rgba(var(--accent-rgb), 0.08);
          border-radius: 40px;
          transition: all 0.2s ease;
        }

        .home-eyebrow:hover {
          background: rgba(var(--accent-rgb), 0.15);
          transform: translateX(2px);
        }

        .home-hero h1 {
          max-width: 880px;
          font-size: 4rem;
          line-height: 1.05;
          margin: 0;
          font-weight: 700;
        }

        .home-hero h1 span {
          display: block;
          color: ${text.accent};
          font-family: var(--font-body);
          font-size: 1.15rem;
          font-weight: 500;
          line-height: 1.4;
          margin-top: 0.75rem;
          opacity: 0.85;
        }

        .home-lede {
          max-width: 680px;
          color: ${text.body};
          font-size: 1.1rem;
          line-height: 1.7;
          margin: 1.25rem 0 0;
          transition: color 0.2s ease;
        }

        .home-hero-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem 1.5rem;
          margin-top: 1.25rem;
          color: ${text.muted};
          font-size: 0.9rem;
        }

        .home-hero-meta span,
        .home-hero-meta a {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          color: ${text.muted};
          transition: all 0.2s ease;
        }

        .home-hero-meta a:hover {
          color: ${text.accent};
          transform: translateX(2px);
        }

        .home-hero-meta span:hover {
          color: ${text.body};
          transform: translateX(2px);
        }

        .home-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 2rem;
        }

        .home-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          min-height: 44px;
          border-radius: 40px;
          padding: 0.7rem 1.35rem;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.25s ease;
          cursor: pointer;
          text-decoration: none;
        }

        .home-btn:hover {
          transform: translateY(-3px);
        }

        .home-btn-primary {
          background: ${text.accent};
          color: #ffffff;
          border: none;
        }

        .home-btn-primary:hover {
          background: var(--accent-light);
          color: #ffffff;
          box-shadow: 0 8px 20px rgba(var(--accent-rgb), 0.3);
          gap: 0.8rem;
        }

        .home-btn-secondary {
          background: transparent;
          color: ${text.title};
          border: 1px solid ${text.border};
        }

        .home-btn-secondary:hover {
          border-color: ${text.accent};
          background: rgba(var(--accent-rgb), 0.04);
          color: ${text.accent};
          gap: 0.8rem;
        }

        .home-identity-panel {
          align-self: center;
          background: ${text.surface};
          border: 1px solid ${text.border};
          border-radius: 28px;
          padding: 1.25rem;
          transition: all 0.3s cubic-bezier(0.2, 0, 0, 1);
          max-width: 300px;
          margin-left: auto;
        }

        .home-identity-panel:hover {
          transform: translateY(-5px);
          border-color: ${text.accent};
          box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.12);
        }

.home-portrait {
  aspect-ratio: 1 / 1;
  width: 100%;
  max-width: 200px;
  margin: 0 auto;
  background: linear-gradient(135deg, ${text.bgAlt}, ${text.surface});
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${text.muted};
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 600;
  transition: transform 0.3s ease;
}

        .home-identity-panel:hover .home-portrait {
          transform: scale(1.02);
        }

        .home-portrait img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .home-identity-panel:hover .home-portrait img {
          transform: scale(1.05);
        }

        .home-status-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: ${text.body};
          font-size: 0.8rem;
          font-weight: 600;
          margin-top: 1rem;
          padding: 0.5rem 0;
          background: rgba(var(--accent-rgb), 0.05);
          border-radius: 40px;
          transition: all 0.2s ease;
        }

        .home-identity-panel:hover .home-status-row {
          background: rgba(var(--accent-rgb), 0.1);
        }

        .home-status-row span {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .home-focus-areas {
          margin-top: 1rem;
          padding-top: 0.75rem;
          border-top: 1px solid ${text.border};
          transition: all 0.2s ease;
        }

        .home-focus-areas:first-of-type {
          border-top: none;
          padding-top: 0;
          margin-top: 0.75rem;
        }

        .home-identity-panel:hover .home-focus-areas {
          border-top-color: rgba(var(--accent-rgb), 0.3);
        }

        .home-focus-label {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.7rem;
          color: ${text.muted};
          margin: 0 0 0.6rem 0;
          letter-spacing: 0.3px;
          font-weight: 500;
        }

        .home-tech-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .home-tech-tags span {
          border-radius: 40px;
          padding: 0.2rem 0.65rem;
          font-size: 0.7rem;
          font-weight: 500;
          transition: all 0.2s ease;
          cursor: default;
        }

        .home-tech-tags span:hover {
          transform: translateY(-2px);
        }

        .learning-tag {
          background: rgba(var(--accent-rgb), 0.12);
          border: 1px solid ${text.accent};
          color: ${text.accent};
        }

        .learning-tag:hover {
          background: rgba(var(--accent-rgb), 0.2);
          border-color: var(--accent-light);
        }

        .experienced-tag {
          background: ${text.bgAlt};
          border: 1px solid ${text.border};
          color: ${text.body};
        }

        .experienced-tag:hover {
          border-color: #10b981;
          color: #10b981;
        }

        .home-mini-contact {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1.25rem;
          padding: 0.65rem;
          background: ${text.accent};
          color: white;
          border-radius: 40px;
          font-size: 0.75rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .home-mini-contact:hover {
          transform: translateY(-2px);
          filter: brightness(1.05);
          gap: 0.7rem;
          box-shadow: 0 6px 15px rgba(var(--accent-rgb), 0.3);
        }

        .home-section {
          padding: 4rem 0;
          border-bottom: 1px solid ${text.border};
        }

        .home-band {
          margin: 0 -1.5rem;
          padding: 4rem 1.5rem;
          background: ${text.bgAlt};
          border-radius: 0;
        }

        .home-section-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .home-section-head h2 {
          max-width: 680px;
          font-size: 2rem;
          line-height: 1.2;
          margin: 0.5rem 0 0;
          font-weight: 600;
        }

        .home-text-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          color: ${text.accent};
          font-size: 0.85rem;
          font-weight: 500;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .home-text-link:hover {
          gap: 0.7rem;
          transform: translateX(3px);
        }

        .home-project-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .home-project-card {
          overflow: hidden;
          border: 1px solid ${text.border};
          border-radius: 24px;
          background: ${text.surface};
          transition: all 0.35s cubic-bezier(0.2, 0, 0, 1);
          cursor: pointer;
        }

        .home-project-card:hover {
          transform: translateY(-8px);
          border-color: ${text.accent};
          box-shadow: 0 25px 40px -15px rgba(0, 0, 0, 0.15);
        }

        .home-project-media {
          aspect-ratio: 16 / 10;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${text.bgAlt};
          color: ${text.muted};
          overflow: hidden;
        }

        .home-project-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .home-project-card:hover .home-project-media img {
          transform: scale(1.06);
        }

        .home-project-body {
          padding: 1.25rem;
        }

        .home-card-topline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          color: ${text.muted};
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.75rem;
        }

        .home-card-topline svg {
          color: #b7791f;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .home-project-card:hover .home-card-topline svg {
          transform: scale(1.1);
        }

        .home-project-body h3 {
          font-size: 1.2rem;
          line-height: 1.3;
          margin: 0 0 0.5rem;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .home-project-card:hover .home-project-body h3 {
          color: ${text.accent};
        }

        .home-project-body p {
          color: ${text.body};
          font-size: 0.85rem;
          line-height: 1.6;
          margin: 0;
        }

        .home-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .home-tags span {
          border: 1px solid ${text.border};
          border-radius: 40px;
          background: ${text.bgAlt};
          color: ${text.body};
          padding: 0.2rem 0.6rem;
          font-size: 0.65rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .home-tags span:hover {
          border-color: ${text.accent};
          color: ${text.accent};
          transform: translateY(-1px);
        }

        .home-project-links {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .home-project-links a {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: ${text.accent};
          font-size: 0.75rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .home-project-links a:hover {
          gap: 0.55rem;
          transform: translateX(2px);
        }

        .home-service-list {
          display: grid;
          gap: 1rem;
        }

        .home-service-row {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 1.25rem;
          border: 1px solid ${text.border};
          border-radius: 20px;
          background: ${text.surface};
          padding: 1.1rem 1.25rem;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .home-service-row:hover {
          border-color: ${text.accent};
          transform: translateX(6px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
        }

        .home-service-icon {
          width: 2.5rem;
          height: 2.5rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid ${text.border};
          border-radius: 14px;
          background: ${text.bgAlt};
          color: ${text.accent};
          font-size: 1rem;
          transition: all 0.25s ease;
        }

        .home-service-row:hover .home-service-icon {
          border-color: ${text.accent};
          transform: scale(1.05) rotate(3deg);
        }

        .home-service-row h3 {
          font-size: 1.2rem;
          line-height: 1.3;
          margin: 0 0 0.5rem;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .home-service-row:hover h3 {
          color: ${text.accent};
        }

        .home-service-row p {
          color: ${text.body};
          font-size: 0.85rem;
          line-height: 1.6;
          margin: 0;
        }

        .home-service-row strong {
          color: ${text.accent};
          font-size: 0.8rem;
          font-weight: 600;
          white-space: nowrap;
          background: rgba(var(--accent-rgb), 0.08);
          padding: 0.25rem 0.75rem;
          border-radius: 40px;
          transition: all 0.2s ease;
        }

        .home-service-row:hover strong {
          background: rgba(var(--accent-rgb), 0.15);
          transform: scale(1.02);
        }

        .home-testimonial-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .home-testimonial {
          padding: 1.35rem;
          overflow: hidden;
          border: 1px solid ${text.border};
          border-radius: 24px;
          background: ${text.surface};
          transition: all 0.35s ease;
          cursor: pointer;
        }

        .home-testimonial:hover {
          transform: translateY(-6px);
          border-color: ${text.accent};
          box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.1);
        }

        .home-stars {
          display: flex;
          gap: 0.2rem;
          margin-bottom: 0.9rem;
        }

        .home-stars svg {
          transition: transform 0.2s ease;
        }

        .home-testimonial:hover .home-stars svg {
          transform: scale(1.05);
        }

        .home-testimonial p {
          color: ${text.body};
          font-size: 0.95rem;
          line-height: 1.65;
          margin: 0 0 1.25rem;
          font-style: normal;
          transition: color 0.2s ease;
        }

        .home-testimonial:hover p {
          color: ${text.title};
        }

        .home-client {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-top: 1px solid ${text.border};
          padding-top: 0.9rem;
          transition: border-color 0.2s ease;
        }

        .home-testimonial:hover .home-client {
          border-top-color: rgba(var(--accent-rgb), 0.3);
        }

        .home-client img,
        .home-client > span {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .home-testimonial:hover .home-client img,
        .home-testimonial:hover .home-client > span {
          transform: scale(1.05);
        }

        .home-client img {
          object-fit: cover;
        }

        .home-client > span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: ${text.bgAlt};
          color: ${text.muted};
          font-weight: 600;
          font-size: 1rem;
        }

        .home-client strong {
          display: block;
          font-size: 0.85rem;
          margin-bottom: 0.15rem;
          transition: color 0.2s ease;
        }

        .home-testimonial:hover .home-client strong {
          color: ${text.accent};
        }

        .home-client small {
          color: ${text.muted};
          font-size: 0.7rem;
        }

        /* CTA Section */
        .home-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          padding: 2.5rem;
          margin: 4rem 0 3rem;
          border: 1px solid ${text.border};
          border-radius: 28px;
          background: linear-gradient(135deg, ${text.surface}, ${text.bgAlt});
          transition: all 0.35s ease;
        }

        .home-cta:hover {
          transform: translateY(-6px);
          border-color: ${text.accent};
          box-shadow: 0 25px 45px -15px rgba(0, 0, 0, 0.12);
        }

        .home-cta h2 {
          max-width: 680px;
          font-size: 1.6rem;
          line-height: 1.25;
          margin: 0.75rem 0 0;
          font-weight: 700;
          transition: color 0.2s ease;
        }

        .home-cta:hover h2 {
          color: ${text.accent};
        }

        .home-cta p {
          max-width: 600px;
          color: ${text.body};
          margin: 0.75rem 0 0;
          line-height: 1.65;
          font-size: 0.95rem;
        }

        .home-cta .home-btn-primary {
          background: ${text.accent};
          color: #ffffff;
          border: none;
          padding: 0.85rem 1.75rem;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: 40px;
          white-space: nowrap;
          transition: all 0.25s ease;
        }

        .home-cta .home-btn-primary:hover {
          background: var(--accent-light);
          color: #ffffff;
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(var(--accent-rgb), 0.35);
          gap: 0.8rem;
        }

        @media (max-width: 1180px) {
          .home-hero {
            grid-template-columns: 1fr;
            min-height: 0;
            gap: 1.5rem;
            padding: 2rem 0 3rem;
          }

          .home-identity-panel {
            max-width: 320px;
            margin: 0 auto;
            width: 100%;
          }

          .home-project-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 760px) {
          .home-page {
            padding: 0 1rem;
          }

          .home-hero h1 {
            font-size: 2.4rem;
          }

          .home-hero h1 span {
            font-size: 1rem;
          }

          .home-lede {
            font-size: 0.95rem;
          }

          .home-actions {
            flex-direction: column;
            width: 100%;
          }

          .home-btn {
            width: 100%;
            justify-content: center;
          }

          .home-project-grid,
          .home-testimonial-grid {
            grid-template-columns: 1fr;
          }

          .home-section {
            padding: 2.5rem 0;
          }

          .home-band {
            padding: 2.5rem 1rem;
            margin: 0 -1rem;
          }

          .home-section-head {
            flex-direction: column;
            align-items: flex-start;
          }

          .home-section-head h2,
          .home-cta h2 {
            font-size: 1.5rem;
          }

          .home-service-row {
            grid-template-columns: auto 1fr;
          }

          .home-service-row strong {
            grid-column: 2;
            justify-self: start;
            margin-top: 0.5rem;
          }

          .home-cta {
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
            padding: 1.75rem;
          }

          .home-cta .home-btn-primary {
            width: auto;
            margin-top: 0.5rem;
          }
        }

        @media (max-width: 480px) {
          .home-hero h1 {
            font-size: 2rem;
          }

          .home-portrait {
            max-width: 140px;
          }

          .home-cta {
            padding: 1.25rem;
          }

          .home-cta h2 {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </>
  );
}