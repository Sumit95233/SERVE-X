import React from 'react';
import { Outlet } from 'react-router-dom';
import { PublicNavbar } from './PublicNavbar';
import { Footer } from '../common/Footer';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-transparent w-full max-w-full overflow-x-hidden">
      <PublicNavbar />
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
