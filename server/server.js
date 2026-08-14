import express from 'express';
import cors from 'cors';
import { initDb } from './db.js';

import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patients.js';
import doctorRoutes from './routes/doctors.js';
import appointmentRoutes from './routes/appointments.js';
import prescriptionRoutes from './routes/prescriptions.js';
import aiRoutes from './routes/ai.js';
import notificationRoutes from './routes/notifications.js';
import adminRoutes from './routes/admin.js';
import emergencyRoutes from './routes/emergency.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/emergency', emergencyRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SwasthyaConnect Backend API is running smoothly' });
});

// Initialize database and start server
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`SwasthyaConnect Backend API running on port ${PORT}`);
      console.log(`Health Check: http://localhost:${PORT}/api/health`);
      console.log(`====================================================`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
  });
