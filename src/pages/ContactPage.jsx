import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Send, CheckCircle, Mail, MapPin, Phone, User, MessageSquare, Sparkles, Clock } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const { data: profile = {} } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get("/api/profile").then((r) => r.data),
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
    { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}`, color: "#3b82f6", bg: "#3b82f615" },
    { icon: Phone, label: "Phone", value: profile.phone, href: `tel:${profile.phone}`, color: "#10b981", bg: "#10b98115" },
    { icon: MapPin, label: "Location", value: profile.location, href: null, color: "#f59e0b", bg: "#f59e0b15" },
  ].filter((item) => item.value);

  return (
    <>
      <Helmet>
        <title>Contact — {profile.name || "Portfolio"}</title>
        <meta name="description" content="Get in touch for collaborations, projects, or just to say hello." />
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="contact-page"
      >
        {/* Hero Section */}
        <motion.div variants={fadeUp} initial="initial" animate="animate" className="contact-header">
          <div className="contact-badge">
            <Sparkles size={14} />
            Let's connect
          </div>
          <h1 className="contact-title">
            Let's work<br />
            <span>together</span>
          </h1>
          <p className="contact-description">
            Have a project in mind or just want to chat? I'm always excited to hear about new ideas and opportunities.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="contact-container">
          {/* Contact Info Cards */}
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="contact-info-grid"
          >
            {contactItems.map((item) => (
              <motion.a
                key={item.label}
                variants={fadeUp}
                href={item.href}
                className="contact-card"
                style={{ textDecoration: item.href ? "none" : "none", cursor: item.href ? "pointer" : "default" }}
              >
                <div className="contact-card-icon" style={{ background: item.bg }}>
                  <item.icon size={22} style={{ color: item.color }} />
                </div>
                <div className="contact-card-content">
                  <span className="contact-card-label">{item.label}</span>
                  <span className="contact-card-value">{item.value}</span>
                </div>
              </motion.a>
            ))}

            {/* Availability Badge */}
            <motion.div variants={fadeUp} className="contact-card availability-card">
              <div className="contact-card-icon" style={{ background: "#10b98115" }}>
                <div className="status-dot" />
              </div>
              <div className="contact-card-content">
                <span className="contact-card-label">Status</span>
                <span className="contact-card-value">Available for work</span>
              </div>
            </motion.div>

            {/* Response Time */}
            <motion.div variants={fadeUp} className="contact-card response-card">
              <div className="contact-card-icon" style={{ background: "#8b5cf615" }}>
                <Clock size={22} style={{ color: "#8b5cf6" }} />
              </div>
              <div className="contact-card-content">
                <span className="contact-card-label">Response time</span>
                <span className="contact-card-value">Within 24 hours</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Form Section - EYE-CATCHING DESIGN */}
          <motion.div variants={fadeUp} initial="initial" animate="animate" className="form-wrapper">
            <div className="form-header">
              <div className="form-header-badge">
                <MessageSquare size={14} />
                Get in touch
              </div>
              <h2>Send a message</h2>
              <p>Fill out the form below and I'll get back to you within 24 hours.</p>
            </div>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="success-message"
              >
                <CheckCircle size={48} />
                <h3>Message sent!</h3>
                <p>Thanks for reaching out. I'll respond as soon as possible.</p>
                <button onClick={() => setSent(false)} className="reset-button">
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <User size={14} />
                      Full name <span>*</span>
                    </label>
                    <input
                      {...register("name", { required: "Name is required" })}
                      type="text"
                      placeholder="John Doe"
                      className={`form-input ${errors.name ? "error" : ""}`}
                    />
                    {errors.name && <span className="error-message">{errors.name.message}</span>}
                  </div>

                  <div className="form-group">
                    <label>
                      <Mail size={14} />
                      Email address <span>*</span>
                    </label>
                    <input
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+\.\S+$/,
                          message: "Enter a valid email",
                        },
                      })}
                      type="email"
                      placeholder="hello@example.com"
                      className={`form-input ${errors.email ? "error" : ""}`}
                    />
                    {errors.email && <span className="error-message">{errors.email.message}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    <MessageSquare size={14} />
                    Subject
                  </label>
                  <input
                    {...register("subject")}
                    type="text"
                    placeholder="Project inquiry, collaboration, or just saying hi..."
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Message <span>*</span>
                  </label>
                  <textarea
                    {...register("message", {
                      required: "Message is required",
                      minLength: { value: 10, message: "Message must be at least 10 characters" },
                    })}
                    rows={5}
                    placeholder="Tell me about your project, ideas, or what you'd like to discuss..."
                    className={`form-textarea ${errors.message ? "error" : ""}`}
                  />
                  {errors.message && <span className="error-message">{errors.message.message}</span>}
                </div>

                {err && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="error-alert">
                    {err}
                  </motion.div>
                )}

                <button type="submit" disabled={isSubmitting} className="submit-button">
                  {isSubmitting ? (
                    <>
                      <div className="spinner" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send message
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>

                <p className="form-note">
                  * I'll never share your information. All messages are confidential.
                </p>
              </form>
            )}
          </motion.div>
        </div>

      </motion.div>

      <style>{`
        .contact-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem;
          position: relative;
          width: 100%;
        }

        .contact-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .contact-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 1rem;
          background: linear-gradient(135deg, rgba(var(--accent-rgb), 0.15), rgba(var(--accent-rgb), 0.05));
          border: 1px solid rgba(var(--accent-rgb), 0.3);
          border-radius: 40px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--accent);
          margin-bottom: 1.5rem;
          backdrop-filter: blur(4px);
        }

        .contact-title {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 700;
          line-height: 1.1;
          margin: 0 0 1rem;
          letter-spacing: 0;
        }

        .contact-title span {
          background: linear-gradient(135deg, var(--accent), #8b5cf6);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }

        .contact-description {
          max-width: 560px;
          margin: 0 auto;
          color: var(--text-secondary);
          font-size: 1rem;
          line-height: 1.6;
        }

        .contact-container {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 2rem;
        }

        /* Contact Info Grid */
        .contact-info-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .contact-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          transition: all 0.25s ease;
          cursor: pointer;
        }

        .contact-card:hover {
          transform: translateY(-3px);
          border-color: var(--accent);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
        }

        .contact-card-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          flex-shrink: 0;
        }

        .contact-card-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          min-width: 0;
        }

        .contact-card-label {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-muted);
        }

        .contact-card-value {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text);
          word-break: break-all;
        }

        .availability-card {
          background: linear-gradient(135deg, var(--surface), rgba(16, 185, 129, 0.05));
          border-color: rgba(16, 185, 129, 0.3);
        }

        .response-card {
          background: linear-gradient(135deg, var(--surface), rgba(139, 92, 246, 0.05));
          border-color: rgba(139, 92, 246, 0.3);
        }

        .status-dot {
          width: 10px;
          height: 10px;
          background: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
          animation: pulse-green 2s infinite;
        }

        @keyframes pulse-green {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        /* Form Wrapper - EYE-CATCHING */
        .form-wrapper {
          background: linear-gradient(135deg, var(--surface), var(--bg-alt));
          border: 2px solid rgba(var(--accent-rgb), 0.3);
          border-radius: 28px;
          padding: 1.75rem;
          box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(var(--accent-rgb), 0.1) inset;
          transition: all 0.3s ease;
        }

        .form-wrapper:hover {
          border-color: rgba(var(--accent-rgb), 0.6);
          box-shadow: 0 25px 40px -12px rgba(var(--accent-rgb), 0.2);
          transform: translateY(-2px);
        }

        .form-header {
          margin-bottom: 1.75rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
          text-align: center;
        }

        .form-header-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.25rem 0.75rem;
          background: linear-gradient(135deg, rgba(var(--accent-rgb), 0.15), rgba(139, 92, 246, 0.1));
          border-radius: 40px;
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--accent);
          margin-bottom: 1rem;
        }

        .form-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 0.35rem;
          background: linear-gradient(135deg, var(--text), var(--accent));
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }

        .form-header p {
          color: var(--text-muted);
          font-size: 0.85rem;
          margin: 0;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-muted);
        }

        .form-group label span {
          color: var(--accent);
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 0.85rem 1rem;
          background: var(--bg-alt);
          border: 2px solid var(--border);
          border-radius: 14px;
          font-size: 0.9rem;
          color: var(--text);
          transition: all 0.2s;
          font-family: inherit;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 4px rgba(var(--accent-rgb), 0.15);
        }

        .form-input.error,
        .form-textarea.error {
          border-color: #ef4444;
        }

        .error-message {
          font-size: 0.7rem;
          color: #ef4444;
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .error-alert {
          padding: 0.75rem 1rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 14px;
          color: #ef4444;
          font-size: 0.85rem;
        }

        .submit-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, var(--accent), #8b5cf6);
          color: white;
          border: none;
          border-radius: 40px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 0.5rem;
          width: fit-content;
          box-shadow: 0 4px 15px rgba(var(--accent-rgb), 0.3);
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(var(--accent-rgb), 0.4);
          gap: 0.8rem;
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-note {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-align: center;
          margin: 0.5rem 0 0;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Success Message */
        .success-message {
          text-align: center;
          padding: 2rem 1rem;
        }

        .success-message svg {
          color: #10b981;
          margin-bottom: 1rem;
        }

        .success-message h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0 0 0.5rem;
        }

        .success-message p {
          color: var(--text-muted);
          margin: 0 0 1.5rem;
        }

        .reset-button {
          background: transparent;
          border: 1px solid var(--border);
          padding: 0.6rem 1.25rem;
          border-radius: 40px;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .reset-button:hover {
          border-color: var(--accent);
          color: var(--accent);
        }

        /* Responsive */
        @media (max-width: 900px) {
          .contact-container {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .contact-info-grid {
            flex-direction: row;
            flex-wrap: wrap;
          }

          .contact-card {
            flex: 1;
            min-width: 200px;
          }
        }

        @media (max-width: 640px) {
          .contact-page {
            padding: 1rem 0 3rem;
          }

          .contact-header {
            text-align: left;
            margin-bottom: 2rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .contact-info-grid {
            flex-direction: column;
          }

          .contact-card {
            width: 100%;
          }

          .submit-button {
            width: 100%;
            justify-content: center;
          }

          .form-wrapper {
            padding: 1.25rem;
            border-radius: 20px;
          }

          .form-header {
            text-align: left;
          }

          .contact-title {
            font-size: clamp(2rem, 13vw, 2.8rem);
          }
        }
      `}</style>
    </>
  );
}

function ArrowRight(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
