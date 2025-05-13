import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, MapPin, Bell, Shield, Truck, Clock, CheckCircle, XCircle, Users, ChevronRight } from 'lucide-react';
import EmergencyMap from '../../components/EmergencyMap';
import { useAuth } from '../../contexts/AuthContext';

// Mock data for demonstration
const mockSOSRequests = [
  { 
    id: '1', 
    type: 'medical', 
    status: 'pending', 
    location: { lat: 34.052, lng: -118.243 }, 
    timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    description: 'Medical assistance needed for elderly person with breathing difficulty',
    citizen: { name: 'Emily Johnson', phone: '123-456-7890' },
    urgency: 'high'
  },
  { 
    id: '2', 
    type: 'shelter', 
    status: 'in-progress', 
    location: { lat: 34.057, lng: -118.240 }, 
    timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
    description: 'Family of 4 needs temporary shelter after home flooding',
    citizen: { name: 'Robert Garcia', phone: '123-456-7891' },
    urgency: 'medium',
    assigned: true
  },
  { 
    id: '3', 
    type: 'food', 
    status: 'pending', 
    location: { lat: 34.055, lng: -118.250 }, 
    timestamp: new Date(Date.now() - 55 * 60000).toISOString(),
    description: 'Need food and water supplies for 2 days',
    citizen: { name: 'Sarah Williams', phone: '123-456-7892' },
    urgency: 'low'
  }
];

const mockResources = [
  {
    id: '1',
    type: 'ambulance',
    status: 'available',
    lastUpdated: new Date(Date.now() - 15 * 60000).toISOString()
  },
  {
    id: '2',
    type: 'shelter',
    status: 'in-use',
    location: { lat: 34.042, lng: -118.253 },
    capacity: 50,
    currentOccupancy: 28,
    lastUpdated: new Date(Date.now() - 2 * 60 * 60000).toISOString()
  },
  {
    id: '3',
    type: 'food',
    status: 'low',
    lastUpdated: new Date(Date.now() - 6 * 60 * 60000).toISOString()
  }
];

// Convert mock data to map markers
const mockMapMarkers = [
  ...mockSOSRequests.map(sos => ({
    id: sos.id,
    type: 'sos' as const,
    location: sos.location,
    title: `SOS: ${sos.type.charAt(0).toUpperCase() + sos.type.slice(1)}`,
    description: sos.description
  })),
  ...(mockResources
    .filter(resource => resource.location)
    .map(resource => ({
      id: resource.id,
      type: 'shelter' as const,
      location: resource.location,
      title: `Shelter: ID ${resource.id}`,
      description: `Capacity: ${resource.currentOccupancy}/${resource.capacity}`
    }))
  )
];

// Add some responder markers
const responderMarkers = [
  {
    id: 'r1',
    type: 'responder' as const,
    location: { lat: 34.045, lng: -118.255 },
    title: 'Medical Team A',
    description: 'Active'
  },
  {
    id: 'r2',
    type: 'responder' as const,
    location: { lat: 34.060, lng: -118.235 },
    title: 'Supply Team B',
    description: 'En route'
  }
];

