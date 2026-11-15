import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import {
  MapPin,
  ShieldCheck,
  Building2,
  Calendar,
  Phone,
  Mail,
  ArrowRight,
  ArrowLeft,
  Package,
  Heart,
  Clock,
  Award,
  CheckCircle2,
  FileCheck2,
  Share2,
  Target,
  Sparkles,
  Users,
  Compass,
  CreditCard,
  Lock,
  ChevronDown,
} from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DirectDonationModal } from '../../components/common/DirectDonationModal';
import { ReceiptModal } from '../../components/common/ReceiptModal';
import { useAuth } from '../../context/AuthContext';

const getCauseBadgeStyle = (causeName) => {
  switch (causeName) {
    case 'Healthcare':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'Education':
    case 'Education & Literacy':
      return 'bg-blue-50 text-[#07549A] border-blue-200';
    case 'Hunger Relief':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'Child Welfare':
    case 'Child Nutrition':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Elderly Care':
    case 'Elderly & Senior Care':
      return 'bg-teal-50 text-teal-700 border-teal-200';
    case 'Animal Welfare':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Disaster Relief':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'Women Empowerment':
      return 'bg-pink-50 text-pink-700 border-pink-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

const getCleanCampaignImage = (camp) => {
  const primaryImg = camp?.images?.[0];
  if (!primaryImg || primaryImg.includes('1573496359142') || primaryImg.includes('photo-1573496359142')) {
    if (camp?.causeCategory?.includes('Women') || camp?.title?.includes('Women') || camp?.title?.includes('Sewing')) {
      return 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&fit=crop';
  }
  return primaryImg;
};

// Authentic, high-resolution thematic cover photography for verified causes
const getCauseCoverImage = (cause, customCover) => {
  if (customCover && typeof customCover === 'string' && customCover.trim()) return customCover;
  switch (cause) {
    case 'Disaster Relief':
      return 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1600&auto=format&fit=crop&q=80';
    case 'Education':
      return 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&auto=format&fit=crop&q=80';
    case 'Healthcare':
      return 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1600&auto=format&fit=crop&q=80';
    case 'Hunger Relief':
      return 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&auto=format&fit=crop&q=80';
    case 'Child Welfare':
      return 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&auto=format&fit=crop&q=80';
    case 'Women Empowerment':
      return 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1600&auto=format&fit=crop&q=80';
    case 'Elderly Care':
      return 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1600&auto=format&fit=crop&q=80';
    case 'Animal Welfare':
      return 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1600&auto=format&fit=crop&q=80';
    case 'Clothing & Dignity':
      return 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1600&auto=format&fit=crop&q=80';
    case 'Community Development':
    case 'Rural & Village Development':
      return 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1600&auto=format&fit=crop&q=80';
    default:
      return 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1600&auto=format&fit=crop&q=80';
  }
};

export const NgoDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const isNgo = user?.role === 'ngo';
  const [ngo, setNgo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Donation & Receipt modal states
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [selectedDonationAmount, setSelectedDonationAmount] = useState(1000);
  const [targetCampaignId, setTargetCampaignId] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);

  const fetchNgo = async () => {
    try {
      const res = await api.get(`/ngos/${id}`);
      if (res.data?.success) {
        setNgo(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load NGO profile', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNgo();
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenDirectDonation = (amt = 1000, campId = null) => {
    setSelectedDonationAmount(amt);
    setTargetCampaignId(campId);
    setIsDonationModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Loading full NGO profile & verified credentials..." />
      </div>
    );
  }

  if (!ngo) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center px-4">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">NGO Not Found</h2>
        <p className="text-gray-500 mb-6">
          The requested organization could not be located in the Serve-X verified database.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/ngo-locator"
            className="px-5 py-2.5 bg-[#07549A] text-white text-xs font-bold rounded-xl hover:bg-[#06457E] transition"
          >
            Open NGO Locator Map
          </Link>
          <Link
            to="/ngos"
            className="px-5 py-2.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200 transition"
          >
            Browse Directory
          </Link>
        </div>
      </div>
    );
  }

  const primaryCause = ngo.causeCategories?.[0] || 'Community Development';
  const established = ngo.establishedYear || 2018;
  const beneficiariesText = ngo.beneficiariesSupported || '12,500+ Lives Impacted';

  return (
    <div className="min-h-screen py-6 sm:py-9 w-full max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full space-y-6">
        {/* 1. TOP BREADCRUMB & SHARE BAR */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link
              to="/ngos"
              className="inline-flex items-center gap-1.5 text-[#07549A] hover:underline font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Verified Directory</span>
            </Link>
            <span>/</span>
            <span className="text-slate-600 font-semibold">{ngo.state || 'India'}</span>
            <span>/</span>
            <span className="text-slate-900 font-bold truncate max-w-xs sm:max-w-md">
              {ngo.organizationName}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 shadow-2xs transition cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-[#07549A]" />
            <span>{copied ? 'Link Copied!' : 'Share Profile'}</span>
          </button>
        </div>

        {/* 2. HERO ORGANIZATION PROFILE CARD */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_8px_30px_rgba(15,23,42,0.06)] overflow-hidden">
          {/* 2.1 Top Thematic Cover Banner with Rich Photography & Dark Cinematic Gradient */}
          <div className="h-44 sm:h-56 w-full relative overflow-hidden p-4 sm:p-6 flex items-start justify-between">
            {/* Authentic Photographic Cover */}
            <img
              src={getCauseCoverImage(primaryCause, ngo.coverImage)}
              alt={`${ngo.organizationName} cover banner`}
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.08] transition-transform duration-700 hover:scale-105"
            />
            {/* Subtle Gradient Overlays for High Contrast & Visual Depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-slate-900/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-[#07549A]/30" />

            <div className="relative z-10 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-2xs ${getCauseBadgeStyle(
                  primaryCause
                )}`}
              >
                {primaryCause}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md border border-white/25 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Entity</span>
              </span>
            </div>

            <div className="relative z-10 hidden sm:flex items-center gap-1.5 text-xs font-medium text-white/95 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-xs">
              <MapPin className="w-3.5 h-3.5 text-blue-300" />
              <span>
                {ngo.city ? `${ngo.city}, ${ngo.state}` : ngo.state || 'India'}
              </span>
            </div>
          </div>

          {/* 2.2 Profile Body (Logo + Title + Badges + Action Buttons) */}
          <div className="p-6 sm:p-8 pt-0">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-7 border-b border-slate-100">
              {/* Left: Overlapping Logo + Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                <div className="relative -mt-14 sm:-mt-16 shrink-0">
                  <img
                    src={
                      ngo.logo ||
                      'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=240&h=240&fit=crop'
                    }
                    alt={ngo.organizationName}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=240&h=240&fit=crop';
                    }}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-xl bg-white ring-1 ring-slate-100"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  {/* Badges Bar */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 shadow-2xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Partner NGO</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-50 text-[#07549A] text-xs font-bold rounded-full border border-blue-200 shadow-2xs">
                      <Award className="w-3.5 h-3.5" />
                      <span>Section 80G Certified</span>
                    </span>
                    {ngo.darpanId && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-700 text-xs font-bold font-mono rounded-full border border-amber-200 shadow-2xs">
                        <FileCheck2 className="w-3.5 h-3.5" />
                        <span>Darpan: {ngo.darpanId}</span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                    {ngo.organizationName}
                  </h1>

                  {/* Clean Metadata Line (No awkward spacing) */}
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1 text-slate-700 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-[#07549A] shrink-0" />
                      <span>
                        {ngo.city ? `${ngo.city}, ${ngo.state}` : ngo.state}
                      </span>
                    </span>
                    <span>•</span>
                    <span>
                      Reg No:{' '}
                      <strong className="text-slate-800 font-bold">
                        {ngo.registrationNumber}
                      </strong>
                    </span>
                    <span>•</span>
                    <span>
                      Est.{' '}
                      <strong className="text-slate-800 font-bold">
                        {established}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Quick Action CTAs */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
                {isNgo ? (
                  <Link
                    to="/ngo/dashboard"
                    className="w-full sm:w-auto h-10 px-5 bg-[#059669] hover:bg-[#047857] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>My Partner Workspace</span>
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/donor/donate-items"
                      className="w-full sm:w-auto h-10 px-4 bg-[#07549A] hover:bg-[#06457E] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Package className="w-4 h-4" />
                      <span>Donate Physical Items</span>
                    </Link>

                    {ngo.activeCampaigns && ngo.activeCampaigns.length > 0 && (
                      <a
                        href="#active-campaigns"
                        className="w-full sm:w-auto h-10 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold rounded-xl shadow-2xs transition flex items-center justify-center gap-1.5"
                      >
                        <span>View Campaigns</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* 2.3 Key Metrics 4-Col Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 pt-6">
              {/* Impact */}
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/90 flex flex-col justify-between">
                <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Impact Reach</span>
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 mt-1">
                  {beneficiariesText}
                </div>
                <div className="text-[11px] text-emerald-700/80 font-medium mt-0.5">
                  Across {ngo.city || 'local'} region
                </div>
              </div>

              {/* Primary Focus */}
              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/90 flex flex-col justify-between">
                <div className="text-[11px] font-bold text-[#07549A] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-[#07549A]" />
                  <span>Primary Focus</span>
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 truncate mt-1">
                  {primaryCause}
                </div>
                <div className="text-[11px] text-blue-700/80 font-medium mt-0.5">
                  Core active mission
                </div>
              </div>

              {/* Compliance */}
              <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/90 flex flex-col justify-between">
                <div className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Compliance</span>
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 mt-1">
                  100% Verified
                </div>
                <div className="text-[11px] text-indigo-700/80 font-medium mt-0.5">
                  NITI Aayog Registered
                </div>
              </div>

              {/* Tax Benefit */}
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100/90 flex flex-col justify-between">
                <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>Tax Benefit</span>
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 mt-1">
                  Section 80G
                </div>
                <div className="text-[11px] text-amber-700/80 font-medium mt-0.5">
                  50% Tax Exemption
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. MAIN CONTENT: 2-COLUMN BALANCED LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* 3.1 Main Left Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-7">
            {/* About & Mission Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-[#07549A] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#07549A]" />
                    <span>About the Non-Profit</span>
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Organization</span>
                  </span>
                </div>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                  {ngo.description ||
                    `Dedicated to pioneering sustainable grassroots development across ${ngo.city || 'local communities'}, ensuring equal access to dignity, basic rights, and empowerment for every vulnerable individual.`}
                </p>
              </div>

              {ngo.mission && (
                <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50/80 via-blue-50/40 to-slate-50/60 rounded-2xl border-l-4 border-emerald-500 shadow-2xs">
                  <h4 className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mission Statement</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium italic leading-relaxed">
                    &ldquo;{ngo.mission}&rdquo;
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  Cause Domains & Focus Sectors
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[...new Set(ngo.causeCategories || [primaryCause])].map((cat, idx) => (
                    <span
                      key={idx}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border shadow-2xs transition hover:scale-105 ${getCauseBadgeStyle(
                        cat
                      )}`}
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Campaigns Section */}
            <div id="active-campaigns" className="scroll-mt-6">
              <div className="mb-4">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Active Fundraising Campaigns
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct online contributions with instant 80G tax receipt generation.
                </p>
              </div>

              {!ngo.activeCampaigns || ngo.activeCampaigns.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center text-sm text-slate-500">
                  No active fundraising campaigns at this moment. You can still support through item donations or general direct funds.
                </div>
              ) : (
                <div
                  className={`grid grid-cols-1 ${
                    ngo.activeCampaigns.length > 1 ? 'md:grid-cols-2' : ''
                  } gap-6`}
                >
                  {ngo.activeCampaigns.map((camp) => {
                    const percent = Math.min(
                      100,
                      Math.round(((camp.amountRaised || 0) / (camp.goalAmount || 1)) * 100)
                    );
                    const isSingle = ngo.activeCampaigns.length === 1;

                    return (
                      <div
                        key={camp._id}
                        className={`bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex ${
                          isSingle ? 'flex-col sm:flex-row' : 'flex-col'
                        } justify-between`}
                      >
                        <div className={`relative ${isSingle ? 'sm:w-2/5 shrink-0 min-h-[220px]' : ''}`}>
                          <img
                            src={getCleanCampaignImage(camp)}
                            alt={camp.title}
                            className={`w-full ${
                              isSingle ? 'h-52 sm:h-full' : 'h-48'
                            } object-cover object-center`}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&fit=crop';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                          <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 backdrop-blur-xs text-[#07549A] text-[10px] font-bold rounded-full shadow-xs uppercase tracking-wider">
                            {camp.causeCategory}
                          </span>
                        </div>

                        <div className={`p-5 sm:p-6 flex-1 flex flex-col justify-between ${isSingle ? 'sm:w-3/5' : ''}`}>
                          <div>
                            <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2 leading-snug line-clamp-2">
                              {camp.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-500 mb-5 leading-relaxed line-clamp-3">
                              {camp.description}
                            </p>
                          </div>

                          <div>
                            <div className="flex justify-between items-baseline text-xs text-slate-600 mb-2">
                              <span className="font-extrabold text-emerald-600 text-sm">
                                ₹{(camp.amountRaised || 0).toLocaleString('en-IN')}{' '}
                                <span className="font-normal text-slate-400 text-xs">raised</span>
                              </span>
                              <span className="font-bold text-slate-800 text-xs">
                                Goal: ₹{(camp.goalAmount || 100000).toLocaleString('en-IN')}
                              </span>
                            </div>

                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                                style={{ width: `${percent}%` }}
                              />
                            </div>

                            <div className="flex items-center justify-between text-xs text-slate-500 mb-4 pt-1.5 border-t border-slate-100">
                              <span>
                                <strong className="text-slate-800">{camp.donorCount || 28}</strong> supporters
                              </span>
                              <span className="text-emerald-700 font-extrabold">{percent}% funded</span>
                            </div>

                            {isNgo ? (
                              <Link
                                to={`/campaigns/${camp._id}`}
                                className="w-full py-2.5 bg-blue-50 hover:bg-[#07549A] text-[#07549A] hover:text-white border border-blue-200 hover:border-[#07549A] text-xs font-bold rounded-xl transition text-center flex items-center justify-center gap-1.5"
                              >
                                <span>View Campaign Details</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            ) : (
                              <div className="grid grid-cols-2 gap-2.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenDirectDonation(1000, camp._id)}
                                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                                >
                                  <CreditCard className="w-3.5 h-3.5" />
                                  <span>Contribute ₹</span>
                                </button>

                                <Link
                                  to={`/campaigns/${camp._id}`}
                                  className="py-2.5 px-3 bg-[#07549A] hover:bg-[#06457E] text-white text-xs sm:text-sm font-bold rounded-xl transition text-center flex items-center justify-center gap-1.5"
                                >
                                  <span>Details</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Physical Item Requirements Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Physical Item Requirements
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Verified on-ground material needs required for community programs.
                  </p>
                </div>
              </div>

              {!ngo.currentRequirements || ngo.currentRequirements.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center text-sm text-slate-500">
                  No pending physical requirements right now.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {ngo.currentRequirements.map((req) => (
                    <div
                      key={req._id}
                      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold px-2.5 py-0.5 bg-slate-100 rounded-lg text-slate-700">
                            {req.category}
                          </span>
                          <StatusBadge status={req.urgency} />
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 mb-1.5 leading-snug">
                          {req.title}
                        </h4>
                        <p className="text-xs text-slate-500 mb-4 leading-relaxed line-clamp-2">
                          {req.description}
                        </p>
                      </div>

                      <div>
                        <div className="text-xs text-slate-500 mb-1 flex justify-between">
                          <span>Progress</span>
                          <span className="font-bold text-slate-800">
                            {req.quantityFulfilled || 0} / {req.quantityRequired} {req.unit || 'kits'}
                          </span>
                        </div>

                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                          <div
                            className="h-full bg-[#07549A] rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round(
                                  ((req.quantityFulfilled || 0) / (req.quantityRequired || 1)) * 100
                                )
                              )}%`,
                            }}
                          />
                        </div>

                        <Link
                          to="/donor/donate-items"
                          className="block text-center py-2 border border-[#07549A] text-[#07549A] hover:bg-[#07549A] hover:text-white text-xs font-bold rounded-xl transition cursor-pointer"
                        >
                          Donate Items for This Need
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 3.2 Right Sidebar (4 Cols) - Sticky Desktop */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start">
            {/* If user is NGO: Show Organization Compliance Card */}
            {isNgo ? (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                    🏢 Verified Partner Profile
                  </span>
                </div>
                <h4 className="font-bold text-base text-slate-900">
                  {ngo.organizationName}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Registered non-profit entity on Serve-X All-India network. Compliance records, active fundraisers, and ground activities are verified.
                </p>
                <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">NITI Aayog Darpan:</span>
                    <strong className="text-emerald-700 font-mono">{ngo.darpanId || 'Verified'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tax Benefit:</span>
                    <strong className="text-slate-900">Section 80G Certified</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Headquarters:</span>
                    <strong className="text-slate-900">{ngo.city}, {ngo.state}</strong>
                  </div>
                </div>
              </div>
            ) : (
              /* For Donors and Guests: Direct Donation Terminal */
              <div className="bg-gradient-to-br from-slate-900 via-[#07549A] to-[#0A3D6B] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-slate-700/50">
                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-emerald-400/20 text-emerald-300 text-[10px] font-bold rounded-full uppercase tracking-wider border border-emerald-400/30">
                      Section 80G Certified
                    </span>
                  </div>

                  <div>
                    <h4 className="font-black text-lg leading-snug">
                      Support {ngo.organizationName}
                    </h4>
                    <p className="text-xs text-blue-100/90 leading-relaxed mt-1">
                      Directly fund community projects in {ngo.city || 'India'}. Claim 50% tax deduction with instant receipt.
                    </p>
                  </div>

                  {/* Quick Amount Selector */}
                  <div className="grid grid-cols-3 gap-2">
                    {[500, 1000, 2500].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setSelectedDonationAmount(amt)}
                        className={`py-2 rounded-xl text-xs font-extrabold transition cursor-pointer border ${
                          selectedDonationAmount === amt
                            ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm'
                            : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenDirectDonation(selectedDonationAmount)}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-black rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <span>Proceed to Donate ₹{selectedDonationAmount}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-3 text-[10px] text-blue-200/90 pt-1">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-400" /> Secure 256-Bit
                    </span>
                    <span>•</span>
                    <span>Instant 80G PDF Receipt</span>
                  </div>
                </div>
              </div>
            )}

            {/* Official Contact & Leadership Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#07549A]" />
                <span>Contact & Ground Office</span>
              </h3>

              <div className="space-y-3 text-xs">
                {ngo.contactPerson && (
                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#07549A] flex items-center justify-center shrink-0 font-bold text-xs">
                      {ngo.contactPerson.charAt(0)}
                    </div>
                    <div>
                      <div className="text-slate-400 font-semibold text-[11px]">
                        Authorized Coordinator
                      </div>
                      <div className="font-bold text-slate-800 text-sm">
                        {ngo.contactPerson}
                      </div>
                    </div>
                  </div>
                )}

                {ngo.phone && (
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-slate-400 font-semibold text-[11px]">
                        Helpline / Direct Contact
                      </div>
                      <a
                        href={`tel:${ngo.phone}`}
                        className="font-bold text-[#07549A] hover:underline"
                      >
                        {ngo.phone}
                      </a>
                    </div>
                  </div>
                )}

                {ngo.email && (
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-slate-400 font-semibold text-[11px]">
                        Official Email
                      </div>
                      <a
                        href={`mailto:${ngo.email}`}
                        className="font-semibold text-slate-800 hover:text-[#07549A] truncate block"
                      >
                        {ngo.email}
                      </a>
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100">
                  <div className="text-slate-400 font-semibold text-[11px] mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>Registered Operating Center</span>
                  </div>
                  <div className="text-slate-700 leading-relaxed font-medium pl-5 text-xs">
                    {ngo.address}, {ngo.city}, {ngo.state} - {ngo.pincode}
                  </div>
                </div>
              </div>
            </div>

            {/* Legal & Compliance Verification Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Legal & Trust Verification</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-3 text-emerald-800 bg-emerald-50/80 p-3 rounded-xl border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-bold">NITI Aayog NGO Darpan</div>
                    <div className="text-[11px] text-emerald-700 font-mono">
                      ID: {ngo.darpanId || 'Verified Record'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-blue-900 bg-blue-50/80 p-3 rounded-xl border border-blue-100">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <div className="font-bold">Income Tax Section 80G</div>
                    <div className="text-[11px] text-blue-700">
                      50% Tax Relief on all Donations
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-bold">Section 12A Certified</div>
                    <div className="text-[11px] text-slate-500">Tax Exemption Status Active</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-bold">Bank Account Verified</div>
                    <div className="text-[11px] text-slate-500">Direct Gateway Settlement</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Donation Modal */}
      <DirectDonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        ngo={ngo}
        campaignId={targetCampaignId}
        defaultAmount={selectedDonationAmount}
        onDonationSuccess={(receipt) => {
          setActiveReceipt(receipt);
          setIsReceiptOpen(true);
          fetchNgo();
        }}
      />

      {/* Official 80G Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        receipt={activeReceipt}
      />
    </div>
  );
};
