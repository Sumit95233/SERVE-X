import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  PlusCircle,
  Clock,
  TrendingUp,
  ShieldCheck,
  IndianRupee,
  Flame,
  Users,
  ExternalLink,
  Share2,
  Calendar,
  X,
  Target,
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export const NgoCampaignsPage = () => {
  const { ngo } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    causeCategory: 'Education',
    goalAmount: 100000,
    city: ngo?.city || 'New Delhi',
    endDate: '',
    beneficiaryDescription: '',
    fundUsagePlan: '',
    imageUrl: '',
  });

  const categories = [
    'Disaster Relief',
    'Child Welfare',
    'Education',
    'Hunger Relief',
    'Healthcare',
    'Elderly Care',
    'Women Empowerment',
    'Animal Welfare',
    'Community Development',
  ];

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await api.get('/campaigns?mine=true');
      if (res.data?.success) {
        setCampaigns(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching NGO campaigns', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (ngo?.verificationStatus !== 'verified') {
      toast.error('Only verified NGOs can create active fundraising campaigns');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        goalAmount: Number(form.goalAmount),
        images: form.imageUrl ? [form.imageUrl] : [],
      };

      const res = await api.post('/campaigns', payload);
      if (res.data?.success) {
        toast.success('Campaign created and published successfully!');
        setShowModal(false);
        setForm({
          title: '',
          description: '',
          causeCategory: 'Education',
          goalAmount: 100000,
          city: ngo?.city || 'New Delhi',
          endDate: '',
          beneficiaryDescription: '',
          fundUsagePlan: '',
          imageUrl: '',
        });
        fetchCampaigns();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create campaign');
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = (campId) => {
    const url = `${window.location.origin}/campaigns/${campId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast.success('Campaign share link copied to clipboard!');
    }
  };

  const totalRaised = campaigns.reduce((acc, c) => acc + (c.amountRaised || 0), 0);
  const totalGoal = campaigns.reduce((acc, c) => acc + (c.targetAmount || c.goalAmount || 0), 0);
  const totalDonors = campaigns.reduce((acc, c) => acc + (c.donorCount || 0), 0);
  const activeCount = campaigns.filter((c) => c.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* 1. Header with Breadcrumb & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#059669] mb-1">
            <span>NGO Workspace</span>
            <span>/</span>
            <span>Fundraising Hub</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
            Fundraising Campaigns
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Launch and monitor verified monetary fundraisers with public goal tracking and Section 80G tax benefit.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Launch New Fundraiser</span>
        </button>
      </div>

      {/* 2. Four Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5] text-[#059669] flex items-center justify-center shrink-0 ring-1 ring-[#A7F3D0]/60 shadow-xs">
            <IndianRupee className="w-5 h-5 font-bold" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider truncate">
              Total Raised
            </div>
            <div className="text-xl font-black text-[#0F172A] mt-0.5 tabular-nums truncate">
              ₹{totalRaised.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-[#059669] font-medium mt-0.5">Across active fundraisers</p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5] text-[#EA580C] flex items-center justify-center shrink-0 ring-1 ring-[#FED7AA]/60 shadow-xs">
            <Flame className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider truncate">
              Live Campaigns
            </div>
            <div className="text-xl font-black text-[#0F172A] mt-0.5 tabular-nums truncate">
              {activeCount}
            </div>
            <p className="text-[11px] text-[#EA580C] font-medium mt-0.5">Accepting contributions</p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] text-[#0284C7] flex items-center justify-center shrink-0 ring-1 ring-[#BAE6FD]/60 shadow-xs">
            <Users className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider truncate">
              Total Backers
            </div>
            <div className="text-xl font-black text-[#0F172A] mt-0.5 tabular-nums truncate">
              {totalDonors}
            </div>
            <p className="text-[11px] text-[#64748B] font-medium mt-0.5">Supporters who contributed</p>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FDF4FF] to-[#F5D0FE] text-[#9333EA] flex items-center justify-center shrink-0 ring-1 ring-[#E9D5FF]/60 shadow-xs">
            <Target className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider truncate">
              Total Target Goal
            </div>
            <div className="text-xl font-black text-[#0F172A] mt-0.5 tabular-nums truncate">
              ₹{totalGoal.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-[#64748B] font-medium mt-0.5">Capital needed for impact</p>
          </div>
        </div>
      </div>

      {/* 3. Campaigns Grid */}
      {loading ? (
        <div className="py-20 bg-white rounded-2xl border border-[#E2E8F0]">
          <LoadingSpinner message="Loading campaigns..." />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#E2E8F0] shadow-xs space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center mx-auto">
            <Flame className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-base text-[#0F172A]">No Fundraisers Published Yet</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            Launch your first fundraising campaign with clear milestone targets to accept tax-deductible donor support.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-[#059669] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Launch First Campaign</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {campaigns.map((camp) => {
            const goal = camp.targetAmount || camp.goalAmount || 1;
            const raised = camp.amountRaised || 0;
            const percent = Math.min(100, Math.round((raised / goal) * 100));

            return (
              <div
                key={camp._id}
                className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full bg-[#F1F5F9] overflow-hidden">
                    <img
                      src={
                        camp.images?.[0] ||
                        'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&fit=crop'
                      }
                      alt={camp.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2.5 py-1 bg-white/95 backdrop-blur-xs text-[#0F172A] rounded-full shadow-xs">
                        {camp.causeCategory}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <StatusBadge status={camp.status || 'active'} />
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <h3 className="font-bold text-sm text-[#0F172A] mb-1.5 line-clamp-1" title={camp.title}>
                      {camp.title}
                    </h3>
                    <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed mb-3">
                      {camp.description}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-[#64748B]">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#94A3B8]" />
                        <span>{camp.donorCount || 0} Supporters</span>
                      </span>
                      {camp.city && (
                        <span>• {camp.city}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 border-t border-[#E2E8F0]">
                  <div className="flex justify-between items-baseline mb-1.5 text-xs">
                    <div>
                      <span className="font-black text-[#059669] text-sm tabular-nums">
                        ₹{raised.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-[#64748B] ml-1">raised</span>
                    </div>
                    <span className="text-[11px] text-[#64748B]">
                      Goal: <strong>₹{goal.toLocaleString('en-IN')}</strong> ({percent}%)
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-gradient-to-r from-[#059669] to-[#10B981] rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <Link
                      to={`/campaigns/${camp._id}`}
                      className="text-xs font-bold text-[#07549A] hover:text-[#06457E] inline-flex items-center gap-1 hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Public Page</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleShare(camp._id)}
                      className="px-2.5 py-1 text-xs font-semibold text-[#475569] hover:bg-[#F1F5F9] rounded-lg transition inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Campaign Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[1200] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-[#CBD5E1] space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center font-bold">
                  📢
                </div>
                <div>
                  <h3 className="text-base font-black text-[#0F172A]">Launch Fundraising Campaign</h3>
                  <p className="text-[11px] text-[#64748B]">Set goal amount, transparency plan, and beneficiary scope</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Mid-Day Meals for 500 Rural Primary School Students"
                  className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                    Cause Category *
                  </label>
                  <select
                    value={form.causeCategory}
                    onChange={(e) => setForm({ ...form, causeCategory: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                    Goal Amount (INR) *
                  </label>
                  <input
                    type="number"
                    min={500}
                    required
                    value={form.goalAmount}
                    onChange={(e) => setForm({ ...form, goalAmount: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                    City / Focus Area *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                    Target End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                  Fundraiser Story & Purpose *
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Explain why this fundraiser is essential, who benefits, and what milestone will be achieved..."
                  className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                  Beneficiary Description *
                </label>
                <input
                  type="text"
                  required
                  value={form.beneficiaryDescription}
                  onChange={(e) => setForm({ ...form, beneficiaryDescription: e.target.value })}
                  placeholder="e.g. 500 girl students enrolled in government primary schools"
                  className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                  Fund Usage Plan Breakdown *
                </label>
                <textarea
                  rows={2}
                  required
                  value={form.fundUsagePlan}
                  onChange={(e) => setForm({ ...form, fundUsagePlan: e.target.value })}
                  placeholder="e.g. 70% Food procurement, 20% Logistics & Kitchen delivery, 10% Administrative overhead"
                  className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                  Cover Photo Image URL
                </label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-xl disabled:opacity-50 shadow-xs cursor-pointer"
                >
                  {submitting ? 'Publishing...' : 'Publish Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};