const ResponderDashboard = () => {
  const { user } = useAuth();
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [filter, setFilter] = useState('all');
  
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
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyClass = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getResourceStatusClass = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'in-use':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-yellow-100 text-yellow-800';
      case 'unavailable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequests = filter === 'all' 
    ? mockSOSRequests 
    : mockSOSRequests.filter(req => req.status === filter);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Responder Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
          <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
            Active • On Duty
          </div>
        </div>
        
        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Emergency Map</h2>
                <div className="flex">
                  <button className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                    <Shield className="h-4 w-4 mr-1" />
                    Toggle Duty Status
                  </button>
                </div>
              </div>
              <div className="h-96">
                <EmergencyMap 
                  markers={[...mockMapMarkers, ...responderMarkers]}
                  onMarkerClick={(marker) => setSelectedMarker(marker)}
                  showUserLocation={true}
                />
              </div>
            </div>
            
            {/* Resources Section */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Your Resources</h2>
                <Link 
                  to="/responder/resources" 
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                >
                  Manage Resources
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockResources.map((resource) => (
                  <div 
                    key={resource.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-md font-medium text-gray-900 capitalize">{resource.type}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getResourceStatusClass(resource.status)}`}>
                          {resource.status}
                        </span>
                      </div>
                      {resource.type === 'ambulance' && <Truck className="h-5 w-5 text-blue-500" />}
                      {resource.type === 'shelter' && <Users className="h-5 w-5 text-green-500" />}
                      {resource.type === 'food' && <Truck className="h-5 w-5 text-yellow-500" />}
                    </div>
                    
                    {resource.type === 'shelter' && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Occupancy</span>
                          <span>{resource.currentOccupancy}/{resource.capacity}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              resource.currentOccupancy / resource.capacity > 0.8 
                                ? 'bg-red-500' 
                                : resource.currentOccupancy / resource.capacity > 0.5 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${(resource.currentOccupancy / resource.capacity) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-2 text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Updated {formatDate(resource.lastUpdated)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right column - SOS Requests & Stats */}
          <div>
            {/* SOS Requests Section */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Emergency Requests</h2>
                <div className="inline-flex rounded-md shadow-sm">
                  <button
                    type="button"
                    onClick={() => setFilter('all')}
                    className={`relative inline-flex items-center px-3 py-1 rounded-l-md border text-sm font-medium ${
                      filter === 'all' 
                        ? 'bg-blue-50 border-blue-300 text-blue-700' 
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilter('pending')}
                    className={`relative inline-flex items-center px-3 py-1 border-t border-b border-r text-sm font-medium ${
                      filter === 'pending' 
                        ? 'bg-blue-50 border-blue-300 text-blue-700' 
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilter('in-progress')}
                    className={`relative inline-flex items-center px-3 py-1 rounded-r-md border-t border-b border-r text-sm font-medium ${
                      filter === 'in-progress' 
                        ? 'bg-blue-50 border-blue-300 text-blue-700' 
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Active
                  </button>
                </div>
              </div>
              
              {filteredRequests.length > 0 ? (
                <div className="space-y-3">
                  {filteredRequests.map((request) => (
                    <div 
                      key={request.id} 
                      className={`p-3 rounded-md border ${request.assigned ? 'border-blue-200 bg-blue-50' : 'border-gray-200'} hover:shadow-sm transition-shadow`}
                    >
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <AlertTriangle className={`h-5 w-5 ${
                            request.type === 'medical' ? 'text-red-500' : 
                            request.type === 'shelter' ? 'text-blue-500' : 'text-green-500'
                          } mr-2`} />
                          <span className="font-medium text-gray-900 capitalize">{request.type}</span>
                        </div>
                        <div className="flex space-x-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getUrgencyClass(request.urgency)}`}>
                            {request.urgency}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClass(request.status)}`}>
                            {request.status}
                          </span>
                        </div>
                      </div>
                      
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">{request.description}</p>
                      
                      <div className="mt-2 flex justify-between items-center">
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>
                            {request.location.lat.toFixed(3)}, {request.location.lng.toFixed(3)}
                          </span>
                          <span className="mx-2">•</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{formatDate(request.timestamp)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex justify-between">
                        <div className="text-xs text-gray-500">
                          From: {request.citizen.name}
                        </div>
                        <div className="flex space-x-2">
                          {request.assigned ? (
                            <button className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Assigned to You
                            </button>
                          ) : (
                            <>
                              <button className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700 hover:bg-green-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Accept
                              </button>
                              <button className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700 hover:bg-gray-200">
                                <XCircle className="h-3 w-3 mr-1" />
                                Decline
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">No matching requests found.</p>
                </div>
              )}
              
              <div className="mt-4">
                <Link 
                  to="/responder/requests" 
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center justify-center"
                >
                  View All Requests
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
            
            {/* Stats Summary */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Summary</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <div className="text-3xl font-bold text-blue-700">5</div>
                  <div className="text-sm text-blue-600">Requests Assigned</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                  <div className="text-3xl font-bold text-green-700">3</div>
                  <div className="text-sm text-green-600">Resolved Today</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                  <div className="text-3xl font-bold text-purple-700">8</div>
                  <div className="text-sm text-purple-600">Total Hours Active</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                  <div className="text-3xl font-bold text-amber-700">12</div>
                  <div className="text-sm text-amber-600">Resources Deployed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponderDashboard;