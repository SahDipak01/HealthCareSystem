import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/RiskBadge';
import { Calendar, CreditCard, Search, FileText, Upload, Pill, Bot, Video, ArrowRight, UserCheck, Bell, Activity } from 'lucide-react';

const PatientDashboard = () => {
  const { user, token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    if (!token) return;
    fetch('/api/appointments', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setAppointments(Array.isArray(data) ? data : []));

    fetch('/api/patients/records', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setRecords(Array.isArray(data) ? data : []));

    fetch('/api/patients/prescriptions', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setPrescriptions(Array.isArray(data) ? data : []));
  }, [token]);

  const upcomingAppt = appointments.find((a) => a.status === 'approved' || a.status === 'pending');

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user?.name}!</h1>
        <p className="page-subtitle">Here is your digital health overview and active consultations</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, #0d9488, #0f766e)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ opacity: 0.85, fontSize: '0.85rem' }}>Upcoming Appointments</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{appointments.filter(a => a.status !== 'cancelled').length}</h2>
            </div>
            <Calendar size={36} style={{ opacity: 0.8 }} />
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #4f46e5, #4338ca)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ opacity: 0.85, fontSize: '0.85rem' }}>Digital Health Records</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{records.length}</h2>
            </div>
            <FileText size={36} style={{ opacity: 0.8 }} />
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ opacity: 0.85, fontSize: '0.85rem' }}>Active Prescriptions</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{prescriptions.length}</h2>
            </div>
            <Pill size={36} style={{ opacity: 0.8 }} />
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ opacity: 0.85, fontSize: '0.85rem' }}>ABHA Health ID</p>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '0.5rem' }}>LINKED & ACTIVE</h4>
            </div>
            <CreditCard size={36} style={{ opacity: 0.8 }} />
          </div>
        </div>
      </div>

      {/* Main Feature Action Buttons */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 className="card-title" style={{ marginBottom: '1.25rem' }}>Digital Healthcare Services & Shortcuts</h3>
        <div className="grid-cols-4">
          <Link to="/patient/health-id" className="btn btn-secondary" style={{ flexDirection: 'column', padding: '1.25rem', height: 'auto', gap: '0.5rem', textAlign: 'center' }}>
            <CreditCard style={{ color: 'var(--primary)' }} size={28} />
            <span>Digital ABHA Card</span>
          </Link>
          <Link to="/patient/doctors" className="btn btn-secondary" style={{ flexDirection: 'column', padding: '1.25rem', height: 'auto', gap: '0.5rem', textAlign: 'center' }}>
            <Search style={{ color: 'var(--secondary)' }} size={28} />
            <span>Find Specialist Doctors</span>
          </Link>
          <Link to="/patient/ai-assistant" className="btn btn-secondary" style={{ flexDirection: 'column', padding: '1.25rem', height: 'auto', gap: '0.5rem', textAlign: 'center' }}>
            <Bot style={{ color: '#0284c7' }} size={28} />
            <span>AI Health Assistant</span>
          </Link>
          <Link to="/patient/upload-report" className="btn btn-secondary" style={{ flexDirection: 'column', padding: '1.25rem', height: 'auto', gap: '0.5rem', textAlign: 'center' }}>
            <Upload style={{ color: 'var(--success)' }} size={28} />
            <span>Upload Medical Report</span>
          </Link>
        </div>
      </div>

      <div className="grid-cols-2">
        {/* Next Scheduled Consultation */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Next Scheduled Visit</h3>
            <Link to="/patient/appointments" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>View All</Link>
          </div>

          {upcomingAppt ? (
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{upcomingAppt.doctor_name}</h4>
                <StatusBadge status={upcomingAppt.status} />
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Specialty: <strong>{upcomingAppt.doctor_specialty}</strong></p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>Slot: <strong>{upcomingAppt.date} at {upcomingAppt.time}</strong></p>
              
              <Link to={`/patient/teleconsult/${upcomingAppt.id}`} className="btn btn-primary btn-sm">
                <Video size={16} /> Enter Virtual Teleconsultation
              </Link>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', padding: '1rem 0' }}>No upcoming appointments. Search for doctors to book a slot.</p>
          )}
        </div>

        {/* Recent Prescriptions */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Digital Prescriptions</h3>
            <Link to="/patient/prescriptions" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>View All</Link>
          </div>

          {prescriptions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {prescriptions.slice(0, 2).map((p) => (
                <div key={p.id} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h5 style={{ fontWeight: 700 }}>{p.diagnosis}</h5>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.date}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Issued by {p.doctor_name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', padding: '1rem 0' }}>No prescriptions issued yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
