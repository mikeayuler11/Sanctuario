import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  FileText
} from 'lucide-react';

const GraveManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSection, setFilterSection] = useState('all');
  const [sortField, setSortField] = useState('lastName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [selectedGrave, setSelectedGrave] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock data - in real app, this would come from API
  const gravesData = [
    {
      id: 1,
      plotId: 'A-1-1',
      section: 'A',
      firstName: 'Maria',
      lastName: 'Santos',
      middleName: 'Cruz',
      dateOfBirth: '1945-03-15',
      dateOfDeath: '2023-05-15',
      burialDate: '2023-05-18',
      contactPerson: 'Juan Santos',
      contactPhone: '+63 912 345 6789',
      contactEmail: 'juan.santos@email.com',
      status: 'occupied',
      graveType: 'Standard Plot',
      monument: 'Marble Headstone',
      notes: 'Beautiful service, family requested simple ceremony'
    },
    {
      id: 2,
      plotId: 'A-1-2',
      section: 'A',
      status: 'available',
      graveType: 'Standard Plot'
    },
    {
      id: 3,
      plotId: 'B-2-3',
      section: 'B',
      firstName: 'John',
      lastName: 'Doe',
      middleName: 'William',
      dateOfBirth: '1955-08-22',
      dateOfDeath: '2023-03-20',
      burialDate: '2023-03-23',
      contactPerson: 'Jane Doe',
      contactPhone: '+63 917 876 5432',
      contactEmail: 'jane.doe@email.com',
      status: 'occupied',
      graveType: 'Premium Plot',
      monument: 'Granite Monument',
      notes: 'Military honors requested'
    },
    {
      id: 4,
      plotId: 'C-3-5',
      section: 'C',
      firstName: 'Ana',
      lastName: 'Rodriguez',
      dateOfBirth: '1962-11-10',
      dateOfDeath: '2023-07-08',
      burialDate: '2023-07-11',
      contactPerson: 'Miguel Rodriguez',
      contactPhone: '+63 915 234 5678',
      contactEmail: 'miguel.rodriguez@email.com',
      status: 'occupied',
      graveType: 'Family Plot',
      monument: 'Bronze Plaque'
    }
  ];

  const sections = ['A', 'B', 'C', 'D'];
  const statuses = ['available', 'occupied', 'reserved', 'maintenance'];

  // Filter and search logic
  const filteredGraves = useMemo(() => {
    return gravesData.filter(grave => {
      const matchesSearch = !searchTerm || 
        grave.plotId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grave.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grave.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grave.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || grave.status === filterStatus;
      const matchesSection = filterSection === 'all' || grave.section === filterSection;
      
      return matchesSearch && matchesStatus && matchesSection;
    });
  }, [searchTerm, filterStatus, filterSection]);

  // Sort logic
  const sortedGraves = useMemo(() => {
    return [...filteredGraves].sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      
      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }, [filteredGraves, sortField, sortDirection]);

  // Pagination logic
  const paginatedGraves = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedGraves.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedGraves, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedGraves.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAdd = () => {
    setModalMode('add');
    setSelectedGrave(null);
    setShowModal(true);
  };

  const handleEdit = (grave) => {
    setModalMode('edit');
    setSelectedGrave(grave);
    setShowModal(true);
  };

  const handleView = (grave) => {
    setModalMode('view');
    setSelectedGrave(grave);
    setShowModal(true);
  };

  const handleDelete = (grave) => {
    if (window.confirm(`Are you sure you want to delete the record for ${grave.firstName} ${grave.lastName}?`)) {
      // Handle delete logic here
      console.log('Deleting grave:', grave);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      available: 'bg-green-100 text-green-800',
      occupied: 'bg-red-100 text-red-800',
      reserved: 'bg-yellow-100 text-yellow-800',
      maintenance: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${styles[status] || styles.available}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Grave Management</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleAdd}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Record
          </button>
          <button className="btn-secondary">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </button>
          <button className="btn-secondary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, plot ID, or contact..."
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
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          
          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Sections</option>
            {sections.map(section => (
              <option key={section} value={section}>Section {section}</option>
            ))}
          </select>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {sortedGraves.length} of {gravesData.length} records
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
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('plotId')}
                >
                  Plot ID
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('lastName')}
                >
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Person
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedGraves.map((grave) => (
                <tr key={grave.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      {grave.plotId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {grave.firstName ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {grave.firstName} {grave.lastName}
                        </div>
                        {grave.middleName && (
                          <div className="text-sm text-gray-500">{grave.middleName}</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {grave.dateOfBirth ? (
                      <div>
                        <div>Born: {new Date(grave.dateOfBirth).toLocaleDateString()}</div>
                        <div>Died: {new Date(grave.dateOfDeath).toLocaleDateString()}</div>
                      </div>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {grave.contactPerson ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900">{grave.contactPerson}</div>
                        <div className="text-sm text-gray-500">{grave.contactPhone}</div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(grave.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {grave.graveType || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleView(grave)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(grave)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(grave)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
                  {Math.min(currentPage * itemsPerPage, sortedGraves.length)}
                </span>{' '}
                of <span className="font-medium">{sortedGraves.length}</span> results
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

      {/* Modal for Add/Edit/View */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {modalMode === 'add' ? 'Add New Grave Record' : 
                     modalMode === 'edit' ? 'Edit Grave Record' : 'Grave Details'}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                
                {/* Modal content would go here */}
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    {modalMode === 'view' ? 'Viewing details for' : 
                     modalMode === 'edit' ? 'Editing record for' : 'Add new grave record'}
                    {selectedGrave && ` ${selectedGrave.plotId}`}
                  </p>
                  
                  {/* Form fields would be implemented here */}
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Plot ID"
                      className="border border-gray-300 rounded-lg px-3 py-2"
                      defaultValue={selectedGrave?.plotId || ''}
                      readOnly={modalMode === 'view'}
                    />
                    <input
                      type="text"
                      placeholder="First Name"
                      className="border border-gray-300 rounded-lg px-3 py-2"
                      defaultValue={selectedGrave?.firstName || ''}
                      readOnly={modalMode === 'view'}
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {modalMode !== 'view' && (
                  <button className="btn-primary sm:ml-3">
                    {modalMode === 'add' ? 'Add Record' : 'Save Changes'}
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

export default GraveManagement;