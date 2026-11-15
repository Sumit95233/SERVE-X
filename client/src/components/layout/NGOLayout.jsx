import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PortalHeader } from './PortalHeader';
import { NGOTopNav } from './NGOTopNav';
import { VerificationBanner } from '../ngo/VerificationBanner';
import { Footer } from '../common/Footer';

export const NGOLayout = () => {
  const { ngo } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-transparent w-full max-w-full overflow-x-hidden">
      {/* 1. Exactly ONE Primary Top Navigation Header */}
      <PortalHeader />

      {/* 2. Top Horizontal Workspace Navigation Bar */}
      <NGOTopNav />

      {/* 3. Main Container: Full width layout (no left sidebar, maximum spaciousness) */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <main className="w-full max-w-full overflow-x-hidden">
          {ngo && ngo.verificationStatus !== 'verified' && (
            <div className="mb-5">
              <VerificationBanner ngo={ngo} />
            </div>
          )}
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};
