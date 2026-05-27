import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Send, CheckCircle, Mail, MapPin, Phone, Clock } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const { data: profile = {} } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get("/api/profile").then(r => r.data),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setErr("");
    try {
      await api.post("/api/contact", data);
      setSent(true);
      reset();
    } catch (e) {
      setErr(e.response?.data?.error || "Failed to send message. Please try again.");
    }
  };

  const contactItems = [
    { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { icon: Phone, label: "Phone", value: profile.phone, href: `tel:${profile.phone}` },
    { icon: MapPin, label: "Location", value: profile.location, href: null },
    { icon: Clock, label: "Response", value: "Within 24 hours", href: null },
  ].filter(item => item.value);

  return (
    <>
      <Helmet>
        <title>Contact — {profile.name || "Portfolio"}</title>
        <meta name="description" content="Get in touch for collaborations, projects, or just to say hello." />
      </Helmet>

      <div className="contact-page">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <header className="page-header">
            <h1>Contact</h1>
            <p className="text-2">Have a project in mind? Let's talk.</p>
          </header>

          <div className="contact-layout">
            {/* Info */}
            <div className="contact-info">
              <div className="info-cards">
                {contactItems.map(item => (
                  <div key={item.label} className="info-card">
                    <item.icon size={16} className="info-icon" />
                    <div>
                      <span className="info-label mono">{item.label}</span>
                      {item.href ? (
                        <a href={item.href} className="info-value">{item.value}</a>
                      ) : (
                        <span className="info-value">{item.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {profile.openToWork && (
                <div className="availability-badge">
                  <span className="avail-dot" />
                  Currently available for new projects
                </div>
              )}
            </div>

            {/* Form */}
            <div className="contact-form-wrapper">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="success-state"
                >
                  <CheckCircle size={40} />
                  <h3>Message sent</h3>
                  <p>Thanks for reaching out. I'll get back to you soon.</p>
                  <button onClick={() => setSent(false)} className="btn btn-secondary">
                    Send another
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Name <span>*</span></label>
                      <input
                        {...register("name", { required: "Name is required" })}
                        type="text"
                        placeholder="Your name"
                        className={`field-input ${errors.name ? "error" : ""}`}
                      />
                      {errors.name && <span className="field-error">{errors.name.message}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email <span>*</span></label>
                      <input
                        {...register("email", {
                          required: "Email is required",
                          pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
                        })}
                        type="email"
                        placeholder="you@example.com"
                        className={`field-input ${errors.email ? "error" : ""}`}
                      />
                      {errors.email && <span className="field-error">{errors.email.message}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input
                      {...register("subject")}
                      type="text"
                      placeholder="What's this about?"
                      className="field-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message <span>*</span></label>
                    <textarea
                      {...register("message", {
                        required: "Message is required",
                        minLength: { value: 10, message: "At least 10 characters" },
                      })}
                      rows={5}
                      placeholder="Tell me about your project..."
                      className={`field-input ${errors.message ? "error" : ""}`}
                      style={{ resize: "vertical", minHeight: "120px" }}
                    />
                    {errors.message && <span className="field-error">{errors.message.message}</span>}
                  </div>

                  {err && <div className="form-error">{err}</div>}

                  <button type="submit" disabled={isSubmitting} className="btn btn-primary submit-btn">
                    {isSubmitting ? "Sending..." : <><Send size={14} /> Send message</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .contact-page .page-header {
          margin-bottom: 2rem;
        }

        .contact-page .page-header h1 {
          margin-bottom: 0.25rem;
        }

        .contact-layout {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 2rem;
          align-items: start;
        }

        .info-cards {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .info-card {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.85rem 1rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          background: var(--surface);
        }

        .info-icon {
          color: var(--text-3);
          flex-shrink: 0;
        }

        .info-label {
          display: block;
          font-size: 0.65rem;
          color: var(--text-3);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.1rem;
        }

        .info-value {
          display: block;
          font-size: 0.8rem;
          color: var(--text);
          font-weight: 500;
        }

        a.info-value:hover {
          text-decoration: underline;
        }

        .availability-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
          padding: 0.65rem 0.85rem;
          font-size: 0.75rem;
          color: var(--green);
          background: var(--green-bg);
          border: 1px solid var(--green);
          border-radius: var(--radius-lg);
        }

        .avail-dot {
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

        .contact-form-wrapper {
          padding: 1.5rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          background: var(--surface);
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .form-label {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-2);
        }

        .form-label span {
          color: var(--red);
        }

        .field-input.error {
          border-color: var(--red);
        }

        .field-error {
          font-size: 0.7rem;
          color: var(--red);
        }

        .form-error {
          padding: 0.6rem 0.85rem;
          background: var(--red-bg);
          border: 1px solid var(--red);
          border-radius: var(--radius);
          color: var(--red);
          font-size: 0.8rem;
        }

        .submit-btn {
          align-self: flex-start;
          margin-top: 0.25rem;
        }

        .success-state {
          text-align: center;
          padding: 2rem 1rem;
        }

        .success-state svg {
          color: var(--green);
          margin-bottom: 1rem;
        }

        .success-state h3 {
          font-size: 1.25rem;
          margin-bottom: 0.35rem;
        }

        .success-state p {
          color: var(--text-2);
          font-size: 0.85rem;
          margin-bottom: 1.25rem;
        }

        @media (max-width: 768px) {
          .contact-layout {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
