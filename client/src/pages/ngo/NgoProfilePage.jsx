import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  ShieldCheck,
  Lock,
  Save,
  ExternalLink,
  Award,
  MapPin,
  Phone,
  Mail,
  FileCheck2,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const NgoProfilePage = () => {
  const { ngo, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    organizationName: '',
    description: '',
    logo: '',
    contactPerson: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    causeCategories: [],
  });

  useEffect(() => {
    if (ngo) {
      setForm({
        organizationName: ngo.organizationName || '',
        description: ngo.description || '',
        logo: ngo.logo || '',
        contactPerson: ngo.contactPerson || '',
        phone: ngo.phone || '',
        address: ngo.address || '',
        city: ngo.city || '',
        state: ngo.state || '',
        pincode: ngo.pincode || '',
        causeCategories: ngo.causeCategories || [],
      });
    }
  }, [ngo]);

  const availableCauses = [
    'Disaster Relief',
    'Child Welfare',
    'Education',
    'Hunger Relief',
    'Healthcare',
    'Elderly Care',
    'Women Empowerment',
    'Animal Welfare',
    'Community Development',
  ];

  const handleCauseToggle = (c) => {
    setForm((prev) => {
      const exists = prev.causeCategories.includes(c);
      return {
        ...prev,
        causeCategories: exists
          ? prev.causeCategories.filter((item) => item !== c)
          : [...prev.causeCategories, c],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/ngos/profile', form);
      if (res.data?.success) {
        toast.success('Organization profile updated successfully');
        await refreshUser();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Breadcrumb & Public Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#059669] mb-1">
            <span>NGO Workspace</span>
            <span>/</span>
            <span>Entity Credentials</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
            Organization Profile & Darpan Verification
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Manage your official organization profile, registration credentials, and helpline details visible to donors across India.
          </p>
        </div>

        {ngo?._id && (
          <Link
            to={`/ngos/${ngo._id}`}
            className="px-3.5 py-2 bg-white hover:bg-[#F8FAFC] text-[#07549A] border border-[#BFDBFE] text-xs font-bold rounded-xl shadow-xs transition inline-flex items-center gap-1.5 shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#07549A]" />
            <span>View Public NGO Profile</span>
          </Link>
        )}
      </div>

      {/* 2. Read-Only Legal Compliance Card */}
      <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] rounded-2xl p-5 border border-[#CBD5E1] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#059669] uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Official Government Credentials</span>
          </div>
          <div className="text-sm font-black text-[#0F172A]">
            Darpan Portal ID: <span className="font-mono text-[#059669]">{ngo?.darpanId || ngo?.registrationNumber || 'VERIFIED'}</span>
          </div>
          <p className="text-xs text-[#64748B]">
            Section 80G Tax Exemption & Section 12A Certified • NITI Aayog Verified Partner
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
            <ShieldCheck className="w-4 h-4 text-[#059669]" />
            <span>Verified Non-Profit</span>
          </span>
        </div>
      </div>

      {/* 3. Editable Form Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E8F0] shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                Official Organization Name *
              </label>
              <input
                type="text"
                required
                value={form.organizationName}
                onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                Logo Image URL
              </label>
              <input
                type="url"
                value={form.logo}
                onChange={(e) => setForm({ ...form, logo: e.target.value })}
                placeholder="https://example.com/logo.png"
                className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                Authorized Coordinator / Contact Person *
              </label>
              <input
                type="text"
                required
                value={form.contactPerson}
                onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                Helpline / Phone Number *
              </label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
              Registered Ground Office Address *
            </label>
            <input
              type="text"
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                City / District *
              </label>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                State / UT *
              </label>
              <input
                type="text"
                required
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                Pincode *
              </label>
              <input
                type="text"
                required
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1.5">
              Focus Cause Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {availableCauses.map((c) => {
                const isSelected = form.causeCategories.includes(c);
                return (
                  <button
                    type="button"
                    key={c}
                    onClick={() => handleCauseToggle(c)}
                    className={`text-xs px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#059669] border-[#059669] text-white font-bold shadow-xs'
                        : 'bg-[#F8FAFC] border-[#CBD5E1] text-[#475569] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
              Official Mission & Impact Statement *
            </label>
            <textarea
              rows={4}
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs rounded-xl shadow-xs transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving Changes...' : 'Save Organization Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};