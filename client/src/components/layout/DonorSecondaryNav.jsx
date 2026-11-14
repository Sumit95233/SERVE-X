import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Package,
  History,
  IndianRupee,
  Heart,
  Trophy,
  MapPin,
} from 'lucide-react';

export const DonorSecondaryNav = () => {
  const donorLinks = [
    { label: 'Overview', path: '/donor/dashboard', icon: Home },
    { label: 'Donate Items', path: '/donor/donate-items', icon: Package },
    { label: 'Donation History', path: '/donor/history', icon: History },
    { label: 'Give Cash', path: '/donor/give-cash', icon: IndianRupee },
    { label: 'My Impact', path: '/donor/impact', icon: Heart },
    { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { label: 'NGO Locator', path: '/ngo-locator', icon: MapPin },
  ];

  return (
    <div className="bg-[#F8FAFC] border-b border-[#DFE7F0] sticky top-[72px] z-30 shadow-[0_1px_3px_rgba(16,42,67,0.02)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className="flex items-center gap-1.5 overflow-x-auto py-2 scrollbar-none"
          aria-label="Donor Portal Secondary Navigation"
        >
          {donorLinks.map((item) => {
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
