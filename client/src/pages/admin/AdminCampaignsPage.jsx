import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Clock, Check, X, ShieldCheck, IndianRupee } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export const AdminCampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending_review');

  useEffect(() => {
    fetchCampaigns();
  }, [statusFilter]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const url =
        statusFilter === 'pending_review'
          ? '/admin/campaigns/pending'
          : `/campaigns?status=${statusFilter}`;
      const res = await api.get(url);
      if (res.data?.success) {
        setCampaigns(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin campaigns', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id, status, reason = '') => {
    try {
      const res = await api.patch(`/admin/campaigns/${id}/review`, { status, reason });
      if (res.data?.success) {
        toast.success(`Campaign marked as ${status}`);
        fetchCampaigns();
      }
    } catch (err) {
      toast.error('Failed to update campaign review');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101828]">
              Fundraiser Moderation Queue
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Review campaign goals, fund usage plans, and public publishing requests.
            </p>
          </div>

          <div className="flex bg-white p-1 rounded-2xl border border-gray-200">
            {['pending_review', 'active', 'all'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-4 py-1.5 text-xs font-bold rounded-xl capitalize transition ${
                  statusFilter === st
                    ? 'bg-[#07549A] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20">
            <LoadingSpinner message="Loading campaigns for review..." />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E5EAF0]">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-base text-[#101828]">Queue is Clean</h3>
            <p className="text-xs text-gray-500 mt-1">No campaigns are pending review in this view.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((camp) => (
              <div
                key={camp._id}
                className="bg-white rounded-3xl p-6 border border-[#E5EAF0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg text-[#101828]">{camp.title}</h3>
                    <StatusBadge status={camp.status} />
                  </div>

                  <p className="text-xs text-gray-500">
                    Organizer: <strong className="text-gray-800">{camp.ngoId?.organizationName}</strong> • Category: {camp.causeCategory} • City: {camp.city}
                  </p>
                  <p className="text-xs font-bold text-emerald-700">
                    Target Goal: ₹{camp.goalAmount?.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-[#475467] leading-relaxed">
                    {camp.description}
                  </p>
                  <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-600">
                    <strong>Fund Usage Plan:</strong> {camp.fundUsagePlan}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {camp.status !== 'active' && (
                    <button
                      onClick={() => handleReview(camp._id, 'active')}
                      className="px-4 py-2 bg-[#00B98B] hover:bg-[#009E77] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Approve & Publish
                    </button>
                  )}
                  {camp.status !== 'rejected' && (
                    <button
                      onClick={() => handleReview(camp._id, 'rejected', 'Does not meet guideline criteria')}
                      className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
