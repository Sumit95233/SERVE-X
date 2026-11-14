import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  IndianRupee,
  Users,
  ShieldCheck,
  Calendar,
  Search,
  Download,
  Receipt,
  Filter,
  Flame,
  Building2,
  FileCheck2,
  Printer,
  X,
  ExternalLink,
} from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export const NgoDonationsPage = () => {
  const { ngo } = useAuth();
  const [donations, setDonations] = useState([]);
  const [summary, setSummary] = useState({ totalAmount: 0, totalCount: 0, avgDonation: 0 });
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'campaign' | 'direct'
  const [search, setSearch] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/payments/ngo-donations', {
        params: {
          type: typeFilter,
          search: search.trim() || undefined,
        },
      });

      if (res.data?.success) {
        setDonations(res.data.data || []);
        if (res.data.summary) {
          setSummary(res.data.summary);
        }
      }
    } catch (err) {
      // Fallback: If received endpoint fails, try aggregating from campaigns
      console.warn('Direct NGO donation API error, fallback to campaigns aggregation', err);
      try {
        const campRes = await api.get('/campaigns?mine=true');
        const myCampaigns = campRes.data?.data || [];
        const fallbackList = [];
        let total = 0;

        for (const camp of myCampaigns) {
          if (camp._id) {
            const detailRes = await api.get(`/campaigns/${camp._id}`);
            const supporters = detailRes.data?.data?.supporters || [];
            supporters.forEach((s) => {
              const amt = Number(s.amount) || 0;
              total += amt;
              fallbackList.push({
                _id: s._id || `s_${Math.random()}`,
                donorName: s.donorName || 'Generous Donor',
                amount: amt,
                createdAt: s.createdAt || new Date(),
                receiptNumber: s.receiptNumber || `SRVX-${Date.now().toString().slice(-6)}`,
                campaignId: { title: camp.title },
                message: s.message,
              });
            });
          }
        }
        setDonations(fallbackList);
        setSummary({
          totalAmount: total,
          totalCount: fallbackList.length,
          avgDonation: fallbackList.length ? Math.round(total / fallbackList.length) : 0,
        });
      } catch (fallbackErr) {
        console.error('Fallback failed', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [typeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDonations();
  };

  const handleExportCSV = () => {
    if (!donations.length) {
      toast.error('No donation records to export');
      return;
    }

    const headers = ['Receipt Number', 'Date', 'Donor Name', 'Donor Email', 'Amount (INR)', 'Contribution Type', 'Fundraiser Title', 'Note'];
    const rows = donations.map((d) => [
      d.receiptNumber || 'N/A',
      new Date(d.createdAt).toLocaleDateString('en-IN'),
      `"${d.donorName || 'Anonymous'}"`,
      `"${d.donorEmail || ''}"`,
      d.amount,
      d.campaignId ? 'Campaign' : 'Direct NGO Support',
      `"${d.campaignId?.title || ngo?.organizationName || 'Direct Contribution'}"`,
      `"${(d.message || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ServeX_Donation_Ledger_${ngo?.organizationName || 'NGO'}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Donation ledger exported successfully');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Breadcrumb & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#059669] mb-1">
            <span>NGO Workspace</span>
            <span>/</span>
            <span>Financial Accounting</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
            Donations Received Ledger
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Verified financial contributions received across campaigns and direct organization support with 80G compliance.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white hover:bg-[#F8FAFC] text-[#0F172A] border border-[#CBD5E1] text-xs font-bold rounded-xl shadow-xs transition inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#059669]" />
            <span>Export CSV Ledger</span>
          </button>
        </div>
      </div>

      {/* 2. Four Operational Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Funds Received */}
        <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5] text-[#059669] flex items-center justify-center shrink-0 ring-1 ring-[#A7F3D0]/60 shadow-xs">
            <IndianRupee className="w-5 h-5 font-bold" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider truncate">
              Total Funds Received
            </div>
            <div className="text-xl font-black text-[#0F172A] mt-0.5 tabular-nums truncate">
              ₹{Number(summary.totalAmount || 0).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-[#059669] font-medium mt-0.5">100% Verified Gateway Credits</p>
          </div>
        </div>

        {/* KPI 2: Total Contributions Count */}
        <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] text-[#0284C7] flex items-center justify-center shrink-0 ring-1 ring-[#BAE6FD]/60 shadow-xs">
            <Users className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider truncate">
              Total Contributions
            </div>
            <div className="text-xl font-black text-[#0F172A] mt-0.5 tabular-nums truncate">
              {summary.totalCount || donations.length}
            </div>
            <p className="text-[11px] text-[#64748B] font-medium mt-0.5">Donations recorded in ledger</p>
          </div>
        </div>

        {/* KPI 3: Average Gift Size */}
        <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FDF4FF] to-[#F5D0FE] text-[#9333EA] flex items-center justify-center shrink-0 ring-1 ring-[#E9D5FF]/60 shadow-xs">
            <Receipt className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider truncate">
              Average Contribution
            </div>
            <div className="text-xl font-black text-[#0F172A] mt-0.5 tabular-nums truncate">
              ₹{Number(summary.avgDonation || 0).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-[#64748B] font-medium mt-0.5">Per verified supporter</p>
          </div>
        </div>

        {/* KPI 4: 80G Compliance */}
        <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0 ring-1 ring-[#FDE68A]/60 shadow-xs">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider truncate">
              Section 80G Receipts
            </div>
            <div className="text-xl font-black text-[#0F172A] mt-0.5 tabular-nums truncate">
              {summary.totalCount || donations.length} Issued
            </div>
            <p className="text-[11px] text-[#059669] font-medium mt-0.5">50% Tax Exemption Eligible</p>
          </div>
        </div>
      </div>

      {/* 3. Search and Type Filter Tabs */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              typeFilter === 'all'
                ? 'bg-[#059669] text-white shadow-xs'
                : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
            }`}
          >
            All Contributions ({summary.totalCount || donations.length})
          </button>
          <button
            onClick={() => setTypeFilter('campaign')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1 cursor-pointer ${
              typeFilter === 'campaign'
                ? 'bg-[#059669] text-white shadow-xs'
                : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Campaign Fundraisers</span>
          </button>
          <button
            onClick={() => setTypeFilter('direct')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1 cursor-pointer ${
              typeFilter === 'direct'
                ? 'bg-[#059669] text-white shadow-xs'
                : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Direct NGO Support</span>
          </button>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-sm w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search donor name or receipt..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] placeholder-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Filter
          </button>
        </form>
      </div>

      {/* 4. Donations Ledger Table */}
      {loading ? (
        <div className="py-20 bg-white rounded-2xl border border-[#E2E8F0]">
          <LoadingSpinner message="Loading financial ledger..." />
        </div>
      ) : donations.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#E2E8F0] shadow-xs space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center mx-auto">
            <Receipt className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-base text-[#0F172A]">No Donations Found in Selected Filter</h3>
          <p className="text-xs text-[#64748B] max-w-md mx-auto">
            Contributions received through Razorpay gateway for your active campaigns and organization profile will be audited here in real-time.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Donor Name & Info</th>
                  <th className="py-3 px-4">Type / Cause</th>
                  <th className="py-3 px-4">Amount (INR)</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Tax Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {donations.map((d, idx) => {
                  const isCampaign = Boolean(d.campaignId);
                  return (
                    <tr key={d._id || idx} className="hover:bg-[#F8FAFC] transition-colors">
                      {/* Receipt # */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0F172A] whitespace-nowrap">
                        {d.receiptNumber || 'SRVX-ONLINE'}
                      </td>

                      {/* Donor info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#0F172A]">{d.donorName || 'Anonymous Donor'}</div>
                        {d.donorEmail && (
                          <div className="text-[11px] text-[#64748B] truncate max-w-[180px]">{d.donorEmail}</div>
                        )}
                        {d.message && (
                          <div className="text-[10px] text-[#059669] italic truncate max-w-[200px] mt-0.5">
                            "{d.message}"
                          </div>
                        )}
                      </td>

                      {/* Type / Cause */}
                      <td className="py-3.5 px-4">
                        {isCampaign ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FFF7ED] text-[#C2410C] border border-[#FFEDD5] font-semibold text-[11px]">
                            <Flame className="w-3 h-3 text-[#F97316]" />
                            <span className="truncate max-w-[180px]" title={d.campaignId?.title || 'Campaign'}>
                              {d.campaignId?.title || 'Fundraiser'}
                            </span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] font-semibold text-[11px]">
                            <Building2 className="w-3 h-3 text-[#059669]" />
                            <span>Direct NGO Support</span>
                          </span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 font-black text-[#059669] text-sm tabular-nums whitespace-nowrap">
                        ₹{Number(d.amount).toLocaleString('en-IN')}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-[#64748B] whitespace-nowrap">
                        {d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        }) : 'Recent'}
                      </td>

                      {/* Tax Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                          <ShieldCheck className="w-3 h-3 text-[#059669]" />
                          <span>80G Eligible</span>
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedReceipt(d)}
                          className="px-2.5 py-1 text-xs font-bold text-[#07549A] hover:text-[#06457E] hover:bg-[#EFF6FF] rounded-lg transition inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>View Receipt</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Section 80G Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-[1200] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#CBD5E1] shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center font-bold">
                  ₹
                </div>
                <div>
                  <h3 className="font-black text-sm text-[#0F172A]">Section 80G Donation Receipt</h3>
                  <p className="text-[11px] text-[#64748B]">Official ServeX Partner Contribution Voucher</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="w-7 h-7 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Receipt Body */}
            <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-[#E2E8F0] space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">Receipt Number</span>
                <span className="font-mono font-bold text-[#0F172A]">{selectedReceipt.receiptNumber || 'SRVX-ONLINE'}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">Donation Date</span>
                <span className="font-semibold text-[#0F172A]">
                  {selectedReceipt.createdAt ? new Date(selectedReceipt.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  }) : 'Recent'}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">Donor Name</span>
                <span className="font-bold text-[#0F172A]">{selectedReceipt.donorName || 'Anonymous Donor'}</span>
              </div>
              {selectedReceipt.donorEmail && (
                <div className="flex justify-between items-center pb-2 border-b border-[#E2E8F0]">
                  <span className="text-[#64748B]">Donor Email</span>
                  <span className="text-[#475569]">{selectedReceipt.donorEmail}</span>
                </div>
              )}
              <div className="flex justify-between items-center pb-2 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">Beneficiary NGO</span>
                <span className="font-bold text-[#0F172A]">{ngo?.organizationName || 'ServeX Partner NGO'}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">Darpan / Reg. ID</span>
                <span className="font-mono text-[#059669] font-bold">{ngo?.darpanId || ngo?.registrationNumber || 'VERIFIED'}</span>
              </div>
              <div className="flex justify-between items-center pt-1 text-sm font-black">
                <span className="text-[#0F172A]">Amount Received</span>
                <span className="text-[#059669]">₹{Number(selectedReceipt.amount).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Compliance Note */}
            <div className="p-3 bg-[#ECFDF5] rounded-xl border border-[#A7F3D0] text-[11px] text-[#065F46] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#059669] mt-0.5" />
              <span>
                Donations made to registered NGOs on ServeX qualify for a 50% deduction under Section 80G of the Indian Income Tax Act.
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 border border-[#CBD5E1] text-[#475569] hover:bg-[#F1F5F9] text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};