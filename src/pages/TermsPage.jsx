import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import SeoHead from "../components/SeoHead";
import useSeo  from "../hooks/useSeo";
import api     from "../lib/api";

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
      <div style={{ padding: "clamp(1rem, 4vw, 3rem)", maxWidth: 760, width: "100%" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: "clamp(1.75rem, 6vw, 2.2rem)", fontWeight: 800, marginBottom: "0.75rem", lineHeight: 1.15 }}>
            {page.title || "Terms & Conditions"}
          </h1>
          {page.updatedAt && (
            <p style={{ display: "flex", alignItems: "center", gap: 6,
              color: "var(--text3)", fontSize: "0.82rem", marginBottom: "2rem" }}>
              <Calendar size={13} />
              Last updated {new Date(page.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          )}
          <div
            style={{ color: "var(--text2)", lineHeight: 1.85, fontSize: "clamp(0.9rem, 2vw, 0.95rem)", overflowWrap: "anywhere" }}
            dangerouslySetInnerHTML={{ __html: page.content || "<p>Content coming soon.</p>" }}
          />
        </motion.div>
      </div>
    </>
  );
}
