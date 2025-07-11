import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/common/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Common Pages
import Home from './pages/common/Home';
import Unauthorized from './pages/common/Unauthorized';

// Rider Pages
import RiderDashboard from './pages/rider/Dashboard';
import RiderRides from './pages/rider/Rides';
import RiderProfile from './pages/rider/Profile';

// Driver Pages
import DriverDashboard from './pages/driver/Dashboard';
import DriverRides from './pages/driver/Rides';
import DriverProfile from './pages/driver/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#10B981',
                },
              },
              error: {
                style: {
                  background: '#EF4444',
                },
              },
            }}
          />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Rider Routes */}
            <Route
              path="/rider/dashboard"
              element={
                <ProtectedRoute requiredRole="RIDER">
                  <Layout>
                    <RiderDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/rider/rides"
              element={
                <ProtectedRoute requiredRole="RIDER">
                  <Layout>
                    <RiderRides />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/rider/profile"
              element={
                <ProtectedRoute requiredRole="RIDER">
                  <Layout>
                    <RiderProfile />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Protected Driver Routes */}
            <Route
              path="/driver/dashboard"
              element={
                <ProtectedRoute requiredRole="DRIVER">
                  <Layout>
                    <DriverDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver/rides"
              element={
                <ProtectedRoute requiredRole="DRIVER">
                  <Layout>
                    <DriverRides />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver/profile"
              element={
                <ProtectedRoute requiredRole="DRIVER">
                  <Layout>
                    <DriverProfile />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Redirect to home for unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;