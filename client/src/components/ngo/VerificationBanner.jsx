import React from 'react';
import { ShieldCheck, Clock, AlertTriangle } from 'lucide-react';

export const VerificationBanner = ({ ngo }) => {
  if (!ngo) return null;

  if (ngo.verificationStatus === 'verified') {
    return (
      <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
            Verified NGO Partner
          </h4>
          <p className="text-xs text-emerald-800">
            {ngo.organizationName} is officially verified. You can launch fundraising campaigns and claim donor items.
          </p>
        </div>
      </div>
    );
  }

  if (ngo.verificationStatus === 'pending') {
    return (
      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
            Application Under Review
          </h4>
          <p className="text-xs text-amber-800">
            Your NGO registration is awaiting administrator verification. Publishing public campaigns and claiming listings will unlock upon approval.
          </p>
        </div>
      </div>
    );
  }

  if (ngo.verificationStatus === 'rejected') {
    return (
      <div className="mb-6 bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wide">
            Application Rejected
          </h4>
          <p className="text-xs text-rose-800">
            Reason: {ngo.rejectionReason || 'Please contact administration to update your documentation.'}
          </p>
        </div>
      </div>
    );
  }

  return null;
};
