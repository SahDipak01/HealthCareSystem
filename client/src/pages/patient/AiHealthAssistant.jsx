import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { RiskBadge } from '../../components/RiskBadge';
import { Bot, AlertTriangle, CheckCircle2, ArrowRight, ShieldAlert, Info, Stethoscope } from 'lucide-react';

const AiHealthAssistant = () => {
  const { token } = useAuth();
  const [symptoms, setSymptoms] = useState('');
  const [severity, setSeverity] = useState('moderate');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAssess = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/ai/assess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          symptoms,
          severity,
          additional_info: additionalInfo
        })
      });

      const data = await res.json();
      setAssessment(data);
    } catch (err) {
      alert('Failed to process AI risk assessment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content" style={{ maxWidth: '900px' }}>
      <div className="page-header">
        <h1 className="page-title">AI Health Assistant</h1>
        <p className="page-subtitle">Instant clinical symptom assessment and health-risk triage</p>
      </div>

      {/* Prominent Medical Disclaimer Banner required by user prompt */}
      <div
        style={{
          background: '#fffbe6',
          border: '2px solid #ffe58f',
          padding: '1rem 1.25rem',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          marginBottom: '2rem'
        }}
      >
        <Info style={{ color: '#d48806', flexShrink: 0 }} size={24} />
        <div>
          <h4 style={{ color: '#873800', fontWeight: 800, fontSize: '0.95rem' }}>INFORMATIONAL DISCLAIMER</h4>
          <p style={{ color: '#612500', fontWeight: 700, fontSize: '0.9rem' }}>
            This is an informational health-risk assessment and is not a medical diagnosis.
          </p>
        </div>
      </div>

      <div className="grid-cols-2" style={{ alignItems: 'flex-start' }}>
        {/* Input Symptom Form */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Bot style={{ color: 'var(--primary)' }} size={24} />
            <h3 className="card-title">Enter Health Symptoms</h3>
          </div>

          <form onSubmit={handleAssess}>
            <div className="form-group">
              <label className="form-label">What symptoms are you experiencing?</label>
              <textarea
                className="form-textarea"
                rows="4"
                placeholder="e.g. Mild persistent fever, dry cough, sore throat, and muscle fatigue for 2 days..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Symptom Severity</label>
              <select className="form-select" value={severity} onChange={(e) => setSeverity(e.target.value)}>
                <option value="mild">Mild (Manageable discomfort)</option>
                <option value="moderate">Moderate (Interferes with daily routine)</option>
                <option value="severe">Severe (Acute discomfort / Urgent)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Additional Health History (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. History of asthma, high blood pressure..."
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} disabled={loading}>
              {loading ? 'Evaluating Symptoms...' : 'Analyze Health Risk Level'}
            </button>
          </form>
        </div>

        {/* Assessment Output Display */}
        <div>
          {assessment ? (
            <div className="card" style={{ borderLeft: `6px solid ${assessment.riskLevel === 'High' ? '#ef4444' : assessment.riskLevel === 'Medium' ? '#f59e0b' : '#10b981'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 className="card-title">Risk Assessment Summary</h3>
                <RiskBadge riskLevel={assessment.riskLevel} />
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
                <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-dark)' }}>{assessment.summary}</p>
              </div>

              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-dark)' }}>
                Recommended Clinical Next Steps:
              </h4>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
                {Array.isArray(assessment.recommendations) ? assessment.recommendations.map((rec, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                    <span>{rec}</span>
                  </li>
                )) : (
                  <li style={{ fontSize: '0.9rem' }}>Schedule a consultation with a General Physician.</li>
                )}
              </ul>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <a href="/patient/doctors" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                  <Stethoscope size={16} /> Consult Doctor Immediately
                </a>
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc' }}>
              <Bot size={48} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
              <h3>Ready for Symptom Assessment</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Enter your symptoms in the form on the left and click "Analyze Health Risk Level" to receive recommendations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiHealthAssistant;
