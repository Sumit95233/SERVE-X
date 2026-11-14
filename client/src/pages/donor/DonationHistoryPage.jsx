import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  FileText,
  IndianRupee,
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  Search,
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ReceiptModal } from '../../components/common/ReceiptModal';
import toast from 'react-hot-toast';

export const DonationHistoryPage = () => {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'monetary', 'items'
  const [monetaryDonations, setMonetaryDonations] = useState([]);
  const [itemDonations, setItemDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const [moneyRes, itemRes] = await Promise.all([
        api.get('/payments/history'),
        api.get('/items?mine=true'),
      ]);

      if (moneyRes.data?.success) setMonetaryDonations(moneyRes.data.data);
      if (itemRes.data?.success) setItemDonations(itemRes.data.data);
    } catch (err) {
      console.error('Failed to load donation history', err);
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
    } catch (err) {
      toast.error('Could not load receipt details');
    }
  };

  const filteredMonetary = monetaryDonations.filter((d) => {
    const title = d.campaignId?.title || '';
    const ngo = d.ngoId?.organizationName || '';
    return (
      title.toLowerCase().includes(search.toLowerCase()) ||
      ngo.toLowerCase().includes(search.toLowerCase())
    );
  });

  const filteredItems = itemDonations.filter((item) => {
    return (
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-[#F7F9FC] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101828]">
              My Donation History & Receipts
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Access your verified contribution records, pickup progress, and 80G tax certificates.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by NGO or campaign..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#07549A]"
            />
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-white p-1 rounded-2xl border border-[#E2E8F0] max-w-md mb-8 shadow-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'all'
                ? 'bg-[#07549A] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Activity ({monetaryDonations.length + itemDonations.length})
          </button>
          <button
            onClick={() => setActiveTab('monetary')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'monetary'
                ? 'bg-[#07549A] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monetary ({monetaryDonations.length})
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'items'
                ? 'bg-[#07549A] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Physical Items ({itemDonations.length})
          </button>
        </div>

        {loading ? (
          <div className="py-20">
            <LoadingSpinner message="Retrieving your donation records..." />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Monetary Donations Section */}
            {(activeTab === 'all' || activeTab === 'monetary') && (
              <div className="bg-white rounded-3xl p-6 border border-[#E5EAF0] shadow-xs">
                <h3 className="font-bold text-base text-[#101828] mb-4 flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-[#07549A]" />
                  Monetary Contributions
                </h3>

                {filteredMonetary.length === 0 ? (
                  <p className="text-xs text-gray-500 py-6 text-center">
                    No monetary contributions matching your filter.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                          <th className="pb-3">Campaign / Cause</th>
                          <th className="pb-3">Beneficiary NGO</th>
                          <th className="pb-3">Amount</th>
                          <th className="pb-3">Date</th>
                          <th className="pb-3">Payment Status</th>
                          <th className="pb-3 text-right">Tax Receipt</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredMonetary.map((d) => (
                          <tr key={d._id} className="hover:bg-gray-50/70 transition">
                            <td className="py-4 font-bold text-[#101828]">
                              {d.campaignId?.title || 'General Relief Fund'}
                            </td>
                            <td className="py-4 text-gray-600">
                              {d.ngoId?.organizationName || 'Verified NGO'}
                            </td>
                            <td className="py-4 font-extrabold text-[#00B98B] text-sm">
                              ₹{d.amount.toLocaleString('en-IN')}
                            </td>
                            <td className="py-4 text-gray-500">
                              {new Date(d.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </td>
                            <td className="py-4">
                              <StatusBadge status={d.paymentStatus} />
                            </td>
                            <td className="py-4 text-right">
                              {d.receiptNumber ? (
                                <button
                                  onClick={() => handleOpenReceipt(d.receiptNumber)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EBF3FB] hover:bg-[#07549A] text-[#07549A] hover:text-white rounded-lg font-bold text-xs transition"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>View Receipt</span>
                                </button>
                              ) : (
                                <span className="text-gray-400 text-[11px]">Pending</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Physical Item Donations Section */}
            {(activeTab === 'all' || activeTab === 'items') && (
              <div className="bg-white rounded-3xl p-6 border border-[#E5EAF0] shadow-xs">
                <h3 className="font-bold text-base text-[#101828] mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#00B98B]" />
                  Physical Item Donations
                </h3>

                {filteredItems.length === 0 ? (
                  <p className="text-xs text-gray-500 py-6 text-center">
                    No physical items listed yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                      <div
                        key={item._id}
                        className="p-5 rounded-2xl bg-[#F8FAFC] border border-gray-100 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-semibold px-2.5 py-0.5 bg-white border border-gray-200 rounded-full text-gray-700">
                              {item.category}
                            </span>
                            <StatusBadge status={item.status} />
                          </div>
                          <h4 className="font-bold text-sm text-[#101828] mb-1">{item.title}</h4>
                          <p className="text-xs text-gray-500 mb-2">
                            Qty: <strong className="text-gray-800">{item.quantity} {item.unit || 'items'}</strong> • Condition: {item.condition}
                          </p>
                          <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                            {item.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-gray-200/80 text-[11px] text-gray-500 flex justify-between items-center">
                          <span>{item.city}, {item.state}</span>
                          <span>{new Date(item.createdAt).toLocaleDateString('en-IN')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
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
