import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyItems } from '../../services/itemService';
import ItemCard from '../../components/ItemCard';
import { PageLoader } from '../../components/Loader';

const Dashboard = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyItems().then(data => setItems(data.items || data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const active = items.filter(i => i.status === 'active').length;
  const sold = items.filter(i => i.status === 'sold').length;
  const totalValue = items.reduce((s, i) => s + (i.price || 0), 0);

  const StatCard = ({ icon, label, value, color }) => (
    <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ width: 48, height: 48, borderRadius: '10px', background: color + '20',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>{icon}</div>
      <div>
        <p style={{ color: '#6b7280', fontSize: '0.8rem', fontWeight: 500 }}>{label}</p>
        <p style={{ fontSize: '1.4rem', fontWeight: 700, color }}>{value}</p>
      </div>
    </div>
  );

  if (loading) return <PageLoader />;

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
          <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Here's an overview of your activity on E-Cycle Lanka.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <StatCard icon="📋" label="Total Listings" value={items.length} color="#16a34a" />
          <StatCard icon="✅" label="Active" value={active} color="#0f766e" />
          <StatCard icon="🏷️" label="Sold" value={sold} color="#f59e0b" />
          <StatCard icon="💰" label="Total Value" value={`Rs. ${totalValue.toLocaleString()}`} color="#6366f1" />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Your Recent Listings</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/my-listings" className="btn btn-secondary btn-sm">View All</Link>
            <Link to="/post-item" className="btn btn-primary btn-sm">+ Post Item</Link>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📭</div>
            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No listings yet</h3>
            <p style={{ marginBottom: '1.5rem' }}>Start selling your e-waste and help the environment!</p>
            <Link to="/post-item" className="btn btn-primary">Post Your First Item</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {items.slice(0, 4).map(item => <ItemCard key={item._id} item={item} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
