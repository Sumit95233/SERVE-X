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
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

const getInitials = (name) => {
  if (!name) return 'NG';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export const NGOSidebar = () => {
  const { ngo } = useAuth();
  const isVerified = ngo?.verificationStatus === 'verified';
  const isPending = !ngo || ngo.verificationStatus === 'pending';
  const orgInitials = getInitials(ngo?.organizationName || 'NGO Partner');

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
      {/* 1. Desktop Responsive Sidebar (Clean, Minimal & Executive) */}
      <aside
        className="hidden lg:block w-64 shrink-0"
        aria-label="NGO Partner Operations Navigation"
      >
        <div className="sticky top-[92px] bg-white rounded-2xl border border-slate-250 p-4 shadow-xs space-y-4">
          {/* Organization Brand Header */}
          <div className="flex items-center gap-3 px-1 pb-3.5 border-b border-slate-100">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 flex items-center justify-center text-white font-black text-sm shadow-xs">
                {orgInitials}
              </div>
              {isVerified && (
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-600 border-2 border-white rounded-full flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-black text-slate-900 truncate">
                {ngo?.organizationName || 'Partner Portal'}
              </div>
              <div className="text-[10px] text-emerald-700 font-mono font-semibold truncate">
                {ngo?.darpanId ? `DARPAN: ${ngo.darpanId}` : 'Verified Partner'}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {ngoLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/ngo/dashboard'}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-700'
                        }`}
                      />
                      <span className="truncate flex-1">{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Verification & Trust Badge */}
          <div className="pt-2 border-t border-slate-100">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-black uppercase tracking-wider">
                  NITI Aayog & 80G
                </span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Darpan verified non-profit. Instant 80G tax receipt generation active.
              </p>
            </div>
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
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all focus:outline-none ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs font-bold'
                      : 'bg-white text-slate-700 border border-slate-200 hover:text-slate-900 hover:bg-slate-50'
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
