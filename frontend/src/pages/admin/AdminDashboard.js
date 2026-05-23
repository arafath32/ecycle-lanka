import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar
} from "recharts";
import { getAdminStats } from "../../services/adminService";
import api from "../../services/api";

const COLORS = ["#16a34a", "#0ea5e9", "#6366f1", "#f59e0b", "#ef4444", "#8b5cf6"];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsData, analyticsRes] = await Promise.all([
          getAdminStats(),
          api.get("/admin/analytics")
        ]);
        setStats(statsData);
        setAnalytics(analyticsRes.data.analytics);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey]);

  if (loading) {
    return (
      <div style={{ padding: "4rem", textAlign: "center", color: "#6b7280" }}>
        Loading dashboard...
      </div>
    );
  }

  const cards = [
    { label: "Users", value: analytics?.overview?.totalUsers || 0, icon: "👥", color: "#6366f1", link: "/admin/users" },
    { label: "Listings", value: analytics?.overview?.totalItems || 0, icon: "📦", color: "#16a34a", link: "/admin/listings" },
    { label: "Approved", value: analytics?.overview?.approvedItems || 0, icon: "✅", color: "#0f766e", link: "/admin/listings" },
    { label: "Pending", value: analytics?.overview?.pendingItems || 0, icon: "⏳", color: "#f59e0b", link: "/admin/listings" },
    { label: "Requests", value: analytics?.overview?.totalRequests || 0, icon: "📨", color: "#0ea5e9", link: "/requests" },
    { label: "Sold", value: analytics?.overview?.soldItems || 0, icon: "💰", color: "#ef4444", link: "/admin/listings" },
  ];

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "2rem 1rem" }}>
      <div className="container">

        {/* HEADER */}
        <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "26px", fontWeight: "800" }}>📊 Admin Dashboard</h1>
            <p style={{ color: "#6b7280", marginTop: "4px" }}>
              E-Cycle Lanka analytics & control panel
            </p>
          </div>

          <button
            onClick={() => setRefreshKey(k => k + 1)}
            style={{
              background: "#16a34a",
              color: "white",
              border: "none",
              padding: "8px 14px",
              borderRadius: "10px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            🔄 Refresh
          </button>
        </div>

        {/* STATS CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "15px",
            marginBottom: "2rem"
          }}
        >
          {cards.map((c) => (
            <Link key={c.label} to={c.link} style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "14px",
                  padding: "18px",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                  transition: "0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontSize: "12px", color: "#6b7280" }}>{c.label}</p>
                    <h2 style={{ color: c.color, fontSize: "26px", margin: 0, fontWeight: "800" }}>
                      {c.value}
                    </h2>
                  </div>
                  <div style={{ fontSize: "26px" }}>{c.icon}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CHART ROW 1 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>

          {/* Listings trend */}
          <div style={panelStyle}>
            <h3>📦 Listings Growth</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={analytics?.itemsByMonth || []}>
                <CartesianGrid stroke="#eee" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="items" stroke="#16a34a" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Users trend */}
          <div style={panelStyle}>
            <h3>👥 User Growth</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={analytics?.usersByMonth || []}>
                <CartesianGrid stroke="#eee" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART ROW 2 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>

          {/* Pie */}
          <div style={panelStyle}>
            <h3>♻ Category Breakdown</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={analytics?.itemsByCategory || []}
                  dataKey="value"
                  outerRadius={90}
                >
                  {(analytics?.itemsByCategory || []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar */}
          <div style={panelStyle}>
            <h3>📋 Request Urgency</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={analytics?.requestsByUrgency || []}>
                <CartesianGrid stroke="#eee" />
                <XAxis dataKey="urgency" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
          {[
            { t: "Users", d: "Manage platform users", l: "/admin/users", i: "👥" },
            { t: "Listings", d: "Approve or remove items", l: "/admin/listings", i: "📦" },
            { t: "Requests", d: "Buyer requests board", l: "/requests", i: "📨" },
            { t: "Reports", d: "Analytics reports", l: "/admin/reports", i: "📊" },
          ].map(q => (
            <Link key={q.t} to={q.l} style={{ textDecoration: "none" }}>
              <div style={quickCard}>
                <div style={{ fontSize: "24px" }}>{q.i}</div>
                <h4 style={{ margin: "6px 0 4px 0" }}>{q.t}</h4>
                <p style={{ fontSize: "12px", color: "#6b7280" }}>{q.d}</p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};

const panelStyle = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "14px",
  padding: "16px",
};

const quickCard = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "14px",
  padding: "16px",
  transition: "0.2s",
  cursor: "pointer",
};

export default AdminDashboard;