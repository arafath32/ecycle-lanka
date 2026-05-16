import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRequests } from '../services/requestService';

const CATEGORIES = [
  'All Categories',
  'Smartphones & Tablets',
  'Laptops & Computers',
  'TV & Audio',
  'Cameras & Photography',
  'Gaming',
  'Computer Parts',
  'Printers & Scanners',
  'Other Electronics',
];

const URGENCY_COLORS = {
  High: { bg: '#fff0f0', color: '#cc0000', label: '🔴 High' },
  Medium: { bg: '#fff8e1', color: '#e65100', label: '🟡 Medium' },
  Low: { bg: '#f0fff4', color: '#2e7d32', label: '🟢 Low' },
};

const RequestBoard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [urgency, setUrgency] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchRequests();
  }, [category, urgency]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category && category !== 'All Categories') params.category = category;
      if (urgency) params.urgency = urgency;
      if (search) params.search = search;
      const data = await getRequests(params);
      setRequests(data.requests);
    } catch (error) {
      console.log('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRequests();
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
            📋 Item Request Board
          </h1>
          <p style={{ color: '#666', marginTop: '4px' }}>
            Can't find what you need? Browse buyer requests and contact them directly.
          </p>
        </div>
        <Link
          to="/post-request"
          style={{ background: '#16a34a', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}
        >
          + Post a Request
        </Link>
      </div>

      {/* Search & Filters */}
      <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '1.2rem', marginBottom: '1.5rem', border: '1px solid #e5e7eb' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: '200px', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', background: '#fff' }}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c === 'All Categories' ? '' : c}>{c}</option>
            ))}
          </select>
          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            style={{ padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', background: '#fff' }}
          >
            <option value="">All Urgency</option>
            <option value="High">🔴 High</option>
            <option value="Medium">🟡 Medium</option>
            <option value="Low">🟢 Low</option>
          </select>
          <button
            type="submit"
            style={{ background: '#16a34a', color: '#fff', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600' }}
          >
            Search
          </button>
        </form>
      </div>

      {/* Results count */}
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '1rem' }}>
        {requests.length} open request{requests.length !== 1 ? 's' : ''} found
      </p>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          Loading requests...
        </div>
      )}

      {/* Empty state */}
      {!loading && requests.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666', background: '#f9fafb', borderRadius: '12px' }}>
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📭</div>
          <h3>No requests found</h3>
          <p>Be the first to post what you're looking for!</p>
          <Link to="/post-request" style={{ color: '#16a34a', fontWeight: '600' }}>Post a Request →</Link>
        </div>
      )}

      {/* Request Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {requests.map((req) => {
          const urgencyStyle = URGENCY_COLORS[req.urgency] || URGENCY_COLORS.Medium;
          return (
            <div
              key={req._id}
              style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}
            >
              <div style={{ flex: 1 }}>
                {/* Title & urgency */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '600', color: '#1a1a1a' }}>
                    {req.title}
                  </h3>
                  <span style={{ background: urgencyStyle.bg, color: urgencyStyle.color, fontSize: '12px', fontWeight: '600', padding: '2px 10px', borderRadius: '999px' }}>
                    {urgencyStyle.label}
                  </span>
                </div>

                {/* Description */}
                <p style={{ color: '#555', fontSize: '14px', margin: '0 0 10px 0', lineHeight: '1.5' }}>
                  {req.description}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '13px' }}>
                  <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '3px 10px', borderRadius: '999px', border: '1px solid #bbf7d0' }}>
                    {req.category}
                  </span>
                  <span style={{ background: '#f0f9ff', color: '#0369a1', padding: '3px 10px', borderRadius: '999px', border: '1px solid #bae6fd' }}>
                    📍 {req.location}
                  </span>
                  <span style={{ background: '#fefce8', color: '#854d0e', padding: '3px 10px', borderRadius: '999px', border: '1px solid #fef08a' }}>
                    💬 {req.contactMethod}
                  </span>
                  <span style={{ color: '#888', fontSize: '12px', alignSelf: 'center' }}>
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Right side — budget & action */}
              <div style={{ textAlign: 'right', minWidth: '130px' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#16a34a', marginBottom: '8px' }}>
                  Rs. {req.budget.toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>
                  Budget
                </div>
                <Link
                  to={`/requests/${req._id}`}
                  style={{ background: '#16a34a', color: '#fff', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '600', display: 'inline-block' }}
                >
                  View Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RequestBoard;