import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  CreditCard,
  Smartphone,
  Building2,
  QrCode,
  Wallet,
  CheckCircle2,
  Copy,
  Check,
  Zap,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

const POPULAR_BANKS = [
  { id: 'HDFC', name: 'HDFC Bank', code: 'HDFC', badgeColor: 'bg-blue-600' },
  { id: 'SBI', name: 'State Bank of India', code: 'SBI', badgeColor: 'bg-sky-600' },
  { id: 'ICICI', name: 'ICICI Bank', code: 'ICICI', badgeColor: 'bg-orange-600' },
  { id: 'AXIS', name: 'Axis Bank', code: 'AXIS', badgeColor: 'bg-rose-700' },
  { id: 'KOTAK', name: 'Kotak Bank', code: 'KOTAK', badgeColor: 'bg-red-600' },
  { id: 'PNB', name: 'Punjab National Bank', code: 'PNB', badgeColor: 'bg-amber-600' },
];

const WALLET_OPTIONS = [
  { id: 'paytm', name: 'Paytm Wallet', icon: '₹' },
  { id: 'phonepe', name: 'PhonePe Wallet', icon: 'P' },
  { id: 'amazon', name: 'Amazon Pay', icon: 'a' },
  { id: 'mobikwik', name: 'MobiKwik', icon: 'M' },
];

