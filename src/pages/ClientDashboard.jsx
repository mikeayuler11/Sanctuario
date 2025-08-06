import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Heart,
  Users,
  FileText,
  Phone,
  Mail,
  LogOut,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ClientDashboard = () => {
  const { user, logout } = useAuth();

  // Mock data for client
  const familyRecords = [
    {
      id: 1,
      name: "Maria Santos",
      relationship: "Mother",
      birthDate: "1945-03-15",
      deathDate: "2020-08-22",
      graveLocation: "Section A, Block 12, Lot 45",
      status: "Buried"
    },
    {
      id: 2,
      name: "Jose Santos",
      relationship: "Father",
      birthDate: "1940-07-10",
      deathDate: "2018-12-05",
      graveLocation: "Section A, Block 12, Lot 46",
      status: "Buried"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "Maintenance",
      description: "Flowers placed on Maria Santos' grave",
      date: "2025-01-15",
      status: "Completed"
    },
    {
      id: 2,
      type: "Visit",
      description: "Family visit recorded",
      date: "2025-01-10",
      status: "Completed"
    }
  ];

  const quickActions = [
    {
      title: "View Grave Locations",
      description: "Find your loved ones' resting places",
      icon: <MapPin className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Schedule Visit",
      description: "Plan your next visit to the memorial park",
      icon: <Calendar className="w-6 h-6" />,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Request Maintenance",
      description: "Request grave maintenance or flower placement",
      icon: <Heart className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Contact Support",
      description: "Get help with any questions or concerns",
      icon: <Phone className="w-6 h-6" />,
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-memorial">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-serif font-bold text-gradient">
                Sanctuario de Santa Rosa de Lima
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Welcome, {user?.name}</p>
                <p className="text-xs text-gray-500">Client Portal</p>
              </div>
              <div className="w-8 h-8 bg-cemetery-100 rounded-full flex items-center justify-center">
                <span className="text-cemetery-700 font-medium text-sm">
                  {user?.avatar}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            Welcome to Your Family Portal
          </h1>
          <p className="text-gray-600">
            Access your family records and manage your loved ones' memorial information
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="card hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  {action.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {action.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {action.description}
                </p>
                <ArrowRight className="w-4 h-4 text-cemetery-600 group-hover:translate-x-1 transition-transform duration-200" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Family Records */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Family Records</h2>
              <Users className="w-5 h-5 text-cemetery-600" />
            </div>
            
            <div className="space-y-4">
              {familyRecords.map((record) => (
                <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{record.name}</h3>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {record.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {record.relationship} • {record.birthDate} - {record.deathDate}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    {record.graveLocation}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
              <FileText className="w-5 h-5 text-cemetery-600" />
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-cemetery-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900">{activity.type}</h3>
                      <span className="text-xs text-gray-500">{activity.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 card"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-cemetery-600" />
              <div>
                <p className="font-medium text-gray-900">Phone</p>
                <p className="text-sm text-gray-600">+63 2 1234 5678</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-cemetery-600" />
              <div>
                <p className="font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">support@sanctuario.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-cemetery-600" />
              <div>
                <p className="font-medium text-gray-900">Location</p>
                <p className="text-sm text-gray-600">123 Memorial Drive, Santa Rosa</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ClientDashboard;