import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, MapPin, Users, Shield, Bell, Home, Truck, BarChart2, Clock, LifeBuoy } from 'lucide-react';
import EmergencyMap from '../../components/EmergencyMap';
import { useAuth } from '../../contexts/AuthContext';

// Mock data for demonstration
const mockSOSRequests = [
  { 
    id: '1', 
    type: 'medical', 
    status: 'in-progress', 
    location: { lat: 34.052, lng: -118.243 }, 
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    responder: 'Medical Team A'
  },
  { 
    id: '2', 
    type: 'shelter', 
    status: 'pending', 
    location: { lat: 34.055, lng: -118.248 }, 
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    responder: null
  },
  { 
    id: '3', 
    type: 'food', 
    status: 'resolved', 
    location: { lat: 34.048, lng: -118.252 }, 
    timestamp: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
    responder: 'Supply Team B'
  },
  { 
    id: '4', 
    type: 'medical', 
    status: 'pending', 
    location: { lat: 34.057, lng: -118.240 }, 
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    responder: null
  },
  { 
    id: '5', 
    type: 'shelter', 
    status: 'in-progress', 
    location: { lat: 34.060, lng: -118.235 }, 
    timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
    responder: 'Shelter Team C'
  }
];

const mockResources = [
  {
    id: '1',
    type: 'ambulance',
    count: 5,
    available: 2,
    inUse: 3
  },
  {
    id: '2',
    type: 'shelter',
    count: 3,
    available: 3,
    capacity: 450,
    currentOccupancy: 215
  },
  {
    id: '3',
    type: 'food',
    count: 1000,
    unit: 'meals',
    available: 650,
    distributed: 350
  },
  {
    id: '4',
    type: 'water',
    count: 5000,
    unit: 'gallons',
    available: 3200,
    distributed: 1800
  }
];

const mockResponders = [
  {
    id: '1',
    name: 'Medical Team A',
    type: 'medical',
    status: 'active',
    location: { lat: 34.045, lng: -118.255 }
  },
  {
    id: '2',
    name: 'Supply Team B',
    type: 'supply',
    status: 'active',
    location: { lat: 34.060, lng: -118.235 }
  },
  {
    id: '3',
    name: 'Shelter Team C',
    type: 'shelter',
    status: 'active',
    location: { lat: 34.050, lng: -118.260 }
  },
  {
    id: '4',
    name: 'Medical Team D',
    type: 'medical',
    status: 'inactive'
  }
];

