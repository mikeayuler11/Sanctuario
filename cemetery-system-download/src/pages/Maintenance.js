import React, { useState, useMemo } from 'react';
import {
  Wrench,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  MapPin,
  User,
  FileText
} from 'lucide-react';

const Maintenance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Mock maintenance data
  const maintenanceData = [
    {
      id: 1,
      plotId: 'A-1-1',
      requestType: 'monument_cleaning',
      title: 'Monument Cleaning and Polish',
      description: 'Monthly cleaning and polishing of marble headstone',
      requestedBy: 'Maria Santos',
      contactPhone: '+63 912 345 6789',
      status: 'scheduled',
      priority: 'medium',
      requestDate: '2024-01-15',
      scheduledDate: '2024-01-20',
      completedDate: null,
      assignedTo: 'Carlos Rodriguez',
      estimatedCost: 2500,
      actualCost: null,
      notes: 'Regular monthly maintenance as per contract'
    },
    {
      id: 2,
      plotId: 'B-2-3',
      requestType: 'landscaping',
      title: 'Garden Area Maintenance',
      description: 'Trimming bushes and replanting flowers around the grave site',
      requestedBy: 'John Doe',
      contactPhone: '+63 917 234 5678',
      status: 'in_progress',
      priority: 'low',
      requestDate: '2024-01-12',
      scheduledDate: '2024-01-18',
      completedDate: null,
      assignedTo: 'Miguel Santos',
      estimatedCost: 3000,
      actualCost: null,
      notes: 'Client requested specific flower types'
    },
    {
      id: 3,
      plotId: 'C-3-5',
      requestType: 'repair',
      title: 'Monument Crack Repair',
      description: 'Repair hairline crack in granite monument',
      requestedBy: 'Ana Rodriguez',
      contactPhone: '+63 915 876 5432',
      status: 'completed',
      priority: 'high',
      requestDate: '2024-01-08',
      scheduledDate: '2024-01-10',
      completedDate: '2024-01-11',
      assignedTo: 'Pedro Martinez',
      estimatedCost: 5000,
      actualCost: 4800,
      notes: 'Work completed successfully, warranty provided'
    },
    {
      id: 4,
      plotId: 'D-1-8',
      requestType: 'general_maintenance',
      title: 'General Plot Maintenance',
      description: 'General cleaning and upkeep of plot area',
      requestedBy: 'Rosa Garcia',
      contactPhone: '+63 918 765 4321',
      status: 'pending',
      priority: 'medium',
      requestDate: '2024-01-16',
      scheduledDate: null,
      completedDate: null,
      assignedTo: null,
      estimatedCost: 1500,
      actualCost: null,
      notes: 'Awaiting approval from management'
    }
  ];

  const statusOptions = ['pending', 'scheduled', 'in_progress', 'completed', 'cancelled'];
  const typeOptions = ['monument_cleaning', 'landscaping', 'repair', 'general_maintenance', 'emergency'];
  const priorityOptions = ['low', 'medium', 'high', 'urgent'];

  // Filter and search logic
  const filteredData = useMemo(() => {
    return maintenanceData.filter(item => {
      const matchesSearch = !searchTerm || 
        item.plotId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      const matchesType = filterType === 'all' || item.requestType === filterType;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchTerm, filterStatus, filterType]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: maintenanceData.length,
      pending: maintenanceData.filter(i => i.status === 'pending').length,
      scheduled: maintenanceData.filter(i => i.status === 'scheduled').length,
      inProgress: maintenanceData.filter(i => i.status === 'in_progress').length,
      completed: maintenanceData.filter(i => i.status === 'completed').length
    };
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      scheduled: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    const icons = {
      pending: Clock,
      scheduled: Calendar,
      in_progress: Wrench,
      completed: CheckCircle,
      cancelled: AlertTriangle
    };
    
    const Icon = icons[status];
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${styles[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const getTypeLabel = (type) => {
    const labels = {
      monument_cleaning: 'Monument Cleaning',
      landscaping: 'Landscaping',
      repair: 'Repair',
      general_maintenance: 'General Maintenance',
      emergency: 'Emergency'
    };
    return labels[type] || type;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const handleView = (request) => {
    setSelectedRequest(request);
    setModalMode('view');
    setShowModal(true);
  };

  const handleEdit = (request) => {
    setSelectedRequest(request);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedRequest(null);
    setModalMode('add');
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Maintenance Management</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleAdd}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-lg font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-lg font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-lg font-bold text-gray-900">{stats.scheduled}</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-lg font-bold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-500 rounded-lg">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-lg font-bold text-gray-900">{stats.completed}</p>
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
              placeholder="Search maintenance requests..."
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
                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
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
              {filteredData.length} requests
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
                  Plot / Request
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type / Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requested By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="flex items-center text-sm font-medium text-gray-900">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {request.plotId}
                      </div>
                      <div className="text-sm text-gray-500">{request.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {getTypeLabel(request.requestType)}
                      </div>
                      <div className="mt-1">
                        {getPriorityBadge(request.priority)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{request.requestedBy}</div>
                      <div className="text-sm text-gray-500">{request.contactPhone}</div>
                      {request.assignedTo && (
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <User className="w-3 h-3 mr-1" />
                          Assigned: {request.assignedTo}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div>Requested: {new Date(request.requestDate).toLocaleDateString()}</div>
                      {request.scheduledDate && (
                        <div>Scheduled: {new Date(request.scheduledDate).toLocaleDateString()}</div>
                      )}
                      {request.completedDate && (
                        <div>Completed: {new Date(request.completedDate).toLocaleDateString()}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div>Est: {formatCurrency(request.estimatedCost)}</div>
                      {request.actualCost && (
                        <div>Actual: {formatCurrency(request.actualCost)}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleView(request)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(request)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Maintenance Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {modalMode === 'add' ? 'New Maintenance Request' : 
                     modalMode === 'edit' ? 'Edit Maintenance Request' : 'Maintenance Request Details'}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  {modalMode === 'view' && selectedRequest ? (
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Request Information</h4>
                        <p><strong>Plot ID:</strong> {selectedRequest.plotId}</p>
                        <p><strong>Title:</strong> {selectedRequest.title}</p>
                        <p><strong>Type:</strong> {getTypeLabel(selectedRequest.requestType)}</p>
                        <p><strong>Priority:</strong> {selectedRequest.priority}</p>
                        <p><strong>Status:</strong> {selectedRequest.status}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedRequest.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Client Details</h4>
                          <p><strong>Requested By:</strong> {selectedRequest.requestedBy}</p>
                          <p><strong>Phone:</strong> {selectedRequest.contactPhone}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Assignment</h4>
                          <p><strong>Assigned To:</strong> {selectedRequest.assignedTo || 'Not assigned'}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Dates</h4>
                          <p><strong>Request Date:</strong> {new Date(selectedRequest.requestDate).toLocaleDateString()}</p>
                          {selectedRequest.scheduledDate && (
                            <p><strong>Scheduled:</strong> {new Date(selectedRequest.scheduledDate).toLocaleDateString()}</p>
                          )}
                          {selectedRequest.completedDate && (
                            <p><strong>Completed:</strong> {new Date(selectedRequest.completedDate).toLocaleDateString()}</p>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Cost</h4>
                          <p><strong>Estimated:</strong> {formatCurrency(selectedRequest.estimatedCost)}</p>
                          {selectedRequest.actualCost && (
                            <p><strong>Actual:</strong> {formatCurrency(selectedRequest.actualCost)}</p>
                          )}
                        </div>
                      </div>
                      
                      {selectedRequest.notes && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                          <p className="text-gray-700 bg-blue-50 p-3 rounded">{selectedRequest.notes}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Plot ID"
                        className="border border-gray-300 rounded-lg px-3 py-2"
                        defaultValue={selectedRequest?.plotId || ''}
                      />
                      <input
                        type="text"
                        placeholder="Title"
                        className="border border-gray-300 rounded-lg px-3 py-2"
                        defaultValue={selectedRequest?.title || ''}
                      />
                      <select
                        className="border border-gray-300 rounded-lg px-3 py-2"
                        defaultValue={selectedRequest?.requestType || ''}
                      >
                        <option value="">Select Type</option>
                        {typeOptions.map(type => (
                          <option key={type} value={type}>{getTypeLabel(type)}</option>
                        ))}
                      </select>
                      <select
                        className="border border-gray-300 rounded-lg px-3 py-2"
                        defaultValue={selectedRequest?.priority || 'medium'}
                      >
                        {priorityOptions.map(priority => (
                          <option key={priority} value={priority}>
                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Requested By"
                        className="border border-gray-300 rounded-lg px-3 py-2"
                        defaultValue={selectedRequest?.requestedBy || ''}
                      />
                      <input
                        type="tel"
                        placeholder="Contact Phone"
                        className="border border-gray-300 rounded-lg px-3 py-2"
                        defaultValue={selectedRequest?.contactPhone || ''}
                      />
                      <textarea
                        placeholder="Description"
                        className="col-span-2 border border-gray-300 rounded-lg px-3 py-2"
                        rows="3"
                        defaultValue={selectedRequest?.description || ''}
                      ></textarea>
                      <input
                        type="number"
                        placeholder="Estimated Cost"
                        className="border border-gray-300 rounded-lg px-3 py-2"
                        defaultValue={selectedRequest?.estimatedCost || ''}
                      />
                      <input
                        type="text"
                        placeholder="Assign To"
                        className="border border-gray-300 rounded-lg px-3 py-2"
                        defaultValue={selectedRequest?.assignedTo || ''}
                      />
                      <textarea
                        placeholder="Notes"
                        className="col-span-2 border border-gray-300 rounded-lg px-3 py-2"
                        rows="2"
                        defaultValue={selectedRequest?.notes || ''}
                      ></textarea>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {modalMode !== 'view' && (
                  <button className="btn-primary sm:ml-3">
                    {modalMode === 'add' ? 'Create Request' : 'Save Changes'}
                  </button>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="btn-secondary mt-3 sm:mt-0"
                >
                  {modalMode === 'view' ? 'Close' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;