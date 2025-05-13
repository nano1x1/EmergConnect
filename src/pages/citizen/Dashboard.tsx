import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, MapPin, Bell, Phone, Activity, Users, Home } from 'lucide-react';
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
    description: 'Medical assistance needed' 
  },
  { 
    id: '2', 
    type: 'shelter', 
    status: 'resolved', 
    location: { lat: 34.055, lng: -118.248 }, 
    timestamp: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
    description: 'Need temporary shelter'
  }
];

const mockShelters = [
  {
    id: '1',
    name: 'Central High School',
    address: '123 Main St, Los Angeles, CA',
    capacity: 250,
    currentOccupancy: 120,
    distance: '1.2 miles',
    location: { lat: 34.058, lng: -118.263 }
  },
  {
    id: '2',
    name: 'Community Center',
    address: '456 Oak Ave, Los Angeles, CA',
    capacity: 180,
    currentOccupancy: 45,
    distance: '2.5 miles',
    location: { lat: 34.042, lng: -118.253 }
  }
];

const mockAlerts = [
  {
    id: '1',
    title: 'Flash Flood Warning',
    description: 'Potential flash floods in downtown area. Avoid low-lying areas.',
    severity: 'high',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString()
  },
  {
    id: '2',
    title: 'Road Closure',
    description: 'Highway 101 closed due to fallen debris. Use alternate routes.',
    severity: 'medium',
    timestamp: new Date(Date.now() - 3 * 60 * 60000).toISOString()
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
  ...mockShelters.map(shelter => ({
    id: shelter.id,
    type: 'shelter' as const,
    location: shelter.location,
    title: shelter.name,
    description: `Capacity: ${shelter.currentOccupancy}/${shelter.capacity}`
  }))
];

const CitizenDashboard = () => {
  const { user } = useAuth();
  const [selectedMarker, setSelectedMarker] = useState(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Citizen Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>
        
        {/* Emergency Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Emergency Actions</h2>
          <div className="grid grid-cols-3 gap-4">
            <Link
              to="/citizen/sos"
              className="flex flex-col items-center justify-center py-4 px-2 rounded-lg bg-red-50 border border-red-100 hover:bg-red-100 transition-colors"
            >
              <AlertTriangle className="h-8 w-8 text-red-600 mb-2" />
              <span className="text-sm font-medium text-red-700">Report Emergency</span>
            </Link>
            <Link
              to="/citizen/shelters"
              className="flex flex-col items-center justify-center py-4 px-2 rounded-lg bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors"
            >
              <Home className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-blue-700">Find Shelter</span>
            </Link>
            <a
              href="tel:911"
              className="flex flex-col items-center justify-center py-4 px-2 rounded-lg bg-purple-50 border border-purple-100 hover:bg-purple-100 transition-colors"
            >
              <Phone className="h-8 w-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-purple-700">Call 911</span>
            </a>
          </div>
        </div>
        
        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Emergency Map</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700">View Fullscreen</button>
              </div>
              <div className="h-96">
                <EmergencyMap 
                  markers={mockMapMarkers}
                  onMarkerClick={(marker) => setSelectedMarker(marker)}
                  showUserLocation={true}
                />
              </div>
            </div>
            
            {/* SOS Request History */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your SOS Request History</h2>
              {mockSOSRequests.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {mockSOSRequests.map((request) => (
                    <div key={request.id} className="py-3 flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        {request.type === 'medical' && <Activity className="h-5 w-5 text-red-500" />}
                        {request.type === 'shelter' && <Home className="h-5 w-5 text-blue-500" />}
                        {request.type === 'food' && <Users className="h-5 w-5 text-green-500" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {request.type.charAt(0).toUpperCase() + request.type.slice(1)} Request
                          </p>
                          <p className="text-sm text-gray-500">{formatDate(request.timestamp)}</p>
                        </div>
                        <p className="text-sm text-gray-500">{request.description}</p>
                        <div className="mt-1">{getStatusBadge(request.status)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">You have not made any SOS requests yet.</p>
              )}
              <div className="mt-4">
                <Link 
                  to="/citizen/sos" 
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Create New SOS Request
                </Link>
              </div>
            </div>
          </div>
          
          {/* Right column - Alerts & Shelters */}
          <div>
            {/* Public Alerts Section */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Public Alerts</h2>
              {mockAlerts.length > 0 ? (
                <div className="space-y-4">
                  {mockAlerts.map((alert) => (
                    <div key={alert.id} className="border border-gray-200 rounded-md p-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          <Bell className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <h3 className="text-sm font-medium text-gray-900">{alert.title}</h3>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSeverityClass(alert.severity)}`}>
                              {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{alert.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatDate(alert.timestamp)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No active alerts at this time.</p>
              )}
            </div>
            
            {/* Nearby Shelters Section */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Nearby Shelters</h2>
              {mockShelters.length > 0 ? (
                <div className="space-y-4">
                  {mockShelters.map((shelter) => (
                    <div key={shelter.id} className="border border-gray-200 rounded-md p-3 hover-card">
                      <h3 className="text-sm font-medium text-gray-900 mb-1">{shelter.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{shelter.address}</p>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          <span className="inline-block mr-3">
                            <Users className="h-3 w-3 inline mr-1" />
                            {shelter.currentOccupancy}/{shelter.capacity}
                          </span>
                          <span className="inline-block">
                            <MapPin className="h-3 w-3 inline mr-1" />
                            {shelter.distance}
                          </span>
                        </div>
                        <button className="text-xs text-blue-600 hover:text-blue-700">Directions</button>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(shelter.currentOccupancy / shelter.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No shelters found in your area.</p>
              )}
              <div className="mt-4">
                <Link 
                  to="/citizen/shelters" 
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View All Shelters
                </Link>
              </div>
            </div>
            
            {/* Emergency Contacts */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contacts</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-700">Emergency</span>
                  </div>
                  <a href="tel:911" className="text-sm font-medium text-red-600 hover:text-red-700">911</a>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-700">Police (non-emergency)</span>
                  </div>
                  <a href="tel:3111234567" className="text-sm font-medium text-blue-600 hover:text-blue-700">(311) 123-4567</a>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-700">Crisis Hotline</span>
                  </div>
                  <a href="tel:8001234567" className="text-sm font-medium text-blue-600 hover:text-blue-700">(800) 123-4567</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;