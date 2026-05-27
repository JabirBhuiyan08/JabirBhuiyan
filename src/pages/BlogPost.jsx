import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import api from "../lib/api";

export default function BlogPost() {
  const { slug } = useParams();
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["blog", slug],
    queryFn: () => api.get(`/api/blogs/${slug}`).then(r => r.data),
  });

  if (isLoading) return <p className="text-3" style={{ padding: "2rem 0" }}>Loading…</p>;
  if (isError || !post) return (
    <div style={{ padding: "2rem 0" }}>
      <p className="text-3" style={{ marginBottom: "1rem" }}>Post not found.</p>
      <Link to="/blog" className="btn btn-secondary">← Back to Blog</Link>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{post.title}</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <motion.article
        className="blog-post"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link to="/blog" className="back-link">
          <ArrowLeft size={14} /> Back to Blog
        </Link>

        {post.coverUrl && (
          <div className="post-cover">
            <img src={post.coverUrl} alt={post.title} />
          </div>
        )}

        <div className="post-meta">
          {post.category && <span className="tag">{post.category}</span>}
          {post.tags?.map(t => <span key={t} className="tag">{t}</span>)}
        </div>

        <h1 className="post-title">{post.title}</h1>

        <time className="post-date mono">
          {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </time>

        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
      </motion.article>

      <style>{`
        .blog-post {
          max-width: 680px;
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

        .post-cover {
          margin-bottom: 1.5rem;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--border);
        }

        .post-cover img {
          width: 100%;
          height: auto;
          max-height: 320px;
          object-fit: cover;
        }

        .post-meta {
          display: flex;
          gap: 0.35rem;
          flex-wrap: wrap;
          margin-bottom: 0.75rem;
        }

        .post-title {
          font-size: clamp(1.5rem, 4vw, 2.25rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-bottom: 0.5rem;
        }

        .post-date {
          display: block;
          font-size: 0.75rem;
          color: var(--text-3);
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }

        .post-content {
          color: var(--text-2);
          font-size: 0.95rem;
          line-height: 1.8;
        }

        .post-content h2 {
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          font-size: 1.25rem;
        }

        .post-content h3 {
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .post-content p {
          margin-bottom: 1rem;
        }

        .post-content ul, .post-content ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }

        .post-content li {
          margin-bottom: 0.35rem;
        }

        .post-content a {
          color: var(--text);
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .post-content img {
          border-radius: var(--radius);
          margin: 1.5rem 0;
          border: 1px solid var(--border);
        }

        .post-content blockquote {
          border-left: 3px solid var(--border);
          padding-left: 1rem;
          margin: 1.5rem 0;
          color: var(--text-3);
          font-style: italic;
        }
      `}</style>
    </>
  );
}
