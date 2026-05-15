import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ background: '#111827', color: '#9ca3af', marginTop: 'auto' }}>
    <div className="container" style={{ padding: '3rem 1.5rem 1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.4rem' }}>♻</span>
            <span style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem' }}>E-Cycle Lanka</span>
          </div>
          <p style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>
            Sri Lanka's smart e-waste marketplace. Reducing landfill waste, promoting reuse, and building a greener future.
          </p>
        </div>
        <div>
          <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem' }}>Marketplace</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <Link to="/browse" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Browse Listings</Link>
            <Link to="/post-item" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Sell an Item</Link>
            <Link to="/register" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Join E-Cycle Lanka</Link>
          </div>
        </div>
        <div>
          <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem' }}>Categories</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {['Smartphones', 'Laptops', 'TVs & Monitors', 'Audio Equipment', 'Cameras'].map(c => (
              <Link key={c} to={`/browse?category=${c}`} style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{c}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem' }}>Contact</h4>
          <div style={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <span>📧 info@ecyclelanka.lk</span>
            <span>📞 +94-770417067</span>
            <span>📍 Batticaloa, Sri Lanka</span>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid #1f2937', paddingTop: '1.25rem', textAlign: 'center', fontSize: '0.8rem' }}>
        © {new Date().getFullYear()} E-Cycle Lanka. All rights reserved. Built for a greener Sri Lanka 🌿
      </div>
    </div>
  </footer>
);

export default Footer;
