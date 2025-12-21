Project snapshot
- Vite + React (ESM) single-page app. Run locally with `npm run dev` (uses `vite`).
- Routes and pages live in `src/pages/*`. The router is under `src/Router/AppRouter.jsx`.
- Absolute imports use the `@/` alias (see `jsconfig.json`).

Key architecture notes (read before editing)
- Two portal modes handled by subdomain: public site, `internal` portal, and `client` portal.
  - `src/pages/Layout.jsx` shows the pattern: it detects subdomain and either renders `InternalLayout` or redirects to the client portal.
  - Subdomain helpers live in `src/components/utils/subdomainHelpers` — prefer those utilities when changing routing behavior.
- API layer:
  - Legacy `base44` SDK is referenced throughout (`src/api/base44Client.js`) but it contains a deprecation warning.
  - Preferred internal HTTP client is `src/api/httpClient.js` (wraps fetch and reads `VITE_API_BASE_URL`). For new code prefer `api.get/post/put/del`.
  - Many components still call `base44.entities.*`, `base44.auth.*`, and `base44.functions.invoke`. If you modify those callers, either:
    1) keep compatibility by updating `src/api/base44Client.js` to provide equivalent wrappers; or
    2) migrate call-sites to `src/api/httpClient.js` and the backend endpoints (search for `base44.` usages and update in bulk).

Developer workflows
- Start dev server: `npm run dev` (Vite on default port). Build for production: `npm run build`. Preview build: `npm run preview`.
- Lint: `npm run lint` (ESLint config at repo root).
- Environment variables:
  - Use Vite envs with the `VITE_` prefix (see `dotenv.env`). Important keys: `VITE_API_BASE_URL`, `VITE_MAIN_DOMAIN`, `VITE_INTERNAL_SUBDOMAIN`, `VITE_CLIENT_SUBDOMAIN`.
  - `dotenv.env` in repo root documents typical values for local development.

Project conventions & patterns
- UI: Tailwind CSS + Radix UI primitives; look in `src/components/ui` and `tailwind.config.js` for variants.
- Pages vs components:
  - `src/pages/*` contain route views (big pages). `src/components/*` are reusable UI or domain components.
  - Internal portal UI components live in `src/components/internal/*` and are wrapped by `InternalLayout`.
- State + auth:
  - A lightweight `AuthContext` exists at `src/context/AuthContext.jsx` — it currently uses `base44.auth.me()` to load the user. If you migrate auth, update this context and downstream checks.
- Utilities:
  - Routing helper `createPageUrl(pageName)` is in `src/utils/index.ts` — pages use `createPageUrl(...)` everywhere instead of hard-coded paths.
  - Centralized HTTP client: `src/api/httpClient.js` is the single place to encode `VITE_API_BASE_URL` behavior; use it for new API work.

Integration points & deployment
- Images/files are hosted via Supabase object URLs (seen in `src/pages/Layout.jsx`); non-local assets can be referenced directly.
- Deploy targets: Vercel-related config exists (`vercel.json`, `vercel.env`) and the code expects SPA rewrites.

What to look for when changing code
- If you touch API surfaces, search the repo for `base44.` (many call sites). Migrate or keep wrappers consistent.
- When changing routing or subdomain logic, update `src/components/utils/subdomainHelpers` and `src/pages/Layout.jsx`.
- Preserve `@/` imports when moving files; update `jsconfig.json` only when adding new top-level alias patterns.

Quick file references (good starting points)
- `src/api/httpClient.js` — canonical fetch wrapper and `VITE_API_BASE_URL` usage
- `src/api/base44Client.js` — legacy SDK wrapper (contains deprecation warning)
- `src/context/AuthContext.jsx` — app-wide user loading
- `src/pages/Layout.jsx` — public site header/footer + portal detection
- `src/Router/AppRouter.jsx` — route definitions (entrypoint for SPA routes)

If anything above is unclear or you'd like me to expand a specific section (API endpoints, a migration plan for `base44` → internal API, or example PR changes), tell me which part to expand.
