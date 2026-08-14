import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Check } from 'lucide-react';

const DoctorNotifications = () => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch('/api/notifications', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setNotifications(Array.isArray(data) ? data : []));
  }, [token]);

  return (
    <div className="main-content" style={{ maxWidth: '800px' }}>
      <div className="page-header">
        <h1 className="page-title">Doctor Notifications & Alerts</h1>
        <p className="page-subtitle">Patient booking requests and consultation schedule notifications</p>
      </div>

      {notifications.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map((n) => (
            <div key={n.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{n.title}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.created_at}</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dark)', marginTop: '0.35rem' }}>{n.message}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Bell size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3>No notifications for doctor</h3>
        </div>
      )}
    </div>
  );
};

export default DoctorNotifications;
