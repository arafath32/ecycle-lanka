import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import ItemCard from "../components/ItemCard";
import { getItems } from "../services/itemService";
import { CATEGORIES } from "../utils/constants";

// Map category → icon
const CATEGORY_ICONS = {
  "Smartphones & Tablets": "📱",
  "Laptops & Computers": "💻",
  "TV & Audio": "📺",
  "Cameras & Photography": "📸",
  "Gaming": "🎮",
  "Computer Parts": "🧩",
  "Printers & Scanners": "🖨️",
  "Other Electronics": "🔌",
};

const Home = () => {
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getItems({ limit: 6, sort: "-createdAt" })
      .then((data) => setRecentItems(data.items || data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: "#f8fafc", color: "#111827" }}>

      {/* HERO */}
      <section
        style={{
          background: "white",
          padding: "5rem 1rem",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "3rem",
            alignItems: "center",
          }}
        >

          {/* LEFT */}
          <div>
            <span
              style={{
                display: "inline-block",
                padding: "6px 12px",
                borderRadius: "20px",
                background: "#e8f5e9",
                color: "#16a34a",
                fontSize: "13px",
                fontWeight: "500",
              }}
            >
              ♻ Smart Repair & Recycling Platform
            </span>

            <h1
              style={{
                fontSize: "3rem",
                fontWeight: "800",
                marginTop: "18px",
                lineHeight: "1.1",
              }}
            >
              Repair, Reuse & Recycle{" "}
              <span style={{ color: "#16a34a" }}>Electronics</span>
            </h1>

            <p style={{ marginTop: "12px", color: "#6b7280" }}>
              A smart platform for buying, selling and recycling electronics in Sri Lanka.
            </p>

            {/* SEARCH */}
            <div
              style={{
                marginTop: "20px",
                padding: "12px",
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <SearchBar />
            </div>

            {/* BUTTONS */}
            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              <Link
                to="/browse"
                style={{
                  padding: "10px 18px",
                  background: "#16a34a",
                  color: "white",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                Explore
              </Link>

              <Link
                to="/post-item"
                style={{
                  padding: "10px 18px",
                  background: "white",
                  border: "1px solid #d1d5db",
                  color: "#111827",
                  borderRadius: "10px",
                  textDecoration: "none",
                }}
              >
                Sell / Recycle
              </Link>
            </div>
          </div>

          {/* RIGHT — MOTHERBOARD + RECYCLE LOGO */}
          <div style={{ textAlign: "center" }}>
            <svg
              width="360"
              height="360"
              viewBox="0 0 200 200"
              style={{
                filter: "drop-shadow(0 15px 35px rgba(0,0,0,0.12))",
                animation: "float 3s ease-in-out infinite",
              }}
            >

              {/* Outer recycle circle */}
              <circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke="#16a34a"
                strokeWidth="3"
                strokeDasharray="8 5"
              />

              {/* Motherboard base */}
              <rect
                x="60"
                y="60"
                width="80"
                height="80"
                rx="10"
                fill="#16a34a"
              />

              {/* Circuit lines */}
              <line x1="70" y1="75" x2="130" y2="75" stroke="white" strokeWidth="2" />
              <line x1="70" y1="90" x2="120" y2="90" stroke="white" strokeWidth="2" />
              <line x1="70" y1="105" x2="135" y2="105" stroke="white" strokeWidth="2" />
              <line x1="70" y1="120" x2="115" y2="120" stroke="white" strokeWidth="2" />

              {/* Chip */}
              <rect x="85" y="85" width="30" height="30" rx="5" fill="#0f172a" />

              {/* Recycle arrows (small corners) */}
              <path
                d="M100 25 L115 40 L105 40 C110 50 110 60 100 65 C90 60 90 50 95 40 L85 40 Z"
                fill="#22c55e"
              />

              <path
                d="M100 175 L85 160 L95 160 C90 150 90 140 100 135 C110 140 110 150 105 160 L115 160 Z"
                fill="#22c55e"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: "4rem 1rem" }}>
        <div className="container">
          <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
            Browse Categories
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
              gap: "15px",
            }}
          >
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/browse?category=${encodeURIComponent(cat)}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "white",
                    border: "1px solid #e5e7eb",
                    padding: "20px",
                    borderRadius: "14px",
                    textAlign: "center",
                    transition: "0.2s",
                  }}
                >
                  <div style={{ fontSize: "2rem" }}>
                    {CATEGORY_ICONS[cat] || "🔧"}
                  </div>

                  <p style={{ marginTop: "10px", color: "#111827" }}>
                    {cat}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* RECENT ITEMS */}
      <section style={{ padding: "4rem 1rem" }}>
        <div className="container">
          <h2 style={{ marginBottom: "20px" }}>Latest Listings</h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(250px,1fr))",
                gap: "20px",
              }}
            >
              {recentItems.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "5rem 1rem",
          textAlign: "center",
          background: "#16a34a",
          color: "white",
        }}
      >
        <h2 style={{ fontSize: "2.2rem" }}>
          Extend Device Life. Reduce E-Waste.
        </h2>

        <p style={{ marginTop: "10px", opacity: 0.9 }}>
          Join Sri Lanka’s smart electronics ecosystem.
        </p>

        <Link
          to="/register"
          style={{
            marginTop: "20px",
            display: "inline-block",
            padding: "10px 20px",
            background: "white",
            color: "#16a34a",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          Get Started
        </Link>
      </section>
    </div>
  );
};

export default Home;