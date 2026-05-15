import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import ItemCard from '../components/ItemCard';
import { getItems } from '../services/itemService';
import { CATEGORIES } from '../utils/constants';

const STATS = [
  { icon: '♻️', value: '5,000+', label: 'Items Recycled' },
  { icon: '👥', value: '1,200+', label: 'Registered Users' },
  { icon: '🌿', value: '12 tons', label: 'Waste Diverted' },
  { icon: '💰', value: 'Rs. 2M+', label: 'Value Exchanged' },
];

const Home = () => {
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getItems({ limit: 8, sort: '-createdAt' })
      .then(data => setRecentItems(data.items || data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #0f766e 100%)',
        color: '#fff', padding: '5rem 0',
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 760 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(255,255,255,0.12)', padding: '0.35rem 1rem',
            borderRadius: '9999px', fontSize: '0.85rem', marginBottom: '1.5rem',
          }}>
            🌿 Sri Lanka's #1 E-Waste Marketplace
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>
            Give Electronics a <span style={{ color: '#4ade80' }}>Second Life</span>
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.85, marginBottom: '2rem', lineHeight: 1.7 }}>
            Buy, sell, and recycle electronic waste across Sri Lanka. Reduce landfill waste, recover economic value, and protect our environment.
          </p>
          <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '12px', padding: '1.25rem' }}>
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#fff', padding: '2.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            {STATS.map(s => (
              <div key={s.label} style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>{s.icon}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a' }}>{s.value}</div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Browse by Category</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
            {CATEGORIES.map(cat => (
              <Link key={cat} to={`/browse?category=${encodeURIComponent(cat)}`}
                style={{ textDecoration: 'none' }}>
                <div className="card" style={{
                  padding: '1rem', textAlign: 'center', cursor: 'pointer',
                  transition: 'all 0.2s', fontSize: '0.875rem', fontWeight: 500, color: '#374151',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#16a34a'; e.currentTarget.style.color = '#16a34a'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = '#374151'; }}
                >
                  📱 {cat}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Listings */}
      <section style={{ padding: '1rem 0 4rem' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Recent Listings</h2>
            <Link to="/browse" className="btn btn-secondary btn-sm">View All →</Link>
          </div>
          {loading ? (
            <p style={{ color: '#6b7280' }}>Loading listings...</p>
          ) : recentItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📭</div>
              <p>No listings yet. Be the first to post!</p>
              <Link to="/post-item" className="btn btn-primary mt-2">Post an Item</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
              {recentItems.map(item => <ItemCard key={item._id} item={item} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#052e16', color: '#fff', padding: '4rem 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 600 }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Ready to recycle your electronics?</h2>
          <p style={{ opacity: 0.8, marginBottom: '2rem' }}>Join thousands of Sri Lankans already making a difference.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
            <Link to="/browse" className="btn btn-secondary btn-lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>Browse Listings</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
