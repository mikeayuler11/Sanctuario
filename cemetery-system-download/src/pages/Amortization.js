import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Calendar,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  CreditCard,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText
} from 'lucide-react';

const Amortization = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Mock amortization data
  const amortizationData = [
    {
      id: 1,
      plotId: 'A-1-1',
      clientName: 'Juan Santos',
      contactPhone: '+63 912 345 6789',
      contractDate: '2023-01-15',
      totalAmount: 150000,
      amountPaid: 75000,
      balance: 75000,
      monthlyPayment: 5000,
      term: 30, // months
      status: 'active',
      nextDueDate: '2024-02-15',
      lastPaymentDate: '2024-01-15',
      lastPaymentAmount: 5000,
      interestRate: 5.5,
      type: 'niche_rental'
    },
    {
      id: 2,
      plotId: 'B-2-3',
      clientName: 'Maria Cruz',
      contactPhone: '+63 917 234 5678',
      contractDate: '2023-03-20',
      totalAmount: 200000,
      amountPaid: 140000,
      balance: 60000,
      monthlyPayment: 7500,
      term: 24,
      status: 'active',
      nextDueDate: '2024-02-20',
      lastPaymentDate: '2024-01-20',
      lastPaymentAmount: 7500,
      interestRate: 6.0,
      type: 'plot_purchase'
    },
    {
      id: 3,
      plotId: 'C-3-5',
      clientName: 'Pedro Rodriguez',
      contactPhone: '+63 915 876 5432',
      contractDate: '2022-12-10',
      totalAmount: 180000,
      amountPaid: 180000,
      balance: 0,
      monthlyPayment: 6000,
      term: 30,
      status: 'completed',
      nextDueDate: null,
      lastPaymentDate: '2023-12-10',
      lastPaymentAmount: 6000,
      interestRate: 5.0,
      type: 'niche_rental'
    },
    {
      id: 4,
      plotId: 'D-1-8',
      clientName: 'Ana Gonzales',
      contactPhone: '+63 918 765 4321',
      contractDate: '2023-06-01',
      totalAmount: 120000,
      amountPaid: 30000,
      balance: 90000,
      monthlyPayment: 4000,
      term: 36,
      status: 'overdue',
      nextDueDate: '2024-01-01',
      lastPaymentDate: '2023-12-01',
      lastPaymentAmount: 4000,
      interestRate: 7.0,
      type: 'maintenance_plan'
    }
  ];

  const statusOptions = ['active', 'completed', 'overdue', 'suspended'];
  const typeOptions = ['niche_rental', 'plot_purchase', 'maintenance_plan'];

  // Filter and search logic
  const filteredData = useMemo(() => {
    return amortizationData.filter(item => {
      const matchesSearch = !searchTerm || 
        item.plotId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.contactPhone.includes(searchTerm);
      
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      const matchesType = filterType === 'all' || item.type === filterType;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchTerm, filterStatus, filterType]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Calculate summary statistics
  const summary = useMemo(() => {
    return {
      totalContracts: amortizationData.length,
      activeContracts: amortizationData.filter(item => item.status === 'active').length,
      overdueContracts: amortizationData.filter(item => item.status === 'overdue').length,
      totalRevenue: amortizationData.reduce((sum, item) => sum + item.amountPaid, 0),
      pendingBalance: amortizationData.reduce((sum, item) => sum + item.balance, 0),
      monthlyExpected: amortizationData
        .filter(item => item.status === 'active')
        .reduce((sum, item) => sum + item.monthlyPayment, 0)
    };
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      overdue: 'bg-red-100 text-red-800',
      suspended: 'bg-yellow-100 text-yellow-800'
    };
    
    const icons = {
      active: CheckCircle,
      completed: CheckCircle,
      overdue: AlertCircle,
      suspended: Clock
    };
    
    const Icon = icons[status];
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeLabel = (type) => {
    const labels = {
      niche_rental: 'Niche Rental',
      plot_purchase: 'Plot Purchase',
      maintenance_plan: 'Maintenance Plan'
    };
    return labels[type] || type;
  };

  const handleRecordPayment = (account) => {
    setSelectedAccount(account);
    setShowPaymentModal(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Amortization Management</h1>
        <div className="flex items-center space-x-2">
          <button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            New Contract
          </button>
          <button className="btn-secondary">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Contracts</p>
              <p className="text-lg font-bold text-gray-900">{summary.totalContracts}</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-500 rounded-lg">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-lg font-bold text-gray-900">{summary.activeContracts}</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-500 rounded-lg">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-lg font-bold text-gray-900">{summary.overdueContracts}</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(summary.totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pending Balance</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(summary.pendingBalance)}</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-500 rounded-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Monthly Expected</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(summary.monthlyExpected)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by client, plot ID, or phone..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Statuses</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Types</option>
            {typeOptions.map(type => (
              <option key={type} value={type}>
                {getTypeLabel(type)}
              </option>
            ))}
          </select>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {filteredData.length} contracts
            </span>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client / Plot
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Due
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((item) => {
                const progressPercentage = (item.amountPaid / item.totalAmount) * 100;
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.clientName}</div>
                        <div className="text-sm text-gray-500">Plot: {item.plotId}</div>
                        <div className="text-sm text-gray-500">{item.contactPhone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{getTypeLabel(item.type)}</div>
                        <div className="text-sm text-gray-500">
                          Total: {formatCurrency(item.totalAmount)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Monthly: {formatCurrency(item.monthlyPayment)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Paid: {formatCurrency(item.amountPaid)}</span>
                          <span>{progressPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        <div className="text-sm text-gray-500">
                          Balance: {formatCurrency(item.balance)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.nextDueDate ? (
                        <div>
                          <div>{new Date(item.nextDueDate).toLocaleDateString()}</div>
                          <div className="text-xs">
                            {item.lastPaymentDate && 
                              `Last: ${new Date(item.lastPaymentDate).toLocaleDateString()}`
                            }
                          </div>
                        </div>
                      ) : (
                        <span>Completed</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleRecordPayment(item)}
                          className="text-green-600 hover:text-green-900"
                          disabled={item.status === 'completed'}
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredData.length)}
                </span>{' '}
                of <span className="font-medium">{filteredData.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === i + 1
                        ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedAccount && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowPaymentModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Record Payment</h3>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{selectedAccount.clientName}</p>
                    <p className="text-sm text-gray-500">Plot: {selectedAccount.plotId}</p>
                    <p className="text-sm text-gray-500">
                      Balance: {formatCurrency(selectedAccount.balance)}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Amount
                      </label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder={selectedAccount.monthlyPayment}
                        defaultValue={selectedAccount.monthlyPayment}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Date
                      </label>
                      <input
                        type="date"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        defaultValue={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                      <option value="cash">Cash</option>
                      <option value="check">Check</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="credit_card">Credit Card</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (Optional)
                    </label>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      rows="3"
                      placeholder="Payment notes..."
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button className="btn-primary sm:ml-3">
                  Record Payment
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="btn-secondary mt-3 sm:mt-0"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Amortization;