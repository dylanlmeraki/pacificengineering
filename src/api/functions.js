import { api } from "@/api/httpClient";

/**
 * Explicit stub for not-yet-migrated functions.
 * This prevents silent crashes and makes migration obvious.
 */
function notMigrated(name) {
  return async () => {
    throw new Error(
      `[MIGRATION] Function "${name}" is not migrated off Base44 yet`
    );
  };
}

/* =====================================================
   FORMS (ALREADY MIGRATED OR SAFE TO WIRE NOW)
   ===================================================== */

export async function submitConsultationForm(formData) {
  const res = await api.post("/api/forms/consultation", formData);
  return res.data;
}

export async function createContactFromForm(formData) {
  const res = await api.post("/api/forms/contact", formData);
  return res.data;
}

/* =====================================================
   AUTH / USERS (PHASE 3)
   ===================================================== */

export const createUserAccount = notMigrated("createUserAccount");
export const validateInvite = notMigrated("validateInvite");
export const completeInviteRegistration = notMigrated("completeInviteRegistration");
export const createClientInvite = notMigrated("createClientInvite");
export const sendClientInvite = notMigrated("sendClientInvite");

/* =====================================================
   BLOG / AI (PHASE 2.2)
   ===================================================== */

export const generateBlogContent = notMigrated("generateBlogContent");
export const extractPageContent = notMigrated("extractPageContent");

/* =====================================================
   NOTIFICATIONS (PHASE 4)
   ===================================================== */

export const createNotification = notMigrated("createNotification");
export const sendNotification = notMigrated("sendNotification");
export const notifyAdminsContactForm = notMigrated("notifyAdminsContactForm");
export const notifyProjectUpdate = notMigrated("notifyProjectUpdate");
export const notifyTeamProjectAssigned = notMigrated("notifyTeamProjectAssigned");

/* =====================================================
   CRM / SALES / PROSPECTING
   ===================================================== */

export const syncClientToCRM = notMigrated("syncClientToCRM");
export const enrichProspect = notMigrated("enrichProspect");
export const analyzeContactInquiry = notMigrated("analyzeContactInquiry");
export const analyzeProjectRequest = notMigrated("analyzeProjectRequest");
export const identifySalesOpportunities = notMigrated("identifySalesOpportunities");
export const calculateLeadScore = notMigrated("calculateLeadScore");

/* =====================================================
   PROPOSALS / CONTRACTS
   ===================================================== */

export const generateProposal = notMigrated("generateProposal");
export const generateProposalDraft = notMigrated("generateProposalDraft");
export const shareProposal = notMigrated("shareProposal");

export const generateContractDocument = notMigrated("generateContractDocument");
export const sendContractToClient = notMigrated("sendContractToClient");
export const remindContractSignature = notMigrated("remindContractSignature");
export const archiveCompletedProjects = notMigrated("archiveCompletedProjects");

/* =====================================================
   MEETINGS / FOLLOW UPS
   ===================================================== */

export const scheduleMeeting = notMigrated("scheduleMeeting");
export const scheduleFollowUp = notMigrated("scheduleFollowUp");
export const sendFollowUpEmail = notMigrated("sendFollowUpEmail");

/* =====================================================
   STRIPE / BILLING
   ===================================================== */

export const stripeWebhook = notMigrated("stripeWebhook");
export const createStripeInvoice = notMigrated("createStripeInvoice");
export const checkOverdueInvoices = notMigrated("checkOverdueInvoices");

/* =====================================================
   MARKETING / SEO / ANALYTICS
   ===================================================== */

export const evaluateMarketingCampaign = notMigrated("evaluateMarketingCampaign");
export const optimizeAdSpend = notMigrated("optimizeAdSpend");
export const generateSocialMediaPosts = notMigrated("generateSocialMediaPosts");
export const analyzeWebsiteTraffic = notMigrated("analyzeWebsiteTraffic");
export const recommendSEOImprovements = notMigrated("recommendSEOImprovements");
export const monitorBrandMentions = notMigrated("monitorBrandMentions");

/* =====================================================
   EMAIL / DRIP / AUTOMATION
   ===================================================== */

export const sendMarketingEmails = notMigrated("sendMarketingEmails");
export const trackEmailEngagement = notMigrated("trackEmailEngagement");
export const segmentEmailLists = notMigrated("segmentEmailLists");
export const personalizeEmailContent = notMigrated("personalizeEmailContent");
export const scheduleEmailCampaigns = notMigrated("scheduleEmailCampaigns");
export const generateEmailSubjectLines = notMigrated("generateEmailSubjectLines");
export const analyzeEmailPerformance = notMigrated("analyzeEmailPerformance");
export const suggestEmailImprovements = notMigrated("suggestEmailImprovements");
export const manageUnsubscribes = notMigrated("manageUnsubscribes");
export const cleanEmailLists = notMigrated("cleanEmailLists");
export const monitorEmailDeliverability = notMigrated("monitorEmailDeliverability");
export const generateEmailReports = notMigrated("generateEmailReports");
export const optimizeEmailTiming = notMigrated("optimizeEmailTiming");
export const integrateCRMEmail = notMigrated("integrateCRMEmail");
export const automateEmailResponses = notMigrated("automateEmailResponses");
export const trackEmailConversions = notMigrated("trackEmailConversions");

/* =====================================================
   DRIP CAMPAIGNS
   ===================================================== */

export const createDripCampaigns = notMigrated("createDripCampaigns");
export const analyzeDripPerformance = notMigrated("analyzeDripPerformance");
export const suggestDripImprovements = notMigrated("suggestDripImprovements");
export const manageDripSubscriptions = notMigrated("manageDripSubscriptions");
export const optimizeDripContent = notMigrated("optimizeDripContent");
export const scheduleDripEmails = notMigrated("scheduleDripEmails");
export const generateDripReports = notMigrated("generateDripReports");
export const trackDripEngagement = notMigrated("trackDripEngagement");
export const personalizeDripContent = notMigrated("personalizeDripContent");
export const segmentDripLists = notMigrated("segmentDripLists");
export const monitorDripDeliverability = notMigrated("monitorDripDeliverability");
export const optimizeDripTiming = notMigrated("optimizeDripTiming");
export const integrateCRMDrip = notMigrated("integrateCRMDrip");
export const automateDripResponses = notMigrated("automateDripResponses");
export const trackDripConversions = notMigrated("trackDripConversions");
