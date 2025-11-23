import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import AdminRoute from "../components/internal/AdminRoute";
import InternalLayout from "../components/internal/InternalLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Sparkles, 
  Mail, 
  TrendingUp, 
  FileText, 
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Users,
  Target,
  Send,
  Copy,
  Eye
} from "lucide-react";
import { format } from "date-fns";

export default function AISalesAssistant() {
  const [activeTab, setActiveTab] = useState("inquiries");
  const [analyzing, setAnalyzing] = useState(null);
  const [analysis, setAnalysis] = useState({});

  const { data: contacts = [] } = useQuery({
    queryKey: ['contacts-for-ai'],
    queryFn: async () => {
      return await base44.entities.Contact.list('-created_date', 50);
    }
  });

  const { data: projectRequests = [] } = useQuery({
    queryKey: ['project-requests-for-ai'],
    queryFn: async () => {
      return await base44.entities.ProjectRequest.list('-created_date', 50);
    }
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects-for-opportunities'],
    queryFn: async () => {
      return await base44.entities.Project.list('-created_date', 100);
    }
  });

  const analyzeContact = async (contactId) => {
    setAnalyzing(contactId);
    try {
      const result = await base44.functions.invoke('analyzeContactInquiry', {
        contact_id: contactId
      });
      setAnalysis(prev => ({ ...prev, [contactId]: result.data.analysis || result.data.fallback }));
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    }
    setAnalyzing(null);
  };

  const analyzeRequest = async (requestId) => {
    setAnalyzing(requestId);
    try {
      const result = await base44.functions.invoke('analyzeProjectRequest', {
        request_id: requestId
      });
      setAnalysis(prev => ({ ...prev, [requestId]: result.data.analysis || result.data.fallback }));
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    }
    setAnalyzing(null);
  };

  const findOpportunities = async (clientEmail) => {
    setAnalyzing(clientEmail);
    try {
      const result = await base44.functions.invoke('identifySalesOpportunities', {
        client_email: clientEmail
      });
      setAnalysis(prev => ({ ...prev, [clientEmail]: result.data.analysis || result.data.fallback }));
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    }
    setAnalyzing(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <AdminRoute>
      <InternalLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Sales Assistant</h1>
                  <p className="text-gray-600">Intelligent analysis, opportunities, and proposal generation</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 mb-8 bg-white shadow-lg">
                <TabsTrigger value="inquiries" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact Inquiries ({contacts.length})
                </TabsTrigger>
                <TabsTrigger value="requests" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Project Requests ({projectRequests.length})
                </TabsTrigger>
                <TabsTrigger value="opportunities" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Sales Opportunities
                </TabsTrigger>
              </TabsList>

              {/* Contact Inquiries Tab */}
              <TabsContent value="inquiries">
                <div className="space-y-6">
                  {contacts.length === 0 ? (
                    <Card className="p-12 text-center border-0 shadow-xl">
                      <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Contact Inquiries</h3>
                      <p className="text-gray-600">Contact form submissions will appear here for deep analysis</p>
                    </Card>
                  ) : (
                    contacts.map(contact => (
                      <Card key={contact.id} className="p-6 border-0 shadow-xl">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{contact.name}</h3>
                            <p className="text-gray-600">{contact.email}</p>
                            {contact.company && <p className="text-sm text-gray-500">{contact.company}</p>}
                          </div>
                          <Badge className="bg-blue-100 text-blue-700">
                            {contact.interest || 'General'}
                          </Badge>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <p className="text-gray-700 leading-relaxed">{contact.message}</p>
                        </div>

                        <div className="flex gap-2 mb-4">
                          <Button
                            onClick={() => analyzeContact(contact.id)}
                            disabled={analyzing === contact.id}
                            className="bg-gradient-to-r from-purple-600 to-blue-600"
                          >
                            {analyzing === contact.id ? (
                              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
                            ) : (
                              <><Sparkles className="w-4 h-4 mr-2" /> Analyze</>
                            )}
                          </Button>
                        </div>

                        {analysis[contact.id] && (
                          <div className="space-y-4 border-t border-gray-200 pt-4">
                            <div className="grid md:grid-cols-3 gap-4">
                              <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-0">
                                <div className="text-sm font-semibold text-gray-700 mb-1">Sentiment</div>
                                <div className="text-lg font-bold text-gray-900">
                                  {analysis[contact.id].sentiment?.type || 'N/A'}
                                </div>
                              </Card>
                              <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50 border-0">
                                <div className="text-sm font-semibold text-gray-700 mb-1">Urgency</div>
                                <div className="text-lg font-bold text-gray-900">
                                  {analysis[contact.id].urgency || 'N/A'}
                                </div>
                              </Card>
                              <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-0">
                                <div className="text-sm font-semibold text-gray-700 mb-1">Services</div>
                                <div className="text-sm text-gray-900">
                                  {analysis[contact.id].recommended_services?.length || 0} recommended
                                </div>
                              </Card>
                            </div>

                            {analysis[contact.id].follow_up_email && (
                              <Card className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Send className="w-4 h-4" />
                                    AI-Generated Follow-up Email
                                  </h4>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => copyToClipboard(
                                      `Subject: ${analysis[contact.id].follow_up_email.subject}\n\n${analysis[contact.id].follow_up_email.body}`
                                    )}
                                  >
                                    <Copy className="w-3 h-3 mr-1" /> Copy
                                  </Button>
                                </div>
                                <div className="space-y-2">
                                  <div>
                                    <span className="font-semibold text-sm text-gray-700">Subject:</span>
                                    <p className="text-gray-900">{analysis[contact.id].follow_up_email.subject}</p>
                                  </div>
                                  <div>
                                    <span className="font-semibold text-sm text-gray-700">Body:</span>
                                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                                      {analysis[contact.id].follow_up_email.body}
                                    </p>
                                  </div>
                                </div>
                              </Card>
                            )}

                            {analysis[contact.id].next_steps?.length > 0 && (
                              <div>
                                <h4 className="font-bold text-gray-900 mb-2">Recommended Next Steps:</h4>
                                <ul className="space-y-2">
                                  {analysis[contact.id].next_steps.map((step, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                                      <span className="text-gray-700">{step}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Project Requests Tab */}
              <TabsContent value="requests">
                <div className="space-y-6">
                  {projectRequests.length === 0 ? (
                    <Card className="p-12 text-center border-0 shadow-xl">
                      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Project Requests</h3>
                      <p className="text-gray-600">Client project requests will appear here for AI analysis</p>
                    </Card>
                  ) : (
                    projectRequests.map(request => (
                      <Card key={request.id} className="p-6 border-0 shadow-xl">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{request.request_title}</h3>
                            <p className="text-gray-600">{request.client_name} ({request.client_email})</p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-700">
                            {request.project_type}
                          </Badge>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <p className="text-gray-700 leading-relaxed">{request.description}</p>
                          {request.location && (
                            <p className="text-sm text-gray-600 mt-2">Location: {request.location}</p>
                          )}
                          {request.budget_range && (
                            <p className="text-sm text-gray-600">Budget: {request.budget_range}</p>
                          )}
                        </div>

                        <Button
                          onClick={() => analyzeRequest(request.id)}
                          disabled={analyzing === request.id}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 mb-4"
                        >
                          {analyzing === request.id ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
                          ) : (
                            <><Sparkles className="w-4 h-4 mr-2" /> Analyze with AI</>
                          )}
                        </Button>

                        {analysis[request.id] && (
                          <div className="space-y-4 border-t border-gray-200 pt-4">
                            <div className="grid md:grid-cols-3 gap-4">
                              <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-0">
                                <div className="text-sm font-semibold text-gray-700 mb-1">Complexity</div>
                                <div className="text-lg font-bold text-gray-900">
                                  {analysis[request.id].complexity || 'N/A'}
                                </div>
                              </Card>
                              <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-0">
                                <div className="text-sm font-semibold text-gray-700 mb-1">Est. Value</div>
                                <div className="text-sm font-bold text-gray-900">
                                  {analysis[request.id].estimated_value_range || 'TBD'}
                                </div>
                              </Card>
                              <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-0">
                                <div className="text-sm font-semibold text-gray-700 mb-1">Cross-Sell Ops</div>
                                <div className="text-lg font-bold text-gray-900">
                                  {analysis[request.id].cross_sell_opportunities?.length || 0}
                                </div>
                              </Card>
                            </div>

                            {analysis[request.id].response_email && (
                              <Card className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="font-bold text-gray-900">AI-Generated Response</h4>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => copyToClipboard(
                                      `Subject: ${analysis[request.id].response_email.subject}\n\n${analysis[request.id].response_email.body}`
                                    )}
                                  >
                                    <Copy className="w-3 h-3 mr-1" /> Copy
                                  </Button>
                                </div>
                                <div className="space-y-2">
                                  <div>
                                    <span className="font-semibold text-sm">Subject:</span>
                                    <p>{analysis[request.id].response_email.subject}</p>
                                  </div>
                                  <div>
                                    <span className="font-semibold text-sm">Body:</span>
                                    <p className="whitespace-pre-wrap leading-relaxed">
                                      {analysis[request.id].response_email.body}
                                    </p>
                                  </div>
                                </div>
                              </Card>
                            )}

                            {analysis[request.id].cross_sell_opportunities?.length > 0 && (
                              <div>
                                <h4 className="font-bold text-gray-900 mb-3">Cross-Selling Opportunities:</h4>
                                <div className="space-y-2">
                                  {analysis[request.id].cross_sell_opportunities.map((opp, idx) => (
                                    <Card key={idx} className="p-3 bg-green-50 border-green-200">
                                      <div className="flex items-start gap-2">
                                        <Target className="w-4 h-4 text-green-600 mt-0.5" />
                                        <div>
                                          <div className="font-semibold text-gray-900">{opp.service}</div>
                                          <div className="text-sm text-gray-700">{opp.reason}</div>
                                        </div>
                                      </div>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Sales Opportunities Tab */}
              <TabsContent value="opportunities">
                <div className="space-y-6">
                  <Card className="p-6 border-0 shadow-xl bg-gradient-to-br from-purple-50 to-blue-50">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Analyze Client for Opportunities</h3>
                    <p className="text-gray-700 mb-4">
                      Select a client to analyze their project history and identify cross-selling/up-selling opportunities
                    </p>
                  </Card>

                  {projects.length === 0 ? (
                    <Card className="p-12 text-center border-0 shadow-xl">
                      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Projects Available</h3>
                      <p className="text-gray-600">Projects will appear here for opportunity analysis</p>
                    </Card>
                  ) : (
                    // Group projects by client
                    Object.entries(
                      projects.reduce((acc, proj) => {
                        if (!acc[proj.client_email]) {
                          acc[proj.client_email] = {
                            email: proj.client_email,
                            name: proj.client_name,
                            projects: []
                          };
                        }
                        acc[proj.client_email].projects.push(proj);
                        return acc;
                      }, {})
                    ).map(([email, client]) => (
                      <Card key={email} className="p-6 border-0 shadow-xl">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{client.name}</h3>
                            <p className="text-gray-600">{email}</p>
                            <Badge className="mt-2 bg-blue-100 text-blue-700">
                              {client.projects.length} project{client.projects.length > 1 ? 's' : ''}
                            </Badge>
                          </div>
                        </div>

                        <Button
                          onClick={() => findOpportunities(email)}
                          disabled={analyzing === email}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 mb-4"
                        >
                          {analyzing === email ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
                          ) : (
                            <><Target className="w-4 h-4 mr-2" /> Find Opportunities</>
                          )}
                        </Button>

                        {analysis[email] && (
                          <div className="space-y-4 border-t border-gray-200 pt-4">
                            {analysis[email].opportunities?.length > 0 && (
                              <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-3">
                                  Identified Opportunities ({analysis[email].opportunities.length})
                                </h4>
                                <div className="space-y-3">
                                  {analysis[email].opportunities.map((opp, idx) => (
                                    <Card key={idx} className={`p-4 ${
                                      opp.priority === 'high' ? 'bg-red-50 border-red-200' :
                                      opp.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                                      'bg-green-50 border-green-200'
                                    }`}>
                                      <div className="flex items-start justify-between mb-2">
                                        <div className="font-bold text-gray-900">{opp.service}</div>
                                        <Badge className={
                                          opp.priority === 'high' ? 'bg-red-600' :
                                          opp.priority === 'medium' ? 'bg-yellow-600' :
                                          'bg-green-600'
                                        }>
                                          {opp.priority} priority
                                        </Badge>
                                      </div>
                                      <div className="text-sm text-gray-700 mb-2">{opp.reasoning}</div>
                                      <div className="text-sm font-semibold text-gray-900">
                                        Action: {opp.suggested_action}
                                      </div>
                                      {opp.estimated_value && (
                                        <div className="text-sm text-gray-600 mt-1">
                                          Est. Value: {opp.estimated_value}
                                        </div>
                                      )}
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            )}

                            {analysis[email].engagement_strategy && (
                              <Card className="p-4 bg-blue-50 border-blue-200">
                                <h4 className="font-bold text-gray-900 mb-2">Engagement Strategy</h4>
                                <p className="text-gray-800">{analysis[email].engagement_strategy}</p>
                              </Card>
                            )}
                          </div>
                        )}
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </InternalLayout>
    </AdminRoute>
  );
}