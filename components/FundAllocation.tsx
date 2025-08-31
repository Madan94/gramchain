'use client';

import { useState } from 'react';
import { User } from '@/app/page';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { useBlockchain } from '@/hooks/useBlockchain';

interface FundAllocationProps {
  user: User;
}

interface AllocationForm {
  recipientType: 'local_authority' | 'contractor';
  recipient: string;
  amount: string;
  projectId: string;
  description: string;
}

const recipients = {
  local_authority: [
    'Regional Council North',
    'Regional Council South',
    'Regional Council East',
    'Regional Council West'
  ],
  contractor: [
    'GreenSpace Contractors',
    'SportsBuild Inc',
    'Community Builders LLC',
    'Urban Development Co'
  ]
};

export function FundAllocation({ user }: FundAllocationProps) {
  const { projects, addTransaction, addProject } = useBlockchain();
  const [form, setForm] = useState<AllocationForm>({
    recipientType: 'local_authority',
    recipient: '',
    amount: '',
    projectId: '',
    description: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // New project form
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    location: '',
    budget: '',
    contractor: ''
  });
  const [showProjectForm, setShowProjectForm] = useState(false);

  const handleAllocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.recipient || !form.amount || !form.description) return;

    setLoading(true);

    // Simulate blockchain transaction delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const transaction = addTransaction({
      from: user.role === 'government' ? 'Government Treasury' : user.name,
      to: form.recipient,
      amount: parseInt(form.amount),
      type: form.recipientType === 'local_authority' ? 'allocation' : 'payment',
      projectId: form.projectId,
      description: form.description,
      status: 'completed'
    });

    // Update project allocated funds if project is selected
    if (form.projectId) {
      const project = projects.find(p => p.id === form.projectId);
      if (project) {
        updateProject(form.projectId, {
          allocatedFunds: project.allocatedFunds + parseInt(form.amount)
        });
      }
    }

    setForm({
      recipientType: 'local_authority',
      recipient: '',
      amount: '',
      projectId: '',
      description: ''
    });

    setLoading(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name || !newProject.budget) return;

    setLoading(true);

    const project = addProject({
      name: newProject.name,
      description: newProject.description,
      location: newProject.location,
      totalBudget: parseInt(newProject.budget),
      allocatedFunds: 0,
      spentFunds: 0,
      status: 'planning',
      contractor: newProject.contractor || undefined,
      milestones: [
        {
          id: 'ms_' + Math.random().toString(36).substr(2, 6),
          name: 'Project Initiation',
          description: 'Initial project setup and planning',
          amount: Math.floor(parseInt(newProject.budget) * 0.2),
          status: 'pending'
        },
        {
          id: 'ms_' + Math.random().toString(36).substr(2, 6),
          name: 'Development Phase',
          description: 'Main construction and development work',
          amount: Math.floor(parseInt(newProject.budget) * 0.6),
          status: 'pending'
        },
        {
          id: 'ms_' + Math.random().toString(36).substr(2, 6),
          name: 'Project Completion',
          description: 'Final touches and project handover',
          amount: Math.floor(parseInt(newProject.budget) * 0.2),
          status: 'pending'
        }
      ]
    });

    setNewProject({
      name: '',
      description: '',
      location: '',
      budget: '',
      contractor: ''
    });

    setLoading(false);
    setShowProjectForm(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Fund Allocation</h2>
        {user.role === 'government' && (
          <Button 
            onClick={() => setShowProjectForm(!showProjectForm)}
            variant={showProjectForm ? 'outline' : 'default'}
            className={!showProjectForm ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            {showProjectForm ? 'Cancel' : 'Create New Project'}
          </Button>
        )}
      </div>

      {/* Success Message */}
      {showSuccess && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Transaction successfully added to blockchain!</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create New Project */}
        {user.role === 'government' && showProjectForm && (
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <span>Create New Project</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    placeholder="e.g., Community Recreation Center"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newProject.location}
                    onChange={(e) => setNewProject({...newProject, location: e.target.value})}
                    placeholder="e.g., Downtown District, Eastern Region"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="budget">Total Budget ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={newProject.budget}
                    onChange={(e) => setNewProject({...newProject, budget: e.target.value})}
                    placeholder="1000000"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contractor">Contractor (Optional)</Label>
                  <Select value={newProject.contractor} onValueChange={(value) => setNewProject({...newProject, contractor: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select contractor" />
                    </SelectTrigger>
                    <SelectContent>
                      {recipients.contractor.map((contractor) => (
                        <SelectItem key={contractor} value={contractor}>
                          {contractor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="projectDescription">Description</Label>
                  <Textarea
                    id="projectDescription"
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    placeholder="Detailed project description..."
                    rows={3}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Creating Project...' : 'Create Project'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Fund Allocation Form */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Send className="h-5 w-5 text-blue-600" />
              <span>Allocate Funds</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAllocation} className="space-y-4">
              <div>
                <Label htmlFor="recipientType">Recipient Type</Label>
                <Select value={form.recipientType} onValueChange={(value: 'local_authority' | 'contractor') => setForm({...form, recipientType: value, recipient: ''})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local_authority">Local Authority</SelectItem>
                    <SelectItem value="contractor">Contractor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="recipient">Recipient</Label>
                <Select value={form.recipient} onValueChange={(value) => setForm({...form, recipient: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    {recipients[form.recipientType].map((recipient) => (
                      <SelectItem key={recipient} value={recipient}>
                        {recipient}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="project">Project (Optional)</Label>
                <Select value={form.projectId} onValueChange={(value) => setForm({...form, projectId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No specific project</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({...form, amount: e.target.value})}
                  placeholder="100000"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  placeholder="Purpose of fund allocation..."
                  rows={3}
                  required
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Blockchain Transaction</p>
                    <p className="text-xs text-yellow-700 mt-1">
                      This allocation will be permanently recorded on the blockchain and cannot be reversed.
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading || !form.recipient || !form.amount || !form.description}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Processing on Blockchain...' : 'Allocate Funds'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}