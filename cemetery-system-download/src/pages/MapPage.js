import React, { useState } from 'react';
import Map3D from '../components/Map3D';
import { 
  Search, 
  Filter, 
  Download, 
  MapPin, 
  Layers,
  FullScreen,
  RefreshCw
} from 'lucide-react';

const MapPage = () => {
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSection, setFilterSection] = useState('all');
  const [viewMode, setViewMode] = useState('3d'); // 3d or 2d
  const [isFullScreen, setIsFullScreen] = useState(false);

  const sections = ['A', 'B', 'C', 'D'];
  
  const plotData = [
    { id: 'A-1-1', section: 'A', occupied: true, deceased: 'Maria Santos', date: '2023-05-15' },
    { id: 'A-1-2', section: 'A', occupied: false },
    { id: 'B-2-3', section: 'B', occupied: true, deceased: 'John Doe', date: '2023-03-20' },
    // Add more mock data as needed
  ];

  const handlePlotSelect = (plot) => {
    setSelectedPlot(plot);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    // Implement search logic here
  };

  const filteredPlots = plotData.filter(plot => {
    const matchesSearch = plot.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (plot.deceased && plot.deceased.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterSection === 'all' || plot.section === filterSection;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: plotData.length,
    occupied: plotData.filter(p => p.occupied).length,
    available: plotData.filter(p => !p.occupied).length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Cemetery Map</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode(viewMode === '3d' ? '2d' : '3d')}
            className="btn-secondary"
          >
            <Layers className="w-4 h-4 mr-2" />
            {viewMode === '3d' ? '2D View' : '3D View'}
          </button>
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="btn-secondary"
          >
            <FullScreen className="w-4 h-4 mr-2" />
            Full Screen
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Controls Panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search */}
          <div className="card p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Search & Filter</h3>
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by plot ID or name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                value={filterSection}
                onChange={(e) => setFilterSection(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Sections</option>
                {sections.map(section => (
                  <option key={section} value={section}>Section {section}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Statistics */}
          <div className="card p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Statistics</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Plots:</span>
                <span className="font-semibold">{stats.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Occupied:</span>
                <span className="font-semibold text-red-600">{stats.occupied}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Available:</span>
                <span className="font-semibold text-green-600">{stats.available}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Occupancy Rate:</span>
                <span className="font-semibold">
                  {((stats.occupied / stats.total) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="card p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Occupied Plot</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Available Plot</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Pathways</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-400 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Landscaping</span>
              </div>
            </div>
          </div>

          {/* Plot Information */}
          {selectedPlot && (
            <div className="card p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Plot Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-600">Plot ID:</span>
                  <p className="text-sm">{selectedPlot.id}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Section:</span>
                  <p className="text-sm">{selectedPlot.section}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <p className="text-sm">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      selectedPlot.occupied 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {selectedPlot.occupied ? 'Occupied' : 'Available'}
                    </span>
                  </p>
                </div>
                {selectedPlot.occupied && (
                  <>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Deceased:</span>
                      <p className="text-sm">{selectedPlot.deceased}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Date:</span>
                      <p className="text-sm">{selectedPlot.date}</p>
                    </div>
                  </>
                )}
              </div>
              <div className="mt-4 space-y-2">
                <button className="w-full btn-primary text-sm">
                  View Details
                </button>
                <button className="w-full btn-secondary text-sm">
                  Edit Information
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Map Display */}
        <div className={`${isFullScreen ? 'fixed inset-0 z-50 bg-white' : 'lg:col-span-3'}`}>
          <div className="card p-4 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Interactive Cemetery Map</h3>
              <div className="flex items-center space-x-2">
                <button className="btn-secondary text-sm">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </button>
                <button className="btn-secondary text-sm">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Refresh
                </button>
                {isFullScreen && (
                  <button
                    onClick={() => setIsFullScreen(false)}
                    className="btn-secondary text-sm"
                  >
                    Exit Full Screen
                  </button>
                )}
              </div>
            </div>
            
            <div className={`${isFullScreen ? 'h-[calc(100vh-120px)]' : 'h-96'}`}>
              <Map3D
                editable={true}
                onPlotSelect={handlePlotSelect}
                glbFile={null} // You can provide a GLB file URL here
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="btn-primary text-center">
            <MapPin className="w-4 h-4 mx-auto mb-1" />
            Add New Plot
          </button>
          <button className="btn-secondary text-center">
            <Download className="w-4 h-4 mx-auto mb-1" />
            Export Map Data
          </button>
          <button className="btn-secondary text-center">
            <Filter className="w-4 h-4 mx-auto mb-1" />
            Advanced Filter
          </button>
          <button className="btn-secondary text-center">
            <RefreshCw className="w-4 h-4 mx-auto mb-1" />
            Sync Database
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapPage;