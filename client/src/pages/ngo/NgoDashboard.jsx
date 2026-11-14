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
  PlusCircle,
  FileBarChart2,
  Receipt,
  CheckCircle2,
  ExternalLink,
  Award,
  Globe,
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

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
        <LoadingSpinner message="Loading partner workspace..." />
      </div>
    );
  }

  const isVerified = ngo?.verificationStatus === 'verified';

  return (
    <div className="space-y-6">
      {/* 1. ORGANIZATION WELCOME & SUMMARY SECTION */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-[0_2px_8px_rgba(15,23,42,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#059669] to-[#047857] flex items-center justify-center text-white font-bold shadow-xs shrink-0">
              🏢
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                  {ngo?.organizationName || user?.fullName || 'NGO Partner Workspace'}
                </h1>
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
                    <span>Verified Partner</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100/70 border border-amber-200 px-2.5 py-0.5 rounded-full">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Pending Verification</span>
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B] mt-0.5">
                {ngo?.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>{ngo.city}, {ngo.state || 'India'}</span>
                  </span>
                )}
                {ngo?.darpanId && (
                  <span>
                    Darpan: <strong className="text-[#059669] font-mono">{ngo.darpanId}</strong>
                  </span>
                )}
                <span className="text-[#059669] font-semibold bg-[#ECFDF5] px-2 py-0.5 rounded-md border border-[#A7F3D0]">
                  Section 80G Certified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary NGO CTA Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            to="/ngo/requirements"
            className="px-3.5 py-2 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-xl shadow-xs transition inline-flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Post Need</span>
          </Link>
          <Link
            to="/ngo/campaigns"
            className="px-3.5 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl shadow-xs transition inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-[#F97316]" />
            <span>+ New Campaign</span>
          </Link>
          {ngo?._id && (
            <Link
              to={`/ngos/${ngo._id}`}
              className="px-3 py-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1] text-xs font-bold rounded-xl transition inline-flex items-center gap-1 cursor-pointer"
              title="View Public Profile as seen by donors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#07549A]" />
              <span className="hidden sm:inline">Public Page</span>
            </Link>
          )}
        </div>
      </div>

      {/* 2. FOUR OPERATIONAL KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Funds Raised */}
        <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs hover:border-[#A7F3D0] transition-all flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5] text-[#059669] flex items-center justify-center shrink-0 ring-1 ring-[#A7F3D0]/60 shadow-xs">
            <IndianRupee className="w-5 h-5 font-bold" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider truncate">
              Total Funds Received
            </div>
            <div className="text-xl font-black text-[#0F172A] mt-0.5 tabular-nums truncate">
              ₹{stats.totalFunds.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-[#059669] font-semibold mt-0.5">Verified gateway credits</p>
          </div>
        </div>

        {/* KPI 2: Active Fundraisers */}
        <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs hover:border-[#FED7AA] transition-all flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5] text-[#EA580C] flex items-center justify-center shrink-0 ring-1 ring-[#FED7AA]/60 shadow-xs">
            <Flame className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider truncate">
              Active Fundraisers
            </div>
            <div className="text-xl font-black text-[#0F172A] mt-0.5 tabular-nums truncate">
              {stats.activeCampaigns}
            </div>
            <p className="text-[11px] text-[#475569] font-medium mt-0.5">Live on ServeX directory</p>
          </div>
        </div>

        {/* KPI 3: Physical Items Delivered */}
        <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs hover:border-[#BAE6FD] transition-all flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] text-[#0284C7] flex items-center justify-center shrink-0 ring-1 ring-[#BAE6FD]/60 shadow-xs">
            <Package className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider truncate">
              In-Kind Goods Received
            </div>
            <div className="text-xl font-black text-[#0F172A] mt-0.5 tabular-nums truncate">
              {stats.totalItemsReceived} Units
            </div>
            <p className="text-[11px] text-[#475569] font-medium mt-0.5">Fulfilled doorstep pickups</p>
          </div>
        </div>

        {/* KPI 4: Pending Claims */}
        <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs hover:border-[#FDE68A] transition-all flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0 ring-1 ring-[#FDE68A]/60 shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider truncate">
              Claim Coordination
            </div>
            <div className="text-xl font-black text-[#0F172A] mt-0.5 tabular-nums truncate">
              {stats.pendingClaims} Pending
            </div>
            <p className="text-[11px] text-[#D97706] font-medium mt-0.5">Awaiting pickup handover</p>
          </div>
        </div>
      </div>

      {/* 3. FIVE FAST ACTION WORKSPACE COMMAND CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <Link
          to="/ngo/requirements"
          className="p-4 bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#059669] hover:shadow-sm hover:-translate-y-0.5 transition-all text-center group"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5] text-[#059669] flex items-center justify-center mx-auto mb-2.5 ring-1 ring-[#A7F3D0]/60 shadow-xs group-hover:scale-105 transition-transform">
            <ClipboardList className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-[#0F172A] block">Post Item Need</span>
          <span className="text-[10px] text-[#64748B] mt-0.5 block">Urgent supplies</span>
        </Link>

        <Link
          to="/ngo/items"
          className="p-4 bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#0284C7] hover:shadow-sm hover:-translate-y-0.5 transition-all text-center group"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] text-[#0284C7] flex items-center justify-center mx-auto mb-2.5 ring-1 ring-[#BAE6FD]/60 shadow-xs group-hover:scale-105 transition-transform">
            <PackageSearch className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-[#0F172A] block">Browse Donor Goods</span>
          <span className="text-[10px] text-[#64748B] mt-0.5 block">Claim supplies</span>
        </Link>

        <Link
          to="/ngo/claims"
          className="p-4 bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#059669] hover:shadow-sm hover:-translate-y-0.5 transition-all text-center group"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5] text-[#059669] flex items-center justify-center mx-auto mb-2.5 ring-1 ring-[#A7F3D0]/60 shadow-xs group-hover:scale-105 transition-transform">
            <Handshake className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-[#0F172A] block">Claim Requests</span>
          <span className="text-[10px] text-[#64748B] mt-0.5 block">Track pickups</span>
        </Link>

        <Link
          to="/ngo/donations"
          className="p-4 bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#059669] hover:shadow-sm hover:-translate-y-0.5 transition-all text-center group"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5] text-[#059669] flex items-center justify-center mx-auto mb-2.5 ring-1 ring-[#A7F3D0]/60 shadow-xs group-hover:scale-105 transition-transform">
            <IndianRupee className="w-5 h-5 font-bold" />
          </div>
          <span className="text-xs font-bold text-[#0F172A] block">Donations Ledger</span>
          <span className="text-[10px] text-[#64748B] mt-0.5 block">80G receipts</span>
        </Link>

        <Link
          to="/ngo/reports"
          className="p-4 bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#07549A] hover:shadow-sm hover:-translate-y-0.5 transition-all text-center group col-span-2 sm:col-span-1"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] text-[#0F172A] flex items-center justify-center mx-auto mb-2.5 ring-1 ring-[#CBD5E1]/60 shadow-xs group-hover:scale-105 transition-transform">
            <FileBarChart2 className="w-5 h-5 text-[#07549A]" />
          </div>
          <span className="text-xs font-bold text-[#0F172A] block">Audit Reports</span>
          <span className="text-[10px] text-[#64748B] mt-0.5 block">CSR dossier</span>
        </Link>
      </div>

      {/* 4. RECENT ACTIVITY: FINANCIAL DONATIONS + ITEM CLAIMS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Received Monetary Donations */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3 pb-2.5 border-b border-[#E2E8F0]">
              <div>
                <h3 className="font-bold text-sm text-[#0F172A] flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4 text-[#059669]" />
                  <span>Recent Monetary Donations</span>
                </h3>
                <p className="text-[11px] text-[#64748B]">
                  Verified gateway credits for your organization & campaigns.
                </p>
              </div>
              <Link to="/ngo/donations" className="text-xs font-bold text-[#059669] hover:underline flex items-center gap-1">
                <span>View Ledger</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentDonations.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#64748B] space-y-2">
                <p>No recent donation records found in the ledger.</p>
                <Link to="/ngo/campaigns" className="text-[#059669] font-bold hover:underline inline-flex items-center gap-1">
                  <span>Publish or promote your fundraisers</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#E2E8F0]">
                {recentDonations.map((d, idx) => (
                  <div key={d._id || idx} className="py-2.5 flex items-center justify-between text-xs gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#0F172A] truncate">
                          {d.donorName || 'Anonymous Donor'}
                        </span>
                        <span className="font-mono text-[10px] text-[#64748B]">
                          ({d.receiptNumber || 'SRVX-CREDIT'})
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-0.5 truncate">
                        {d.campaignId?.title || 'Direct Organization Contribution'} • {d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Recent'}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-black text-[#059669] text-sm tabular-nums">
                        ₹{Number(d.amount).toLocaleString('en-IN')}
                      </span>
                      <span className="block text-[10px] text-[#059669] font-semibold">Verified</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
            <Link
              to="/ngo/donations"
              className="w-full py-2 bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#065F46] text-xs font-bold rounded-xl transition text-center block"
            >
              Open Complete Donations Ledger →
            </Link>
          </div>
        </div>

        {/* Recent Claim Requests & Pickup Tracking */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3 pb-2.5 border-b border-[#E2E8F0]">
              <div>
                <h3 className="font-bold text-sm text-[#0F172A] flex items-center gap-1.5">
                  <Handshake className="w-4 h-4 text-[#0284C7]" />
                  <span>Item Claim Requests</span>
                </h3>
                <p className="text-[11px] text-[#64748B]">
                  In-kind supplies requested from registered donors.
                </p>
              </div>
              <Link to="/ngo/claims" className="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1">
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentClaims.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#64748B] space-y-2">
                <p>No active claim requests submitted yet.</p>
                <Link to="/ngo/items" className="text-[#059669] font-bold hover:underline inline-flex items-center gap-1">
                  <span>Browse available donor goods now</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#E2E8F0]">
                {recentClaims.map((claim) => (
                  <div key={claim._id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                    <div className="min-w-0">
                      <h4 className="font-bold text-[#0F172A] truncate">
                        {claim.itemDonationId?.title || 'Physical Item Donation'}
                      </h4>
                      <p className="text-[11px] text-[#64748B] mt-0.5">
                        Requested: <strong className="text-[#0F172A]">{claim.requestedQuantity}</strong> units • {claim.itemDonationId?.city || 'India'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <StatusBadge status={claim.status} />
                      <Link
                        to="/ngo/claims"
                        className="font-bold text-[#07549A] hover:underline text-[11px]"
                      >
                        Manage →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
            <Link
              to="/ngo/items"
              className="w-full py-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1] text-xs font-bold rounded-xl transition text-center block"
            >
              Browse More Available Donor Goods →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};