import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Particles from '../components/Particles';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form);
      navigate(data.user?.role === 'admin' ? '/admin' : from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #022c16 0%, #052e16 40%, #14532d 70%, #0f766e 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Floating particles */}
      <Particles color="#22c55e" opacity={0.5} />

      {/* Glowing background circles */}
      <div style={{
        position: 'absolute', width: 500, height: 500,
        borderRadius: '50%', top: '-150px', left: '-150px',
        background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 400, height: 400,
        borderRadius: '50%', bottom: '-100px', right: '-100px',
        background: 'radial-gradient(circle, rgba(15,118,110,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Left side — Branding panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        position: 'relative',
        zIndex: 2,
      }}
        className="hide-mobile"
      >
        {/* Animated logo */}
        <div style={{
          width: 90, height: 90,
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #22c55e, #0f766e)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 8px 32px rgba(34,197,94,0.4)',
          animation: 'float 3.5s ease-in-out infinite',
        }}>
          ♻️
        </div>

        <h1 style={{
          fontSize: '2.5rem', fontWeight: 800,
          color: '#fff', textAlign: 'center',
          lineHeight: 1.2, marginBottom: '1rem',
        }}>
          E-Cycle{' '}
          <span style={{
            background: 'linear-gradient(90deg, #22c55e, #4ade80, #22c55e)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'shimmer 3s linear infinite',
          }}>
            Lanka
          </span>
        </h1>

        <p style={{
          color: 'rgba(255,255,255,0.7)',
          fontSize: '1.05rem',
          textAlign: 'center',
          maxWidth: 320,
          lineHeight: 1.7,
          marginBottom: '2.5rem',
        }}>
          Sri Lanka's smart e-waste marketplace. Give your electronics a second life.
        </p>

        {/* Stats row */}
        <div style={{
          display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center',
        }}>
          {[
            { icon: '♻️', value: '5+', label: 'Items Recycled' },
            { icon: '👥', value: '6+', label: 'Users' },
            { icon: '🌿', value: '4+ KG', label: 'Waste Saved' },
          ].map((s, i) => (
            <div key={i} style={{
              textAlign: 'center',
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '14px',
              padding: '1rem 1.25rem',
              minWidth: 90,
            }}>
              <div style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>{s.icon}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#4ade80' }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side — Login form */}
      <div style={{
        width: '100%',
        maxWidth: 480,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        zIndex: 2,
      }}>
        <div style={{ width: '100%' }}>

          {/* Mobile logo — only shown on small screens */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <Link to="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              textDecoration: 'none',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '12px',
                background: 'linear-gradient(135deg, #22c55e, #0f766e)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.3rem',
                boxShadow: '0 4px 16px rgba(34,197,94,0.3)',
              }}>
                ♻️
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
                E-Cycle Lanka
              </span>
            </Link>
          </div>

          {/* Card */}
          <div style={{
            background: 'rgba(255,255,255,0.97)',
            borderRadius: '24px',
            padding: '2.5rem',
            boxShadow: '0 24px 64px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
            animation: 'slideUp 0.5s ease both',
          }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827', marginBottom: '0.3rem' }}>
                Welcome back 👋
              </h2>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                Sign in to your E-Cycle Lanka account
              </p>
            </div>

            {/* Error alert */}
            {error && (
              <div style={{
                background: '#fee2e2',
                color: '#dc2626',
                border: '1px solid #fca5a5',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                marginBottom: '1.25rem',
                fontSize: '0.875rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                animation: 'slideUp 0.3s ease both',
              }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email field */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{
                  display: 'block', fontSize: '0.875rem',
                  fontWeight: 600, color: '#374151', marginBottom: '0.5rem',
                }}>
                  Email address
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: '0.9rem', top: '50%',
                    transform: 'translateY(-50%)', fontSize: '1rem',
                    pointerEvents: 'none',
                  }}>
                    📧
                  </span>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.5rem',
                      border: '1.5px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      color: '#111827',
                      background: '#f9fafb',
                      transition: 'all 0.2s',
                      outline: 'none',
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#22c55e';
                      e.target.style.background = '#fff';
                      e.target.style.boxShadow = '0 0 0 3px rgba(34,197,94,0.12)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.background = '#f9fafb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Password field */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block', fontSize: '0.875rem',
                  fontWeight: 600, color: '#374151', marginBottom: '0.5rem',
                }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: '0.9rem', top: '50%',
                    transform: 'translateY(-50%)', fontSize: '1rem',
                    pointerEvents: 'none',
                  }}>
                    🔒
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 2.75rem 0.75rem 2.5rem',
                      border: '1.5px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      color: '#111827',
                      background: '#f9fafb',
                      transition: 'all 0.2s',
                      outline: 'none',
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#22c55e';
                      e.target.style.background = '#fff';
                      e.target.style.boxShadow = '0 0 0 3px rgba(34,197,94,0.12)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.background = '#f9fafb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  {/* Show/hide password toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    style={{
                      position: 'absolute', right: '0.9rem', top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none', border: 'none',
                      cursor: 'pointer', fontSize: '0.95rem',
                      color: '#9ca3af', padding: '0',
                      lineHeight: 1,
                    }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  background: loading
                    ? '#86efac'
                    : 'linear-gradient(135deg, #22c55e, #15803d)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 20px rgba(34,197,94,0.35)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  letterSpacing: '0.01em',
                }}
                onMouseEnter={e => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 28px rgba(34,197,94,0.45)';
                  }
                }}
                onMouseLeave={e => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 20px rgba(34,197,94,0.35)';
                }}
              >
                {loading ? (
                  <>
                    <span style={{
                      width: 18, height: 18,
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      display: 'inline-block',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                    Signing in...
                  </>
                ) : (
                  '🔐  Sign In'
                )}
              </button>
            </form>

            {/* Divider */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              margin: '1.5rem 0',
            }}>
              <div style={{ flex: 1, height: 1, background: '#f3f4f6' }} />
              <span style={{ fontSize: '0.8rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                New to E-Cycle Lanka?
              </span>
              <div style={{ flex: 1, height: 1, background: '#f3f4f6' }} />
            </div>

            {/* Register link button */}
            <Link
              to="/register"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '100%', padding: '0.75rem',
                background: '#f0fdf4',
                color: '#15803d',
                border: '1.5px solid #86efac',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s',
                gap: '0.4rem',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#dcfce7';
                e.currentTarget.style.borderColor = '#22c55e';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#f0fdf4';
                e.currentTarget.style.borderColor = '#86efac';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              🌱 Create a free account
            </Link>
          </div>

          {/* Bottom link */}
          <p style={{
            textAlign: 'center', marginTop: '1.5rem',
            color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem',
          }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'underline' }}>
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes particleFloat {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-20px) scale(1); opacity: 0; }
        }
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Login;