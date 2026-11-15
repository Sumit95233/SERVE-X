import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  FileText,
  Lock,
  Printer,
  Scale,
  Building2,
  CheckCircle2,
  Clock,
  Mail,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  EyeOff,
  CreditCard,
  Receipt,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  HelpCircle,
  Copy,
  Check,
  MapPin,
  Phone,
  FileCheck,
  Share2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// ============================================================================
// PRIVACY POLICY PAGE
// ============================================================================
export const PrivacyPolicyPage = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const backPath = isAuthenticated
    ? user?.role === 'ngo'
      ? '/ngo/dashboard'
      : user?.role === 'admin'
      ? '/admin/dashboard'
      : '/donor/dashboard'
    : '/login';
  const backLabel = isAuthenticated ? 'Back to Dashboard' : 'Back to Sign In';

  const [activeToc, setActiveToc] = useState('summary');
  const [copiedLink, setCopiedLink] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const scrollToSection = (id) => {
    setActiveToc(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const tocItems = [
    { id: 'summary', num: '00', label: 'Executive Summary' },
    { id: 'donor-address', num: '01', label: 'Donor Address & Masking' },
    { id: 'payment-security', num: '02', label: 'Razorpay & Financial Vault' },
    { id: 'tax-receipts', num: '03', label: 'Section 80G Tax Records & PAN' },
    { id: 'zero-selling', num: '04', label: 'Zero Commercial Data Selling' },
    { id: 'user-rights', num: '05', label: 'Data Retention & Account Deletion' },
    { id: 'grievance', num: '06', label: 'Statutory Grievance Officer' },
    { id: 'faqs', num: '07', label: 'Frequently Asked Questions' },
  ];

  const privacyFaqs = [
    {
      q: 'Can random visitors or donors see my exact house address?',
      a: 'Never. Serve-X strictly conceals your exact house number, apartment details, and street address. The public feed only sees your broad locality (e.g. "Koramangala, Bengaluru"). Your exact address is only disclosed to a verified NGO after you explicitly approve their physical pickup request.',
    },
    {
      q: 'Does Serve-X store my credit card numbers or UPI PIN?',
      a: 'No. Serve-X does not possess or store any credit/debit card numbers, CVVs, or UPI banking PINs. All monetary payments are routed directly through RBI-authorized payment aggregator Razorpay via end-to-end tokenized TLS 1.3 encryption.',
    },
    {
      q: 'Why is my PAN requested for monetary donations?',
      a: 'In accordance with the Income Tax Act 1961 of the Republic of India, donor PAN details are mandatory for verified NGOs to issue Section 80G tax exemption certificates. Your PAN is shared strictly with the receiving NGO for tax compliance filing.',
    },
    {
      q: 'How do I request complete deletion of my personal data?',
      a: 'You can request full profile erasure anytime by emailing our Data Grievance Desk at sumitrajslm2018@gmail.com with the subject "Data Erasure Request". All personal identifiers will be purged within 48 business hours, barring statutory financial audit logs required by Indian law.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F3F6FA] text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. HERO BANNER: Deep Executive Navy & Radiant Emerald Accents */}
      <section className="relative bg-gradient-to-br from-[#0B1F33] via-[#102A43] to-[#07549A] text-white pt-10 pb-16 sm:pb-20 overflow-hidden border-b border-slate-700/40">
        {/* Ambient Glow Orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Top Bar: Back Link + Document Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-8 sm:pb-12 border-b border-white/10">
            <Link
              to={backPath}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-200 hover:text-white px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 transition-all shadow-xs group"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-1 transition-transform" />
              <span>{backLabel}</span>
            </Link>

            {/* Document Switcher Tabs */}
            <div className="flex items-center p-1 bg-black/30 backdrop-blur-md rounded-2xl border border-white/15 text-xs sm:text-sm font-bold">
              <Link
                to="/terms"
                className="px-4 py-2 rounded-xl transition text-slate-300 hover:text-white flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Terms of Service</span>
              </Link>
              <Link
                to="/privacy-policy"
                className="px-4 py-2 rounded-xl transition bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold shadow-md flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>Privacy Policy</span>
              </Link>
            </div>

            {/* Print & Share Actions */}
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition cursor-pointer"
                title="Print Official Legal Copy"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-400" />
                <span>Print PDF</span>
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition cursor-pointer"
                title="Copy Page Link"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-slate-300" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Main Hero Header Content */}
          <div className="pt-8 sm:pt-10 max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-extrabold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Official Regulatory Framework • Republic of India</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Privacy, Trust & <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                Data Protection Shield
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-200/90 leading-relaxed font-normal max-w-3xl">
              Serve-X is engineered on a zero-exploitation pledge. Learn how our encrypted infrastructure safeguards your home address, financial transactions, and statutory tax records across our pan-India network.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 pt-2 font-medium">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Effective Date: October 2026</span>
              </div>
              <span className="text-white/30">•</span>
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-teal-400" />
                <span>Serve-X Foundation India</span>
              </div>
              <span className="text-white/30">•</span>
              <div className="flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-blue-400" />
                <span>IT Act 2000 & DPDP Act 2023 Compliant</span>
              </div>
            </div>
          </div>

          {/* 4 Trust & Security Stat Badges */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-10">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 sm:p-4 hover:border-emerald-400/40 transition">
              <div className="flex items-center gap-2.5 text-emerald-400 font-extrabold text-xs uppercase tracking-wider mb-1">
                <Lock className="w-4 h-4" />
                <span>256-Bit TLS 1.3</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">Bank-grade end-to-end data encryption</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 sm:p-4 hover:border-teal-400/40 transition">
              <div className="flex items-center gap-2.5 text-teal-400 font-extrabold text-xs uppercase tracking-wider mb-1">
                <EyeOff className="w-4 h-4" />
                <span>Address Shield</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">Concealed until donor approves pickup</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 sm:p-4 hover:border-cyan-400/40 transition">
              <div className="flex items-center gap-2.5 text-cyan-400 font-extrabold text-xs uppercase tracking-wider mb-1">
                <CreditCard className="w-4 h-4" />
                <span>Razorpay Vault</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">Zero payment credentials stored on Serve-X</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 sm:p-4 hover:border-blue-400/40 transition">
              <div className="flex items-center gap-2.5 text-blue-400 font-extrabold text-xs uppercase tracking-wider mb-1">
                <Receipt className="w-4 h-4" />
                <span>Section 80G</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">IT Act 1961 tax exemption receipts</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN 2-COLUMN EDITORIAL SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-10">
          {/* Left Column: Sticky Table of Contents & Contact Desk */}
          <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-24 self-start space-y-6">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center font-bold text-xs border border-emerald-100">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Quick Navigation</h3>
                    <p className="text-[11px] text-slate-500 font-medium">8 Key Sections</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Live
                </span>
              </div>

              {/* Table of Contents List */}
              <nav className="space-y-1">
                {tocItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left text-xs font-semibold px-3 py-2.5 rounded-xl transition flex items-center justify-between group cursor-pointer ${
                      activeToc === item.id
                        ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 font-bold border border-emerald-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span
                        className={`text-[10px] font-mono font-bold ${
                          activeToc === item.id ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      >
                        {item.num}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        activeToc === item.id ? 'text-emerald-600 translate-x-0.5' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </nav>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-2 font-medium">
                <div className="flex items-center justify-between">
                  <span>Reading Estimate:</span>
                  <span className="font-bold text-slate-700">~3 mins</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Legal Jurisdiction:</span>
                  <span className="font-bold text-slate-700">Republic of India</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Audit Frequency:</span>
                  <span className="font-bold text-emerald-700">Quarterly</span>
                </div>
              </div>
            </div>

            {/* Dark Sleek Helpdesk Mini-Card */}
            <div className="bg-gradient-to-br from-[#0F172A] via-[#102A43] to-[#0B1F33] text-white rounded-3xl p-5 border border-slate-700/60 shadow-md space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Grievance Redressal</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Have questions regarding your personal information, address masking, or tax receipts?
              </p>
              <div className="pt-1">
                <a
                  href="mailto:sumitrajslm2018@gmail.com"
                  className="inline-flex items-center justify-center w-full gap-2 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Grievance Officer</span>
                </a>
              </div>
              <p className="text-[10px] text-center text-slate-400 font-medium">Statutory SLA: Within 48 business hours</p>
            </div>
          </aside>

          {/* Right Column: Editorial Dossier Cards */}
          <main className="flex-1 w-full max-w-4xl space-y-8">
            {/* Card 00: In Plain English / Executive Summary */}
            <div
              id="summary"
              className="bg-gradient-to-br from-[#0F172A] via-[#102A43] to-[#0A2540] rounded-3xl p-6 sm:p-8 text-white border border-emerald-500/30 shadow-xl relative overflow-hidden space-y-6 scroll-mt-28"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <span>Executive Summary (In Plain English)</span>
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Our Three Core Privacy Guarantees
                </h2>
                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                  We built Serve-X for humanitarian social impact, not ad-targeting. You have total sovereign authority over who sees your data, when, and why.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-400/20 text-emerald-300 flex items-center justify-center font-bold text-sm">
                    🚫
                  </div>
                  <h4 className="text-sm font-bold text-white">Zero Data Selling</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    We never sell, rent, or trade your phone number, email, or profile to commercial third parties.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-400/20 text-teal-300 flex items-center justify-center font-bold text-sm">
                    🛡️
                  </div>
                  <h4 className="text-sm font-bold text-white">Address Masking</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    Your exact street address is hidden. It is unlocked exclusively to an NGO once you approve their claim.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-400/20 text-cyan-300 flex items-center justify-center font-bold text-sm">
                    💳
                  </div>
                  <h4 className="text-sm font-bold text-white">Zero Card Storage</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    Donation money flows through RBI-authorized Razorpay. Serve-X never stores CVV, card data, or UPI PINs.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 01: Donor Address & Masking */}
            <article
              id="donor-address"
              className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-sm space-y-6 scroll-mt-28"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center border border-emerald-200/60 font-black">
                    <EyeOff className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                      CLAUSE 1.0 • PHYSICAL AID LOGISTICS
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Donor Address Privacy & Geographic Masking
                    </h2>
                  </div>
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                  § 1.0
                </span>
              </div>

              {/* Callout Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border-l-4 border-[#059669] text-emerald-950 space-y-1.5">
                <div className="font-extrabold text-xs uppercase tracking-wider text-[#059669] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>The Serve-X Address Shield Protocol</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-emerald-900 font-medium">
                  When listing physical donations (clothes, grains, electronics, medical gear), your precise residential apartment number, street name, and landmark are encrypted in an isolated vault.
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                <p>
                  To eliminate harassment and protect donor physical security, Serve-X enforces a strict three-tier disclosure process:
                </p>

                {/* 3-Step Visual Lifecycle */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Step 1: Listing Published</span>
                    <h5 className="font-bold text-slate-900 text-xs sm:text-sm">Public Locality Only</h5>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Only your city and broad sub-region (e.g. "Indiranagar, Bengaluru") is visible on public feeds.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                    <span className="text-[11px] font-bold text-emerald-600 uppercase">Step 2: NGO Claim Submitted</span>
                    <h5 className="font-bold text-slate-900 text-xs sm:text-sm">Address Still Encrypted</h5>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      A registered NGO submits a claim request. Your street address remains fully hidden and inaccessible.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                    <span className="text-[11px] font-bold text-[#059669] uppercase">Step 3: Donor Grants Approval</span>
                    <h5 className="font-bold text-emerald-950 text-xs sm:text-sm">Exclusive Dispatch Unlock</h5>
                    <p className="text-[11px] text-emerald-800 leading-normal">
                      Once you accept the pickup schedule, the verified NGO’s field driver receives the designated pickup coordinates.
                    </p>
                  </div>
                </div>

                <ul className="space-y-2.5 pt-2">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                    <span>
                      <strong>No Permanent Directory:</strong> NGOs cannot download a bulk directory of donor residential addresses.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                    <span>
                      <strong>Audit Logging:</strong> Every time an NGO views an unlocked pickup location, a timestamped security log is generated.
                    </span>
                  </li>
                </ul>
              </div>
            </article>

            {/* Card 02: Razorpay & Financial Security */}
            <article
              id="payment-security"
              className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-sm space-y-6 scroll-mt-28"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#07549A] flex items-center justify-center border border-blue-200/60 font-black">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#07549A]">
                      CLAUSE 2.0 • FINANCIAL ISOLATION
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Razorpay Gateway & Zero Financial Data Storage
                    </h2>
                  </div>
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                  § 2.0
                </span>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                <p>
                  When you contribute money to verified disaster relief funds or educational fundraisers on Serve-X, your financial safety is guarded by India’s highest regulatory banking standards.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-[#07549A]" />
                      <span>PCI-DSS Level 1 Compliance</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Payments execute inside Razorpay's isolated PCI-DSS accredited infrastructure.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
                      <span>Zero Banking Credentials Retained</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Serve-X servers never process, touch, or store card CVVs, PINs, or net banking passwords.
                    </p>
                  </div>
                </div>

                <p>
                  All transactions generate an instantaneous Razorpay payment transaction reference (`pay_xxxxxxxxx`), which is tied to the NGO's dedicated merchant beneficiary account.
                </p>
              </div>
            </article>

            {/* Card 03: Section 80G Tax Records */}
            <article
              id="tax-receipts"
              className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-sm space-y-6 scroll-mt-28"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200/60 font-black">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-700">
                      CLAUSE 3.0 • STATUTORY TAX LAW
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Section 80G Receipts & Permanent Account Number (PAN)
                    </h2>
                  </div>
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                  § 3.0
                </span>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                <p>
                  Contributions to verified 80G-eligible non-profit organizations qualify for statutory tax deductions under Section 80G of the Indian Income Tax Act, 1961.
                </p>

                <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/60 border border-teal-200 text-teal-950 space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-teal-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-teal-700" />
                    <span>Mandatory IT Department Compliance Guidelines</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-teal-900 leading-relaxed">
                    Under Central Board of Direct Taxes (CBDT) notifications (Rule 18AB), an NGO must report the donor’s PAN, legal name, and address in Form 10BD to grant the donor tax exemption credit in their Annual Information Statement (AIS / Form 26AS).
                  </p>
                </div>

                <ul className="space-y-2.5 pt-1">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Strict Purpose Limitation:</strong> Your PAN is used solely to generate the Section 80G certificate and filing with the Income Tax Department.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Instant PDF Generation:</strong> Automated 80G receipts are generated with digital verification codes, ready for your ITR filing.
                    </span>
                  </li>
                </ul>
              </div>
            </article>

            {/* Card 04: Zero Selling */}
            <article
              id="zero-selling"
              className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-sm space-y-6 scroll-mt-28"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200/60 font-black">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-700">
                      CLAUSE 4.0 • MONETIZATION PROHIBITION
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Zero Commercial Data Selling & Ad Tracking
                    </h2>
                  </div>
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                  § 4.0
                </span>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                <p>
                  Unlike commercial e-commerce platforms, Serve-X has zero advertising business models. We do not partner with data brokers, cross-platform retargeting networks, or advertising conglomerates.
                </p>

                <div className="overflow-x-auto pt-2">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 font-extrabold">
                      <tr>
                        <th className="p-3">Data Point</th>
                        <th className="p-3">How Serve-X Treats It</th>
                        <th className="p-3">Commercial Sharing</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-800">Phone Number</td>
                        <td className="p-3 text-slate-600">Used strictly for pickup coordination SMS/OTP</td>
                        <td className="p-3 font-extrabold text-red-600">NEVER SOLD</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-800">Email Address</td>
                        <td className="p-3 text-slate-600">Donation receipts, dispatch alerts, password recovery</td>
                        <td className="p-3 font-extrabold text-red-600">NEVER SOLD</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-800">Location GPS</td>
                        <td className="p-3 text-slate-600">Concealed neighborhood lookup only</td>
                        <td className="p-3 font-extrabold text-red-600">NEVER SOLD</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </article>

            {/* Card 05: Data Retention & Account Deletion */}
            <article
              id="user-rights"
              className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-sm space-y-6 scroll-mt-28"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200/60 font-black">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700">
                      CLAUSE 5.0 • SOVEREIGN USER RIGHTS
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Data Retention, Right to Erasure & Account Deletion
                    </h2>
                  </div>
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                  § 5.0
                </span>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                <p>
                  In compliance with the Digital Personal Data Protection (DPDP) Act 2023, you have the unconditional right to access, rectify, or demand full erasure of your personal records.
                </p>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                    How to Trigger Complete Account Erasure:
                  </h4>
                  <ol className="list-decimal pl-5 space-y-1 text-slate-600 text-xs sm:text-sm">
                    <li>Send an email to sumitrajslm2018@gmail.com from your registered email ID.</li>
                    <li>Specify your registered mobile number and reason for departure.</li>
                    <li>Our security desk verifies identity and executes complete database purge within 48 business hours.</li>
                  </ol>
                </div>

                <p className="text-[11px] text-slate-400">
                  * Note: Financial transaction logs and Section 80G tax receipt records must be preserved for 7 fiscal years to comply with statutory audits mandated by the Ministry of Corporate Affairs (MCA) and the Income Tax Department.
                </p>
              </div>
            </article>

            {/* Card 06: Grievance Officer */}
            <article
              id="grievance"
              className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-sm space-y-6 scroll-mt-28"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center border border-emerald-200/60 font-black">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#059669]">
                      CLAUSE 6.0 • STATUTORY REDRESSAL
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Designated Grievance Redressal Officer
                    </h2>
                  </div>
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                  § 6.0
                </span>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                <p>
                  Under Rule 3(2) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the following officer is appointed to resolve data privacy and security complaints:
                </p>

                {/* Grievance Officer Card */}
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-[#102A43] to-slate-900 text-white space-y-4 border border-slate-700 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white">Sumit Raj</h4>
                      <p className="text-xs text-emerald-400 font-semibold">Chief Grievance & Compliance Officer</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold">
                      Designated Authority
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-white/10">
                    <div className="space-y-1">
                      <span className="text-slate-400">Direct Compliance Email:</span>
                      <a
                        href="mailto:sumitrajslm2018@gmail.com"
                        className="text-white hover:text-emerald-300 font-bold block"
                      >
                        sumitrajslm2018@gmail.com
                      </a>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-400">Statutory Helpline:</span>
                      <span className="text-white font-bold block">+91 95233 34322</span>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <span className="text-slate-400">Registered Corporate Office:</span>
                      <span className="text-slate-200 block">
                        Chandigarh University Gate No. 4, Gharuan, Mohali, Punjab - 140413, India
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Card 07: Frequently Asked Questions Accordion */}
            <article
              id="faqs"
              className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-sm space-y-6 scroll-mt-28"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200/60 font-black">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700">
                    COMMON CONCERNS
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Frequently Asked Privacy Questions
                  </h2>
                </div>
              </div>

              <div className="space-y-3">
                {privacyFaqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-2xl overflow-hidden transition"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-slate-900 bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          openFaq === idx ? 'rotate-180 text-emerald-600' : ''
                        }`}
                      />
                    </button>
                    {openFaq === idx && (
                      <div className="p-4 text-xs sm:text-sm text-slate-600 leading-relaxed bg-white border-t border-slate-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </article>

            {/* Document Footer: Formal Seal & Back Link */}
            <footer className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 pb-12">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#059669]" />
                <span>Certified by Legal & Regulatory Council, Serve-X Foundation</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="font-bold text-[#07549A] hover:underline cursor-pointer"
                >
                  Print Full Copy
                </button>
                <span>•</span>
                <Link to={backPath} className="font-bold text-slate-700 hover:text-slate-900">
                  {backLabel}
                </Link>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TERMS OF SERVICE PAGE
// ============================================================================
export const TermsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const backPath = isAuthenticated
    ? user?.role === 'ngo'
      ? '/ngo/dashboard'
      : user?.role === 'admin'
      ? '/admin/dashboard'
      : '/donor/dashboard'
    : '/login';
  const backLabel = isAuthenticated ? 'Back to Dashboard' : 'Back to Sign In';

  const [activeToc, setActiveToc] = useState('summary');
  const [copiedLink, setCopiedLink] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const scrollToSection = (id) => {
    setActiveToc(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const tocItems = [
    { id: 'summary', num: '00', label: 'Executive Summary' },
    { id: 'acceptance', num: '01', label: 'Acceptance & Binding Agreement' },
    { id: 'ngo-verification', num: '02', label: 'NGO Eligibility & DARPAN Due Diligence' },
    { id: 'item-commitments', num: '03', label: 'Physical Item Donation Charter' },
    { id: 'monetary-grants', num: '04', label: 'Monetary Campaigns & 80G Tax Receipts' },
    { id: 'prohibited-conduct', num: '05', label: 'Zero-Tolerance Fraud Policy' },
    { id: 'disputes', num: '06', label: 'Governing Law & Legal Jurisdiction' },
    { id: 'faqs', num: '07', label: 'Frequently Asked Questions' },
  ];

  const termsFaqs = [
    {
      q: 'Can anyone register as an NGO on Serve-X?',
      a: 'No. Only registered non-profit societies, trusts, or Section 8 companies possessing valid government registration certificates and NITI Aayog NGO-DARPAN IDs can apply. Every NGO application undergoes manual due diligence before being permitted to claim donations or run fundraising campaigns.',
    },
    {
      q: 'Can an NGO resell or monetize donated physical items?',
      a: 'Strictly prohibited. All items donated via Serve-X must be distributed directly to underprivileged beneficiaries. Any attempt to resell or divert donated items results in immediate permanent ban, revocation of DARPAN association on Serve-X, and criminal reporting under IPC 406/420.',
    },
    {
      q: 'Are monetary donations refundable?',
      a: 'Due to the instantaneous generation of Section 80G tax receipts and escrow disbursement to active humanitarian campaigns, contributions are non-refundable once processed, barring demonstrated banking gateway errors or unauthorized fraud recognized by banking ombudsmen.',
    },
    {
      q: 'What happens if a donor does not give items after an NGO travels for pickup?',
      a: 'Serve-X enforces an accountability rating system. If a donor or NGO repeatedly defaults on scheduled pickup slots without 24 hours prior notice, platform listing privileges are temporarily suspended.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F3F6FA] text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. HERO BANNER: Deep Executive Navy & Radiant Blue Accents */}
      <section className="relative bg-gradient-to-br from-[#0A192F] via-[#07549A] to-[#102A43] text-white pt-10 pb-16 sm:pb-20 overflow-hidden border-b border-slate-700/40">
        {/* Ambient Glow Orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Top Bar: Back Link + Document Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-8 sm:pb-12 border-b border-white/10">
            <Link
              to={backPath}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-200 hover:text-white px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 transition-all shadow-xs group"
            >
              <ArrowLeft className="w-4 h-4 text-blue-300 group-hover:-translate-x-1 transition-transform" />
              <span>{backLabel}</span>
            </Link>

            {/* Document Switcher Tabs */}
            <div className="flex items-center p-1 bg-black/30 backdrop-blur-md rounded-2xl border border-white/15 text-xs sm:text-sm font-bold">
              <Link
                to="/terms"
                className="px-4 py-2 rounded-xl transition bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold shadow-md flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-white" />
                <span>Terms of Service</span>
              </Link>
              <Link
                to="/privacy-policy"
                className="px-4 py-2 rounded-xl transition text-slate-300 hover:text-white flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                <span>Privacy Policy</span>
              </Link>
            </div>

            {/* Print & Share Actions */}
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition cursor-pointer"
                title="Print Official Legal Copy"
              >
                <Printer className="w-3.5 h-3.5 text-blue-300" />
                <span>Print PDF</span>
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition cursor-pointer"
                title="Copy Page Link"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-slate-300" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Main Hero Header Content */}
          <div className="pt-8 sm:pt-10 max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-extrabold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>Official Statutory Framework • Version 2026.4</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Terms of Service & <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-300 via-sky-200 to-teal-300 bg-clip-text text-transparent">
                Humanitarian Charter
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-200/90 leading-relaxed font-normal max-w-3xl">
              The binding legal contract governing donor item handovers, NITI Aayog DARPAN verification for partner NGOs, escrow fundraising campaigns, and fraud zero-tolerance rules across India.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 pt-2 font-medium">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-300" />
                <span>Effective Date: October 2026</span>
              </div>
              <span className="text-white/30">•</span>
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-teal-300" />
                <span>Serve-X Foundation India</span>
              </div>
              <span className="text-white/30">•</span>
              <div className="flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-indigo-300" />
                <span>Indian Contract Act, 1872 Compliant</span>
              </div>
            </div>
          </div>

          {/* 4 Trust & Security Stat Badges */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-10">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 sm:p-4 hover:border-blue-400/40 transition">
              <div className="flex items-center gap-2.5 text-blue-300 font-extrabold text-xs uppercase tracking-wider mb-1">
                <Building2 className="w-4 h-4" />
                <span>DARPAN Verified</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">NITI Aayog registration prerequisite</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 sm:p-4 hover:border-teal-400/40 transition">
              <div className="flex items-center gap-2.5 text-teal-300 font-extrabold text-xs uppercase tracking-wider mb-1">
                <FileCheck className="w-4 h-4" />
                <span>Anti-Resale Ban</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">100% direct beneficiary distribution</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 sm:p-4 hover:border-sky-400/40 transition">
              <div className="flex items-center gap-2.5 text-sky-300 font-extrabold text-xs uppercase tracking-wider mb-1">
                <Receipt className="w-4 h-4" />
                <span>Section 80G</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">Tax exemption receipts generated</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 sm:p-4 hover:border-indigo-400/40 transition">
              <div className="flex items-center gap-2.5 text-indigo-300 font-extrabold text-xs uppercase tracking-wider mb-1">
                <Scale className="w-4 h-4" />
                <span>Zero Tolerance</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">Immediate prosecution for fraud</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN 2-COLUMN EDITORIAL SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-10">
          {/* Left Column: Sticky Table of Contents & Contact Desk */}
          <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-24 self-start space-y-6">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#07549A] flex items-center justify-center font-bold text-xs border border-blue-100">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Quick Navigation</h3>
                    <p className="text-[11px] text-slate-500 font-medium">8 Key Sections</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  Binding
                </span>
              </div>

              {/* Table of Contents List */}
              <nav className="space-y-1">
                {tocItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left text-xs font-semibold px-3 py-2.5 rounded-xl transition flex items-center justify-between group cursor-pointer ${
                      activeToc === item.id
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-900 font-bold border border-blue-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span
                        className={`text-[10px] font-mono font-bold ${
                          activeToc === item.id ? 'text-blue-700' : 'text-slate-400'
                        }`}
                      >
                        {item.num}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        activeToc === item.id ? 'text-blue-600 translate-x-0.5' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </nav>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-2 font-medium">
                <div className="flex items-center justify-between">
                  <span>Reading Estimate:</span>
                  <span className="font-bold text-slate-700">~4 mins</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Governing Law:</span>
                  <span className="font-bold text-slate-700">Laws of India</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Dispute Forum:</span>
                  <span className="font-bold text-blue-800">Mohali / Chandigarh</span>
                </div>
              </div>
            </div>

            {/* Dark Sleek Legal Counsel Desk Mini-Card */}
            <div className="bg-gradient-to-br from-[#0F172A] via-[#102A43] to-[#0A192F] text-white rounded-3xl p-5 border border-slate-700/60 shadow-md space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-blue-300 uppercase tracking-wider">
                <Scale className="w-4 h-4" />
                <span>Legal Counsel Desk</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Questions regarding NGO partnership contracts, corporate CSR grant agreements, or donor disputes?
              </p>
              <div className="pt-1">
                <a
                  href="mailto:sumitrajslm2018@gmail.com"
                  className="inline-flex items-center justify-center w-full gap-2 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact Legal Team</span>
                </a>
              </div>
              <p className="text-[10px] text-center text-slate-400 font-medium">Response within 2 business days</p>
            </div>
          </aside>

          {/* Right Column: Editorial Dossier Cards */}
          <main className="flex-1 w-full max-w-4xl space-y-8">
            {/* Card 00: In Plain English / Executive Summary */}
            <div
              id="summary"
              className="bg-gradient-to-br from-[#0A192F] via-[#102A43] to-[#07549A] rounded-3xl p-6 sm:p-8 text-white border border-blue-400/30 shadow-xl relative overflow-hidden space-y-6 scroll-mt-28"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-blue-300">
                <Sparkles className="w-4 h-4" />
                <span>Platform Covenant (In Plain English)</span>
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Summary of Legal Obligations
                </h2>
                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                  Serve-X connects compassionate donors with verified non-profits. We enforce mutual respect, accurate item descriptions, verified NGO credentials, and strict zero-resale rules.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-400/20 text-blue-200 flex items-center justify-center font-bold text-sm">
                    📜
                  </div>
                  <h4 className="text-sm font-bold text-white">Verified NGOs Only</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    Only organizations with valid government registration and DARPAN IDs can claim items or raise money.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-400/20 text-teal-200 flex items-center justify-center font-bold text-sm">
                    📦
                  </div>
                  <h4 className="text-sm font-bold text-white">Zero Reselling</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    Donated goods must go directly to needy beneficiaries. Commercial sale is a criminal offense under law.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-400/20 text-indigo-200 flex items-center justify-center font-bold text-sm">
                    ⚖️
                  </div>
                  <h4 className="text-sm font-bold text-white">Transparent Giving</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    Every monetary donation receives an automated 80G tax receipt and direct transfer to verified NGO accounts.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 01: Acceptance of Terms */}
            <article
              id="acceptance"
              className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-sm space-y-6 scroll-mt-28"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#07549A] flex items-center justify-center border border-blue-200/60 font-black">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#07549A]">
                      CLAUSE 1.0 • STATUTORY CONTRACT
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Acceptance of Terms & Electronic Agreement
                    </h2>
                  </div>
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                  § 1.0
                </span>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                <p>
                  By creating an account, browsing the NGO directory, listing items for donation, or contributing money through Serve-X ("Platform"), you enter into a legally enforceable electronic contract with <strong>Serve-X Foundation India</strong> under the Indian Contract Act, 1872 and the Information Technology Act, 2000.
                </p>

                <p>
                  If you are registering on behalf of a society, trust, or non-profit organization, you represent that you hold valid board resolution power to legally bind that entity to these Terms.
                </p>
              </div>
            </article>

            {/* Card 02: NGO Verification */}
            <article
              id="ngo-verification"
              className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-sm space-y-6 scroll-mt-28"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center border border-emerald-200/60 font-black">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#059669]">
                      CLAUSE 2.0 • INSTITUTIONAL VETTING
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      NGO Eligibility & DARPAN Due Diligence
                    </h2>
                  </div>
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                  § 2.0
                </span>
              </div>

              {/* Callout Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border-l-4 border-[#059669] text-emerald-950 space-y-1.5">
                <div className="font-extrabold text-xs uppercase tracking-wider text-[#059669] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>The NITI Aayog DARPAN Prerequisite</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-emerald-900 font-medium">
                  Serve-X does not allow unverified entities to claim goods or solicit funds. Every applicant must provide verifiable credentials before receiving the "Verified NGO Partner" badge.
                </p>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                <p>Required compliance documentation includes:</p>
                <ul className="space-y-2.5 pl-2">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                    <span>
                      <strong>NITI Aayog NGO-DARPAN ID:</strong> Active portal registration with verified unique key.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                    <span>
                      <strong>Registration Certificate:</strong> Valid incorporation under Societies Registration Act 1860, Indian Trusts Act 1882, or Section 8 of the Companies Act 2013.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                    <span>
                      <strong>Section 12A & 80G Approvals:</strong> Valid orders issued by the Commissioner of Income Tax (Exemptions).
                    </span>
                  </li>
                </ul>
              </div>
            </article>

            {/* Card 03: Physical Items Donation Charter */}
            <article
              id="item-commitments"
              className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-sm space-y-6 scroll-mt-28"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200/60 font-black">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700">
                      CLAUSE 3.0 • GROUND LOGISTICS
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Physical Item Donation Commitments & Zero Resale
                    </h2>
                  </div>
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                  § 3.0
                </span>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                <p>
                  Donors listing physical items (clothing, groceries, books, computers, medical equipment) represent that:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Clean & Usable Condition</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Goods must be hygienic, functioning, and safe for direct humanitarian use.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>No Hazardous Materials</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Expired medicines, flammable chemicals, or counterfeit items are strictly forbidden.
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-red-50/70 border-l-4 border-red-500 text-red-950 space-y-1">
                  <div className="font-extrabold text-xs uppercase tracking-wider text-red-700 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Strict Prohibition of Commercial Resale</span>
                  </div>
                  <p className="text-xs sm:text-sm text-red-900 leading-relaxed font-medium">
                    NGO partners agree that all claimed items will be distributed free of cost to identified beneficiaries. Any sale, auction, or monetization of donated items is grounds for immediate termination and criminal filing under Indian Penal Code sections for criminal breach of trust.
                  </p>
                </div>
              </div>
            </article>

            {/* Card 04: Monetary Grants */}
            <article
              id="monetary-grants"
              className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-sm space-y-6 scroll-mt-28"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200/60 font-black">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-700">
                      CLAUSE 4.0 • FISCAL ESCROW
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Monetary Campaigns, Crowdfunding & Section 80G
                    </h2>
                  </div>
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                  § 4.0
                </span>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                <p>
                  All cash contributions are processed through Razorpay's RBI-compliant payment gateway directly into designated non-profit bank accounts.
                </p>

                <ul className="space-y-2.5 pt-1">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Irrevocability:</strong> Monetary contributions are non-refundable once an official Section 80G certificate has been digitally minted.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Fund Utilization Reporting:</strong> NGOs must upload utilization receipts and photographic evidence of impact for campaigns reaching over ₹50,000.
                    </span>
                  </li>
                </ul>
              </div>
            </article>

            {/* Card 05: Prohibited Conduct */}
            <article
              id="prohibited-conduct"
              className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-sm space-y-6 scroll-mt-28"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center border border-red-200/60 font-black">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-700">
                      CLAUSE 5.0 • INTEGRITY ENFORCEMENT
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Zero-Tolerance Fraud & Suspension Policy
                    </h2>
                  </div>
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                  § 5.0
                </span>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                <p>
                  Serve-X maintains algorithmic and manual surveillance to deter misrepresentation. We immediately terminate accounts and initiate civil/criminal action for:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-xs font-bold text-red-600">🚫 Phantom Listings</span>
                    <p className="text-[11px] text-slate-500">
                      Creating fictional item donations or impersonating verified NGO representatives.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-xs font-bold text-red-600">🚫 Extortion or Harassment</span>
                    <p className="text-[11px] text-slate-500">
                      Demanding cash payments for pickup of donated goods listed as free donations.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Card 06: Disputes */}
            <article
              id="disputes"
              className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-sm space-y-6 scroll-mt-28"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200/60 font-black">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700">
                      CLAUSE 6.0 • JURISDICTION
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Governing Law & Legal Jurisdiction
                    </h2>
                  </div>
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                  § 6.0
                </span>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                <p>
                  These Terms are governed by and construed in accordance with the substantive laws of the <strong>Republic of India</strong>.
                </p>

                <p>
                  Any legal dispute, controversy, or claim arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the competent civil courts situated at <strong>Mohali / Chandigarh, Punjab, India</strong>.
                </p>
              </div>
            </article>

            {/* Card 07: Terms FAQs */}
            <article
              id="faqs"
              className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-sm space-y-6 scroll-mt-28"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200/60 font-black">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700">
                    FREQUENTLY ASKED
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Frequently Asked Legal Questions
                  </h2>
                </div>
              </div>

              <div className="space-y-3">
                {termsFaqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-2xl overflow-hidden transition"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-slate-900 bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          openFaq === idx ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </button>
                    {openFaq === idx && (
                      <div className="p-4 text-xs sm:text-sm text-slate-600 leading-relaxed bg-white border-t border-slate-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </article>

            {/* Document Footer: Formal Seal & Back Link */}
            <footer className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 pb-12">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Certified by Legal & Regulatory Council, Serve-X Foundation</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="font-bold text-[#07549A] hover:underline cursor-pointer"
                >
                  Print Full Copy
                </button>
                <span>•</span>
                <Link to={backPath} className="font-bold text-slate-700 hover:text-slate-900">
                  {backLabel}
                </Link>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
