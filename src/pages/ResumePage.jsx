import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import api from "../lib/api";

export default function ResumePage() {
  const { data: resume = { experience: [], education: [], skills: [] } } = useQuery({
    queryKey: ["resume"],
    queryFn: () => api.get("/api/resume").then(r => r.data),
  });

  return (
    <>
      <Helmet><title>Resume — Portfolio</title></Helmet>

      <div className="resume-page">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <header className="page-header">
            <h1>Resume</h1>
            <p className="text-2">Experience, education, and skills.</p>
          </header>

          {/* Experience */}
          <section className="resume-section">
            <h2 className="resume-section-title">Experience</h2>
            {resume.experience?.length === 0 ? (
              <p className="text-3">Nothing added yet.</p>
            ) : (
              <div className="timeline">
                {resume.experience?.map((e, i) => (
                  <motion.div
                    key={i}
                    className="timeline-item"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="timeline-header">
                      <div>
                        <h3>{e.role}</h3>
                        <p className="timeline-company">{e.company}</p>
                      </div>
                      <span className="timeline-date mono">
                        {e.startDate} — {e.current ? "Present" : e.endDate}
                      </span>
                    </div>
                    {e.description && <p className="timeline-desc">{e.description}</p>}
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* Education */}
          <section className="resume-section">
            <h2 className="resume-section-title">Education</h2>
            {resume.education?.length === 0 ? (
              <p className="text-3">Nothing added yet.</p>
            ) : (
              <div className="timeline">
                {resume.education?.map((e, i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-header">
                      <div>
                        <h3>{e.degree} in {e.field}</h3>
                        <p className="timeline-company">{e.institution}</p>
                      </div>
                      <span className="timeline-date mono">
                        {e.startDate} — {e.endDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Skills */}
          <section className="resume-section">
            <h2 className="resume-section-title">Skills</h2>
            {resume.skills?.length === 0 ? (
              <p className="text-3">Nothing added yet.</p>
            ) : (
              <div className="skills-grid">
                {resume.skills?.map((g, i) => (
                  <div key={i} className="skill-group">
                    <h4 className="skill-category mono">{g.category}</h4>
                    <div className="skill-tags">
                      {g.items?.map(sk => (
                        <span key={sk} className="skill-tag">{sk}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </motion.div>
      </div>

      <style>{`
        .resume-page .page-header {
          margin-bottom: 2rem;
        }

        .resume-page .page-header h1 {
          margin-bottom: 0.25rem;
        }

        .resume-section {
          margin-bottom: 2.5rem;
        }

        .resume-section-title {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border);
        }

        .timeline {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .timeline-item {
          padding: 1rem 0;
          border-bottom: 1px solid var(--border-light);
        }

        .timeline-item:last-child {
          border-bottom: none;
        }

        .timeline-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .timeline-header h3 {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 0.15rem;
        }

        .timeline-company {
          font-size: 0.8rem;
          color: var(--text-2);
        }

        .timeline-date {
          font-size: 0.7rem;
          color: var(--text-3);
          white-space: nowrap;
          background: var(--bg-alt);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          border: 1px solid var(--border);
        }

        .timeline-desc {
          font-size: 0.8rem;
          color: var(--text-2);
          line-height: 1.6;
          margin-top: 0.5rem;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.25rem;
        }

        .skill-group {
          padding: 1rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          background: var(--surface);
        }

        .skill-category {
          font-size: 0.7rem;
          font-weight: 500;
          color: var(--text-3);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
        }

        .skill-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }

        .skill-tag {
          font-size: 0.75rem;
          padding: 0.25rem 0.6rem;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          color: var(--text-2);
          background: var(--bg-alt);
          transition: all 0.15s;
        }

        .skill-tag:hover {
          border-color: var(--accent);
          color: var(--text);
          background: var(--accent-muted);
        }
      `}</style>
    </>
  );
}
