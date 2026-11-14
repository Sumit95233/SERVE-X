import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import {
  Package,
  Clock,
  CheckCircle2,
  MapPin,
  Phone,
  AlertCircle,
  Handshake,
  Truck,
  ExternalLink,
  Search,
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export const NgoClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const res = await api.get('/items/claims');
      if (res.data?.success) {
        setClaims(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching claims', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReceipt = async (claimId) => {
    try {
      const res = await api.post(`/items/claims/${claimId}/confirm-receipt`);
      if (res.data?.success) {
        toast.success('Item receipt confirmed! Donation marked completed and donor thanked.');
        fetchClaims();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to confirm receipt');
    }
  };

  const filteredClaims = claims.filter((c) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'pending') return c.status === 'pending';
    if (statusFilter === 'in_progress') return c.status === 'accepted' || c.status === 'pickup_scheduled';
    if (statusFilter === 'completed') return c.status === 'completed';
    return true;
  });

  const pendingCount = claims.filter((c) => c.status === 'pending').length;
  const inProgressCount = claims.filter((c) => c.status === 'accepted' || c.status === 'pickup_scheduled').length;
  const completedCount = claims.filter((c) => c.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* 1. Header with Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#059669] mb-1">
            <span>NGO Workspace</span>
            <span>/</span>
            <span>Pickup Operations</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
            Claim Requests & Pickup Coordination
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Coordinate with generous donors across India to confirm item handover and track delivery to your community.
          </p>
        </div>

        <Link
          to="/ngo/items"
          className="px-4 py-2.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2 shrink-0"
        >
          <Package className="w-4 h-4" />
          <span>Browse Available Goods</span>
        </Link>
      </div>

      {/* 2. Status Filter Tabs */}
      <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-[#059669] text-white shadow-xs'
              : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
          }`}
        >
          All Claims ({claims.length})
        </button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1 ${
            statusFilter === 'pending'
              ? 'bg-[#059669] text-white shadow-xs'
              : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Donor Confirmation ({pendingCount})</span>
        </button>
        <button
          onClick={() => setStatusFilter('in_progress')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1 ${
            statusFilter === 'in_progress'
              ? 'bg-[#059669] text-white shadow-xs'
              : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Ready for Pickup ({inProgressCount})</span>
        </button>
        <button
          onClick={() => setStatusFilter('completed')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1 ${
            statusFilter === 'completed'
              ? 'bg-[#059669] text-white shadow-xs'
              : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Completed ({completedCount})</span>
        </button>
      </div>

      {/* 3. Claims List */}
      {loading ? (
        <div className="py-20 bg-white rounded-2xl border border-[#E2E8F0]">
          <LoadingSpinner message="Loading claim requests..." />
        </div>
      ) : filteredClaims.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#E2E8F0] shadow-xs space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center mx-auto">
            <Handshake className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-base text-[#0F172A]">No Claims in this Category</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            Explore donated items listed by community members to request physical items for your organization.
          </p>
          <Link
            to="/ngo/items"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <span>Explore Donor Goods</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredClaims.map((claim) => {
            const item = claim.itemDonationId;
            const isAccepted = claim.status === 'accepted' || claim.status === 'pickup_scheduled';
            const isCompleted = claim.status === 'completed';

            return (
              <div
                key={claim._id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 max-w-2xl min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-black text-sm sm:text-base text-[#0F172A]">
                      {item?.title || 'Physical Item Donation'}
                    </h3>
                    <StatusBadge status={claim.status} />
                  </div>

                  <p className="text-xs text-[#64748B]">
                    Requested: <strong className="text-[#0F172A]">{claim.requestedQuantity}</strong> {item?.unit || 'units'} • Category: <strong className="text-[#475569]">{item?.category}</strong> • Date: {claim.createdAt ? new Date(claim.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                  </p>

                  {claim.notes && (
                    <p className="text-xs text-[#475569] bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 rounded-xl italic">
                      "{claim.notes}"
                    </p>
                  )}

                  {/* Unlocked Pickup Details */}
                  {isAccepted && item?.pickupAddress && (
                    <div className="mt-2.5 p-3.5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-xs text-[#065F46] space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-[#047857]">
                        <MapPin className="w-4 h-4 text-[#059669]" />
                        <span>Unlocked Pickup Address:</span>
                      </div>
                      <p className="font-medium">{item.pickupAddress}</p>
                      {item.pickupAvailability && (
                        <p className="text-[11px] text-[#059669]">
                          Availability window: {item.pickupAvailability}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {isAccepted && !isCompleted && (
                    <button
                      type="button"
                      onClick={() => handleConfirmReceipt(claim._id)}
                      className="px-4 py-2.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Received</span>
                    </button>
                  )}

                  {isCompleted && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] px-3.5 py-2 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                      <span>Received & Verified</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};