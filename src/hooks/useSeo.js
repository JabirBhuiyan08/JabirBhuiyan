import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

/**
 * Fetches SEO metadata for a given page key.
 * Falls back to provided defaults if no custom SEO is set.
 *
 * Usage:
 *   const seo = useSeo("home", { title: "My Portfolio", description: "..." });
 */
export default function useSeo(page, defaults = {}) {
  const { data } = useQuery({
    queryKey: ["seo", page],
    queryFn: () => api.get(`/api/seo/${page}`).then(r => r.data),
    staleTime: 1000 * 60 * 10,
  });

  return {
    title:       data?.title       || defaults.title       || "",
    description: data?.description || defaults.description || "",
    keywords:    data?.keywords    || defaults.keywords     || "",
    ogImage:     data?.ogImage     || defaults.ogImage      || "",
    noIndex:     data?.noIndex     ?? false,
  };
}
