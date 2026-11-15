import React, { Suspense } from 'react';
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

// Direct initial page
import { LoginPage } from './pages/public/LoginPage';

// Helper for dynamic imports of named exports
const lazyNamed = (importFn, name) =>
  React.lazy(() => importFn().then((mod) => ({ default: mod[name] })));

// Public pages (lazy loaded for high performance)
const LandingPage = lazyNamed(() => import('./pages/public/LandingPage'), 'LandingPage');
const RegisterPage = lazyNamed(() => import('./pages/public/RegisterPage'), 'RegisterPage');
const NgoDirectoryPage = lazyNamed(() => import('./pages/public/NgoDirectoryPage'), 'NgoDirectoryPage');
const NgoDetailPage = lazyNamed(() => import('./pages/public/NgoDetailPage'), 'NgoDetailPage');
const NgoLocatorPage = lazyNamed(() => import('./pages/public/NgoLocatorPage'), 'NgoLocatorPage');
const CampaignsPage = lazyNamed(() => import('./pages/public/CampaignsPage'), 'CampaignsPage');
const CampaignDetailPage = lazyNamed(() => import('./pages/public/CampaignDetailPage'), 'CampaignDetailPage');
const AboutPage = lazyNamed(() => import('./pages/public/AboutPage'), 'AboutPage');
const ContactPage = lazyNamed(() => import('./pages/public/ContactPage'), 'ContactPage');
const PrivacyPolicyPage = lazyNamed(() => import('./pages/public/LegalPages'), 'PrivacyPolicyPage');
const TermsPage = lazyNamed(() => import('./pages/public/LegalPages'), 'TermsPage');
const UnauthorizedPage = lazyNamed(() => import('./pages/public/UnauthorizedPage'), 'UnauthorizedPage');
const LeaderboardPage = lazyNamed(() => import('./pages/public/LeaderboardPage'), 'LeaderboardPage');

// Donor pages (lazy loaded)
const DonorDashboard = lazyNamed(() => import('./pages/donor/DonorDashboard'), 'DonorDashboard');
const ItemDonationPage = lazyNamed(() => import('./pages/donor/ItemDonationPage'), 'ItemDonationPage');
const DonationHistoryPage = lazyNamed(() => import('./pages/donor/DonationHistoryPage'), 'DonationHistoryPage');
const DonorGiveCashPage = lazyNamed(() => import('./pages/donor/DonorGiveCashPage'), 'DonorGiveCashPage');
const DonorImpactPage = lazyNamed(() => import('./pages/donor/DonorImpactPage'), 'DonorImpactPage');
const DonorNotificationsPage = lazyNamed(() => import('./pages/donor/DonorNotificationsPage'), 'DonorNotificationsPage');
const DonorProfilePage = lazyNamed(() => import('./pages/donor/DonorProfilePage'), 'DonorProfilePage');

// NGO pages (lazy loaded)
const NgoDashboard = lazyNamed(() => import('./pages/ngo/NgoDashboard'), 'NgoDashboard');
const NgoProfilePage = lazyNamed(() => import('./pages/ngo/NgoProfilePage'), 'NgoProfilePage');
const NgoRequirementsPage = lazyNamed(() => import('./pages/ngo/NgoRequirementsPage'), 'NgoRequirementsPage');
const NgoItemsPage = lazyNamed(() => import('./pages/ngo/NgoItemsPage'), 'NgoItemsPage');
const NgoClaimsPage = lazyNamed(() => import('./pages/ngo/NgoClaimsPage'), 'NgoClaimsPage');
const NgoCampaignsPage = lazyNamed(() => import('./pages/ngo/NgoCampaignsPage'), 'NgoCampaignsPage');
const NgoDonationsPage = lazyNamed(() => import('./pages/ngo/NgoDonationsPage'), 'NgoDonationsPage');
const NgoReportsPage = lazyNamed(() => import('./pages/ngo/NgoReportsPage'), 'NgoReportsPage');

// Admin pages (lazy loaded)
const AdminDashboard = lazyNamed(() => import('./pages/admin/AdminDashboard'), 'AdminDashboard');
const AdminNgosPage = lazyNamed(() => import('./pages/admin/AdminNgosPage'), 'AdminNgosPage');
const AdminCampaignsPage = lazyNamed(() => import('./pages/admin/AdminCampaignsPage'), 'AdminCampaignsPage');
const AdminUsersPage = lazyNamed(() => import('./pages/admin/AdminUsersPage'), 'AdminUsersPage');
const AdminDonationsPage = lazyNamed(() => import('./pages/admin/AdminDonationsPage'), 'AdminDonationsPage');
const AdminAuditLogsPage = lazyNamed(() => import('./pages/admin/AdminAuditLogsPage'), 'AdminAuditLogsPage');

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
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 1800,
              style: {
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '500',
              },
            }}
          />
          <Suspense
            fallback={
              <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F8FC] gap-3">
                <div className="w-8 h-8 border-3 border-[#07549A] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-semibold text-slate-500">Loading Serve-X...</span>
              </div>
            }
          >
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
          </Suspense>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
