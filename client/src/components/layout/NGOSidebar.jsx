import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Building2,
  ClipboardList,
  PackageSearch,
  Handshake,
  Flame,
  IndianRupee,
  FileBarChart2,
  ShieldCheck,
  Clock,
  AlertCircle,
  PlusCircle,
  Award,
  Globe,
} from 'lucide-react';

export const NGOSidebar = () => {
  const { ngo } = useAuth();
  const isVerified = ngo?.verificationStatus === 'verified';
  const isPending = !ngo || ngo.verificationStatus === 'pending';

  const ngoLinks = [
    { label: 'Workspace Overview', path: '/ngo/dashboard', icon: LayoutDashboard },
    { label: 'Fundraising Campaigns', path: '/ngo/campaigns', icon: Flame },
    { label: 'Post Item Needs', path: '/ngo/requirements', icon: ClipboardList },
    { label: 'Browse Donor Goods', path: '/ngo/items', icon: PackageSearch },
    { label: 'Claim Coordination', path: '/ngo/claims', icon: Handshake },
    { label: 'Donations Received (₹)', path: '/ngo/donations', icon: IndianRupee },
    { label: 'Impact & Reports', path: '/ngo/reports', icon: FileBarChart2 },
    { label: 'Organization & Darpan', path: '/ngo/profile', icon: Building2 },
  ];

  return (
    <>
      {/* 1. Desktop Responsive Sidebar (Sticky card on desktop) */}
      <aside
        className="hidden lg:block w-64 shrink-0"
        aria-label="NGO Partner Operations Navigation"
      >
        <div className="sticky top-[92px] bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)] space-y-4">
          {/* Partner Portal Brand Header */}
          <div className="flex items-center gap-2.5 px-2 pb-3 border-b border-[#E2E8F0]">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#059669] to-[#047857] flex items-center justify-center text-white font-bold text-xs shadow-xs">
              🏢
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider truncate">
                Partner Workspace
              </div>
              <div className="text-[10px] text-[#059669] font-bold truncate">
                {ngo?.darpanId ? `Darpan: ${ngo.darpanId}` : (ngo?.registrationNumber || 'Verified Partner')}
              </div>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider px-2 mb-2">
              Operations Center
            </div>
            <nav className="space-y-1">
              {ngoLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/ngo/dashboard'}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#059669] ${
                        isActive
                          ? 'bg-[#ECFDF5] text-[#065F46] font-bold border border-[#A7F3D0] shadow-xs'
                          : 'text-[#334155] hover:text-[#065F46] hover:bg-[#F0FDF4]'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                            isActive
                              ? 'bg-[#059669] text-white shadow-xs'
                              : 'bg-[#F1F5F9] text-[#64748B]'
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                        </div>
                        <span className="truncate">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Quick Launch Buttons */}
          <div className="pt-2 border-t border-[#E2E8F0] space-y-2">
            <Link
              to="/ngo/requirements"
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Post Item Need</span>
            </Link>
            <Link
              to="/ngo/campaigns"
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1] text-xs font-bold rounded-xl transition"
            >
              <Flame className="w-3.5 h-3.5 text-[#F97316]" />
              <span>+ Launch Campaign</span>
            </Link>
          </div>

          {/* Verification & Compliance Micro-card */}
          <div
            className={`p-3 rounded-xl border text-xs ${
              isVerified
                ? 'bg-[#ECFDF5] border-[#A7F3D0]'
                : isPending
                ? 'bg-[#FFFBEB] border-[#FDE68A]'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div
              className={`flex items-center gap-1.5 font-bold mb-1 ${
                isVerified
                  ? 'text-[#065F46]'
                  : isPending
                  ? 'text-amber-800'
                  : 'text-red-700'
              }`}
            >
              {isVerified ? (
                <>
                  <ShieldCheck className="w-4 h-4 shrink-0 text-[#059669]" />
                  <span>Verified Organization</span>
                </>
              ) : isPending ? (
                <>
                  <Clock className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>Verification In Review</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>Action Required</span>
                </>
              )}
            </div>
            <p className="text-[11px] text-[#475569] leading-relaxed">
              {isVerified
                ? 'NITI Aayog Darpan & Section 80G tax benefit certified. All partner actions enabled.'
                : 'Account undergoing administrative compliance audit.'}
            </p>
          </div>
        </div>
      </aside>

      {/* 2. Mobile Contextual Navigation Pill Bar */}
      <div className="lg:hidden w-full overflow-x-auto pb-1 scrollbar-none mb-3">
        <nav
          className="flex items-center gap-1.5 min-w-max"
          aria-label="Mobile NGO Navigation"
        >
          {ngoLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/ngo/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-[#059669] ${
                    isActive
                      ? 'bg-[#059669] text-white shadow-xs font-bold'
                      : 'bg-white text-[#334155] border border-[#CBD5E1] hover:text-[#065F46] hover:bg-[#F0FDF4]'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
};
