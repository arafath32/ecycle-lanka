import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createItem } from '../../services/itemService';
import ImageUpload from '../../components/ImageUpload';
import { CATEGORIES, CONDITIONS } from '../../utils/constants';

const PostItem = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: '', condition: '', price: '', location: '', brand: '', model: '' });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.description || !form.category || !form.condition) {
      return setError('Please fill in all required fields.');
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      files.forEach(f => fd.append('images', f));
      await createItem(fd);
      navigate('/my-listings', { state: { success: 'Listing posted successfully!' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 720 }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Post a New Item</h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>List your e-waste for reuse, recycling, or sale.</p>

        <div className="card" style={{ padding: '2rem' }}>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Item Title *</label>
              <input className="form-input" name="title" placeholder="e.g. Samsung Galaxy S8 - Cracked Screen"
                value={form.title} onChange={handleChange} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-input" name="category" value={form.category} onChange={handleChange} required>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Condition *</label>
                <select className="form-input" name="condition" value={form.condition} onChange={handleChange} required>
                  <option value="">Select condition</option>
                  {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea className="form-input" name="description" rows={4}
                placeholder="Describe the item, any defects, what's included, reason for selling..."
                value={form.description} onChange={handleChange} required style={{ resize: 'vertical' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Price (Rs.) <span style={{ color: '#9ca3af', fontWeight: 400 }}>(0 = Free)</span></label>
                <input className="form-input" type="number" name="price" placeholder="0" min="0"
                  value={form.price} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Brand</label>
                <input className="form-input" name="brand" placeholder="e.g. Samsung" value={form.brand} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Model</label>
                <input className="form-input" name="model" placeholder="e.g. Galaxy S8" value={form.model} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" name="location" placeholder="e.g. Colombo, Kandy, Galle..."
                value={form.location} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Photos (up to 5)</label>
              <ImageUpload onFilesChange={setFiles} />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? 'Posting...' : '📤 Post Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
