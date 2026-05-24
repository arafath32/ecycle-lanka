import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: 500,
    textDecoration: "none",
    color: isActive(path) ? "#ffffff" : "#e5e7eb",
    background: isActive(path) ? "rgba(22,163,74,0.9)" : "transparent",
    transition: "all 0.3s ease",
  });

  const mobileLinkStyle = (path) => ({
    padding: "12px 16px",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: 500,
    textDecoration: "none",
    color: isActive(path) ? "#ffffff" : "#e5e7eb",
    background: isActive(path) ? "rgba(22,163,74,0.9)" : "rgba(255,255,255,0.05)",
    transition: "all 0.3s ease",
    display: "block",
  });

  return (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "linear-gradient(135deg, #0b1220 0%, #0f172a 40%, #064e3b 100%)",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      backdropFilter: "blur(12px)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
      animation: "slideDown 0.6s ease",
    }}>
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes mobileMenuOpen {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .nav-link:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.08) !important;
        }
        .logo-glow {
          animation: glow 2.5s infinite alternate;
        }
        @keyframes glow {
          from { filter: drop-shadow(0 0 5px rgba(22,163,74,0.4)); }
          to { filter: drop-shadow(0 0 18px rgba(34,197,94,0.8)); }
        }
        .nav-btn { transition: all 0.25s ease; }
        .nav-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 25px rgba(22,163,74,0.25);
        }
        .hamburger-btn {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }
        .hamburger-btn span {
          display: block;
          width: 22px;
          height: 2px;
          background: #e5e7eb;
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        .mobile-menu {
          display: none;
          flex-direction: column;
          gap: 6px;
          padding: 1rem 1.5rem 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.08);
          animation: mobileMenuOpen 0.25s ease;
        }
        .mobile-menu-divider {
          height: 1px;
          background: rgba(255,255,255,0.08);
          margin: 6px 0;
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-auth { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .mobile-menu { display: flex !important; }
        }
      `}</style>

      {/* Main navbar row */}
      <div className="container" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: 64,
      }}>

        {/* LOGO */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div className="logo-glow" style={{
            width: 40, height: 40, borderRadius: "12px",
            background: "linear-gradient(135deg,#16a34a,#0ea5e9,#22c55e)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", color: "white",
          }}>♻</div>
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontWeight: 800, fontSize: "16px", color: "#fff" }}>
              E-Cycle <span style={{ color: "#22c55e" }}>Lanka</span>
            </div>
            <div style={{ fontSize: "11px", color: "#94a3b8" }}>
              Smart E-Waste Marketplace
            </div>
          </div>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <div className="desktop-nav" style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <Link className="nav-link" to="/browse" style={linkStyle("/browse")}>Browse</Link>
          <Link className="nav-link" to="/requests" style={linkStyle("/requests")}>📋 Requests</Link>
           <Link className="nav-link" to="/impact" style={linkStyle("/impact")}> Impact</Link>
          {isAuthenticated && (
            <>
              <Link className="nav-link" to="/post-item" style={linkStyle("/post-item")}>➕ Sell</Link>
              <Link className="nav-link" to="/dashboard" style={linkStyle("/dashboard")}>Dashboard</Link>
              <Link className="nav-link" to="/my-requests" style={linkStyle("/my-requests")}>My Requests</Link>
            </>
          )}
          {isAdmin && <Link className="nav-link" to="/admin" style={linkStyle("/admin")}>Admin</Link>}
        </div>

        {/* DESKTOP AUTH */}
        <div className="desktop-auth" style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {isAuthenticated ? (
            <>
              <Link to="/profile" style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "6px 12px", borderRadius: "999px",
                background: "rgba(255,255,255,0.08)", color: "#fff",
                textDecoration: "none", transition: "0.3s",
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "#16a34a", display: "flex",
                  alignItems: "center", justifyContent: "center", fontWeight: 700,
                }}>
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                {user?.name?.split(" ")[0]}
              </Link>
              <button onClick={handleLogout} className="nav-btn" style={{
                padding: "7px 12px", borderRadius: "10px", border: "none",
                background: "#16a34a", color: "white", fontWeight: 600, cursor: "pointer",
              }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: "#e5e7eb", textDecoration: "none" }}>Login</Link>
              <Link to="/register" className="nav-btn" style={{
                padding: "7px 12px", borderRadius: "10px",
                background: "#16a34a", color: "white",
                textDecoration: "none", fontWeight: 600,
              }}>Register</Link>
            </>
          )}
        </div>

        {/* HAMBURGER BUTTON — mobile only */}
        <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)}>
          <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ opacity: menuOpen ? 0 : 1 }} />
          <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </div>

      {/* MOBILE MENU — only shows when hamburger clicked */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/browse" style={mobileLinkStyle("/browse")} onClick={() => setMenuOpen(false)}>Browse</Link>
          <Link to="/requests" style={mobileLinkStyle("/requests")} onClick={() => setMenuOpen(false)}>📋 Requests</Link>

          {isAuthenticated && (
            <>
              <div className="mobile-menu-divider" />
              <Link to="/post-item" style={mobileLinkStyle("/post-item")} onClick={() => setMenuOpen(false)}>➕ Sell Item</Link>
              <Link to="/dashboard" style={mobileLinkStyle("/dashboard")} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/my-requests" style={mobileLinkStyle("/my-requests")} onClick={() => setMenuOpen(false)}>My Requests</Link>
              <Link to="/profile" style={mobileLinkStyle("/profile")} onClick={() => setMenuOpen(false)}>Profile</Link>
              {isAdmin && <Link to="/admin" style={mobileLinkStyle("/admin")} onClick={() => setMenuOpen(false)}>Admin Panel</Link>}
              <div className="mobile-menu-divider" />
              <button onClick={handleLogout} style={{
                ...mobileLinkStyle("/"),
                color: "#fca5a5", background: "rgba(239,68,68,0.1)",
                border: "none", cursor: "pointer", textAlign: "left", width: "100%",
              }}>Logout</button>
            </>
          )}

          {!isAuthenticated && (
            <>
              <div className="mobile-menu-divider" />
              <Link to="/login" style={mobileLinkStyle("/login")} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" style={{ ...mobileLinkStyle("/register"), background: "#16a34a", color: "#fff" }} onClick={() => setMenuOpen(false)}>Register</Link>
              <Link className="nav-link" to="/impact" style={linkStyle("/impact")}> Impact</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;