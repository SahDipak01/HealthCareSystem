import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, MapPin, Stethoscope, ArrowRight } from 'lucide-react';

const FindDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, [specialty]);

  const fetchDoctors = () => {
    setLoading(true);
    let url = `/api/doctors?specialty=${specialty}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setDoctors(Array.isArray(data) ? data : []);
      })
      .finally(() => setLoading(false));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Find Doctors & Specialists</h1>
        <p className="page-subtitle">Search verified medical consultants for in-clinic or virtual teleconsultation</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search doctor by name, clinic, or condition..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ width: '220px' }}>
            <select className="form-select" value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
              <option value="all">All Specialties</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Dermatology">Dermatology</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            <Search size={16} /> Search Doctors
          </button>
        </form>
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem' }}>Loading specialist physicians...</p>
      ) : doctors.length > 0 ? (
        <div className="grid-cols-3">
          {doctors.map((d) => (
            <div key={d.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                  <img
                    src={d.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256'}
                    alt={d.name}
                    style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-light)' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{d.name}</h3>
                    <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>{d.specialty}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#b45309', marginTop: '0.2rem' }}>
                      <Star size={14} fill="#f59e0b" stroke="#f59e0b" />
                      <span>{d.rating} ({d.review_count} consultations)</span>
                    </div>
                  </div>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                  <strong>Qualification:</strong> {d.qualification} ({d.experience} yrs exp)
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  <MapPin size={14} /> {d.clinic_name}, {d.city}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CONSULTATION FEE</span>
                  <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-dark)' }}>₹{d.fee}</p>
                </div>

                <Link to={`/patient/doctors/${d.id}`} className="btn btn-primary btn-sm">
                  View Profile <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Stethoscope size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3>No doctors found matching your query</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Try broadening your search term or select "All Specialties".</p>
        </div>
      )}
    </div>
  );
};

export default FindDoctors;
