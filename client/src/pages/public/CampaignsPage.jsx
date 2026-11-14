import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  Clock,
  ShieldCheck,
  TrendingUp,
  Heart,
  ArrowRight,
  Filter,
  MapPin,
  Building2,
  Users,
  Award,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Compass,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { DirectDonationModal } from '../../components/common/DirectDonationModal';
import { ReceiptModal } from '../../components/common/ReceiptModal';

// All 36 Indian States & UTs for geographical discovery
const INDIAN_STATES = [
  'All States & UTs',
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

const CAUSE_CATEGORIES = [
  'All Causes',
  'Education',
  'Healthcare',
  'Hunger Relief',
  'Child Welfare',
  'Elderly Care',
  'Animal Welfare',
  'Disaster Relief',
  'Community Development',
  'Women Empowerment',
];

const QUICK_FOCUS_REGIONS = [
  { label: 'All India', state: 'All States & UTs' },
  { label: 'Delhi', state: 'Delhi' },
  { label: 'Maharashtra', state: 'Maharashtra' },
  { label: 'Karnataka', state: 'Karnataka' },
  { label: 'West Bengal', state: 'West Bengal' },
  { label: 'Tamil Nadu', state: 'Tamil Nadu' },
  { label: 'Uttar Pradesh', state: 'Uttar Pradesh' },
  { label: 'Assam', state: 'Assam' },
  { label: 'Gujarat', state: 'Gujarat' },
  { label: 'Rajasthan', state: 'Rajasthan' },
  { label: 'Bihar', state: 'Bihar' },
  { label: 'Kerala', state: 'Kerala' },
  { label: 'Jammu & Kashmir', state: 'Jammu and Kashmir' },
];

export const CampaignsPage = () => {
  const { user } = useAuth();
  const isNgo = user?.role === 'ngo';
  const [searchParams, setSearchParams] = useSearchParams();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All Causes');
  const [state, setState] = useState(searchParams.get('state') || 'All States & UTs');
  const [sort, setSort] = useState(searchParams.get('sort') || 'recent');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [limit, setLimit] = useState(12);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  // Direct Donation & Receipt Modal State
  const [selectedDonationCampaign, setSelectedDonationCampaign] = useState(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (category && category !== 'All Causes') params.append('category', category);
      if (state && state !== 'All States & UTs') params.append('state', state);
      if (sort) params.append('sort', sort);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const res = await api.get(`/campaigns?${params.toString()}`);
      if (res.data?.success && Array.isArray(res.data.data)) {
        setCampaigns(res.data.data);
        if (res.data.pagination) {
          setPagination({
            total: res.data.pagination.total || res.data.data.length,
            totalPages: res.data.pagination.totalPages || 1,
          });
        }
      } else {
        setCampaigns([]);
      }
    } catch (err) {
      console.error('Failed to load campaigns', err);
      setError('Unable to load campaigns. Please verify backend connection and try again.');
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, state, sort, page, limit]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  // Handle direct donation button click on a campaign card
  const handleOpenDonateModal = (camp) => {
    setSelectedDonationCampaign(camp);
    setIsDonationModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All Causes');
    setState('All States & UTs');
    setSort('recent');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] py-8 sm:py-10 w-full max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full max-w-full">
        {/* 1. HERO TITLE & STATS DECK */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"></span>
                <span>All-India Verified Fundraisers</span>
              </span>
              <span className="text-xs text-[#64748B] font-semibold">
                36 States & UTs • 100% On-Ground Verified
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
              Active Humanitarian Campaigns
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              Explore and fund grassroots initiatives across India. Every contribution delivers direct on-ground aid with instant Section 80G tax receipts.
            </p>
          </div>

          {/* Quick Metrics Badge (Responsive Grid on Mobile) */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 w-full sm:w-auto shrink-0">
            <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-center flex-1 sm:min-w-[130px]">
              <div className="text-xl sm:text-2xl font-black text-[#07549A] tabular-nums">
                {pagination.total || 365}
              </div>
              <div className="text-[10px] sm:text-[11px] font-bold text-[#64748B] uppercase tracking-wider mt-0.5">
                Campaigns Active
              </div>
            </div>
            <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl text-center flex-1 sm:min-w-[130px]">
              <div className="text-xl sm:text-2xl font-black text-[#065F46] tabular-nums">
                50%
              </div>
              <div className="text-[10px] sm:text-[11px] font-bold text-[#065F46] uppercase tracking-wider mt-0.5">
                80G Tax Exemption
              </div>
            </div>
          </div>
        </div>

        {/* 2. ADVANCED SEARCH, REGION & CAUSE FILTER DECK */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5">
            {/* Search Input (5 Cols on Large Screens) */}
            <div className="lg:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by campaign title, NGO name, or city..."
                className="w-full pl-10 pr-9 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#101828] placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#07549A] transition"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* State / UT Selector (3.5 Cols) */}
            <div className="lg:col-span-4 relative">
              <select
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  setPage(1);
                }}
                className="w-full appearance-none pl-3.5 pr-8 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm font-semibold text-[#101828] focus:outline-hidden focus:ring-2 focus:ring-[#07549A] transition cursor-pointer"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st === 'All States & UTs' ? 'All States & UTs (36)' : st}
                  </option>
                ))}
              </select>
              <Compass className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort Selector (3.5 Cols) */}
            <div className="lg:col-span-3 relative">
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="w-full appearance-none pl-3.5 pr-8 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm font-semibold text-[#101828] focus:outline-hidden focus:ring-2 focus:ring-[#07549A] transition cursor-pointer"
              >
                <option value="recent">Newly Launched</option>
                <option value="urgent">Most Urgent (Days Left)</option>
                <option value="funded">Most Supported</option>
                <option value="goal_high">Highest Target (₹)</option>
              </select>
              <SlidersHorizontal className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Cause Category Filter Pills */}
          <div className="pt-2 border-t border-gray-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-gray-400" /> Cause:
            </span>
            {CAUSE_CATEGORIES.map((cat) => {
              const isSelected = category === cat || (!category && cat === 'All Causes');
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategory(cat);
                    setPage(1);
                  }}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#07549A] text-white shadow-xs font-bold'
                      : 'bg-[#F1F5F9] text-gray-700 hover:bg-[#E2E8F0]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Quick Focus State Pills (Wrapped gracefully so nothing is cut off) */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400" /> Quick State:
            </span>
            {QUICK_FOCUS_REGIONS.map((region) => {
              const isSelected = state === region.state;
              return (
                <button
                  key={region.label}
                  type="button"
                  onClick={() => {
                    setState(region.state);
                    setPage(1);
                  }}
                  className={`text-xs px-3 py-1 rounded-full font-semibold transition shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#059669] text-white shadow-xs font-bold'
                      : 'bg-[#F1F5F9] text-gray-700 hover:bg-[#E2E8F0]'
                  }`}
                >
                  {region.label}
                </button>
              );
            })}
            {(search || category !== 'All Causes' || state !== 'All States & UTs' || sort !== 'recent') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-[#07549A] hover:underline font-bold ml-2 cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* 3. CAMPAIGNS GRID SECTION */}
        {loading ? (
          <div className="py-24 bg-white rounded-3xl border border-[#E2E8F0] shadow-sm flex items-center justify-center">
            <LoadingSpinner message="Loading all-India active fundraising campaigns..." />
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl border border-red-200 p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <X className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#101828]">{error}</h3>
            <button
              type="button"
              onClick={fetchCampaigns}
              className="px-5 py-2.5 bg-[#07549A] hover:bg-[#06457E] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              Retry Loading
            </button>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-16 text-center max-w-xl mx-auto space-y-4 shadow-sm">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
              <Compass className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-[#101828]">No campaigns match your selected criteria</h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
              We couldn't find fundraisers in the chosen state or cause. Try selecting "All India" or clearing search keywords.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-[#07549A] hover:bg-[#06457E] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              Show All Active Campaigns
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Results Counter Header */}
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold px-1">
              <span>
                Showing <strong className="text-[#101828]">{campaigns.length}</strong> of{' '}
                <strong className="text-[#101828]">{pagination.total}</strong> campaigns{' '}
                {state !== 'All States & UTs' && `in ${state}`}
              </span>
              <span>Page {page} of {pagination.totalPages}</span>
            </div>

            {/* Grid of Rich Campaign Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {campaigns.map((camp) => {
                const ngo = camp.ngoId || {};
                const progress = camp.progressPercentage || Math.min(100, Math.round(((camp.amountRaised || 0) / (camp.goalAmount || 1)) * 100));
                const daysRemaining = camp.daysLeft ?? Math.max(0, Math.ceil((new Date(camp.endDate) - new Date()) / (1000 * 60 * 60 * 24)));

                return (
                  <article
                    key={camp._id}
                    className="bg-white rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-xs hover:shadow-xl hover:border-[#BFDBFE] transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image Header with Category & State Badge */}
                      <div className="h-52 overflow-hidden relative bg-slate-100">
                        <img
                          src={
                            camp.images?.[0] ||
                            'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&fit=crop'
                          }
                          alt={camp.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className="bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
                            {camp.causeCategory}
                          </span>
                        </div>
                        {ngo.state && (
                          <div className="absolute top-3 right-3">
                            <span className="bg-white/95 backdrop-blur-xs text-[#0F172A] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-gray-200 shadow-2xs">
                              {ngo.state}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="p-5 sm:p-6 space-y-3">
                        {/* NGO Organizer Row */}
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl overflow-hidden border border-[#CBD5E1] bg-slate-50 shrink-0">
                            <img
                              src={ngo.logo || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=80&fit=crop'}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-[#101828] truncate">
                                {ngo.organizationName || 'Verified Partner NGO'}
                              </span>
                              <ShieldCheck className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                            </div>
                            <div className="text-[11px] text-gray-500 flex items-center gap-1 truncate">
                              <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                              <span>{camp.city || ngo.city || 'India'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h3 className="font-bold text-base text-[#101828] group-hover:text-[#07549A] transition-colors line-clamp-2 leading-snug mb-1.5">
                            <Link to={`/campaigns/${camp._id}`}>
                              {camp.title}
                            </Link>
                          </h3>
                          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                            {camp.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Funding Progress & Action Buttons */}
                    <div className="px-5 sm:px-6 pb-5 pt-2 border-t border-gray-100 space-y-3.5 mt-auto">
                      {/* Amounts & Percentage */}
                      <div>
                        <div className="flex justify-between items-baseline mb-1.5">
                          <div>
                            <span className="text-lg font-black text-[#101828] tabular-nums">
                              ₹{(camp.amountRaised || 0).toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">
                              of ₹{(camp.goalAmount || 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-[#059669]">
                            {progress}% Funded
                          </span>
                        </div>

                        {/* Gradient Progress Bar */}
                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#07549A] to-[#059669] rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(2, progress))}%` }}
                          />
                        </div>
                      </div>

                      {/* Micro info tags */}
                      <div className="flex items-center justify-between text-[11px] text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-gray-400" />
                          <strong>{camp.donorCount || 0}</strong> Supporters
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>{daysRemaining} days left</span>
                        </span>
                      </div>

                      {/* Equal, Complementary Action Buttons for Donors & Visitors */}
                      {isNgo ? (
                        <Link
                          to={`/campaigns/${camp._id}`}
                          className="w-full h-9 rounded-xl bg-[#EAF3FF] hover:bg-[#07549A] text-[#07549A] hover:text-white border border-[#BFDBFE] hover:border-[#07549A] font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs whitespace-nowrap"
                        >
                          <span>View Campaign Overview</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenDonateModal(camp)}
                            className="h-9 px-3 rounded-xl bg-gradient-to-r from-[#059669] to-[#047857] hover:from-[#047857] hover:to-[#065F46] text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap"
                          >
                            <Heart className="w-3.5 h-3.5 fill-white shrink-0" />
                            <span>Donate ₹</span>
                          </button>

                          <Link
                            to={`/campaigns/${camp._id}`}
                            className="h-9 px-3 rounded-xl bg-[#EAF3FF] hover:bg-[#07549A] text-[#07549A] hover:text-white border border-[#BFDBFE] hover:border-[#07549A] font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer whitespace-nowrap"
                          >
                            <span>View Details</span>
                            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="pt-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-gray-500">
                  Showing page <strong className="text-[#101828]">{page}</strong> of{' '}
                  <strong className="text-[#101828]">{pagination.totalPages}</strong> (Total{' '}
                  {pagination.total} campaigns)
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => {
                      setPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 200, behavior: 'smooth' });
                    }}
                    className="h-9 px-3 rounded-xl border border-[#CBD5E1] bg-white text-xs font-bold text-gray-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  {/* Page Indicator Pills (up to 5 pages) */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNumber = i + 1;
                      if (pagination.totalPages > 5 && page > 3) {
                        pageNumber = page - 2 + i;
                        if (pageNumber > pagination.totalPages) {
                          pageNumber = pagination.totalPages - 4 + i;
                        }
                      }
                      const isCurrent = page === pageNumber;

                      return (
                        <button
                          key={pageNumber}
                          type="button"
                          onClick={() => {
                            setPage(pageNumber);
                            window.scrollTo({ top: 200, behavior: 'smooth' });
                          }}
                          className={`w-9 h-9 rounded-xl text-xs font-bold transition cursor-pointer ${
                            isCurrent
                              ? 'bg-[#07549A] text-white shadow-xs'
                              : 'bg-white border border-[#CBD5E1] text-gray-700 hover:bg-slate-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    disabled={page >= pagination.totalPages}
                    onClick={() => {
                      setPage((p) => Math.min(pagination.totalPages, p + 1));
                      window.scrollTo({ top: 200, behavior: 'smooth' });
                    }}
                    className="h-9 px-3 rounded-xl border border-[#CBD5E1] bg-white text-xs font-bold text-gray-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Direct Donation Modal with Simulated Test Razorpay & instant 80G Receipt */}
      {selectedDonationCampaign && (
        <DirectDonationModal
          isOpen={isDonationModalOpen}
          onClose={() => {
            setIsDonationModalOpen(false);
            setSelectedDonationCampaign(null);
          }}
          ngo={selectedDonationCampaign.ngoId}
          campaignId={selectedDonationCampaign._id}
          campaignTitle={selectedDonationCampaign.title}
          onDonationSuccess={(receipt) => {
            setActiveReceipt(receipt);
            setIsReceiptOpen(true);
            fetchCampaigns();
          }}
        />
      )}

      {/* Official 80G Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        receipt={activeReceipt}
      />
    </div>
  );
};
