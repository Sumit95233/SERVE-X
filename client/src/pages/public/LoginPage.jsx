import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Heart,
  Eye,
  EyeOff,
  Building2,
  Info,
  X,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';

const ROLE_THEMES = {
  donor: {
    name: 'Compassion Blue',
    primary: '#07549A',
    primaryHover: '#06457E',
    accent: '#059669',
    selectedBackground: '#EAF3FF',
    selectedBorder: '#07549A',
    focusRing: '#84ADFF',
    headingAccent: '#07549A',
    buttonText: '#FFFFFF',
    buttonLabel: 'Sign In as Donor',
    googleButtonLabel: 'Continue with Google as Donor',
    roleTag: 'Donor Portal',
    description: 'A calm, trustworthy blue and emerald identity representing generosity, transparency and individual contributions.',
  },
  ngo: {
    name: 'Community Teal',
    primary: '#6D3FC0',
    primaryHover: '#592DA5',
    accent: '#0F9D8A',
    selectedBackground: '#F3ECFF',
    selectedBorder: '#6D3FC0',
    focusRing: '#C4B5FD',
    headingAccent: '#6D3FC0',
    buttonText: '#FFFFFF',
    buttonLabel: 'Sign In as NGO',
    googleButtonLabel: 'Continue with Google as NGO',
    roleTag: 'NGO Community',
    description: 'A distinct violet and teal identity representing collaboration, community organizations and coordinated social impact.',
  },
};

