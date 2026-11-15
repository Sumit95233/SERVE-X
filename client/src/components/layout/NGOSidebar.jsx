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
  CheckCircle2,
  Sparkles,
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
      {/* 1. Desktop Responsive Sidebar (Executive Sticky Card) */}
      <aside
        className="hidden lg:block w-64 shrink-0"
        aria-label="NGO Partner Operations Navigation"
      >
        <div className="sticky top-[92px] bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-4">
          {/* Partner Portal Brand Header with Authentic Crest */}
          <div className="flex items-center gap-3 px-1 pb-3.5 border-b border-slate-200/80">
            <div className="relative shrink-0">
              {ngo?.logo ? (
                <img
                  src={ngo.logo}
                  alt={ngo.organizationName || 'NGO'}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextElementSibling) {
                      e.target.nextElementSibling.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div
                style={{ display: ngo?.logo ? 'none' : 'flex' }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 items-center justify-center text-white font-black text-xs shadow-xs ring-1 ring-emerald-500/30"
              >
                {orgInitials}
              </div>
              {isVerified && (
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-600 border-2 border-white rounded-full flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider truncate">
                  Partner Workspace
                </span>
                {isVerified && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </div>
              <div className="text-[10px] text-emerald-700 font-bold font-mono truncate">
                {ngo?.darpanId ? `DARPAN: ${ngo.darpanId}` : (ngo?.registrationNumber || 'Verified Entity')}
              </div>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Operations Center</span>
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
                      `group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        isActive
                          ? 'bg-emerald-50/90 text-emerald-950 font-bold border border-emerald-200/80 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-600 rounded-r-full" />
                        )}
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                            isActive
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200/80 group-hover:text-slate-800'
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                        </div>
                        <span className="truncate flex-1">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Quick Launch High-Impact Actions */}
          <div className="pt-2 border-t border-slate-200/80 space-y-2">
            <Link
              to="/ngo/requirements"
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Post Item Need</span>
            </Link>
            <Link
              to="/ngo/campaigns"
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>+ Launch Campaign</span>
            </Link>
          </div>

          {/* Verification & Compliance Micro-Seal */}
          <div
            className={`p-3.5 rounded-2xl border text-xs relative overflow-hidden ${
              isVerified
                ? 'bg-gradient-to-br from-emerald-50/90 to-teal-50/50 border-emerald-200/80'
                : isPending
                ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
                : 'bg-rose-50 border-rose-200'
            }`}
          >
            <div
              className={`flex items-center gap-1.5 font-bold mb-1 ${
                isVerified
                  ? 'text-emerald-900'
                  : isPending
                  ? 'text-amber-900'
                  : 'text-rose-900'
              }`}
            >
              {isVerified ? (
                <>
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span className="font-black text-[11px] tracking-wide uppercase">NITI Aayog & 80G Certified</span>
                </>
              ) : isPending ? (
                <>
                  <Clock className="w-4 h-4 shrink-0 text-amber-600" />
                  <span className="font-black text-[11px] tracking-wide uppercase">Compliance Under Audit</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span className="font-black text-[11px] tracking-wide uppercase">Action Required</span>
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {isVerified
                ? 'Section 80G tax exemption active. Real-time bank settlements & nationwide logistics unlocked.'
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
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs font-bold'
                      : 'bg-white text-slate-700 border border-slate-200 hover:text-emerald-700 hover:bg-emerald-50'
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
