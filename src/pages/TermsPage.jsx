import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import SeoHead from "../components/SeoHead";
import useSeo from "../hooks/useSeo";
import api from "../lib/api";

export default function TermsPage() {
  const { data: page = {} } = useQuery({
    queryKey: ["legal", "terms"],
    queryFn: () => api.get("/api/legal/terms").then(r => r.data),
  });

  const seo = useSeo("terms", {
    title: page.title || "Terms & Conditions",
    description: "Our terms and conditions.",
  });

  return (
    <>
      <SeoHead seo={seo} />
      <div className="legal-page">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h1>{page.title || "Terms & Conditions"}</h1>
          {page.updatedAt && (
            <p className="legal-date mono">
              <Calendar size={13} />
              Last updated {new Date(page.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          )}
          <div className="legal-content" dangerouslySetInnerHTML={{ __html: page.content || "<p>Content coming soon.</p>" }} />
        </motion.div>
      </div>

      <style>{`
        .legal-page {
          max-width: 680px;
        }

        .legal-page h1 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .legal-date {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: var(--text-3);
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }

        .legal-content {
          color: var(--text-2);
          font-size: 0.9rem;
          line-height: 1.8;
        }

        .legal-content h2 {
          margin-top: 2rem;
          margin-bottom: 0.5rem;
          font-size: 1.15rem;
        }

        .legal-content p {
          margin-bottom: 1rem;
        }

        .legal-content ul, .legal-content ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }

        .legal-content li {
          margin-bottom: 0.35rem;
        }
      `}</style>
    </>
  );
}
