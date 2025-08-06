import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Calendar,
  User,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

const GraveManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data for graves
  const graves = [
    {
      id: 1,
      location: 'Section A, Block 12, Lot 45',
      status: 'occupied',
      deceasedName: 'Maria Santos',
      birthDate: '1945-03-15',
      deathDate: '2020-08-22',
      burialDate: '2020-08-25',
      familyContact: 'John Santos',
      phone: '+63 912 345 6789',
      paymentStatus: 'paid',
      lastMaintenance: '2024-12-15'
    },
    {
      id: 2,
      location: 'Section A, Block 12, Lot 46',
      status: 'occupied',
      deceasedName: 'Jose Santos',
      birthDate: '1940-07-10',
      deathDate: '2018-12-05',
      burialDate: '2018-12-08',
      familyContact: 'John Santos',
      phone: '+63 912 345 6789',
      paymentStatus: 'paid',
      lastMaintenance: '2024-11-20'
    },
    {
      id: 3,
      location: 'Section B, Block 8, Lot 23',
      status: 'available',
      deceasedName: '',
      birthDate: '',
      deathDate: '',
      burialDate: '',
      familyContact: '',
      phone: '',
      paymentStatus: '',
      lastMaintenance: ''
    },
    {
      id: 4,
      location: 'Section C, Block 15, Lot 67',
      status: 'reserved',
      deceasedName: '',
      birthDate: '',
      deathDate: '',
      burialDate: '',
      familyContact: 'Maria Garcia',
      phone: '+63 923 456 7890',
      paymentStatus: 'pending',
      lastMaintenance: ''
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'occupied':
        return 'bg-red-100 text-red-800';
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredGraves = graves.filter(grave => {
    const matchesSearch = grave.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grave.deceasedName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grave.familyContact.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || grave.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grave Management</h1>
          <p className="text-gray-600">Manage burial plots and records</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Grave
        </motion.button>
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
                placeholder="Search graves by location, name, or contact..."
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
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Graves Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deceased
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Family Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Maintenance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGraves.map((grave, index) => (
                <motion.tr
                  key={grave.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {grave.location}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(grave.status)}`}>
                      {grave.status.charAt(0).toUpperCase() + grave.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {grave.deceasedName ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900">{grave.deceasedName}</div>
                        <div className="text-sm text-gray-500">
                          {grave.birthDate} - {grave.deathDate}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {grave.familyContact ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900">{grave.familyContact}</div>
                        <div className="text-sm text-gray-500">{grave.phone}</div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {grave.paymentStatus ? (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(grave.paymentStatus)}`}>
                        {grave.paymentStatus.charAt(0).toUpperCase() + grave.paymentStatus.slice(1)}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {grave.lastMaintenance || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-cemetery-600 hover:text-cemetery-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
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
          <div className="text-2xl font-bold text-gray-900">2,450</div>
          <div className="text-sm text-gray-600">Total Graves</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card text-center"
        >
          <div className="text-2xl font-bold text-green-600">1,592</div>
          <div className="text-sm text-gray-600">Available</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card text-center"
        >
          <div className="text-2xl font-bold text-red-600">858</div>
          <div className="text-sm text-gray-600">Occupied</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="card text-center"
        >
          <div className="text-2xl font-bold text-yellow-600">245</div>
          <div className="text-sm text-gray-600">Reserved</div>
        </motion.div>
      </div>

      {/* Add Grave Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add New Grave</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Section, Block, Lot"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select className="input-field">
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="occupied">Occupied</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Add Grave
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraveManagement;