import React, { useEffect, useState } from 'react';
import { getAllListings, approveItem, rejectItem, adminDeleteItem } from '../../services/adminService';
import { PageLoader } from '../../components/Loader';
import { formatDate } from '../../utils/formatDate';

const BASE_URL = process.env.REACT_APP_API_URL?.replace('/api', '');

const ManageListings = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAllListings().then(data => setItems(data.items || data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    try { await approveItem(id); setItems(prev => prev.map(i => i._id === id ? { ...i, status: 'active' } : i)); }
    catch { alert('Failed.'); }
  };

  const handleReject = async (id) => {
    try { await rejectItem(id); setItems(prev => prev.map(i => i._id === id ? { ...i, status: 'rejected' } : i)); }
    catch { alert('Failed.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing permanently?')) return;
    try { await adminDeleteItem(id); setItems(prev => prev.filter(i => i._id !== id)); }
    catch { alert('Failed.'); }
  };

  const filtered = items.filter(i => {
    const matchFilter = filter === 'all' || i.status === filter;
    const matchSearch = i.title?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const statusBadge = (status) => {
    const map = { active: 'badge-green', sold: 'badge-yellow', pending: 'badge-blue', rejected: 'badge-red' };
    return map[status] || 'badge-gray';
  };

  if (loading) return <PageLoader />;

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>Manage Listings ({items.length})</h1>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          {['all', 'active', 'pending', 'sold', 'rejected'].map(f => (
            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter(f)} style={{ textTransform: 'capitalize' }}>
              {f} {f === 'all' ? `(${items.length})` : `(${items.filter(i => i.status === f).length})`}
            </button>
          ))}
          <input className="form-input" style={{ width: 220, marginLeft: 'auto' }} placeholder="Search listings..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(item => (
            <div key={item._id} className="card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: 60, height: 60, borderRadius: '8px', overflow: 'hidden', background: '#f3f4f6', flexShrink: 0 }}>
                {item.images?.[0] ? (
                  <img src={`${BASE_URL}/uploads/${item.images[0]}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📦</div>}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <h3 style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.title}</h3>
                  <span className={`badge ${statusBadge(item.status)}`}>{item.status}</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '0.15rem' }}>
                  {item.category} · Rs. {item.price?.toLocaleString() || '0'} · {formatDate(item.createdAt)}
                </p>
                <p style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                  Seller: {item.seller?.name || 'Unknown'} ({item.seller?.email})
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0, flexWrap: 'wrap' }}>
                {item.status === 'pending' && (
                  <>
                    <button className="btn btn-primary btn-sm" onClick={() => handleApprove(item._id)}>✅ Approve</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleReject(item._id)}>❌ Reject</button>
                  </>
                )}
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item._id)}>🗑 Delete</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>No listings found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageListings;
