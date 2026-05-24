import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import Browse from './pages/Browse';
import ItemDetail from './pages/ItemDetail';
import Login from './pages/Login';
import Register from './pages/Register';

// Request Board Pages ← NEW
import RequestBoard from './pages/RequestBoard';
import RequestDetail from './pages/RequestDetail';

// User Pages
import Dashboard from './pages/user/Dashboard';
import PostItem from './pages/user/PostItem';
import EditItem from './pages/user/EditItem';
import MyListings from './pages/user/MyListings';
import Profile from './pages/user/Profile';
import PostRequest from './pages/user/PostRequest';
import MyRequests from './pages/user/MyRequests';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageListings from './pages/admin/ManageListings';
import Reports from './pages/admin/Reports';

import ImpactCalculator from './pages/ImpactCalculator';

const App = () => (
  <AuthProvider>
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/item/:id" element={<ItemDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Request Board — public to browse, login to post */}
            <Route path="/requests" element={<RequestBoard />} />
            <Route path="/requests/:id" element={<RequestDetail />} />

            {/* User (auth required) */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/post-item" element={<PrivateRoute><PostItem /></PrivateRoute>} />
            <Route path="/edit-item/:id" element={<PrivateRoute><EditItem /></PrivateRoute>} />
            <Route path="/my-listings" element={<PrivateRoute><MyListings /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/post-request" element={<PrivateRoute><PostRequest /></PrivateRoute>} />
            <Route path="/my-requests" element={<PrivateRoute><MyRequests /></PrivateRoute>} />

            {/* Admin only */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
            <Route path="/admin/listings" element={<AdminRoute><ManageListings /></AdminRoute>} />
            <Route path="/admin/reports" element={<AdminRoute><Reports /></AdminRoute>} />

            {/* 404 */}
            <Route path="*" element={
              <div style={{ textAlign: 'center', padding: '5rem 1rem', color: '#6b7280' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
                <a href="/" style={{ display: 'inline-block', marginTop: '1.5rem', padding: '0.6rem 1.5rem',
                  background: '#16a34a', color: '#fff', borderRadius: '8px', fontWeight: 500 }}>Go Home</a>
              </div>
            } />
            <Route path="/impact" element={<ImpactCalculator />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  </AuthProvider>
);

export default App;