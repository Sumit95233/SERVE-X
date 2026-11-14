import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  Building2,
  Flame,
  Users,
  IndianRupee,
  FileText,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
} from 'lucide-react';
import { Footer } from '../common/Footer';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const adminLinks = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'NGO Approvals', path: '/admin/ngos', icon: Building2 },
    { label: 'Campaign Moderation', path: '/admin/campaigns', icon: Flame },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Donations Audit', path: '/admin/donations', icon: IndianRupee },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: FileText },
  ];

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC] w-full max-w-full overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-[#101828] text-white border-b border-gray-800 shadow-md w-full max-w-full overflow-x-clip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Serve<span className="text-[#00B98B]">X</span>
              </span>
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-full text-xs font-bold uppercase tracking-wider">
              🛡️ System Administration
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {adminLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gray-800 text-white shadow-xs'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-xs font-bold text-white">{user?.fullName || 'Administrator'}</div>
              <div className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold">Root Admin</div>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-xl transition"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-gray-900 border-t border-gray-800 px-4 py-3 space-y-1">
            {adminLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-sm font-semibold ${
                    isActive ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
