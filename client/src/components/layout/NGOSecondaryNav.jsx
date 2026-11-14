import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  ClipboardList,
  PackageSearch,
  HandHelping,
  Flame,
  IndianRupee,
  FileBarChart2,
} from 'lucide-react';

export const NGOSecondaryNav = () => {
  const ngoLinks = [
    { label: 'Overview', path: '/ngo/dashboard', icon: LayoutDashboard },
    { label: 'Organization Profile', path: '/ngo/profile', icon: Building2 },
    { label: 'Item Requirements', path: '/ngo/requirements', icon: ClipboardList },
    { label: 'Browse Item Donations', path: '/ngo/items', icon: PackageSearch },
    { label: 'Claim Requests', path: '/ngo/claims', icon: HandHelping },
    { label: 'Fundraising Campaigns', path: '/ngo/campaigns', icon: Flame },
    { label: 'Donations Received', path: '/ngo/donations', icon: IndianRupee },
    { label: 'Reports', path: '/ngo/reports', icon: FileBarChart2 },
  ];

  return (
    <div className="bg-[#F8FAFC] border-b border-[#DFE7F0] sticky top-[72px] z-30 shadow-[0_1px_3px_rgba(16,42,67,0.02)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className="flex items-center gap-1.5 overflow-x-auto py-2 scrollbar-none"
          aria-label="NGO Management Secondary Navigation"
        >
          {ngoLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-[#84ADFF] ${
                    isActive
                      ? 'bg-white text-[#07549A] shadow-xs border border-[#DFE7F0] font-bold'
                      : 'text-[#526780] hover:text-[#102033] hover:bg-white/70'
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
    </div>
  );
};
