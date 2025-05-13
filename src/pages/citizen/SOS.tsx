import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, AlertTriangle, Activity, Home, Users, Send, Info, FileText } from 'lucide-react';
import EmergencyMap from '../../components/EmergencyMap';
import { useAuth } from '../../contexts/AuthContext';

const SOSTypes = [
  { id: 'medical', name: 'Medical', icon: Activity, color: 'text-red-500', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  { id: 'shelter', name: 'Shelter', icon: Home, color: 'text-blue-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  { id: 'food', name: 'Food/Water', icon: Users, color: 'text-green-500', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
];

const CitizenSOS = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('');
  const [description, setDescription] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [peopleCount, setPeopleCount] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocating(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocating(false);
        // Set a fallback location (Los Angeles)
        setLocation({ lat: 34.0522, lng: -118.2437 });
      }
    );
  }, []);

  const handleSubmit = async () => {
    if (!selectedType || !location) return;
    
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/citizen/dashboard');
      }, 3000);
    }, 1500);
  };

  const nextStep = () => {
    if (step === 1 && !selectedType) return;
    if (step === 2 && !description) return;
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">SOS Request Sent</h3>
            <p className="mt-2 text-sm text-gray-500">
              Your emergency has been reported. Responders have been notified and will assist you shortly.
            </p>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500">Request ID: SOS-{Date.now().toString().slice(-6)}</p>
            </div>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => navigate('/citizen/dashboard')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-red-600 text-white py-4 px-6">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 mr-2" />
              <h1 className="text-xl font-bold">Emergency SOS Request</h1>
            </div>
            <p className="text-red-100 text-sm mt-1">Please provide details about your emergency situation</p>
          </div>
          
          {/* Progress Steps */}
          <div className="px-6 pt-4">
            <div className="flex items-center">
              {[1, 2, 3].map((i) => (
                <React.Fragment key={i}>
                  <div 
                    className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      i < step ? 'bg-green-500 text-white' : i === step ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {i < step ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span>{i}</span>
                    )}
                  </div>
                  {i < 3 && (
                    <div 
                      className={`h-1 flex-1 ${i < step ? 'bg-green-500' : 'bg-gray-200'}`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex text-xs text-gray-500 mt-1">
              <div className="flex-1 text-center">Type</div>
              <div className="flex-1 text-center">Details</div>
              <div className="flex-1 text-center">Location</div>
            </div>
          </div>
          
          {/* Form Content */}
          <div className="p-6">
            {step === 1 && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">What type of emergency do you need help with?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {SOSTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      className={`relative p-4 rounded-lg border ${
                        selectedType === type.id 
                          ? `${type.borderColor} ring-2 ring-red-500` 
                          : 'border-gray-200 hover:border-gray-300'
                      } ${type.bgColor} flex flex-col items-center`}
                    >
                      <type.icon className={`h-8 w-8 ${type.color} mb-2`} />
                      <span className="font-medium text-gray-900">{type.name}</span>
                      
                      {selectedType === type.id && (
                        <div className="absolute top-2 right-2 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!selectedType}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                      !selectedType ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Provide details about your situation</h2>
                
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Brief description of your emergency <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                    placeholder="Describe your situation..."
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional information (optional)
                  </label>
                  <textarea
                    id="additionalInfo"
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    rows={2}
                    className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                    placeholder="Any other details that might help responders..."
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="peopleCount" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of people who need assistance
                  </label>
                  <select
                    id="peopleCount"
                    value={peopleCount}
                    onChange={(e) => setPeopleCount(Number(e.target.value))}
                    className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'person' : 'people'}
                      </option>
                    ))}
                    <option value="11">More than 10 people</option>
                  </select>
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!description}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                      !description ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Confirm your location</h2>
                
                <div className="mb-6">
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Info className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Please confirm your location is correct. Responders will be sent to this location.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-64 mb-4 rounded overflow-hidden border border-gray-200">
                    {locating ? (
                      <div className="h-full flex items-center justify-center bg-gray-100">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
                          <p className="mt-3 text-sm text-gray-500">Getting your location...</p>
                        </div>
                      </div>
                    ) : location ? (
                      <EmergencyMap 
                        center={location}
                        zoom={15}
                        showUserLocation={true}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center bg-gray-100">
                        <div className="text-center">
                          <MapPin className="h-10 w-10 text-red-500 mx-auto" />
                          <p className="mt-2 text-sm text-gray-500">Could not get your location</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {location && (
                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-500 flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <div>Latitude: {location.lat.toFixed(6)}</div>
                        <div>Longitude: {location.lng.toFixed(6)}</div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Summary */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    Request Summary
                  </h3>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="col-span-1">
                      <dt className="text-gray-500">Emergency Type</dt>
                      <dd className="font-medium text-gray-900 capitalize">{selectedType}</dd>
                    </div>
                    <div className="col-span-1">
                      <dt className="text-gray-500">People Affected</dt>
                      <dd className="font-medium text-gray-900">{peopleCount}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-gray-500">Description</dt>
                      <dd className="font-medium text-gray-900">{description}</dd>
                    </div>
                  </dl>
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting || !location}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                      submitting || !location ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending Request...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send SOS Request
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenSOS;