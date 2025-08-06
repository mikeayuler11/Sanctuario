import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator,
  DollarSign,
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

const Amortization = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data for amortization records
  const amortizations = [
    {
      id: 1,
      clientName: 'John Santos',
      graveLocation: 'Section A, Block 12, Lot 45',
      totalAmount: 150000,
      downPayment: 30000,
      remainingBalance: 120000,
      monthlyPayment: 5000,
      paymentSchedule: 'Monthly',
      startDate: '2020-08-25',
      endDate: '2025-08-25',
      status: 'active',
      lastPayment: '2025-01-15',
      nextPayment: '2025-02-15'
    },
    {
      id: 2,
      clientName: 'Maria Garcia',
      graveLocation: 'Section C, Block 15, Lot 67',
      totalAmount: 180000,
      downPayment: 45000,
      remainingBalance: 135000,
      monthlyPayment: 6000,
      paymentSchedule: 'Monthly',
      startDate: '2024-12-01',
      endDate: '2027-12-01',
      status: 'pending',
      lastPayment: '2025-01-01',
      nextPayment: '2025-02-01'
    },
    {
      id: 3,
      clientName: 'Pedro Martinez',
      graveLocation: 'Section B, Block 8, Lot 23',
      totalAmount: 120000,
      downPayment: 60000,
      remainingBalance: 60000,
      monthlyPayment: 4000,
      paymentSchedule: 'Monthly',
      startDate: '2023-06-15',
      endDate: '2026-06-15',
      status: 'completed',
      lastPayment: '2025-01-10',
      nextPayment: '2025-02-10'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAmortizations = amortizations.filter(item => {
    const matchesSearch = item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.graveLocation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Amortization Management</h1>
        <p className="text-gray-600">Manage payment schedules and financial records</p>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by client name or grave location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="completed">Completed</option>
            </select>
            <button className="btn-primary flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Amortization Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grave Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remaining Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monthly Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAmortizations.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.clientName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.graveLocation}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(item.totalAmount)}</div>
                    <div className="text-xs text-gray-500">Down: {formatCurrency(item.downPayment)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(item.remainingBalance)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(item.monthlyPayment)}</div>
                    <div className="text-xs text-gray-500">{item.paymentSchedule}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.nextPayment}</div>
                    <div className="text-xs text-gray-500">Last: {item.lastPayment}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-cemetery-600 hover:text-cemetery-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card text-center"
        >
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(450000)}</div>
          <div className="text-sm text-gray-600">Total Outstanding</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card text-center"
        >
          <div className="text-2xl font-bold text-green-600">{formatCurrency(15000)}</div>
          <div className="text-sm text-gray-600">This Month's Collection</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card text-center"
        >
          <div className="text-2xl font-bold text-yellow-600">23</div>
          <div className="text-sm text-gray-600">Pending Payments</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="card text-center"
        >
          <div className="text-2xl font-bold text-blue-600">156</div>
          <div className="text-sm text-gray-600">Active Contracts</div>
        </motion.div>
      </div>

      {/* Payment Calculator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="card"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Calculator</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
            <input
              type="number"
              placeholder="Enter total amount"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment</label>
            <input
              type="number"
              placeholder="Enter down payment"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Term (months)</label>
            <input
              type="number"
              placeholder="Enter term in months"
              className="input-field"
            />
          </div>
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Monthly Payment:</span>
            <span className="text-lg font-bold text-cemetery-600">{formatCurrency(5000)}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Amortization;