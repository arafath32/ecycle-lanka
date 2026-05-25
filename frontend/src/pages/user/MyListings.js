/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getMyItems, deleteItem, markAsSold } from '../../services/itemService';
import { PageLoader } from '../../components/Loader';
import { formatDate } from '../../utils/formatDate';

const BASE_URL = process.env.REACT_APP_API_URL?.replace('/api', '');

const MyListings = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const location = useLocation();
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (location.state?.success) {
      setSuccess(location.state.success);
      setTimeout(() => setSuccess(''), 4000);
    }
    fetchItems();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchItems = () => {
    setLoading(true);
    getMyItems().then(data => setItems(data.items || data)).catch(() => {}).finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await deleteItem(id);
      setItems(prev => prev.filter(i => i._id !== id));
    } catch { alert('Failed to delete.'); }
  };

  const handleMarkSold = async (id) => {
    try {
      await markAsSold(id);
      setItems(prev => prev.map(i => i._id === id ? { ...i, status: 'sold' } : i));
    } catch { alert('Failed to update status.'); }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>My Listings</h1>
          <Link to="/post-item" className="btn btn-primary">+ Post New Item</Link>
        </div>

        {success && <div className="alert alert-success">{success}</div>}

        {items.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📭</div>
            <h3>No listings yet</h3>
            <Link to="/post-item" className="btn btn-primary mt-2">Post Your First Item</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {items.map(item => (
              <div key={item._id} className="card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '8px', overflow: 'hidden', background: '#f3f4f6', flexShrink: 0 }}>
                  {item.images?.[0] ? (
                    <img src={`${BASE_URL}/uploads/${item.images[0]}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📦</div>}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontWeight: 600, fontSize: '0.95rem', truncate: true }}>{item.title}</h3>
                    <span className={`badge ${item.status === 'active' ? 'badge-green' : item.status === 'sold' ? 'badge-red' : 'badge-gray'}`}>
                      {item.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>{item.category} · {formatDate(item.createdAt)}</p>
                  <p style={{ fontWeight: 700, color: '#16a34a', fontSize: '0.95rem', marginTop: '0.2rem' }}>
                    {item.price > 0 ? `Rs. ${item.price.toLocaleString()}` : 'Free'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  {item.status === 'active' && (
                    <button className="btn btn-secondary btn-sm" onClick={() => handleMarkSold(item._id)}>Mark Sold</button>
                  )}
                  <Link to={`/edit-item/${item._id}`} className="btn btn-secondary btn-sm">✏️ Edit</Link>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item._id)}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListings;
