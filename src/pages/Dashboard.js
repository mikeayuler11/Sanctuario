import React from 'react';
import {
  Users,
  DollarSign,
  MapPin,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle
} from 'lucide-react';

const Dashboard = () => {
  // Mock data - in real app, this would come from API
  const stats = [
    {
      title: 'Total Graves',
      value: '1,247',
      change: '+12',
      changeType: 'increase',
      icon: MapPin,
      color: 'bg-blue-500'
    },
    {
      title: 'Occupied Graves',
      value: '892',
      change: '+8',
      changeType: 'increase',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Monthly Revenue',
      value: '$45,890',
      change: '+15%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'bg-yellow-500'
    },
    {
      title: 'Pending Maintenance',
      value: '23',
      change: '-5',
      changeType: 'decrease',
      icon: AlertTriangle,
      color: 'bg-red-500'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'grave_registered',
      message: 'New grave registered for Maria Santos',
      time: '2 hours ago',
      icon: Users,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'payment_received',
      message: 'Payment received for Plot A-125',
      time: '4 hours ago',
      icon: DollarSign,
      color: 'text-blue-600'
    },
    {
      id: 3,
      type: 'maintenance_completed',
      message: 'Maintenance completed for Section B',
      time: '6 hours ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 4,
      type: 'inquiry_received',
      message: 'New inquiry from John Doe',
      time: '8 hours ago',
      icon: Clock,
      color: 'text-yellow-600'
    }
  ];

  const upcomingMaintenance = [
    {
      id: 1,
      section: 'Section A',
      type: 'Landscaping',
      date: '2024-01-15',
      priority: 'High'
    },
    {
      id: 2,
      section: 'Section C',
      type: 'Monument Cleaning',
      date: '2024-01-18',
      priority: 'Medium'
    },
    {
      id: 3,
      section: 'Chapel Area',
      type: 'General Maintenance',
      date: '2024-01-20',
      priority: 'Low'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <span className={`ml-2 text-sm font-medium ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-center">
                  <div className={`p-2 rounded-lg ${activity.color} bg-opacity-10`}>
                    <Icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Maintenance */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Maintenance</h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {upcomingMaintenance.map((item) => (
              <div key={item.id} className="border-l-4 border-primary-400 pl-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.section}</p>
                    <p className="text-xs text-gray-500">{item.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">{item.date}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.priority === 'High' ? 'bg-red-100 text-red-800' :
                      item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="btn-primary text-center">
            Add New Grave
          </button>
          <button className="btn-secondary text-center">
            Record Payment
          </button>
          <button className="btn-secondary text-center">
            Schedule Maintenance
          </button>
          <button className="btn-secondary text-center">
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;