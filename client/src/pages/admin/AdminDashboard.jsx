import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Users, Stethoscope, Calendar, FileText, Activity, ShieldCheck, DollarSign, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalPrescriptions: 0,
    pendingAppointments: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    if (!token) return;
    fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, [token]);

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">SwasthyaConnect Government & Admin Portal</h1>
        <p className="page-subtitle">National Digital Health Registry Surveillance & Strategic Healthcare Analytics</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, #0d9488, #0f766e)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ opacity: 0.85, fontSize: '0.85rem' }}>Registered Patients</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.totalPatients}</h2>
            </div>
            <Users size={36} style={{ opacity: 0.8 }} />
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #4f46e5, #3730a3)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ opacity: 0.85, fontSize: '0.85rem' }}>Verified Physicians</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.totalDoctors}</h2>
            </div>
            <Stethoscope size={36} style={{ opacity: 0.8 }} />
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ opacity: 0.85, fontSize: '0.85rem' }}>Total Consultations</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.totalAppointments}</h2>
            </div>
            <Calendar size={36} style={{ opacity: 0.8 }} />
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ opacity: 0.85, fontSize: '0.85rem' }}>E-Prescriptions Issued</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.totalPrescriptions}</h2>
            </div>
            <FileText size={36} style={{ opacity: 0.8 }} />
          </div>
        </div>
      </div>

      {/* Admin Shortcuts Grid */}
      <div className="grid-cols-3" style={{ marginBottom: '2rem' }}>
        <Link to="/admin/patients" className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '1rem', borderRadius: '12px' }}>
            <Users size={28} />
          </div>
          <div>
            <h3 className="card-title">Patient Registry</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Inspect registered citizens & ABHA ID cards</p>
          </div>
        </Link>

        <Link to="/admin/doctors" className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#e0e7ff', color: 'var(--secondary)', padding: '1rem', borderRadius: '12px' }}>
            <Stethoscope size={28} />
          </div>
          <div>
            <h3 className="card-title">Doctor Verification</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Review clinical licenses & practitioner credentials</p>
          </div>
        </Link>

        <Link to="/admin/reports" className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#dcfce7', color: 'var(--success)', padding: '1rem', borderRadius: '12px' }}>
            <TrendingUp size={28} />
          </div>
          <div>
            <h3 className="card-title">Health & Disease Reports</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>National disease prevalence & regional trends</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
