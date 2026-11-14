import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import {
  Search,
  MapPin,
  ShieldCheck,
  Building2,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  Flame,
  RotateCcw,
  Heart,
  Package,
  Sparkles,
} from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { DirectDonationModal } from '../../components/common/DirectDonationModal';
import { ReceiptModal } from '../../components/common/ReceiptModal';
import { useAuth } from '../../context/AuthContext';

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
  'Clothing & Dignity',
  'Child Nutrition',
  'Livelihood',
  'Environment & Climate',
  'Rural & Village Development',
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

export const NgoDirectoryPage = () => {
  const { user } = useAuth();
  const isNgo = user?.role === 'ngo';
  const [searchParams, setSearchParams] = useSearchParams();

  // Search and filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [state, setState] = useState(searchParams.get('state') || 'All States & UTs');
  const [cause, setCause] = useState(searchParams.get('cause') || 'All Causes');
  const [sort, setSort] = useState(searchParams.get('sort') || 'recent');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });
  const [summary, setSummary] = useState({
    totalVerifiedNgos: 366,
    citiesRepresented: 350,
    statesRepresented: 36,
    totalActiveCampaigns: 365,
  });

  // Donation & Receipt Modal states
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [donationTargetNgo, setDonationTargetNgo] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);

  const searchDebounceRef = useRef(null);

  // Synchronize state with URL search params
  const updateUrlParams = useCallback(
    (newParams) => {
      const params = new URLSearchParams(searchParams);
      Object.entries(newParams).forEach(([key, val]) => {
        if (val && val !== 'All States & UTs' && val !== 'All Causes') {
          params.set(key, val);
        } else {
          params.delete(key);
        }
      });
      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const fetchNgos = useCallback(
    async (searchQuery, stateQuery, causeQuery, sortQuery, pageNum) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (searchQuery && searchQuery.trim()) params.append('search', searchQuery.trim());
        if (stateQuery && stateQuery !== 'All States & UTs') params.append('state', stateQuery);
        if (causeQuery && causeQuery !== 'All Causes') params.append('cause', causeQuery);
        if (sortQuery) params.append('sort', sortQuery);
        params.append('page', pageNum.toString());
        params.append('limit', '12');

        const res = await api.get(`/ngos?${params.toString()}`);
        if (res.data?.success) {
          setNgos(res.data.data || []);
          if (res.data.pagination) {
            setPagination(res.data.pagination);
          }
          if (res.data.summary) {
            setSummary((prev) => ({
              ...prev,
              ...res.data.summary,
            }));
          }
        }
      } catch (err) {
        console.error('Failed to load NGOs', err);
        setError('Unable to load verified organizations. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchNgos(search, state, cause, sort, page);
  }, [fetchNgos, search, state, cause, sort, page]);

  // Handle Search Input with debounce
  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      updateUrlParams({ search: val, page: 1 });
    }, 300);
  };

  const handleStateChange = (val) => {
    setState(val);
    setPage(1);
    updateUrlParams({ state: val === 'All States & UTs' ? '' : val, page: 1 });
  };

  const handleCauseChange = (val) => {
    setCause(val);
    setPage(1);
    updateUrlParams({ cause: val === 'All Causes' ? '' : val, page: 1 });
  };

  const handleSortChange = (val) => {
    setSort(val);
    setPage(1);
    updateUrlParams({ sort: val, page: 1 });
  };

  const handleClearSearch = () => {
    setSearch('');
    setPage(1);
    updateUrlParams({ search: '', page: 1 });
  };

  const handleResetFilters = () => {
    setSearch('');
    setState('All States & UTs');
    setCause('All Causes');
    setSort('recent');
    setPage(1);
    setSearchParams({}, { replace: true });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPage(newPage);
    updateUrlParams({ page: newPage });
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  const activeFilterCount =
    (search ? 1 : 0) +
    (state && state !== 'All States & UTs' ? 1 : 0) +
    (cause && cause !== 'All Causes' ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#F4F7FB] w-full max-w-full overflow-x-hidden">
      {/* 1. UPGRADED PREMIUM DIRECTORY HERO */}
      <section className="relative bg-gradient-to-b from-white via-[#F8FAFD] to-[#F1F5F9] border-b border-[#E2E8F0] pt-10 pb-9 px-4 sm:px-6 lg:px-8 text-center w-full max-w-full overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-36 bg-gradient-to-r from-blue-100/50 via-emerald-100/40 to-indigo-100/50 blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 max-w-[840px] mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50/90 text-[#07549A] border border-blue-200/90 text-xs font-bold tracking-wide shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Govt Darpan & 80G Audited Organizations</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#14263D] tracking-tight">
            Discover NGOs Making a Difference
          </h1>

          <p className="text-xs sm:text-sm text-[#526780] leading-relaxed max-w-2xl mx-auto font-medium">
            Connect directly with verified non-profits across all 36 States & UTs of India. Support critical grassroots missions, track real-time fundraisers, and obtain instant Section 80G tax exemption receipts.
          </p>
        </div>

        {/* 2. TAGDA SUMMARY METRICS CARDS */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-4xl mx-auto mt-7 text-left">
          {/* Stat 1: Verified Non-Profits */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-emerald-100 p-4 shadow-[0_4px_16px_rgba(5,150,105,0.06)] hover:border-emerald-300 transition-all flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black text-slate-900 tabular-nums">
                  {summary.totalVerifiedNgos || 366}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  100% Audited
                </span>
              </div>
              <div className="text-xs text-slate-600 font-semibold mt-0.5">
                Verified Organizations
              </div>
            </div>
          </div>

          {/* Stat 2: Pan-India States & Cities */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-blue-100 p-4 shadow-[0_4px_16px_rgba(7,84,154,0.06)] hover:border-blue-300 transition-all flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-[#07549A] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black text-[#07549A] tabular-nums">
                  {summary.statesRepresented || 36} States & UTs
                </span>
              </div>
              <div className="text-xs text-slate-600 font-semibold mt-0.5">
                Across {summary.citiesRepresented || 350}+ Indian Cities
              </div>
            </div>
          </div>

          {/* Stat 3: Active Campaigns */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-amber-100 p-4 shadow-[0_4px_16px_rgba(217,119,6,0.06)] hover:border-amber-300 transition-all flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black text-amber-600 tabular-nums">
                  {summary.totalActiveCampaigns || 365}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Live
                </span>
              </div>
              <div className="text-xs text-slate-600 font-semibold mt-0.5">
                Active Fundraisers
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN DIRECTORY CONTAINER (Max 1360px centered) */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
        {/* Search, State Selector, Cause Filter, and Sort Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input (5 Cols on Desktop) */}
            <div className="col-span-12 md:col-span-4 lg:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search NGOs by name, cause or mission..."
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#84ADFF] focus:bg-white transition"
                aria-label="Search organizations by name or cause"
              />
              {search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* State & UT Filter (3 Cols on Desktop) */}
            <div className="col-span-12 sm:col-span-4 md:col-span-3 lg:col-span-3">
              <select
                value={state}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#84ADFF] focus:bg-white transition cursor-pointer font-medium"
                aria-label="Filter by State or UT"
              >
                <option value="All States & UTs">All States & UTs (36)</option>
                {INDIAN_STATES.filter((s) => s !== 'All States & UTs').map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Cause Filter (2 Cols on Desktop) */}
            <div className="col-span-12 sm:col-span-4 md:col-span-3 lg:col-span-2">
              <select
                value={cause}
                onChange={(e) => handleCauseChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#84ADFF] focus:bg-white transition cursor-pointer font-medium"
                aria-label="Filter by Cause"
              >
                <option value="All Causes">All Causes</option>
                {CAUSE_CATEGORIES.filter((c) => c !== 'All Causes').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options (2 Cols on Desktop) */}
            <div className="col-span-12 sm:col-span-4 md:col-span-2 lg:col-span-2">
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#84ADFF] focus:bg-white transition cursor-pointer"
                aria-label="Sort NGOs by"
              >
                <option value="recent">Recently Added</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="campaigns">Most Campaigns</option>
              </select>
            </div>
          </div>

          {/* Quick Focus State Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 flex items-center gap-1 mr-1">
              <MapPin className="w-3 h-3 text-[#07549A]" />
              <span>Quick Focus:</span>
            </span>
            {QUICK_FOCUS_REGIONS.map((item) => {
              const isSelected =
                state === item.state ||
                (state === 'All States & UTs' && item.state === 'All States & UTs');
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleStateChange(item.state)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#07549A] text-white shadow-2xs font-bold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Active Filter Chips and Result Count Bar */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500 font-medium">
                Showing{' '}
                <strong className="text-slate-900 font-bold">
                  {pagination.total}
                </strong>{' '}
                verified {pagination.total === 1 ? 'organization' : 'organizations'}
              </span>

              {/* Filter Chips */}
              {search && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-[#07549A] font-semibold text-[11px] border border-blue-200">
                  <span>Search: &ldquo;{search}&rdquo;</span>
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="hover:text-blue-900 cursor-pointer ml-0.5"
                    aria-label="Remove search filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {state && state !== 'All States & UTs' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-[#07549A] font-semibold text-[11px] border border-blue-200">
                  <span>State: {state}</span>
                  <button
                    type="button"
                    onClick={() => handleStateChange('All States & UTs')}
                    className="hover:text-blue-900 cursor-pointer ml-0.5"
                    aria-label="Remove state filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {cause && cause !== 'All Causes' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold text-[11px] border border-emerald-200">
                  <span>Cause: {cause}</span>
                  <button
                    type="button"
                    onClick={() => handleCauseChange('All Causes')}
                    className="hover:text-emerald-950 cursor-pointer ml-0.5"
                    aria-label="Remove cause filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 font-semibold text-xs cursor-pointer transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* 4. NGO CARDS GRID (3 desktop, 2 tablet, 1 mobile, 24px gap) */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner message="Searching verified NGO directory..." />
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-red-200 p-8 text-center max-w-md mx-auto space-y-3">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto font-bold">
              !
            </div>
            <h3 className="font-bold text-[#14263D]">{error}</h3>
            <button
              type="button"
              onClick={() => fetchNgos(search, state, cause, sort, page)}
              className="px-4 py-2 bg-[#07549A] text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : ngos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-800">
              No organizations match your current search
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We couldn&apos;t find any verified organizations matching your specified filters. Try searching with a broader keyword or clear your filters.
            </p>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-[#07549A] text-white text-xs font-bold rounded-xl hover:bg-[#06457E] transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ngos.map((ngo) => (
              <article
                key={ngo._id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 shadow-[0_2px_8px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] transition-all duration-300 flex flex-col justify-between group focus-within:ring-2 focus-within:ring-[#84ADFF] overflow-hidden"
              >
                {/* 4.1 Sleek Top Gradient Line */}
                <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500" />

                {/* 4.2 Card Body: Clean Natural Flow (Zero negative margins, Zero collisions!) */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Header Row: Logo on Left + Info & Badges on Right */}
                  <div className="flex items-start gap-3.5 mb-3.5">
                    <img
                      src={
                        ngo.logo ||
                        'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=160&h=160&fit=crop'
                      }
                      alt={`${ngo.organizationName} Logo`}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=160&h=160&fit=crop';
                      }}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 bg-slate-50 shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-xs"
                    />

                    <div className="min-w-0 flex-1 space-y-1.5">
                      {/* Cause Category + Verified Badge */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs ${getCauseBadgeStyle(
                            ngo.causeCategories?.[0]
                          )}`}
                        >
                          {ngo.causeCategories?.[0] || 'Humanitarian'}
                        </span>
                        {ngo.verificationStatus === 'verified' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>

                      {/* Location & Darpan ID */}
                      <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        <div className="flex items-center gap-1 text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-[#07549A] shrink-0" />
                          <span className="truncate max-w-[150px] font-medium text-slate-700">
                            {ngo.city ? `${ngo.city}, ${ngo.state}` : ngo.state || 'India'}
                          </span>
                        </div>
                        {ngo.darpanId ? (
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            {ngo.darpanId}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-[#07549A] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                            80G
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Organization Title */}
                  <h2 className="font-bold text-[15px] sm:text-base text-slate-900 group-hover:text-[#07549A] transition-colors leading-snug line-clamp-2 min-h-[2.6rem]">
                    <Link to={`/ngos/${ngo._id}`} className="focus:outline-none">
                      {ngo.organizationName}
                    </Link>
                  </h2>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                    {ngo.description ||
                      'Dedicated to transparent grassroots action, community uplifting and impactful humanitarian outreach.'}
                  </p>

                  {/* Cause Categories Pills */}
                  {ngo.causeCategories?.length > 1 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {ngo.causeCategories.slice(1, 3).map((cat, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Metrics Row: Active Fundraisers & Urgent Needs */}
                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="font-bold text-slate-900">
                        {ngo.activeCampaignsCount || 0}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {ngo.activeCampaignsCount === 1 ? 'Fundraiser' : 'Fundraisers'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium justify-end">
                      <Package className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="font-bold text-slate-900">
                        {ngo.activeRequirementsCount || 0}
                      </span>
                      <span className="text-[11px] text-slate-500">Urgent Needs</span>
                    </div>
                  </div>

                  {/* 4.3 Equal & Complementary Action Buttons */}
                  <div className="pt-3.5 mt-auto">
                    {isNgo ? (
                      /* Strictly NGO Workspace View: Single profile view button, no donate button */
                      <Link
                        to={`/ngos/${ngo._id}`}
                        className="w-full h-9 rounded-xl bg-blue-50 hover:bg-[#07549A] text-[#07549A] hover:text-white border border-blue-200 hover:border-[#07549A] font-bold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap"
                      >
                        <span>View Organization Profile</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      /* Donor & Guest View: Perfectly equal 50/50 complementary buttons */
                      <div className="grid grid-cols-2 gap-2 w-full">
                        <button
                          type="button"
                          onClick={() => {
                            setDonationTargetNgo(ngo);
                            setIsDonationModalOpen(true);
                          }}
                          className="h-9 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-sm active:scale-[0.98] whitespace-nowrap"
                        >
                          <Heart className="w-3.5 h-3.5 fill-current" />
                          <span>Donate ₹</span>
                        </button>

                        <Link
                          to={`/ngos/${ngo._id}`}
                          className="h-9 px-2 rounded-xl bg-[#07549A] hover:bg-[#06457E] text-white font-bold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-sm active:scale-[0.98] whitespace-nowrap"
                        >
                          <span>View Profile</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* 5. MODERN NUMBERED PAGINATION CONTROLS */}
        {pagination.totalPages > 1 && (
          <nav
            className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-8 pb-4"
            aria-label="NGO Directory Pagination"
          >
            <button
              type="button"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            {/* Dynamic Page Number Pills */}
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter((p) => {
                if (p === 1 || p === pagination.totalPages) return true;
                if (Math.abs(p - page) <= 2) return true;
                return false;
              })
              .map((p, idx, arr) => {
                const prevP = arr[idx - 1];
                const hasGap = prevP && p - prevP > 1;

                return (
                  <React.Fragment key={p}>
                    {hasGap && (
                      <span className="px-1 text-slate-400 font-bold text-xs">...</span>
                    )}
                    <button
                      type="button"
                      onClick={() => handlePageChange(p)}
                      className={`h-9 min-w-9 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        page === p
                          ? 'bg-[#07549A] text-white shadow-2xs font-extrabold'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              type="button"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= pagination.totalPages}
              className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
              aria-label="Next page"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </nav>
        )}
      </main>

      {/* Direct Donation Modal with Instant 80G Receipt generation */}
      <DirectDonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        ngo={donationTargetNgo}
        onDonationSuccess={(receipt) => {
          setActiveReceipt(receipt);
          setIsReceiptOpen(true);
          fetchNgos(search, state, cause, sort, page);
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
