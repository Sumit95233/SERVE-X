import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  Package,
  IndianRupee,
  Clock,
  ClipboardList,
  PackageSearch,
  Handshake,
  Flame,
  TrendingUp,
  MapPin,
  ShieldCheck,
  ArrowRight,
  ArrowUpRight,
  PlusCircle,
  FileBarChart2,
  Receipt,
  CheckCircle2,
  ExternalLink,
  Award,
  Sparkles,
  Users,
  Calendar,
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

const getInitials = (name) => {
  if (!name) return 'NG';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const getDonorInitials = (name) => {
  if (!name || name.toLowerCase().includes('anonymous') || name.toLowerCase().includes('secret')) return 'AN';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

export const NgoDashboard = () => {
  const { user, ngo } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalFunds: 0,
    activeCampaigns: 0,
    totalItemsReceived: 0,
    pendingClaims: 0,
    totalRequirements: 0,
    totalDonationsCount: 0,
  });
  const [recentClaims, setRecentClaims] = useState([]);
  const [recentCampaigns, setRecentCampaigns] = useState([]);
  const [recentDonations, setRecentDonations] = useState([]);

  const fetchNgoDashboardData = async () => {
    try {
      setLoading(true);
      const [campaignsRes, claimsRes, reqRes, donationsRes] = await Promise.all([
        api.get('/campaigns?mine=true'),
        api.get('/items/claims'),
        api.get('/requirements?mine=true').catch(() => ({ data: { data: [] } })),
        api.get('/payments/ngo-donations').catch(() => ({ data: { data: [], summary: {} } })),
      ]);

      const myCampaigns = campaignsRes.data?.data || [];
      const myClaims = claimsRes.data?.data || [];
      const myReqs = reqRes.data?.data || [];
      const donationData = donationsRes.data?.data || [];
      const donationSummary = donationsRes.data?.summary || {};

      const totalFunds = donationSummary.totalAmount || myCampaigns.reduce((acc, c) => acc + (c.amountRaised || 0), 0);
      const activeCampaigns = myCampaigns.filter((c) => c.status === 'active').length;
      const totalItemsReceived = myClaims
        .filter((c) => c.status === 'completed')
        .reduce((acc, c) => acc + (c.requestedQuantity || 0), 0);
      const pendingClaims = myClaims.filter((c) => c.status === 'pending').length;

      setStats({
        totalFunds,
        activeCampaigns,
        totalItemsReceived,
        pendingClaims,
        totalRequirements: myReqs.length,
        totalDonationsCount: donationSummary.totalCount || donationData.length,
      });

      setRecentClaims(myClaims.slice(0, 5));
      setRecentCampaigns(myCampaigns.slice(0, 3));
      setRecentDonations(donationData.slice(0, 5));
    } catch (err) {
      console.error('NGO dashboard load error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNgoDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner message="Initializing partner workspace & realtime ledgers..." />
      </div>
    );
  }

  const isVerified = ngo?.verificationStatus === 'verified';
  const orgInitials = getInitials(ngo?.organizationName || 'NGO Partner');

  return (
    <div className="space-y-6">
      {/* 1. EXECUTIVE ORGANIZATION IDENTITY & STATUS BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-white/95 border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl p-5 sm:p-7">
        {/* Ambient Decorative Backdrops */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br from-emerald-100/50 via-teal-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gradient-to-tr from-blue-100/40 via-sky-50/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          {/* Left: Organization Identity & Metatags */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            {/* Monogram / Authentic Crest */}
            <div className="relative shrink-0">
              {ngo?.logo ? (
                <img
                  src={ngo.logo}
                  alt={ngo.organizationName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-emerald-500/20 ring-offset-2 ring-offset-white shadow-md shadow-emerald-950/10"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextElementSibling) {
                      e.target.nextElementSibling.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div
                style={{ display: ngo?.logo ? 'none' : 'flex' }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 items-center justify-center text-white font-black text-2xl sm:text-3xl tracking-tight shadow-md shadow-emerald-950/15 ring-2 ring-emerald-500/30 ring-offset-2 ring-offset-white"
              >
                {orgInitials}
              </div>
              {isVerified && (
                <div
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 ring-2 ring-white flex items-center justify-center shadow-xs"
                  title="Government Compliance Verified"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {ngo?.organizationName || user?.fullName || 'NGO Partner Workspace'}
                </h1>
                {isVerified ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Partner</span>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full shadow-xs">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Compliance Under Audit</span>
                  </span>
                )}
              </div>

              {/* Verified Metatags Row */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs">
                {ngo?.city && (
                  <span className="inline-flex items-center gap-1.5 text-slate-600 font-semibold bg-slate-100/90 px-2.5 py-1 rounded-lg border border-slate-200/80">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{ngo.city}, {ngo.state || 'India'}</span>
                  </span>
                )}
                {ngo?.darpanId && (
                  <span className="inline-flex items-center gap-1.5 text-slate-900 font-mono font-bold bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-300 shadow-xs">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-sans font-black">DARPAN</span>
                    <span className="text-emerald-700">{ngo.darpanId}</span>
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-50/90 border border-emerald-200/80 px-2.5 py-1 rounded-lg">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Section 80G Certified</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-slate-500 font-medium text-[11px] pl-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Realtime Gateway Synced</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-3 xl:pt-0 border-t xl:border-t-0 border-slate-200/80">
            <Link
              to="/ngo/requirements"
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Post Need</span>
            </Link>
            <Link
              to="/ngo/campaigns"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-slate-900/15 hover:shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>+ New Campaign</span>
            </Link>
            {ngo?._id && (
              <Link
                to={`/ngos/${ngo._id}`}
                className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs sm:text-sm font-bold rounded-xl shadow-xs hover:border-slate-400 hover:-translate-y-0.5 transition-all inline-flex items-center gap-1.5 cursor-pointer"
                title="View Public Profile as seen by donors"
              >
                <ExternalLink className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline">Public Page</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 2. FOUR HIGH-IMPACT OPERATIONAL KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Funds Received */}
        <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:shadow-[0_12px_28px_rgba(5,150,105,0.12)] hover:-translate-y-1 transition-all duration-200">
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />
          <div className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                Total Funds Received
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <IndianRupee className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight tabular-nums mt-3 mb-1">
              ₹{stats.totalFunds.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 w-fit mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>100% Direct Allocation</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Active Fundraisers */}
        <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:shadow-[0_12px_28px_rgba(249,115,22,0.12)] hover:-translate-y-1 transition-all duration-200">
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600" />
          <div className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                Active Fundraisers
              </span>
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 border border-orange-200/60 flex items-center justify-center group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all">
                <Flame className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight tabular-nums mt-3 mb-1">
              {stats.activeCampaigns} <span className="text-sm font-bold text-slate-500 font-sans">Live</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 w-fit mt-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              <span>Accepting Public Donations</span>
            </div>
          </div>
        </div>

        {/* KPI 3: In-Kind Goods Received */}
        <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:shadow-[0_12px_28px_rgba(2,132,199,0.12)] hover:-translate-y-1 transition-all duration-200">
          <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600" />
          <div className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                In-Kind Goods Received
              </span>
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-200/60 flex items-center justify-center group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight tabular-nums mt-3 mb-1">
              {stats.totalItemsReceived} <span className="text-sm font-bold text-slate-500 font-sans">Units</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100 w-fit mt-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Doorstep Pickup Fulfilled</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Claim Coordination Pipeline */}
        <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:shadow-[0_12px_28px_rgba(217,119,6,0.12)] hover:-translate-y-1 transition-all duration-200">
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500" />
          <div className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                Claim Coordination
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight tabular-nums mt-3 mb-1">
              {stats.pendingClaims} <span className="text-sm font-bold text-slate-500 font-sans">Pending</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100 w-fit mt-2">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Awaiting Handover & OTP</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FIVE FAST ACTION COMMAND TILES */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Operations Command Center</span>
          </div>
          <span className="text-[11px] text-slate-400 font-semibold">1-Click Fast Actions</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Action 1: Post Item Need */}
          <Link
            to="/ngo/requirements"
            className="group relative p-4.5 bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_rgba(15,23,42,0.02)] hover:border-emerald-500 hover:shadow-[0_8px_20px_rgba(5,150,105,0.12)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-200">
                <ClipboardList className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <div className="mt-3">
              <span className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors block">
                Post Item Need
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Urgent supplies
              </span>
            </div>
          </Link>

          {/* Action 2: Browse Donor Goods */}
          <Link
            to="/ngo/items"
            className="group relative p-4.5 bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_rgba(15,23,42,0.02)] hover:border-sky-500 hover:shadow-[0_8px_20px_rgba(2,132,199,0.12)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-all duration-200">
                <PackageSearch className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-sky-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <div className="mt-3">
              <span className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-sky-700 transition-colors block">
                Browse Donor Goods
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Claim supplies
              </span>
            </div>
          </Link>

          {/* Action 3: Claim Requests */}
          <Link
            to="/ngo/claims"
            className="group relative p-4.5 bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_rgba(15,23,42,0.02)] hover:border-indigo-500 hover:shadow-[0_8px_20px_rgba(99,102,241,0.12)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200">
                <Handshake className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <div className="mt-3">
              <span className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-indigo-700 transition-colors block">
                Claim Requests
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Track pickups
              </span>
            </div>
          </Link>

          {/* Action 4: Donations Ledger */}
          <Link
            to="/ngo/donations"
            className="group relative p-4.5 bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_rgba(15,23,42,0.02)] hover:border-emerald-500 hover:shadow-[0_8px_20px_rgba(5,150,105,0.12)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-all duration-200">
                <Receipt className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <div className="mt-3">
              <span className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-teal-700 transition-colors block">
                Donations Ledger
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                80G receipts
              </span>
            </div>
          </Link>

          {/* Action 5: Audit Reports */}
          <Link
            to="/ngo/reports"
            className="group relative p-4.5 bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_rgba(15,23,42,0.02)] hover:border-slate-800 hover:shadow-[0_8px_20px_rgba(15,23,42,0.12)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between col-span-2 sm:col-span-1"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-200">
                <FileBarChart2 className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <div className="mt-3">
              <span className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-slate-900 transition-colors block">
                Audit Reports
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                CSR dossier
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* 4. RECENT ACTIVITY: FINANCIAL DONATIONS LEDGER + ITEM CLAIMS PIPELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Received Monetary Donations */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,23,42,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4 pb-3.5 border-b border-slate-200/80">
              <div>
                <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                    <IndianRupee className="w-4 h-4 font-bold" />
                  </div>
                  <span>Recent Monetary Donations</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Verified gateway credits for your organization & campaigns.
                </p>
              </div>
              <Link
                to="/ngo/donations"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 shrink-0"
              >
                <span>View Ledger</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentDonations.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-500 space-y-2">
                <Receipt className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-semibold">No recent donation records found in the ledger.</p>
                <Link to="/ngo/campaigns" className="text-emerald-600 font-bold hover:underline inline-flex items-center gap-1">
                  <span>Publish or promote your fundraisers</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentDonations.map((d, idx) => (
                  <div
                    key={d._id || idx}
                    className="p-3 rounded-2xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200/70 transition-all flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Donor Monogram Avatar */}
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                        {getDonorInitials(d.donorName)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-black text-slate-900 truncate">
                            {d.donorName || 'Anonymous Supporter'}
                          </span>
                          <span className="font-mono text-[10px] bg-white text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 font-semibold">
                            {d.receiptNumber || 'SRVX-CREDIT'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                          {d.campaignId?.title || 'Direct Organization Contribution'} • {d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Recent'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-black text-emerald-600 text-sm sm:text-base tabular-nums block">
                        ₹{Number(d.amount).toLocaleString('en-IN')}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded border border-emerald-200/60">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Verified</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-200/80">
            <Link
              to="/ngo/donations"
              className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl transition text-center block cursor-pointer border border-emerald-200/60"
            >
              Open Complete Donations Ledger →
            </Link>
          </div>
        </div>

        {/* Recent Claim Requests & Pickup Tracking */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(15,23,42,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4 pb-3.5 border-b border-slate-200/80">
              <div>
                <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
                    <Handshake className="w-4 h-4 font-bold" />
                  </div>
                  <span>Item Claim Requests</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  In-kind supplies requested from registered donors.
                </p>
              </div>
              <Link
                to="/ngo/claims"
                className="text-xs font-bold text-sky-700 hover:text-sky-800 hover:underline flex items-center gap-1 shrink-0"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentClaims.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-500 space-y-2">
                <PackageSearch className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-semibold">No active claim requests submitted yet.</p>
                <Link to="/ngo/items" className="text-emerald-600 font-bold hover:underline inline-flex items-center gap-1">
                  <span>Browse available donor goods now</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentClaims.map((claim) => (
                  <div
                    key={claim._id}
                    className="p-3 rounded-2xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200/70 transition-all flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-sky-100/70 text-sky-700 border border-sky-200/70 flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black text-slate-900 truncate">
                          {claim.itemDonationId?.title || 'Physical Item Donation'}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Requested: <strong className="text-slate-800 font-bold">{claim.requestedQuantity}</strong> units • {claim.itemDonationId?.city || 'India'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <StatusBadge status={claim.status} />
                      <Link
                        to="/ngo/claims"
                        className="font-bold text-sky-700 hover:text-sky-800 hover:underline text-xs flex items-center gap-0.5"
                      >
                        <span>Manage</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-200/80">
            <Link
              to="/ngo/items"
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-bold rounded-xl transition text-center block cursor-pointer border border-slate-200/80"
            >
              Browse More Available Donor Goods →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
