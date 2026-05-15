import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import ItemCard from '../components/ItemCard';
import { PageLoader } from '../components/Loader';
import { getItems } from '../services/itemService';

const Browse = () => {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('-createdAt');
  const LIMIT = 12;

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const condition = searchParams.get('condition') || '';

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT, sort: sortBy };
      if (query) params.q = query;
      if (category) params.category = category;
      if (condition) params.condition = condition;
      const data = await getItems(params);
      setItems(data.items || data);
      setTotal(data.total || (data.items || data).length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [query, category, condition, page, sortBy]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>Browse E-Waste Listings</h1>
          <div className="card" style={{ padding: '1.25rem' }}>
            <SearchBar initialQuery={query} initialCategory={category} initialCondition={condition}
              onSearch={({ query: q, category: c, condition: cn }) => {
                const p = new URLSearchParams();
                if (q) p.set('q', q);
                if (c) p.set('category', c);
                if (cn) p.set('condition', cn);
                window.history.pushState({}, '', `/browse?${p}`);
                setPage(1);
                fetchItems();
              }} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
            {total} listing{total !== 1 ? 's' : ''} found
            {(query || category || condition) && (
              <span style={{ color: '#16a34a' }}>
                {query && ` for "${query}"`}
                {category && ` in ${category}`}
              </span>
            )}
          </p>
          <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}
            style={{ padding: '0.4rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}>
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
          </select>
        </div>

        {loading ? <PageLoader /> : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🔍</div>
            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No listings found</h3>
            <p>Try adjusting your search or browse all categories.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {items.map(item => <ItemCard key={item._id} item={item} />)}
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => p - 1)} disabled={page === 1}>← Prev</button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setPage(i + 1)}>{i + 1}</button>
            ))}
            <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
