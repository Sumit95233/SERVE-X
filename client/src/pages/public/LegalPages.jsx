import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PrivacyPolicyPage = () => {
  const { isAuthenticated, user } = useAuth();
  const backPath = isAuthenticated
    ? user?.role === 'ngo'
      ? '/ngo/dashboard'
      : user?.role === 'admin'
      ? '/admin/dashboard'
      : '/donor/dashboard'
    : '/login';
  const backLabel = isAuthenticated ? 'Back to Dashboard' : 'Back to Sign In';

  return (
    <div className="min-h-screen bg-[#F7F9FC] py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="flex items-center justify-between">
          <Link
            to={backPath}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#07549A] hover:text-[#06457E] bg-white px-3.5 py-2 rounded-xl border border-[#DFE7F0] shadow-2xs hover:shadow-xs transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{backLabel}</span>
          </Link>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Serve-X Compliance Document
          </span>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E5EAF0] shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#E5EAF0]">
            <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] text-[#07549A] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#07549A]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101828]">Privacy Policy</h1>
              <p className="text-xs text-gray-500 mt-0.5">Last updated: October 2026</p>
            </div>
          </div>

          <div className="prose text-xs sm:text-sm text-[#475467] leading-relaxed space-y-4">
            <p>
              ServeX ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by ServeX.
            </p>

            <h3 className="text-base font-bold text-[#101828]">1. Donor Address Privacy Protection</h3>
            <p>
              When listing physical goods for donation, your exact residential address is stored securely and is never displayed publicly on search results or discovery feeds. It is only made accessible to an authorized verified NGO after you explicitly approve their claim request.
            </p>

            <h3 className="text-base font-bold text-[#101828]">2. Financial and Payment Security</h3>
            <p>
              All monetary contributions are processed through Razorpay. ServeX never receives, stores, or handles credit card numbers, CVVs, or UPI PINs on its servers.
            </p>

            <h3 className="text-base font-bold text-[#101828]">3. Section 80G Tax Records</h3>
            <p>
              To generate legally compliant Section 80G donation receipts, we record the donor's full name, email, and transaction reference. This information is shared exclusively with the receiving verified partner NGO.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TermsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const backPath = isAuthenticated
    ? user?.role === 'ngo'
      ? '/ngo/dashboard'
      : user?.role === 'admin'
      ? '/admin/dashboard'
      : '/donor/dashboard'
    : '/login';
  const backLabel = isAuthenticated ? 'Back to Dashboard' : 'Back to Sign In';

  return (
    <div className="min-h-screen bg-[#F7F9FC] py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="flex items-center justify-between">
          <Link
            to={backPath}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#07549A] hover:text-[#06457E] bg-white px-3.5 py-2 rounded-xl border border-[#DFE7F0] shadow-2xs hover:shadow-xs transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{backLabel}</span>
          </Link>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Serve-X Compliance Document
          </span>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E5EAF0] shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#E5EAF0]">
            <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] text-[#07549A] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-[#07549A]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101828]">Terms of Service</h1>
              <p className="text-xs text-gray-500 mt-0.5">Last updated: October 2026</p>
            </div>
          </div>

          <div className="prose text-xs sm:text-sm text-[#475467] leading-relaxed space-y-4">
            <p>
              Welcome to ServeX. By accessing or using our platform, you agree to be bound by these terms.
            </p>

            <h3 className="text-base font-bold text-[#101828]">1. NGO Eligibility & Verification</h3>
            <p>
              Only registered non-profit entities possessing valid government registration certificates may apply as NGO partners. Verification is subject to administrative due diligence and may be revoked if misrepresentation occurs.
            </p>

            <h3 className="text-base font-bold text-[#101828]">2. Item Donation Commitments</h3>
            <p>
              Donors listing physical items represent that listed items are in safe, usable condition. NGOs claiming items commit to picking them up during scheduled time slots and distributing them to declared beneficiaries without commercial resale.
            </p>

            <h3 className="text-base font-bold text-[#101828]">3. Monetary Donations</h3>
            <p>
              Contributions to active fundraising campaigns are irrevocable once executed, barring demonstrated payment fraud or unauthorized card use as handled through standard banking dispute protocols.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
