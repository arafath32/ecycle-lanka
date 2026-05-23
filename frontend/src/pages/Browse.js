import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import ItemCard from "../components/ItemCard";
import { PageLoader } from "../components/Loader";
import { getItems } from "../services/itemService";

const Browse = () => {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("-createdAt");

  const LIMIT = 12;

  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const condition = searchParams.get("condition") || "";

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT, sort: sortBy };
      if (query) params.q = query;
      if (category) params.category = category;
      if (condition) params.condition = condition;

      const data = await getItems(params);
      setItems(data.items || data);
      setTotal(data.total || (data.items || []).length);
    } finally {
      setLoading(false);
    }
  }, [query, category, condition, page, sortBy]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>

      {/* HEADER */}
      <div
        style={{
          background: "white",
          borderBottom: "1px solid #e5e7eb",
          padding: "2rem 0",
        }}
      >
        <div className="container">

          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "800",
              color: "#111827",
            }}
          >
            Browse Electronics
          </h1>

          <p style={{ color: "#6b7280", marginTop: "6px" }}>
            Buy, sell & recycle used electronics responsibly
          </p>

          {/* SEARCH BOX */}
          <div
            style={{
              marginTop: "1.2rem",
              background: "#ffffff",
              padding: "1rem",
              borderRadius: "14px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            }}
          >
            <SearchBar
              initialQuery={query}
              initialCategory={category}
              initialCondition={condition}
              onSearch={({ query: q, category: c, condition: cn }) => {
                const p = new URLSearchParams();
                if (q) p.set("q", q);
                if (c) p.set("category", c);
                if (cn) p.set("condition", cn);
                window.history.pushState({}, "", `/browse?${p}`);
                setPage(1);
                fetchItems();
              }}
            />
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="container" style={{ marginTop: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
            background: "white",
            padding: "1rem",
            borderRadius: "14px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>
            <span style={{ color: "#16a34a", fontWeight: "600" }}>
              {total}
            </span>{" "}
            listings found
            {query && ` for "${query}"`}
          </div>

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            style={{
              padding: "0.5rem 0.75rem",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              background: "white",
              fontSize: "0.9rem",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
            <option value="price">Price: Low → High</option>
            <option value="-price">Price: High → Low</option>
          </select>
        </div>
      </div>

      {/* ITEMS */}
      <div className="container" style={{ marginTop: "2rem" }}>
        {loading ? (
          <PageLoader />
        ) : items.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "5rem 1rem",
              color: "#6b7280",
            }}
          >
            <div style={{ fontSize: "3rem" }}>🔍</div>
            <h3 style={{ marginTop: "10px", color: "#111827" }}>
              No listings found
            </h3>
            <p>Try adjusting filters or search terms</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {items.map((item) => (
              <div
                key={item._id}
                style={{
                  transition: "0.25s",
                }}
              >
                <ItemCard item={item} />
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              marginTop: "2.5rem",
              flexWrap: "wrap",
            }}
          >
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
            >
              ← Prev
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  background: page === i + 1 ? "#16a34a" : "white",
                  color: page === i + 1 ? "white" : "#111827",
                  cursor: "pointer",
                }}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;