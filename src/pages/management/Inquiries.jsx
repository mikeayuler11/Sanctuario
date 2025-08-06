import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  Reply,
  Archive
} from 'lucide-react';

const Inquiries = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data for inquiries
  const inquiries = [
    {
      id: 1,
      name: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      phone: '+63 923 456 7890',
      subject: 'Grave Reservation Inquiry',
      message: 'I would like to inquire about reserving a grave plot for my family. What are the available options and pricing?',
      status: 'new',
      priority: 'high',
      date: '2025-01-15',
      time: '10:30 AM',
      category: 'Reservation'
    },
    {
      id: 2,
      name: 'John Santos',
      email: 'john.santos@email.com',
      phone: '+63 912 345 6789',
      subject: 'Payment Schedule Question',
      message: 'I need to update my payment schedule. Can you help me with the amortization details?',
      status: 'in_progress',
      priority: 'medium',
      date: '2025-01-14',
      time: '2:15 PM',
      category: 'Payment'
    },
    {
      id: 3,
      name: 'Pedro Martinez',
      email: 'pedro.martinez@email.com',
      phone: '+63 934 567 8901',
      subject: 'Maintenance Request',
      message: 'The flowers on my mother\'s grave need to be replaced. When can this be done?',
      status: 'resolved',
      priority: 'low',
      date: '2025-01-13',
      time: '9:45 AM',
      category: 'Maintenance'
    },
    {
      id: 4,
      name: 'Ana Rodriguez',
      email: 'ana.rodriguez@email.com',
      phone: '+63 945 678 9012',
      subject: 'Visit Schedule',
      message: 'I would like to schedule a visit to see the available grave plots. What are your office hours?',
      status: 'new',
      priority: 'medium',
      date: '2025-01-12',
      time: '4:20 PM',
      category: 'General'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
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

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || inquiry.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inquiries Management</h1>
        <p className="text-gray-600">Handle client inquiries and support requests</p>
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
                placeholder="Search inquiries by name, subject, or message..."
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
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {filteredInquiries.map((inquiry, index) => (
          <motion.div
            key={inquiry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="card hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(inquiry.status)}`}>
                      {inquiry.status.replace('_', ' ').charAt(0).toUpperCase() + inquiry.status.replace('_', ' ').slice(1)}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(inquiry.priority)}`}>
                      {inquiry.priority.charAt(0).toUpperCase() + inquiry.priority.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {inquiry.category}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {inquiry.date} at {inquiry.time}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{inquiry.subject}</h3>
                <p className="text-gray-600 mb-3 line-clamp-2">{inquiry.message}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {inquiry.name}
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {inquiry.email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {inquiry.phone}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button className="p-2 text-cemetery-600 hover:text-cemetery-700 hover:bg-cemetery-50 rounded-md">
                  <Reply className="w-4 h-4" />
                </button>
                <button className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md">
                  <CheckCircle className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md">
                  <Archive className="w-4 h-4" />
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
          <div className="text-2xl font-bold text-blue-600">12</div>
          <div className="text-sm text-gray-600">New Inquiries</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card text-center"
        >
          <div className="text-2xl font-bold text-yellow-600">8</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card text-center"
        >
          <div className="text-2xl font-bold text-green-600">45</div>
          <div className="text-sm text-gray-600">Resolved Today</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="card text-center"
        >
          <div className="text-2xl font-bold text-gray-600">2.3h</div>
          <div className="text-sm text-gray-600">Avg Response Time</div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="card"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 text-left">
            <div className="flex items-center mb-2">
              <Mail className="w-5 h-5 text-cemetery-600 mr-2" />
              <span className="font-medium text-gray-900">Send Bulk Email</span>
            </div>
            <p className="text-sm text-gray-600">Send updates to multiple clients</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 text-left">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-cemetery-600 mr-2" />
              <span className="font-medium text-gray-900">Schedule Follow-up</span>
            </div>
            <p className="text-sm text-gray-600">Set reminders for pending inquiries</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 text-left">
            <div className="flex items-center mb-2">
              <MessageSquare className="w-5 h-5 text-cemetery-600 mr-2" />
              <span className="font-medium text-gray-900">Create Template</span>
            </div>
            <p className="text-sm text-gray-600">Create response templates</p>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Inquiries;