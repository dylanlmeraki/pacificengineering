/**
 * Central route helpers.
 * Goal: keep your existing createPageUrl("SomePage") style,
 * but make it produce correct paths for marketing/internal/portal
 * while staying future-proof.
 */

type RouteOverrideMap = Record<string, string>;

const ROUTE_OVERRIDES: RouteOverrideMap = {
  // Marketing
  Home: "/",
  Blog: "/blog",

  // Auth (public)
  Auth: "/auth",

  // Client portal
  ClientPortal: "/portal",
  ClientAuth: "/portal/auth",
  PortalRegister: "/portal/register",

  // Internal portal
  Internal: "/internal",
  InternalDashboard: "/internal",
};

const INTERNAL_PAGES = new Set<string>([
  // Internal pages you already have
  "InternalDashboard",
  "UserManagement",
  "SalesDashboard",
  "SalesBotControl",
  "AISalesAssistant",
  "BlogEditor",
  "SEOAssistant",
  "ProjectsManager",
  "PageBuilder",
  "PDFGenerator",
  "WorkflowBuilder",
  "WebsiteMonitoring",
  "ClientInvites",

  // If you move these under internal (recommended)
  "AdminConsole",
  "AdminEmailSettings",
  "ContactManager",
  "InvoiceManagement",
  "ProposalDashboard",
  "ProjectDetail",
  "UserProfile",
  "Communications",
]);

const PORTAL_PAGES = new Set<string>([
  "ClientPortal",
  "ClientAuth",
  "PortalRegister",
]);

export function toKebabCase(input: string): string {
  return input
    .trim()
    // split camelCase / PascalCase: UserManagement -> User-Management
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    // spaces/underscores -> hyphen
    .replace(/[_\s]+/g, "-")
    // remove unsafe characters
    .replace(/[^a-zA-Z0-9-]/g, "")
    // collapse multiple hyphens
    .replace(/-+/g, "-")
    .toLowerCase();
}

/**
 * Backward-compatible helper used all over the app.
 * - Marketing defaults to /<kebab>
 * - Internal pages become /internal/<kebab> (or /internal for dashboard)
 * - Portal pages become /portal/<kebab> (or /portal for ClientPortal)
 */
export function createPageUrl(pageName: string): string {
  if (!pageName) return "/";
  if (pageName.startsWith("/")) return pageName;

  const override = ROUTE_OVERRIDES[pageName];
  if (override) return override;

  const slug = toKebabCase(pageName);

  if (INTERNAL_PAGES.has(pageName)) {
    // Dashboard should land on /internal (index route)
    if (pageName === "InternalDashboard") return "/internal";
    return `/internal/${slug}`;
  }

  if (PORTAL_PAGES.has(pageName)) {
    if (pageName === "ClientPortal") return "/portal";
    // /portal/auth, /portal/register, etc.
    return `/portal/${slug}`;
  }

  // marketing default
  return `/${slug}`;
}
