import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, User, CreditCard, Search, Calendar, FileText, Upload, Pill,
  Bot, Video, Bell, Users, Stethoscope, FilePlus, BarChart3, ShieldCheck, ClipboardList
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      {user.role === 'patient' && (
        <>
          <div className="sidebar-title">Patient Portal</div>
          <Link to="/patient/dashboard" className={`sidebar-link ${isActive('/patient/dashboard') ? 'active' : ''}`}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link to="/patient/health-id" className={`sidebar-link ${isActive('/patient/health-id') ? 'active' : ''}`}>
            <CreditCard size={18} /> Digital Health ID (ABHA)
          </Link>
          <Link to="/patient/doctors" className={`sidebar-link ${isActive('/patient/doctors') ? 'active' : ''}`}>
            <Search size={18} /> Find Doctors
          </Link>
          <Link to="/patient/appointments" className={`sidebar-link ${isActive('/patient/appointments') ? 'active' : ''}`}>
            <Calendar size={18} /> My Appointments
          </Link>
          <Link to="/patient/records" className={`sidebar-link ${isActive('/patient/records') ? 'active' : ''}`}>
            <FileText size={18} /> Medical Records
          </Link>
          <Link to="/patient/upload-report" className={`sidebar-link ${isActive('/patient/upload-report') ? 'active' : ''}`}>
            <Upload size={18} /> Upload Report
          </Link>
          <Link to="/patient/prescriptions" className={`sidebar-link ${isActive('/patient/prescriptions') ? 'active' : ''}`}>
            <Pill size={18} /> Digital Prescriptions
          </Link>

          <div className="sidebar-title" style={{ marginTop: '1rem', color: '#ef4444' }}>Emergency & AI Tools</div>
          <Link to="/patient/emergency" className={`sidebar-link ${isActive('/patient/emergency') ? 'active' : ''}`} style={{ color: '#ef4444', fontWeight: 'bold' }}>
            <ShieldAlert size={18} /> 🚨 1-Click SOS Emergency
          </Link>
          <Link to="/patient/ai-assistant" className={`sidebar-link ${isActive('/patient/ai-assistant') ? 'active' : ''}`}>
            <Bot size={18} /> AI Health Assistant
          </Link>
          <Link to="/patient/lab-analyzer" className={`sidebar-link ${isActive('/patient/lab-analyzer') ? 'active' : ''}`}>
            <FileText size={18} /> AI Lab Report Interpreter
          </Link>
          <Link to="/patient/notifications" className={`sidebar-link ${isActive('/patient/notifications') ? 'active' : ''}`}>
            <Bell size={18} /> Notifications
          </Link>
          <Link to="/patient/profile" className={`sidebar-link ${isActive('/patient/profile') ? 'active' : ''}`}>
            <User size={18} /> My Profile
          </Link>
        </>
      )}

      {user.role === 'doctor' && (
        <>
          <div className="sidebar-title">Doctor Portal</div>
          <Link to="/doctor/dashboard" className={`sidebar-link ${isActive('/doctor/dashboard') ? 'active' : ''}`}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link to="/doctor/appointments" className={`sidebar-link ${isActive('/doctor/appointments') ? 'active' : ''}`}>
            <Calendar size={18} /> Appointments Schedule
          </Link>
          <Link to="/doctor/patients" className={`sidebar-link ${isActive('/doctor/patients') ? 'active' : ''}`}>
            <Users size={18} /> Patient Directory
          </Link>
          <Link to="/doctor/notifications" className={`sidebar-link ${isActive('/doctor/notifications') ? 'active' : ''}`}>
            <Bell size={18} /> Notifications
          </Link>
          <Link to="/doctor/profile" className={`sidebar-link ${isActive('/doctor/profile') ? 'active' : ''}`}>
            <User size={18} /> Doctor Profile
          </Link>
        </>
      )}

      {user.role === 'admin' && (
        <>
          <div className="sidebar-title">Government & Admin</div>
          <Link to="/admin/dashboard" className={`sidebar-link ${isActive('/admin/dashboard') ? 'active' : ''}`}>
            <LayoutDashboard size={18} /> Admin Dashboard
          </Link>
          <Link to="/admin/patients" className={`sidebar-link ${isActive('/admin/patients') ? 'active' : ''}`}>
            <Users size={18} /> Patient Registry
          </Link>
          <Link to="/admin/doctors" className={`sidebar-link ${isActive('/admin/doctors') ? 'active' : ''}`}>
            <Stethoscope size={18} /> Doctor Management
          </Link>
          <Link to="/admin/appointments" className={`sidebar-link ${isActive('/admin/appointments') ? 'active' : ''}`}>
            <ClipboardList size={18} /> All Appointments
          </Link>
          <Link to="/admin/reports" className={`sidebar-link ${isActive('/admin/reports') ? 'active' : ''}`}>
            <FileText size={18} /> Health Reports
          </Link>
          <Link to="/admin/analytics" className={`sidebar-link ${isActive('/admin/analytics') ? 'active' : ''}`}>
            <BarChart3 size={18} /> Platform Analytics
          </Link>
          <Link to="/admin/notifications" className={`sidebar-link ${isActive('/admin/notifications') ? 'active' : ''}`}>
            <Bell size={18} /> System Alerts
          </Link>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
