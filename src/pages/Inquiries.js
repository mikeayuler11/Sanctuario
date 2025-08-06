import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  User
} from 'lucide-react';

const Inquiries = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // Mock inquiries data
  const inquiriesData = [
    {
      id: 1,
      clientName: 'Maria Santos',
      email: 'maria.santos@email.com',
      phone: '+63 912 345 6789',
      subject: 'Plot Availability Inquiry',
      type: 'plot_inquiry',
      status: 'pending',
      priority: 'medium',
      message: 'Hello, I would like to inquire about available plots in Section A. Could you please provide information about pricing and availability?',
      createdDate: '2024-01-15',
      lastUpdated: '2024-01-15',
      assignedTo: 'Juan Rodriguez',
      response: ''
    },
    {
      id: 2,
      clientName: 'Pedro Cruz',
      email: 'pedro.cruz@email.com',
      phone: '+63 917 234 5678',
      subject: 'Memorial Service Planning',
      type: 'service_inquiry',
      status: 'in_progress',
      priority: 'high',
      message: 'We need assistance planning a memorial service for our late father. Please contact us to discuss available dates and arrangements.',
      createdDate: '2024-01-14',
      lastUpdated: '2024-01-16',
      assignedTo: 'Ana Garcia',
      response: 'Thank you for contacting us. I will be in touch within 24 hours to discuss your memorial service needs.'
    },
    {
      id: 3,
      clientName: 'Rosa Rodriguez',
      email: 'rosa.rodriguez@email.com',
      phone: '+63 915 876 5432',
      subject: 'Payment Plan Information',
      type: 'payment_inquiry',
      status: 'resolved',
      priority: 'low',
      message: 'I would like to know about available payment plans for plot purchases. What are the terms and interest rates?',
      createdDate: '2024-01-10',
      lastUpdated: '2024-01-12',
      assignedTo: 'Carlos Mendez',
      response: 'We offer flexible payment plans with terms ranging from 12 to 36 months. Interest rates start at 5.5% annually. I have sent detailed information to your email.'
    },
    {
      id: 4,
      clientName: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+63 918 765 4321',
      subject: 'Maintenance Service Request',
      type: 'maintenance_inquiry',
      status: 'pending',
      priority: 'medium',
      message: 'The monument at Plot B-2-3 needs cleaning and some minor repairs. Please schedule a maintenance visit.',
      createdDate: '2024-01-16',
      lastUpdated: '2024-01-16',
      assignedTo: '',
      response: ''
    }
  ];

  const statusOptions = ['pending', 'in_progress', 'resolved', 'closed'];
  const typeOptions = ['plot_inquiry', 'service_inquiry', 'payment_inquiry', 'maintenance_inquiry', 'general'];
  const priorityOptions = ['low', 'medium', 'high', 'urgent'];

  // Filter and search logic
  const filteredInquiries = useMemo(() => {
    return inquiriesData.filter(inquiry => {
      const matchesSearch = !searchTerm || 
        inquiry.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.phone.includes(searchTerm);
      
      const matchesStatus = filterStatus === 'all' || inquiry.status === filterStatus;
      const matchesType = filterType === 'all' || inquiry.type === filterType;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchTerm, filterStatus, filterType]);

  // Pagination
  const paginatedInquiries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredInquiries.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredInquiries, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: inquiriesData.length,
      pending: inquiriesData.filter(i => i.status === 'pending').length,
      inProgress: inquiriesData.filter(i => i.status === 'in_progress').length,
      resolved: inquiriesData.filter(i => i.status === 'resolved').length
    };
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    
    const icons = {
      pending: Clock,
      in_progress: AlertCircle,
      resolved: CheckCircle,
      closed: CheckCircle
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
      plot_inquiry: 'Plot Inquiry',
      service_inquiry: 'Service Inquiry',
      payment_inquiry: 'Payment Inquiry',
      maintenance_inquiry: 'Maintenance Inquiry',
      general: 'General Inquiry'
    };
    return labels[type] || type;
  };

  const handleView = (inquiry) => {
    setSelectedInquiry(inquiry);
    setModalMode('view');
    setShowModal(true);
  };

  const handleEdit = (inquiry) => {
    setSelectedInquiry(inquiry);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedInquiry(null);
    setModalMode('add');
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Client Inquiries</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleAdd}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Inquiry
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500 rounded-lg">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
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
              <AlertCircle className="w-5 h-5 text-white" />
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
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-lg font-bold text-gray-900">{stats.resolved}</p>
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
              placeholder="Search inquiries..."
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
              {filteredInquiries.length} inquiries
            </span>
          </div>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedInquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{inquiry.clientName}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {inquiry.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {inquiry.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{inquiry.subject}</div>
                    <div className="text-sm text-gray-500 max-w-xs truncate">{inquiry.message}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getTypeLabel(inquiry.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(inquiry.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPriorityBadge(inquiry.priority)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(inquiry.createdDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleView(inquiry)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(inquiry)}
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

      {/* Inquiry Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {modalMode === 'add' ? 'New Inquiry' : 
                     modalMode === 'edit' ? 'Edit Inquiry' : 'Inquiry Details'}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  {modalMode === 'view' && selectedInquiry ? (
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Client Information</h4>
                        <p><strong>Name:</strong> {selectedInquiry.clientName}</p>
                        <p><strong>Email:</strong> {selectedInquiry.email}</p>
                        <p><strong>Phone:</strong> {selectedInquiry.phone}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Inquiry Details</h4>
                        <p><strong>Subject:</strong> {selectedInquiry.subject}</p>
                        <p><strong>Type:</strong> {getTypeLabel(selectedInquiry.type)}</p>
                        <p><strong>Priority:</strong> {selectedInquiry.priority}</p>
                        <p><strong>Status:</strong> {selectedInquiry.status}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Message</h4>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedInquiry.message}</p>
                      </div>
                      
                      {selectedInquiry.response && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Response</h4>
                          <p className="text-gray-700 bg-blue-50 p-3 rounded">{selectedInquiry.response}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Client Name"
                        className="border border-gray-300 rounded-lg px-3 py-2"
                        defaultValue={selectedInquiry?.clientName || ''}
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        className="border border-gray-300 rounded-lg px-3 py-2"
                        defaultValue={selectedInquiry?.email || ''}
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        className="border border-gray-300 rounded-lg px-3 py-2"
                        defaultValue={selectedInquiry?.phone || ''}
                      />
                      <select
                        className="border border-gray-300 rounded-lg px-3 py-2"
                        defaultValue={selectedInquiry?.type || ''}
                      >
                        <option value="">Select Type</option>
                        {typeOptions.map(type => (
                          <option key={type} value={type}>{getTypeLabel(type)}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Subject"
                        className="col-span-2 border border-gray-300 rounded-lg px-3 py-2"
                        defaultValue={selectedInquiry?.subject || ''}
                      />
                      <textarea
                        placeholder="Message"
                        className="col-span-2 border border-gray-300 rounded-lg px-3 py-2"
                        rows="4"
                        defaultValue={selectedInquiry?.message || ''}
                      ></textarea>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {modalMode !== 'view' && (
                  <button className="btn-primary sm:ml-3">
                    {modalMode === 'add' ? 'Create Inquiry' : 'Save Changes'}
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

export default Inquiries;