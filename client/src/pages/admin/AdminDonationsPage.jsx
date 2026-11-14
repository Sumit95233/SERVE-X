import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { IndianRupee, ShieldCheck, FileText } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ReceiptModal } from '../../components/common/ReceiptModal';
import toast from 'react-hot-toast';

export const AdminDonationsPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/donations');
      if (res.data?.success) {
        setDonations(res.data.data);
      }
    } catch (err) {
      console.error('Admin donations error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReceipt = async (receiptNumber) => {
    try {
      const res = await api.get(`/payments/${receiptNumber}/receipt`);
      if (res.data?.success) {
        setSelectedReceipt(res.data.data);
        setIsReceiptOpen(true);
      }
    } catch {
      toast.error('Could not load receipt');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101828]">
            Platform-Wide Donation Transactions
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Complete financial records, Razorpay payment evidence, and 80G tax receipt audits.
          </p>
        </div>

        {loading ? (
          <div className="py-20">
            <LoadingSpinner message="Auditing transactions..." />
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 border border-[#E5EAF0] shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Donor</th>
                    <th className="pb-3">Campaign</th>
                    <th className="pb-3">NGO</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {donations.map((d) => (
                    <tr key={d._id} className="hover:bg-gray-50/70">
                      <td className="py-3.5 font-bold text-[#101828]">{d.donorName}</td>
                      <td className="py-3.5 text-gray-600 max-w-xs truncate">
                        {d.campaignId?.title || 'Relief Campaign'}
                      </td>
                      <td className="py-3.5 text-gray-600">
                        {d.ngoId?.organizationName || 'Verified NGO'}
                      </td>
                      <td className="py-3.5 font-black text-emerald-600 text-sm">
                        ₹{d.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 text-gray-500">
                        {new Date(d.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-3.5">
                        <StatusBadge status={d.paymentStatus} />
                      </td>
                      <td className="py-3.5 text-right">
                        {d.receiptNumber ? (
                          <button
                            onClick={() => handleOpenReceipt(d.receiptNumber)}
                            className="text-[#07549A] hover:underline font-bold"
                          >
                            #{d.receiptNumber}
                          </button>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ReceiptModal
        receipt={selectedReceipt}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
};
