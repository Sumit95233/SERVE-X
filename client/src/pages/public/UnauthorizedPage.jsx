import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, LogOut, Compass, Building2, User } from 'lucide-react';

export const UnauthorizedPage = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ngo') return '/ngo/dashboard';
    if (user.role === 'admin') return '/admin/dashboard';
    return '/donor/dashboard';
  };

  const getDashboardName = () => {
    if (!user) return 'Sign In';
    if (user.role === 'ngo') return 'NGO Dashboard';
    if (user.role === 'admin') return 'Admin Dashboard';
    return 'Donor Dashboard';
  };

  const attemptedPath = location.state?.attempted || 'this restricted section';
  const roleLabel = user?.role === 'ngo' ? 'an NGO Partner' : user?.role === 'donor' ? 'a Donor' : 'an Administrator';

  const handleSwitchAccount = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full uppercase tracking-wider">
          Access Restricted
        </span>

        <h1 className="text-2xl font-black text-[#101828] mt-4 mb-2">
          Strict Role Separation
        </h1>

        <p className="text-sm text-[#64748B] leading-relaxed mb-6">
          You are currently signed in as <strong className="text-[#101828] font-semibold">{user?.fullName || 'User'}</strong> ({roleLabel}).
          For security and privacy, Donors and NGOs have completely separated interfaces and permissions.
        </p>

        <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-gray-100 mb-6 text-left">
          <div className="text-xs text-[#64748B] font-medium">Attempted route:</div>
          <div className="text-xs font-mono font-bold text-gray-800 truncate mt-0.5">
            {attemptedPath}
          </div>
          <div className="text-xs text-[#07549A] mt-2 font-medium">
            Please use your designated role dashboard to access features permitted for your account.
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to={getDashboardPath()}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#07549A] hover:bg-[#003B64] text-white rounded-xl font-bold text-sm shadow-sm transition"
          >
            {user?.role === 'ngo' ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
            <span>Go to My {getDashboardName()}</span>
          </Link>

          <button
            onClick={handleSwitchAccount}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm border border-gray-200 transition"
          >
            <LogOut className="w-4 h-4 text-gray-500" />
            <span>Sign In to Another Account</span>
          </button>

          <Link
            to="/"
            className="text-xs font-semibold text-[#64748B] hover:text-[#101828] pt-2"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};
