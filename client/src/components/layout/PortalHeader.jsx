import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  Heart,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Clock,
  Building2,
  LayoutDashboard,
  History,
  Package,
  PackageSearch,
  IndianRupee,
  Flame,
  ClipboardList,
  Handshake,
  FileBarChart2,
  PlusCircle,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';

export const PortalHeader = () => {
  const { user, ngo, logout, isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

  const profileDropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // Close menus on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setProfileDropdownOpen(false);
        setNotificationDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Determine role and portal paths
  const role = user?.role;
  const isNgo = role === 'ngo';
  const isDonor = role === 'donor';
  const isAdmin = role === 'admin';
  const isInsideNgoPortal = isNgo && (location.pathname === '/ngo' || location.pathname.startsWith('/ngo/'));

  const isVerified = ngo?.verificationStatus === 'verified';
  const isPending = !ngo || ngo.verificationStatus === 'pending';

  const getDashboardPath = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isNgo) return '/ngo/dashboard';
    if (isDonor) return '/donor/dashboard';
    return '/login';
  };

  const getDashboardLabel = () => {
    if (isAdmin) return 'Admin Dashboard';
    if (isNgo) return 'NGO Dashboard';
    if (isDonor) return 'Donor Dashboard';
    return 'Dashboard';
  };

  const getNotificationLink = () => {
    if (isNgo) return '/ngo/notifications';
    if (isDonor) return '/donor/notifications';
    return '/admin/dashboard';
  };

  const handleSignOut = async () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate('/login');
  };

  // Dedicated NGO Partner navigation links (all 8 operations modules)
  const ngoNavLinks = [
    { label: 'Overview', path: '/ngo/dashboard', icon: LayoutDashboard },
    { label: 'Campaigns', path: '/ngo/campaigns', icon: Flame },
    { label: 'Item Needs', path: '/ngo/requirements', icon: ClipboardList },
    { label: 'Browse Goods', path: '/ngo/items', icon: PackageSearch },
    { label: 'Claims', path: '/ngo/claims', icon: Handshake },
    { label: 'Donations (₹)', path: '/ngo/donations', icon: IndianRupee },
    { label: 'Reports', path: '/ngo/reports', icon: FileBarChart2 },
    { label: 'Profile & Darpan', path: '/ngo/profile', icon: Building2 },
  ];

  // Public primary navigation links (NGOs don't need NGO Locator map for donating)
  const publicNavLinks = [
    { label: 'Home', path: '/home' },
    { label: 'NGO Directory', path: '/ngos' },
    { label: 'Campaigns', path: '/campaigns' },
    { label: 'Leaderboard', path: '/leaderboard' },
    ...(!isNgo ? [{ label: 'NGO Locator', path: '/ngo-locator' }] : []),
  ];

  const getDisplayName = () => {
    if (isNgo && ngo?.organizationName) return ngo.organizationName;
    return user?.fullName || 'User';
  };

  const getInitials = () => {
    const name = getDisplayName();
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name[0].toUpperCase();
  };

  return (
    <header className="sticky top-0 z-[1050] bg-white/95 backdrop-blur-md border-b border-[#DFE7F0] shadow-xs w-full max-w-full overflow-x-clip">
      <div className="max-w-[1440px] w-full mx-auto px-3 sm:px-5 lg:px-6 xl:px-8 h-[72px] flex items-center justify-between gap-2 lg:gap-3 xl:gap-4">
        {/* Left Section: Brand Logo & Role Badge */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to={isAuthenticated ? getDashboardPath() : '/login'}
            className="inline-flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-[#84ADFF] rounded-[10px]"
            aria-label="Serve-X Home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#059669] to-[#047857] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-[#102A43]">
              Serve<span className="text-[#059669]">X</span>
            </span>
          </Link>

          {/* Role Badges (Adaptive on medium desktop to prevent horizontal scroll) */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center gap-2">
              {isNgo && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] rounded-full text-xs font-bold tracking-tight">
                  <span>🏢 NGO Workspace</span>
                  {isVerified && <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />}
                </span>
              )}

              {isDonor && (
                <span className="px-2.5 py-1 bg-[#EAF3FF] text-[#07549A] border border-[#C3D9FF] rounded-full text-xs font-bold uppercase tracking-wider">
                  ❤️ Donor
                </span>
              )}

              {isAdmin && (
                <span className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-bold uppercase tracking-wider">
                  🛡️ Admin
                </span>
              )}
            </div>
          )}
        </div>

        {/* Center: Navigation Links (Customized per role, only displayed for authenticated members) */}
        {isAuthenticated && (
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0" aria-label="Main Navigation">
            {isInsideNgoPortal ? (
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-full text-xs shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-slate-800">{ngo?.organizationName || 'Partner Portal'}</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 font-bold font-mono text-[11px]">{ngo?.darpanId ? `DARPAN: ${ngo.darpanId}` : 'Verified Entity'}</span>
              </div>
            ) : (
              publicNavLinks.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`px-2.5 xl:px-3 py-1.5 rounded-[10px] text-xs font-semibold whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-[#84ADFF] ${
                      isActive
                        ? 'bg-[#EAF3FF] text-[#07549A] font-bold'
                        : 'text-[#526780] hover:text-[#102033] hover:bg-[#F3F7FB]'
                    }`}
                  >
                    {item.label}
                  </NavLink>
                );
              })
            )}
          </nav>
        )}

        {/* Right Section: User Controls or Sign In */}
        <div className="hidden sm:flex items-center gap-2 xl:gap-2.5 shrink-0">
          {isAuthenticated ? (
            <>
              {/* Notification Bell */}
              <div className="relative shrink-0" ref={notificationRef}>
                <button
                  type="button"
                  onClick={() => {
                    setNotificationDropdownOpen((prev) => !prev);
                    setProfileDropdownOpen(false);
                  }}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#84ADFF] border ${
                    notificationDropdownOpen
                      ? 'bg-[#EAF3FF] text-[#07549A] border-[#C3D9FF] shadow-xs'
                      : 'bg-white text-[#526780] border-[#DFE7F0] hover:text-[#07549A] hover:bg-[#F3F7FB] hover:border-[#CCD8E6]'
                  }`}
                  title={`Notifications (${unreadCount} unread)`}
                  aria-label={`Notifications, ${unreadCount} unread`}
                  aria-haspopup="dialog"
                  aria-expanded={notificationDropdownOpen}
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#059669] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white shadow-xs">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                <NotificationDropdown
                  isOpen={notificationDropdownOpen}
                  onClose={() => setNotificationDropdownOpen(false)}
                  viewAllLink={getNotificationLink()}
                />
              </div>

              {/* Direct Dashboard / Quick Action Link Pill */}
              {isInsideNgoPortal ? (
                <Link
                  to="/ngo/requirements"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition shadow-xs bg-[#059669] hover:bg-[#047857] text-white shrink-0"
                  title="Publish Urgent Item Requirement"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Post Need</span>
                </Link>
              ) : (
                <Link
                  to={getDashboardPath()}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition shadow-xs focus:outline-none focus:ring-2 focus:ring-[#84ADFF] shrink-0 ${
                    isNgo
                      ? 'bg-[#059669] hover:bg-[#047857] text-white'
                      : location.pathname.startsWith('/donor') || location.pathname.startsWith('/admin')
                      ? 'bg-[#EAF3FF] text-[#07549A] border border-[#BFDBFE]'
                      : 'bg-[#07549A] hover:bg-[#06457E] text-white'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>{getDashboardLabel()}</span>
                </Link>
              )}

              {/* User / Organization Profile Dropdown */}
              <div className="relative shrink-0" ref={profileDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen((prev) => !prev);
                    setNotificationDropdownOpen(false);
                  }}
                  className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl border transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#84ADFF] ${
                    profileDropdownOpen
                      ? 'border-[#07549A] bg-[#F3F7FB] ring-2 ring-[#07549A]/10'
                      : 'border-[#DFE7F0] bg-white hover:bg-[#F3F7FB] hover:border-[#CCD8E6]'
                  }`}
                  aria-expanded={profileDropdownOpen}
                  aria-haspopup="true"
                  aria-label="User Account Menu"
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs uppercase shadow-xs shrink-0 select-none ${
                      isNgo
                        ? 'bg-gradient-to-br from-[#059669] to-[#047857] text-white'
                        : isAdmin
                        ? 'bg-gradient-to-br from-[#6D3FC0] to-[#592DA5] text-white'
                        : 'bg-gradient-to-br from-[#07549A] to-[#06457E] text-white'
                    }`}
                  >
                    {getInitials()}
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="font-bold text-xs text-[#102033] truncate max-w-[110px]">
                      {getDisplayName()}
                    </div>
                    <div className="text-[10px] text-[#059669] font-bold leading-none mt-0.5">
                      {isNgo
                        ? isVerified
                          ? 'Verified NGO'
                          : 'NGO Partner'
                        : isDonor
                        ? 'Donor'
                        : 'Admin'}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#7C8DA5] ml-0.5" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-60 bg-white rounded-2xl border border-[#DFE7F0] shadow-[0_16px_40px_rgba(16,42,67,0.16)] py-2 z-[1100] animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-[#DFE7F0] bg-[#F8FAFC]/50">
                      <div className="font-bold text-xs text-[#102033] truncate">
                        {getDisplayName()}
                      </div>
                      <div className="text-[11px] text-[#7C8DA5] truncate mt-0.5">
                        {user?.email}
                      </div>
                    </div>

                    <div className="py-1">
                      {/* Role Specific Dropdown Items */}
                      <Link
                        to={getDashboardPath()}
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#526780] hover:text-[#07549A] hover:bg-[#F3F7FB] transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#7C8DA5]" />
                        <span>{getDashboardLabel()}</span>
                      </Link>

                      {isDonor && (
                        <>
                          <Link
                            to="/donor/profile"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#526780] hover:text-[#07549A] hover:bg-[#F3F7FB] transition"
                          >
                            <User className="w-4 h-4 text-[#7C8DA5]" />
                            <span>My Profile</span>
                          </Link>
                          <Link
                            to="/donor/history"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#526780] hover:text-[#07549A] hover:bg-[#F3F7FB] transition"
                          >
                            <History className="w-4 h-4 text-[#7C8DA5]" />
                            <span>Donation History</span>
                          </Link>
                          <Link
                            to="/donor/donate-items"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#526780] hover:text-[#07549A] hover:bg-[#F3F7FB] transition"
                          >
                            <Package className="w-4 h-4 text-[#7C8DA5]" />
                            <span>Donate Items</span>
                          </Link>
                          <Link
                            to="/donor/give-cash"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#526780] hover:text-[#07549A] hover:bg-[#F3F7FB] transition"
                          >
                            <IndianRupee className="w-4 h-4 text-[#7C8DA5]" />
                            <span>Give Cash</span>
                          </Link>
                        </>
                      )}

                      {isNgo && (
                        <>
                          <Link
                            to="/ngo/profile"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#526780] hover:text-[#059669] hover:bg-[#ECFDF5] transition"
                          >
                            <Building2 className="w-4 h-4 text-[#059669]" />
                            <span>Organization & Darpan</span>
                          </Link>
                          <Link
                            to="/ngo/campaigns"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#526780] hover:text-[#059669] hover:bg-[#ECFDF5] transition"
                          >
                            <Flame className="w-4 h-4 text-[#F97316]" />
                            <span>My Fundraisers</span>
                          </Link>
                          <Link
                            to="/ngo/requirements"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#526780] hover:text-[#059669] hover:bg-[#ECFDF5] transition"
                          >
                            <ClipboardList className="w-4 h-4 text-[#059669]" />
                            <span>Item Needs Manager</span>
                          </Link>
                          <Link
                            to="/ngo/donations"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#526780] hover:text-[#059669] hover:bg-[#ECFDF5] transition"
                          >
                            <IndianRupee className="w-4 h-4 text-[#059669]" />
                            <span>Received Donations</span>
                          </Link>
                          <Link
                            to="/ngo/reports"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#526780] hover:text-[#059669] hover:bg-[#ECFDF5] transition"
                          >
                            <FileBarChart2 className="w-4 h-4 text-[#0284C7]" />
                            <span>Transparency Reports</span>
                          </Link>
                          {ngo?._id && (
                            <Link
                              to={`/ngos/${ngo._id}`}
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#07549A] hover:bg-[#EAF3FF] transition"
                            >
                              <ExternalLink className="w-4 h-4 text-[#07549A]" />
                              <span>View Public Page ↗</span>
                            </Link>
                          )}
                        </>
                      )}
                    </div>

                    <div className="my-1 border-t border-[#DFE7F0]" />

                    <div className="px-2 pt-1">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#DC3545] hover:bg-red-50 rounded-xl transition text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Logged Out Visitor: Strictly Sign In */
            <Link
              to="/login"
              className="px-5 py-2 text-xs font-bold text-white bg-[#07549A] hover:bg-[#06457E] rounded-xl shadow-xs transition hover:shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="lg:hidden flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                to={getDashboardPath()}
                className="text-xs font-semibold px-2.5 py-1.5 bg-[#07549A] text-white rounded-lg"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-[#526780] hover:text-[#102033] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#84ADFF]"
                aria-label="Toggle Navigation Menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-xs font-bold px-3.5 py-1.5 bg-[#07549A] hover:bg-[#06457E] text-white rounded-xl shadow-xs"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Drawer (Only for authenticated members) */}
      {isAuthenticated && mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#DFE7F0] bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-150">
          {isAuthenticated && (
            <div className="px-3 py-2 border-b border-[#DFE7F0] mb-2 flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-[#102033]">{getDisplayName()}</div>
                <div className="text-xs text-[#059669] font-medium">
                  {isNgo
                    ? isVerified
                      ? 'Verified NGO'
                      : 'NGO Partner'
                    : isDonor
                    ? 'Donor Account'
                    : 'Administrator'}
                </div>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-xs text-[#DC3545] font-bold px-2 py-1 bg-red-50 rounded-lg cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}

          {/* Navigation Links */}
          {isNgo ? (
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider px-3 mb-1">
                NGO Partner Workspace
              </div>
              {ngoNavLinks.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold ${
                      isActive
                        ? 'bg-[#ECFDF5] text-[#065F46] font-bold border border-[#A7F3D0]'
                        : 'text-[#334155] hover:bg-[#F0FDF4] hover:text-[#065F46]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#059669]' : 'text-[#64748B]'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <div className="pt-2 mt-2 border-t border-[#DFE7F0]">
                <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider px-3 mb-1">
                  Public Discovery
                </div>
                <Link
                  to="/ngos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#475569] hover:bg-[#F1F5F9]"
                >
                  <Building2 className="w-4 h-4 text-[#07549A]" />
                  <span>Public NGO Directory</span>
                </Link>
              </div>
            </div>
          ) : (
            publicNavLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#526780] hover:text-[#102033] hover:bg-[#F3F7FB]"
              >
                {item.label}
              </Link>
            ))
          )}

          <div className="pt-2 border-t border-[#DFE7F0] flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full text-center py-2 text-white rounded-xl font-bold text-xs shadow-xs ${
                    isNgo ? 'bg-[#059669] hover:bg-[#047857]' : 'bg-[#07549A] hover:bg-[#06457E]'
                  }`}
                >
                  {isNgo ? 'Open NGO Workspace' : getDashboardLabel()}
                </Link>
                {isDonor && (
                  <Link
                    to="/donor/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 border border-[#DFE7F0] text-[#526780] rounded-xl font-semibold text-xs hover:bg-[#F3F7FB]"
                  >
                    My Profile
                  </Link>
                )}
                {isNgo && (
                  <Link
                    to="/ngo/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 border border-[#A7F3D0] text-[#065F46] bg-[#ECFDF5] rounded-xl font-semibold text-xs hover:bg-[#D1FAE5]"
                  >
                    Organization & Darpan Profile
                  </Link>
                )}
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 bg-[#07549A] text-white rounded-xl font-bold text-xs"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
