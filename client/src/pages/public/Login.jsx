import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Activity, Lock, Mail, UserCheck, Stethoscope, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'patient') navigate('/patient/dashboard');
      else if (loggedUser.role === 'doctor') navigate('/doctor/dashboard');
      else if (loggedUser.role === 'admin') navigate('/admin/dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setLoading(true);

    try {
      const loggedUser = await login(demoEmail, demoPassword);
      if (loggedUser.role === 'patient') navigate('/patient/dashboard');
      else if (loggedUser.role === 'doctor') navigate('/doctor/dashboard');
      else if (loggedUser.role === 'admin') navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 140px)' }}>
      <div style={{ width: '100%', maxWidth: '450px' }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Activity style={{ color: 'var(--primary)', margin: '0 auto 0.5rem auto' }} size={36} />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sign in to access your digital health portal</p>
          </div>

          {error && (
            <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.85rem' }} disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Sign In Box */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1rem' }}>
              ONE-CLICK DEMO LOGIN ACCOUNTS
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleDemoLogin('patient@swasthya.com', 'password123')}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'flex-start' }}
              >
                <UserCheck size={16} style={{ color: 'var(--primary)' }} /> Patient Demo (`patient@swasthya.com`)
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('doctor@swasthya.com', 'password123')}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'flex-start' }}
              >
                <Stethoscope size={16} style={{ color: 'var(--secondary)' }} /> Doctor Demo (`doctor@swasthya.com`)
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin@swasthya.com', 'password123')}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'flex-start' }}
              >
                <ShieldCheck size={16} style={{ color: '#ef4444' }} /> Admin Demo (`admin@swasthya.com`)
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
