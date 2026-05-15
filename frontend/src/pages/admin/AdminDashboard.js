import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../../services/adminService';
import { PageLoader } from '../../components/Loader';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats().then(data => setStats(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: '👥', color: '#6366f1', link: '/admin/users' },
    { label: 'Total Listings', value: stats?.totalListings || 0, icon: '📋', color: '#16a34a', link: '/admin/listings' },
    { label: 'Active Listings', value: stats?.activeListings || 0, icon: '✅', color: '#0f766e', link: '/admin/listings' },
    { label: 'Items Sold', value: stats?.soldItems || 0, icon: '🏷️', color: '#f59e0b', link: '/admin/listings' },
    { label: 'Pending Review', value: stats?.pendingItems || 0, icon: '⏳', color: '#ef4444', link: '/admin/listings' },
    { label: 'Total Value (Rs.)', value: (stats?.totalValue || 0).toLocaleString(), icon: '💰', color: '#0ea5e9', link: '/admin/reports' },
  ];

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Admin Dashboard</h1>
          <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>E-Cycle Lanka platform overview</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {cards.map(c => (
            <Link key={c.label} to={c.link} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '1.25rem', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = ''}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>{c.label}</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: c.color }}>{c.value}</p>
                  </div>
                  <span style={{ fontSize: '1.75rem' }}>{c.icon}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {[
            { title: 'Manage Users', desc: 'View, suspend, or remove users', link: '/admin/users', icon: '👥' },
            { title: 'Manage Listings', desc: 'Approve, reject, or remove listings', link: '/admin/listings', icon: '📋' },
            { title: 'Reports & Analytics', desc: 'Category breakdown and trends', link: '/admin/reports', icon: '📊' },
          ].map(q => (
            <Link key={q.title} to={q.link} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '1.5rem', cursor: 'pointer', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#16a34a'}
                onMouseLeave={e => e.currentTarget.style.borderColor = ''}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{q.icon}</div>
                <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{q.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>{q.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
