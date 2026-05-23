import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar
} from 'recharts';
import { getAdminStats } from '../../services/adminService';
import api from '../../services/api';

const PIE_COLORS = ['#16a34a', '#0f766e', '#0ea5e9', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const [statsData, analyticsRes] = await Promise.all([
          getAdminStats(),
          api.get('/admin/analytics')
        ]);
        setStats(statsData);
        setAnalytics(analyticsRes.data.analytics);
      } catch (err) {
        console.log('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [key]);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
      Loading dashboard...
    </div>
  );

  const cards = [
    { label: 'Total Users', value: analytics?.overview?.totalUsers || 0, icon: '👥', color: '#6366f1', link: '/admin/users' },
    { label: 'Total Listings', value: analytics?.overview?.totalItems || 0, icon: '📋', color: '#16a34a', link: '/admin/listings' },
    { label: 'Active Listings', value: analytics?.overview?.approvedItems || 0, icon: '✅', color: '#0f766e', link: '/admin/listings' },
    { label: 'Pending Review', value: analytics?.overview?.pendingItems || 0, icon: '⏳', color: '#ef4444', link: '/admin/listings' },
    { label: 'Total Requests', value: analytics?.overview?.totalRequests || 0, icon: '📨', color: '#f59e0b', link: '/requests' },
    { label: 'Items Sold', value: analytics?.overview?.soldItems || 0, icon: '🏷️', color: '#0ea5e9', link: '/admin/listings' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a' }}>📊 Admin Dashboard</h1>
          <p style={{ color: '#6b7280', marginTop: '4px' }}>E-Cycle Lanka platform overview and analytics</p>
        </div>
        <button
          onClick={() => setKey(k => k + 1)}
          style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {cards.map(c => (
          <Link key={c.label} to={c.link} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.2rem', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>{c.label}</p>
                  <p style={{ fontSize: '28px', fontWeight: '800', color: c.color, margin: 0 }}>{c.value}</p>
                </div>
                <span style={{ fontSize: '28px' }}>{c.icon}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Line Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a', marginBottom: '1rem' }}>📦 Listings per Month</h3>
          {analytics?.itemsByMonth?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={analytics.itemsByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="items" stroke="#16a34a" strokeWidth={2} dot={{ fill: '#16a34a', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>No data yet</div>
          )}
        </div>

        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a', marginBottom: '1rem' }}>👥 New Users per Month</h3>
          {analytics?.usersByMonth?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={analytics.usersByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>No data yet</div>
          )}
        </div>
      </div>

      {/* Pie and Bar Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a', marginBottom: '1rem' }}>♻️ Listings by Category</h3>
          {analytics?.itemsByCategory?.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={analytics.itemsByCategory} cx="50%" cy="50%" outerRadius={90} dataKey="value"
                  label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {analytics.itemsByCategory.map((entry, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>No data yet</div>
          )}
        </div>

        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a', marginBottom: '1rem' }}>📋 Requests by Urgency</h3>
          {analytics?.requestsByUrgency?.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.requestsByUrgency}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="urgency" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {analytics.requestsByUrgency.map((entry, index) => (
                    <Cell key={index} fill={entry.urgency === 'High' ? '#ef4444' : entry.urgency === 'Medium' ? '#f59e0b' : '#16a34a'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>No data yet</div>
          )}
        </div>
      </div>

      {/* Status Summary */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a', marginBottom: '1rem' }}>📈 Listing Status Overview</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Approved', value: analytics?.overview?.approvedItems || 0, color: '#16a34a', bg: '#f0fdf4' },
            { label: 'Pending', value: analytics?.overview?.pendingItems || 0, color: '#f59e0b', bg: '#fefce8' },
            { label: 'Rejected', value: analytics?.overview?.rejectedItems || 0, color: '#ef4444', bg: '#fef2f2' },
            { label: 'Sold', value: analytics?.overview?.soldItems || 0, color: '#0ea5e9', bg: '#f0f9ff' },
          ].map(item => (
            <div key={item.label} style={{ flex: 1, minWidth: '120px', background: item.bg, borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '800', color: item.color }}>{item.value}</div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {[
          { title: 'Manage Users', desc: 'View and remove users', link: '/admin/users', icon: '👥' },
          { title: 'Manage Listings', desc: 'Approve or reject listings', link: '/admin/listings', icon: '📋' },
          { title: 'Request Board', desc: 'View buyer requests', link: '/requests', icon: '📨' },
          { title: 'Reports', desc: 'Detailed statistics', link: '/admin/reports', icon: '📊' },
        ].map(q => (
          <Link key={q.title} to={q.link} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.2rem', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#16a34a'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}>
              <div style={{ fontSize: '24px', marginBottom: '6px' }}>{q.icon}</div>
              <h3 style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>{q.title}</h3>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{q.desc}</p>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
};

export default AdminDashboard;