export const LoginPage = () => {
  const [role, setRole] = useState('donor');
  const currentTheme = ROLE_THEMES[role] || ROLE_THEMES.donor;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showGoogleAccountModal, setShowGoogleAccountModal] = useState(false);
  const [showGoogleSetupModal, setShowGoogleSetupModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Verified English-only quotations
  const quotes = [
    {
      text: 'Together, we can turn compassion into action.',
      author: 'Serve-X',
    },
    {
      text: "Your kindness can become someone's reason to hope.",
      author: 'Serve-X',
    },
    {
      text: 'The best way to find yourself is to lose yourself in the service of others.',
      author: 'Mahatma Gandhi',
    },
    {
      text: 'No act of kindness, no matter how small, is ever wasted.',
      author: 'Aesop',
    },
  ];
  const [activeQuoteIdx, setActiveQuoteIdx] = useState(0);
  const [quoteFade, setQuoteFade] = useState(true);

  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Rotate English quotation with subtle fade transition every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteFade(false);
      setTimeout(() => {
        setActiveQuoteIdx((prev) => (prev + 1) % quotes.length);
        setQuoteFade(true);
      }, 250);
    }, 6000);
    return () => clearInterval(timer);
  }, [quotes.length]);

  // Open forgot password modal if navigated to /forgot-password
  useEffect(() => {
    if (location.pathname === '/forgot-password') {
      setShowForgotModal(true);
    }
  }, [location.pathname]);

  // Handle Google OAuth redirect return (hash fragment #id_token=...)
  useEffect(() => {
    if (window.location.hash && window.location.hash.includes('id_token=')) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const idToken = hashParams.get('id_token');
      if (idToken) {
        window.history.replaceState(null, '', window.location.pathname);
        handleGoogleCredentialResponse({ credential: idToken });
      }
    }
  }, []);

  const triggerGoogleOAuthRedirect = () => {
    if (!googleClientId) {
      toast.error('Google Client ID is not configured');
      return;
    }
    const origin = window.location.origin;
    const redirectUri = `${origin}/login`;
    const nonce = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      googleClientId
    )}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=id_token&scope=openid%20email%20profile&nonce=${nonce}`;
    window.location.href = googleAuthUrl;
  };

  // Initialize Google Identity Services if available and configured
  useEffect(() => {
    if (!googleClientId) return;

    const renderOfficialGoogleBtn = () => {
      if (window.google?.accounts?.id) {
        try {
          window.handleGoogleCredentialResponse = (response) => {
            handleGoogleCredentialResponse(response);
          };

          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: (resp) => {
              console.log('[GIS Callback Triggered]', resp);
              handleGoogleCredentialResponse(resp);
            },
            auto_select: false,
            itp_support: true,
            use_fedcm_for_prompt: true,
          });

          const btnContainer = document.getElementById('googleSignInOfficialBtn');
          if (btnContainer) {
            btnContainer.innerHTML = '';
            window.google.accounts.id.renderButton(btnContainer, {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              text: 'continue_with',
              shape: 'rectangular',
              logo_alignment: 'left',
              width: 380,
            });
          }

          window.google.accounts.id.prompt();
        } catch (err) {
          console.warn('Google Identity initialization notice', err);
        }
      }
    };

    if (window.google?.accounts?.id) {
      renderOfficialGoogleBtn();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          renderOfficialGoogleBtn();
        }
      }, 150);
      return () => clearInterval(interval);
    }
  }, [googleClientId, role]);

  const handleGoogleCredentialResponse = async (response) => {
    if (!response?.credential) {
      toast.error('Google credential was not returned');
      return;
    }

    setGoogleLoading(true);
    const toastId = toast.loading('Signing in with Google...');
    try {
      const result = await googleLogin(response.credential, role);
      setGoogleLoading(false);
      toast.dismiss(toastId);

      if (result.success) {
        toast.success(`Welcome back, ${result.user.fullName}!`);
        if (result.user.role === 'admin') {
          window.location.href = '/admin/dashboard';
        } else if (result.user.role === 'ngo') {
          window.location.href = '/ngo/dashboard';
        } else {
          window.location.href = '/donor/dashboard';
        }
      } else if (result.code === 'NGO_REGISTRATION_REQUIRED') {
        toast('Please complete NGO organization registration to continue.', {
          icon: '🏢',
        });
        navigate(
          `/register?type=ngo&email=${encodeURIComponent(result.data?.email || '')}&name=${encodeURIComponent(result.data?.fullName || '')}`
        );
      } else {
        toast.error(result.message || 'Google sign-in failed');
      }
    } catch (err) {
      setGoogleLoading(false);
      toast.dismiss(toastId);
      toast.error(err.response?.data?.message || err.message || 'Sign in failed');
    }
  };

  const handleGoogleClick = () => {
    // If live Google Client ID is configured and GIS script is loaded, try official Google prompt
    if (
      googleClientId &&
      googleClientId.trim() !== '' &&
      !googleClientId.includes('your_google_client_id') &&
      window.google?.accounts?.id
    ) {
      try {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setShowGoogleAccountModal(true);
          }
        });
        return;
      } catch (e) {
        console.warn('Google prompt fallback', e);
      }
    }

    // Default: Open authentic Google Account Chooser Simulator (Zero Setup Needed)
    setShowGoogleAccountModal(true);
  };

  const handleSelectSimulatedGoogleAccount = async (accountData) => {
    setGoogleLoading(true);
    const result = await googleLogin('sim_google_token', role, {
      isSimulated: true,
      simulatedUser: accountData,
    });
    setGoogleLoading(false);
    setShowGoogleAccountModal(false);

    if (result.success) {
      redirectAfterLogin(result.user);
    } else if (result.code === 'NGO_REGISTRATION_REQUIRED') {
      toast('Please complete NGO organization registration to continue.', {
        icon: '🏢',
      });
      navigate(
        `/register?type=ngo&email=${encodeURIComponent(result.data?.email || '')}&name=${encodeURIComponent(result.data?.fullName || '')}`
      );
    }
  };

  const redirectAfterLogin = (loggedInUser) => {
    const from = location.state?.from?.pathname;
    if (from && !from.includes('/unauthorized') && !from.includes('/login')) {
      window.location.href = from;
    } else if (loggedInUser.role === 'admin') {
      window.location.href = '/admin/dashboard';
    } else if (loggedInUser.role === 'ngo') {
      window.location.href = '/ngo/dashboard';
    } else {
      window.location.href = '/donor/dashboard';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);
    const result = await login(email.trim(), password, role);
    setLoading(false);

    if (result.success) {
      redirectAfterLogin(result.user);
    }
  };

  const handleQuickFill = (demoEmail, demoPassword, demoRole) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setRole(demoRole);
    toast.success(`Selected demo credentials for ${demoRole === 'ngo' ? 'NGO' : 'Donor'}`);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-stretch bg-[#F5F8FC]">
      {/* 1. LEFT PANEL (44% desktop width): Emotional Photography & English Quotes */}
      <div className="relative w-full lg:w-[44%] h-[240px] lg:h-auto lg:min-h-screen flex flex-col justify-between overflow-hidden bg-[#102A43] shrink-0">
        {/* Full-bleed authentic Indian volunteer photograph */}
        <img
          src="/images/community-help.jpg"
          alt="Indian volunteer supporting child"
          className="absolute inset-0 w-full h-full object-cover object-[center_20%] lg:object-center select-none"
        />

        {/* Subtle Navy Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#102A43]/90 via-[#102A43]/60 to-[#102A43]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#102A43]/70 via-transparent to-[#07549A]/25" />

        {/* Left Panel Inner Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-6 sm:p-8 lg:p-12 text-white">
          {/* Logo Header */}
          <div className="flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00B98B] to-[#009E77] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Serve<span className="text-[#00B98B]">X</span>
              </span>
            </Link>
          </div>

          {/* Center Storytelling & English Quote (Hidden on mobile banner to preserve form prominence) */}
          <div className="hidden lg:flex flex-col my-auto max-w-[520px]">
            <div className="text-xs font-bold text-[#A7F3D0] tracking-[0.15em] uppercase mb-3">
              BRIDGING COMPASSION WITH ACTION
            </div>

            <h1 className="text-[30px] lg:text-[42px] font-bold text-white leading-[1.15] mb-3 max-w-[520px]">
              Your Kindness Can Change a Life.
            </h1>

            <p className="text-[15px] text-[#E5EEF8] leading-relaxed mb-8 max-w-[480px]">
              Connect with trusted NGOs, support families in need, and help create a future filled with hope, dignity, and opportunity.
            </p>

            {/* Quote Card (English Only, No Hindi, High Contrast) */}
            <div className="bg-[rgba(11,31,51,0.88)] backdrop-blur-md border border-white/16 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 max-w-[520px]">
              <div
                className={`transition-opacity duration-300 ${quoteFade ? 'opacity-100' : 'opacity-0'
                  }`}
              >
                <div className="text-[20px] font-semibold text-white leading-snug mb-3">
                  "{quotes[activeQuoteIdx]?.text || 'Together, we can turn compassion into action.'}"
                </div>
                <div className="text-[14px] font-medium text-[#A7F3D0]">
                  — {quotes[activeQuoteIdx]?.author || 'Serve-X'}
                </div>
              </div>

              {/* Quote pagination dots */}
              <div className="flex items-center gap-1.5 mt-4">
                {quotes.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuoteFade(false);
                      setTimeout(() => {
                        setActiveQuoteIdx(idx);
                        setQuoteFade(true);
                      }, 150);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${activeQuoteIdx === idx ? 'w-6 bg-[#00B98B]' : 'w-2 bg-white/30 hover:bg-white/50'
                      }`}
                    aria-label={`Show quote ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom subtle copyright / branding note */}
          <div className="hidden lg:block text-xs text-white/60">
            Serve-X Nonprofit Humanitarian Network
          </div>
        </div>
      </div>

      {/* 2. RIGHT PANEL (56% desktop width): Form Container */}
      <div className="w-full lg:w-[56%] min-h-[calc(100vh-240px)] lg:min-h-screen flex items-center justify-center p-[20px] sm:p-[24px] lg:p-[40px] bg-[#F5F7FB]">
        <div className="w-full max-w-[480px] mx-auto bg-white border border-[#E4E9F0] rounded-[20px] p-[22px] sm:p-[36px] shadow-[0_8px_24px_rgba(16,42,67,0.06)]">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-200"
                style={{
                  backgroundColor: currentTheme.selectedBackground,
                  color: currentTheme.primary,
                  border: `1px solid ${currentTheme.selectedBorder}33`,
                }}
              >
                {role === 'donor' ? (
                  <Heart className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Building2 className="w-3.5 h-3.5" />
                )}
                <span>{currentTheme.roleTag}</span>
              </span>
              <span className="text-[11px] font-semibold text-[#667085]">
                {currentTheme.name}
              </span>
            </div>
            <h2 className="text-[32px] font-bold text-[#172033] leading-tight">
              Welcome Back
            </h2>
            <p className="text-[14px] text-[#667085] mt-1 transition-colors duration-200">
              {role === 'donor'
                ? 'Sign in to discover verified causes, track your impact, and donate with confidence.'
                : 'Sign in to coordinate community needs, claim donations, and manage verified campaigns.'}
            </p>
          </div>

          {/* Role Selector Segmented Controls */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-[#475467] tracking-wider uppercase mb-2">
              SELECT YOUR ACCOUNT TYPE
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Donor Option */}
              <button
                type="button"
                onClick={() => setRole('donor')}
                className="h-[72px] min-h-[72px] p-3 rounded-xl transition-all duration-200 flex flex-col justify-center items-center text-center focus:outline-none focus:ring-2 focus:ring-[#84ADFF] cursor-pointer"
                style={{
                  backgroundColor: role === 'donor' ? ROLE_THEMES.donor.selectedBackground : '#F8FAFC',
                  borderColor: role === 'donor' ? ROLE_THEMES.donor.selectedBorder : '#E4E9F0',
                  borderWidth: role === 'donor' ? '2px' : '1px',
                  color: role === 'donor' ? ROLE_THEMES.donor.primary : '#475467',
                }}
              >
                <div className="flex items-center gap-1.5 font-bold text-sm">
                  <Heart
                    className={`w-4 h-4 transition-colors duration-200 ${role === 'donor' ? 'text-[#07549A] fill-[#07549A]' : 'text-[#667085]'
                      }`}
                  />
                  <span>Donor</span>
                </div>
                <span className="text-[11px] text-[#667085] mt-1 leading-tight">
                  Donate items and money
                </span>
              </button>

              {/* NGO Option */}
              <button
                type="button"
                onClick={() => setRole('ngo')}
                className="h-[72px] min-h-[72px] p-3 rounded-xl transition-all duration-200 flex flex-col justify-center items-center text-center focus:outline-none focus:ring-2 focus:ring-[#C4B5FD] cursor-pointer"
                style={{
                  backgroundColor: role === 'ngo' ? ROLE_THEMES.ngo.selectedBackground : '#F8FAFC',
                  borderColor: role === 'ngo' ? ROLE_THEMES.ngo.selectedBorder : '#E4E9F0',
                  borderWidth: role === 'ngo' ? '2px' : '1px',
                  color: role === 'ngo' ? ROLE_THEMES.ngo.primary : '#475467',
                }}
              >
                <div className="flex items-center gap-1.5 font-bold text-sm">
                  <Building2
                    className={`w-4 h-4 transition-colors duration-200 ${role === 'ngo' ? 'text-[#6D3FC0]' : 'text-[#667085]'
                      }`}
                  />
                  <span>NGO</span>
                </div>
                <span className="text-[11px] text-[#667085] mt-1 leading-tight">
                  Manage needs and campaigns
                </span>
              </button>
            </div>
          </div>

          {/* Google Sign-In Button */}
          <div className="mb-5 flex flex-col items-center justify-center">
            {googleClientId ? (
              <div className="w-full flex flex-col items-center justify-center gap-2">
                <div className="w-full flex justify-center min-h-[44px]">
                  <div id="googleSignInOfficialBtn" className="w-full flex justify-center"></div>
                </div>
                <button
                  type="button"
                  onClick={triggerGoogleOAuthRedirect}
                  disabled={googleLoading}
                  className="w-full h-[44px] bg-white text-[#344054] border border-[#D0D5DD] hover:border-gray-400 hover:bg-gray-50 rounded-[10px] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xs transition-all duration-200 active:scale-[0.99] cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                  <span>Direct Google Sign-In</span>
                  <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded">1-Click</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleGoogleClick}
                disabled={googleLoading}
                className="w-full h-[48px] bg-white text-[#344054] border border-[#D0D5DD] hover:border-gray-400 rounded-[10px] font-semibold text-sm flex items-center justify-center gap-3 shadow-xs transition-all duration-200 active:scale-[0.99] disabled:opacity-60 hover:bg-gray-50 focus:outline-none focus:ring-2 cursor-pointer"
                style={{
                  '--tw-ring-color': currentTheme.focusRing,
                }}
              >
                {googleLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                )}
                <span>{currentTheme.googleButtonLabel}</span>
              </button>
            )}
          </div>

          {/* Separator */}
          <div className="relative mt-2 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5EAF0]" />
            </div>
            <span className="relative bg-white px-3 text-[11px] font-bold text-[#98A2B3] tracking-wider uppercase">
              OR SIGN IN WITH EMAIL
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-[18px]">
              <label className="block text-xs font-semibold text-[#344054] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full h-[48px] px-3.5 bg-white border border-[#D0D5DD] rounded-[10px] text-sm text-[#101828] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 transition-all duration-200"
                style={{
                  '--tw-ring-color': currentTheme.focusRing,
                }}
              />
            </div>

            {/* Password Field */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#344054]">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowForgotModal(true);
                  }}
                  className="text-xs font-semibold hover:underline transition-colors duration-200"
                  style={{ color: currentTheme.primary }}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full h-[48px] pl-3.5 pr-11 bg-white border border-[#D0D5DD] rounded-[10px] text-sm text-[#101828] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{
                    '--tw-ring-color': currentTheme.focusRing,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#475467] cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[48px] rounded-[10px] text-sm font-semibold shadow-xs hover:shadow-md transition-all duration-200 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 mt-2 cursor-pointer"
              style={{
                backgroundColor: currentTheme.primary,
                color: currentTheme.buttonText,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.primary;
              }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>{currentTheme.buttonLabel}</span>
              )}
            </button>
          </form>

          {/* Quick Demo Helper Pills */}
          <div className="mt-5 pt-4 border-t border-[#E5EAF0] flex items-center justify-between text-xs text-[#667085]">
            <span className="font-semibold text-[11px] uppercase tracking-wider text-[#98A2B3]">
              Quick Demo:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('donor@servex.org', 'Donor@123', 'donor')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${role === 'donor'
                  ? 'bg-[#EAF3FF] text-[#07549A] ring-1 ring-[#07549A]'
                  : 'bg-[#F1F5F9] text-[#475467] hover:bg-gray-100'
                  }`}
              >
                ❤️ Donor
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('goonj@servex.org', 'Ngo@123', 'ngo')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${role === 'ngo'
                  ? 'bg-[#F3ECFF] text-[#6D3FC0] ring-1 ring-[#6D3FC0]'
                  : 'bg-[#F1F5F9] text-[#475467] hover:bg-gray-100'
                  }`}
              >
                🏢 NGO
              </button>
            </div>
          </div>

          {/* Footer Registration Link */}
          <div className="mt-6 text-center text-xs text-[#667085]">
            New to Serve-X?{' '}
            <Link
              to={`/register?type=${role}`}
              className="font-semibold text-[#07549A] hover:underline"
            >
              Create an account
            </Link>
          </div>

          {/* Legal Links */}
          <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-[#98A2B3]">
            <Link to="/terms" className="hover:underline">
              Terms of Service
            </Link>
            <span>•</span>
            <Link to="/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Google Setup Guide Modal */}
      {showGoogleSetupModal && (
        <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <Info className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-[#101828]">
                  Google Sign-In Configuration
                </h3>
              </div>
              <button
                onClick={() => setShowGoogleSetupModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-[#475467] space-y-3 leading-relaxed mb-6">
              <p>
                To enable live Google Sign-In with official credential verification, please supply your Google Cloud OAuth Client ID:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 bg-gray-50 p-3 rounded-xl font-mono text-[11px] text-gray-800">
                <li>Create an OAuth 2.0 Web Client in Google Cloud Console.</li>
                <li>Set Authorized JavaScript origin: <code className="text-[#07549A]">http://localhost:5173</code></li>
                <li>Add <code className="text-[#07549A]">VITE_GOOGLE_CLIENT_ID</code> to <code className="text-gray-600">client/.env</code></li>
                <li>Add <code className="text-[#07549A]">GOOGLE_CLIENT_ID</code> to <code className="text-gray-600">server/.env</code></li>
              </ol>
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-[11px]">
                Email and password authentication is fully operational! You can log in using the demo buttons or any registered email.
              </div>
            </div>

            <button
              onClick={() => setShowGoogleSetupModal(false)}
              className="w-full py-2.5 bg-[#07549A] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#003B64] transition"
            >
              Continue with Email & Password
            </button>
          </div>
        </div>
      )}


      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-base text-[#101828]">
                Reset Your Password
              </h3>
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSubmitted(false);
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {forgotSubmitted ? (
              <div className="text-center py-4">
                <CheckCircle2 className="w-12 h-12 text-[#00B98B] mx-auto mb-3" />
                <h4 className="font-bold text-sm text-[#101828] mb-1">
                  Reset Instructions Sent
                </h4>
                <p className="text-xs text-[#667085] mb-5">
                  If {forgotEmail} matches an active account, password reset guidance has been dispatched.
                </p>
                <button
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSubmitted(false);
                  }}
                  className="w-full py-2.5 bg-[#07549A] text-white rounded-xl text-xs font-bold"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!forgotEmail) return;
                  try {
                    await api.post('/auth/forgot-password', { email: forgotEmail });
                  } catch {
                    // silently succeed
                  }
                  setForgotSubmitted(true);
                }}
                className="space-y-4"
              >
                <p className="text-xs text-[#667085]">
                  Enter the email associated with your account, and we'll send you instructions to reset your password.
                </p>
                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#07549A]/20"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#07549A] text-white text-xs font-bold rounded-xl"
                  >
                    Send Instructions
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
