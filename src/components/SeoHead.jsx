import { Helmet } from "react-helmet-async";

/**
 * Drop this into any page to apply SEO meta tags.
 * <SeoHead seo={seo} />
 */
export default function SeoHead({ seo, siteName }) {
  if (!seo) return null;
  const { title, description, keywords, ogImage, noIndex } = seo;

  return (
    <Helmet>
      {title       && <title>{title}{siteName ? ` — ${siteName}` : ""}</title>}
      {description && <meta name="description"        content={description} />}
      {keywords    && <meta name="keywords"           content={keywords} />}
      {noIndex     && <meta name="robots"             content="noindex,nofollow" />}
      {title       && <meta property="og:title"       content={title} />}
      {description && <meta property="og:description" content={description} />}
      {ogImage     && <meta property="og:image"       content={ogImage} />}
      {title       && <meta name="twitter:title"      content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {ogImage     && <meta name="twitter:image"      content={ogImage} />}
                      <meta name="twitter:card"       content="summary_large_image" />
    </Helmet>
  );
}
