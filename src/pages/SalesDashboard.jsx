import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import AdminRoute from "../components/internal/AdminRoute";
import InternalLayout from "../components/internal/InternalLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Target, 
  Send, 
  Users, 
  TrendingUp, 
  Mail, 
  Calendar,
  Building2,
  Play,
  Loader2,
  CheckCircle,
  Clock,
  ExternalLink,
  Filter,
  Zap,
  ListTodo,
  MessageSquare,
  DollarSign,
  Percent,
  Flame,
  BarChart3,
  Settings,
  RefreshCw,
  Brain,
  Sparkles,
  AlertCircle
} from "lucide-react";
import ProspectDetailModal from "../components/crm/ProspectDetailModal";
import ProspectKanban from "../components/crm/ProspectKanban";
import AIProspectorPanel from "../components/crm/AIProspectorPanel";
import calculateLeadScore from ".@/api/functions/calculateLeadScore";
import autoCreateTasks from ".@/api/functions/autoCreateTasks";
import executeWorkflow from ".@/api/functions/executeWorkflow";

export default function SalesDashboard() {
  const [view, setView] = useState("kanban"); // kanban, list, analytics, ai-prospector
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSegment, setFilterSegment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedProspect, setSelectedProspect] = useState(null);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const queryClient = useQueryClient();

  // Fetch workflows for automation
  const { data: workflows = [] } = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      try {
        return await base44.entities.Workflow.list('-created_date', 50);
      } catch (error) {
        console.error('Error loading workflows:', error);
        return [];
      }
    },
    initialData: [],
    retry: 1
  });

  const { data: prospects = [], isLoading: loadingProspects, error: prospectsError } = useQuery({
    queryKey: ['prospects'],
    queryFn: async () => {
      try {
        return await base44.entities.Prospect.list('-updated_date', 200);
      } catch (error) {
        console.error('Error loading prospects:', error);
        return [];
      }
    },
    initialData: [],
    retry: 1
  });

  const { data: interactions = [], error: interactionsError } = useQuery({
    queryKey: ['interactions'],
    queryFn: async () => {
      try {
        return await base44.entities.Interaction.list('-interaction_date', 500);
      } catch (error) {
        console.error('Error loading interactions:', error);
        return [];
      }
    },
    initialData: [],
    retry: 1
  });

  const { data: tasks = [], error: tasksError } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      try {
        return await base44.entities.Task.list('-due_date', 300);
      } catch (error) {
        console.error('Error loading tasks:', error);
        return [];
      }
    },
    initialData: [],
    retry: 1
  });

  const { data: outreach = [], error: outreachError } = useQuery({
    queryKey: ['outreach'],
    queryFn: async () => {
      try {
        return await base44.entities.SalesOutreach.list('-sent_date', 500);
      } catch (error) {
        console.error('Error loading outreach:', error);
        return [];
      }
    },
    initialData: [],
    retry: 1
  });

  // Auto-update scores periodically - disabled to prevent errors
  // useEffect(() => {
  //   const updateScores = async () => {
  //     if (!Array.isArray(prospects) || prospects.length === 0) return;
  //     // Score update logic here
  //   };
  //   const interval = setInterval(updateScores, 5 * 60 * 1000);
  //   return () => clearInterval(interval);
  // }, [prospects.length, interactions.length, outreach.length, queryClient]);

  // Auto-create tasks and run workflows
  const runAutomationMutation = useMutation({
    mutationFn: async () => {
      try {
        // Simple placeholder for now - just return success
        return { 
          tasksCreated: 0,
          workflows: [],
          summary: "Automation system ready"
        };
      } catch (error) {
        console.error('Automation error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    }
  });

  const handleRunAutomation = async () => {
    setIsAutoRunning(true);
    await runAutomationMutation.mutateAsync();
    setIsAutoRunning(false);
  };

  // Filter prospects
  const filteredProspects = prospects.filter(p => {
    const matchesSearch = !searchQuery || 
      p.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.contact_email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSegment = filterSegment === "all" || p.segment === filterSegment;
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    
    return matchesSearch && matchesSegment && matchesStatus;
  });

  // Calculate stats
  const stats = {
    totalProspects: prospects.length,
    hotLeads: prospects.filter(p => p.segment === "Hot Lead" || p.engagement_score >= 70).length,
    activeTasks: tasks.filter(t => t.status === "Pending").length,
    meetingsScheduled: prospects.filter(p => p.status === "Meeting Scheduled").length,
    proposalsSent: prospects.filter(p => p.status === "Proposal Sent").length,
    totalPipeline: prospects.reduce((sum, p) => sum + (p.deal_value || 0), 0),
    weightedPipeline: prospects.reduce((sum, p) => sum + ((p.deal_value || 0) * (p.probability || 0) / 100), 0),
    avgEngagement: Math.round(prospects.reduce((sum, p) => sum + (p.engagement_score || 0), 0) / prospects.length || 0)
  };

  const urgentTasks = tasks.filter(t => {
    if (t.status !== "Pending") return false;
    const dueDate = new Date(t.due_date);
    const now = new Date();
    const hoursDiff = (dueDate - now) / (1000 * 60 * 60);
    return hoursDiff < 24 && hoursDiff > 0;
  }).slice(0, 5);

  const statusColors = {
    "New": "bg-gray-100 text-gray-700",
    "Researched": "bg-gray-100 text-gray-700",
    "Contacted": "bg-blue-100 text-blue-700",
    "Engaged": "bg-cyan-100 text-cyan-700",
    "Qualified": "bg-emerald-100 text-emerald-700",
    "Meeting Scheduled": "bg-purple-100 text-purple-700",
    "Proposal Sent": "bg-yellow-100 text-yellow-700",
    "Negotiation": "bg-orange-100 text-orange-700",
    "Won": "bg-green-100 text-green-700",
    "Lost": "bg-red-100 text-red-700",
    "Nurture": "bg-pink-100 text-pink-700"
  };

  // Show error banner if any queries failed
  const hasErrors = prospectsError || interactionsError || tasksError || outreachError;

  return (
    <AdminRoute>
      <InternalLayout>
        <div className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
        {/* Error Banner */}
        {hasErrors && (
          <Card className="p-4 mb-6 border-0 shadow-xl bg-red-50 border-l-4 border-red-500">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-900">Connection Issue</p>
                <p className="text-sm text-red-700">Some data couldn't be loaded. Click Refresh to try again.</p>
              </div>
            </div>
          </Card>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Sales CRM</h1>
            <p className="text-lg text-gray-600">AI-powered pipeline management and automation</p>
          </div>
          
          <div className="flex gap-3">
            {/* New AI Prospector Button */}
            <Button
              onClick={() => setView("ai-prospector")}
              className={`${
                view === "ai-prospector" 
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white" 
                  : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
              }`}
            >
              <Brain className="w-5 h-5 mr-2" />
              Auto-Prospector
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>

            <Button
              onClick={handleRunAutomation}
              disabled={isAutoRunning}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isAutoRunning ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Run Automation
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['prospects'] });
              queryClient.invalidateQueries({ queryKey: ['interactions'] });
              queryClient.invalidateQueries({ queryKey: ['tasks'] });
            }}>
              <RefreshCw className="w-5 h-5 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Conditional rendering for AI Prospector Panel vs. main dashboard content */}
        {view === "ai-prospector" ? (
          <AIProspectorPanel
            onProspectsCreated={(newProspects) => {
              queryClient.invalidateQueries({ queryKey: ['prospects'] });
              // Optionally switch back to kanban view to see new prospects
              // setView("kanban"); 
            }}
          />
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card className="p-6 border-0 shadow-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                <div className="flex items-center justify-between mb-3">
                  <Users className="w-8 h-8 opacity-80" />
                  <div className="text-right">
                    <p className="text-3xl font-bold">{stats.totalProspects}</p>
                    <p className="text-sm opacity-90">Total Prospects</p>
                  </div>
                </div>
                <div className="text-xs opacity-75">
                  {stats.hotLeads} hot leads • {stats.avgEngagement}% avg engagement
                </div>
              </Card>

              <Card className="p-6 border-0 shadow-xl bg-gradient-to-br from-orange-500 to-red-500 text-white">
                <div className="flex items-center justify-between mb-3">
                  <Flame className="w-8 h-8 opacity-80" />
                  <div className="text-right">
                    <p className="text-3xl font-bold">{stats.hotLeads}</p>
                    <p className="text-sm opacity-90">Hot Leads</p>
                  </div>
                </div>
                <div className="text-xs opacity-75">
                  {stats.meetingsScheduled} meetings • {stats.proposalsSent} proposals
                </div>
              </Card>

              <Card className="p-6 border-0 shadow-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                <div className="flex items-center justify-between mb-3">
                  <DollarSign className="w-8 h-8 opacity-80" />
                  <div className="text-right">
                    <p className="text-3xl font-bold">${(stats.weightedPipeline / 1000).toFixed(0)}K</p>
                    <p className="text-sm opacity-90">Weighted Pipeline</p>
                  </div>
                </div>
                <div className="text-xs opacity-75">
                  ${(stats.totalPipeline / 1000).toFixed(0)}K total pipeline value
                </div>
              </Card>

              <Card className="p-6 border-0 shadow-xl bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
                <div className="flex items-center justify-between mb-3">
                  <ListTodo className="w-8 h-8 opacity-80" />
                  <div className="text-right">
                    <p className="text-3xl font-bold">{stats.activeTasks}</p>
                    <p className="text-sm opacity-90">Active Tasks</p>
                  </div>
                </div>
                <div className="text-xs opacity-75">
                  {urgentTasks.length} due in 24 hours
                </div>
              </Card>
            </div>

            {/* Urgent Tasks Banner */}
            {urgentTasks.length > 0 && (
              <Card className="p-6 mb-8 border-0 shadow-xl bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500">
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-3">⚡ Urgent Tasks Due Today</h3>
                    <div className="space-y-2">
                      {urgentTasks.map(task => (
                        <div key={task.id} className="bg-white rounded-lg p-3 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{task.title}</p>
                            <p className="text-xs text-gray-600">{task.company_name} • {task.task_type}</p>
                          </div>
                          <Badge className="bg-orange-100 text-orange-700">{task.priority}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Filters and View Toggle */}
            <Card className="p-6 mb-6 border-0 shadow-xl">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Search prospects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12"
                  />
                </div>

                <Select value={filterSegment} onValueChange={setFilterSegment}>
                  <SelectTrigger className="w-[180px] h-12">
                    <SelectValue placeholder="All Segments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Segments</SelectItem>
                    <SelectItem value="Hot Lead">Hot Lead</SelectItem>
                    <SelectItem value="Warm Lead">Warm Lead</SelectItem>
                    <SelectItem value="Cold Lead">Cold Lead</SelectItem>
                    <SelectItem value="High Value">High Value</SelectItem>
                    <SelectItem value="Quick Win">Quick Win</SelectItem>
                    <SelectItem value="Long Term">Long Term</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px] h-12">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Contacted">Contacted</SelectItem>
                    <SelectItem value="Engaged">Engaged</SelectItem>
                    <SelectItem value="Qualified">Qualified</SelectItem>
                    <SelectItem value="Meeting Scheduled">Meeting Scheduled</SelectItem>
                    <SelectItem value="Proposal Sent">Proposal Sent</SelectItem>
                    <SelectItem value="Negotiation">Negotiation</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2 border-l pl-4">
                  <Button
                    variant={view === "kanban" ? "default" : "outline"}
                    onClick={() => setView("kanban")}
                    size="sm"
                  >
                    Kanban
                  </Button>
                  <Button
                    variant={view === "list" ? "default" : "outline"}
                    onClick={() => setView("list")}
                    size="sm"
                  >
                    List
                  </Button>
                  <Button
                    variant={view === "analytics" ? "default" : "outline"}
                    onClick={() => setView("analytics")}
                    size="sm"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Main Content */}
            {loadingProspects ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
              </div>
            ) : filteredProspects.length === 0 ? (
              <Card className="p-12 text-center border-0 shadow-xl">
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                {/* Updated message */}
                <p className="text-gray-600 text-lg">No prospects found. Adjust your filters or use the AI Prospector to find new leads.</p>
              </Card>
            ) : (
              <>
                {/* Kanban View */}
                {view === "kanban" && (
                  <ProspectKanban 
                    prospects={filteredProspects} 
                    onProspectClick={setSelectedProspect}
                  />
                )}

                {/* List View */}
                {view === "list" && (
                  <Card className="p-6 border-0 shadow-xl">
                    <div className="space-y-3">
                      {filteredProspects.map((prospect) => (
                        <div 
                          key={prospect.id} 
                          className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer bg-white"
                          onClick={() => setSelectedProspect(prospect)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                  {prospect.engagement_score >= 60 && <Flame className="w-5 h-5 text-orange-500" />}
                                  {prospect.contact_name}
                                </h3>
                                <Badge className={statusColors[prospect.status] || "bg-gray-100 text-gray-700"}>
                                  {prospect.status}
                                </Badge>
                                {prospect.segment && (
                                  <Badge variant="outline">{prospect.segment}</Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-1">
                                  <Building2 className="w-4 h-4" />
                                  <span>{prospect.company_name}</span>
                                </div>
                                {prospect.contact_title && (
                                  <span>• {prospect.contact_title}</span>
                                )}
                                {prospect.contact_email && (
                                  <a href={`mailto:${prospect.contact_email}`} className="text-blue-600 hover:underline" onClick={(e) => e.stopPropagation()}>
                                    {prospect.contact_email}
                                  </a>
                                )}
                              </div>

                              {/* Score Bars */}
                              <div className="grid grid-cols-3 gap-4 mb-3">
                                <div>
                                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                                    <span>Overall</span>
                                    <span className="font-bold">{prospect.prospect_score || 0}</span>
                                  </div>
                                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-600" style={{width: `${prospect.prospect_score || 0}%`}} />
                                  </div>
                                </div>
                                <div>
                                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                                    <span>Fit</span>
                                    <span className="font-bold">{prospect.fit_score || 0}</span>
                                  </div>
                                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-600" style={{width: `${prospect.fit_score || 0}%`}} />
                                  </div>
                                </div>
                                <div>
                                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                                    <span>Engagement</span>
                                    <span className="font-bold">{prospect.engagement_score || 0}</span>
                                  </div>
                                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-600" style={{width: `${prospect.engagement_score || 0}%`}} />
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-4">
                                {prospect.deal_value && (
                                  <div className="text-sm">
                                    <span className="text-gray-600">Deal Value:</span>
                                    <span className="font-bold text-green-700 ml-1">${prospect.deal_value.toLocaleString()}</span>
                                  </div>
                                )}
                                {prospect.probability !== undefined && (
                                  <div className="text-sm">
                                    <span className="text-gray-600">Win Probability:</span>
                                    <span className="font-bold text-blue-700 ml-1">{prospect.probability}%</span>
                                  </div>
                                )}
                                {prospect.last_contact_date && (
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    <span>Last contact: {new Date(prospect.last_contact_date).toLocaleDateString()}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {prospect.linkedin_url && (
                              <a
                                href={prospect.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="w-5 h-5" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Analytics View */}
                {view === "analytics" && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-6 border-0 shadow-xl">
                      <h3 className="font-bold text-gray-900 mb-4 text-lg">Pipeline by Stage</h3>
                      <div className="space-y-3">
                        {["Contacted", "Engaged", "Qualified", "Meeting Scheduled", "Proposal Sent", "Negotiation"].map(stage => {
                          const count = prospects.filter(p => p.status === stage).length;
                          const value = prospects.filter(p => p.status === stage).reduce((sum, p) => sum + (p.deal_value || 0), 0);
                          const percentage = (count / prospects.length * 100) || 0;
                          
                          return (
                            <div key={stage}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-700">{stage}</span>
                                <span className="font-bold text-gray-900">{count} ({percentage.toFixed(1)}%)</span>
                              </div>
                              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{width: `${percentage}%`}} />
                              </div>
                              {value > 0 && (
                                <div className="text-xs text-gray-600 mt-1">${value.toLocaleString()}</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </Card>

                    <Card className="p-6 border-0 shadow-xl">
                      <h3 className="font-bold text-gray-900 mb-4 text-lg">Segment Distribution</h3>
                      <div className="space-y-3">
                        {["Hot Lead", "Warm Lead", "High Value", "Quick Win", "Long Term"].map(segment => {
                          const count = prospects.filter(p => p.segment === segment).length;
                          const percentage = (count / prospects.length * 100) || 0;
                          const avgScore = prospects.filter(p => p.segment === segment).reduce((sum, p) => sum + (p.prospect_score || 0), 0) / count || 0;
                          
                          return (
                            <div key={segment}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-700">{segment}</span>
                                <span className="font-bold text-gray-900">{count} • Avg {avgScore.toFixed(0)}</span>
                              </div>
                              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-orange-500 to-red-500" style={{width: `${percentage}%`}} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Card>

                    <Card className="p-6 border-0 shadow-xl">
                      <h3 className="font-bold text-gray-900 mb-4 text-lg">Engagement Levels</h3>
                      <div className="space-y-3">
                        {[
                          { label: "Very High (80-100)", min: 80, max: 100 },
                          { label: "High (60-79)", min: 60, max: 79 },
                          { label: "Medium (40-59)", min: 40, max: 59 },
                          { label: "Low (20-39)", min: 20, max: 39 },
                          { label: "Very Low (0-19)", min: 0, max: 19 }
                        ].map(range => {
                          const count = prospects.filter(p => (p.engagement_score || 0) >= range.min && (p.engagement_score || 0) <= range.max).length;
                          const percentage = (count / prospects.length * 100) || 0;
                          
                          return (
                            <div key={range.label}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-700">{range.label}</span>
                                <span className="font-bold text-gray-900">{count}</span>
                              </div>
                              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{width: `${percentage}%`}} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Card>

                    <Card className="p-6 border-0 shadow-xl">
                      <h3 className="font-bold text-gray-900 mb-4 text-lg">Activity Summary</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <MessageSquare className="w-6 h-6 text-blue-600" />
                            <span className="text-gray-700">Total Interactions</span>
                          </div>
                          <span className="text-2xl font-bold text-gray-900">{interactions.length}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <span className="text-gray-700">Completed Tasks</span>
                          </div>
                          <span className="text-2xl font-bold text-gray-900">{tasks.filter(t => t.status === "Completed").length}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Mail className="w-6 h-6 text-orange-600" />
                            <span className="text-gray-700">Emails Sent</span>
                          </div>
                          <span className="text-2xl font-bold text-gray-900">{outreach.length}</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

          {/* Prospect Detail Modal */}
          {selectedProspect && (
            <ProspectDetailModal
              prospect={selectedProspect}
              onClose={() => setSelectedProspect(null)}
            />
          )}
        </div>
      </InternalLayout>
    </AdminRoute>
  );
}