import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PortalHeader } from './PortalHeader';
import { NGOSidebar } from './NGOSidebar';
import { VerificationBanner } from '../ngo/VerificationBanner';
import { Footer } from '../common/Footer';

export const NGOLayout = () => {
  const { ngo } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB] w-full max-w-full overflow-x-hidden">
      {/* Exactly ONE Primary Top Navigation Header */}
      <PortalHeader />

      {/* Main Container: Max 1440px with responsive sidebar on desktop */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col lg:flex-row gap-6">
          <NGOSidebar />
          <main className="flex-1 min-w-0 w-full max-w-full overflow-x-hidden">
            {ngo && ngo.verificationStatus !== 'verified' && (
              <div className="mb-5">
                <VerificationBanner ngo={ngo} />
              </div>
            )}
            <Outlet />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};
