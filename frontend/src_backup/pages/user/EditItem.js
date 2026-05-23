import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getItemById, updateItem } from '../../services/itemService';
import ImageUpload from '../../components/ImageUpload';
import { PageLoader } from '../../components/Loader';
import { CATEGORIES, CONDITIONS } from '../../utils/constants';

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: '', condition: '', price: '', location: '', brand: '', model: '' });
  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getItemById(id).then(data => {
      const item = data.item || data;
      setForm({ title: item.title || '', description: item.description || '', category: item.category || '',
        condition: item.condition || '', price: item.price || '', location: item.location || '',
        brand: item.brand || '', model: item.model || '' });
      setExistingImages(item.images || []);
    }).catch(() => setError('Item not found.')).finally(() => setLoading(false));
  }, [id]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== '') fd.append(k, v); });
      files.forEach(f => fd.append('images', f));
      await updateItem(id, fd);
      navigate('/my-listings', { state: { success: 'Listing updated!' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update item.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 720 }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem' }}>Edit Listing</h1>
        <div className="card" style={{ padding: '2rem' }}>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Item Title *</label>
              <input className="form-input" name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-input" name="category" value={form.category} onChange={handleChange} required>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Condition *</label>
                <select className="form-input" name="condition" value={form.condition} onChange={handleChange} required>
                  {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea className="form-input" name="description" rows={4} value={form.description} onChange={handleChange} required style={{ resize: 'vertical' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Price (Rs.)</label>
                <input className="form-input" type="number" name="price" min="0" value={form.price} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Brand</label>
                <input className="form-input" name="brand" value={form.brand} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Model</label>
                <input className="form-input" name="model" value={form.model} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" name="location" value={form.location} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Update Photos</label>
              <ImageUpload onFilesChange={setFiles} existingImages={existingImages} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>{saving ? 'Saving...' : '💾 Save Changes'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditItem;
