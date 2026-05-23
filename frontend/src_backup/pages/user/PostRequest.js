import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRequest } from '../../services/requestService';

const CATEGORIES = [
  'Smartphones & Tablets',
  'Laptops & Computers',
  'TV & Audio',
  'Cameras & Photography',
  'Gaming',
  'Computer Parts',
  'Printers & Scanners',
  'Other Electronics',
];

const PostRequest = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Smartphones & Tablets',
    budget: '',
    location: '',
    urgency: 'Medium',
    contactMethod: 'WhatsApp',
    contactInfo: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createRequest(form);
      navigate('/requests', { replace: true });
      window.location.href = '/requests';
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px',
  };

  return (
    <div style={{ maxWidth: '650px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#1a1a1a', marginBottom: '6px' }}>
        📋 Post an Item Request
      </h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Tell sellers what you're looking for and they'll contact you directly.
      </p>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

        <div>
          <label style={labelStyle}>What are you looking for? *</label>
          <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. iPhone 11 Screen Replacement" style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} required placeholder="Describe exactly what you need, preferred condition, specifications..." rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Category *</label>
            <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Budget (Rs.) *</label>
            <input name="budget" value={form.budget} onChange={handleChange} required type="number" placeholder="5000" style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Location *</label>
            <input name="location" value={form.location} onChange={handleChange} required placeholder="e.g. Colombo" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Urgency</label>
            <select name="urgency" value={form.urgency} onChange={handleChange} style={inputStyle}>
              <option value="Low">🟢 Low</option>
              <option value="Medium">🟡 Medium</option>
              <option value="High">🔴 High</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Preferred Contact Method</label>
            <select name="contactMethod" value={form.contactMethod} onChange={handleChange} style={inputStyle}>
              <option>WhatsApp</option>
              <option>Phone</option>
              <option>Email</option>
              <option>In-App</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Contact Info *</label>
            <input name="contactInfo" value={form.contactInfo} onChange={handleChange} required placeholder="Phone number or email" style={inputStyle} />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ background: loading ? '#9ca3af' : '#16a34a', color: '#fff', padding: '12px', borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '16px', marginTop: '0.5rem' }}
        >
          {loading ? 'Posting...' : 'Post Request'}
        </button>

      </form>
    </div>
  );
};

export default PostRequest;