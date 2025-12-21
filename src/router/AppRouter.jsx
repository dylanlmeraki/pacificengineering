// src/router/AppRouter.jsx
import { Routes, Route, Navigate } from "react-router-dom";

import MarketingLayout from "@/layouts/MarketingLayout";
import InternalLayout from "@/layouts/InternalLayout";
import ClientLayout from "@/layouts/ClientLayout";

// ================= Marketing (Public) Pages =================
import Home from "@/pages/marketing/Home";
import About from "@/pages/marketing/About";
import Services from "@/pages/marketing/Services";
import ServicesOverview from "@/pages/marketing/ServicesOverview";
import StructuralEngineering from "@/pages/marketing/StructuralEngineering";
import SpecialInspections from "@/pages/marketing/SpecialInspections";
import InspectionsTesting from "@/pages/marketing/InspectionsTesting";
import SWPPPChecker from "@/pages/marketing/SWPPPChecker";
import PreviousWork from "@/pages/marketing/PreviousWork";
import ProjectGallery from "@/pages/marketing/ProjectGallery";
import Construction from "@/pages/marketing/Construction";
import Contact from "@/pages/marketing/Contact";

// Blog (Marketing)
import Blog from "@/pages/marketing/Blog/Blog";
import BlogPost from "@/pages/marketing/Blog/BlogPost";

// ================= Internal Pages =================
import InternalDashboard from "@/pages/internal/InternalDashboard";
import ProjectsManager from "@/pages/internal/ProjectsManager";
import UserManagement from "@/pages/internal/UserManagement";
import SalesDashboard from "@/pages/internal/SalesDashboard";
import BlogEditor from "@/pages/internal/BlogEditor";
import SEOAssistant from "@/pages/internal/SEOAssistant";
import SalesBotControl from "@/pages/internal/SalesBotControl";
import AISalesAssistant from "@/pages/internal/AISalesAssistant";
import PageBuilder from "@/pages/internal/PageBuilder";
import WorkflowBuilder from "@/pages/internal/WorkflowBuilder";
import WebsiteMonitoring from "@/pages/internal/WebsiteMonitoring";
import PDFGenerator from "@/pages/internal/PDFGenerator";
import ClientInvites from "@/pages/internal/ClientInvites";
import AdminConsole from "@/pages/internal/AdminConsole";
import InvoiceManagement from "@/pages/internal/InvoiceManagement";
import ProposalDashboard from "@/pages/internal/ProposalDashboard";
import ContactManager from "@/pages/internal/ContactManager";
import Communications from "@/pages/internal/Communications";
import AdminEmailSettings from "@/pages/internal/AdminEmailSettings";

// ================= Portal Pages =================
import ClientPortal from "@/pages/portal/ClientPortal";

// ================= Auth Pages =================
import Auth from "@/pages/Auth";
import ClientAuth from "@/pages/ClientAuth";
import PortalRegister from "@/pages/PortalRegister";

// ================= Shared =================
import NotFound from "@/pages/NotFound";

export default function AppRouter() {
  return (
    <Routes>
      {/* ================= Marketing (Public) ================= */}
      <Route path="/" element={<MarketingLayout />}>
        <Route index element={<Home />} />

        {/* marketing pages */}
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="services-overview" element={<ServicesOverview />} />
        <Route path="structural-engineering" element={<StructuralEngineering />} />
        <Route path="special-inspections" element={<SpecialInspections />} />
        <Route path="inspections-testing" element={<InspectionsTesting />} />
        <Route path="swppp-checker" element={<SWPPPChecker />} />
        <Route path="previous-work" element={<PreviousWork />} />
        <Route path="project-gallery" element={<ProjectGallery />} />
        <Route path="construction" element={<Construction />} />
        <Route path="contact" element={<Contact />} />

        {/* blog */}
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPost />} />
      </Route>

      {/* ================= Auth ================= */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/portal/auth" element={<ClientAuth />} />
      <Route path="/portal/register" element={<PortalRegister />} />

      {/* ================= Internal Portal ================= */}
      <Route path="/internal" element={<InternalLayout />}>
        <Route index element={<InternalDashboard />} />

        <Route path="projects" element={<ProjectsManager />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="contacts" element={<ContactManager />} />
        <Route path="crm" element={<SalesDashboard />} />

        <Route path="blog" element={<BlogEditor />} />
        <Route path="seo" element={<SEOAssistant />} />

        <Route path="sales-bot" element={<SalesBotControl />} />
        <Route path="sales-assistant" element={<AISalesAssistant />} />

        <Route path="page-builder" element={<PageBuilder />} />
        <Route path="workflows" element={<WorkflowBuilder />} />
        <Route path="monitoring" element={<WebsiteMonitoring />} />
        <Route path="pdf" element={<PDFGenerator />} />

        <Route path="invites" element={<ClientInvites />} />
        <Route path="communications" element={<Communications />} />

        <Route path="proposals" element={<ProposalDashboard />} />
        <Route path="invoices" element={<InvoiceManagement />} />

        <Route path="admin" element={<AdminConsole />} />
        <Route path="email-settings" element={<AdminEmailSettings />} />
      </Route>

      {/* ================= Client Portal ================= */}
      <Route path="/portal" element={<ClientLayout />}>
        <Route index element={<ClientPortal />} />
        {/* future portal routes go here */}
      </Route>

      {/* ================= Legacy Redirects =================
         These keep old createPageUrl-style links working while we refactor imports/paths.
      */}
      <Route path="/internal-dashboard" element={<Navigate to="/internal" replace />} />
      <Route path="/projects-manager" element={<Navigate to="/internal/projects" replace />} />
      <Route path="/user-management" element={<Navigate to="/internal/users" replace />} />
      <Route path="/contact-manager" element={<Navigate to="/internal/contacts" replace />} />
      <Route path="/sales-dashboard" element={<Navigate to="/internal/crm" replace />} />
      <Route path="/blog-editor" element={<Navigate to="/internal/blog" replace />} />
      <Route path="/seo-assistant" element={<Navigate to="/internal/seo" replace />} />
      <Route path="/sales-bot-control" element={<Navigate to="/internal/sales-bot" replace />} />
      <Route path="/ai-sales-assistant" element={<Navigate to="/internal/sales-assistant" replace />} />
      <Route path="/page-builder" element={<Navigate to="/internal/page-builder" replace />} />
      <Route path="/workflow-builder" element={<Navigate to="/internal/workflows" replace />} />
      <Route path="/website-monitoring" element={<Navigate to="/internal/monitoring" replace />} />
      <Route path="/pdf-generator" element={<Navigate to="/internal/pdf" replace />} />
      <Route path="/client-invites" element={<Navigate to="/internal/invites" replace />} />
      <Route path="/communications" element={<Navigate to="/internal/communications" replace />} />
      <Route path="/proposal-dashboard" element={<Navigate to="/internal/proposals" replace />} />
      <Route path="/invoice-management" element={<Navigate to="/internal/invoices" replace />} />
      <Route path="/admin-console" element={<Navigate to="/internal/admin" replace />} />
      <Route path="/admin-email-settings" element={<Navigate to="/internal/email-settings" replace />} />

      <Route path="/client-portal" element={<Navigate to="/portal" replace />} />

      {/* ================= 404 ================= */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
