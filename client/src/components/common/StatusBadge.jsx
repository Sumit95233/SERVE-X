import React from 'react';

export const StatusBadge = ({ status }) => {
  const configs = {
    // Verification
    verified: { label: 'Verified', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    pending: { label: 'Pending Review', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    rejected: { label: 'Rejected', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    suspended: { label: 'Suspended', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },

    // Item Donation
    available: { label: 'Available', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    claim_requested: { label: 'Claim Requested', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    claimed: { label: 'Claimed', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    pickup_scheduled: { label: 'Pickup Scheduled', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    completed: { label: 'Completed', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    cancelled: { label: 'Cancelled', bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },

    // Payments
    successful: { label: 'Successful', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    failed: { label: 'Failed', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    initiated: { label: 'Initiated', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },

    // Urgency
    urgent: { label: 'Urgent Need', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    high: { label: 'High Urgency', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    medium: { label: 'Medium', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    low: { label: 'Low', bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' },

    // Campaigns
    active: { label: 'Active', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    pending_review: { label: 'Pending Review', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    paused: { label: 'Paused', bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
  };

  const config = configs[status] || {
    label: status ? status.replace('_', ' ') : 'Unknown',
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${config.bg} ${config.text} ${config.border}`}
    >
      {config.label}
    </span>
  );
};
