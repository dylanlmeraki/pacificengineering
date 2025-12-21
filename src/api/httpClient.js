// src/api/httpClient.js
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://api.pacificengineeringsf.com";

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    credentials: "include", // if you later use cookies
    ...options,
    headers,
  });

  // Optional: handle 204
  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = (data && data.error) || res.statusText || "Request failed";
    throw new Error(message);
  }

  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) =>
    request(path, { method: "PUT", body: JSON.stringify(body) }),
  del: (path) => request(path, { method: "DELETE" }),
};
