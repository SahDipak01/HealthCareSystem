import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bot, FileText, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

const LabAnalyzer = () => {
  const { token } = useAuth();
  const [reportText, setReportText] = useState('Fasting Glucose: 145 mg/dL, HbA1c: 7.2%, Hemoglobin: 10.2 g/dL, Total Cholesterol: 185 mg/dL');
  const [testType, setTestType] = useState('Comprehensive Metabolic & Blood Panel');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!reportText.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/ai/analyze-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          report_text: reportText,
          test_type: testType
        })
      });

      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      alert('Failed to analyze lab report text.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content" style={{ maxWidth: '900px' }}>
      <div className="page-header">
        <h1 className="page-title">AI Diagnostic Lab Report Interpreter</h1>
        <p className="page-subtitle">Paste lab report text values (Glucose, HbA1c, Hemoglobin, Lipids) for instant plain-language explanation</p>
      </div>

      <div className="grid-cols-2" style={{ alignItems: 'flex-start' }}>
        {/* Input Form */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>Enter Test Report Values</h3>
          <form onSubmit={handleAnalyze}>
            <div className="form-group">
              <label className="form-label">Diagnostic Test Category</label>
              <input type="text" className="form-input" value={testType} onChange={(e) => setTestType(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Paste Lab Results / Values Text</label>
              <textarea
                className="form-textarea"
                rows="6"
                placeholder="Paste lab values e.g., Glucose: 145 mg/dL, Hemoglobin: 10.2 g/dL..."
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} disabled={loading}>
              <Bot size={18} /> {loading ? 'Analyzing Biomarkers...' : 'Interpret Lab Report Values'}
            </button>
          </form>
        </div>

        {/* AI Interpretation Output */}
        <div>
          {analysis ? (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 className="card-title">Biomarker Analysis</h3>
                <span className={`badge ${analysis.overallStatus === 'Normal' ? 'badge-completed' : 'badge-pending'}`}>
                  {analysis.overallStatus}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
                {analysis.findings.map((item, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', borderLeft: `4px solid ${item.status === 'warning' ? '#f59e0b' : '#10b981'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.95rem' }}>
                      <span>{item.parameter}</span>
                      <span style={{ color: item.status === 'warning' ? '#b45309' : '#15803d' }}>{item.value}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>{item.note}</p>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: '#fffbe6', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ffe58f' }}>
                {analysis.disclaimer}
              </p>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc' }}>
              <FileText size={48} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
              <h3>Paste Lab Text & Click Analyze</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                The AI will extract biomarkers and explain high/low blood test parameters in plain language.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabAnalyzer;