export const RazorpayCheckoutModal = ({
  isOpen,
  onClose,
  orderData,
  title = 'Charitable Contribution',
  beneficiaryName = 'Serve-X Partner NGO',
  donorName = '',
  donorEmail = '',
  onPaymentSuccess,
}) => {
  const [activeTab, setActiveTab] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'wallet'
  const [isProcessing, setIsProcessing] = useState(false);

  // UPI State
  const [upiSubtype, setUpiSubtype] = useState('qr'); // 'qr' | 'id'
  const [upiId, setUpiId] = useState('donor@okhdfcbank');

  // Card State
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [cardHolder, setCardHolder] = useState(donorName || 'Vikram Aditya');

  // NetBanking State
  const [selectedBank, setSelectedBank] = useState('HDFC');

  // Wallet State
  const [selectedWallet, setSelectedWallet] = useState('paytm');

  const [copiedOrderId, setCopiedOrderId] = useState(false);

  if (!isOpen || !orderData) return null;

  const payableAmount = (orderData.amount / 100) || 1000;
  const orderId = orderData.orderId || `order_${Date.now().toString(36)}`;

  const handleCopyOrder = () => {
    navigator.clipboard.writeText(orderId);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
    toast.success('Order ID copied');
  };

  const handleExecutePayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      if (onPaymentSuccess) {
        onPaymentSuccess({
          razorpayOrderId: orderId,
          razorpayPaymentId: `pay_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
          razorpaySignature: 'simulated_test_signature',
        });
      }
    }, 1200);
  };

  const handleUseTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('12/28');
    setCardCvv('999');
    setCardHolder(donorName || 'Vikram Aditya');
    toast.success('Test Card Credentials Loaded');
  };

  return (
    <div className="fixed inset-0 z-[2500] bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-hidden">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[88vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 text-slate-800">
        {/* 1. OFFICIAL RAZORPAY HEADER (STICKY) */}
        <div className="bg-gradient-to-r from-[#0C2340] via-[#07549A] to-[#0A68BD] px-5 py-3.5 text-white flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-wide">Razorpay Gateway</span>
                <span className="text-[9px] font-extrabold bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Test Mode
                </span>
              </div>
              <div className="text-[10px] text-blue-100 flex items-center gap-1.5 mt-0.5">
                <Lock className="w-3 h-3 text-emerald-300" />
                <span>256-Bit SSL Secured • RBI Compliant</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition cursor-pointer flex items-center justify-center"
            aria-label="Close"
            title="Cancel & close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* SCROLLABLE CONTENT BODY */}
        <div className="overflow-y-auto flex-1 overscroll-contain">
          {/* 2. ORDER SUMMARY BANNER */}
        <div className="p-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Contributing To
              </div>
              <div className="text-sm font-bold text-slate-900 line-clamp-1 mt-0.5">
                {title}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Beneficiary: <span className="text-slate-800 font-semibold">{beneficiaryName}</span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Amount
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#07549A] tabular-nums mt-0.5">
                ₹{payableAmount.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Order ID & 80G Tax Tag */}
          <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleCopyOrder}
              className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-500 hover:text-slate-900 bg-white px-2 py-1 rounded-lg border border-slate-200 transition cursor-pointer"
            >
              <span>{orderId}</span>
              {copiedOrderId ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3 text-slate-400" />
              )}
            </button>

            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Section 80G Tax Receipt Included</span>
            </span>
          </div>
        </div>

        {/* 3. PAYMENT METHOD NAVIGATION TABS */}
        <div className="px-5 pt-3 border-b border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('upi')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'upi'
                ? 'border-[#07549A] text-[#07549A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>UPI / QR</span>
            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-extrabold">
              FAST
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('card')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'card'
                ? 'border-[#07549A] text-[#07549A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Cards</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('netbanking')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'netbanking'
                ? 'border-[#07549A] text-[#07549A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>NetBanking</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wallet')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'wallet'
                ? 'border-[#07549A] text-[#07549A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Wallets</span>
          </button>
        </div>

        {/* 4. TAB CONTENTS */}
        <div className="p-5 space-y-4">
          {/* TAB 1: UPI & QR CODE */}
          {activeTab === 'upi' && (
            <div className="space-y-4">
              <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setUpiSubtype('qr')}
                  className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    upiSubtype === 'qr'
                      ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5 text-[#07549A]" />
                  <span>Scan QR Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUpiSubtype('id')}
                  className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    upiSubtype === 'id'
                      ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-[#07549A]" />
                  <span>UPI ID / VPA</span>
                </button>
              </div>

              {upiSubtype === 'qr' ? (
                /* QR Code Display */
                <div className="text-center py-2 space-y-3">
                  <div className="w-44 h-44 mx-auto p-2.5 bg-white rounded-2xl border-2 border-slate-200 shadow-inner flex flex-col items-center justify-center relative">
                    {/* Authentic Simulated UPI QR SVG */}
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full text-slate-900"
                      fill="currentColor"
                    >
                      {/* Top-left position detection pattern */}
                      <rect x="5" y="5" width="28" height="28" fill="#14263D" />
                      <rect x="9" y="9" width="20" height="20" fill="white" />
                      <rect x="13" y="13" width="12" height="12" fill="#07549A" />

                      {/* Top-right position detection pattern */}
                      <rect x="67" y="5" width="28" height="28" fill="#14263D" />
                      <rect x="71" y="9" width="20" height="20" fill="white" />
                      <rect x="75" y="13" width="12" height="12" fill="#07549A" />

                      {/* Bottom-left position detection pattern */}
                      <rect x="5" y="67" width="28" height="28" fill="#14263D" />
                      <rect x="9" y="71" width="20" height="20" fill="white" />
                      <rect x="13" y="75" width="12" height="12" fill="#07549A" />

                      {/* Center Decorative Shield Badge */}
                      <rect x="36" y="36" width="28" height="28" fill="#059669" rx="6" />
                      <path
                        d="M50 42 L58 46 L58 52 C58 57 54 61 50 63 C46 61 42 57 42 52 L42 46 Z"
                        fill="white"
                      />

                      {/* Data dots */}
                      <rect x="37" y="10" width="5" height="5" />
                      <rect x="47" y="15" width="5" height="5" />
                      <rect x="57" y="10" width="5" height="5" />
                      <rect x="10" y="37" width="5" height="5" />
                      <rect x="20" y="47" width="5" height="5" />
                      <rect x="70" y="37" width="5" height="5" />
                      <rect x="85" y="47" width="5" height="5" />
                      <rect x="37" y="75" width="5" height="5" />
                      <rect x="47" y="85" width="5" height="5" />
                      <rect x="57" y="75" width="5" height="5" />
                      <rect x="75" y="75" width="5" height="5" />
                      <rect x="85" y="85" width="5" height="5" />
                    </svg>

                    <div className="absolute inset-x-0 -bottom-2 text-[10px] font-bold text-white bg-slate-900/90 py-0.5 px-2 rounded-full w-fit mx-auto shadow-xs">
                      Scan with any UPI App
                    </div>
                  </div>

                  {/* Supported UPI Apps logos */}
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-extrabold rounded-md border border-blue-200">
                      GPay
                    </span>
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-extrabold rounded-md border border-purple-200">
                      PhonePe
                    </span>
                    <span className="px-2 py-0.5 bg-sky-50 text-sky-700 text-[10px] font-extrabold rounded-md border border-sky-200">
                      Paytm
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold rounded-md border border-emerald-200">
                      BHIM
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-extrabold rounded-md border border-slate-200">
                      CRED
                    </span>
                  </div>
                </div>
              ) : (
                /* Enter UPI ID input */
                <div className="space-y-3 py-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Enter UPI ID / Virtual Payment Address (VPA)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@okhdfcbank"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#84ADFF] focus:bg-white"
                      />
                      <span className="absolute right-3 top-2.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Verified
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-400">Quick Test Handles:</span>
                    <button
                      type="button"
                      onClick={() => setUpiId('donor@okhdfcbank')}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[10px] cursor-pointer"
                    >
                      donor@okhdfcbank
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpiId('success@razorpay')}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[10px] cursor-pointer"
                    >
                      success@razorpay
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CREDIT / DEBIT CARDS */}
          {activeTab === 'card' && (
            <div className="space-y-3 py-1">
              <div className="flex items-center justify-between pb-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Card Information
                </span>
                <button
                  type="button"
                  onClick={handleUseTestCard}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#07549A] hover:underline cursor-pointer"
                >
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span>Auto-fill Test Card</span>
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 •••• •••• 4242"
                    className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#84ADFF] focus:bg-white"
                  />
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <div className="absolute right-3 top-2.5 flex items-center gap-1">
                    <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                      VISA
                    </span>
                    <span className="text-[10px] font-extrabold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">
                      RuPay
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Valid Thru (MM/YY)
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="12/28"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#84ADFF] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    CVV / CVC
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="•••"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#84ADFF] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Cardholder Full Name
                </label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="Name as printed on card"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#84ADFF] focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* TAB 3: NETBANKING */}
          {activeTab === 'netbanking' && (
            <div className="space-y-3 py-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Select Your Bank
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {POPULAR_BANKS.map((bank) => (
                  <button
                    key={bank.id}
                    type="button"
                    onClick={() => setSelectedBank(bank.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                      selectedBank === bank.id
                        ? 'border-[#07549A] bg-[#EAF3FF] shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-md ${bank.badgeColor} text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-2xs`}
                    >
                      {bank.code.substring(0, 2)}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {bank.name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Or pick from all Indian Banks (50+)
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#84ADFF] cursor-pointer"
                >
                  <option value="HDFC">HDFC Bank</option>
                  <option value="SBI">State Bank of India</option>
                  <option value="ICICI">ICICI Bank</option>
                  <option value="AXIS">Axis Bank</option>
                  <option value="KOTAK">Kotak Mahindra Bank</option>
                  <option value="PNB">Punjab National Bank</option>
                  <option value="BOB">Bank of Baroda</option>
                  <option value="CANARA">Canara Bank</option>
                  <option value="UNION">Union Bank of India</option>
                  <option value="IDBI">IDBI Bank</option>
                  <option value="YES">Yes Bank</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 4: WALLETS */}
          {activeTab === 'wallet' && (
            <div className="space-y-3 py-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Supported Digital Wallets
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                {WALLET_OPTIONS.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setSelectedWallet(w.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      selectedWallet === w.id
                        ? 'border-[#07549A] bg-[#EAF3FF] shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                      {w.icon}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{w.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

        {/* 5. AUTHORIZE & PAY PRIMARY CTA BUTTON (STICKY) */}
        <div className="p-4 pt-2.5 border-t border-slate-100 bg-slate-50/95 space-y-2.5 shrink-0 sticky bottom-0 z-20">
          <button
            type="button"
            onClick={handleExecutePayment}
            disabled={isProcessing}
            className="w-full py-3.5 bg-gradient-to-r from-[#00B98B] to-[#009E77] hover:from-[#00A37A] hover:to-[#008A68] text-white font-black text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-60"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Simulating Gateway Authorization...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 fill-white" />
                <span>Authorize & Pay ₹{payableAmount.toLocaleString('en-IN')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              Cancel Transaction
            </button>

            <span className="flex items-center gap-1 font-semibold text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant 80G Receipt on Confirmation</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
