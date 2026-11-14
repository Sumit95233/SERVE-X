import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowRight,
  Heart,
  MapPin,
  ShieldCheck,
  Package,
  IndianRupee,
  Users,
  Search,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Clock,
  ArrowUpRight,
  Building2,
  HeartHandshake,
  LayoutDashboard,
  PackagePlus,
  Utensils,
  Shirt,
  BookOpen,
  HeartPulse,
  Gamepad2,
  Laptop,
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';

export const LandingPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [featuredNgos, setFeaturedNgos] = useState([]);
  const [urgentRequirements, setUrgentRequirements] = useState([]);
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [platformStats, setPlatformStats] = useState({
    verifiedNgos: 5,
    successfulDonations: 24,
    peopleSupported: 148,
  });
  const [loading, setLoading] = useState(true);
  const [faqOpen, setFaqOpen] = useState(null);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const [ngosRes, reqsRes, campaignsRes, statsRes] = await Promise.all([
          api.get('/ngos?limit=4'),
          api.get('/requirements?limit=4&urgency=urgent'),
          api.get('/campaigns?limit=3'),
          api.get('/stats').catch(() => null),
        ]);

        if (ngosRes.data?.success) {
          setFeaturedNgos(ngosRes.data.data);
          if (ngosRes.data.summary?.totalVerifiedNgos) {
            setPlatformStats((prev) => ({
              ...prev,
              verifiedNgos: ngosRes.data.summary.totalVerifiedNgos,
            }));
          }
        }
        if (reqsRes.data?.success) {
          if (reqsRes.data.data.length < 4) {
            const allReqs = await api.get('/requirements?limit=4');
            setUrgentRequirements(allReqs.data.data || []);
          } else {
            setUrgentRequirements(reqsRes.data.data);
          }
        }
        if (campaignsRes.data?.success) setActiveCampaigns(campaignsRes.data.data);
        if (statsRes?.data?.success && statsRes.data.data) {
          setPlatformStats(statsRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load landing data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingData();
  }, []);

  const categories = [
    { name: 'Food', count: '140+ Needs', icon: Utensils, color: 'bg-amber-50 text-amber-600 ring-amber-200/80', desc: 'Grains, mid-day meals, dry rations' },
    { name: 'Clothes', count: '95+ Needs', icon: Shirt, color: 'bg-blue-50 text-blue-600 ring-blue-200/80', desc: 'Warm blankets, winter wear, uniform sets' },
    { name: 'Books', count: '60+ Needs', icon: BookOpen, color: 'bg-indigo-50 text-indigo-600 ring-indigo-200/80', desc: 'School textbooks, encyclopedias, stationery' },
    { name: 'Medicine', count: '45+ Needs', icon: HeartPulse, color: 'bg-rose-50 text-rose-600 ring-rose-200/80', desc: 'First aid kits, wheelchairs, health supplies' },
    { name: 'Toys', count: '30+ Needs', icon: Gamepad2, color: 'bg-purple-50 text-purple-600 ring-purple-200/80', desc: 'Educational toys, sports kits, games' },
    { name: 'Electronics', count: '25+ Needs', icon: Laptop, color: 'bg-emerald-50 text-emerald-600 ring-emerald-200/80', desc: 'Refurbished laptops, tablets, chargers' },
  ];

  const faqs = [
    {
      q: 'How does Serve-X verify partner NGOs?',
      a: 'Every organization registered on Serve-X undergoes rigorous administrative verification. We validate their official government registration certificate, 12A/80G status, Darpan ID, and operational history before awarding the verified badge.',
    },
    {
      q: 'Is my monetary donation eligible for tax deductions?',
      a: 'Yes. All monetary donations made to verified partner NGOs generate an official Section 80G tax receipt that can be downloaded instantly from your donor dashboard.',
    },
    {
      q: 'How does physical item donation pickup work?',
      a: 'When you list physical goods (such as clothes, books, or devices), nearby verified NGOs can submit a claim request. Once you approve their request, their verified volunteer team coordinates pickup at your specified availability slot.',
    },
    {
      q: 'Can I choose to remain anonymous when donating?',
      a: 'Yes. When contributing to any fundraising campaign, you can toggle the "Donate Anonymously" option. Your name will be hidden from public supporters lists while maintaining valid tax receipt generation.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* 1. HERO SECTION - Soft blue-to-mint gradient & navy headline */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-20 lg:pb-32 bg-gradient-to-br from-[#E2F1FD] via-[#E8F8F5] to-[#DAF6EE]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-white/40 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-black tracking-tight text-[#101828] leading-[1.15] mb-6">
            Bridging the Gap for{' '}
            <span className="bg-gradient-to-r from-[#00B98B] to-[#009E77] bg-clip-text text-transparent">
              Global Good.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#475467] max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
            Every helping hand can change a life. Connect with trusted NGOs, support families in need, and turn compassion into meaningful action.
          </p>

          {/* Authenticated User Greeting Pill */}
          {isAuthenticated && user && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-emerald-200 shadow-xs backdrop-blur-xs text-[#059669] text-xs font-bold mb-4 animate-in fade-in duration-200">
              <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
              <span>
                Welcome back, <strong className="text-[#102A43]">{user.fullName || 'Champion'}</strong>!
              </span>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            {isAuthenticated ? (
              <>
                <Link
                  to={
                    user?.role === 'ngo'
                      ? '/ngo/dashboard'
                      : user?.role === 'admin'
                      ? '/admin/dashboard'
                      : '/donor/dashboard'
                  }
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#07549A] hover:bg-[#06457E] text-white font-bold text-base rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>
                    {user?.role === 'ngo'
                      ? 'Go to NGO Portal'
                      : user?.role === 'admin'
                      ? 'Admin Console'
                      : 'Go to Donor Dashboard'}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to={user?.role === 'ngo' ? '/ngo/requirements' : '/campaigns'}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white hover:bg-gray-50 text-[#101828] font-bold text-base rounded-full shadow-sm hover:shadow-md border border-gray-200 transition-all duration-200"
                >
                  <HeartHandshake className="w-5 h-5 text-[#059669]" />
                  <span>{user?.role === 'ngo' ? 'Post Requirements' : 'Explore Campaigns'}</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#07549A] hover:bg-[#003B64] text-white font-bold text-base rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/ngos"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-white hover:bg-gray-50 text-[#101828] font-bold text-base rounded-full shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200"
                >
                  Explore NGOs
                </Link>
              </>
            )}
          </div>

          {/* Live Platform Impact Statistics Card */}
          <div className="bg-white rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-[#E5EAF0] p-6 sm:p-8 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
              <div className="py-3 sm:py-0 sm:px-6 text-center">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#07549A] flex items-center justify-center mx-auto mb-2 shadow-xs">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[#07549A] mb-1 tabular-nums">
                  {platformStats.verifiedNgos}+
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[#64748B]">
                  Verified NGOs
                </div>
              </div>
              <div className="py-3 sm:py-0 sm:px-6 text-center">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center mx-auto mb-2 shadow-xs">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[#059669] mb-1 tabular-nums">
                  {platformStats.successfulDonations}+
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[#64748B]">
                  Successful Donations
                </div>
              </div>
              <div className="py-3 sm:py-0 sm:px-6 text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#101828] mb-1">
                  {platformStats.peopleSupported}+
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[#64748B]">
                  People Supported
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 font-semibold text-center mt-5 pt-3.5 border-t border-gray-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-time platform metrics from active database records</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE CORE WAYS TO SERVE */}

      <section className="py-16 bg-white border-b border-[#E5EAF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#00B98B] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
              Direct Action Hub
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101828] mt-2">
              Three Meaningful Ways to Make a Difference
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#F8FAFC] rounded-3xl p-8 border border-gray-100 hover:border-[#00B98B]/30 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E6F8F0] to-[#CCF3E1] text-[#059669] flex items-center justify-center mb-6 ring-1 ring-[#A6F4C5]/60 shadow-xs group-hover:scale-105 transition-transform">
                <Package className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#101828] mb-2">Donate Physical Items</h3>
              <p className="text-sm text-[#64748B] leading-relaxed mb-6">
                List gently used clothes, blankets, school books, or gadgets. Nearby verified NGOs arrange direct pickup.
              </p>
              <Link
                to="/donor/donate-items"
                className="inline-flex items-center text-sm font-bold text-[#00B98B] hover:text-emerald-700 gap-1.5"
              >
                List Items for Donation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-[#F8FAFC] rounded-3xl p-8 border border-gray-100 hover:border-[#07549A]/30 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EAF3FF] to-[#D5E7FF] text-[#07549A] flex items-center justify-center mb-6 ring-1 ring-[#BFDBFE]/60 shadow-xs group-hover:scale-105 transition-transform">
                <IndianRupee className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#101828] mb-2">Support Active Campaigns</h3>
              <p className="text-sm text-[#64748B] leading-relaxed mb-6">
                Contribute funds to vetted causes with 100% financial transparency and instant Section 80G tax receipts.
              </p>
              <Link
                to="/campaigns"
                className="inline-flex items-center text-sm font-bold text-[#07549A] hover:text-[#003B64] gap-1.5"
              >
                Explore Active Campaigns <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-[#F8FAFC] rounded-3xl p-8 border border-gray-100 hover:border-[#55E6C1]/30 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] text-[#0F766E] flex items-center justify-center mb-6 ring-1 ring-[#99F6E4]/60 shadow-xs group-hover:scale-105 transition-transform">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#101828] mb-2">Discover Nearby NGOs</h3>
              <p className="text-sm text-[#64748B] leading-relaxed mb-6">
                Find grassroots initiatives across Delhi, Mumbai, Bengaluru, and tier-2 cities on our interactive map.
              </p>
              <Link
                to="/ngo-locator"
                className="inline-flex items-center text-sm font-bold text-teal-600 hover:text-teal-800 gap-1.5"
              >
                Open Interactive Map <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. URGENT DONATION REQUIREMENTS */}
      <section className="py-16 bg-[#F7F9FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider bg-rose-50 px-3 py-1 rounded-full">
                Time Sensitive
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101828] mt-2">
                Urgent Needs from Verified Shelters
              </h2>
            </div>
            <Link
              to="/ngos"
              className="inline-flex items-center gap-1 text-sm font-bold text-[#07549A] hover:underline"
            >
              View all requirements <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {urgentRequirements.map((req) => (
              <div
                key={req._id}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full">
                      {req.category}
                    </span>
                    <StatusBadge status={req.urgency} />
                  </div>
                  <h4 className="font-bold text-base text-[#101828] line-clamp-2 mb-2">
                    {req.title}
                  </h4>
                  <p className="text-xs text-[#64748B] line-clamp-2 mb-4">
                    {req.description}
                  </p>
                </div>

                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1 flex justify-between">
                    <span>Fulfilled</span>
                    <span className="font-bold text-gray-800">
                      {req.quantityFulfilled} / {req.quantityRequired} {req.unit || 'units'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full bg-[#00B98B] rounded-full"
                      style={{
                        width: `${Math.min(100, Math.round((req.quantityFulfilled / req.quantityRequired) * 100))}%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-100">
                    <span className="text-gray-500 flex items-center gap-1 truncate max-w-[140px]">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      {req.city}
                    </span>
                    <Link
                      to="/donor/donate-items"
                      className="font-bold text-[#07549A] hover:underline"
                    >
                      Fulfill Need →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ACTIVE FUNDRAISING CAMPAIGNS */}
      <section className="py-16 bg-white border-y border-[#E5EAF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-[#07549A] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
                Verified Fundraisers
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101828] mt-2">
                Featured Impact Campaigns
              </h2>
            </div>
            <Link
              to="/campaigns"
              className="inline-flex items-center gap-1 text-sm font-bold text-[#07549A] hover:underline"
            >
              Browse all campaigns <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {activeCampaigns.map((camp) => (
              <div
                key={camp._id}
                className="bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-xs hover:shadow-xl transition-all flex flex-col group"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={
                      camp.images?.[0] ||
                      'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&fit=crop'
                    }
                    alt={camp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-black/60 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {camp.causeCategory}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[#64748B] mb-2">
                      <ShieldCheck className="w-4 h-4 text-[#00B98B]" />
                      <span className="font-semibold text-gray-800">
                        {camp.ngoId?.organizationName || 'Verified NGO'}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-[#101828] mb-2 line-clamp-2">
                      {camp.title}
                    </h3>
                    <p className="text-xs text-[#64748B] line-clamp-2 mb-4">
                      {camp.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <div>
                        <span className="text-xl font-black text-[#101828]">
                          ₹{(camp.amountRaised || 0).toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          raised of ₹{(camp.goalAmount || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#00B98B]">
                        {camp.progressPercentage || 0}%
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-5">
                      <div
                        className="h-full bg-gradient-to-r from-[#07549A] to-[#00B98B] rounded-full"
                        style={{ width: `${camp.progressPercentage || 0}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {camp.daysLeft || 30} days left
                      </span>
                      <Link
                        to={`/campaigns/${camp._id}`}
                        className="px-4 py-2 bg-[#07549A] hover:bg-[#003B64] text-white text-xs font-bold rounded-xl shadow-xs transition"
                      >
                        Donate Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURED VERIFIED NGOS */}
      <section className="py-16 bg-[#F7F9FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#00B98B] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
              Trust & Transparency
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101828] mt-2">
              Featured Verified Organizations
            </h2>
            <p className="text-sm text-[#64748B] mt-2">
              Every NGO partner undergoes strict background checks, registration audits, and financial validation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredNgos.map((ngo) => (
              <div
                key={ngo._id}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={
                        ngo.logo ||
                        'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=100&fit=crop'
                      }
                      alt={ngo.organizationName}
                      className="w-12 h-12 rounded-2xl object-cover border border-gray-100"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-[#101828] line-clamp-1">
                        {ngo.organizationName}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified NGO
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-[#64748B] line-clamp-3 mb-4">
                    {ngo.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(ngo.causeCategories || []).slice(0, 2).map((cat, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {ngo.city}
                  </span>
                  <Link
                    to={`/ngos/${ngo._id}`}
                    className="font-bold text-[#07549A] hover:underline"
                  >
                    View Profile →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BROWSE BY CATEGORY */}
      <section className="py-16 bg-white border-t border-[#E5EAF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101828]">
              Browse Donations by Need Category
            </h2>
            <p className="text-sm text-[#64748B] mt-2">
              Filter requirements and campaigns based on your passion.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, idx) => {
              const IconComponent = cat.icon;
              return (
                <Link
                  key={idx}
                  to={`/ngos?cause=${encodeURIComponent(cat.name)}`}
                  className="bg-white hover:bg-[#F8FAFC] border border-[#DFE7F0] hover:border-[#07549A]/40 hover:shadow-md rounded-2xl p-5 text-center transition-all group flex flex-col items-center justify-between hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-2xl ${cat.color} ring-1 flex items-center justify-center mb-3 shadow-xs group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#101828] group-hover:text-[#07549A] transition-colors mb-0.5">{cat.name}</h4>
                    <span className="inline-block text-[11px] font-semibold text-[#64748B] bg-slate-100 px-2 py-0.5 rounded-full">{cat.count}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS */}
      <section className="py-20 bg-gradient-to-br from-[#003B64] to-[#07549A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Transparent, Direct, and Trustworthy
          </h2>
          <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto mb-14">
            Every step is tracked digitally from listing to doorstep pickup and 80G tax receipt issuance.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10 text-left">
              <span className="w-10 h-10 rounded-xl bg-[#00B98B] font-black text-lg flex items-center justify-center text-white mb-6">
                1
              </span>
              <h3 className="text-xl font-bold mb-2">Discover & Choose</h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                Filter verified NGOs by your city or explore active fundraisers with clear budgets and goals.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10 text-left">
              <span className="w-10 h-10 rounded-xl bg-[#55E6C1] font-black text-lg flex items-center justify-center text-[#003B64] mb-6">
                2
              </span>
              <h3 className="text-xl font-bold mb-2">Donate or List Items</h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                Make instantaneous secure UPI/Card payments, or list physical items for verified NGO volunteer pickup.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10 text-left">
              <span className="w-10 h-10 rounded-xl bg-white font-black text-lg flex items-center justify-center text-[#07549A] mb-6">
                3
              </span>
              <h3 className="text-xl font-bold mb-2">Track Verified Impact</h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                Receive proof of receipt, view lives touched metrics, and download Section 80G compliant tax exemption receipts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101828]">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[#64748B] mt-2">
              Everything you need to know about donating goods and funds on ServeX.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = faqOpen === index;
              return (
                <div
                  key={index}
                  className="border border-[#E5EAF0] rounded-2xl overflow-hidden transition"
                >
                  <button
                    onClick={() => setFaqOpen(isOpen ? null : index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center font-bold text-sm text-[#101828] hover:bg-gray-50 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        isOpen ? 'rotate-180 text-[#07549A]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[#64748B] leading-relaxed border-t border-gray-100 bg-gray-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA BANNER */}
      <section className="py-16 bg-[#F7F9FC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#07549A] to-[#00B98B] rounded-3xl p-10 sm:p-14 text-white text-center shadow-xl relative overflow-hidden">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Ready to Be the Unsung Hero?
            </h2>
            <p className="text-sm sm:text-base text-slate-100 max-w-xl mx-auto mb-8">
              Join thousands of donors across India making verified grassroots impact today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to={
                      user?.role === 'ngo'
                        ? '/ngo/dashboard'
                        : user?.role === 'admin'
                        ? '/admin/dashboard'
                        : '/donor/dashboard'
                    }
                    className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#07549A] hover:bg-gray-50 font-bold text-sm rounded-full shadow-md hover:shadow-lg transition inline-flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>
                      {user?.role === 'ngo'
                        ? 'Open NGO Portal'
                        : user?.role === 'admin'
                        ? 'Admin Console'
                        : 'Open Donor Dashboard'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/campaigns"
                    className="w-full sm:w-auto px-8 py-3.5 bg-black/20 hover:bg-black/30 border border-white/30 text-white font-bold text-sm rounded-full transition inline-flex items-center justify-center gap-2"
                  >
                    <Heart className="w-4 h-4 text-emerald-300 fill-emerald-300" />
                    <span>Explore Campaigns</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#07549A] font-bold text-sm rounded-full shadow-md hover:bg-gray-50 transition"
                  >
                    Create Free Donor Account
                  </Link>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto px-8 py-3.5 bg-black/20 hover:bg-black/30 border border-white/30 text-white font-bold text-sm rounded-full transition"
                  >
                    Register Your NGO
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
