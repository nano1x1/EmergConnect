import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertTriangle, Bell, LogOut, Menu, X } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getNavigation = () => {
    if (!user) return [];

    switch (user.role) {
      case 'admin':
        return [
          { name: 'Dashboard', href: '/admin/dashboard' },
          { name: 'Resources', href: '/admin/resources' },
        ];
      case 'responder':
        return [
          { name: 'Dashboard', href: '/responder/dashboard' },
          { name: 'Requests', href: '/responder/requests' },
        ];
      case 'citizen':
        return [
          { name: 'Dashboard', href: '/citizen/dashboard' },
          { name: 'SOS', href: '/citizen/sos' },
        ];
      default:
        return [];
    }
  };

  const navigation = getNavigation();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-500 mr-2" />
                <span className="text-xl font-bold text-gray-900">EmergConnect</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            {user && (
              <nav className="hidden md:flex space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-700 hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            )}
            
            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <button className="text-gray-700 hover:text-red-500">
                    <Bell className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-sm text-gray-700 hover:text-red-500"
                  >
                    <LogOut className="h-5 w-5 mr-1" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                  
                  {/* Mobile menu button */}
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900"
                  >
                    {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-red-500 text-white hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {menuOpen && user && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
      
      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link to="/" className="flex items-center">
                <AlertTriangle className="h-6 w-6 text-red-400 mr-2" />
                <span className="text-lg font-bold">EmergConnect</span>
              </Link>
              <p className="text-sm text-gray-400 mt-2">
                Connecting communities during emergencies
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Contact Us
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} EmergConnect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;