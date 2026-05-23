import React from 'react';

const Loader = ({ size = 'md', text = '' }) => {
  const sizes = { sm: 20, md: 36, lg: 56 };
  const px = sizes[size] || 36;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '3rem', gap: '1rem',
    }}>
      <svg width={px} height={px} viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="15" stroke="#e5e7eb" strokeWidth="3" />
        <circle
          cx="18" cy="18" r="15"
          stroke="#16a34a" strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="60 36"
          style={{ animation: 'spin 0.9s linear infinite', transformOrigin: 'center' }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </svg>
      {text && <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>{text}</p>}
    </div>
  );
};

export const PageLoader = () => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Loader size="lg" text="Loading..." />
  </div>
);

export default Loader;
