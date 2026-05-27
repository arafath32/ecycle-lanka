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
  High: { bg: '#ffe5e5', color: '#d10000', label: 'High Priority' },
  Medium: { bg: '#fff3d6', color: '#c77700', label: 'Medium Priority' },
  Low: { bg: '#e6fff0', color: '#1b7f3a', label: 'Low Priority' },
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
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRequests();
  };

  return (
    <div style={{ background: '#f4f6fb', minHeight: '100vh', padding: '2rem' }}>

      {/* HEADER */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '30px', fontWeight: 800 }}>
            Request Board
          </h1>
          <p style={{ margin: 0, color: '#666' }}>
            Find what people are looking for & connect instantly
          </p>
        </div>

        <Link
          to="/post-request"
          style={{
            background: 'linear-gradient(135deg,#16a34a,#22c55e)',
            color: '#fff',
            padding: '10px 18px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: 600,
            boxShadow: '0 8px 20px rgba(34,197,94,0.25)'
          }}
        >
          + New Request
        </Link>
      </div>

      {/* FILTER BOX */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#fff',
        padding: '1rem',
        borderRadius: '14px',
        boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
        marginBottom: '2rem'
      }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            placeholder="Search requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '10px',
              border: '1px solid #ddd'
            }}
          />

          <select value={category} onChange={(e) => setCategory(e.target.value)} style={selectStyle}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c === 'All Categories' ? '' : c}>{c}</option>
            ))}
          </select>

          <select value={urgency} onChange={(e) => setUrgency(e.target.value)} style={selectStyle}>
            <option value="">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button style={searchBtn}>Search</button>
        </form>
      </div>

      {/* GRID */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '18px'
      }}>
        {loading ? (
          <p>Loading...</p>
        ) : requests.length === 0 ? (
          <p>No requests found</p>
        ) : (
          requests.map((req) => {
            const u = URGENCY_COLORS[req.urgency] || URGENCY_COLORS.Medium;

            return (
              <div
                key={req._id}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '16px',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
                  transition: '0.3s',
                  cursor: 'pointer'
                }}
              >
                {/* TITLE */}
                <h3 style={{ margin: '0 0 8px', fontSize: '18px' }}>
                  {req.title}
                </h3>

                {/* URGENCY */}
                <span style={{
                  background: u.bg,
                  color: u.color,
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 600
                }}>
                  {u.label}
                </span>

                {/* DESC */}
                <p style={{ fontSize: '13px', color: '#666', marginTop: '10px' }}>
                  {req.description?.slice(0, 90)}...
                </p>

                {/* TAGS */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                  <span style={tag}>{req.category}</span>
                  <span style={tag}>📍 {req.location}</span>
                </div>

                {/* BOTTOM */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '14px'
                }}>
                  <div style={{ fontWeight: 700, color: '#16a34a' }}>
                    Rs. {req.budget.toLocaleString()}
                  </div>

                  <Link to={`/requests/${req._id}`} style={viewBtn}>
                    View
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const selectStyle = {
  padding: '10px',
  borderRadius: '10px',
  border: '1px solid #ddd'
};

const searchBtn = {
  padding: '10px 16px',
  background: '#111',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer'
};

const tag = {
  fontSize: '12px',
  background: '#f3f4f6',
  padding: '4px 8px',
  borderRadius: '999px'
};

const viewBtn = {
  background: '#16a34a',
  color: '#fff',
  padding: '6px 12px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '12px'
};

export default RequestBoard;