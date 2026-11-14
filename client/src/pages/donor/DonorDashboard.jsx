import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  Package,
  IndianRupee,
  Heart,
  Users,
  PackagePlus,
  HeartHandshake,
  MapPin,
  History,
  ArrowRight,
  ArrowUpRight,
  Receipt,
} from 'lucide-react';
import { ImpactScoreCard } from '../../components/donor/ImpactScoreCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ReceiptModal } from '../../components/common/ReceiptModal';

export const DonorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalMoney: 0,
    totalItems: 0,
    distinctCauses: 0,
    livesTouched: 0,
  });
  const [recentMonetary, setRecentMonetary] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  useEffect(() => {
    const fetchDonorData = async () => {
      try {
        const [historyRes, itemsRes] = await Promise.all([
          api.get('/payments/history?limit=10'),
          api.get('/items?mine=true&limit=6'),
        ]);

        const moneyDonations = historyRes.data?.data || [];
        const itemDonations = itemsRes.data?.data || [];

        setRecentMonetary(moneyDonations.slice(0, 5));
        setRecentItems(itemDonations.slice(0, 5));

        const successfulPayments = moneyDonations.filter(
          (d) => d.paymentStatus === 'successful'
        );

        const totalMoney = successfulPayments.reduce(
          (acc, curr) => acc + (curr.amount || 0),
          0
        );

        const totalItems = itemDonations.reduce(
          (acc, curr) => acc + (curr.quantity || 1),
          0
        );

        // Calculate distinct qualifying campaigns supported by the donor
        const distinctCampaignIds = new Set(
          successfulPayments
            .map((d) => (typeof d.campaignId === 'object' ? d.campaignId?._id : d.campaignId))
            .filter(Boolean)
        );
        const distinctCauses = distinctCampaignIds.size;

        // Estimated lives impacted: 1 life per ₹500 raised + 2 lives per physical item given
        const livesTouched = Math.round(totalMoney / 500) + totalItems * 2;

        setStats({
          totalMoney,
          totalItems,
          distinctCauses,
          livesTouched,
        });
      } catch (err) {
        console.error('Failed to load donor dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonorData();
  }, []);

  const openReceipt = (donation) => {
    const receiptData = {
      receiptNumber: donation.receiptNumber || `REC-${donation._id.substring(18).toUpperCase()}`,
      donorName: donation.isAnonymous ? 'Anonymous Supporter' : (donation.donorId?.fullName || user?.fullName || 'Valued Donor'),
      donorEmail: donation.donorId?.email || user?.email || '',
      amount: donation.amount,
      campaignTitle: donation.campaignId?.title || 'General Relief Fund',
      ngoName: donation.ngoId?.organizationName || 'Verified Partner NGO',
      ngoAddress: donation.ngoId?.address || 'Connaught Place, New Delhi 110001',
      ngoPan: donation.ngoId?.panNumber || 'AAATE1234F',
      ngoRegistration: donation.ngoId?.registrationNumber || 'DEL-10492-2021',
      paymentId: donation.razorpayPaymentId || `pay_${donation._id.substring(10)}`,
      donationDate: donation.createdAt,
      paymentMethod: donation.paymentMethod || 'Online (Razorpay / UPI / Card)',
      is80GEligible: true,
    };
    setSelectedReceipt(receiptData);
    setIsReceiptOpen(true);
  };

  const renderStatusPill = (status) => {
    switch (status?.toLowerCase()) {
      case 'successful':
      case 'claimed':
      case 'delivered':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#ECFDF3] text-[#027A48] border border-[#A6F4C5]">
            Completed
          </span>
        );
      case 'pending':
      case 'created':
      case 'available':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFFAEB] text-[#B54708] border border-[#FEDF89]">
            Active
          </span>
        );
      case 'failed':
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA]">
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F8FAFC] text-[#475467] border border-[#E4E9F0]">
            {status || 'Unknown'}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner message="Loading your donor impact dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Compact Welcome Hero — Navy-to-Teal Gradient */}
      <div className="bg-gradient-to-r from-[#102A43] via-[#07549A] to-[#0F9D8A] rounded-[20px] p-6 sm:p-8 min-h-[180px] text-white shadow-[0_8px_24px_rgba(16,42,67,0.08)] flex flex-col justify-between relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <h1 className="text-[26px] sm:text-[30px] font-bold text-white leading-tight mb-2">
            Be the Unsung Hero
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#E5EEF8] leading-relaxed">
            Welcome back, <strong className="text-white font-bold">{user?.fullName || 'Friend'}</strong>. Your generosity creates real impact. Discover meaningful causes and make every contribution count.
          </p>
        </div>

        <div className="mt-5 relative z-10 flex flex-wrap items-center gap-3">
          <Link
            to="/donor/donate-items"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-[#07549A] hover:bg-[#F8FAFC] rounded-[10px] text-xs font-bold transition shadow-xs focus:outline-none focus:ring-2 focus:ring-[#84ADFF]"
          >
            <PackagePlus className="w-4 h-4 text-[#07549A]" />
            <span>Donate Items</span>
          </Link>

          <Link
            to="/campaigns"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-[10px] text-xs font-bold transition backdrop-blur-xs focus:outline-none focus:ring-2 focus:ring-[#84ADFF]"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Support Campaigns</span>
          </Link>

          <Link
            to="/donor/impact"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-[10px] text-xs font-bold transition backdrop-blur-xs focus:outline-none focus:ring-2 focus:ring-[#84ADFF]"
          >
            <Heart className="w-4 h-4 text-emerald-300" />
            <span>View My Impact</span>
          </Link>
        </div>
      </div>

      {/* 2. Personal Impact Score Summary */}
      <ImpactScoreCard
        totalMoney={stats.totalMoney}
        totalItems={stats.totalItems}
        completedClaims={stats.distinctCauses}
      />

      {/* 3. Four Contribution KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Contributed */}
        <div className="bg-white border border-[#E1E8F0] rounded-2xl p-5 min-h-[142px] shadow-[0_2px_8px_rgba(16,42,67,0.03)] flex flex-col justify-between hover:shadow-md hover:border-[#BFDBFE] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#7B8CA4] uppercase tracking-wider">
              Total Contributed
            </span>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#EAF3FF] to-[#D5E7FF] text-[#07549A] flex items-center justify-center ring-1 ring-[#BFDBFE]/60 shadow-xs">
              <IndianRupee className="w-5 h-5 font-bold" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#102A43] mt-2 tabular-nums">
              ₹{stats.totalMoney.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#059669] font-semibold mt-1">
              <span>Verified financial gifts</span>
            </div>
          </div>
        </div>

        {/* Card 2: Physical Items */}
        <div className="bg-white border border-[#E1E8F0] rounded-2xl p-5 min-h-[142px] shadow-[0_2px_8px_rgba(16,42,67,0.03)] flex flex-col justify-between hover:shadow-md hover:border-[#A6F4C5] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#7B8CA4] uppercase tracking-wider">
              Physical Items
            </span>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E6F8F0] to-[#CCF3E1] text-[#059669] flex items-center justify-center ring-1 ring-[#A6F4C5]/60 shadow-xs">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#102A43] mt-2 tabular-nums">
              {stats.totalItems}
            </div>
            <p className="text-[11px] text-[#526780] mt-1 font-medium">Physical items donated</p>
          </div>
        </div>

        {/* Card 3: Causes Supported */}
        <div className="bg-white border border-[#E1E8F0] rounded-2xl p-5 min-h-[142px] shadow-[0_2px_8px_rgba(16,42,67,0.03)] flex flex-col justify-between hover:shadow-md hover:border-[#FBCFE8] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#7B8CA4] uppercase tracking-wider">
              Causes Supported
            </span>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FDF2F8] to-[#FCE7F3] text-[#DB2777] flex items-center justify-center ring-1 ring-[#FBCFE8]/60 shadow-xs">
              <Heart className="w-5 h-5 fill-[#DB2777]" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#102A43] mt-2 tabular-nums">
              {stats.distinctCauses}
            </div>
            <p className="text-[11px] text-[#526780] mt-1 font-medium">Distinct qualifying campaigns</p>
          </div>
        </div>

        {/* Card 4: Lives Impacted */}
        <div className="bg-white border border-[#E1E8F0] rounded-2xl p-5 min-h-[142px] shadow-[0_2px_8px_rgba(16,42,67,0.03)] flex flex-col justify-between hover:shadow-md hover:border-[#99F6E4] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#7B8CA4] uppercase tracking-wider">
              Lives Impacted
            </span>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] text-[#0F766E] flex items-center justify-center ring-1 ring-[#99F6E4]/60 shadow-xs">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#102A43] mt-2 tabular-nums">
              {stats.livesTouched}
            </div>
            <p className="text-[11px] text-[#526780] mt-1 font-medium">Direct beneficiaries (Estimated)</p>
          </div>
        </div>
      </div>

      {/* 4. Quick Actions: Make an Impact */}
      <div className="bg-white border border-[#E1E8F0] rounded-2xl p-6 shadow-[0_2px_8px_rgba(16,42,67,0.03)]">
        <div className="mb-5">
          <h2 className="text-base font-black text-[#102A43]">Make an Impact</h2>
          <p className="text-xs text-[#526780]">Choose how you want to contribute to our partner causes.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Action 1: Donate Items */}
          <Link
            to="/donor/donate-items"
            className="p-5 rounded-2xl border border-[#E1E8F0] hover:border-[#07549A] hover:bg-[#F8FAFC] transition-all group focus:outline-none focus:ring-2 focus:ring-[#84ADFF] block hover:-translate-y-1 hover:shadow-sm"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#EAF3FF] to-[#D5E7FF] text-[#07549A] flex items-center justify-center mb-3 ring-1 ring-[#BFDBFE]/60 shadow-xs group-hover:scale-105 transition-transform">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#102A43] group-hover:text-[#07549A] transition-colors">
                Donate Items
              </h3>
              <ArrowRight className="w-3.5 h-3.5 text-[#7B8CA4] group-hover:translate-x-1 group-hover:text-[#07549A] transition-all" />
            </div>
            <p className="text-[11px] text-[#526780] mt-1.5 leading-relaxed">
              Share useful goods with verified communities in need.
            </p>
          </Link>

          {/* Action 2: Support a Campaign */}
          <Link
            to="/campaigns"
            className="p-5 rounded-2xl border border-[#E1E8F0] hover:border-[#059669] hover:bg-[#F8FAFC] transition-all group focus:outline-none focus:ring-2 focus:ring-[#84ADFF] block hover:-translate-y-1 hover:shadow-sm"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E6F8F0] to-[#CCF3E1] text-[#059669] flex items-center justify-center mb-3 ring-1 ring-[#A6F4C5]/60 shadow-xs group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#102A43] group-hover:text-[#059669] transition-colors">
                Support a Campaign
              </h3>
              <ArrowRight className="w-3.5 h-3.5 text-[#7B8CA4] group-hover:translate-x-1 group-hover:text-[#059669] transition-all" />
            </div>
            <p className="text-[11px] text-[#526780] mt-1.5 leading-relaxed">
              Contribute directly to verified fundraising initiatives.
            </p>
          </Link>

          {/* Action 3: Find NGOs */}
          <Link
            to="/ngo-locator"
            className="p-5 rounded-2xl border border-[#E1E8F0] hover:border-[#9333EA] hover:bg-[#F8FAFC] transition-all group focus:outline-none focus:ring-2 focus:ring-[#84ADFF] block hover:-translate-y-1 hover:shadow-sm"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FAF5FF] to-[#F3E8FF] text-[#9333EA] flex items-center justify-center mb-3 ring-1 ring-[#E9D5FF]/60 shadow-xs group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#102A43] group-hover:text-[#9333EA] transition-colors">
                Find NGOs
              </h3>
              <ArrowRight className="w-3.5 h-3.5 text-[#7B8CA4] group-hover:translate-x-1 group-hover:text-[#9333EA] transition-all" />
            </div>
            <p className="text-[11px] text-[#526780] mt-1.5 leading-relaxed">
              Discover organizations working on causes near you.
            </p>
          </Link>

          {/* Action 4: Donation History */}
          <Link
            to="/donor/history"
            className="p-5 rounded-2xl border border-[#E1E8F0] hover:border-[#D97706] hover:bg-[#F8FAFC] transition-all group focus:outline-none focus:ring-2 focus:ring-[#84ADFF] block hover:-translate-y-1 hover:shadow-sm"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] text-[#D97706] flex items-center justify-center mb-3 ring-1 ring-[#FDE68A]/60 shadow-xs group-hover:scale-105 transition-transform">
              <History className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#102A43] group-hover:text-[#D97706] transition-colors">
                Donation History
              </h3>
              <ArrowRight className="w-3.5 h-3.5 text-[#7B8CA4] group-hover:translate-x-1 group-hover:text-[#D97706] transition-all" />
            </div>
            <p className="text-[11px] text-[#526780] mt-1.5 leading-relaxed">
              Review your verified tax receipts and delivery logs.
            </p>
          </Link>
        </div>
      </div>

      {/* 5. Recent Activity: Latest Monetary & Physical Donations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#102A43]">Recent Activity</h2>
            <p className="text-xs text-[#526780]">Track the status of your recent gifts and item listings.</p>
          </div>
          <Link
            to="/donor/history"
            className="text-xs font-bold text-[#07549A] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Monetary Contributions */}
          <div className="bg-white border border-[#E1E8F0] rounded-2xl p-5 shadow-[0_2px_8px_rgba(16,42,67,0.03)]">
            <div className="flex justify-between items-center pb-3 border-b border-[#E1E8F0] mb-4">
              <h3 className="font-bold text-xs text-[#102A43] flex items-center gap-2">
                <IndianRupee className="w-3.5 h-3.5 text-[#07549A]" />
                <span>Monetary Contributions</span>
              </h3>
              <span className="text-[11px] text-[#7B8CA4] font-medium tabular-nums">
                {recentMonetary.length} records
              </span>
            </div>

            {recentMonetary.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-10 h-10 rounded-xl bg-[#F4F7FB] border border-[#E1E8F0] text-[#7B8CA4] flex items-center justify-center mx-auto mb-2">
                  <IndianRupee className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-[#102A43]">No monetary contributions yet</p>
                <p className="text-[11px] text-[#526780] mt-0.5">Explore active campaigns to contribute.</p>
                <Link
                  to="/campaigns"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#07549A] mt-3 hover:underline"
                >
                  <span>Browse Campaigns</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentMonetary.map((d) => (
                  <div
                    key={d._id}
                    className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E1E8F0] flex justify-between items-center text-xs"
                  >
                    <div className="pr-2 min-w-0 flex-1">
                      <div className="font-bold text-[#102A43] truncate max-w-xs sm:max-w-md">
                        {d.campaignId?.title || 'General Relief Fund'}
                      </div>
                      <div className="text-[11px] text-[#526780] mt-0.5 truncate">
                        {d.ngoId?.organizationName || 'Verified NGO'} •{' '}
                        {new Date(d.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                    <div className="text-right shrink-0 flex flex-col items-end gap-1">
                      <div className="font-bold text-[#059669] text-xs tabular-nums">
                        ₹{d.amount.toLocaleString('en-IN')}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {renderStatusPill(d.paymentStatus)}
                        {d.paymentStatus === 'successful' && (
                          <button
                            type="button"
                            onClick={() => openReceipt(d)}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-[#07549A] bg-[#EAF3FF] hover:bg-[#D5E6FF] transition cursor-pointer"
                            title="View Official 80G Tax Receipt"
                          >
                            <Receipt className="w-3 h-3" />
                            <span>80G</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Physical Item Donations */}
          <div className="bg-white border border-[#E1E8F0] rounded-2xl p-5 shadow-[0_2px_8px_rgba(16,42,67,0.03)]">
            <div className="flex justify-between items-center pb-3 border-b border-[#E1E8F0] mb-4">
              <h3 className="font-bold text-xs text-[#102A43] flex items-center gap-2">
                <Package className="w-3.5 h-3.5 text-[#059669]" />
                <span>Physical Item Donations</span>
              </h3>
              <span className="text-[11px] text-[#7B8CA4] font-medium tabular-nums">
                {recentItems.length} records
              </span>
            </div>

            {recentItems.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-10 h-10 rounded-xl bg-[#F4F7FB] border border-[#E1E8F0] text-[#7B8CA4] flex items-center justify-center mx-auto mb-2">
                  <Package className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-[#102A43]">No items listed yet</p>
                <p className="text-[11px] text-[#526780] mt-0.5">List clothes, books, rations or essentials.</p>
                <Link
                  to="/donor/donate-items"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#07549A] mt-3 hover:underline"
                >
                  <span>List an Item</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentItems.map((item) => (
                  <div
                    key={item._id}
                    className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E1E8F0] flex justify-between items-center text-xs"
                  >
                    <div className="pr-2 min-w-0 flex-1">
                      <div className="font-bold text-[#102A43] truncate max-w-xs sm:max-w-md">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-[#526780] mt-0.5 truncate">
                        {item.quantity} {item.unit || 'units'} • {item.city} •{' '}
                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </div>
                    </div>
                    <div className="shrink-0">
                      {renderStatusPill(item.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Official 80G Receipt Modal */}
      <ReceiptModal
        receipt={selectedReceipt}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
};
