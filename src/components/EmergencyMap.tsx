import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons for different types of markers
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const sosIcon = createCustomIcon('#ef4444'); // red
const responderIcon = createCustomIcon('#22c55e'); // green
const shelterIcon = createCustomIcon('#3b82f6'); // blue

interface Location {
  lat: number;
  lng: number;
}

interface MarkerItem {
  id: string;
  type: 'sos' | 'responder' | 'shelter';
  location: Location;
  title: string;
  description: string;
}

interface EmergencyMapProps {
  center?: Location;
  zoom?: number;
  markers?: MarkerItem[];
  onMarkerClick?: (marker: MarkerItem) => void;
  showUserLocation?: boolean;
}

const EmergencyMap: React.FC<EmergencyMapProps> = ({
  center = { lat: 34.0522, lng: -118.2437 }, // Los Angeles by default
  zoom = 12,
  markers = [],
  onMarkerClick,
  showUserLocation = true,
}) => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (showUserLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoading(false);
        },
        (err) => {
          console.error('Error getting location', err);
          setError('Could not get your location. Using default location.');
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, [showUserLocation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const mapCenter = userLocation || center;

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'sos':
        return sosIcon;
      case 'responder':
        return responderIcon;
      case 'shelter':
        return shelterIcon;
      default:
        return DefaultIcon;
    }
  };

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-md border border-gray-200">
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User location marker */}
        {userLocation && (
          <Marker 
            position={[userLocation.lat, userLocation.lng]}
            icon={L.divIcon({
              className: 'custom-div-icon',
              html: `<div class="pulse-dot">
                      <div class="pulse-core"></div>
                      <div class="pulse-circle"></div>
                    </div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })}
          >
            <Popup>
              <div>
                <h3 className="font-semibold">Your Location</h3>
                <p>Lat: {userLocation.lat.toFixed(6)}</p>
                <p>Lng: {userLocation.lng.toFixed(6)}</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Other markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.location.lat, marker.location.lng]}
            icon={getMarkerIcon(marker.type)}
            eventHandlers={{
              click: () => {
                if (onMarkerClick) {
                  onMarkerClick(marker);
                }
              },
            }}
          >
            <Popup>
              <div>
                <h3 className="font-semibold">{marker.title}</h3>
                <p className="text-sm">{marker.description}</p>
                {marker.type === 'sos' && (
                  <button 
                    className="mt-2 bg-red-500 text-white px-2 py-1 text-xs rounded"
                    onClick={() => onMarkerClick && onMarkerClick(marker)}
                  >
                    Respond
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Map Legend */}
      <div className="absolute bottom-2 right-2 bg-white p-2 rounded shadow-md text-sm z-[1000]">
        <div className="font-medium mb-1">Legend</div>
        <div className="flex items-center my-1">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <span>SOS Request</span>
        </div>
        <div className="flex items-center my-1">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span>Responder</span>
        </div>
        <div className="flex items-center my-1">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
          <span>Shelter</span>
        </div>
      </div>
    </div>
  );
};

export default EmergencyMap;