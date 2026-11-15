import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PublicNavbar } from './PublicNavbar';
import { Footer } from '../common/Footer';

export const PublicLayout = () => {
  const location = useLocation();
  const isLegalPage = location.pathname === '/terms' || location.pathname === '/privacy-policy';

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC] w-full max-w-full overflow-x-hidden">
      <PublicNavbar />
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        <Outlet />
      </main>
      {!isLegalPage && <Footer />}
      {isLegalPage && (
        <footer className="py-6 border-t border-[#DFE7F0] bg-white text-center text-xs text-[#7C8DA5]">
          <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© {new Date().getFullYear()} ServeX Foundation India. All rights reserved.</span>
            <span className="text-[11px] text-[#94A3B8]">Nonprofit Humanitarian Network</span>
          </div>
        </footer>
      )}
    </div>
  );
};
