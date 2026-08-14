import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, User, LogOut, ShieldAlert, Stethoscope, LayoutDashboard, Bell } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <Activity size={28} />
        <span>Swasthya<span style={{ color: 'var(--secondary)' }}>Connect</span></span>
      </Link>

      <ul className="nav-links">
        <li>
          <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>Home</Link>
        </li>
        <li>
          <Link to="/about" className={`nav-item ${isActive('/about') ? 'active' : ''}`}>About Platform</Link>
        </li>
        <li>
          <Link to="/services" className={`nav-item ${isActive('/services') ? 'active' : ''}`}>Services</Link>
        </li>

        {user ? (
          <>
            {user.role === 'patient' && (
              <>
                <li>
                  <Link to="/patient/emergency" className="btn btn-danger btn-sm" style={{ padding: '0.4rem 0.85rem', animation: 'pulse 2s infinite' }}>
                    <ShieldAlert size={16} /> SOS Emergency
                  </Link>
                </li>
                <li>
                  <Link to="/patient/dashboard" className={`nav-item ${location.pathname.startsWith('/patient') ? 'active' : ''}`}>
                    <LayoutDashboard size={18} />
                    Patient Portal
                  </Link>
                </li>
              </>
            )}
            {user.role === 'doctor' && (
              <li>
                <Link to="/doctor/dashboard" className={`nav-item ${location.pathname.startsWith('/doctor') ? 'active' : ''}`}>
                  <Stethoscope size={18} />
                  Doctor Console
                </Link>
              </li>
            )}
            {user.role === 'admin' && (
              <li>
                <Link to="/admin/dashboard" className={`nav-item ${location.pathname.startsWith('/admin') ? 'active' : ''}`}>
                  <ShieldAlert size={18} />
                  Admin Portal
                </Link>
              </li>
            )}

            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
              <select className="form-select" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', width: 'auto', background: '#f8fafc' }}>
                <option value="en">🌐 EN (English)</option>
                <option value="hi">🌐 HI (हिंदी)</option>
                <option value="bn">🌐 BN (বাংলা)</option>
                <option value="te">🌐 TE (తెలుగు)</option>
                <option value="ta">🌐 TA (தமிழ்)</option>
              </select>

              <span className="badge badge-completed" style={{ fontSize: '0.85rem' }}>
                <User size={14} /> {user.name} ({user.role.toUpperCase()})
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="btn btn-secondary btn-sm"
                title="Sign Out"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </li>
          </>
        ) : (
          <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <select className="form-select" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', width: 'auto', background: '#f8fafc' }}>
              <option value="en">🌐 EN (English)</option>
              <option value="hi">🌐 HI (हिंदी)</option>
              <option value="bn">🌐 BN (বাংলা)</option>
              <option value="te">🌐 TE (తెలుగు)</option>
              <option value="ta">🌐 TA (தமிழ்)</option>
            </select>
            <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Create Account</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
