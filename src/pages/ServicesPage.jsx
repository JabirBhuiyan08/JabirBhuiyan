import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Play, Mail } from "lucide-react";
import api from "../lib/api";

export default function ServicesPage() {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: () => api.get("/api/services").then(r => r.data).catch(() => []),
  });

  return (
    <>
      <Helmet><title>Services — Portfolio</title></Helmet>

      <div className="services-page">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <header className="page-header">
            <h1>Services</h1>
            <p className="text-2">What I can help you build.</p>
          </header>

          {isLoading ? (
            <p className="text-3">Loading...</p>
          ) : services.length === 0 ? (
            <p className="text-3">No services listed yet.</p>
          ) : (
            <div className="services-list">
              {services.map((s, i) => (
                <motion.div
                  key={s._id || i}
                  className="service-item"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {s.imageUrl && (
                    <div className="service-image">
                      <img src={s.imageUrl} alt={s.title || ""} loading="lazy" />
                    </div>
                  )}
                  <div className="service-content">
                    <div className="service-header">
                      <span className="service-icon">{s.icon || "→"}</span>
                      <div className="service-text">
                        <h3>{s.title || "Service"}</h3>
                        <p>{s.description || ""}</p>
                      </div>
                    </div>
                    <div className="service-footer">
                      {s.pricing && <span className="service-price mono">{s.pricing}</span>}
                      {s.videoUrl && (
                        <a href={s.videoUrl} target="_blank" rel="noreferrer" className="service-link">
                          <Play size={12} /> Watch
                        </a>
                      )}
                      {s.contact && (
                        <span className="service-contact">
                          <Mail size={12} /> {s.contact}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <style>{`
        .services-page .page-header {
          margin-bottom: 1.5rem;
        }

        .services-page .page-header h1 {
          margin-bottom: 0.25rem;
        }

        .services-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .service-item {
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--surface);
          transition: border-color 0.2s;
        }

        .service-item:hover {
          border-color: var(--text-4);
        }

        .service-image {
          width: 100%;
          height: 160px;
          overflow: hidden;
        }

        .service-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .service-content {
          padding: 1.25rem;
        }

        .service-header {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .service-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
          padding-top: 0.1rem;
        }

        .service-text h3 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.3rem;
        }

        .service-text p {
          font-size: 0.8rem;
          color: var(--text-2);
          line-height: 1.5;
        }

        .service-footer {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          align-items: center;
          margin-top: 1rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border);
        }

        .service-price {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--green);
          background: var(--green-bg);
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
        }

        .service-link {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          color: var(--text-3);
          transition: color 0.15s;
        }

        .service-link:hover {
          color: var(--text);
        }

        .service-contact {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          color: var(--text-3);
        }
      `}</style>
    </>
  );
}
