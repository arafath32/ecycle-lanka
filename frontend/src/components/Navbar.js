import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) => ({
    padding: '0.4rem 0.75rem',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: isActive(path) ? '#16a34a' : '#374151',
    background: isActive(path) ? '#dcfce7' : 'transparent',
    transition: 'all 0.15s',
  });

  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{
            width: 34, height: 34, borderRadius: '8px',
            background: 'linear-gradient(135deg,#16a34a,#0f766e)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: '1rem',
          }}>♻</div>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111827' }}>
            E-Cycle <span style={{ color: '#16a34a' }}>Lanka</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Link to="/browse" style={navLinkStyle('/browse')}>Browse</Link>
            <Link to="/requests" style={navLinkStyle('/requests')}>📋 Requests</Link>
            {isAuthenticated && (
              <>
                <Link to="/post-item" style={navLinkStyle('/post-item')}>+ List Item</Link>
                <Link to="/dashboard" style={navLinkStyle('/dashboard')}>Dashboard</Link>
                <Link to="/my-requests" style={navLinkStyle('/my-requests')}>My Requests</Link>
              </>
            )}
          {isAdmin && <Link to="/admin" style={navLinkStyle('/admin')}>Admin</Link>}
        </div>

        {/* Auth buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isAuthenticated ? (
            <>
              <Link to="/profile" style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.35rem 0.75rem', borderRadius: '6px',
                fontSize: '0.875rem', color: '#374151', fontWeight: 500,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: '#16a34a', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 600,
                }}>
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                {user?.name?.split(' ')[0]}
              </Link>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
