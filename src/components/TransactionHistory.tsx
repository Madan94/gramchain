'use client';

import { useState } from 'react';
import { User } from '@/app/page';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Search, Filter, Download, ExternalLink } from 'lucide-react';
import { useBlockchain } from '@/src/hooks/useBlockchain';

interface TransactionHistoryProps {
  user: User;
}

export function TransactionHistory({ user }: TransactionHistoryProps) {
  const { transactions } = useBlockchain();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.hash.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;

    // Role-based filtering
    const hasAccess = 
      user.role === 'public' || 
      user.role === 'government' ||
      transaction.from === user.name || 
      transaction.to === user.name;

    return matchesSearch && matchesStatus && matchesType && hasAccess;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'allocation': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'transfer': return 'bg-green-100 text-green-800 border-green-200';
      case 'payment': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Transaction History</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search transactions, hashes, or addresses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="allocation">Allocation</SelectItem>
              <SelectItem value="transfer">Transfer</SelectItem>
              <SelectItem value="payment">Payment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Filter className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No transactions found</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <Card key={transaction.id} className="p-4 hover:shadow-md transition-shadow border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge variant="outline" className={getTypeColor(transaction.type)}>
                        {transaction.type.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(transaction.status)}>
                        {transaction.status.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Block #{transaction.blockHeight}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {transaction.description}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span><strong>From:</strong> {transaction.from}</span>
                      <span><strong>To:</strong> {transaction.to}</span>
                      <span><strong>Hash:</strong> {transaction.hash}</span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      ${transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </p>
                    <Button variant="ghost" size="sm" className="mt-2 text-blue-600 hover:text-blue-800">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View on Chain
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}