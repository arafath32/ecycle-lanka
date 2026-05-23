import React from 'react';
import { Link } from 'react-router-dom';
import { timeAgo } from '../utils/formatDate';

const CONDITION_COLORS = {
  'Working - Like New': 'badge-green',
  'Working - Good': 'badge-blue',
  'Working - Fair': 'badge-yellow',
  'For Parts / Not Working': 'badge-red',
};

const ItemCard = ({ item }) => {
  const imgSrc = item.images?.[0]
    ? `${process.env.REACT_APP_API_URL?.replace('/api', '')}/uploads/${item.images[0]}`
    : null;

  return (
    <Link to={`/item/${item._id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{
        overflow: 'hidden', transition: 'box-shadow 0.2s, transform 0.2s', cursor: 'pointer',
      }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}
      >
        {/* Image */}
        <div style={{ height: 200, background: '#f3f4f6', overflow: 'hidden', position: 'relative' }}>
          {imgSrc ? (
            <img src={imgSrc} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '2.5rem' }}>📦</div>
          )}
          <div style={{ position: 'absolute', top: 8, right: 8 }}>
            <span className={`badge ${CONDITION_COLORS[item.condition] || 'badge-gray'}`}>{item.condition}</span>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '1rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>{item.category}</p>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem', lineHeight: 1.3,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {item.title}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#16a34a' }}>
              {item.price > 0 ? `Rs. ${item.price.toLocaleString()}` : 'Free / Exchange'}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{timeAgo(item.createdAt)}</span>
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#6b7280' }}>
            📍 {item.location || 'Sri Lanka'}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;
