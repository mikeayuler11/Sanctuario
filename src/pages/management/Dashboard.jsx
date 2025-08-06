import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  MapPin,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  // Mock data for charts
  const monthlyData = [
    { name: 'Jan', burials: 12, maintenance: 8, inquiries: 15 },
    { name: 'Feb', burials: 8, maintenance: 12, inquiries: 10 },
    { name: 'Mar', burials: 15, maintenance: 6, inquiries: 20 },
    { name: 'Apr', burials: 10, maintenance: 9, inquiries: 12 },
    { name: 'May', burials: 18, maintenance: 11, inquiries: 18 },
    { name: 'Jun', burials: 14, maintenance: 7, inquiries: 14 }
  ];

  const pieData = [
    { name: 'Available', value: 65, color: '#10B981' },
    { name: 'Occupied', value: 25, color: '#EF4444' },
    { name: 'Reserved', value: 10, color: '#F59E0B' }
  ];

  const stats = [
    {
      title: 'Total Graves',
      value: '2,450',
      change: '+12%',
      changeType: 'increase',
      icon: <MapPin className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Active Clients',
      value: '1,234',
      change: '+8%',
      changeType: 'increase',
      icon: <Users className="w-6 h-6" />,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Monthly Revenue',
      value: '₱450,000',
      change: '+15%',
      changeType: 'increase',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Pending Inquiries',
      value: '23',
      change: '-5%',
      changeType: 'decrease',
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'Burial',
      description: 'New burial scheduled for Maria Santos',
      time: '2 hours ago',
      status: 'pending',
      user: 'John Doe'
    },
    {
      id: 2,
      type: 'Maintenance',
      description: 'Grave maintenance completed - Section A, Block 5',
      time: '4 hours ago',
      status: 'completed',
      user: 'Staff Member'
    },
    {
      id: 3,
      type: 'Inquiry',
      description: 'New inquiry from client regarding grave reservation',
      time: '6 hours ago',
      status: 'pending',
      user: 'Jane Smith'
    },
    {
      id: 4,
      type: 'Payment',
      description: 'Monthly payment received from Santos family',
      time: '1 day ago',
      status: 'completed',
      user: 'System'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Grave',
      description: 'Register a new burial plot',
      icon: <Plus className="w-5 h-5" />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Schedule Maintenance',
      description: 'Plan grave maintenance tasks',
      icon: <Clock className="w-5 h-5" />,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Process Payment',
      description: 'Handle client payments',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'View Reports',
      description: 'Generate management reports',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.changeType === 'increase' ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-white`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="card"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 text-left group"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform duration-200`}>
                {action.icon}
              </div>
              <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="card"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="burials" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="maintenance" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="inquiries" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Grave Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="card"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Grave Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-6 mt-4">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="card"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
              className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activity.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                {activity.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Clock className="w-5 h-5 text-yellow-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{activity.type}</h3>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-500">by {activity.user}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                activity.status === 'completed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {activity.status}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;