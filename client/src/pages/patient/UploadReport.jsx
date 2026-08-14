import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';

const UploadReport = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [recordType, setRecordType] = useState('Lab Report');
  const [doctorName, setDoctorName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/patients/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          record_type: recordType,
          doctor_name: doctorName,
          date,
          description,
          file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
        })
      });

      if (!res.ok) throw new Error('Failed to upload report');

      setSuccess('Medical report successfully uploaded to your ABHA vault!');
      setTimeout(() => navigate('/patient/records'), 1500);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content" style={{ maxWidth: '700px' }}>
      <div className="page-header">
        <h1 className="page-title">Upload Medical Report</h1>
        <p className="page-subtitle">Attach diagnostic scans, blood test results, or hospital discharge summaries</p>
      </div>

      <div className="card">
        {success && (
          <div style={{ background: '#dcfce7', color: '#15803d', padding: '1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <CheckCircle2 size={18} /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Report Title</label>
            <input type="text" className="form-input" placeholder="e.g. Thyroid Panel & Lipid Profile Scan" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Record Type Category</label>
              <select className="form-select" value={recordType} onChange={(e) => setRecordType(e.target.value)}>
                <option value="Lab Report">Lab Report</option>
                <option value="Diagnostic Scan (ECG/MRI/X-Ray)">Diagnostic Scan (ECG/MRI/X-Ray)</option>
                <option value="Hospital Discharge Summary">Hospital Discharge Summary</option>
                <option value="Vaccination Certificate">Vaccination Certificate</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Test Date</label>
              <input type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Attending Doctor / Diagnostic Lab Name</label>
            <input type="text" className="form-input" placeholder="e.g. Dr. Olivia Vance / SRL Diagnostics" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} />
          </div>

          {/* Drag and Drop File Upload Placeholder */}
          <div className="form-group">
            <label className="form-label">Attach File (PDF, PNG, JPG)</label>
            <div style={{ border: '2px dashed var(--primary)', background: 'var(--primary-light)', padding: '2rem', borderRadius: '12px', textAlign: 'center', cursor: 'pointer' }}>
              <Upload size={36} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
              <p style={{ fontWeight: '600', color: 'var(--primary-hover)' }}>Click or Drag PDF Document File Here</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Supported formats: PDF, PNG, JPEG up to 25 MB</p>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Brief Clinical Summary Notes</label>
            <textarea className="form-textarea" rows="3" placeholder="Enter any key observations or doctor notes..." value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} disabled={loading}>
            {loading ? 'Uploading File...' : 'Save & Link to Digital Health ID'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadReport;
