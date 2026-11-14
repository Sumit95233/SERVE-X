import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { ShieldCheck, Check, X, AlertTriangle, Building2, MapPin } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export const AdminNgosPage = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [rejectingNgo, setRejectingNgo] = useState(null);
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchNgos();
  }, [filterStatus]);

  const fetchNgos = async () => {
    setLoading(true);
    try {
      const url =
        filterStatus === 'pending'
          ? '/admin/ngos/pending'
          : `/ngos?status=${filterStatus}`;
      const res = await api.get(url);
      if (res.data?.success) {
        setNgos(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin NGOs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (ngoId, status, rejectionReason = '') => {
    try {
      const res = await api.patch(`/admin/ngos/${ngoId}/verification`, {
        status,
        reason: rejectionReason,
      });

      if (res.data?.success) {
        toast.success(`NGO status updated to ${status.toUpperCase()}`);
        setRejectingNgo(null);
        setReason('');
        fetchNgos();
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101828]">
              NGO Verification & Governance
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Verify registration documents and grant permission for public fundraising and claim requests.
            </p>
          </div>

          <div className="flex bg-white p-1 rounded-2xl border border-gray-200">
            {['pending', 'verified', 'rejected', 'all'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-4 py-1.5 text-xs font-bold rounded-xl capitalize transition ${
                  filterStatus === st
                    ? 'bg-[#07549A] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20">
            <LoadingSpinner message="Loading NGO applications..." />
          </div>
        ) : ngos.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E5EAF0]">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-base text-[#101828]">No NGOs in this category</h3>
            <p className="text-xs text-gray-500 mt-1">No organizations currently match the "{filterStatus}" filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {ngos.map((ngo) => (
              <div
                key={ngo._id}
                className="bg-white rounded-3xl p-6 border border-[#E5EAF0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg text-[#101828]">{ngo.organizationName}</h3>
                    <StatusBadge status={ngo.verificationStatus} />
                  </div>

                  <p className="text-xs text-gray-500">
                    Reg No: <strong className="text-gray-800">{ngo.registrationNumber}</strong> • Contact: {ngo.contactPerson} ({ngo.email || ngo.userId?.email}, {ngo.phone || ngo.userId?.phone})
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {ngo.address}, {ngo.city}, {ngo.state} - {ngo.pincode}
                  </p>
                  <p className="text-xs text-[#475467] leading-relaxed pt-1">
                    {ngo.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {(ngo.causeCategories || []).map((c, idx) => (
                      <span key={idx} className="text-[10px] font-semibold bg-gray-100 px-2.5 py-0.5 rounded-full text-gray-700">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {ngo.verificationStatus !== 'verified' && (
                    <button
                      onClick={() => handleUpdateStatus(ngo._id, 'verified')}
                      className="px-4 py-2 bg-[#00B98B] hover:bg-[#009E77] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Verify NGO
                    </button>
                  )}

                  {ngo.verificationStatus !== 'rejected' && (
                    <button
                      onClick={() => setRejectingNgo(ngo)}
                      className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                  )}

                  {ngo.verificationStatus === 'verified' && (
                    <button
                      onClick={() => handleUpdateStatus(ngo._id, 'suspended', 'Administrative hold')}
                      className="px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold rounded-xl transition"
                    >
                      Suspend
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Reason Modal */}
      {rejectingNgo && (
        <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <h3 className="text-base font-bold text-[#101828] mb-1">
              Reject Verification for {rejectingNgo.organizationName}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Provide a clear reason that will be displayed to the applicant.
            </p>

            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Incomplete Darpan / Registration certificate uploaded..."
              className="w-full px-3.5 py-2 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-rose-500 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectingNgo(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(rejectingNgo._id, 'rejected', reason)}
                className="px-5 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
