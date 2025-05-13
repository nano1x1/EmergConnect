import React, { useState } from 'react';
import { AlertTriangle, MapPin, Clock, Shield, Activity, Home, Truck, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Mock data for demonstration
const mockRequests = [
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
  }
];

const ResponderRequests = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medical':
        return <Activity className="h-5 w-5 text-red-500" />;
      case 'shelter':
        return <Home className="h-5 w-5 text-blue-500" />;
      case 'food':
        return <Truck className="h-5 w-5 text-green-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredRequests = mockRequests
    .filter(request => filter === 'all' || request.status === filter)
    .sort((a, b) => {
      if (sortBy === 'timestamp') {
        return sortOrder === 'desc' 
          ? new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          : new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      }
      return 0;
    });

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Emergency Requests</h1>
          <p className="text-gray-600">Manage and respond to emergency requests</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Filters and Controls */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="rounded-md border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Requests</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-md border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="timestamp">Sort by Time</option>
                  <option value="urgency">Sort by Urgency</option>
                  <option value="type">Sort by Type</option>
                </select>

                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Shield className="h-4 w-4 mr-1" />
                <span>{filteredRequests.length} requests</span>
              </div>
            </div>
          </div>

          {/* Requests List */}
          <div className="divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <div key={request.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      {getTypeIcon(request.type)}
                      <span className="ml-2 font-medium text-gray-900 capitalize">{request.type} Emergency</span>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyClass(request.urgency)}`}>
                        {request.urgency}
                      </span>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(request.status)}`}>
                        {request.status}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-gray-600">{request.description}</p>

                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{request.location.lat.toFixed(3)}, {request.location.lng.toFixed(3)}</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatDate(request.timestamp)}</span>
                    </div>

                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <span className="font-medium text-gray-900">{request.citizen.name}</span>
                      <span className="mx-2">•</span>
                      <span>{request.citizen.phone}</span>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col items-end space-y-2">
                    {request.assigned ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Assigned to You
                      </span>
                    ) : (
                      <>
                        <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept
                        </button>
                        <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                          <XCircle className="h-4 w-4 mr-1" />
                          Decline
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredRequests.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No matching requests found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponderRequests;