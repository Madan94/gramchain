'use client';

import { useState, useEffect } from 'react';
import { Transaction, Project, Milestone } from '@/app/page';

// Simulated blockchain data
const initialTransactions: Transaction[] = [
  {
    id: '1',
    hash: '0x7d1af...',
    from: 'Government Treasury',
    to: 'Regional Council North',
    amount: 500000,
    type: 'allocation',
    projectId: 'proj_001',
    description: 'Initial allocation for Community Park Development',
    timestamp: Date.now() - 86400000 * 7,
    status: 'completed',
    blockHeight: 12345
  },
  {
    id: '2',
    hash: '0x8e2bg...',
    from: 'Regional Council North',
    to: 'GreenSpace Contractors',
    amount: 150000,
    type: 'payment',
    projectId: 'proj_001',
    description: 'Payment for Phase 1: Site Preparation',
    timestamp: Date.now() - 86400000 * 5,
    status: 'completed',
    blockHeight: 12346
  },
  {
    id: '3',
    hash: '0x9f3ch...',
    from: 'Government Treasury',
    to: 'Regional Council South',
    amount: 750000,
    type: 'allocation',
    projectId: 'proj_002',
    description: 'Allocation for Sports Complex Construction',
    timestamp: Date.now() - 86400000 * 3,
    status: 'pending',
    blockHeight: 12347
  }
];

const initialProjects: Project[] = [
  {
    id: 'proj_001',
    name: 'Community Park Development',
    description: 'Development of a multi-purpose community park with playground, walking trails, and recreational facilities.',
    location: 'Riverside District, Northern Region',
    totalBudget: 500000,
    allocatedFunds: 500000,
    spentFunds: 150000,
    status: 'in_progress',
    contractor: 'GreenSpace Contractors',
    createdAt: Date.now() - 86400000 * 14,
    milestones: [
      {
        id: 'ms_001',
        name: 'Site Preparation',
        description: 'Clear land and prepare foundation',
        amount: 150000,
        status: 'paid',
        submittedAt: Date.now() - 86400000 * 6,
        approvedAt: Date.now() - 86400000 * 5
      },
      {
        id: 'ms_002',
        name: 'Infrastructure Installation',
        description: 'Install utilities and basic infrastructure',
        amount: 200000,
        status: 'submitted',
        submittedAt: Date.now() - 86400000 * 2
      },
      {
        id: 'ms_003',
        name: 'Recreational Facilities',
        description: 'Build playground and sports equipment',
        amount: 150000,
        status: 'pending'
      }
    ]
  },
  {
    id: 'proj_002',
    name: 'Sports Complex Construction',
    description: 'Construction of a modern sports complex with indoor courts, gym facilities, and community meeting spaces.',
    location: 'Central Square, Southern Region',
    totalBudget: 750000,
    allocatedFunds: 750000,
    spentFunds: 0,
    status: 'approved',
    contractor: 'SportsBuild Inc',
    createdAt: Date.now() - 86400000 * 10,
    milestones: [
      {
        id: 'ms_004',
        name: 'Foundation Work',
        description: 'Excavation and foundation construction',
        amount: 250000,
        status: 'pending'
      },
      {
        id: 'ms_005',
        name: 'Structural Framework',
        description: 'Main building structure and roofing',
        amount: 300000,
        status: 'pending'
      },
      {
        id: 'ms_006',
        name: 'Interior Finishing',
        description: 'Flooring, equipment installation, and final touches',
        amount: 200000,
        status: 'pending'
      }
    ]
  }
];

export function useBlockchain() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Load data from localStorage or use initial data
    const savedTransactions = localStorage.getItem('blockchain_transactions');
    const savedProjects = localStorage.getItem('blockchain_projects');

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    } else {
      setTransactions(initialTransactions);
      localStorage.setItem('blockchain_transactions', JSON.stringify(initialTransactions));
    }

    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      setProjects(initialProjects);
      localStorage.setItem('blockchain_projects', JSON.stringify(initialProjects));
    }
  }, []);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'hash' | 'timestamp' | 'blockHeight'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
      hash: '0x' + Math.random().toString(16).substr(2, 5) + '...',
      timestamp: Date.now(),
      blockHeight: 12000 + transactions.length + 1
    };

    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    localStorage.setItem('blockchain_transactions', JSON.stringify(updatedTransactions));

    return newTransaction;
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    const updatedProjects = projects.map(project =>
      project.id === projectId ? { ...project, ...updates } : project
    );
    setProjects(updatedProjects);
    localStorage.setItem('blockchain_projects', JSON.stringify(updatedProjects));
  };

  const addProject = (project: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...project,
      id: 'proj_' + Math.random().toString(36).substr(2, 6),
      createdAt: Date.now()
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem('blockchain_projects', JSON.stringify(updatedProjects));

    return newProject;
  };

  const totalFunds = transactions
    .filter(tx => tx.status === 'completed' && tx.type === 'allocation')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const pendingTransactions = transactions.filter(tx => tx.status === 'pending').length;

  return {
    transactions,
    projects,
    addTransaction,
    updateProject,
    addProject,
    totalFunds,
    pendingTransactions
  };
}