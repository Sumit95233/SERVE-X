import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ProtectedRoute, RoleGuard } from './components/common/ProtectedRoute';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { DonorLayout } from './components/layout/DonorLayout';
import { NGOLayout } from './components/layout/NGOLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Public pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { NgoDirectoryPage } from './pages/public/NgoDirectoryPage';
import { NgoDetailPage } from './pages/public/NgoDetailPage';
import { NgoLocatorPage } from './pages/public/NgoLocatorPage';
import { CampaignsPage } from './pages/public/CampaignsPage';
import { CampaignDetailPage } from './pages/public/CampaignDetailPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { PrivacyPolicyPage, TermsPage } from './pages/public/LegalPages';
import { UnauthorizedPage } from './pages/public/UnauthorizedPage';
import { LeaderboardPage } from './pages/public/LeaderboardPage';

// Donor pages
import { DonorDashboard } from './pages/donor/DonorDashboard';
import { ItemDonationPage } from './pages/donor/ItemDonationPage';
import { DonationHistoryPage } from './pages/donor/DonationHistoryPage';
import { DonorGiveCashPage } from './pages/donor/DonorGiveCashPage';
import { DonorImpactPage } from './pages/donor/DonorImpactPage';
import { DonorNotificationsPage } from './pages/donor/DonorNotificationsPage';
import { DonorProfilePage } from './pages/donor/DonorProfilePage';

// NGO pages
import { NgoDashboard } from './pages/ngo/NgoDashboard';
import { NgoProfilePage } from './pages/ngo/NgoProfilePage';
import { NgoRequirementsPage } from './pages/ngo/NgoRequirementsPage';
import { NgoItemsPage } from './pages/ngo/NgoItemsPage';
import { NgoClaimsPage } from './pages/ngo/NgoClaimsPage';
import { NgoCampaignsPage } from './pages/ngo/NgoCampaignsPage';
import { NgoDonationsPage } from './pages/ngo/NgoDonationsPage';
import { NgoReportsPage } from './pages/ngo/NgoReportsPage';

// Admin pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminNgosPage } from './pages/admin/AdminNgosPage';
import { AdminCampaignsPage } from './pages/admin/AdminCampaignsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminDonationsPage } from './pages/admin/AdminDonationsPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';

// Root Auth Gate: shows LoginPage as initial screen for logged-out users,
// or redirects authenticated users to their own role-specific dashboard.
const RootAuthRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const token = localStorage.getItem('servex_token');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F8FC]">
        <div className="w-8 h-8 border-3 border-[#07549A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated && user && token) {
    if (user.role === 'ngo') return <Navigate to="/ngo/dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/donor/dashboard" replace />;
  }

  return <LoginPage />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          <Routes>
          {/* Root Route: Displays Login Page as the Initial Screen for logged-out visitors */}
          <Route path="/" element={<RootAuthRoute />} />
          <Route path="/login" element={<RootAuthRoute />} />
          <Route path="/forgot-password" element={<RootAuthRoute />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Public Intentional Exploration Pages (PublicLayout with minimal navbar) */}
          <Route element={<PublicLayout />}>
            <Route path="/home" element={<LandingPage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/ngos" element={<NgoDirectoryPage />} />
            <Route path="/ngos/:id" element={<NgoDetailPage />} />
            <Route path="/ngo-locator" element={<NgoLocatorPage />} />
            <Route path="/campaigns" element={<CampaignsPage />} />
            <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
          </Route>

          {/* Protected Strict Donor Experience */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleGuard allowedRoles={['donor']} />}>
              <Route element={<DonorLayout />}>
                <Route path="/donor" element={<Navigate to="/donor/dashboard" replace />} />
                <Route path="/donor/dashboard" element={<DonorDashboard />} />
                <Route path="/donor/donate-items" element={<ItemDonationPage />} />
                <Route path="/donor/history" element={<DonationHistoryPage />} />
                <Route path="/donor/give-cash" element={<DonorGiveCashPage />} />
                <Route path="/donor/impact" element={<DonorImpactPage />} />
                <Route path="/donor/leaderboard" element={<LeaderboardPage />} />
                <Route path="/donor/notifications" element={<DonorNotificationsPage />} />
                <Route path="/donor/profile" element={<DonorProfilePage />} />
              </Route>
            </Route>
          </Route>

          {/* Protected Strict NGO Experience */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleGuard allowedRoles={['ngo']} />}>
              <Route element={<NGOLayout />}>
                <Route path="/ngo" element={<Navigate to="/ngo/dashboard" replace />} />
                <Route path="/ngo/dashboard" element={<NgoDashboard />} />
                <Route path="/ngo/profile" element={<NgoProfilePage />} />
                <Route path="/ngo/requirements" element={<NgoRequirementsPage />} />
                <Route path="/ngo/items" element={<NgoItemsPage />} />
                <Route path="/ngo/claims" element={<NgoClaimsPage />} />
                <Route path="/ngo/campaigns" element={<NgoCampaignsPage />} />
                <Route path="/ngo/donations" element={<NgoDonationsPage />} />
                <Route path="/ngo/reports" element={<NgoReportsPage />} />
                <Route path="/ngo/notifications" element={<DonorNotificationsPage />} />
                <Route path="/ngo/settings" element={<NgoProfilePage />} />
              </Route>
            </Route>
          </Route>

          {/* Protected Admin Experience */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleGuard allowedRoles={['admin']} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/ngos" element={<AdminNgosPage />} />
                <Route path="/admin/campaigns" element={<AdminCampaignsPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/donations" element={<AdminDonationsPage />} />
                <Route path="/admin/reports" element={<AdminDashboard />} />
                <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
              </Route>
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
