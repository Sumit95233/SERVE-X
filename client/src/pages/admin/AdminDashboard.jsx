import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import {
  ShieldCheck,
  Building2,
  Users,
  IndianRupee,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingNgos, setPendingNgos] = useState([]);
  const [pendingCampaigns, setPendingCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminOverview();
  }, []);

  const fetchAdminOverview = async () => {
    setLoading(true);
    try {
      const [statsRes, ngosRes, campsRes] = await Promise.all([
        api.get('/admin/statistics'),
        api.get('/admin/ngos/pending'),
        api.get('/admin/campaigns/pending'),
      ]);

      if (statsRes.data?.success) setStats(statsRes.data.data);
      if (ngosRes.data?.success) setPendingNgos(ngosRes.data.data);
      if (campsRes.data?.success) setPendingCampaigns(campsRes.data.data);
    } catch (err) {
      console.error('Admin overview error', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Loading administrative portal..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-[#07549A]" /> Administrative Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101828]">
              Platform Oversight & Moderation
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/ngos"
              className="px-4 py-2 bg-[#07549A] hover:bg-[#003B64] text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              Review NGOs ({pendingNgos.length})
            </Link>
            <Link
              to="/admin/campaigns"
              className="px-4 py-2 bg-[#00B98B] hover:bg-[#009E77] text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              Review Campaigns ({pendingCampaigns.length})
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-[#E5EAF0] shadow-xs">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Verified NGOs
            </span>
            <div className="text-2xl font-black text-[#00B98B] mt-2">
              {stats?.verifiedNgos || 0}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              {stats?.pendingNgos || 0} pending review
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#E5EAF0] shadow-xs">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Total Raised
            </span>
            <div className="text-2xl font-black text-[#101828] mt-2">
              ₹{(stats?.totalFundsRaised || 0).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              {stats?.totalDonationCount || 0} verified transactions
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#E5EAF0] shadow-xs">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Active Campaigns
            </span>
            <div className="text-2xl font-black text-[#07549A] mt-2">
              {stats?.activeCampaigns || 0}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Running fundraisers</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#E5EAF0] shadow-xs">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Total Users
            </span>
            <div className="text-2xl font-black text-purple-700 mt-2">
              {stats?.totalUsers || 0}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              {stats?.totalDonors || 0} active donors
            </p>
          </div>
        </div>

        {/* Review Queues Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending NGO Queue */}
          <div className="bg-white rounded-3xl p-6 border border-[#E5EAF0] shadow-xs">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <h3 className="font-bold text-sm text-[#101828] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-600" /> Pending NGO Applications
              </h3>
              <Link to="/admin/ngos" className="text-xs font-bold text-[#07549A] hover:underline">
                Review Queue →
              </Link>
            </div>

            {pendingNgos.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">
                All NGO applications have been reviewed!
              </p>
            ) : (
              <div className="space-y-3">
                {pendingNgos.map((ngo) => (
                  <div
                    key={ngo._id}
                    className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-[#101828]">{ngo.organizationName}</h4>
                      <p className="text-gray-500 mt-0.5">
                        Reg: {ngo.registrationNumber} • {ngo.city}, {ngo.state}
                      </p>
                    </div>
                    <Link
                      to="/admin/ngos"
                      className="px-3 py-1.5 bg-[#07549A] text-white font-bold rounded-lg hover:bg-[#003B64] transition text-xs"
                    >
                      Audit & Verify
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Campaigns Queue */}
          <div className="bg-white rounded-3xl p-6 border border-[#E5EAF0] shadow-xs">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <h3 className="font-bold text-sm text-[#101828] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#07549A]" /> Campaigns Awaiting Approval
              </h3>
              <Link to="/admin/campaigns" className="text-xs font-bold text-[#07549A] hover:underline">
                Review All →
              </Link>
            </div>

            {pendingCampaigns.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">
                No campaigns waiting for moderation.
              </p>
            ) : (
              <div className="space-y-3">
                {pendingCampaigns.map((camp) => (
                  <div
                    key={camp._id}
                    className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-[#101828]">{camp.title}</h4>
                      <p className="text-gray-500 mt-0.5">
                        By: {camp.ngoId?.organizationName} • Goal: ₹{camp.goalAmount?.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <Link
                      to="/admin/campaigns"
                      className="px-3 py-1.5 bg-[#00B98B] text-white font-bold rounded-lg hover:bg-[#009E77] transition text-xs"
                    >
                      Approve
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
