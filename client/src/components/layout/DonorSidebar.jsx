import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PackagePlus,
  History,
  IndianRupee,
  Heart,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export const DonorSidebar = () => {
  const donorActions = [
    { label: 'Overview', path: '/donor/dashboard', icon: LayoutDashboard },
    { label: 'Donate Items', path: '/donor/donate-items', icon: PackagePlus },
    { label: 'Donation History', path: '/donor/history', icon: History },
    { label: 'Give Cash', path: '/donor/give-cash', icon: IndianRupee },
    { label: 'My Impact', path: '/donor/impact', icon: Heart },
  ];

  return (
    <>
      {/* 1. Desktop Responsive Sidebar (Sticky, clean card on desktop) */}
      <aside
        className="hidden lg:block w-64 shrink-0"
        aria-label="Donor Workspace Navigation"
      >
        <div className="sticky top-[92px] bg-white rounded-2xl border border-[#E1E8F0] p-4 shadow-[0_2px_8px_rgba(16,42,67,0.04)] space-y-5">
          <div>
            <div className="text-[11px] font-bold text-[#7B8CA4] uppercase tracking-wider px-2 mb-2">
              Donor Workspace
            </div>
            <nav className="space-y-1">
              {donorActions.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/donor/dashboard'}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#84ADFF] ${
                        isActive
                          ? 'bg-[#EAF3FF] text-[#07549A] font-bold border border-[#C3D9FF] shadow-xs'
                          : 'text-[#526780] hover:text-[#102A43] hover:bg-[#F4F7FB]'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                            isActive
                              ? 'bg-white text-[#07549A] shadow-xs'
                              : 'bg-[#F4F7FB] text-[#7B8CA4]'
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

          {/* Section 80G Tax Benefit Micro-card */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#E6F8F0] to-[#F0FDF4] border border-[#A6F4C5] text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#059669] mb-1">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Section 80G Receipts</span>
            </div>
            <p className="text-[11px] text-[#526780] leading-relaxed">
              Every verified financial donation qualifies for official 80G tax exemption receipts.
            </p>
            <NavLink
              to="/donor/history"
              className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#07549A] hover:underline"
            >
              <span>View Receipts</span>
              <ArrowRight className="w-3 h-3" />
            </NavLink>
          </div>
        </div>
      </aside>

      {/* 2. Mobile Contextual Navigation Pill Bar (Scrollable horizontal pills, no wasted vertical space) */}
      <div className="lg:hidden w-full overflow-x-auto pb-1 scrollbar-none mb-3">
        <nav
          className="flex items-center gap-1.5 min-w-max"
          aria-label="Mobile Donor Navigation"
        >
          {donorActions.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/donor/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-[#84ADFF] ${
                    isActive
                      ? 'bg-[#07549A] text-white shadow-xs font-bold'
                      : 'bg-white text-[#526780] border border-[#E1E8F0] hover:text-[#102A43] hover:bg-[#F4F7FB]'
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
