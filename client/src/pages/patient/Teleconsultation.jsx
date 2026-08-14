import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Video, Mic, MicOff, VideoOff, PhoneOff, MessageSquare, ShieldCheck, User } from 'lucide-react';

const Teleconsultation = () => {
  const { id } = useParams();
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'Dr. Olivia Vance', text: 'Hello Sarah! I am reviewing your blood panel report now. How are you feeling today?' }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages([...messages, { sender: 'You (Patient)', text: chatInput }]);
    setChatInput('');
  };

  return (
    <div className="main-content" style={{ maxWidth: '1200px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Virtual Teleconsultation Room</h1>
          <p className="page-subtitle">Encrypted HD video consultation room linked to Appointment #{id || '1'}</p>
        </div>
        <span className="badge badge-completed" style={{ fontSize: '0.85rem' }}>
          <ShieldCheck size={14} /> 256-BIT ENCRYPTED SESSION
        </span>
      </div>

      <div className="grid-cols-3" style={{ alignItems: 'stretch' }}>
        {/* Video Call Interface */}
        <div style={{ gridColumn: 'span 2' }} className="card">
          <div
            style={{
              background: '#0f172a',
              borderRadius: '16px',
              height: '420px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              color: 'white',
              overflow: 'hidden'
            }}
          >
            {videoOn ? (
              <div style={{ textAlign: 'center' }}>
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400"
                  alt="Doctor Stream"
                  style={{ width: '100%', height: '420px', objectFit: 'cover', opacity: 0.95 }}
                />
                <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(0,0,0,0.6)', padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                  🔴 LIVE • Dr. Olivia Vance
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <User size={64} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                <p>Camera is toggled off</p>
              </div>
            )}

            {/* Patient Self Video Inset */}
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                width: '120px',
                height: '90px',
                background: '#1e293b',
                borderRadius: '10px',
                border: '2px solid var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                fontSize: '0.75rem'
              }}
            >
              You (Patient)
            </div>
          </div>

          {/* Call Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
            <button
              onClick={() => setMicOn(!micOn)}
              className="btn"
              style={{ background: micOn ? '#f1f5f9' : '#fee2e2', color: micOn ? 'var(--text-dark)' : '#b91c1c', borderRadius: '50%', width: '48px', height: '48px', padding: 0 }}
            >
              {micOn ? <Mic size={20} /> : <MicOff size={20} />}
            </button>

            <button
              onClick={() => setVideoOn(!videoOn)}
              className="btn"
              style={{ background: videoOn ? '#f1f5f9' : '#fee2e2', color: videoOn ? 'var(--text-dark)' : '#b91c1c', borderRadius: '50%', width: '48px', height: '48px', padding: 0 }}
            >
              {videoOn ? <Video size={20} /> : <VideoOff size={20} />}
            </button>

            <Link to="/patient/appointments" className="btn btn-danger" style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0 }}>
              <PhoneOff size={20} />
            </Link>
          </div>
        </div>

        {/* Live Consultation Chat & Clinical Notes */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>Consultation Chat</h3>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem', minHeight: '300px' }}>
            {messages.map((m, idx) => (
              <div key={idx} style={{ background: m.sender.includes('You') ? 'var(--primary-light)' : '#f8fafc', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>{m.sender}</span>
                <p style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>{m.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Type message to doctor..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Teleconsultation;
