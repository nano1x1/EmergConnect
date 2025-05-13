import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CitizenDashboard from './pages/citizen/Dashboard';
import CitizenSOS from './pages/citizen/SOS';
import ResponderDashboard from './pages/responder/Dashboard';
import ResponderRequests from './pages/responder/Requests';
import AdminDashboard from './pages/admin/Dashboard';
import AdminResources from './pages/admin/Resources';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            
            {/* Citizen Routes */}
            <Route path="citizen" element={<ProtectedRoute role="citizen" />}>
              <Route path="dashboard" element={<CitizenDashboard />} />
              <Route path="sos" element={<CitizenSOS />} />
            </Route>
            
            {/* Responder Routes */}
            <Route path="responder" element={<ProtectedRoute role="responder" />}>
              <Route path="dashboard" element={<ResponderDashboard />} />
              <Route path="requests" element={<ResponderRequests />} />
            </Route>
            
            {/* Admin Routes */}
            <Route path="admin" element={<ProtectedRoute role="admin" />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="resources" element={<AdminResources />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;