import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, CheckCircle2, Info, AlertTriangle, Check } from 'lucide-react';

const PatientNotifications = () => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  const fetchNotifications = () => {
    setLoading(true);
    fetch('/api/notifications', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setNotifications(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  const handleMarkAllRead = async () => {
    await fetch('/api/notifications/read-all', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchNotifications();
  };

  return (
    <div className="main-content" style={{ maxWidth: '800px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Notifications & Alerts</h1>
          <p className="page-subtitle">Appointment updates, digital prescription alerts, and ABHA sync logs</p>
        </div>
        <button onClick={handleMarkAllRead} className="btn btn-secondary btn-sm">
          <Check size={16} /> Mark All as Read
        </button>
      </div>

      {loading ? (
        <p>Loading notifications...</p>
      ) : notifications.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              className="card"
              style={{
                background: n.is_read ? 'white' : 'var(--primary-light)',
                borderLeft: `4px solid ${n.type === 'success' ? '#10b981' : n.type === 'warning' ? '#f59e0b' : 'var(--primary)'}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{n.title}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.created_at}</span>
              </div>
              <p style={{ color: 'var(--text-dark)', fontSize: '0.9rem', marginTop: '0.35rem' }}>{n.message}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Bell size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3>No notifications yet</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>You're all caught up!</p>
        </div>
      )}
    </div>
  );
};

export default PatientNotifications;
