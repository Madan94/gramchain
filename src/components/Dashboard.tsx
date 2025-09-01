'use client';

import { useState, useEffect } from 'react';
import { User } from '@/app/page';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { LogOut, Plus, Eye, ArrowUpRight, ArrowDownRight, Clock, CheckCircle } from 'lucide-react';
import { TransactionHistory } from '@/src/components/TransactionHistory';
import { ProjectManagement } from '@/src/components/ProjectManagement';
import { FundAllocation } from '@/src/components/FundAllocation';
import { useBlockchain } from '@/src/hooks/useBlockchain';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const { transactions, projects, totalFunds, pendingTransactions } = useBlockchain();
  const [activeTab, setActiveTab] = useState('overview');

  const roleDisplayName = {
    government: 'Government Official',
    local_authority: 'Local Authority',
    contractor: 'Contractor',
    public: 'Public Viewer'
  };

  const userTransactions = transactions.filter(tx => 
    user.role === 'public' ? true : 
    tx.from === user.name || tx.to === user.name || user.role === 'government'
  );

  const userProjects = projects.filter(project => 
    user.role === 'public' ? true :
    user.role === 'government' ? true :
    user.role === 'local_authority' ? true :
    project.contractor === user.name
  );

  const stats = [
    {
      title: 'Total Funds',
      value: `$${totalFunds.toLocaleString()}`,
      change: '+12.5%',
      icon: ArrowUpRight,
      color: 'text-green-600'
    },
    {
      title: 'Active Projects',
      value: userProjects.filter(p => p.status === 'in_progress').length.toString(),
      change: '+3',
      icon: Clock,
      color: 'text-blue-600'
    },
    {
      title: 'Completed Projects',
      value: userProjects.filter(p => p.status === 'completed').length.toString(),
      change: '+8',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Pending Approvals',
      value: pendingTransactions.toString(),
      change: '-2',
      icon: ArrowDownRight,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Gram Chain</h1>
                <p className="text-sm text-gray-600">
                  Welcome, {user.name} • {roleDisplayName[user.role]}
                </p>
              </div>
              <Badge 
                variant="outline" 
                className={
                  user.role === 'government' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  user.role === 'local_authority' ? 'bg-green-50 text-green-700 border-green-200' :
                  user.role === 'contractor' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                  'bg-purple-50 text-purple-700 border-purple-200'
                }
              >
                {roleDisplayName[user.role]}
              </Badge>
            </div>
            <Button variant="outline" onClick={onLogout} className="flex items-center space-x-2">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            {(user.role === 'government' || user.role === 'local_authority') && (
              <TabsTrigger value="allocate">Allocate Funds</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </CardTitle>
                      <IconComponent className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <p className={`text-xs ${stat.color} flex items-center mt-1`}>
                        {stat.change} from last month
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Recent Activity */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userTransactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'allocation' ? 'bg-blue-100' :
                          transaction.type === 'transfer' ? 'bg-green-100' :
                          'bg-orange-100'
                        }`}>
                          <ArrowUpRight className={`h-4 w-4 ${
                            transaction.type === 'allocation' ? 'text-blue-600' :
                            transaction.type === 'transfer' ? 'text-green-600' :
                            'text-orange-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-sm text-gray-600">
                            {transaction.from} → {transaction.to}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${transaction.amount.toLocaleString()}
                        </p>
                        <Badge 
                          variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionHistory user={user} />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectManagement user={user} />
          </TabsContent>

          {(user.role === 'government' || user.role === 'local_authority') && (
            <TabsContent value="allocate">
              <FundAllocation user={user} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}