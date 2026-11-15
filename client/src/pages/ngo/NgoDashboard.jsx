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
  Target,
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
        <LoadingSpinner message="Opening partner workspace..." />
      </div>
    );
  }

  const isVerified = ngo?.verificationStatus === 'verified';
  const orgInitials = getInitials(ngo?.organizationName || 'NGO Partner');
  const primaryCampaign = recentCampaigns[0];

  return (
    <div className="space-y-6">
      {/* 1. EXECUTIVE DARK HERO BANNER (Clean, Tagda & Modern) */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-8 shadow-xl shadow-slate-950/10 border border-slate-800">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          {/* Organization Identity */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-2xl tracking-tight shadow-lg shadow-emerald-950/30 ring-2 ring-emerald-400/30">
                {orgInitials}
              </div>
              {isVerified && (
                <div
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 ring-2 ring-slate-900 flex items-center justify-center shadow-xs"
                  title="Verified Organization"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {ngo?.organizationName || user?.fullName || 'NGO Partner Workspace'}
                </h1>
                {isVerified ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                    </span>
                    <span>Verified Partner</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-full">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Pending Verification</span>
                  </span>
                )}
              </div>

              {/* Verified Metatags in Sleek Translucent Dark Glass */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs">
                {ngo?.city && (
                  <span className="inline-flex items-center gap-1 text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ngo.city}, {ngo.state || 'India'}</span>
                  </span>
                )}
                {ngo?.darpanId && (
                  <span className="inline-flex items-center gap-1.5 font-mono text-emerald-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-sans font-bold">DARPAN</span>
                    <span>{ngo.darpanId}</span>
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-emerald-300 bg-emerald-900/30 border border-emerald-500/30 px-2.5 py-1 rounded-lg font-semibold">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Section 80G Certified</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              to="/ngo/campaigns"
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Flame className="w-4 h-4 text-white" />
              <span>+ New Campaign</span>
            </Link>
            <Link
              to="/ngo/requirements"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Post Need</span>
            </Link>
            {ngo?._id && (
              <Link
                to={`/ngos/${ngo._id}`}
                className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white/90 border border-white/15 text-xs sm:text-sm font-bold rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
                title="View Public Profile"
              >
                <ExternalLink className="w-4 h-4 text-slate-300" />
                <span className="hidden sm:inline">Public Page</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 2. FOUR CLEAN OPERATIONAL METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Total Funds Received
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4 font-bold" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight tabular-nums mt-3 mb-1">
            ₹{stats.totalFunds.toLocaleString('en-IN')}
          </div>
          <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>100% Direct Gateway Settle</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Active Fundraisers
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight tabular-nums mt-3 mb-1">
            {stats.activeCampaigns} <span className="text-base font-semibold text-slate-400 font-sans">Live</span>
          </div>
          <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span>Accepting Public Donations</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              In-Kind Goods Received
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight tabular-nums mt-3 mb-1">
            {stats.totalItemsReceived} <span className="text-base font-semibold text-slate-400 font-sans">Units</span>
          </div>
          <div className="text-xs font-semibold text-sky-700 flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Doorstep Logistics Fulfilled</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Claim Coordination
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight tabular-nums mt-3 mb-1">
            {stats.pendingClaims} <span className="text-base font-semibold text-slate-400 font-sans">Pending</span>
          </div>
          <div className="text-xs font-semibold text-amber-700 flex items-center gap-1 mt-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Actionable Pickup Pipeline</span>
          </div>
        </div>
      </div>

      {/* 3. ACTIVE CAMPAIGN SPOTLIGHT (Clean, High-Value & Useful) */}
      {primaryCampaign && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
                <Flame className="w-3 h-3 text-orange-500" />
                <span>Featured Active Fundraiser</span>
              </span>
              <span className="text-xs font-bold text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">{primaryCampaign.causeCategory || 'Community Relief'}</span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight truncate">
                {primaryCampaign.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                {primaryCampaign.description || 'Support verified community relief initiatives.'}
              </p>
            </div>

            {/* Progress Bar & Numerical Target */}
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">
                  ₹{(primaryCampaign.amountRaised || 0).toLocaleString('en-IN')} raised
                </span>
                <span className="text-slate-500 font-medium">
                  Goal: ₹{(primaryCampaign.goalAmount || 1).toLocaleString('en-IN')} (
                  {Math.round(((primaryCampaign.amountRaised || 0) / (primaryCampaign.goalAmount || 1)) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.round(((primaryCampaign.amountRaised || 0) / (primaryCampaign.goalAmount || 1)) * 100))}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
            <Link
              to={`/campaigns/${primaryCampaign._id}`}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Public View</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/ngo/campaigns"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Manage Fundraiser</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* 4. RECENT ACTIVITY: FINANCIAL DONATIONS LEDGER + ITEM CLAIMS PIPELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Received Monetary Donations */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4 pb-3.5 border-b border-slate-100">
              <div>
                <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <IndianRupee className="w-4 h-4 font-bold" />
                  </div>
                  <span>Recent Monetary Donations</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Gateway receipts settled to your organization.
                </p>
              </div>
              <Link
                to="/ngo/donations"
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 shrink-0"
              >
                <span>View Full Ledger</span>
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
              <div className="space-y-2">
                {recentDonations.map((d, idx) => (
                  <div
                    key={d._id || idx}
                    className="p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {getDonorInitials(d.donorName)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900 truncate">
                            {d.donorName || 'Anonymous Supporter'}
                          </span>
                          <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
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
                        +₹{Number(d.amount).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold">80G Stamped</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-100">
            <Link
              to="/ngo/donations"
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition text-center block border border-slate-200"
            >
              Open Complete Donations Ledger →
            </Link>
          </div>
        </div>

        {/* Recent Claim Requests & Pickup Tracking */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4 pb-3.5 border-b border-slate-100">
              <div>
                <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
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
                className="text-xs font-bold text-sky-700 hover:underline flex items-center gap-1 shrink-0"
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
              <div className="space-y-2">
                {recentClaims.map((claim) => (
                  <div
                    key={claim._id}
                    className="p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 truncate">
                          {claim.itemDonationId?.title || 'Physical Item Donation'}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Requested: <strong className="text-slate-800">{claim.requestedQuantity}</strong> units • {claim.itemDonationId?.city || 'India'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <StatusBadge status={claim.status} />
                      <Link
                        to="/ngo/claims"
                        className="font-bold text-slate-700 hover:text-slate-900 hover:underline text-xs flex items-center gap-0.5"
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

          <div className="mt-5 pt-3.5 border-t border-slate-100">
            <Link
              to="/ngo/items"
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition text-center block border border-slate-200"
            >
              Browse More Available Donor Goods →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