// Convert mock data to map markers
const mockMapMarkers = [
  ...mockSOSRequests.map(sos => ({
    id: sos.id,
    type: 'sos' as const,
    location: sos.location,
    title: `SOS: ${sos.type.charAt(0).toUpperCase() + sos.type.slice(1)}`,
    description: `Status: ${sos.status}`
  })),
  ...mockResponders
    .filter(responder => responder.status === 'active' && responder.location)
    .map(responder => ({
      id: responder.id,
      type: 'responder' as const,
      location: responder.location,
      title: responder.name,
      description: `Type: ${responder.type}`
    }))
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="status-badge status-badge-pending">Pending</span>;
      case 'in-progress':
        return <span className="status-badge status-badge-in-progress">In Progress</span>;
      case 'resolved':
        return <span className="status-badge status-badge-resolved">Resolved</span>;
      default:
        return <span className="status-badge status-badge-pending">Pending</span>;
    }
  };

  const getResourceAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 60) return 'bg-green-500';
    if (percentage > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const pendingRequestsCount = mockSOSRequests.filter(r => r.status === 'pending').length;
  const activeRequestsCount = mockSOSRequests.filter(r => r.status === 'in-progress').length;
  const resolvedRequestsCount = mockSOSRequests.filter(r => r.status === 'resolved').length;
  const activeRespondersCount = mockResponders.filter(r => r.status === 'active').length;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Emergency Operations Overview</p>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-red-100 mr-3">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending SOS</p>
                <p className="text-xl font-bold text-gray-900">{pendingRequestsCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-100 mr-3">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Requests</p>
                <p className="text-xl font-bold text-gray-900">{activeRequestsCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-green-100 mr-3">
                <Shield className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Responders</p>
                <p className="text-xl font-bold text-gray-900">{activeRespondersCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-purple-100 mr-3">
                <Home className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Available Shelters</p>
                <p className="text-xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tab navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setSelectedTab('overview')}
              className={`${
                selectedTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedTab('requests')}
              className={`${
                selectedTab === 'requests'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
            >
              SOS Requests
            </button>
            <button
              onClick={() => setSelectedTab('resources')}
              className={`${
                selectedTab === 'resources'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
            >
              Resources
            </button>
            <button
              onClick={() => setSelectedTab('responders')}
              className={`${
                selectedTab === 'responders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
            >
              Responders
            </button>
          </nav>
        </div>
        
        {/* Tab content */}
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Emergency Map</h2>
                  <button className="text-sm text-blue-600 hover:text-blue-700">View Fullscreen</button>
                </div>
                <div className="h-96">
                  <EmergencyMap 
                    markers={mockMapMarkers}
                    showUserLocation={false}
                  />
                </div>
              </div>
              
              {/* Recent activity */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                  <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <Shield className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Medical Team A responded to SOS #1
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(new Date(Date.now() - 25 * 60000).toISOString())}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        New SOS request #4 received
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(new Date(Date.now() - 45 * 60000).toISOString())}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <Home className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Shelter at Community Center is now at 50% capacity
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(new Date(Date.now() - 120 * 60000).toISOString())}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <Bell className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Public alert issued for downtown area
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(new Date(Date.now() - 180 * 60000).toISOString())}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right sidebar */}
            <div>
              {/* Send alert panel */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Send Public Alert</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="alert-title" className="block text-sm font-medium text-gray-700 mb-1">
                      Alert Title
                    </label>
                    <input
                      type="text"
                      id="alert-title"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Brief, clear title"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="alert-message" className="block text-sm font-medium text-gray-700 mb-1">
                      Alert Message
                    </label>
                    <textarea
                      id="alert-message"
                      rows={3}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Provide clear instructions and information..."
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="alert-severity" className="block text-sm font-medium text-gray-700 mb-1">
                      Severity Level
                    </label>
                    <select
                      id="alert-severity"
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="low">Low - Informational</option>
                      <option value="medium">Medium - Caution</option>
                      <option value="high">High - Take Action Now</option>
                      <option value="critical">Critical - Immediate Danger</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="alert-sound"
                      name="alert-sound"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="alert-sound" className="ml-2 block text-sm text-gray-900">
                      Send with alert sound
                    </label>
                  </div>
                  
                  <button
                    type="button"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Send Alert
                  </button>
                </div>
              </div>
              
              {/* Stats summary */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h2>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">SOS Requests</span>
                      <span className="text-sm text-gray-500">{pendingRequestsCount + activeRequestsCount + resolvedRequestsCount} total</span>
                    </div>
                    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div className="flex h-full">
                        <div
                          className="bg-red-500"
                          style={{ width: `${(pendingRequestsCount / (pendingRequestsCount + activeRequestsCount + resolvedRequestsCount)) * 100}%` }}
                        ></div>
                        <div
                          className="bg-blue-500"
                          style={{ width: `${(activeRequestsCount / (pendingRequestsCount + activeRequestsCount + resolvedRequestsCount)) * 100}%` }}
                        ></div>
                        <div
                          className="bg-green-500"
                          style={{ width: `${(resolvedRequestsCount / (pendingRequestsCount + activeRequestsCount + resolvedRequestsCount)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex text-xs mt-1">
                      <div className="flex items-center mr-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                        <span>Pending</span>
                      </div>
                      <div className="flex items-center mr-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                        <span>Active</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                        <span>Resolved</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Shelter Capacity</span>
                      <span className="text-sm text-gray-500">48% occupied</span>
                    </div>
                    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '48%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Medical Resources</span>
                      <span className="text-sm text-gray-500">62% available</span>
                    </div>
                    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '62%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Food Supplies</span>
                      <span className="text-sm text-gray-500">35% distributed</span>
                    </div>
                    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick actions */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                
                <div className="grid grid-cols-2 gap-3">
                  <button className="inline-flex flex-col items-center justify-center p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                    <Bell className="h-6 w-6 text-blue-500 mb-1" />
                    <span className="text-sm">Send Alert</span>
                  </button>
                  
                  <button className="inline-flex flex-col items-center justify-center p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                    <Shield className="h-6 w-6 text-green-500 mb-1" />
                    <span className="text-sm">Deploy Responders</span>
                  </button>
                  
                  <button className="inline-flex flex-col items-center justify-center p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                    <Home className="h-6 w-6 text-purple-500 mb-1" />
                    <span className="text-sm">Manage Shelters</span>
                  </button>
                  
                  <button className="inline-flex flex-col items-center justify-center p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                    <BarChart2 className="h-6 w-6 text-amber-500 mb-1" />
                    <span className="text-sm">View Reports</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {selectedTab === 'requests' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">All SOS Requests</h2>
              <div className="flex space-x-2">
                <select className="text-sm border-gray-300 rounded-md">
                  <option>All Types</option>
                  <option>Medical</option>
                  <option>Shelter</option>
                  <option>Food</option>
                </select>
                <select className="text-sm border-gray-300 rounded-md">
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </div>
            </div>
            
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockSOSRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{request.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center">
                        {request.type === 'medical' && <LifeBuoy className="h-4 w-4 text-red-500 mr-1" />}
                        {request.type === 'shelter' && <Home className="h-4 w-4 text-blue-500 mr-1" />}
                        {request.type === 'food' && <Truck className="h-4 w-4 text-green-500 mr-1" />}
                        <span className="capitalize">{request.type}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                        {request.location.lat.toFixed(3)}, {request.location.lng.toFixed(3)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.responder ? request.responder : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">View</button>
                      {!request.responder && (
                        <button className="text-green-600 hover:text-green-800">Assign</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Previous
                </button>
                <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">12</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      1
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      2
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      3
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {selectedTab === 'resources' && (
          <div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Resource Utilization</h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {mockResources.map((resource) => (
                    <div key={resource.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 capitalize">{resource.type}</h4>
                      
                      {resource.type === 'shelter' ? (
                        <>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-500">Capacity</span>
                            <span className="text-sm font-medium">{resource.currentOccupancy}/{resource.capacity}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={resource.currentOccupancy / resource.capacity > 0.8 ? 'bg-red-500' : 'bg-green-500'} 
                              style={{ width: `${(resource.currentOccupancy / resource.capacity) * 100}%` }}
                              className="h-full"
                            ></div>
                          </div>
                        </>
                      ) : resource.unit ? (
                        <>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-500">Available</span>
                            <span className="text-sm font-medium">{resource.available}/{resource.count} {resource.unit}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={getResourceAvailabilityColor(resource.available, resource.count)}
                              style={{ width: `${(resource.available / resource.count) * 100}%` }}
                              className="h-full"
                            ></div>
                          </div>
                          <div className="mt-2 flex justify-between text-xs text-gray-500">
                            <span>Distributed: {resource.distributed} {resource.unit}</span>
                            <span>{Math.round((resource.available / resource.count) * 100)}% available</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-500">Available</span>
                            <span className="text-sm font-medium">{resource.available}/{resource.count}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={getResourceAvailabilityColor(resource.available, resource.count)}
                              style={{ width: `${(resource.available / resource.count) * 100}%` }}
                              className="h-full"
                            ></div>
                          </div>
                          <div className="mt-2 flex justify-between text-xs text-gray-500">
                            <span>In Use: {resource.inUse || resource.count - resource.available}</span>
                            <span>{Math.round((resource.available / resource.count) * 100)}% available</span>
                          </div>
                        </>
                      )}
                      
                      <div className="mt-3 flex justify-end">
                        <button className="text-xs font-medium text-blue-600 hover:text-blue-700">Update</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add Resource</h3>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="resource-type" className="block text-sm font-medium text-gray-700">
                        Resource Type
                      </label>
                      <select
                        id="resource-type"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option>Ambulance</option>
                        <option>Shelter</option>
                        <option>Food</option>
                        <option>Water</option>
                        <option>Medical Supplies</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="resource-quantity" className="block text-sm font-medium text-gray-700">
                          Quantity
                        </label>
                        <input
                          type="number"
                          id="resource-quantity"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          min="1"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="resource-unit" className="block text-sm font-medium text-gray-700">
                          Unit (optional)
                        </label>
                        <input
                          type="text"
                          id="resource-unit"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="e.g., gallons, meals"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="resource-location" className="block text-sm font-medium text-gray-700">
                        Location (optional)
                      </label>
                      <input
                        type="text"
                        id="resource-location"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Address or coordinates"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="resource-notes" className="block text-sm font-medium text-gray-700">
                        Notes (optional)
                      </label>
                      <textarea
                        id="resource-notes"
                        rows={3}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      ></textarea>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Add Resource
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Resource Requests</h3>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-md p-3">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium text-gray-900">Medical Team A</h4>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Requested additional medical supplies</p>
                      <div className="mt-2 flex justify-end space-x-3">
                        <button className="text-xs font-medium text-green-600 hover:text-green-700">Approve</button>
                        <button className="text-xs font-medium text-red-600 hover:text-red-700">Deny</button>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-md p-3">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium text-gray-900">Community Center Shelter</h4>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Needs 50 more meal kits</p>
                      <div className="mt-2 flex justify-end space-x-3">
                        <button className="text-xs font-medium text-green-600 hover:text-green-700">Approve</button>
                        <button className="text-xs font-medium text-red-600 hover:text-red-700">Deny</button>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-md p-3">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium text-gray-900">Supply Team B</h4>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Approved
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Additional water supplies - 200 gallons</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {selectedTab === 'responders' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Responders</h2>
              <button
                type="button"
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Responder
              </button>
            </div>
            
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignments
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockResponders.map((responder) => (
                  <tr key={responder.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <Shield className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{responder.name}</div>
                          <div className="text-sm text-gray-500">ID: {responder.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="capitalize">{responder.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        responder.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          responder.status === 'active' ? 'bg-green-600' : 'bg-gray-600'
                        }`}></div>
                        {responder.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {responder.location ? (
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                          {responder.location.lat.toFixed(3)}, {responder.location.lng.toFixed(3)}
                        </span>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {responder.id === '1' ? '1 active' : responder.id === '2' ? '2 active' : '0 active'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-3">
                        <button className="text-blue-600 hover:text-blue-800">Details</button>
                        {responder.status === 'active' ? (
                          <button className="text-gray-600 hover:text-gray-800">Set Inactive</button>
                        ) : (
                          <button className="text-green-600 hover:text-green-800">Set Active</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;