import React, { useState } from 'react';
import { X, Printer, ShieldCheck, Heart, Download, MailCheck, Quote } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export const ReceiptModal = ({ receipt, isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!receipt?.receiptNumber) return;
    setDownloading(true);
    try {
      const res = await api.get(`/payments/${receipt.receiptNumber}/pdf`, {
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ServeX_Receipt_${receipt.receiptNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Official Section 80G Receipt PDF downloaded!');
    } catch (err) {
      console.error('PDF download error:', err);
      toast.error('Opening print dialog for PDF saving...');
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-hidden">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* 1. STICKY TOP HEADER (ALWAYS VISIBLE & ACCESSIBLE) */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-[#F8FAFC] shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#00B98B] flex items-center justify-center text-white shadow-2xs shrink-0">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-sm text-[#101828] truncate">Official Donation Receipt</h3>
              <p className="text-[10px] text-[#64748B] truncate">Section 80G Certified • ServeX Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="px-2.5 py-1.5 bg-[#07549A] hover:bg-[#06427A] text-white rounded-xl transition text-[11px] font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-60"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{downloading ? 'Downloading...' : 'PDF'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/80 rounded-xl transition cursor-pointer"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* HIGH-VISIBILITY CLOSE BUTTON */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-200/70 hover:bg-slate-300/80 text-slate-700 hover:text-slate-900 transition cursor-pointer flex items-center justify-center"
              aria-label="Close"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. SCROLLABLE INNER RECEIPT BODY */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 overscroll-contain">
          
          {/* Email Confirmation Ribbon */}
          {receipt.donorEmail && (
            <div className="p-2.5 bg-emerald-50/90 border border-emerald-200/80 rounded-2xl flex items-center gap-2 text-xs text-emerald-900">
              <MailCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="min-w-0 text-[11px] leading-relaxed">
                Official PDF receipt & thank-you quote emailed to <strong className="font-bold underline">{receipt.donorEmail}</strong>.
              </div>
            </div>
          )}

          {/* Receipt Top Identity */}
          <div className="flex justify-between items-start pb-4 border-b border-gray-100">
            <div>
              <span className="text-xl font-black text-[#07549A]">
                Serve<span className="text-[#00B98B]">X</span>
              </span>
              <p className="text-[11px] text-gray-500 mt-0.5">Connecting Generosity with Verified Causes</p>
              <p className="text-[10px] text-gray-400">Chandigarh University Gate no 4 • sumitrajslm2018@gmail.com</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full mb-1 border border-emerald-200">
                Verified 80G
              </span>
              <p className="text-xs font-bold text-gray-800">No: {receipt.receiptNumber || 'SRVX-RECEIPT'}</p>
              <p className="text-[10px] text-gray-400">
                {new Date(receipt.donationDate || receipt.createdAt || Date.now()).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Details Table */}
          <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-gray-100 space-y-2 text-xs">
            <div className="flex justify-between pb-1.5 border-b border-gray-200/70">
              <span className="text-gray-500">Donor Name:</span>
              <span className="font-bold text-gray-900">{receipt.donorName || 'Generous Supporter'}</span>
            </div>
            <div className="flex justify-between pb-1.5 border-b border-gray-200/70">
              <span className="text-gray-500">Donor Email:</span>
              <span className="font-semibold text-gray-800">{receipt.donorEmail || 'N/A'}</span>
            </div>
            <div className="flex justify-between pb-1.5 border-b border-gray-200/70">
              <span className="text-gray-500">Beneficiary NGO:</span>
              <span className="font-bold text-[#07549A]">
                {receipt.ngo?.organizationName || receipt.ngoId?.organizationName || 'Verified Partner NGO'}
              </span>
            </div>
            {receipt.ngo?.registrationNumber && (
              <div className="flex justify-between pb-1.5 border-b border-gray-200/70">
                <span className="text-gray-500">NGO Reg. Number:</span>
                <span className="font-semibold text-gray-800">{receipt.ngo.registrationNumber}</span>
              </div>
            )}
            <div className="flex justify-between pb-1.5 border-b border-gray-200/70">
              <span className="text-gray-500">Campaign / Cause:</span>
              <span className="font-semibold text-gray-800 text-right max-w-[65%] line-clamp-1">
                {receipt.campaign?.title || receipt.campaignId?.title || 'Community Welfare'}
              </span>
            </div>
            <div className="flex justify-between pt-0.5">
              <span className="text-gray-500">Payment ID:</span>
              <span className="font-mono text-gray-700 text-[11px]">{receipt.razorpayPaymentId || 'pay_verified'}</span>
            </div>
          </div>

          {/* Total Amount Box */}
          <div className="flex justify-between items-center p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl">
            <div>
              <span className="text-xs font-bold text-emerald-950 block">Total Amount Contributed:</span>
              <span className="text-[10px] text-emerald-700 font-medium">100% Direct Allocation to Cause</span>
            </div>
            <span className="text-2xl font-black text-emerald-700 tabular-nums">
              ₹{Number(receipt.amount || 0).toLocaleString('en-IN')}
            </span>
          </div>

          {/* Heartwarming Quote Box */}
          <div className="p-3.5 bg-gradient-to-r from-sky-50 to-indigo-50/50 border border-sky-100 rounded-2xl flex items-start gap-2.5">
            <Quote className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="italic text-sky-950 font-medium text-[11px]">
                "No one has ever become poor by giving. Your generosity brings real hope to lives that need it most."
              </p>
              <p className="text-[10px] text-sky-700 font-bold mt-0.5">— Anne Frank</p>
            </div>
          </div>

          {/* Tax Exemption Note */}
          <div className="text-[10px] text-gray-500 leading-relaxed border-t border-gray-100 pt-3 flex gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              This digital receipt serves as official legal confirmation. Contributions made through Serve-X to eligible partner NGOs qualify for 50% deduction under Section 80G of the Indian Income Tax Act.
            </p>
          </div>
        </div>

        {/* 3. STICKY BOTTOM FOOTER (ALWAYS VISIBLE) */}
        <div className="p-3.5 px-5 bg-gray-50 border-t border-gray-100 shrink-0 sticky bottom-0 z-20 flex items-center justify-between">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="px-3 py-2 text-xs font-bold text-[#07549A] hover:bg-[#EBF3FB] rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Official PDF Receipt</span>
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:border-gray-300 rounded-xl hover:bg-gray-100 transition cursor-pointer shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
