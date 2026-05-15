import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, CONDITIONS } from '../utils/constants';

const SearchBar = ({ initialQuery = '', initialCategory = '', initialCondition = '', onSearch }) => {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [condition, setCondition] = useState(initialCondition);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category) params.set('category', category);
    if (condition) params.set('condition', condition);

    if (onSearch) {
      onSearch({ query, category, condition });
    } else {
      navigate(`/browse?${params.toString()}`);
    }
  };

  const inputStyle = {
    padding: '0.65rem 1rem', border: '1px solid #d1d5db',
    borderRadius: '8px', fontSize: '0.9rem', background: '#fff',
    outline: 'none', transition: 'border-color 0.2s',
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
      <input
        type="text"
        placeholder="Search e-waste items..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ ...inputStyle, flex: '1 1 220px' }}
        onFocus={e => e.target.style.borderColor = '#16a34a'}
        onBlur={e => e.target.style.borderColor = '#d1d5db'}
      />
      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        style={{ ...inputStyle, flex: '0 1 200px' }}
      >
        <option value="">All Categories</option>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select
        value={condition}
        onChange={e => setCondition(e.target.value)}
        style={{ ...inputStyle, flex: '0 1 180px' }}
      >
        <option value="">All Conditions</option>
        {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <button type="submit" className="btn btn-primary" style={{ flex: '0 0 auto' }}>
        🔍 Search
      </button>
    </form>
  );
};

export default SearchBar;
