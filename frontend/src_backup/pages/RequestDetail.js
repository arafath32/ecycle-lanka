import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRequestById } from '../services/requestService';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const data = await getRequestById(id);
        setRequest(data.request);
      } catch (error) {
        console.log('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>;
  if (!request) return <div style={{ textAlign: 'center', padding: '3rem' }}>Request not found</div>;

  const URGENCY_COLORS = {
    High: { bg: '#fff0f0', color: '#cc0000' },
    Medium: { bg: '#fff8e1', color: '#e65100' },
    Low: { bg: '#f0fff4', color: '#2e7d32' },
  };
  const urgencyStyle = URGENCY_COLORS[request.urgency] || URGENCY_COLORS.Medium;

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '0 1rem' }}>
      <button
        onClick={() => navigate('/requests')}
        style={{ background: 'none', border: 'none', color: '#16a34a', cursor: 'pointer', fontSize: '14px', marginBottom: '1rem', padding: 0 }}
      >
        ← Back to Request Board
      </button>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '2rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
            {request.title}
          </h1>
          <span style={{ background: urgencyStyle.bg, color: urgencyStyle.color, padding: '4px 14px', borderRadius: '999px', fontWeight: '600', fontSize: '13px' }}>
            {request.urgency} Urgency
          </span>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '15px', color: '#888', marginBottom: '8px' }}>What they need:</h3>
          <p style={{ color: '#333', lineHeight: '1.7', fontSize: '15px', margin: 0 }}>
            {request.description}
          </p>
        </div>

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Category', value: request.category },
            { label: 'Location', value: `📍 ${request.location}` },
            { label: 'Budget', value: `Rs. ${request.budget.toLocaleString()}`, highlight: true },
            { label: 'Posted by', value: request.buyer?.name || 'Anonymous' },
            { label: 'Contact via', value: request.contactMethod },
            { label: 'Posted on', value: new Date(request.createdAt).toLocaleDateString() },
          ].map((item) => (
            <div key={item.label} style={{ background: '#f9fafb', borderRadius: '10px', padding: '12px 16px' }}>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>{item.label}</div>
              <div style={{ fontWeight: '600', color: item.highlight ? '#16a34a' : '#1a1a1a', fontSize: '15px' }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Contact Box */}
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#15803d' }}>Interested? Contact the buyer!</h3>
          <p style={{ color: '#555', fontSize: '14px', margin: '0 0 1rem 0' }}>
            Reach out via {request.contactMethod}
          </p>
          <div style={{ fontSize: '22px', fontWeight: '700', color: '#16a34a', background: '#fff', padding: '12px 24px', borderRadius: '10px', display: 'inline-block', border: '1px solid #bbf7d0' }}>
            {request.contactInfo}
          </div>
        </div>

      </div>
    </div>
  );
};

export default RequestDetail;