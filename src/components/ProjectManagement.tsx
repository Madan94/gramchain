'use client';

import { useState } from 'react';
import { User } from '@/app/page';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Progress } from '@/src/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/ui/dialog';
import { MapPin, Calendar, DollarSign, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useBlockchain } from '@/src/hooks/useBlockchain';
import { MilestoneSubmission } from '@/src/components/MilestoneSubmission';

interface ProjectManagementProps {
  user: User;
}

export function ProjectManagement({ user }: ProjectManagementProps) {
  const { projects, addTransaction, updateProject } = useBlockchain();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const userProjects = projects.filter(project => 
    user.role === 'public' ? true :
    user.role === 'government' ? true :
    user.role === 'local_authority' ? true :
    project.contractor === user.name
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'planning': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in_progress': return Clock;
      case 'approved': return CheckCircle;
      case 'planning': return AlertCircle;
      default: return Clock;
    }
  };

  const handleMilestoneSubmission = (projectId: string, milestoneId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const milestone = project.milestones.find(m => m.id === milestoneId);
    if (!milestone) return;

    // Update milestone status
    const updatedMilestones = project.milestones.map(m =>
      m.id === milestoneId 
        ? { ...m, status: 'submitted' as const, submittedAt: Date.now() }
        : m
    );

    updateProject(projectId, { milestones: updatedMilestones });

    // Create transaction
    addTransaction({
      from: user.name,
      to: 'Local Authority',
      amount: milestone.amount,
      type: 'payment',
      projectId,
      description: `Milestone submission: ${milestone.name}`,
      status: 'pending'
    });
  };

  const handleMilestoneApproval = (projectId: string, milestoneId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const milestone = project.milestones.find(m => m.id === milestoneId);
    if (!milestone) return;

    // Update milestone status
    const updatedMilestones = project.milestones.map(m =>
      m.id === milestoneId 
        ? { ...m, status: 'paid' as const, approvedAt: Date.now() }
        : m
    );

    const newSpentFunds = project.spentFunds + milestone.amount;

    updateProject(projectId, { 
      milestones: updatedMilestones,
      spentFunds: newSpentFunds 
    });

    // Create payment transaction
    addTransaction({
      from: 'Local Authority',
      to: project.contractor || 'Contractor',
      amount: milestone.amount,
      type: 'payment',
      projectId,
      description: `Payment approved: ${milestone.name}`,
      status: 'completed'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Project Management</h2>
        {user.role === 'government' && (
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Users className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {userProjects.map((project) => {
          const StatusIcon = getStatusIcon(project.status);
          const progress = (project.spentFunds / project.totalBudget) * 100;
          const completedMilestones = project.milestones.filter(m => m.status === 'paid').length;

          return (
            <Card key={project.id} className="hover:shadow-lg transition-shadow border border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{project.name}</CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className={getStatusColor(project.status)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {project.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600 space-x-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{project.location}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {project.description}
                </p>

                {/* Budget Info */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Budget Progress</span>
                    <span className="font-medium">${project.spentFunds.toLocaleString()} / ${project.totalBudget.toLocaleString()}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{progress.toFixed(1)}% spent</span>
                    <span>{completedMilestones} / {project.milestones.length} milestones</span>
                  </div>
                </div>

                {/* Milestones */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 text-sm">Recent Milestones</h4>
                  <div className="space-y-1">
                    {project.milestones.slice(0, 2).map((milestone) => (
                      <div key={milestone.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">{milestone.name}</span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            milestone.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' :
                            milestone.status === 'submitted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            milestone.status === 'approved' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            'bg-gray-50 text-gray-700 border-gray-200'
                          }`}
                        >
                          {milestone.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{project.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-2">Project Details</h4>
                            <div className="space-y-2 text-sm">
                              <p><strong>Location:</strong> {project.location}</p>
                              <p><strong>Contractor:</strong> {project.contractor || 'Not assigned'}</p>
                              <p><strong>Created:</strong> {new Date(project.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Budget Overview</h4>
                            <div className="space-y-2 text-sm">
                              <p><strong>Total Budget:</strong> ${project.totalBudget.toLocaleString()}</p>
                              <p><strong>Allocated:</strong> ${project.allocatedFunds.toLocaleString()}</p>
                              <p><strong>Spent:</strong> ${project.spentFunds.toLocaleString()}</p>
                              <p><strong>Remaining:</strong> ${(project.totalBudget - project.spentFunds).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-3">Milestones</h4>
                          <div className="space-y-3">
                            {project.milestones.map((milestone) => (
                              <div key={milestone.id} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-medium">{milestone.name}</h5>
                                  <div className="flex items-center space-x-2">
                                    <Badge variant="outline" className={
                                      milestone.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' :
                                      milestone.status === 'submitted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                      milestone.status === 'approved' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                      'bg-gray-50 text-gray-700 border-gray-200'
                                    }>
                                      {milestone.status}
                                    </Badge>
                                    <span className="font-semibold">${milestone.amount.toLocaleString()}</span>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>
                                <div className="flex justify-between items-center">
                                  <div className="text-xs text-gray-500">
                                    {milestone.submittedAt && (
                                      <span>Submitted: {new Date(milestone.submittedAt).toLocaleDateString()}</span>
                                    )}
                                    {milestone.approvedAt && (
                                      <span className="ml-4">Approved: {new Date(milestone.approvedAt).toLocaleDateString()}</span>
                                    )}
                                  </div>
                                  <div className="flex space-x-2">
                                    {user.role === 'contractor' && milestone.status === 'pending' && project.contractor === user.name && (
                                      <Button 
                                        size="sm" 
                                        onClick={() => handleMilestoneSubmission(project.id, milestone.id)}
                                        className="bg-blue-600 hover:bg-blue-700"
                                      >
                                        Submit
                                      </Button>
                                    )}
                                    {user.role === 'local_authority' && milestone.status === 'submitted' && (
                                      <Button 
                                        size="sm" 
                                        onClick={() => handleMilestoneApproval(project.id, milestone.id)}
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        Approve Payment
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  {user.role === 'contractor' && project.contractor === user.name && (
                    <MilestoneSubmission projectId={project.id} />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}