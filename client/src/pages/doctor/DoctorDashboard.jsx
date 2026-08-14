import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/RiskBadge';
import { Calendar, Users, CheckCircle2, Clock, Stethoscope, Video, FilePlus, ArrowRight } from 'lucide-react';

const DoctorDashboard = () => {
  const { user, token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    if (!token) return;
    fetch('/api/appointments', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setAppointments(Array.isArray(data) ? data : []));

    fetch('/api/doctors/my/patients', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setPatients(Array.isArray(data) ? data : []));
  }, [token]);

  const pendingCount = appointments.filter((a) => a.status === 'pending').length;
  const approvedCount = appointments.filter((a) => a.status === 'approved').length;

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Welcome, {user?.name}!</h1>
        <p className="page-subtitle">Clinical consultation queue and active patient directory</p>
      </div>

      {/* Doctor Metric Cards */}
      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, #4f46e5, #3730a3)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ opacity: 0.85, fontSize: '0.85rem' }}>Total Appointments</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{appointments.length}</h2>
            </div>
            <Calendar size={36} style={{ opacity: 0.8 }} />
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ opacity: 0.85, fontSize: '0.85rem' }}>Pending Requests</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{pendingCount}</h2>
            </div>
            <Clock size={36} style={{ opacity: 0.8 }} />
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ opacity: 0.85, fontSize: '0.85rem' }}>Scheduled Consultations</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{approvedCount}</h2>
            </div>
            <CheckCircle2 size={36} style={{ opacity: 0.8 }} />
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #0d9488, #0f766e)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ opacity: 0.85, fontSize: '0.85rem' }}>Assigned Patients</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{patients.length}</h2>
            </div>
            <Users size={36} style={{ opacity: 0.8 }} />
          </div>
        </div>
      </div>

      {/* Appointment Consultation Queue */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h3 className="card-title">Consultation Schedule Manager</h3>
          <Link to="/doctor/appointments" className="btn btn-secondary btn-sm">View Complete Schedule</Link>
        </div>

        {appointments.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Requested Date & Time</th>
                  <th>Symptoms Intake</th>
                  <th>Status</th>
                  <th>Quick Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 5).map((a) => (
                  <tr key={a.id}>
                    <td><strong>{a.patient_name}</strong></td>
                    <td>{a.date} at {a.time}</td>
                    <td style={{ maxWidth: '240px' }}>{a.symptoms}</td>
                    <td><StatusBadge status={a.status} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/doctor/consultation/${a.id}`} className="btn btn-primary btn-sm">
                          <Stethoscope size={14} /> Start Consultation
                        </Link>
                        <Link to={`/doctor/prescriptions/new/${a.id}`} className="btn btn-secondary btn-sm">
                          <FilePlus size={14} /> E-Prescribe
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', padding: '1rem' }}>No appointment requests in queue.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
