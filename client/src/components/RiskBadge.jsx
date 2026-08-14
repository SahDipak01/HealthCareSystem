import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export const RiskBadge = ({ riskLevel }) => {
  if (riskLevel === 'High') {
    return (
      <span className="badge badge-high">
        <ShieldAlert size={14} /> High Risk Assessment
      </span>
    );
  }
  if (riskLevel === 'Medium') {
    return (
      <span className="badge badge-medium">
        <AlertTriangle size={14} /> Medium Risk
      </span>
    );
  }
  return (
    <span className="badge badge-low">
      <CheckCircle2 size={14} /> Low Risk
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const s = status ? status.toLowerCase() : 'pending';
  if (s === 'approved') return <span className="badge badge-approved">Confirmed / Scheduled</span>;
  if (s === 'completed') return <span className="badge badge-completed">Completed</span>;
  if (s === 'cancelled') return <span className="badge badge-cancelled">Cancelled</span>;
  return <span className="badge badge-pending">Pending Approval</span>;
};
