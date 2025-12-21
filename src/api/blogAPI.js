// src/api/blogAPI.js

/**
 * Blog API client
 *
 * Works in:
 * - DEV with Vite proxy (if VITE_API_BASE_URL is not set): uses window.location.origin + /api/*
 * - DEV hitting backend directly (if VITE_API_BASE_URL is set): uses that origin
 * - PROD (VITE_API_BASE_URL set to https://api.yourdomain.com): uses that origin
 */

const RAW_BASE = import.meta.env.VITE_API_BASE_URL;

// If env var is missing, fall back to current origin (so Vite proxy can handle /api/*).
const FALLBACK_ORIGIN =
  typeof window !== "undefined" ? window.location.origin : "http://localhost:5173";

const API_BASE = (RAW_BASE || FALLBACK_ORIGIN).replace(/\/$/, "");

/** Build an absolute URL safely */
function makeUrl(path) {
  // ensures path starts with /
  const safePath = path.startsWith("/") ? path : `/${path}`;
  return new URL(safePath, API_BASE);
}

/** Parse response body safely (json if possible, else text) */
async function readBody(res) {
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (isJson) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  try {
    return await res.text();
  } catch {
    return "";
  }
}

/** Standard request wrapper */
async function request(url, options) {
  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  const body = await readBody(res);

  if (!res.ok) {
    const message =
      typeof body === "string"
        ? body
        : body?.message || body?.error || JSON.stringify(body);

    throw new Error(`Blog API ${res.status} ${res.statusText}: ${message}`);
  }

  return body;
}

export async function fetchBlogPosts(category) {
  const url = makeUrl("/api/blog");
  if (category) url.searchParams.set("category", category);
  return request(url);
}

export async function fetchBlogPostBySlug(slug) {
  if (!slug) throw new Error("fetchBlogPostBySlug requires a slug");
  const url = makeUrl(`/api/blog/${encodeURIComponent(slug)}`);
  return request(url);
}

/**
 * NOTE:
 * Some endpoints are future-facing and may not be implemented yet.
 * These are intentionally defined early for clean scaling.
 *
 * Examples (enable when backend routes exist):
 *
 * export async function fetchBlogCategories() {
 *   return request(makeUrl("/api/blog/categories"));
 * }
 *
 * export async function fetchBlogComments(postId) {
 *   return request(makeUrl(`/api/blog/${postId}/comments`));
 * }
 *
 * export async function submitBlogComment(postId, commentData) {
 *   return request(makeUrl(`/api/blog/${postId}/comments`), {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify(commentData),
 *   });
 * }
 *
 * export async function fetchRecentBlogPosts() {
 *   return request(makeUrl("/api/blog/recent"));
 * }
 */
