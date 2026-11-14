import React, { useState } from 'react';
import { X, UserPlus, Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

/**
 * GoogleAccountModal
 * High-fidelity Google "Choose an account" simulation modal.
 * Allows 1-click instant login with user's real Gmail or test accounts without requiring Google Cloud Console OAuth setup.
 */
export default function GoogleAccountModal({
  isOpen,
  onClose,
  role = 'donor',
  onSelectAccount,
  onOpenSetupGuide,
  loading = false,
}) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [selectedEmail, setSelectedEmail] = useState(null);

  if (!isOpen) return null;

  const defaultAccounts = [
    {
      name: 'Sumit Raj',
      email: 'dynamiteg067@gmail.com',
      badge: 'Primary Account',
      avatarBg: 'bg-[#1a73e8]',
      avatarText: 'S',
      roleType: 'donor',
    },
    {
      name: 'Sumit Raj (Support)',
      email: 'sumitrajslm2018@gmail.com',
      badge: 'Support Contact',
      avatarBg: 'bg-[#00B98B]',
      avatarText: 'S',
      roleType: 'donor',
    },
    ...(role === 'ngo'
      ? [
          {
            name: 'Anshu Gupta',
            email: 'goonj@servex.org',
            badge: 'Verified NGO Admin (Goonj)',
            avatarBg: 'bg-[#e37400]',
            avatarText: 'A',
            roleType: 'ngo',
          },
        ]
      : [
          {
            name: 'Vikram Aditya',
            email: 'donor@servex.org',
            badge: 'Verified Donor',
            avatarBg: 'bg-[#7c3aed]',
            avatarText: 'V',
            roleType: 'donor',
          },
        ]),
  ];

  const handleAccountClick = (account) => {
    setSelectedEmail(account.email);
    onSelectAccount({
      fullName: account.name,
      email: account.email,
      avatar: '',
      googleId: `google_sim_${account.email.replace(/[^a-zA-Z0-9]/g, '_')}`,
    });
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail.trim() || !customEmail.includes('@')) return;
    const name = customName.trim() || customEmail.split('@')[0];
    setSelectedEmail(customEmail.trim());
    onSelectAccount({
      fullName: name,
      email: customEmail.trim(),
      avatar: '',
      googleId: `google_sim_${customEmail.trim().replace(/[^a-zA-Z0-9]/g, '_')}`,
    });
  };

  return (
    <div className="fixed inset-0 z-[2500] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-100 flex flex-col relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Top Accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]" />

        {/* Close button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
          title="Cancel"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Google Header */}
        <div className="flex flex-col items-center text-center mt-2 mb-5">
          {/* Official Google G Logo */}
          <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-gray-100 flex items-center justify-center p-2 mb-3">
            <svg className="w-7 h-7" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
          </div>

          <h2 className="text-[20px] font-semibold text-[#202124] tracking-tight">
            Choose an account
          </h2>
          <p className="text-[13px] text-[#5f6368] mt-0.5">
            to continue to <span className="font-semibold text-[#07549A]">ServeX</span>
          </p>

          <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-[#1a73e8] border border-blue-100">
            <Sparkles className="w-3 h-3 text-[#1a73e8]" />
            <span>Role: {role === 'ngo' ? '🏢 NGO' : '❤️ Donor'}</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-600 font-normal">Simulation Mode</span>
          </div>
        </div>

        {/* Loading overlay during account selection */}
        {loading ? (
          <div className="py-10 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 border-3 border-[#4285F4] border-t-transparent rounded-full animate-spin mb-4" />
            <div className="text-sm font-semibold text-[#202124]">
              Signing in as {selectedEmail || 'Google User'}...
            </div>
            <p className="text-xs text-gray-500 mt-1">Connecting to ServeX securely</p>
          </div>
        ) : !showCustomInput ? (
          /* Account List */
          <div className="space-y-1 mb-4">
            {defaultAccounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleAccountClick(acc)}
                className="w-full text-left p-3 rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition-all flex items-center justify-between group border border-transparent hover:border-gray-200"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full ${acc.avatarBg} text-white font-bold text-base flex items-center justify-center shrink-0 shadow-xs`}
                  >
                    {acc.avatarText}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[14px] font-semibold text-[#202124] truncate group-hover:text-[#1a73e8] transition-colors">
                      {acc.name}
                    </div>
                    <div className="text-[12px] text-[#5f6368] truncate">{acc.email}</div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {acc.badge}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#1a73e8] transition-colors" />
                </div>
              </button>
            ))}

            {/* Use another account option */}
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              className="w-full text-left p-3 rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition-all flex items-center gap-3.5 border border-dashed border-gray-200 hover:border-gray-300 mt-2 text-[#202124]"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                <UserPlus className="w-5 h-5" />
              </div>
              <div className="text-[13px] font-medium text-[#202124]">
                Use another Google account...
              </div>
            </button>
          </div>
        ) : (
          /* Custom Account Form */
          <form onSubmit={handleCustomSubmit} className="space-y-3.5 mb-4 animate-in fade-in">
            <div className="text-xs font-semibold text-gray-700 mb-1">
              Enter any Google Account to test:
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-600 mb-1">Full Name</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Sumit Raj"
                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-600 mb-1">
                Gmail Address *
              </label>
              <input
                type="email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="e.g. user@gmail.com"
                required
                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCustomInput(false)}
                className="flex-1 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2 text-xs font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* Footer Policy and Simulation Notice */}
        <div className="pt-3 border-t border-gray-100 text-[11px] text-[#5f6368] leading-relaxed">
          <p className="mb-2">
            To continue, Google will share your name, email address, and profile picture with ServeX.
          </p>
          <div className="flex items-center justify-between text-[10px] text-gray-400">
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Instant Localhost Simulation
            </span>
            {onOpenSetupGuide && (
              <button
                type="button"
                onClick={onOpenSetupGuide}
                className="text-[#1a73e8] hover:underline font-medium"
              >
                OAuth Setup Guide
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
