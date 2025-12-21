import { useEffect } from "react";

function upsertMeta({ selector, attrName, attrValue, content }) {
  if (!content) return;

  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    document.head.appendChild(el);
  }

  el.setAttribute(attrName, attrValue);
  el.setAttribute("content", content);
}

function upsertLink({ rel, href }) {
  if (!href) return;

  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export default function BlogSEO({
  post,
  title,
  description,
  image,
  url,
  author,
  publishedTime
}) {
  const resolvedTitle = title || post?.seo_optimized_title || post?.title || "Blog";
  const resolvedDescription =
    description || post?.meta_description || post?.excerpt || "Read the latest from Pacific Engineering.";
  const resolvedImage = image || post?.featured_image || "";
  const resolvedAuthor = author || post?.author || "Pacific Engineering";
  const resolvedUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");
  const resolvedPublishedTime = publishedTime || post?.published_date || "";

  useEffect(() => {
    // Title
    document.title = resolvedTitle;

    // Basic
    upsertMeta({
      selector: `meta[name="description"]`,
      attrName: "name",
      attrValue: "description",
      content: resolvedDescription
    });

    // Canonical
    upsertLink({ rel: "canonical", href: resolvedUrl });

    // OpenGraph
    upsertMeta({ selector: `meta[property="og:title"]`, attrName: "property", attrValue: "og:title", content: resolvedTitle });
    upsertMeta({
      selector: `meta[property="og:description"]`,
      attrName: "property",
      attrValue: "og:description",
      content: resolvedDescription
    });
    upsertMeta({ selector: `meta[property="og:url"]`, attrName: "property", attrValue: "og:url", content: resolvedUrl });
    upsertMeta({ selector: `meta[property="og:type"]`, attrName: "property", attrValue: "og:type", content: "article" });

    if (resolvedImage) {
      upsertMeta({ selector: `meta[property="og:image"]`, attrName: "property", attrValue: "og:image", content: resolvedImage });
    }

    if (resolvedPublishedTime) {
      upsertMeta({
        selector: `meta[property="article:published_time"]`,
        attrName: "property",
        attrValue: "article:published_time",
        content: resolvedPublishedTime
      });
    }

    upsertMeta({
      selector: `meta[property="article:author"]`,
      attrName: "property",
      attrValue: "article:author",
      content: resolvedAuthor
    });

    // Twitter
    upsertMeta({ selector: `meta[name="twitter:card"]`, attrName: "name", attrValue: "twitter:card", content: "summary_large_image" });
    upsertMeta({ selector: `meta[name="twitter:title"]`, attrName: "name", attrValue: "twitter:title", content: resolvedTitle });
    upsertMeta({
      selector: `meta[name="twitter:description"]`,
      attrName: "name",
      attrValue: "twitter:description",
      content: resolvedDescription
    });
    if (resolvedImage) {
      upsertMeta({ selector: `meta[name="twitter:image"]`, attrName: "name", attrValue: "twitter:image", content: resolvedImage });
    }
  }, [resolvedTitle, resolvedDescription, resolvedImage, resolvedUrl, resolvedAuthor, resolvedPublishedTime]);

  return null;
}
