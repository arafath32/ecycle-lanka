import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getItemById, deleteItem } from '../services/itemService';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/Loader';
import { formatDate } from '../utils/formatDate';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [error, setError] = useState('');

  const BASE_URL = process.env.REACT_APP_API_URL?.replace('/api', '');

  useEffect(() => {
    getItemById(id)
      .then(data => setItem(data.item || data))
      .catch(() => setError('Item not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await deleteItem(id);
      navigate('/my-listings');
    } catch {
      alert('Failed to delete item.');
    }
  };

  if (loading) return <PageLoader />;
  if (error) return <div className="container page-wrapper"><div className="alert alert-error">{error}</div></div>;
  if (!item) return null;

  const isOwner = user?._id === (item.seller?._id || item.seller);

  return (
    <div className="page-wrapper">
      <div className="container">
        <Link to="/browse" style={{ color: '#16a34a', fontSize: '0.875rem', display: 'inline-flex', gap: '0.25rem', marginBottom: '1.25rem' }}>
          ← Back to Browse
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Images */}
          <div>
            <div style={{ borderRadius: '12px', overflow: 'hidden', background: '#f3f4f6', aspectRatio: '4/3', marginBottom: '0.75rem' }}>
              {item.images?.length > 0 ? (
                <img src={`${BASE_URL}/uploads/${item.images[activeImg]}`} alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>📦</div>
              )}
            </div>
            {item.images?.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {item.images.map((img, i) => (
                  <img key={i} src={`${BASE_URL}/uploads/${img}`} alt="" onClick={() => setActiveImg(i)}
                    style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: '8px', cursor: 'pointer',
                      border: `2px solid ${activeImg === i ? '#16a34a' : '#e5e7eb'}` }} />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <span className="badge badge-gray">{item.category}</span>
              <span className="badge badge-green">{item.condition}</span>
              {item.status === 'sold' && <span className="badge badge-red">Sold</span>}
            </div>

            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>{item.title}</h1>

            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#16a34a', marginBottom: '1rem' }}>
              {item.price > 0 ? `Rs. ${item.price.toLocaleString()}` : 'Free / Exchange'}
            </div>

            <div style={{ borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '1rem 0', marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.95rem' }}>Description</h3>
              <p style={{ color: '#374151', lineHeight: 1.7, fontSize: '0.9rem' }}>{item.description}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              <div><span style={{ color: '#6b7280' }}>Location: </span><strong>{item.location || 'Sri Lanka'}</strong></div>
              <div><span style={{ color: '#6b7280' }}>Listed: </span><strong>{formatDate(item.createdAt)}</strong></div>
              {item.brand && <div><span style={{ color: '#6b7280' }}>Brand: </span><strong>{item.brand}</strong></div>}
              {item.model && <div><span style={{ color: '#6b7280' }}>Model: </span><strong>{item.model}</strong></div>}
            </div>

            {/* Seller info */}
            <div className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Seller Information</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#16a34a', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {item.seller?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight: 500 }}>{item.seller?.name || 'User'}</p>
                  {isAuthenticated && <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>{item.seller?.email}</p>}
                </div>
              </div>
            </div>

            {isOwner ? (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link to={`/edit-item/${id}`} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>✏️ Edit Listing</Link>
                <button className="btn btn-danger" onClick={handleDelete} style={{ flex: 1 }}>🗑 Delete</button>
              </div>
            ) : isAuthenticated ? (
              <a href={`mailto:${item.seller?.email}?subject=Interested in: ${item.title}`}
                className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                📧 Contact Seller
              </a>
            ) : (
              <Link to="/login" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                Login to Contact Seller
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
