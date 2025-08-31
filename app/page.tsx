'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, ShieldCheck, Building, Eye, ArrowRight, Coins, FileText, BarChart3 } from 'lucide-react';
import { LoginModal } from '@/components/LoginModal';
import { Dashboard } from '@/components/Dashboard';

export type UserRole = 'government' | 'local_authority' | 'contractor' | 'public';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
}

export interface Transaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  amount: number;
  type: 'allocation' | 'transfer' | 'payment';
  projectId: string;
  description: string;
  timestamp: number;
  status: 'pending' | 'approved' | 'completed';
  blockHeight: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  totalBudget: number;
  allocatedFunds: number;
  spentFunds: number;
  status: 'planning' | 'approved' | 'in_progress' | 'completed';
  contractor?: string;
  milestones: Milestone[];
  createdAt: number;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  amount: number;
  status: 'pending' | 'submitted' | 'approved' | 'paid';
  submittedAt?: number;
  approvedAt?: number;
}

const roleData = [
  {
    role: 'government' as UserRole,
    title: 'Government / NGO',
    description: 'Allocate funds and oversee projects',
    icon: ShieldCheck,
    permissions: ['Allocate Funds', 'View All Projects', 'Create Projects'],
    color: 'bg-blue-500'
  },
  {
    role: 'local_authority' as UserRole,
    title: 'Local Authority',
    description: 'Manage local projects and approve payments',
    icon: Building,
    permissions: ['Receive Funds', 'Approve Payments', 'Manage Local Projects'],
    color: 'bg-green-500'
  },
  {
    role: 'contractor' as UserRole,
    title: 'Contractor',
    description: 'Execute projects and submit milestones',
    icon: Users,
    permissions: ['Submit Milestones', 'Request Payments', 'View Project Status'],
    color: 'bg-orange-500'
  },
  {
    role: 'public' as UserRole,
    title: 'Public Viewer',
    description: 'View transparent fund tracking',
    icon: Eye,
    permissions: ['View Transactions', 'Track Fund Usage', 'Public Audit'],
    color: 'bg-purple-500'
  }
];

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setShowLogin(true);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setShowLogin(false);
    setSelectedRole(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  if (currentUser) {
    return <Dashboard user={currentUser} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Coins className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FundTracker</h1>
                <p className="text-sm text-gray-600">Blockchain Fund Management Platform</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Secure & Transparent
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Transparent Public Fund Management
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A blockchain-powered platform ensuring complete transparency and accountability 
            in the allocation and tracking of rural public recreation facility funds.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="p-6 text-center bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
              <Coins className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">$2.4M</h3>
            <p className="text-gray-600">Total Funds Tracked</p>
          </Card>
          <Card className="p-6 text-center bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-4">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">156</h3>
            <p className="text-gray-600">Active Projects</p>
          </Card>
          <Card className="p-6 text-center bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">98.2%</h3>
            <p className="text-gray-600">Transparency Score</p>
          </Card>
        </div>

        {/* User Roles */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Choose Your Role to Access the Platform
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roleData.map((role) => {
              const IconComponent = role.icon;
              return (
                <Card 
                  key={role.role}
                  className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-white border-2 hover:border-blue-200"
                  onClick={() => handleRoleSelect(role.role)}
                >
                  <div className="text-center">
                    <div className={`p-4 ${role.color} rounded-full w-fit mx-auto mb-4`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {role.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      {role.description}
                    </p>
                    <div className="space-y-2">
                      {role.permissions.map((permission, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-center text-blue-600">
                      <span className="text-sm font-medium">Access Platform</span>
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Platform Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-4">
                <ShieldCheck className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Immutable Records</h4>
              <p className="text-gray-600 text-sm">
                All transactions are permanently recorded on the blockchain
              </p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-4">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Full Transparency</h4>
              <p className="text-gray-600 text-sm">
                Public access to all fund movements and project progress
              </p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Role-Based Access</h4>
              <p className="text-gray-600 text-sm">
                Secure permissions for different stakeholder types
              </p>
            </div>
          </div>
        </div>

        {/* Public Ledger Preview */}
        <Card className="p-8 bg-white shadow-xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Public Ledger Preview
          </h3>
          <p className="text-gray-600 mb-6">
            See how all transactions are tracked transparently on the blockchain
          </p>
          <Button 
            onClick={() => handleRoleSelect('public')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            View Public Ledger
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Card>
      </div>

      {/* Login Modal */}
      {showLogin && selectedRole && (
        <LoginModal
          role={selectedRole}
          onLogin={handleLogin}
          onClose={() => {
            setShowLogin(false);
            setSelectedRole(null);
          }}
        />
      )}
    </div>
  );
}