import React, { useState, useRef } from 'react';

const ImageUpload = ({ onFilesChange, existingImages = [] }) => {
  const [previews, setPreviews] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  const handleFiles = (files) => {
    const fileArray = Array.from(files).slice(0, 5);
    const urls = fileArray.map(f => URL.createObjectURL(f));
    setPreviews(urls);
    onFilesChange(fileArray);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        style={{
          border: `2px dashed ${dragOver ? '#16a34a' : '#d1d5db'}`,
          borderRadius: '10px',
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragOver ? '#f0fdf4' : '#f9fafb',
          transition: 'all 0.2s',
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📸</div>
        <p style={{ color: '#374151', fontWeight: 500, marginBottom: '0.25rem' }}>
          Click to upload or drag & drop
        </p>
        <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>PNG, JPG up to 5MB — max 5 images</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={e => handleFiles(e.target.files)}
      />

      {previews.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
          {previews.map((src, i) => (
            <img key={i} src={src} alt={`preview-${i}`}
              style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '8px', border: '2px solid #e5e7eb' }} />
          ))}
        </div>
      )}

      {existingImages.length > 0 && previews.length === 0 && (
        <div>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>Current images:</p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
            {existingImages.map((img, i) => (
              <img key={i}
                src={`${process.env.REACT_APP_API_URL?.replace('/api', '')}/uploads/${img}`}
                alt={`img-${i}`}
                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '8px', border: '2px solid #e5e7eb' }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
