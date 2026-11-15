import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  FileText,
  Lock,
  CreditCard,
  Award,
  Activity,
  Building2,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  Shield,
  FileCheck,
} from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-b from-[#F0F5FA] via-[#E8F0F8] to-[#F5F8FC] py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to={backPath}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#07549A] hover:text-white bg-white hover:bg-[#07549A] px-4 py-2.5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer active:scale-95 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>{backLabel}</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-bold shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Active Compliance 2026</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#07549A] border border-blue-200 rounded-full text-[11px] font-bold shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#07549A]" />
              <span>ISO & 80G Certified</span>
            </span>
          </div>
        </div>

        {/* Master Policy Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-[28px] sm:rounded-[36px] border border-slate-200/80 shadow-[0_20px_50px_rgba(16,42,67,0.08),0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden transition-all">
          {/* Top Brand Accent Stripe */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#00B98B] via-[#07549A] to-[#6D3FC0]" />

          {/* Hero Header */}
          <div className="p-6 sm:p-10 border-b border-slate-100 bg-gradient-to-b from-slate-50/70 to-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#07549A] to-[#00B98B] text-white flex items-center justify-center shadow-lg shadow-[#07549A]/20 ring-4 ring-[#00B98B]/10 shrink-0">
                  <ShieldCheck className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#00B98B] uppercase tracking-wider">
                      SERVE-X TRUST & SAFETY
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] text-slate-500 font-medium">Doc Ref: SRVX-PRIV-2026</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#102A43] tracking-tight mt-0.5">
                    Privacy Policy
                  </h1>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:self-center">
                <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200">
                  Last Updated: Oct 2026
                </span>
                <span className="px-3 py-1.5 bg-[#EAF3FF] text-[#07549A] rounded-xl text-xs font-bold border border-[#BFDBFE]">
                  256-Bit SSL
                </span>
              </div>
            </div>

            {/* Preamble Callout */}
            <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#F0FDF4] via-[#F8FAFC] to-[#EFF6FF] border border-[#BFDBFE]/60 text-xs sm:text-sm text-[#334155] leading-relaxed flex items-start gap-3 shadow-2xs">
              <Sparkles className="w-5 h-5 text-[#00B98B] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#102A43] font-bold">Our Commitment:</strong> ServeX ("we", "our", or "us") is dedicated to complete donor privacy and non-profit transparency. We guarantee that donor residential addresses, banking credentials, and personal records are rigorously safeguarded under Indian IT Act and global data protection guidelines.
              </div>
            </div>
          </div>

          {/* Structured Policy Modules */}
          <div className="p-6 sm:p-10 space-y-6">
            {/* Section 1 */}
            <div className="p-6 rounded-2xl bg-[#F8FAFD] hover:bg-white border border-[#E2E8F0] hover:border-[#07549A]/30 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-start gap-3.5 mb-3">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#07549A] to-[#0A66C2] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  01
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#102A43] group-hover:text-[#07549A] transition-colors">
                    Donor Address Privacy Protection
                  </h2>
                  <p className="text-xs text-[#64748B] mt-0.5">Physical item listings and doorstep pickup security</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed pl-11">
                When listing physical goods (clothes, food ration kits, medical equipment, or school supplies) for donation, your exact residential address is stored securely in encrypted databases and is <strong>never displayed publicly</strong> on discovery search feeds or public pages. It is only shared with an authorized, verified partner NGO after you review and approve their claim request.
              </p>
              <div className="mt-4 ml-11 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/90 text-xs text-emerald-900 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Public Exposure: Your address is never indexed on Google or visible to unverified visitors.</span>
              </div>
            </div>

            {/* Section 2 */}
            <div className="p-6 rounded-2xl bg-[#F8FAFD] hover:bg-white border border-[#E2E8F0] hover:border-[#00B98B]/40 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-start gap-3.5 mb-3">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00B98B] to-[#059669] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  02
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#102A43] group-hover:text-[#00B98B] transition-colors">
                    Financial and Payment Security
                  </h2>
                  <p className="text-xs text-[#64748B] mt-0.5">End-to-end encrypted monetary transactions</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed pl-11">
                All monetary contributions on Serve-X are processed through Razorpay's PCI-DSS Level 1 certified banking vault. Serve-X <strong>never receives, handles, or stores</strong> complete debit/credit card numbers, CVVs, or UPI PINs on our servers. All transaction flows are secured via 256-bit TLS encryption.
              </p>
              <div className="mt-4 ml-11 p-3 rounded-xl bg-blue-50/80 border border-blue-200/90 text-xs text-[#07549A] font-semibold flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#07549A] shrink-0" />
                <span>Bank-Grade Escrow: Payments flow straight through regulated payment gateways with automated receipts.</span>
              </div>
            </div>

            {/* Section 3 */}
            <div className="p-6 rounded-2xl bg-[#F8FAFD] hover:bg-white border border-[#E2E8F0] hover:border-[#6D3FC0]/40 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-start gap-3.5 mb-3">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6D3FC0] to-[#5B21B6] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  03
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#102A43] group-hover:text-[#6D3FC0] transition-colors">
                    Section 80G Tax Exemption Records
                  </h2>
                  <p className="text-xs text-[#64748B] mt-0.5">Legally compliant tax receipt generation</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed pl-11">
                To generate legally compliant Section 80G tax exemption certificates under the Indian Income Tax Act, we record the donor's full name, registered email address, transaction reference, and PAN (if supplied). This audit information is transmitted exclusively to the receiving verified NGO for government compliance filing.
              </p>
              <div className="mt-4 ml-11 p-3 rounded-xl bg-purple-50/80 border border-purple-200/90 text-xs text-purple-900 font-semibold flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Instant Tax Receipts: Download digitally signed 80G certificates immediately post-contribution.</span>
              </div>
            </div>

            {/* Section 4 */}
            <div className="p-6 rounded-2xl bg-[#F8FAFD] hover:bg-white border border-[#E2E8F0] hover:border-[#0284C7]/40 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-start gap-3.5 mb-3">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0284C7] to-[#0369A1] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  04
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#102A43] group-hover:text-[#0284C7] transition-colors">
                    Transparent Audit Logs & Public Accountability
                  </h2>
                  <p className="text-xs text-[#64748B] mt-0.5">Grassroots verification without exposing personal identities</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed pl-11">
                Every verified contribution creates an immutable audit trail on the Serve-X ledger. Public leaderboards and impact stats report only generalized summaries or chosen display names. Your confidential phone numbers and residential locations are never marketed or sold to third-party commercial brokers.
              </p>
              <div className="mt-4 ml-11 p-3 rounded-xl bg-sky-50/80 border border-sky-200/90 text-xs text-sky-900 font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-600 shrink-0" />
                <span>No Spam, No Telemarketing: We strictly do not sell, rent, or trade your contact info.</span>
              </div>
            </div>
          </div>

          {/* Bottom Trust Seal & Return Button */}
          <div className="p-6 sm:p-8 bg-slate-50/90 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 text-center sm:text-left">
              Questions regarding data privacy? Contact: <a href="mailto:sumitrajslm2018@gmail.com" className="font-bold text-[#07549A] hover:underline">sumitrajslm2018@gmail.com</a>
            </div>

            <Link
              to={backPath}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#07549A] to-[#00B98B] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{backLabel}</span>
            </Link>
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
    <div className="min-h-screen bg-gradient-to-b from-[#F0F5FA] via-[#E8F0F8] to-[#F5F8FC] py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to={backPath}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#07549A] hover:text-white bg-white hover:bg-[#07549A] px-4 py-2.5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer active:scale-95 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>{backLabel}</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-bold shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Terms of Service 2026</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#07549A] border border-blue-200 rounded-full text-[11px] font-bold shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-[#07549A]" />
              <span>NITI Aayog Registered</span>
            </span>
          </div>
        </div>

        {/* Master Terms Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-[28px] sm:rounded-[36px] border border-slate-200/80 shadow-[0_20px_50px_rgba(16,42,67,0.08),0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden transition-all">
          {/* Top Brand Accent Stripe */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#00B98B] via-[#07549A] to-[#6D3FC0]" />

          {/* Hero Header */}
          <div className="p-6 sm:p-10 border-b border-slate-100 bg-gradient-to-b from-slate-50/70 to-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#07549A] to-[#00B98B] text-white flex items-center justify-center shadow-lg shadow-[#07549A]/20 ring-4 ring-[#00B98B]/10 shrink-0">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#00B98B] uppercase tracking-wider">
                      SERVE-X PLATFORM CHARTER
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] text-slate-500 font-medium">Doc Ref: SRVX-TERMS-2026</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#102A43] tracking-tight mt-0.5">
                    Terms of Service
                  </h1>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:self-center">
                <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200">
                  Effective: Oct 2026
                </span>
                <span className="px-3 py-1.5 bg-[#ECFDF5] text-[#059669] rounded-xl text-xs font-bold border border-[#A7F3D0]">
                  Verified Non-Profit
                </span>
              </div>
            </div>

            {/* Preamble Callout */}
            <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#F0FDF4] via-[#F8FAFC] to-[#EFF6FF] border border-[#BFDBFE]/60 text-xs sm:text-sm text-[#334155] leading-relaxed flex items-start gap-3 shadow-2xs">
              <Sparkles className="w-5 h-5 text-[#00B98B] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#102A43] font-bold">Welcome to ServeX:</strong> By accessing or using the Serve-X platform, mobile web portals, and donation pipelines, you agree to be bound by these Terms of Service. These rules ensure that all relief materials and monetary donations reach verified, genuine grassroots recipients across India.
              </div>
            </div>
          </div>

          {/* Structured Terms Modules */}
          <div className="p-6 sm:p-10 space-y-6">
            {/* Section 1 */}
            <div className="p-6 rounded-2xl bg-[#F8FAFD] hover:bg-white border border-[#E2E8F0] hover:border-[#07549A]/30 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-start gap-3.5 mb-3">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#07549A] to-[#0A66C2] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  01
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#102A43] group-hover:text-[#07549A] transition-colors">
                    NGO Partner Eligibility & Verification
                  </h2>
                  <p className="text-xs text-[#64748B] mt-0.5">Government registration compliance criteria</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed pl-11">
                Only registered non-profit organizations (Trusts, Societies, Section 8 companies) possessing valid government documentation and NITI Aayog Darpan credentials may register as verified NGO partners. All onboarding applications are subject to administrative scrutiny. Registration is revoked immediately if misrepresentation occurs.
              </p>
              <div className="mt-4 ml-11 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/90 text-xs text-emerald-900 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Mandatory Due Diligence: 100% of NGO organizations are verified by human administrators before campaign launch.</span>
              </div>
            </div>

            {/* Section 2 */}
            <div className="p-6 rounded-2xl bg-[#F8FAFD] hover:bg-white border border-[#E2E8F0] hover:border-[#00B98B]/40 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-start gap-3.5 mb-3">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00B98B] to-[#059669] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  02
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#102A43] group-hover:text-[#00B98B] transition-colors">
                    Item Donation Commitments & Logistics
                  </h2>
                  <p className="text-xs text-[#64748B] mt-0.5">Donation quality standards & safe handover protocol</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed pl-11">
                Donors listing physical items represent that all goods are clean, safe, and in usable condition. Verified NGOs claiming item donations commit to coordinating pick-ups during mutually confirmed time slots and distributing them strictly to verified beneficiaries with zero commercial re-sale.
              </p>
              <div className="mt-4 ml-11 p-3 rounded-xl bg-blue-50/80 border border-blue-200/90 text-xs text-[#07549A] font-semibold flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-[#07549A] shrink-0" />
                <span>Zero Resale Mandate: Relief supplies cannot be monetized, resold, or diverted from the needy.</span>
              </div>
            </div>

            {/* Section 3 */}
            <div className="p-6 rounded-2xl bg-[#F8FAFD] hover:bg-white border border-[#E2E8F0] hover:border-[#6D3FC0]/40 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-start gap-3.5 mb-3">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6D3FC0] to-[#5B21B6] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  03
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#102A43] group-hover:text-[#6D3FC0] transition-colors">
                    Monetary Donations & Escrow Transparency
                  </h2>
                  <p className="text-xs text-[#64748B] mt-0.5">Direct campaign allocation & Section 80G issuance</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed pl-11">
                Online contributions are processed via secure payment gateways and allocated directly toward designated fundraisers. Every monetary gift produces a verified electronic receipt with Section 80G tax exemption details. Once funds are disbursed, cancellations are restricted to demonstrated payment fraud or unauthorized card use.
              </p>
              <div className="mt-4 ml-11 p-3 rounded-xl bg-purple-50/80 border border-purple-200/90 text-xs text-purple-900 font-semibold flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600 shrink-0" />
                <span>100% Direct Allocation: Funds directly credit NGO beneficiary accounts for documented medical and relief supplies.</span>
              </div>
            </div>

            {/* Section 4 */}
            <div className="p-6 rounded-2xl bg-[#F8FAFD] hover:bg-white border border-[#E2E8F0] hover:border-[#DC2626]/40 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-start gap-3.5 mb-3">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#DC2626] to-[#B91C1C] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  04
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#102A43] group-hover:text-[#DC2626] transition-colors">
                    Platform Integrity & Strict Zero-Tolerance Policy
                  </h2>
                  <p className="text-xs text-[#64748B] mt-0.5">Anti-fraud protocols and account termination</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed pl-11">
                Serve-X reserves the right to immediately suspend accounts, cancel pending disbursement orders, and refer criminal fraud to appropriate law enforcement agencies if any party engages in money laundering, forged documentation, or abusive behavior toward ground volunteers.
              </p>
              <div className="mt-4 ml-11 p-3 rounded-xl bg-rose-50/80 border border-rose-200/90 text-xs text-rose-900 font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Zero Tolerance for Fraud: Audited daily by automated checks and ground coordinator feedback.</span>
              </div>
            </div>
          </div>

          {/* Bottom Trust Seal & Return Button */}
          <div className="p-6 sm:p-8 bg-slate-50/90 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 text-center sm:text-left">
              Questions regarding user terms? Contact: <a href="mailto:sumitrajslm2018@gmail.com" className="font-bold text-[#07549A] hover:underline">sumitrajslm2018@gmail.com</a>
            </div>

            <Link
              to={backPath}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#07549A] to-[#00B98B] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{backLabel}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
