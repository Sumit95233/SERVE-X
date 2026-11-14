import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import {
  IndianRupee,
  ShieldCheck,
  Clock,
  Heart,
  TrendingUp,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';

export const DonorGiveCashPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Causes');

  const categories = [
    'All Causes',
    'Disaster Relief',
    'Education',
    'Hunger Relief',
    'Healthcare',
    'Child Welfare',
    'Elderly Care',
    'Animal Welfare',
  ];

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category && category !== 'All Causes') params.append('category', category);

        const res = await api.get(`/campaigns?${params.toString()}`);
        if (res.data?.success) {
          setCampaigns(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load campaigns', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [search, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#07549A] to-[#00B98B] rounded-3xl p-8 text-white mb-8 shadow-sm">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Monetary Giving with 80G Tax Exemption
          </div>
          <h1 className="text-3xl font-black mb-3">Give Cash to Verified Causes</h1>
          <p className="text-white/90 text-sm leading-relaxed">
            Every contribution directly empowers families and verified NGOs on the ground.
            Track your donations, receive instant 80G receipts, and watch your impact unfold.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns, causes, or locations..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#07549A]/20 focus:border-[#07549A] transition"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-gray-400 shrink-0 hidden sm:block" />
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                category === c
                  ? 'bg-[#07549A] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <LoadingSpinner message="Loading fundraising campaigns..." />
        </div>
      ) : campaigns.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No campaigns found"
          description="Try selecting a different cause category or clearing your search keywords."
          actionText="View All Causes"
          onAction={() => {
            setSearch('');
            setCategory('All Causes');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((camp) => {
            const progress = Math.min(
              100,
              Math.round(((camp.amountRaised || 0) / (camp.goalAmount || 1)) * 100)
            );
            return (
              <div
                key={camp._id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col group"
              >
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={
                      camp.imageUrl ||
                      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop&q=80'
                    }
                    alt={camp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-xs font-bold text-[#07549A] shadow-xs">
                    {camp.causeCategory}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                      <span className="font-semibold text-gray-700">
                        {camp.ngoId?.organizationName || 'Verified Partner'}
                      </span>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#00B98B]" />
                    </div>

                    <h3 className="font-bold text-base text-[#101828] mb-2 line-clamp-2">
                      {camp.title}
                    </h3>

                    <p className="text-xs text-[#64748B] line-clamp-2 mb-4">
                      {camp.description}
                    </p>
                  </div>

                  <div>
                    {/* Progress */}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-[#101828]">
                          ₹{(camp.amountRaised || 0).toLocaleString('en-IN')} raised
                        </span>
                        <span className="text-gray-500 font-medium">
                          Goal: ₹{(camp.goalAmount || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#07549A] to-[#00B98B] h-full rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-gray-400 font-medium pt-1">
                        <span>{progress}% funded</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Active
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/campaigns/${camp._id}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#07549A] hover:bg-[#003B64] text-white rounded-xl text-xs font-bold shadow-xs transition"
                    >
                      <IndianRupee className="w-3.5 h-3.5" />
                      <span>Donate to this Campaign</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
