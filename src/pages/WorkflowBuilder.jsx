import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import AdminRoute from "../components/internal/AdminRoute";
import InternalLayout from "../components/internal/InternalLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Workflow as WorkflowIcon,
  Plus,
  Trash2,
  Play,
  Pause,
  Edit,
  Save,
  X,
  ChevronRight,
  Zap,
  Clock,
  Mail,
  CheckSquare,
  FileEdit,
  MessageSquare,
  Target,
  TrendingUp,
  Calendar,
  AlertCircle
} from "lucide-react";

export default function WorkflowBuilder() {
  const queryClient = useQueryClient();
  const [editingWorkflow, setEditingWorkflow] = useState(null);
  const [showBuilder, setShowBuilder] = useState(false);

  const { data: workflows = [], isLoading } = useQuery({
    queryKey: ['workflows'],
    queryFn: () => base44.entities.Workflow.list('-created_date', 100),
    initialData: []
  });

  const createWorkflowMutation = useMutation({
    mutationFn: (data) => base44.entities.Workflow.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      setShowBuilder(false);
      setEditingWorkflow(null);
    }
  });

  const updateWorkflowMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Workflow.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      setShowBuilder(false);
      setEditingWorkflow(null);
    }
  });

  const deleteWorkflowMutation = useMutation({
    mutationFn: (id) => base44.entities.Workflow.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    }
  });

  const toggleWorkflowMutation = useMutation({
    mutationFn: ({ id, active }) => base44.entities.Workflow.update(id, { active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    }
  });

  const startNewWorkflow = () => {
    setEditingWorkflow({
      name: "",
      description: "",
      active: true,
      trigger_type: "status_change",
      trigger_config: { from_status: "", to_status: "Qualified" },
      steps: []
    });
    setShowBuilder(true);
  };

  const startEditWorkflow = (workflow) => {
    setEditingWorkflow(workflow);
    setShowBuilder(true);
  };

  const triggerIcons = {
    status_change: Target,
    date_based: Calendar,
    score_threshold: TrendingUp,
    interaction_added: MessageSquare,
    task_completed: CheckSquare
  };

  const actionIcons = {
    create_task: CheckSquare,
    send_email: Mail,
    update_prospect: FileEdit,
    wait_days: Clock,
    create_interaction: MessageSquare
  };

  if (showBuilder) {
    return (
      <WorkflowBuilderForm
        workflow={editingWorkflow}
        onSave={(data) => {
          if (editingWorkflow?.id) {
            updateWorkflowMutation.mutate({ id: editingWorkflow.id, data });
          } else {
            createWorkflowMutation.mutate(data);
          }
        }}
        onCancel={() => {
          setShowBuilder(false);
          setEditingWorkflow(null);
        }}
        isSaving={createWorkflowMutation.isPending || updateWorkflowMutation.isPending}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Workflow Automation</h1>
            <p className="text-lg text-gray-600">Create custom multi-step processes triggered by prospect events</p>
          </div>
          <Button
            onClick={startNewWorkflow}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Workflow
          </Button>
        </div>

        {/* Workflow Templates */}
        <Card className="p-6 mb-8 border-0 shadow-xl bg-gradient-to-r from-purple-50 to-pink-50">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            Quick Start Templates
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                name: "Qualified Lead Workflow",
                trigger: "Status → Qualified",
                actions: "Create follow-up task • Send proposal email • Update deal stage"
              },
              {
                name: "Meeting Scheduled Prep",
                trigger: "Status → Meeting Scheduled",
                actions: "Create prep task • Wait 1 day • Send reminder email"
              },
              {
                name: "Hot Lead Alert",
                trigger: "Engagement Score ≥ 70",
                actions: "Update segment • Create urgent task • Send notification"
              }
            ].map((template, idx) => (
              <Card key={idx} className="p-4 border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer bg-white">
                <h4 className="font-semibold text-gray-900 mb-2">{template.name}</h4>
                <p className="text-xs text-gray-600 mb-2">
                  <span className="font-medium">Trigger:</span> {template.trigger}
                </p>
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Actions:</span> {template.actions}
                </p>
              </Card>
            ))}
          </div>
        </Card>

        {/* Active Workflows */}
        <div className="space-y-4">
          {isLoading ? (
            <Card className="p-12 text-center border-0 shadow-xl">
              <p className="text-gray-600">Loading workflows...</p>
            </Card>
          ) : workflows.length === 0 ? (
            <Card className="p-12 text-center border-0 shadow-xl">
              <WorkflowIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-4">No workflows created yet</p>
              <Button onClick={startNewWorkflow}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Workflow
              </Button>
            </Card>
          ) : (
            workflows.map((workflow) => {
              const TriggerIcon = triggerIcons[workflow.trigger_type] || Target;
              
              return (
                <Card key={workflow.id} className="p-6 border-0 shadow-xl hover:shadow-2xl transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-900 text-xl">{workflow.name}</h3>
                        <Badge className={workflow.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                          {workflow.active ? "Active" : "Paused"}
                        </Badge>
                        {workflow.execution_count > 0 && (
                          <Badge variant="outline">{workflow.execution_count} executions</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{workflow.description}</p>
                      
                      {/* Trigger Display */}
                      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <TriggerIcon className="w-4 h-4 text-purple-600" />
                          <span className="font-semibold text-gray-900">Trigger:</span>
                          <span className="text-gray-700">
                            {workflow.trigger_type === "status_change" && 
                              `Status changes to ${workflow.trigger_config?.to_status}`}
                            {workflow.trigger_type === "date_based" && 
                              `Date field ${workflow.trigger_config?.date_field} is reached`}
                            {workflow.trigger_type === "score_threshold" && 
                              `${workflow.trigger_config?.score_field} reaches ${workflow.trigger_config?.threshold}`}
                            {workflow.trigger_type === "interaction_added" && 
                              `New interaction of type ${workflow.trigger_config?.interaction_type || "any"}`}
                            {workflow.trigger_type === "task_completed" && 
                              `Task of type ${workflow.trigger_config?.task_type || "any"} completed`}
                          </span>
                        </div>
                      </div>

                      {/* Steps Display */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-700">Actions:</span>
                        {workflow.steps?.map((step, idx) => {
                          const ActionIcon = actionIcons[step.action_type] || Zap;
                          return (
                            <React.Fragment key={idx}>
                              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg">
                                <ActionIcon className="w-3 h-3 text-gray-600" />
                                <span className="text-xs text-gray-700">
                                  {step.action_type.replace(/_/g, ' ')}
                                </span>
                              </div>
                              {idx < workflow.steps.length - 1 && (
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleWorkflowMutation.mutate({ id: workflow.id, active: !workflow.active })}
                      >
                        {workflow.active ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditWorkflow(workflow)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Delete workflow "${workflow.name}"?`)) {
                            deleteWorkflowMutation.mutate(workflow.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function WorkflowBuilderForm({ workflow, onSave, onCancel, isSaving }) {
  const [formData, setFormData] = useState(workflow);

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...(formData.steps || []), { action_type: "create_task", action_config: {} }]
    });
  };

  const updateStep = (index, updates) => {
    const newSteps = [...formData.steps];
    newSteps[index] = { ...newSteps[index], ...updates };
    setFormData({ ...formData, steps: newSteps });
  };

  const removeStep = (index) => {
    setFormData({
      ...formData,
      steps: formData.steps.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-5xl mx-auto">
        <Card className="p-8 border-0 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              {workflow?.id ? "Edit Workflow" : "Create New Workflow"}
            </h2>
            <Button variant="outline" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Workflow Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Qualified Lead Follow-Up"
                className="h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What does this workflow do?"
                rows={2}
              />
            </div>

            {/* Trigger Configuration */}
            <div className="border-t pt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                Trigger
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Trigger Type</label>
                  <Select 
                    value={formData.trigger_type} 
                    onValueChange={(value) => setFormData({ ...formData, trigger_type: value, trigger_config: {} })}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="status_change">Prospect Status Change</SelectItem>
                      <SelectItem value="date_based">Date/Time Based</SelectItem>
                      <SelectItem value="score_threshold">Score Threshold</SelectItem>
                      <SelectItem value="interaction_added">New Interaction</SelectItem>
                      <SelectItem value="task_completed">Task Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Trigger-specific config */}
                {formData.trigger_type === "status_change" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">When Status Changes To</label>
                    <Select
                      value={formData.trigger_config?.to_status}
                      onValueChange={(value) => setFormData({
                        ...formData,
                        trigger_config: { ...formData.trigger_config, to_status: value }
                      })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Contacted">Contacted</SelectItem>
                        <SelectItem value="Engaged">Engaged</SelectItem>
                        <SelectItem value="Qualified">Qualified</SelectItem>
                        <SelectItem value="Meeting Scheduled">Meeting Scheduled</SelectItem>
                        <SelectItem value="Proposal Sent">Proposal Sent</SelectItem>
                        <SelectItem value="Negotiation">Negotiation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.trigger_type === "score_threshold" && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Score Field</label>
                      <Select
                        value={formData.trigger_config?.score_field}
                        onValueChange={(value) => setFormData({
                          ...formData,
                          trigger_config: { ...formData.trigger_config, score_field: value }
                        })}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prospect_score">Overall Score</SelectItem>
                          <SelectItem value="engagement_score">Engagement Score</SelectItem>
                          <SelectItem value="fit_score">Fit Score</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Threshold Value</label>
                      <Input
                        type="number"
                        value={formData.trigger_config?.threshold || ""}
                        onChange={(e) => setFormData({
                          ...formData,
                          trigger_config: { ...formData.trigger_config, threshold: parseInt(e.target.value) }
                        })}
                        placeholder="70"
                        className="h-12"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Steps Configuration */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <WorkflowIcon className="w-5 h-5 text-purple-600" />
                  Actions ({formData.steps?.length || 0})
                </h3>
                <Button onClick={addStep} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Action
                </Button>
              </div>

              <div className="space-y-4">
                {formData.steps?.map((step, index) => (
                  <StepEditor
                    key={index}
                    step={step}
                    index={index}
                    onChange={(updates) => updateStep(index, updates)}
                    onRemove={() => removeStep(index)}
                  />
                ))}

                {(!formData.steps || formData.steps.length === 0) && (
                  <Card className="p-8 text-center bg-gray-50">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-3">No actions added yet</p>
                    <Button onClick={addStep} variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Action
                    </Button>
                  </Card>
                )}
              </div>
            </div>

            {/* Save Buttons */}
            <div className="flex gap-3 justify-end pt-6 border-t">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                onClick={() => onSave(formData)}
                disabled={isSaving || !formData.name || !formData.trigger_type || !formData.steps?.length}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isSaving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Workflow
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StepEditor({ step, index, onChange, onRemove }) {
  return (
    <Card className="p-4 border-2 border-purple-200">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
          {index + 1}
        </div>
        
        <div className="flex-1 space-y-3">
          <Select
            value={step.action_type}
            onValueChange={(value) => onChange({ action_type: value, action_config: {} })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="create_task">Create Task</SelectItem>
              <SelectItem value="send_email">Send Email</SelectItem>
              <SelectItem value="update_prospect">Update Prospect Field</SelectItem>
              <SelectItem value="wait_days">Wait (Days)</SelectItem>
              <SelectItem value="create_interaction">Log Interaction</SelectItem>
            </SelectContent>
          </Select>

          {/* Action-specific configs */}
          {step.action_type === "create_task" && (
            <div className="space-y-2">
              <Input
                placeholder="Task title"
                value={step.action_config?.title || ""}
                onChange={(e) => onChange({
                  action_config: { ...step.action_config, title: e.target.value }
                })}
              />
              <Select
                value={step.action_config?.task_type}
                onValueChange={(value) => onChange({
                  action_config: { ...step.action_config, task_type: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Task type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Follow-up Call">Follow-up Call</SelectItem>
                  <SelectItem value="Follow-up Email">Follow-up Email</SelectItem>
                  <SelectItem value="Send Proposal">Send Proposal</SelectItem>
                  <SelectItem value="Demo">Demo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {step.action_type === "send_email" && (
            <div className="space-y-2">
              <Input
                placeholder="Email subject"
                value={step.action_config?.subject || ""}
                onChange={(e) => onChange({
                  action_config: { ...step.action_config, subject: e.target.value }
                })}
              />
              <Textarea
                placeholder="Email body (use {{prospect_name}}, {{company_name}} for variables)"
                value={step.action_config?.body || ""}
                onChange={(e) => onChange({
                  action_config: { ...step.action_config, body: e.target.value }
                })}
                rows={3}
              />
            </div>
          )}

          {step.action_type === "update_prospect" && (
            <div className="grid md:grid-cols-2 gap-2">
              <Input
                placeholder="Field name (e.g., segment)"
                value={step.action_config?.field || ""}
                onChange={(e) => onChange({
                  action_config: { ...step.action_config, field: e.target.value }
                })}
              />
              <Input
                placeholder="New value"
                value={step.action_config?.value || ""}
                onChange={(e) => onChange({
                  action_config: { ...step.action_config, value: e.target.value }
                })}
              />
            </div>
          )}

          {step.action_type === "wait_days" && (
            <Input
              type="number"
              placeholder="Number of days"
              value={step.action_config?.days || ""}
              onChange={(e) => onChange({
                action_config: { ...step.action_config, days: parseInt(e.target.value) }
              })}
            />
          )}
        </div>

        <Button variant="outline" size="sm" onClick={onRemove}>
          <Trash2 className="w-4 h-4 text-red-600" />
        </Button>
      </div>
    </Card>
  );
}