import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Services from './pages/public/Services';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientProfile from './pages/patient/PatientProfile';
import DigitalHealthId from './pages/patient/DigitalHealthId';
import FindDoctors from './pages/patient/FindDoctors';
import DoctorDetails from './pages/patient/DoctorDetails';
import BookAppointment from './pages/patient/BookAppointment';
import MyAppointments from './pages/patient/MyAppointments';
import MedicalRecords from './pages/patient/MedicalRecords';
import UploadReport from './pages/patient/UploadReport';
import Prescriptions from './pages/patient/Prescriptions';
import AiHealthAssistant from './pages/patient/AiHealthAssistant';
import Teleconsultation from './pages/patient/Teleconsultation';
import PatientNotifications from './pages/patient/PatientNotifications';
import EmergencySos from './pages/patient/EmergencySos';
import LabAnalyzer from './pages/patient/LabAnalyzer';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorProfile from './pages/doctor/DoctorProfile';
import PatientList from './pages/doctor/PatientList';
import PatientDetails from './pages/doctor/PatientDetails';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import Consultation from './pages/doctor/Consultation';
import CreatePrescription from './pages/doctor/CreatePrescription';
import DoctorNotifications from './pages/doctor/DoctorNotifications';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import PatientRegistry from './pages/admin/PatientRegistry';
import DoctorApprovals from './pages/admin/DoctorApprovals';
import AdminAppointments from './pages/admin/AdminAppointments';
import HealthReports from './pages/admin/HealthReports';
import PlatformAnalytics from './pages/admin/PlatformAnalytics';
import SystemAlerts from './pages/admin/SystemAlerts';

const AppLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0 }}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

const PublicLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Navbar />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
          <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
          <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />

          {/* Patient Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
            <Route path="/patient/dashboard" element={<AppLayout><PatientDashboard /></AppLayout>} />
            <Route path="/patient/profile" element={<AppLayout><PatientProfile /></AppLayout>} />
            <Route path="/patient/health-id" element={<AppLayout><DigitalHealthId /></AppLayout>} />
            <Route path="/patient/doctors" element={<AppLayout><FindDoctors /></AppLayout>} />
            <Route path="/patient/doctors/:id" element={<AppLayout><DoctorDetails /></AppLayout>} />
            <Route path="/patient/book/:doctorId" element={<AppLayout><BookAppointment /></AppLayout>} />
            <Route path="/patient/appointments" element={<AppLayout><MyAppointments /></AppLayout>} />
            <Route path="/patient/records" element={<AppLayout><MedicalRecords /></AppLayout>} />
            <Route path="/patient/upload-report" element={<AppLayout><UploadReport /></AppLayout>} />
            <Route path="/patient/prescriptions" element={<AppLayout><Prescriptions /></AppLayout>} />
            <Route path="/patient/ai-assistant" element={<AppLayout><AiHealthAssistant /></AppLayout>} />
            <Route path="/patient/teleconsult/:id" element={<AppLayout><Teleconsultation /></AppLayout>} />
            <Route path="/patient/emergency" element={<AppLayout><EmergencySos /></AppLayout>} />
            <Route path="/patient/lab-analyzer" element={<AppLayout><LabAnalyzer /></AppLayout>} />
            <Route path="/patient/notifications" element={<AppLayout><PatientNotifications /></AppLayout>} />
          </Route>

          {/* Doctor Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
            <Route path="/doctor/dashboard" element={<AppLayout><DoctorDashboard /></AppLayout>} />
            <Route path="/doctor/profile" element={<AppLayout><DoctorProfile /></AppLayout>} />
            <Route path="/doctor/patients" element={<AppLayout><PatientList /></AppLayout>} />
            <Route path="/doctor/patients/:id" element={<AppLayout><PatientDetails /></AppLayout>} />
            <Route path="/doctor/appointments" element={<AppLayout><DoctorAppointments /></AppLayout>} />
            <Route path="/doctor/consultation/:id" element={<AppLayout><Consultation /></AppLayout>} />
            <Route path="/doctor/prescriptions/new/:appointmentId" element={<AppLayout><CreatePrescription /></AppLayout>} />
            <Route path="/doctor/notifications" element={<AppLayout><DoctorNotifications /></AppLayout>} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AppLayout><AdminDashboard /></AppLayout>} />
            <Route path="/admin/patients" element={<AppLayout><PatientRegistry /></AppLayout>} />
            <Route path="/admin/doctors" element={<AppLayout><DoctorApprovals /></AppLayout>} />
            <Route path="/admin/appointments" element={<AppLayout><AdminAppointments /></AppLayout>} />
            <Route path="/admin/reports" element={<AppLayout><HealthReports /></AppLayout>} />
            <Route path="/admin/analytics" element={<AppLayout><PlatformAnalytics /></AppLayout>} />
            <Route path="/admin/notifications" element={<AppLayout><SystemAlerts /></AppLayout>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
