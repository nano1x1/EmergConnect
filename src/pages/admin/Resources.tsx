import React, { useState } from 'react';
import { Truck, Users, Package, AlertTriangle, Plus, Clock, MapPin, Edit, Trash } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Mock data for demonstration
const mockResources = [
  {
    id: '1',
    type: 'ambulance',
    name: 'Ambulance Unit 1',
    status: 'available',
    location: { lat: 34.052, lng: -118.243 },
    assignedTo: null,
    lastUpdated: new Date(Date.now() - 30 * 60000).toISOString()
  },
  {
    id: '2',
    type: 'shelter',
    name: 'Community Center Shelter',
    status: 'active',
    location: { lat: 34.055, lng: -118.248 },
    capacity: 200,
    currentOccupancy: 85,
    lastUpdated: new Date(Date.now() - 2 * 60 * 60000).toISOString()
  },
  {
    id: '3',
    type: 'supplies',
    name: 'Medical Supply Cache A',
    status: 'low',
    location: { lat: 34.057, lng: -118.240 },
    inventory: {
      'First Aid Kits': { available: 25, total: 50 },
      'Emergency Blankets': { available: 100, total: 200 },
      'Water (gallons)': { available: 150, total: 500 }
    },
    lastUpdated: new Date(Date.now() - 12 * 60 * 60000).toISOString()
  }
];

const AdminResources = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-yellow-100 text-yellow-800';
      case 'unavailable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'ambulance':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'shelter':
        return <Users className="h-5 w-5 text-green-500" />;
      case 'supplies':
        return <Package className="h-5 w-5 text-purple-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredResources = mockResources.filter(
    resource => filter === 'all' || resource.type === filter
  );

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Resource Management</h1>
              <p className="text-gray-600">Manage and track emergency response resources</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
            </button>
          </div>
        </div>

        {/* Resource Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">Vehicles</h2>
                <p className="text-3xl font-bold text-gray-900">5/8</p>
                <p className="text-sm text-gray-500">Available</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">Shelters</h2>
                <p className="text-3xl font-bold text-gray-900">3/3</p>
                <p className="text-sm text-gray-500">Operational</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">Supply Caches</h2>
                <p className="text-3xl font-bold text-gray-900">4/5</p>
                <p className="text-sm text-gray-500">Well-stocked</p>
              </div>
            </div>
          </div>
        </div>

        {/* Resource List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="rounded-md border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Resources</option>
                  <option value="ambulance">Vehicles</option>
                  <option value="shelter">Shelters</option>
                  <option value="supplies">Supplies</option>
                </select>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      {getResourceIcon(resource.type)}
                      <span className="ml-2 font-medium text-gray-900">{resource.name}</span>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(resource.status)}`}>
                        {resource.status}
                      </span>
                    </div>

                    {resource.type === 'shelter' && (
                      <div className="mt-2">
                        <div className="flex justify-between text-sm text-gray-500 mb-1">
                          <span>Occupancy</span>
                          <span>{resource.currentOccupancy}/{resource.capacity}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              (resource.currentOccupancy / resource.capacity) > 0.8
                                ? 'bg-red-500'
                                : (resource.currentOccupancy / resource.capacity) > 0.5
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${(resource.currentOccupancy / resource.capacity) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {resource.type === 'supplies' && resource.inventory && (
                      <div className="mt-2 grid grid-cols-2 gap-4">
                        {Object.entries(resource.inventory).map(([item, stock]) => (
                          <div key={item} className="text-sm">
                            <div className="flex justify-between text-gray-500 mb-1">
                              <span>{item}</span>
                              <span>{stock.available}/{stock.total}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${
                                  (stock.available / stock.total) > 0.8
                                    ? 'bg-green-500'
                                    : (stock.available / stock.total) > 0.3
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${(stock.available / stock.total) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      {resource.location && (
                        <>
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{resource.location.lat.toFixed(3)}, {resource.location.lng.toFixed(3)}</span>
                          <span className="mx-2">•</span>
                        </>
                      )}
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Updated {formatDate(resource.lastUpdated)}</span>
                    </div>
                  </div>

                  <div className="ml-4 flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-500">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-500">
                      <Trash className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredResources.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No matching resources found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminResources;