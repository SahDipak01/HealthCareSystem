import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, ShieldAlert, CheckCircle2 } from 'lucide-react';

const SystemAlerts = () => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch('/api/notifications', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setNotifications(Array.isArray(data) ? data : []));
  }, [token]);

  return (
    <div className="main-content" style={{ maxWidth: '850px' }}>
      <div className="page-header">
        <h1 className="page-title">System Infrastructure Alerts</h1>
        <p className="page-subtitle">Security audit logs, ABHA server sync status, and high-risk triage emergency alerts</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>ABHA National Gateway Synchronization</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-dark)', marginTop: '0.25rem' }}>
            All citizen digital health records successfully synced with ABDM production servers.
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>High-Risk AI Symptom Alert Detected</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-dark)', marginTop: '0.25rem' }}>
            Patient ID #1 flagged high-risk triage (Chest pain & breathing difficulty). Emergency advice dispatched.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SystemAlerts;
