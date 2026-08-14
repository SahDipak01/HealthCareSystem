import sqlite3 from 'sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'swasthya.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SwasthyaConnect SQLite database.');
  }
});

// Helper for promise queries
export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

export const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export async function initDb() {
  // Create tables
  await dbRun(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('patient', 'doctor', 'admin')),
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      abha_id TEXT UNIQUE NOT NULL,
      dob TEXT,
      blood_group TEXT,
      height REAL,
      weight REAL,
      address TEXT,
      emergency_contact TEXT,
      allergies TEXT,
      pre_existing_conditions TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS doctors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      specialty TEXT NOT NULL,
      qualification TEXT,
      experience INTEGER,
      clinic_name TEXT,
      city TEXT,
      fee REAL,
      rating REAL DEFAULT 4.8,
      review_count INTEGER DEFAULT 24,
      avatar TEXT,
      bio TEXT,
      availability TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      doctor_id INTEGER NOT NULL,
      patient_name TEXT,
      doctor_name TEXT,
      doctor_specialty TEXT,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'completed', 'cancelled')),
      symptoms TEXT,
      consultation_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(patient_id) REFERENCES patients(id),
      FOREIGN KEY(doctor_id) REFERENCES doctors(id)
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS medical_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      record_type TEXT NOT NULL,
      doctor_name TEXT,
      date TEXT NOT NULL,
      file_url TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(patient_id) REFERENCES patients(id)
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS prescriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      appointment_id INTEGER,
      patient_id INTEGER NOT NULL,
      doctor_id INTEGER NOT NULL,
      patient_name TEXT,
      doctor_name TEXT,
      date TEXT NOT NULL,
      diagnosis TEXT NOT NULL,
      medicines_json TEXT NOT NULL,
      instructions TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(patient_id) REFERENCES patients(id),
      FOREIGN KEY(doctor_id) REFERENCES doctors(id)
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'info',
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS ai_assessments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      symptoms TEXT NOT NULL,
      risk_level TEXT NOT NULL CHECK(risk_level IN ('Low', 'Medium', 'High')),
      score INTEGER,
      summary TEXT,
      recommendations TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(patient_id) REFERENCES patients(id)
    )
  `);

  // Check if users exist before seeding
  const userCount = await dbGet(`SELECT COUNT(*) as count FROM users`);
  if (userCount.count === 0) {
    console.log('Seeding initial database content...');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Seed Accounts
    // Patient User
    const resP = await dbRun(
      `INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)`,
      ['Sarah Jenkins', 'patient@swasthya.com', hashedPassword, 'patient', '+91 98765 43210']
    );
    const patientUserId = resP.lastID;

    // Doctor User 1
    const resD1 = await dbRun(
      `INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)`,
      ['Dr. Olivia Vance', 'doctor@swasthya.com', hashedPassword, 'doctor', '+91 98765 11111']
    );
    const doctorUserId1 = resD1.lastID;

    // Doctor User 2
    const resD2 = await dbRun(
      `INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)`,
      ['Dr. Noah Sterling', 'sterling@swasthya.com', hashedPassword, 'doctor', '+91 98765 22222']
    );
    const doctorUserId2 = resD2.lastID;

    // Admin User
    await dbRun(
      `INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)`,
      ['Admin Officer Rajesh Kumar', 'admin@swasthya.com', hashedPassword, 'admin', '+91 98765 99999']
    );

    // 2. Seed Patient Details
    const resPatDetail = await dbRun(
      `INSERT INTO patients (user_id, abha_id, dob, blood_group, height, weight, address, emergency_contact, allergies, pre_existing_conditions)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patientUserId,
        '91-8492-3849-1029',
        '1995-04-12',
        'O+',
        168,
        62,
        'Flat 402, Green Valley Heights, New Delhi',
        '+91 98765 00000',
        'Penicillin, Peanuts (Mild)',
        'Mild Asthma'
      ]
    );
    const patientId = resPatDetail.lastID;

    // 3. Seed Doctor Details
    const resDocDetail1 = await dbRun(
      `INSERT INTO doctors (user_id, specialty, qualification, experience, clinic_name, city, fee, rating, review_count, avatar, bio, availability)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        doctorUserId1,
        'General Medicine & Endocrinology',
        'MBBS, MD (Internal Medicine), AIIMS',
        12,
        'CarePulse Super Speciality Clinic',
        'New Delhi',
        600,
        4.9,
        84,
        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256',
        'Senior consultant specializing in preventive care, diabetic management, and adult internal medicine.',
        'Mon-Sat (10:00 AM - 04:00 PM)'
      ]
    );
    const doctorId1 = resDocDetail1.lastID;

    const resDocDetail2 = await dbRun(
      `INSERT INTO doctors (user_id, specialty, qualification, experience, clinic_name, city, fee, rating, review_count, avatar, bio, availability)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        doctorUserId2,
        'Cardiology',
        'MBBS, MD, DM (Cardiology), Apollo Hospitals',
        16,
        'HeartCare Advanced Cardiac Center',
        'Mumbai',
        1200,
        5.0,
        142,
        'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=256',
        'Interventional cardiologist focusing on preventative cardiology, hypertension management, and ECG diagnostic analysis.',
        'Mon-Fri (11:00 AM - 05:00 PM)'
      ]
    );
    const doctorId2 = resDocDetail2.lastID;

    // 4. Seed Appointments
    const resA1 = await dbRun(
      `INSERT INTO appointments (patient_id, doctor_id, patient_name, doctor_name, doctor_specialty, date, time, status, symptoms, consultation_notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patientId,
        doctorId1,
        'Sarah Jenkins',
        'Dr. Olivia Vance',
        'General Medicine',
        '2026-08-18',
        '10:30 AM',
        'approved',
        'Mild persistent fever, throat congestion, and muscle aches for 2 days.',
        'Patient reports onset 48 hours ago. Advised complete blood workup and rest.'
      ]
    );

    await dbRun(
      `INSERT INTO appointments (patient_id, doctor_id, patient_name, doctor_name, doctor_specialty, date, time, status, symptoms, consultation_notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patientId,
        doctorId2,
        'Sarah Jenkins',
        'Dr. Noah Sterling',
        'Cardiology',
        '2026-08-22',
        '02:00 PM',
        'pending',
        'Routine cardiovascular screening and lipid profile evaluation.',
        ''
      ]
    );

    const resA3 = await dbRun(
      `INSERT INTO appointments (patient_id, doctor_id, patient_name, doctor_name, doctor_specialty, date, time, status, symptoms, consultation_notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patientId,
        doctorId1,
        'Sarah Jenkins',
        'Dr. Olivia Vance',
        'General Medicine',
        '2026-07-10',
        '11:00 AM',
        'completed',
        'Seasonal allergic rhinitis and nasal blockage.',
        'Prescribed anti-histamines. Symptoms resolved.'
      ]
    );

    // 5. Seed Medical Records
    await dbRun(
      `INSERT INTO medical_records (patient_id, title, record_type, doctor_name, date, file_url, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        patientId,
        'Complete Blood Count & Biometric Panel',
        'Lab Report',
        'Dr. Olivia Vance',
        '2026-07-11',
        'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        'Normal Hemoglobin (13.5 g/dL), WBC count within healthy threshold.'
      ]
    );

    await dbRun(
      `INSERT INTO medical_records (patient_id, title, record_type, doctor_name, date, file_url, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        patientId,
        'Electrocardiogram (ECG) Baseline Scan',
        'Diagnostic Scan',
        'Dr. Noah Sterling',
        '2026-06-05',
        'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        'Normal sinus rhythm. Heart rate 74 bpm. No ischemic changes.'
      ]
    );

    // 6. Seed Digital Prescription
    const medicines = JSON.stringify([
      { name: 'Paracetamol 650mg', dosage: '1 tablet thrice daily after meals', duration: '5 days' },
      { name: 'Cetirizine 10mg', dosage: '1 tablet daily at bedtime', duration: '5 days' },
      { name: 'Vitamin C 500mg', dosage: '1 chewable tablet morning', duration: '10 days' }
    ]);

    await dbRun(
      `INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, patient_name, doctor_name, date, diagnosis, medicines_json, instructions)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        resA3.lastID,
        patientId,
        doctorId1,
        'Sarah Jenkins',
        'Dr. Olivia Vance',
        '2026-07-10',
        'Upper Respiratory Tract Infection (Viral)',
        medicines,
        'Drink plenty of warm fluids. Avoid cold beverages and steam inhalation recommended twice daily.'
      ]
    );

    // 7. Seed Notifications
    await dbRun(
      `INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)`,
      [
        patientUserId,
        'Appointment Approved',
        'Your appointment with Dr. Olivia Vance for Aug 18 at 10:30 AM has been confirmed.',
        'success'
      ]
    );

    await dbRun(
      `INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)`,
      [
        patientUserId,
        'ABHA Health ID Generated',
        'Your official Digital Health Card (#91-8492-3849-1029) is now linked to your SwasthyaConnect profile.',
        'info'
      ]
    );

    // 8. Seed AI Risk Assessment
    await dbRun(
      `INSERT INTO ai_assessments (patient_id, symptoms, risk_level, score, summary, recommendations)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        patientId,
        'Fever, Cough, Mild shortness of breath',
        'Medium',
        65,
        'Symptoms indicate moderate respiratory irritation requiring clinical evaluation.',
        'Schedule a virtual or in-person consultation with a General Physician. Monitor SpO2 levels.'
      ]
    );

    console.log('Database seeding finished successfully.');
  }
}

export default db;
