import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyRequests, updateRequestStatus, deleteRequest } from '../../services/requestService';

const STATUS_COLORS = {
  open: { bg: '#f0fdf4', color: '#16a34a' },
  filled: { bg: '#eff6ff', color: '#2563eb' },
  closed: { bg: '#f9fafb', color: '#6b7280' },
};

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      const data = await getMyRequests();
      setRequests(data.requests);
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateRequestStatus(id, status);
      setRequests(requests.map((r) => r._id === id ? { ...r, status } : r));
    } catch (error) {
      console.log('Error updating status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this request?')) return;
    try {
      await deleteRequest(id);
      setRequests(requests.filter((r) => r._id !== id));
    } catch (error) {
      console.log('Error deleting:', error);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>My Requests</h1>
        <Link to="/post-request" style={{ background: '#16a34a', color: '#fff', padding: '10px 18px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
          + New Request
        </Link>
      </div>

      {requests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#f9fafb', borderRadius: '12px', color: '#666' }}>
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📭</div>
          <h3>No requests yet</h3>
          <p>Post what you're looking for and let sellers come to you!</p>
          <Link to="/post-request" style={{ color: '#16a34a', fontWeight: '600' }}>Post a Request →</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {requests.map((req) => {
            const statusStyle = STATUS_COLORS[req.status] || STATUS_COLORS.open;
            return (
              <div key={req._id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>{req.title}</h3>
                    <span style={{ background: statusStyle.bg, color: statusStyle.color, fontSize: '12px', fontWeight: '600', padding: '2px 10px', borderRadius: '999px' }}>
                      {req.status}
                    </span>
                  </div>
                  <p style={{ color: '#666', fontSize: '13px', margin: '0 0 8px 0' }}>{req.category} · {req.location} · Rs. {req.budget.toLocaleString()}</p>
                  <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>{new Date(req.createdAt).toLocaleDateString()}</p>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {req.status === 'open' && (
                    <button onClick={() => handleStatusChange(req._id, 'filled')} style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                      Mark Filled
                    </button>
                  )}
                  {req.status === 'open' && (
                    <button onClick={() => handleStatusChange(req._id, 'closed')} style={{ background: '#f9fafb', color: '#6b7280', border: '1px solid #e5e7eb', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                      Close
                    </button>
                  )}
                  <Link to={`/requests/${req._id}`} style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '6px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
                    View
                  </Link>
                  <button onClick={() => handleDelete(req._id)} style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyRequests;