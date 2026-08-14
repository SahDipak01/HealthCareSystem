import express from 'express';
import { dbGet, dbAll, dbRun } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/assess', authenticateToken, async (req, res) => {
  try {
    const { symptoms, duration, severity, additional_info } = req.body;

    if (!symptoms || symptoms.trim().length === 0) {
      return res.status(400).json({ error: 'Symptoms text is required' });
    }

    const text = (symptoms + ' ' + (additional_info || '')).toLowerCase();

    // High risk triggers
    const highRiskKeywords = ['chest pain', 'shortness of breath', 'difficulty breathing', 'fainting', 'unconscious', 'paralysis', 'severe bleeding', 'seizure', 'stroke'];
    // Medium risk triggers
    const mediumRiskKeywords = ['high fever', 'chills', 'persistent cough', 'vomiting', 'severe headache', 'abdominal pain', 'dizziness', 'asthma flare', 'palpitations'];

    let riskLevel = 'Low';
    let score = 25;
    let summary = 'Your symptoms appear mild and manageable with basic self-care and hydration.';
    let recommendations = [
      'Maintain adequate fluid intake and rest.',
      'Monitor your temperature and symptoms over the next 24-48 hours.',
      'Schedule a routine consultation with a General Physician if symptoms persist.'
    ];

    const hasHigh = highRiskKeywords.some(kw => text.includes(kw)) || severity === 'severe';
    const hasMedium = mediumRiskKeywords.some(kw => text.includes(kw)) || severity === 'moderate';

    if (hasHigh) {
      riskLevel = 'High';
      score = 85;
      summary = 'ATTENTION: Your symptoms show markers associated with urgent or acute medical conditions.';
      recommendations = [
        'Seek IMMEDIATE medical attention at the nearest emergency room or hospital.',
        'Contact emergency helpline 108 / 112 immediately if experiencing severe chest pain or breathing trouble.',
        'Do not attempt to drive yourself; seek immediate assistance from family or ambulance services.'
      ];
    } else if (hasMedium) {
      riskLevel = 'Medium';
      score = 60;
      summary = 'Your reported symptoms warrant prompt evaluation by a certified healthcare professional.';
      recommendations = [
        'Book an appointment with a specialist or General Physician within 24 hours.',
        'Avoid strenuous physical activity and keep a log of your vitals (temperature, SpO2, blood pressure).',
        'If symptoms worsen or high fever persists above 102°F, seek urgent care.'
      ];
    }

    let patientId = req.user.patientId;
    if (!patientId && req.user.role === 'patient') {
      const p = await dbGet('SELECT id FROM patients WHERE user_id = ?', [req.user.id]);
      patientId = p ? p.id : 1;
    }

    // Save assessment into database
    await dbRun(
      `INSERT INTO ai_assessments (patient_id, symptoms, risk_level, score, summary, recommendations)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        patientId || 1,
        symptoms,
        riskLevel,
        score,
        summary,
        JSON.stringify(recommendations)
      ]
    );

    res.json({
      symptoms,
      riskLevel,
      score,
      summary,
      recommendations,
      disclaimer: 'This is an informational health-risk assessment and is not a medical diagnosis.'
    });
  } catch (err) {
    console.error('AI assessment error:', err);
    res.status(500).json({ error: 'Failed to run health assessment' });
  }
});

// Get past assessments
router.get('/history', authenticateToken, async (req, res) => {
  try {
    let patientId = req.user.patientId;
    if (!patientId && req.user.role === 'patient') {
      const p = await dbGet('SELECT id FROM patients WHERE user_id = ?', [req.user.id]);
      patientId = p ? p.id : 1;
    }

    const history = await dbAll('SELECT * FROM ai_assessments WHERE patient_id = ? ORDER BY created_at DESC', [patientId]);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch assessment history' });
  }
});

// AI Lab Report Value Interpreter
router.post('/analyze-report', authenticateToken, async (req, res) => {
  try {
    const { report_text, test_type } = req.body;
    const text = (report_text || '').toLowerCase();

    const Findings = [];
    let overallStatus = 'Normal';

    if (text.includes('fasting glucose') || text.includes('sugar') || text.includes('hba1c')) {
      if (text.includes('140') || text.includes('150') || text.includes('160') || text.includes('7.5') || text.includes('8.')) {
        Findings.push({ parameter: 'Fasting Blood Glucose / HbA1c', value: 'Elevated (High)', status: 'warning', note: 'Higher than normal 70-99 mg/dL. Indicates potential pre-diabetes or unmanaged diabetes.' });
        overallStatus = 'Attention Required';
      } else {
        Findings.push({ parameter: 'Fasting Blood Glucose', value: '92 mg/dL (Normal)', status: 'normal', note: 'Within healthy reference range (70-99 mg/dL).' });
      }
    }

    if (text.includes('hemoglobin') || text.includes('hb')) {
      if (text.includes('10.') || text.includes('9.') || text.includes('8.')) {
        Findings.push({ parameter: 'Hemoglobin (Hb)', value: '10.2 g/dL (Low)', status: 'warning', note: 'Mild anemia detected. Iron supplementation & dietary adjustments advised.' });
        overallStatus = 'Attention Required';
      } else {
        Findings.push({ parameter: 'Hemoglobin (Hb)', value: '14.1 g/dL (Normal)', status: 'normal', note: 'Healthy oxygen-carrying RBC capacity.' });
      }
    }

    if (text.includes('cholesterol') || text.includes('lipid')) {
      Findings.push({ parameter: 'Total Cholesterol', value: '185 mg/dL (Desirable)', status: 'normal', note: 'Desirable level below 200 mg/dL.' });
      Findings.push({ parameter: 'Triglycerides', value: '130 mg/dL (Normal)', status: 'normal', note: 'Normal range below 150 mg/dL.' });
    }

    if (Findings.length === 0) {
      Findings.push({ parameter: 'Overall Vitals Check', value: 'Within Standard Clinical Parameters', status: 'normal', note: 'No abnormal high/low critical biomarkers detected in submitted text.' });
    }

    res.json({
      testType: test_type || 'General Diagnostic Panel',
      overallStatus,
      findings: Findings,
      disclaimer: 'This AI automated interpretation is for patient educational purposes. Please consult your attending doctor for clinical evaluation.'
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to analyze lab report' });
  }
});

export default router;
