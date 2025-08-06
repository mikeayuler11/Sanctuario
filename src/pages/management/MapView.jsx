import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Layers, Search, ZoomIn, ZoomOut } from 'lucide-react';

const MapView = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Digital Mapping System</h1>
        <p className="text-gray-600">Interactive cemetery map and grave location system</p>
      </div>

      {/* Map Controls */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Map Controls</h2>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md">
              <ZoomOut className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md">
              <Layers className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for graves, sections, or names..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-cemetery-500 focus:border-cemetery-500"
          />
        </div>

        {/* Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg h-96 flex items-center justify-center border-2 border-dashed border-gray-300"
        >
          <div className="text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Digital Mapping System
            </h3>
            <p className="text-gray-500 max-w-md">
              This area will contain the interactive cemetery map with grave locations, 
              sections, and navigation features. The mapping system is currently under development.
            </p>
          </div>
        </motion.div>

        {/* Map Legend */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Map Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-600">Occupied</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm text-gray-600">Reserved</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">Maintenance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Cemetery Sections</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Section A</span>
              <span className="text-sm font-medium">85% Full</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Section B</span>
              <span className="text-sm font-medium">60% Full</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Section C</span>
              <span className="text-sm font-medium">45% Full</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Section D</span>
              <span className="text-sm font-medium">30% Full</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Stats</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Total Graves</p>
              <p className="text-2xl font-bold text-gray-900">2,450</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-xl font-semibold text-green-600">1,592</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Occupied</p>
              <p className="text-xl font-semibold text-red-600">858</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Activity</h3>
          <div className="space-y-2">
            <div className="text-sm">
              <p className="font-medium text-gray-900">New Burial</p>
              <p className="text-gray-600">Section A, Block 12, Lot 45</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Maintenance</p>
              <p className="text-gray-600">Section B, Block 8, Lot 23</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Reservation</p>
              <p className="text-gray-600">Section C, Block 15, Lot 67</p>
              <p className="text-xs text-gray-500">3 days ago</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MapView;