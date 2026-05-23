import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getItemById, deleteItem } from "../services/itemService";
import { useAuth } from "../context/AuthContext";
import { PageLoader } from "../components/Loader";
import { formatDate } from "../utils/formatDate";

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [error, setError] = useState("");

  const BASE_URL = process.env.REACT_APP_API_URL?.replace("/api", "");

  useEffect(() => {
    getItemById(id)
      .then((data) => setItem(data.item || data))
      .catch(() => setError("Item not found."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this listing?")) return;
    await deleteItem(id);
    navigate("/my-listings");
  };

  if (loading) return <PageLoader />;
  if (error)
    return (
      <div className="container page-wrapper">
        <div className="card" style={{ padding: "1rem", color: "red" }}>
          {error}
        </div>
      </div>
    );
  if (!item) return null;

  const isOwner = user?._id === (item.seller?._id || item.seller);

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "2rem 0" }}>
      <div className="container">

        {/* BACK */}
        <Link
          to="/browse"
          style={{
            color: "#16a34a",
            fontSize: "0.9rem",
            display: "inline-block",
            marginBottom: "1.2rem",
            textDecoration: "none",
            fontWeight: "500",
          }}
        >
          ← Back to Browse
        </Link>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2rem",
          }}
        >

          {/* LEFT - IMAGES */}
          <div>
            {/* MAIN IMAGE */}
            <div
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                background: "white",
                aspectRatio: "4/3",
                boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
              }}
            >
              {item.images?.length > 0 ? (
                <img
                  src={`${BASE_URL}/uploads/${item.images[activeImg]}`}
                  alt={item.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "4rem",
                    background: "#f3f4f6",
                  }}
                >
                  📦
                </div>
              )}
            </div>

            {/* THUMBNAILS */}
            {item.images?.length > 1 && (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "12px",
                  flexWrap: "wrap",
                }}
              >
                {item.images.map((img, i) => (
                  <img
                    key={i}
                    src={`${BASE_URL}/uploads/${img}`}
                    alt=""
                    onClick={() => setActiveImg(i)}
                    style={{
                      width: 70,
                      height: 70,
                      objectFit: "cover",
                      borderRadius: "10px",
                      cursor: "pointer",
                      border:
                        activeImg === i
                          ? "2px solid #16a34a"
                          : "2px solid transparent",
                      transition: "0.2s",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT - DETAILS */}
          <div>

            {/* BADGES */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <span
                style={{
                  background: "#e5e7eb",
                  padding: "5px 10px",
                  borderRadius: "20px",
                  fontSize: "12px",
                }}
              >
                {item.category}
              </span>

              <span
                style={{
                  background: "#dcfce7",
                  color: "#166534",
                  padding: "5px 10px",
                  borderRadius: "20px",
                  fontSize: "12px",
                }}
              >
                {item.condition}
              </span>

              {item.status === "sold" && (
                <span
                  style={{
                    background: "#fee2e2",
                    color: "#991b1b",
                    padding: "5px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                  }}
                >
                  Sold
                </span>
              )}
            </div>

            {/* TITLE */}
            <h1
              style={{
                fontSize: "1.8rem",
                fontWeight: "800",
                marginTop: "12px",
              }}
            >
              {item.title}
            </h1>

            {/* PRICE */}
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "800",
                color: "#16a34a",
                marginTop: "10px",
              }}
            >
              {item.price > 0
                ? `Rs. ${item.price.toLocaleString()}`
                : "Free / Exchange"}
            </div>

            {/* DESCRIPTION */}
            <div
              style={{
                marginTop: "15px",
                background: "white",
                padding: "15px",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
              }}
            >
              <h3 style={{ fontSize: "0.95rem", fontWeight: "600" }}>
                Description
              </h3>
              <p style={{ color: "#4b5563", lineHeight: "1.6" }}>
                {item.description}
              </p>
            </div>

            {/* INFO GRID */}
            <div
              style={{
                marginTop: "15px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                fontSize: "0.9rem",
              }}
            >
              <div>📍 {item.location || "Sri Lanka"}</div>
              <div>📅 {formatDate(item.createdAt)}</div>
              {item.brand && <div>🏷 {item.brand}</div>}
              {item.model && <div>⚙ {item.model}</div>}
            </div>

            {/* SELLER */}
            <div
              style={{
                marginTop: "20px",
                background: "white",
                padding: "15px",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
              }}
            >
              <h3 style={{ fontSize: "0.9rem", fontWeight: "600" }}>
                Seller
              </h3>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "#16a34a",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                  }}
                >
                  {item.seller?.name?.charAt(0)}
                </div>

                <div>
                  <p style={{ fontWeight: "500" }}>
                    {item.seller?.name}
                  </p>
                  {isAuthenticated && (
                    <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                      {item.seller?.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div style={{ marginTop: "20px" }}>
              {isOwner ? (
                <div style={{ display: "flex", gap: "10px" }}>
                  <Link
                    to={`/edit-item/${id}`}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    ✏ Edit
                  </Link>

                  <button
                    className="btn btn-danger"
                    onClick={handleDelete}
                    style={{ flex: 1 }}
                  >
                    🗑 Delete
                  </button>
                </div>
              ) : isAuthenticated ? (
                <a
                  href={`mailto:${item.seller?.email}?subject=Interested in ${item.title}`}
                  className="btn btn-primary"
                  style={{ width: "100%", textAlign: "center" }}
                >
                  📧 Contact Seller
                </a>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-primary"
                  style={{ width: "100%", textAlign: "center" }}
                >
                  Login to Contact Seller
                </Link>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;