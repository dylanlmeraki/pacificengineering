import Layout from "./Layout.jsx";

import Home from "./Home";

import Services from "./Services";

import About from "./About";

import Contact from "./Contact";

import SWPPPChecker from "./SWPPPChecker";

import SpecialInspections from "./SpecialInspections";

import StructuralEngineering from "./StructuralEngineering";

import Construction from "./Construction";

import PreviousWork from "./PreviousWork";

import InspectionsTesting from "./InspectionsTesting";

import ProjectGallery from "./ProjectGallery";

import Blog from "./Blog";

import BlogEditor from "./BlogEditor";

import SalesDashboard from "./SalesDashboard";

import SalesBotControl from "./SalesBotControl";

import ServicesOverview from "./ServicesOverview";

import WorkflowBuilder from "./WorkflowBuilder";

import SEOAssistant from "./SEOAssistant";

import ClientPortal from "./ClientPortal";

import ProjectDetail from "./ProjectDetail";

import AdminEmailSettings from "./AdminEmailSettings";

import Auth from "./Auth";

import InternalDashboard from "./InternalDashboard";

import UserManagement from "./UserManagement";

import PageBuilder from "./PageBuilder";

import ClientInvites from "./ClientInvites";

import PortalRegister from "./PortalRegister";

import ProposalDashboard from "./ProposalDashboard";

import ClientAuth from "./ClientAuth";

import ContactManager from "./ContactManager";

import ProjectsManager from "./ProjectsManager";

import AISalesAssistant from "./AISalesAssistant";

import PDFGenerator from "./PDFGenerator";

import WebsiteMonitoring from "./WebsiteMonitoring";

import UserProfile from "./UserProfile";

import Communications from "./Communications";

import InvoiceManagement from "./InvoiceManagement";

import AdminConsole from "./AdminConsole";

import { Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Services: Services,
    
    About: About,
    
    Contact: Contact,
    
    SWPPPChecker: SWPPPChecker,
    
    SpecialInspections: SpecialInspections,
    
    StructuralEngineering: StructuralEngineering,
    
    Construction: Construction,
    
    PreviousWork: PreviousWork,
    
    InspectionsTesting: InspectionsTesting,
    
    ProjectGallery: ProjectGallery,
    
    Blog: Blog,
    
    BlogEditor: BlogEditor,
    
    SalesDashboard: SalesDashboard,
    
    SalesBotControl: SalesBotControl,
    
    ServicesOverview: ServicesOverview,
    
    WorkflowBuilder: WorkflowBuilder,
    
    SEOAssistant: SEOAssistant,
    
    ClientPortal: ClientPortal,
    
    ProjectDetail: ProjectDetail,
    
    AdminEmailSettings: AdminEmailSettings,
    
    Auth: Auth,
    
    InternalDashboard: InternalDashboard,
    
    UserManagement: UserManagement,
    
    PageBuilder: PageBuilder,
    
    ClientInvites: ClientInvites,
    
    PortalRegister: PortalRegister,
    
    ProposalDashboard: ProposalDashboard,
    
    ClientAuth: ClientAuth,
    
    ContactManager: ContactManager,
    
    ProjectsManager: ProjectsManager,
    
    AISalesAssistant: AISalesAssistant,
    
    PDFGenerator: PDFGenerator,
    
    WebsiteMonitoring: WebsiteMonitoring,
    
    UserProfile: UserProfile,
    
    Communications: Communications,
    
    InvoiceManagement: InvoiceManagement,
    
    AdminConsole: AdminConsole,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Services" element={<Services />} />
                
                <Route path="/About" element={<About />} />
                
                <Route path="/Contact" element={<Contact />} />
                
                <Route path="/SWPPPChecker" element={<SWPPPChecker />} />
                
                <Route path="/SpecialInspections" element={<SpecialInspections />} />
                
                <Route path="/StructuralEngineering" element={<StructuralEngineering />} />
                
                <Route path="/Construction" element={<Construction />} />
                
                <Route path="/PreviousWork" element={<PreviousWork />} />
                
                <Route path="/InspectionsTesting" element={<InspectionsTesting />} />
                
                <Route path="/ProjectGallery" element={<ProjectGallery />} />
                
                <Route path="/Blog" element={<Blog />} />
                
                <Route path="/BlogEditor" element={<BlogEditor />} />
                
                <Route path="/SalesDashboard" element={<SalesDashboard />} />
                
                <Route path="/SalesBotControl" element={<SalesBotControl />} />
                
                <Route path="/ServicesOverview" element={<ServicesOverview />} />
                
                <Route path="/WorkflowBuilder" element={<WorkflowBuilder />} />
                
                <Route path="/SEOAssistant" element={<SEOAssistant />} />
                
                <Route path="/ClientPortal" element={<ClientPortal />} />
                
                <Route path="/ProjectDetail" element={<ProjectDetail />} />
                
                <Route path="/AdminEmailSettings" element={<AdminEmailSettings />} />
                
                <Route path="/Auth" element={<Auth />} />
                
                <Route path="/InternalDashboard" element={<InternalDashboard />} />
                
                <Route path="/UserManagement" element={<UserManagement />} />
                
                <Route path="/PageBuilder" element={<PageBuilder />} />
                
                <Route path="/ClientInvites" element={<ClientInvites />} />
                
                <Route path="/PortalRegister" element={<PortalRegister />} />
                
                <Route path="/ProposalDashboard" element={<ProposalDashboard />} />
                
                <Route path="/ClientAuth" element={<ClientAuth />} />
                
                <Route path="/ContactManager" element={<ContactManager />} />
                
                <Route path="/ProjectsManager" element={<ProjectsManager />} />
                
                <Route path="/AISalesAssistant" element={<AISalesAssistant />} />
                
                <Route path="/PDFGenerator" element={<PDFGenerator />} />
                
                <Route path="/WebsiteMonitoring" element={<WebsiteMonitoring />} />
                
                <Route path="/UserProfile" element={<UserProfile />} />
                
                <Route path="/Communications" element={<Communications />} />
                
                <Route path="/InvoiceManagement" element={<InvoiceManagement />} />
                
                <Route path="/AdminConsole" element={<AdminConsole />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return <PagesContent />;
}