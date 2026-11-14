import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import {
  Heart,
  Building2,
  User,
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') === 'ngo' ? 'ngo' : 'donor';
  const prefillEmail = searchParams.get('email') || '';
  const prefillName = searchParams.get('name') || '';

  const [accountType, setAccountType] = useState(initialType);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(null);

  const navigate = useNavigate();
  const { registerDonor, registerNGO } = useAuth();

  // Statistics for left panel
  const [stats, setStats] = useState({
    verifiedNgos: 5,
    successfulDonations: 24,
    peopleSupported: 148,
  });

  // Verified English quotes rotation
  const quotes = [
    {
      text: 'The best way to find yourself is to lose yourself in the service of others.',
      author: 'Mahatma Gandhi',
    },
    {
      text: 'No one has ever become poor by giving.',
      author: 'Anne Frank',
    },
    {
      text: 'We make a living by what we get, but we make a life by what we give.',
      author: 'Winston Churchill',
    },
    {
      text: "If you can't feed a hundred people, then feed just one.",
      author: 'Mother Teresa',
    },
    {
      text: "Your kindness can become someone's reason to hope.",
      author: 'Serve-X',
    },
    {
      text: 'Together, we can turn compassion into action.',
      author: 'Serve-X',
    },
  ];
  const [activeQuoteIdx, setActiveQuoteIdx] = useState(0);


  // Donor form
  const [donorForm, setDonorForm] = useState({
    fullName: prefillName,
    email: prefillEmail,
    phone: '',
    password: '',
    confirmPassword: '',
  });

  // NGO form
  const [ngoForm, setNgoForm] = useState({
    organizationName: '',
    registrationNumber: '',
    contactPerson: prefillName,
    email: prefillEmail,
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '',
    causeCategories: ['Disaster Relief'],
    description: '',
  });

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

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveQuoteIdx((prev) => (prev + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [quotes.length]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats');
        if (res.data?.success && res.data?.data) {
          setStats({
            verifiedNgos: res.data.data.verifiedNgos || 5,
            successfulDonations: res.data.data.successfulDonations || 24,
            peopleSupported: res.data.data.peopleSupported || 148,
          });
        }
      } catch (err) {
        console.warn('Stats fetch notice', err);
      }
    };
    fetchStats();
  }, []);

  const handleCauseToggle = (cause) => {
    setNgoForm((prev) => {
      const exists = prev.causeCategories.includes(cause);
      return {
        ...prev,
        causeCategories: exists
          ? prev.causeCategories.filter((c) => c !== cause)
          : [...prev.causeCategories, cause],
      };
    });
  };

  const handleDonorSubmit = async (e) => {
    e.preventDefault();
    if (donorForm.password !== donorForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (donorForm.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await registerDonor(donorForm);
    setLoading(false);

    if (result.success) {
      setRegistrationSuccess({
        role: 'donor',
        title: 'Donor Account Activated!',
        message: 'Your account is ready. Welcome to the Serve-X compassionate network.',
        target: '/donor/dashboard',
      });
    }
  };

  const handleNgoSubmit = async (e) => {
    e.preventDefault();
    if (ngoForm.password !== ngoForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (ngoForm.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (ngoForm.causeCategories.length === 0) {
      toast.error('Please select at least one cause category');
      return;
    }

    setLoading(true);
    const result = await registerNGO(ngoForm);
    setLoading(false);

    if (result.success) {
      setRegistrationSuccess({
        role: 'ngo',
        title: 'NGO Registration Submitted!',
        message: 'Your organization application is under administrative review (Pending Verification). You can view your dashboard to update your profile.',
        target: '/ngo/dashboard',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F7F9FC]">
      {/* 1. LEFT PANEL: Emotional Photography & Humanitarian Storytelling */}
      <div className="relative w-full lg:w-[42%] min-h-[460px] lg:min-h-screen flex flex-col justify-between p-8 sm:p-12 lg:p-14 overflow-hidden text-white bg-[#07549A]">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out scale-100 hover:scale-105"
          style={{
            backgroundImage: "url('/images/community-help.jpg')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#07549A]/95 via-[#07549A]/75 to-[#07549A]/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07549A]/70 via-transparent to-[#00B98B]/30" />

        {/* Top Header Branding */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition shadow-sm">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Serve<span className="text-[#00B98B]">X</span>
            </span>
          </Link>
          <span className="text-xs font-semibold px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-white/90 border border-white/20">
            Join the Mission
          </span>
        </div>

        {/* Center Emotional Storytelling */}
        <div className="relative z-10 my-10 lg:my-auto max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#00B98B]/30 backdrop-blur-md border border-[#00B98B]/40 rounded-full text-xs font-bold text-[#E6FFFA] uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#00B98B]" />
            Make a Tangible Difference
          </div>

          <h2 className="text-2xl sm:text-4xl font-black leading-tight text-white mb-4">
            Create an account to join India's trusted humanitarian movement.
          </h2>

          <p className="text-sm sm:text-base text-white/85 leading-relaxed mb-6 font-medium">
            Whether donating extra household items, contributing funds to disaster relief, or coordinating grassroots field distribution as a verified NGO, your journey starts here.
          </p>

          <div className="bg-[#102A43]/80 backdrop-blur-md border border-white/15 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300">
            <div className="text-[19px] font-semibold text-white leading-snug mb-3">
              "{quotes[activeQuoteIdx].text}"
            </div>
            <div className="text-[14px] font-medium text-[#A7F3D0]">
              — {quotes[activeQuoteIdx].author}
            </div>

            <div className="flex items-center gap-1.5 mt-4">
              {quotes.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveQuoteIdx(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeQuoteIdx === idx ? 'w-6 bg-[#00B98B]' : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Show quote ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Platform Live Impact Statistics */}
        <div className="relative z-10 pt-4 border-t border-white/20">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/15">
              <div className="text-xl sm:text-2xl font-extrabold text-white">
                {stats.verifiedNgos}+
              </div>
              <div className="text-[11px] font-semibold text-emerald-200">
                Verified NGOs
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/15">
              <div className="text-xl sm:text-2xl font-extrabold text-white">
                {stats.successfulDonations}+
              </div>
              <div className="text-[11px] font-semibold text-emerald-200">
                Successful Donations
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/15">
              <div className="text-xl sm:text-2xl font-extrabold text-white">
                {stats.peopleSupported}+
              </div>
              <div className="text-[11px] font-semibold text-emerald-200">
                People Supported
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. RIGHT PANEL: Role-Specific Registration Form */}
      <div className="w-full lg:w-[58%] flex items-center justify-center p-6 sm:p-10 lg:p-14 bg-[#F7F9FC]">
        <div className="w-full max-w-[560px]">
          {/* Success Overlay Modal */}
          {registrationSuccess ? (
            <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-xl text-center">
              <div className="w-16 h-16 bg-emerald-50 text-[#00B98B] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-[#101828] mb-2">
                {registrationSuccess.title}
              </h2>
              <p className="text-sm text-[#64748B] mb-6 leading-relaxed">
                {registrationSuccess.message}
              </p>
              <button
                onClick={() => navigate(registrationSuccess.target, { replace: true })}
                className="w-full py-3.5 bg-[#07549A] hover:bg-[#003B64] text-white font-bold text-sm rounded-xl shadow-sm transition"
              >
                Proceed to Dashboard
              </button>
            </div>
          ) : (
            <>
              {/* Form Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-black tracking-tight text-[#101828]">
                  Create an Account
                </h1>
                <p className="text-sm text-[#64748B] mt-1 font-medium">
                  Choose your account type to access your dedicated dashboard.
                </p>
              </div>

              {/* Role Selection Tabs */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-[#101828] uppercase tracking-wider mb-2">
                  Select Role
                </label>
                <div className="grid grid-cols-2 gap-2 bg-[#E9EEF4] p-1.5 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setAccountType('donor')}
                    className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all ${
                      accountType === 'donor'
                        ? 'bg-white text-[#07549A] shadow-sm font-bold ring-1 ring-black/5'
                        : 'text-[#64748B] hover:text-[#101828] font-semibold'
                    }`}
                  >
                    <span className="text-base">❤️ Individual Donor</span>
                    <span className="text-[10px] text-[#64748B] mt-0.5 font-normal">
                      Give items & cash
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAccountType('ngo')}
                    className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all ${
                      accountType === 'ngo'
                        ? 'bg-white text-[#00B98B] shadow-sm font-bold ring-1 ring-black/5'
                        : 'text-[#64748B] hover:text-[#101828] font-semibold'
                    }`}
                  >
                    <span className="text-base">🏢 NGO Partner</span>
                    <span className="text-[10px] text-[#64748B] mt-0.5 font-normal">
                      Post needs & campaigns
                    </span>
                  </button>
                </div>
              </div>

              {/* A. DONOR REGISTRATION FORM */}
              {accountType === 'donor' ? (
                <form onSubmit={handleDonorSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#344054] mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={donorForm.fullName}
                        onChange={(e) => setDonorForm({ ...donorForm, fullName: e.target.value })}
                        placeholder="e.g. Vikram Aditya"
                        required
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#D0D5DD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#07549A]/20 focus:border-[#07549A] transition text-[#101828]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#344054] mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={donorForm.email}
                          onChange={(e) => setDonorForm({ ...donorForm, email: e.target.value })}
                          placeholder="donor@example.com"
                          required
                          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#D0D5DD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#07549A]/20 focus:border-[#07549A] transition text-[#101828]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#344054] mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={donorForm.phone}
                          onChange={(e) => setDonorForm({ ...donorForm, phone: e.target.value })}
                          placeholder="9876543210"
                          required
                          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#D0D5DD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#07549A]/20 focus:border-[#07549A] transition text-[#101828]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#344054] mb-1.5">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={donorForm.password}
                          onChange={(e) => setDonorForm({ ...donorForm, password: e.target.value })}
                          placeholder="Min 6 characters"
                          required
                          className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-[#D0D5DD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#07549A]/20 focus:border-[#07549A] transition text-[#101828]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#344054] mb-1.5">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={donorForm.confirmPassword}
                          onChange={(e) => setDonorForm({ ...donorForm, confirmPassword: e.target.value })}
                          placeholder="Re-enter password"
                          required
                          className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-[#D0D5DD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#07549A]/20 focus:border-[#07549A] transition text-[#101828]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-[#07549A] hover:bg-[#003B64] text-white font-bold text-sm rounded-xl shadow-sm hover:shadow-md transition active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 mt-4"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Register as Donor</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* B. NGO REGISTRATION FORM */
                <form onSubmit={handleNgoSubmit} className="space-y-3.5">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                    <Clock className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                    <span>
                      <strong>Notice:</strong> All registered NGOs start in <strong>Pending Verification</strong> status until verified by our administrative review team.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-[#344054] mb-1">
                        Organization Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={ngoForm.organizationName}
                        onChange={(e) => setNgoForm({ ...ngoForm, organizationName: e.target.value })}
                        placeholder="e.g. Robin Hood Army"
                        required
                        className="w-full px-3 py-2 text-sm bg-white border border-[#D0D5DD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B98B]/20 focus:border-[#00B98B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#344054] mb-1">
                        Registration / 80G Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={ngoForm.registrationNumber}
                        onChange={(e) => setNgoForm({ ...ngoForm, registrationNumber: e.target.value })}
                        placeholder="e.g. DL-12345/2020"
                        required
                        className="w-full px-3 py-2 text-sm bg-white border border-[#D0D5DD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B98B]/20 focus:border-[#00B98B]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-[#344054] mb-1">
                        Contact Person <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={ngoForm.contactPerson}
                        onChange={(e) => setNgoForm({ ...ngoForm, contactPerson: e.target.value })}
                        placeholder="Coordinator name"
                        required
                        className="w-full px-3 py-2 text-sm bg-white border border-[#D0D5DD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B98B]/20 focus:border-[#00B98B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#344054] mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={ngoForm.email}
                        onChange={(e) => setNgoForm({ ...ngoForm, email: e.target.value })}
                        placeholder="contact@ngo.org"
                        required
                        className="w-full px-3 py-2 text-sm bg-white border border-[#D0D5DD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B98B]/20 focus:border-[#00B98B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#344054] mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={ngoForm.phone}
                        onChange={(e) => setNgoForm({ ...ngoForm, phone: e.target.value })}
                        placeholder="9876543210"
                        required
                        className="w-full px-3 py-2 text-sm bg-white border border-[#D0D5DD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B98B]/20 focus:border-[#00B98B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#344054] mb-1">
                      Official Registered Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={ngoForm.address}
                      onChange={(e) => setNgoForm({ ...ngoForm, address: e.target.value })}
                      placeholder="Office building, street, locality"
                      required
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D0D5DD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B98B]/20 focus:border-[#00B98B]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#344054] mb-1">City *</label>
                      <input
                        type="text"
                        value={ngoForm.city}
                        onChange={(e) => setNgoForm({ ...ngoForm, city: e.target.value })}
                        placeholder="City"
                        required
                        className="w-full px-3 py-2 text-sm bg-white border border-[#D0D5DD] rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#344054] mb-1">State *</label>
                      <input
                        type="text"
                        value={ngoForm.state}
                        onChange={(e) => setNgoForm({ ...ngoForm, state: e.target.value })}
                        placeholder="State"
                        required
                        className="w-full px-3 py-2 text-sm bg-white border border-[#D0D5DD] rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#344054] mb-1">Pincode *</label>
                      <input
                        type="text"
                        value={ngoForm.pincode}
                        onChange={(e) => setNgoForm({ ...ngoForm, pincode: e.target.value })}
                        placeholder="110001"
                        required
                        className="w-full px-3 py-2 text-sm bg-white border border-[#D0D5DD] rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#344054] mb-1">
                      Cause Categories (Select all that apply) <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-gray-50 rounded-xl border border-gray-200">
                      {availableCauses.map((c) => {
                        const selected = ngoForm.causeCategories.includes(c);
                        return (
                          <button
                            type="button"
                            key={c}
                            onClick={() => handleCauseToggle(c)}
                            className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition ${
                              selected
                                ? 'bg-[#00B98B] text-white'
                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            {selected ? '✓ ' : ''}{c}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#344054] mb-1">
                      Mission Statement / Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={ngoForm.description}
                      onChange={(e) => setNgoForm({ ...ngoForm, description: e.target.value })}
                      placeholder="Briefly describe your organization's mission and operations (min 20 characters)..."
                      required
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D0D5DD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B98B]/20"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-[#344054] mb-1">Password *</label>
                      <input
                        type="password"
                        value={ngoForm.password}
                        onChange={(e) => setNgoForm({ ...ngoForm, password: e.target.value })}
                        placeholder="Min 6 characters"
                        required
                        className="w-full px-3 py-2 text-sm bg-white border border-[#D0D5DD] rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#344054] mb-1">Confirm Password *</label>
                      <input
                        type="password"
                        value={ngoForm.confirmPassword}
                        onChange={(e) => setNgoForm({ ...ngoForm, confirmPassword: e.target.value })}
                        placeholder="Re-enter password"
                        required
                        className="w-full px-3 py-2 text-sm bg-white border border-[#D0D5DD] rounded-xl"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-[#00B98B] hover:bg-[#009E77] text-white font-bold text-sm rounded-xl shadow-sm hover:shadow-md transition active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 mt-4"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Submit NGO Registration for Review</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Footer Login Link */}
              <div className="mt-6 text-center text-xs text-[#64748B]">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-[#07549A] hover:underline">
                  Sign in here
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
