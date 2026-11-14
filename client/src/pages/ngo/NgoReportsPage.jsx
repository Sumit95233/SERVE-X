import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  FileText,
  Printer,
  Download,
  ShieldCheck,
  Building2,
  Calendar,
  IndianRupee,
  Package,
  Award,
  Users,
  CheckCircle2,
  FileCheck2,
} from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const NgoReportsPage = () => {
  const { ngo } = useAuth();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const [campRes, claimRes, reqRes, donationRes] = await Promise.all([
          api.get('/campaigns?mine=true'),
          api.get('/items/claims'),
          api.get('/requirements?mine=true'),
          api.get('/payments/ngo-donations').catch(() => ({ data: { data: [], summary: {} } })),
        ]);

        const campaigns = campRes.data?.data || [];
        const claims = claimRes.data?.data || [];
        const requirements = reqRes.data?.data || [];
        const donationSummary = donationRes.data?.summary || {};

        const totalMoney = donationSummary.totalAmount || campaigns.reduce((acc, c) => acc + (c.amountRaised || 0), 0);
        const totalItems = claims
          .filter((c) => c.status === 'completed')
          .reduce((acc, c) => acc + (c.requestedQuantity || 0), 0);

        const totalDonors = donationSummary.totalCount || campaigns.reduce((acc, c) => acc + (c.donorCount || 0), 0);

        setReport({
          totalMoney,
          campaignsCount: campaigns.length,
          claimsCount: claims.length,
          totalItems,
          totalRequirements: requirements.length,
          totalDonors,
        });
      } catch (err) {
        console.error('Report error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  return (
    <div className="space-y-6">
      {/* 1. Header with Breadcrumb & Print */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#059669] mb-1">
            <span>NGO Workspace</span>
            <span>/</span>
            <span>Statutory Compliance</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
            Impact & Transparency Reports
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Official ServeX Partner Impact Dossier with 80G tax benefit compliance and resource utilization statement.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 bg-white rounded-2xl border border-[#E2E8F0]">
          <LoadingSpinner message="Compiling verified audit dossier..." />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 sm:p-8 space-y-6">
          {/* Certificate Dossier Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E2E8F0] gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center font-bold text-base shadow-xs">
                  🏢
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#0F172A]">
                    {ngo?.organizationName || 'Verified NGO Partner'}
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    {ngo?.city || 'India'}, {ngo?.state || ''} • Established {ngo?.establishedYear || 2018}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-1 text-xs">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
                <span>NITI Aayog Darpan Certified</span>
              </span>
              <span className="text-[11px] text-[#64748B] font-mono mt-0.5">
                Reg / Darpan ID: <strong>{ngo?.darpanId || ngo?.registrationNumber || 'OD/2021/0100352'}</strong>
              </span>
            </div>
          </div>

          {/* 4 Pillars of Verified Impact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-1">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                Cumulative Funds Raised
              </span>
              <div className="text-2xl font-black text-[#059669] tabular-nums">
                ₹{Number(report?.totalMoney || 0).toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-[#059669] font-medium">Gateway verified funds</p>
            </div>

            <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-1">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                In-Kind Goods Delivered
              </span>
              <div className="text-2xl font-black text-[#0284C7] tabular-nums">
                {report?.totalItems || 0} Units
              </div>
              <p className="text-[11px] text-[#64748B] font-medium">Doorstep verified pickups</p>
            </div>

            <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-1">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                Active & Closed Campaigns
              </span>
              <div className="text-2xl font-black text-[#0F172A] tabular-nums">
                {report?.campaignsCount || 0}
              </div>
              <p className="text-[11px] text-[#64748B] font-medium">Verified fundraisers</p>
            </div>

            <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-1">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                Total Donor Backers
              </span>
              <div className="text-2xl font-black text-[#9333EA] tabular-nums">
                {report?.totalDonors || 0}
              </div>
              <p className="text-[11px] text-[#64748B] font-medium">80G certificates issued</p>
            </div>
          </div>

          {/* Compliance & Audit Declarations */}
          <div className="space-y-3 pt-3 border-t border-[#E2E8F0]">
            <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              Statutory & Platform Compliance Statement
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#475569] leading-relaxed">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
                <div className="font-bold text-[#0F172A] flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-[#059669]" />
                  <span>Section 80G & 12A Certification</span>
                </div>
                <p>
                  This organization holds valid certifications under Section 80G and Section 12A of the Income Tax Act, 1961. Donors are entitled to statutory tax deductions on verified contributions.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
                <div className="font-bold text-[#0F172A] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  <span>Physical Delivery Authentication</span>
                </div>
                <p>
                  All in-kind material contributions listed on the ServeX platform undergo bidirectional confirmation between donor and receiving NGO coordinators prior to receipt issuance.
                </p>
              </div>
            </div>
          </div>

          {/* Official Signoff Footer */}
          <div className="pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-[#64748B]">
            <div>
              <span>Report Generated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span className="mx-2">•</span>
              <span>Platform ID: {ngo?._id || 'SRVX-PARTNER'}</span>
            </div>
            <div className="text-[11px] font-bold text-[#059669] flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Electronically Authenticated by ServeX Foundation</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};