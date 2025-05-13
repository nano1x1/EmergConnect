import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Users, Building, Shield, MapPin } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-red-600 text-white">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:w-2/3">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Emergency Response Coordination Platform
            </h1>
            <p className="text-xl mb-8">
              Connecting citizens, responders, and administrators during crisis situations
              to ensure efficient resource allocation and faster emergency response.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="bg-white text-red-600 hover:bg-gray-100 px-6 py-3 rounded-md font-medium shadow-md transition duration-150"
              >
                Register Now
              </Link>
              <Link
                to="/login"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-600 px-6 py-3 rounded-md font-medium transition duration-150"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How EmergConnect Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform connects those in need with responders and resource managers 
              to streamline emergency response efforts.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Citizen Card */}
            <div className="bg-blue-50 rounded-lg p-8 shadow-sm border border-blue-100 transition-transform hover:transform hover:-translate-y-1">
              <div className="bg-blue-100 p-3 rounded-full w-fit mb-6">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Citizens</h3>
              <p className="text-gray-600 mb-4">
                Report emergencies with location data, find nearby shelters, 
                and receive real-time updates during crisis situations.
              </p>
              <Link to="/register" className="text-blue-600 font-medium hover:underline flex items-center">
                Register as Citizen
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
            
            {/* Responder Card */}
            <div className="bg-emerald-50 rounded-lg p-8 shadow-sm border border-emerald-100 transition-transform hover:transform hover:-translate-y-1">
              <div className="bg-emerald-100 p-3 rounded-full w-fit mb-6">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Responders</h3>
              <p className="text-gray-600 mb-4">
                View and respond to emergency requests, manage resources, 
                and coordinate with other responders in real-time.
              </p>
              <Link to="/register" className="text-emerald-600 font-medium hover:underline flex items-center">
                Register as Responder
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
            
            {/* Admin Card */}
            <div className="bg-purple-50 rounded-lg p-8 shadow-sm border border-purple-100 transition-transform hover:transform hover:-translate-y-1">
              <div className="bg-purple-100 p-3 rounded-full w-fit mb-6">
                <Building className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Administrators</h3>
              <p className="text-gray-600 mb-4">
                Oversee all operations, approve responders, manage resources,
                and send public alerts during emergencies.
              </p>
              <Link to="/register" className="text-purple-600 font-medium hover:underline flex items-center">
                Register as Admin
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Preview Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Real-Time Map Tracking</h2>
              <p className="text-lg text-gray-600 mb-6">
                Our interactive map interface shows emergency requests, shelters, and responder 
                locations in real-time, allowing for efficient resource allocation and coordination.
              </p>
              <ul className="space-y-4">
                {[
                  "View all active emergency requests",
                  "Find nearby shelters and resources",
                  "Track responder locations and status",
                  "Receive real-time updates on changing conditions"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2 bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-200 h-96 relative flex items-center justify-center p-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="h-16 w-16 text-red-500 animate-pulse" />
                </div>
                <div className="text-center text-gray-600 bg-white bg-opacity-75 p-4 rounded">
                  <p className="font-medium">Interactive map available after login</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to join our emergency response network?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Whether you're a citizen, responder, or administrator, your participation
            helps create a more resilient community during crisis situations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-md font-medium shadow-md transition duration-150"
            >
              Register Now
            </Link>
            <Link
              to="/login"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-md font-medium transition duration-150"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;