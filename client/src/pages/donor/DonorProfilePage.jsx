import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Save,
  Trophy,
  Bell,
  Eye,
  EyeOff,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const DonorProfilePage = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isPublicDonor, setIsPublicDonor] = useState(true);
  const [emailReceipts, setEmailReceipts] = useState(true);
  const [platformUpdates, setPlatformUpdates] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const res = await api.get('/leaderboard/me');
        if (res.data?.success && res.data?.data) {
          setIsPublicDonor(res.data.data.isPublicDonor ?? true);
          if (res.data.data.emailPreferences) {
            setEmailReceipts(res.data.data.emailPreferences.donationReceipts ?? true);
            setPlatformUpdates(res.data.data.emailPreferences.platformUpdates ?? false);
          }
        }
      } catch (err) {
        console.warn('[Fetch Donor Prefs Notice]', err.message);
      }
    };
    fetchPrefs();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.patch('/leaderboard/preferences', {
        isPublicDonor,
        emailPreferences: {
          donationReceipts: emailReceipts,
          platformUpdates,
        },
      });

      if (res.data?.success) {
        toast.success('Profile and impact privacy preferences saved successfully');
      }
    } catch (err) {
      toast.error('Failed to update preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F6FA] py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF3FF] text-[#07549A] text-xs font-bold uppercase tracking-wider mb-2">
            <User className="w-3.5 h-3.5" />
            <span>Donor Account</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101828]">
            Donor Profile & Settings
          </h1>
          <p className="text-sm text-[#667085] mt-1">
            Manage your personal profile, leaderboard anonymity, and email notification preferences.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E4E9F0] shadow-[0_2px_8px_rgba(16,42,67,0.04)]">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Account Details */}
            <div>
              <label className="block text-xs font-bold text-[#101828] uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#07549A]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#101828] uppercase tracking-wider mb-1.5">
                  Email Address (Verified)
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101828] uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#07549A]"
                />
              </div>
            </div>

            {/* Privacy & Leaderboard Settings Section */}
            <div className="pt-4 border-t border-[#E4E9F0] space-y-4">
              <h2 className="text-sm font-bold text-[#101828] uppercase tracking-wider flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#07549A]" />
                <span>Champions of Change Leaderboard Privacy</span>
              </h2>

              <div className="bg-[#F8FAFC] border border-[#E4E9F0] rounded-xl p-4 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-[#101828] flex items-center gap-2">
                    {isPublicDonor ? (
                      <>
                        <Eye className="w-4 h-4 text-[#059669]" />
                        <span>Public Ranking: Enabled</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4 text-[#667085]" />
                        <span>Public Ranking: Anonymous Supporter</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-[#667085] leading-relaxed">
                    {isPublicDonor
                      ? 'Your display name and contribution tier are listed publicly on the Champions of Change leaderboard.'
                      : 'Your contributions will appear as "Anonymous Supporter" on the public leaderboard. Your private financial history is never exposed.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPublicDonor(!isPublicDonor)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#84ADFF] ${
                    isPublicDonor ? 'bg-[#07549A]' : 'bg-gray-300'
                  }`}
                  aria-label="Toggle Public Leaderboard Visibility"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      isPublicDonor ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Email Preferences Section */}
            <div className="pt-4 border-t border-[#E4E9F0] space-y-4">
              <h2 className="text-sm font-bold text-[#101828] uppercase tracking-wider flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#07549A]" />
                <span>Email Notifications & Automated Receipts</span>
              </h2>

              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailReceipts}
                    onChange={(e) => setEmailReceipts(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-[#07549A] border-gray-300 rounded focus:ring-[#84ADFF]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#101828]">
                      Verified Donation Thank-You & Tax Receipt Emails
                    </span>
                    <p className="text-xs text-[#667085]">
                      Receive automated thank-you emails and Section 80G tax receipts immediately after verified monetary contributions.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={platformUpdates}
                    onChange={(e) => setPlatformUpdates(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-[#07549A] border-gray-300 rounded focus:ring-[#84ADFF]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#101828]">
                      Platform Impact Updates & Newsletters
                    </span>
                    <p className="text-xs text-[#667085]">
                      Occasional updates highlighting campaigns funded and communities helped through Serve-X.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-[#E4E9F0]">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-[#07549A] hover:bg-[#06457E] text-white font-bold text-sm rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Profile & Privacy Preferences'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
