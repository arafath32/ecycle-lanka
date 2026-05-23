import React from "react";
import { Link } from "react-router-dom";
import { timeAgo } from "../utils/formatDate";

const CONDITION_COLORS = {
  "Working - Like New": "#16a34a",
  "Working - Good": "#0ea5e9",
  "Working - Fair": "#f59e0b",
  "For Parts / Not Working": "#ef4444",
};

const ItemCard = ({ item }) => {
  const imgSrc = item.images?.[0]
    ? `${process.env.REACT_APP_API_URL?.replace(
        "/api",
        ""
      )}/uploads/${item.images[0]}`
    : null;

  return (
    <Link to={`/item/${item._id}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          borderRadius: "16px",
          overflow: "hidden",
          background: "rgba(255,255,255,0.9)",
          border: "1px solid #e5e7eb",
          boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
          transition: "all 0.3s ease",
          cursor: "pointer",
          backdropFilter: "blur(8px)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
          e.currentTarget.style.boxShadow =
            "0 15px 35px rgba(22,163,74,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.05)";
        }}
      >
        {/* IMAGE */}
        <div
          style={{
            height: 200,
            position: "relative",
            overflow: "hidden",
            background: "#f3f4f6",
          }}
        >
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={item.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.5s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.5rem",
                color: "#9ca3af",
              }}
            >
              📦
            </div>
          )}

          {/* CONDITION BADGE */}
          <div style={{ position: "absolute", top: 10, right: 10 }}>
            <span
              style={{
                padding: "5px 10px",
                borderRadius: "999px",
                fontSize: "11px",
                fontWeight: 600,
                color: "white",
                background:
                  CONDITION_COLORS[item.condition] || "#6b7280",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              }}
            >
              {item.condition}
            </span>
          </div>

          {/* CATEGORY TAG */}
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: 10,
              background: "rgba(0,0,0,0.5)",
              color: "white",
              padding: "4px 10px",
              borderRadius: "999px",
              fontSize: "11px",
            }}
          >
            {item.category}
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ padding: "14px" }}>
          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              color: "#111827",
              marginBottom: "6px",
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item.title}
          </h3>

          {/* PRICE + TIME */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <span
              style={{
                fontSize: "1.05rem",
                fontWeight: 800,
                color: "#16a34a",
                textShadow: "0 0 10px rgba(22,163,74,0.1)",
              }}
            >
              {item.price > 0
                ? `Rs. ${item.price.toLocaleString()}`
                : "Free / Exchange"}
            </span>

            <span style={{ fontSize: "11px", color: "#9ca3af" }}>
              {timeAgo(item.createdAt)}
            </span>
          </div>

          {/* LOCATION */}
          <div
            style={{
              marginTop: "8px",
              fontSize: "12px",
              color: "#6b7280",
            }}
          >
            📍 {item.location || "Sri Lanka"}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;