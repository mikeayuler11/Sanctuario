import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wrench,
  Search,
  Filter,
  Calendar,
  MapPin,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

const Maintenance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data for maintenance tasks
  const maintenanceTasks = [
    {
      id: 1,
      title: 'Flower Replacement',
      description: 'Replace flowers on Maria Santos grave',
      location: 'Section A, Block 12, Lot 45',
      assignedTo: 'Juan Dela Cruz',
      priority: 'medium',
      status: 'scheduled',
      scheduledDate: '2025-01-20',
      completedDate: null,
      category: 'Flowers',
      estimatedDuration: '30 minutes',
      notes: 'White roses requested by family'
    },
    {
      id: 2,
      title: 'Grave Cleaning',
      description: 'Clean and polish headstone',
      location: 'Section B, Block 8, Lot 23',
      assignedTo: 'Pedro Santos',
      priority: 'low',
      status: 'completed',
      scheduledDate: '2025-01-15',
      completedDate: '2025-01-15',
      category: 'Cleaning',
      estimatedDuration: '1 hour',
      notes: 'Completed as scheduled'
    },
    {
      id: 3,
      title: 'Landscaping',
      description: 'Trim grass and bushes around grave area',
      location: 'Section C, Block 15, Lot 67',
      assignedTo: 'Maria Garcia',
      priority: 'high',
      status: 'in_progress',
      scheduledDate: '2025-01-18',
      completedDate: null,
      category: 'Landscaping',
      estimatedDuration: '2 hours',
      notes: 'Family visiting this weekend'
    },
    {
      id: 4,
      title: 'Repair Work',
      description: 'Fix loose headstone',
      location: 'Section A, Block 10, Lot 32',
      assignedTo: 'Carlos Rodriguez',
      priority: 'high',
      status: 'pending',
      scheduledDate: '2025-01-25',
      completedDate: null,
      category: 'Repair',
      estimatedDuration: '3 hours',
      notes: 'Safety concern - needs immediate attention'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTasks = maintenanceTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || task.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance Management</h1>
          <p className="text-gray-600">Manage grave maintenance tasks and schedules</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
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
                placeholder="Search tasks by title, description, or location..."
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
              <option value="pending">Pending</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Maintenance Tasks */}
      <div className="space-y-4">
        {filteredTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="card hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ').charAt(0).toUpperCase() + task.status.replace('_', ' ').slice(1)}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {task.category}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    {task.scheduledDate}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
                <p className="text-gray-600 mb-3">{task.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {task.location}
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {task.assignedTo}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {task.estimatedDuration}
                  </div>
                </div>
                
                {task.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Notes:</strong> {task.notes}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button className="p-2 text-cemetery-600 hover:text-cemetery-700 hover:bg-cemetery-50 rounded-md">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md">
                  <CheckCircle className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card text-center"
        >
          <div className="text-2xl font-bold text-gray-900">24</div>
          <div className="text-sm text-gray-600">Total Tasks</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card text-center"
        >
          <div className="text-2xl font-bold text-blue-600">8</div>
          <div className="text-sm text-gray-600">Scheduled</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card text-center"
        >
          <div className="text-2xl font-bold text-yellow-600">3</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="card text-center"
        >
          <div className="text-2xl font-bold text-green-600">13</div>
          <div className="text-sm text-gray-600">Completed</div>
        </motion.div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add Maintenance Task</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <AlertCircle className="w-6 h-6" />
                </button>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Task Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter task title"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter task description"
                    className="input-field"
                    rows="3"
                  />
                </div>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select className="input-field">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select className="input-field">
                      <option value="cleaning">Cleaning</option>
                      <option value="flowers">Flowers</option>
                      <option value="landscaping">Landscaping</option>
                      <option value="repair">Repair</option>
                    </select>
                  </div>
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
                    Add Task
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

export default Maintenance;