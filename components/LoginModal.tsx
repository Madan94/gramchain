'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, UserRole } from '@/app/page';

interface LoginModalProps {
  role: UserRole;
  onLogin: (user: User) => void;
  onClose: () => void;
}

const roleDetails = {
  government: {
    title: 'Government / NGO Login',
    organization: 'Ministry of Rural Development',
    users: [
      { name: 'Sarah Johnson', email: 'sarah.johnson@gov.ru' },
      { name: 'Michael Chen', email: 'michael.chen@ngo.org' }
    ]
  },
  local_authority: {
    title: 'Local Authority Login',
    organization: 'Regional Development Council',
    users: [
      { name: 'David Martinez', email: 'david.martinez@regional.gov' },
      { name: 'Emma Thompson', email: 'emma.thompson@council.gov' }
    ]
  },
  contractor: {
    title: 'Contractor Login',
    organization: 'Construction Partners Ltd',
    users: [
      { name: 'James Wilson', email: 'james.wilson@builders.com' },
      { name: 'Lisa Garcia', email: 'lisa.garcia@construction.co' }
    ]
  },
  public: {
    title: 'Public Access',
    organization: 'General Public',
    users: [
      { name: 'Anonymous Viewer', email: 'public@viewer.com' }
    ]
  }
};

export function LoginModal({ role, onLogin, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const details = roleDetails[role];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: details.users[0].name,
      email: email || details.users[0].email,
      role,
      organization: details.organization
    };

    onLogin(user);
    setLoading(false);
  };

  const handleDemoLogin = () => {
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: details.users[0].name,
      email: details.users[0].email,
      role,
      organization: details.organization
    };
    onLogin(user);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{details.title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder={details.users[0].email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Demo Access Available:</strong>
            </p>
            <p className="text-xs text-gray-500">
              For demonstration purposes, you can use demo credentials or enter any email/password.
            </p>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleDemoLogin}
              className="w-full sm:w-auto"
            >
              Demo Login
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Authenticating...' : 'Login'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}