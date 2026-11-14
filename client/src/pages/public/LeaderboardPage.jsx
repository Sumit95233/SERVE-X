import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  Trophy,
  Award,
  Medal,
  Heart,
  Users,
  IndianRupee,
  ShieldCheck,
  ShieldOff,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  FileText,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { ReceiptModal } from '../../components/common/ReceiptModal';
import toast from 'react-hot-toast';

export const LeaderboardPage = () => {
  const { user, isAuthenticated } = useAuth();

  const [period, setPeriod] = useState('all_time');
  const [topDonors, setTopDonors] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [recentContributions, setRecentContributions] = useState([]);
  const [summary, setSummary] = useState({ totalRaised: 0, totalDonations: 0, activeDonors: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalLeaders: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Authenticated user personal standing
  const [myStanding, setMyStanding] = useState(null);
  const [updatingPref, setUpdatingPref] = useState(false);

  // Receipt Modal state
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [loadingReceiptId, setLoadingReceiptId] = useState(null);

  const fetchLeaderboard = useCallback(async (selectedPeriod, pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/leaderboard', {
        params: {
          period: selectedPeriod,
          page: pageNum,
          limit: 10,
        },
      });

      if (res.data?.success) {
        const d = res.data.data;
        setTopDonors(d.topDonors || []);
        setLeaders(d.leaders || []);
        setRecentContributions(d.recentContributions || []);
        setSummary(d.summary || { totalRaised: 0, totalDonations: 0, activeDonors: 0 });
        setPagination(d.pagination || { page: pageNum, limit: 10, totalLeaders: 0, totalPages: 1 });
      }
    } catch (err) {
      console.error('[Leaderboard Fetch Error]', err);
      setError('Unable to load leaderboard data at this time. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyStanding = useCallback(async (selectedPeriod) => {
    if (!isAuthenticated || user?.role !== 'donor') {
      setMyStanding(null);
      return;
    }
    try {
      const res = await api.get('/leaderboard/me', {
        params: { period: selectedPeriod },
      });
      if (res.data?.success) {
        setMyStanding(res.data.data);
      }
    } catch (err) {
      console.warn('[My Standing Notice]', err.message);
    }
  }, [isAuthenticated, user?.role]);

  useEffect(() => {
    fetchLeaderboard(period, 1);
    fetchMyStanding(period);
  }, [period, fetchLeaderboard, fetchMyStanding]);

  const handlePeriodChange = (newPeriod) => {
    if (newPeriod === period) return;
    setPeriod(newPeriod);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchLeaderboard(period, newPage);
  };

  const togglePublicPreference = async () => {
    if (!myStanding) return;
    const targetStatus = !myStanding.isPublicDonor;
    setUpdatingPref(true);

    try {
      const res = await api.patch('/leaderboard/preferences', {
        isPublicDonor: targetStatus,
      });

      if (res.data?.success) {
        setMyStanding((prev) => ({
          ...prev,
          isPublicDonor: targetStatus,
        }));
        toast.success(
          targetStatus
            ? 'Your name is now visible on the public leaderboard.'
            : 'You are now anonymous on the public leaderboard.'
        );
        fetchLeaderboard(period, pagination.page);
      }
    } catch (err) {
      console.error('[Leaderboard Pref Error]', err);
      toast.error('Failed to update leaderboard privacy preference');
    } finally {
      setUpdatingPref(false);
    }
  };

  const handleViewReceipt = async (receiptNumber, donationDonorId) => {
    // Only authorized donor or admin can view receipt
    if (!isAuthenticated) {
      toast.error('Please sign in to view your tax receipt.');
      return;
    }
    const isOwner = user?._id && String(user._id) === String(donationDonorId);
    const isAdmin = user?.role === 'admin';
    if (!isOwner && !isAdmin) {
      toast.error('Receipts are private and only accessible to the contributing donor.');
      return;
    }

    try {
      setLoadingReceiptId(receiptNumber);
      const res = await api.get(`/payments/${receiptNumber}/receipt`);
      if (res.data?.success) {
        setSelectedReceipt(res.data.data);
        setIsReceiptOpen(true);
      }
    } catch {
      toast.error('Could not load receipt details.');
    } finally {
      setLoadingReceiptId(null);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'D';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name[0].toUpperCase();
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#F3F7FB] py-4 sm:py-5 px-4 sm:px-6 lg:px-8 w-full max-w-full overflow-x-hidden">
      <div className="max-w-[1350px] mx-auto space-y-4 w-full max-w-full">
        {/* 1. COMPACT HERO HEADER & PERIOD FILTERS */}
        <div className="bg-white rounded-2xl border border-[#DFE7F0] p-4 sm:p-5 shadow-[0_2px_8px_rgba(16,42,67,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAF3FF] border border-[#07549A]/20 text-[#07549A] text-[11px] font-bold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-[#07549A]" />
              <span>SERVE-X IMPACT LEADERS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#102033] tracking-tight">
              Champions of Change
            </h1>
            <p className="text-xs sm:text-sm text-[#526780] leading-relaxed max-w-2xl">
              Every verified contribution helps communities move forward. Together, we create stronger and more hopeful communities.
            </p>
          </div>

          {/* Period Filter Tabs */}
          <div className="inline-flex p-1 bg-[#F3F7FB] border border-[#DFE7F0] rounded-xl self-start md:self-center shrink-0">
            {[
              { id: 'all_time', label: 'All Time' },
              { id: 'month', label: 'This Month' },
              { id: 'year', label: 'This Year' },
            ].map((tab) => {
              const active = period === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handlePeriodChange(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${
                    active
                      ? 'bg-[#07549A] text-white shadow-xs'
                      : 'text-[#526780] hover:text-[#102033] hover:bg-white/70'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. THREE HORIZONTAL IMPACT SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Total Verified Impact */}
          <div className="bg-white border border-[#DFE7F0] rounded-2xl p-5 shadow-[0_2px_8px_rgba(16,42,67,0.03)] hover:shadow-xs transition flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#EAF3FF] to-[#D5E7FF] text-[#07549A] flex items-center justify-center shrink-0 ring-1 ring-[#BFDBFE]/60 shadow-xs">
              <IndianRupee className="w-5 h-5 font-bold" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold text-[#7C8DA5] uppercase tracking-wider truncate">
                Total Verified Impact
              </div>
              <div className="text-2xl font-black text-[#102033] mt-0.5 tabular-nums truncate">
                ₹{summary.totalRaised.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-[#059669] font-bold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>100% Verified Contributions</span>
              </div>
            </div>
          </div>

          {/* Card 2: Qualifying Contributions */}
          <div className="bg-white border border-[#DFE7F0] rounded-2xl p-5 shadow-[0_2px_8px_rgba(16,42,67,0.03)] hover:shadow-xs transition flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E6F8F0] to-[#CCF3E1] text-[#059669] flex items-center justify-center shrink-0 ring-1 ring-[#A6F4C5]/60 shadow-xs">
              <Heart className="w-5 h-5 fill-[#059669]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold text-[#7C8DA5] uppercase tracking-wider truncate">
                Qualifying Contributions
              </div>
              <div className="text-2xl font-black text-[#102033] mt-0.5 tabular-nums truncate">
                {summary.totalDonations.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-[#526780] font-medium mt-1 truncate">
                Completed & Section 80G Receipts
              </div>
            </div>
          </div>

          {/* Card 3: Donors Ranked */}
          <div className="bg-white border border-[#DFE7F0] rounded-2xl p-5 shadow-[0_2px_8px_rgba(16,42,67,0.03)] hover:shadow-xs transition flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] text-[#0F766E] flex items-center justify-center shrink-0 ring-1 ring-[#99F6E4]/60 shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold text-[#7C8DA5] uppercase tracking-wider truncate">
                Donors Ranked
              </div>
              <div className="text-2xl font-black text-[#102033] mt-0.5 tabular-nums truncate">
                {summary.activeDonors.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-[#526780] font-medium mt-1 truncate">
                Eligible Public Champions
              </div>
            </div>
          </div>
        </div>

        {/* 3. OPTIONAL AUTHENTICATED DONOR STANDING CALLOUT */}
        {isAuthenticated && user?.role === 'donor' && myStanding && (
          <div className="bg-gradient-to-r from-[#102A43] via-[#07549A] to-[#0F766E] rounded-2xl px-5 py-3.5 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  {myStanding.rank
                    ? `You are ranked #${myStanding.rank} of ${myStanding.totalDonors} public champions!`
                    : 'Contribute to a verified cause to appear on the public leaderboard.'}
                </div>
                <div className="text-[11px] text-blue-100">
                  Total Contributed: <strong className="text-white font-bold tabular-nums">₹{myStanding.verifiedContributionTotal.toLocaleString('en-IN')}</strong> across{' '}
                  <strong className="text-white font-bold">{myStanding.qualifyingDonationCount}</strong> donation{myStanding.qualifyingDonationCount === 1 ? '' : 's'}.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={togglePublicPreference}
                disabled={updatingPref}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-xs transition cursor-pointer disabled:opacity-50"
              >
                {myStanding.isPublicDonor ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Public Status: Shown</span>
                  </>
                ) : (
                  <>
                    <ShieldOff className="w-3.5 h-3.5 text-gray-300" />
                    <span>Public Status: Anonymous</span>
                  </>
                )}
              </button>

              <Link
                to="/donor/give-cash"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-xs transition"
              >
                <span>Donate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* 4. THREE HORIZONTAL TOP DONOR CARDS (GOLD, SILVER, BRONZE) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#7C8DA5] flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-[#07549A]" />
              <span>Top Community Champions</span>
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-36 bg-white border border-[#DFE7F0] rounded-2xl" />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center text-xs text-red-700">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-stretch">
              {/* #1 GOLD CHAMPION */}
              {topDonors[0] ? (
                <div className="bg-gradient-to-b from-[#FFFDF7] to-white border-2 border-amber-300 rounded-2xl p-4 shadow-sm relative flex flex-col justify-between hover:border-amber-400 transition-all h-full">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[11px] font-black uppercase tracking-wider shadow-xs">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>#1 Gold Champion</span>
                    </span>
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      {topDonors[0].qualifyingDonationCount} verified
                    </span>
                  </div>

                  <div className="flex items-center gap-3 my-1">
                    <div className="w-11 h-11 rounded-full border-2 border-amber-400 bg-amber-50 text-amber-800 font-black text-sm flex items-center justify-center shrink-0 shadow-xs uppercase">
                      {topDonors[0].avatarUrl ? (
                        <img src={topDonors[0].avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        getInitials(topDonors[0].displayName)
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-extrabold text-[#102033] text-sm truncate">
                        {topDonors[0].displayName}
                      </div>
                      <div className="text-[11px] text-amber-800/80 truncate">
                        {topDonors[0].campaignImpactDescription || 'Pillaring community change'}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-amber-100 flex items-baseline justify-between mt-1">
                    <span className="text-[11px] font-semibold text-[#7C8DA5] uppercase">Total Impact</span>
                    <span className="text-xl font-black text-[#059669] tabular-nums">
                      ₹{topDonors[0].verifiedContributionTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ) : (
                /* Empty Fallback Slot #1 */
                <div className="bg-gradient-to-b from-[#FFFDF7] to-white border border-dashed border-amber-300 rounded-2xl p-4 relative flex flex-col justify-between h-full">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold uppercase tracking-wider">
                      <Trophy className="w-3.5 h-3.5 text-amber-600" />
                      <span>#1 Gold Champion</span>
                    </span>
                    <span className="text-[11px] font-medium text-amber-700 bg-amber-50/80 border border-amber-200 px-2 py-0.5 rounded-md">
                      Open Slot
                    </span>
                  </div>
                  <div className="flex items-center gap-3 my-1">
                    <div className="w-11 h-11 rounded-full border-2 border-dashed border-amber-400 bg-amber-50 text-amber-700 font-bold text-sm flex items-center justify-center shrink-0">
                      <Trophy className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-[#102033] text-sm">Gold Champion Awaited</div>
                      <div className="text-[11px] text-[#526780]">Be the first to claim rank #1</div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-amber-100 flex items-baseline justify-between mt-1">
                    <span className="text-[11px] font-semibold text-[#7C8DA5] uppercase">Podium Rank</span>
                    <Link to="/campaigns" className="text-xs font-bold text-[#07549A] hover:underline flex items-center gap-1">
                      <span>Donate Now</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}

              {/* #2 SILVER CHAMPION */}
              {topDonors[1] ? (
                <div className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-4 shadow-xs relative flex flex-col justify-between transition-all h-full">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300 text-[11px] font-bold uppercase tracking-wider">
                      <Medal className="w-3.5 h-3.5 text-slate-500" />
                      <span>#2 Silver Champion</span>
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                      {topDonors[1].qualifyingDonationCount} verified
                    </span>
                  </div>

                  <div className="flex items-center gap-3 my-1">
                    <div className="w-11 h-11 rounded-full border-2 border-slate-300 bg-slate-50 text-slate-700 font-bold text-sm flex items-center justify-center shrink-0 uppercase">
                      {topDonors[1].avatarUrl ? (
                        <img src={topDonors[1].avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        getInitials(topDonors[1].displayName)
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-[#102033] text-sm truncate">
                        {topDonors[1].displayName}
                      </div>
                      <div className="text-[11px] text-[#526780] truncate">
                        {topDonors[1].campaignImpactDescription || 'Generous community contributor'}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#DFE7F0] flex items-baseline justify-between mt-1">
                    <span className="text-[11px] font-semibold text-[#7C8DA5] uppercase">Total Impact</span>
                    <span className="text-xl font-black text-[#07549A] tabular-nums">
                      ₹{topDonors[1].verifiedContributionTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ) : (
                /* Empty Fallback Slot #2 */
                <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-4 relative flex flex-col justify-between h-full">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-wider">
                      <Medal className="w-3.5 h-3.5 text-slate-500" />
                      <span>#2 Silver Champion</span>
                    </span>
                    <span className="text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                      Open Slot
                    </span>
                  </div>
                  <div className="flex items-center gap-3 my-1">
                    <div className="w-11 h-11 rounded-full border-2 border-dashed border-slate-300 bg-slate-50 text-slate-600 font-bold text-sm flex items-center justify-center shrink-0">
                      <Medal className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-[#102033] text-sm">Silver Champion Awaited</div>
                      <div className="text-[11px] text-[#526780]">Claim the #2 spot on the podium</div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#DFE7F0] flex items-baseline justify-between mt-1">
                    <span className="text-[11px] font-semibold text-[#7C8DA5] uppercase">Podium Rank</span>
                    <Link to="/campaigns" className="text-xs font-bold text-[#07549A] hover:underline flex items-center gap-1">
                      <span>Donate Now</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}

              {/* #3 BRONZE CHAMPION */}
              {topDonors[2] ? (
                <div className="bg-white border border-amber-700/20 hover:border-amber-700/35 rounded-2xl p-4 shadow-xs relative flex flex-col justify-between transition-all h-full">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold uppercase tracking-wider">
                      <Award className="w-3.5 h-3.5 text-amber-700" />
                      <span>#3 Bronze Champion</span>
                    </span>
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-50/70 border border-amber-200 px-2 py-0.5 rounded-md">
                      {topDonors[2].qualifyingDonationCount} verified
                    </span>
                  </div>

                  <div className="flex items-center gap-3 my-1">
                    <div className="w-11 h-11 rounded-full border-2 border-amber-700/30 bg-amber-50 text-amber-900 font-bold text-sm flex items-center justify-center shrink-0 uppercase">
                      {topDonors[2].avatarUrl ? (
                        <img src={topDonors[2].avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        getInitials(topDonors[2].displayName)
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-[#102033] text-sm truncate">
                        {topDonors[2].displayName}
                      </div>
                      <div className="text-[11px] text-[#526780] truncate">
                        {topDonors[2].campaignImpactDescription || 'Committed change maker'}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#DFE7F0] flex items-baseline justify-between mt-1">
                    <span className="text-[11px] font-semibold text-[#7C8DA5] uppercase">Total Impact</span>
                    <span className="text-xl font-black text-[#07549A] tabular-nums">
                      ₹{topDonors[2].verifiedContributionTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ) : (
                /* Empty Fallback Slot #3 */
                <div className="bg-gradient-to-b from-[#FFFDF9] to-white border border-dashed border-amber-600/30 hover:border-amber-600/50 rounded-2xl p-4 shadow-xs relative flex flex-col justify-between transition-all h-full">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold uppercase tracking-wider">
                      <Award className="w-3.5 h-3.5 text-amber-700" />
                      <span>#3 Bronze Champion</span>
                    </span>
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-50/70 border border-amber-200 px-2 py-0.5 rounded-md">
                      Open Slot
                    </span>
                  </div>

                  <div className="flex items-center gap-3 my-1">
                    <div className="w-11 h-11 rounded-full border-2 border-dashed border-amber-600/40 bg-amber-50/60 text-amber-800 font-bold text-sm flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-amber-700" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-[#102033] text-sm">
                        Bronze Champion Awaited
                      </div>
                      <div className="text-[11px] text-[#526780]">
                        Donate to join our podium champions
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-amber-100 flex items-baseline justify-between mt-1">
                    <span className="text-[11px] font-semibold text-[#7C8DA5] uppercase">Podium Rank</span>
                    <Link
                      to="/campaigns"
                      className="text-xs font-bold text-[#07549A] hover:underline flex items-center gap-1"
                    >
                      <span>Donate Now</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 5. COMPACT RECENT VERIFIED CONTRIBUTIONS TABLE */}
        <div className="bg-white border border-[#DFE7F0] rounded-2xl shadow-[0_2px_8px_rgba(16,42,67,0.03)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#DFE7F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-sm text-[#102033] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#07549A]" />
                <span>Recent Verified Contributions</span>
              </h3>
              <p className="text-[11px] text-[#526780]">
                Latest verified donations from our community in {period === 'month' ? 'this month' : period === 'year' ? 'this year' : 'all time'}.
              </p>
            </div>

            <div className="text-xs text-[#7C8DA5] shrink-0 font-medium">
              Showing {recentContributions.length} verified records
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#DFE7F0] text-[11px] font-bold text-[#7C8DA5] uppercase tracking-wider">
                  <th className="py-2.5 px-4 w-14 text-center">#</th>
                  <th className="py-2.5 px-4">Donor</th>
                  <th className="py-2.5 px-4">Campaign</th>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                  <th className="py-2.5 px-4 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFE7F0] text-xs">
                {recentContributions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-xs text-[#7C8DA5]">
                      No verified public contributions recorded for this period yet.
                    </td>
                  </tr>
                ) : (
                  recentContributions.map((contrib, idx) => {
                    const isOwnDonation =
                      isAuthenticated &&
                      user?._id &&
                      String(user._id) === String(contrib.donorId);
                    const isAdmin = isAuthenticated && user?.role === 'admin';
                    const canViewReceipt = isOwnDonation || isAdmin;

                    return (
                      <tr key={contrib._id} className="hover:bg-[#F9FBFC] transition-colors">
                        {/* 1. Rank / Index */}
                        <td className="py-2.5 px-4 text-center">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md font-bold text-[11px] tabular-nums ${
                            idx === 0
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : idx === 1
                              ? 'bg-slate-200 text-slate-700 border border-slate-300'
                              : idx === 2
                              ? 'bg-amber-50 text-amber-900 border border-amber-200'
                              : 'bg-[#F3F7FB] text-[#526780]'
                          }`}>
                            {idx + 1}
                          </span>
                        </td>

                        {/* 2. Donor */}
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#EAF3FF] text-[#07549A] flex items-center justify-center font-bold text-[10px] uppercase shrink-0">
                              {contrib.donorAvatar ? (
                                <img src={contrib.donorAvatar} alt="" className="w-full h-full rounded-full object-cover" />
                              ) : (
                                getInitials(contrib.donorName)
                              )}
                            </div>
                            <div className="font-bold text-[#102033] truncate max-w-[140px]">
                              {contrib.donorName}
                            </div>
                          </div>
                        </td>

                        {/* 3. Campaign */}
                        <td className="py-2.5 px-4">
                          <div className="text-[#526780] font-medium truncate max-w-[220px]" title={contrib.campaignTitle}>
                            {contrib.campaignTitle}
                          </div>
                        </td>

                        {/* 4. Date */}
                        <td className="py-2.5 px-4 whitespace-nowrap text-[#7C8DA5]">
                          {new Date(contrib.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>

                        {/* 5. Amount */}
                        <td className="py-2.5 px-4 text-right tabular-nums font-black text-[#059669]">
                          ₹{contrib.amount.toLocaleString('en-IN')}
                        </td>

                        {/* 6. Status */}
                        <td className="py-2.5 px-4 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E6F8F0] text-[#059669] border border-[#A6F4C5]">
                            <ShieldCheck className="w-3 h-3 text-[#059669]" />
                            <span>Verified</span>
                          </span>
                        </td>

                        {/* 7. Receipt */}
                        <td className="py-2.5 px-4 text-center whitespace-nowrap">
                          {canViewReceipt ? (
                            <button
                              type="button"
                              onClick={() => handleViewReceipt(contrib.receiptNumber, contrib.donorId)}
                              disabled={loadingReceiptId === contrib.receiptNumber}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#EAF3FF] hover:bg-[#D5E6FF] text-[#07549A] text-[11px] font-bold transition cursor-pointer"
                              title="View Section 80G Tax Receipt"
                            >
                              <FileText className="w-3 h-3" />
                              <span>Receipt</span>
                            </button>
                          ) : (
                            <span
                              className="inline-flex items-center gap-1 text-[11px] text-[#7C8DA5] cursor-default"
                              title="Receipts are private and only viewable by the contributing donor"
                            >
                              <Lock className="w-3 h-3 text-[#7C8DA5]" />
                              <span>Private</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-3 border-t border-[#DFE7F0] flex items-center justify-between bg-[#F8FAFC] text-[11px] text-[#7C8DA5]">
            <div>
              Platform contributions are audited and verified via Razorpay test gateway.
            </div>
            <Link
              to="/campaigns"
              className="font-bold text-[#07549A] hover:underline flex items-center gap-1"
            >
              <span>Explore Active Campaigns</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Section 80G Tax Receipt Modal */}
      <ReceiptModal
        receipt={selectedReceipt}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
};
