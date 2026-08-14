import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, MapPin, PhoneCall, Ambulance, CheckCircle2, AlertTriangle, Activity } from 'lucide-react';

const EmergencySos = () => {
  const { token, user } = useAuth();
  const [emergencyType, setEmergencyType] = useState('Acute Medical Emergency');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [sosResult, setSosResult] = useState(null);

  const handleTriggerSOS = async () => {
    setLoading(true);
    setSosResult(null);

    // Get browser location if permitted
    let lat = 28.6139;
    let lng = 77.2090;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
          sendSosRequest(lat, lng);
        },
        () => {
          sendSosRequest(lat, lng);
        }
      );
    } else {
      sendSosRequest(lat, lng);
    }
  };

  const sendSosRequest = async (lat, lng) => {
    try {
      const res = await fetch('/api/emergency/sos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          latitude: lat,
          longitude: lng,
          emergency_type: emergencyType,
          details
        })
      });

      const data = await res.json();
      setSosResult(data);
    } catch (err) {
      alert('Failed to send SOS alert.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content" style={{ maxWidth: '900px' }}>
      <div className="page-header">
        <h1 className="page-title" style={{ color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldAlert size={36} /> Emergency SOS & Ambulance Dispatch
        </h1>
        <p className="page-subtitle">Real-time emergency broadcast, live location sharing, and 108 ambulance response</p>
      </div>

      <div className="grid-cols-2" style={{ alignItems: 'flex-start' }}>
        {/* Panic Button Card */}
        <div className="card" style={{ background: '#fff5f5', border: '2px solid #fca5a5', textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <span className="badge badge-high" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              <Activity size={16} /> NATIONAL HELPLINE: 108 / 112
            </span>
          </div>

          <button
            type="button"
            onClick={handleTriggerSOS}
            disabled={loading}
            style={{
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
              color: 'white',
              border: '6px solid #fca5a5',
              fontSize: '1.4rem',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(239, 68, 68, 0.4)',
              margin: '0 auto 1.5rem auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justify: 'center',
              gap: '0.25rem',
              transition: 'transform 0.2s'
            }}
          >
            <ShieldAlert size={48} />
            <span>{loading ? 'SENDING...' : 'TRIGGER SOS'}</span>
          </button>

          <p style={{ fontSize: '0.85rem', color: '#991b1b', fontWeight: 600 }}>
            Clicking SOS immediately shares your location with emergency trauma units and dispatches the nearest ambulance.
          </p>

          <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
            <label className="form-label" style={{ color: '#991b1b' }}>Emergency Category</label>
            <select className="form-select" value={emergencyType} onChange={(e) => setEmergencyType(e.target.value)}>
              <option value="Severe Chest Pain / Heart Attack">Severe Chest Pain / Heart Attack</option>
              <option value="Breathing Difficulty / Low SpO2">Breathing Difficulty / Low SpO2</option>
              <option value="Accident / Severe Injury">Accident / Severe Injury</option>
              <option value="Unconsciousness / Sudden Faint">Unconsciousness / Sudden Faint</option>
              <option value="Acute Allergic Reaction">Acute Allergic Reaction</option>
            </select>
          </div>
        </div>

        {/* Dispatch Status & Live Emergency Feed */}
        <div>
          {sosResult ? (
            <div className="card" style={{ background: '#f0fdf4', border: '2px solid #86efac' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#166534' }}>
                <CheckCircle2 size={32} />
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{sosResult.message}</h3>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>Ticket ID: {sosResult.sosId}</p>
                </div>
              </div>

              <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #bbf7d0', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 700 }}>AMBULANCE STATUS</span>
                  <span className="badge badge-completed">{sosResult.ambulanceStatus}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 700 }}>ASSIGNED TRAUMA CENTER</span>
                  <strong style={{ fontSize: '0.9rem' }}>{sosResult.hospitalAssigned}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 700 }}>NATIONAL DISPATCH DIRECT LINE</span>
                  <strong style={{ fontSize: '0.9rem', color: '#b91c1c' }}>{sosResult.emergencyHelpline}</strong>
                </div>
              </div>

              <div style={{ background: '#fffbe6', padding: '0.85rem', borderRadius: '8px', fontSize: '0.85rem', color: '#873800', border: '1px solid #ffe58f' }}>
                <strong>Patient Advice:</strong> Stay calm. Keep your phone line clear. Unlock your main entrance if possible.
              </div>
            </div>
          ) : (
            <div className="card">
              <h3 className="card-title" style={{ marginBottom: '1rem' }}>Emergency Services Nearby</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
                <li style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>AIIMS Emergency Trauma Care</strong>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Distance: 2.4 km • 24/7 ICU & Ventilators</p>
                  </div>
                  <span className="badge badge-low">Available</span>
                </li>

                <li style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>Max Super Specialty Hospital</strong>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Distance: 4.1 km • Cardiac Cath Lab Ready</p>
                  </div>
                  <span className="badge badge-low">Available</span>
                </li>

                <li style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>Regional Red Cross Blood Bank</strong>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Universal Donors Available (O- / O+)</p>
                  </div>
                  <span className="badge badge-completed">Verified</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencySos;
