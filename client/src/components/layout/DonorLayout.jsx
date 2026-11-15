import React from 'react';
import { Outlet } from 'react-router-dom';
import { PortalHeader } from './PortalHeader';
import { Footer } from '../common/Footer';

export const DonorLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-transparent w-full max-w-full overflow-x-hidden">
      {/* Exactly ONE Primary Top Navigation Header */}
      <PortalHeader />

      {/* Main Centered Container */}
      <div className="flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-5 lg:px-7 py-7">
        <main className="w-full max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};
