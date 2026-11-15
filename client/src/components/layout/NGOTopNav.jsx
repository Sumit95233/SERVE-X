import React from 'react';
import { NavLink } from 'react-router-dom';
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
  CheckCircle2,
} from 'lucide-react';

export const NGOTopNav = () => {
  const { ngo } = useAuth();
  const isVerified = ngo?.verificationStatus === 'verified';

  const ngoLinks = [
    { label: 'Overview', path: '/ngo/dashboard', icon: LayoutDashboard },
    { label: 'Campaigns', path: '/ngo/campaigns', icon: Flame },
    { label: 'Post Item Needs', path: '/ngo/requirements', icon: ClipboardList },
    { label: 'Browse Goods', path: '/ngo/items', icon: PackageSearch },
    { label: 'Claim Coordination', path: '/ngo/claims', icon: Handshake },
    { label: 'Donations (₹)', path: '/ngo/donations', icon: IndianRupee },
    { label: 'Impact & Reports', path: '/ngo/reports', icon: FileBarChart2 },
    { label: 'Organization & Darpan', path: '/ngo/profile', icon: Building2 },
  ];

  return (
    <div className="sticky top-[72px] z-[1040] bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_2px_8px_rgba(15,23,42,0.02)] w-full">
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-2">
          {/* Horizontal Scrolling Nav Tabs */}
          <nav
            className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-1 -my-1 min-w-0"
            aria-label="NGO Workspace Navigation"
          >
            {ngoLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/ngo/dashboard'}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500 shrink-0 ${
                      isActive
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                          isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-700'
                        }`}
                      />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Side: Trust & Darpan Metatags */}
          <div className="hidden xl:flex items-center gap-2.5 shrink-0 pl-3 border-l border-slate-200">
            {ngo?.darpanId && (
              <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                DARPAN: <strong className="text-emerald-700">{ngo.darpanId}</strong>
              </span>
            )}
            {isVerified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>80G Certified</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
