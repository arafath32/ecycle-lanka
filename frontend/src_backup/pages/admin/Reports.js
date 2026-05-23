import React, { useEffect, useState } from 'react';
import { getReports } from '../../services/adminService';
import { PageLoader } from '../../components/Loader';

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReports().then(d => setData(d)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const categories = data?.byCategory || [];
  const conditions = data?.byCondition || [];
  const maxCat = Math.max(...categories.map(c => c.count), 1);

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Reports & Analytics</h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>E-Cycle Lanka platform statistics and environmental impact.</p>

        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Items Listed', value: data?.totalListings || 0, icon: '📋' },
            { label: 'Items Exchanged', value: data?.soldItems || 0, icon: '♻️' },
            { label: 'Estimated Waste Diverted (kg)', value: data?.wasteKg || 0, icon: '🌿' },
            { label: 'Total Value (Rs.)', value: (data?.totalValue || 0).toLocaleString(), icon: '💰' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem' }}>{s.icon}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16a34a', margin: '0.25rem 0' }}>{s.value}</div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* By Category */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '1rem' }}>Listings by Category</h2>
            {categories.length === 0 ? (
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>No data yet.</p>
            ) : categories.map(cat => (
              <div key={cat._id} style={{ marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
                  <span>{cat._id}</span>
                  <span style={{ fontWeight: 600, color: '#16a34a' }}>{cat.count}</span>
                </div>
                <div style={{ height: 8, background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(cat.count / maxCat) * 100}%`, background: '#16a34a', borderRadius: '4px', transition: 'width 0.5s' }} />
                </div>
              </div>
            ))}
          </div>

          {/* By Condition */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '1rem' }}>Listings by Condition</h2>
            {conditions.length === 0 ? (
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>No data yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {conditions.map(c => {
                  const total = conditions.reduce((s, x) => s + x.count, 0);
                  const pct = total ? Math.round((c.count / total) * 100) : 0;
                  const colors = { 'Working - Like New': '#16a34a', 'Working - Good': '#0ea5e9', 'Working - Fair': '#f59e0b', 'For Parts / Not Working': '#ef4444' };
                  return (
                    <div key={c._id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 12, height: 12, borderRadius: '50%', background: colors[c._id] || '#9ca3af', flexShrink: 0 }} />
                      <span style={{ flex: 1, fontSize: '0.85rem' }}>{c._id}</span>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{c.count} ({pct}%)</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="card" style={{ padding: '1.5rem', marginTop: '1.5rem', background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)', borderColor: '#86efac' }}>
          <h2 style={{ fontWeight: 700, color: '#15803d', marginBottom: '0.5rem' }}>🌿 Environmental Impact</h2>
          <p style={{ color: '#166534', fontSize: '0.9rem' }}>
            E-Cycle Lanka has helped divert approximately <strong>{data?.wasteKg || 0} kg</strong> of electronic waste from Sri Lankan landfills. 
            Each item exchanged through our platform reduces toxic materials entering the environment and promotes a circular economy for electronics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
