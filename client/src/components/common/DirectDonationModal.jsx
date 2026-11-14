import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Building2,
  CreditCard,
  Check,
  Award,
} from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';
import { RazorpayCheckoutModal } from './RazorpayCheckoutModal';
import toast from 'react-hot-toast';

export const DirectDonationModal = ({
  isOpen,
  onClose,
  ngo,
  campaignId,
  campaignTitle,
  onDonationSuccess,
}) => {
  const { user } = useAuth();

  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorMessage, setDonorMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  // Simulated test payment confirmation state
  const [activeOrder, setActiveOrder] = useState(null);
  const [showSimulatedConfirm, setShowSimulatedConfirm] = useState(false);

  // Pre-fill user data when opened
  useEffect(() => {
    if (isOpen) {
      if (user) {
        setDonorName(user.fullName || '');
        setDonorEmail(user.email || '');
        setDonorPhone(user.phone || '');
      }
      setSelectedAmount(1000);
      setCustomAmount('');
      setShowSimulatedConfirm(false);
      setActiveOrder(null);
    }
  }, [isOpen, user]);

  const currentAmount = customAmount ? Number(customAmount) : selectedAmount;
  const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000];

  const handleAmountClick = (amt) => {
    setSelectedAmount(amt);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(val);
    if (val) {
      setSelectedAmount(Number(val));
    }
  };

  const handleVerifyPayment = async ({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  }) => {
    setLoading(true);
    try {
      const res = await api.post('/payments/verify', {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      });

      if (res.data?.success) {
        toast.success(`Donation of ₹${currentAmount.toLocaleString('en-IN')} verified!`);
        const receiptNumber = res.data.data.receiptNumber;

        // Fetch full official receipt
        const receiptRes = await api.get(`/payments/${receiptNumber}/receipt`);
        onClose();

        if (onDonationSuccess && receiptRes.data?.success) {
          onDonationSuccess(receiptRes.data.data);
        }
      } else {
        toast.error('Payment verification failed');
      }
    } catch (err) {
      console.error('Payment verification error', err);
      toast.error(err.response?.data?.message || 'Payment verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInitiateDonation = async (e) => {
    e.preventDefault();

    if (!currentAmount || currentAmount < 10) {
      toast.error('Minimum contribution amount is ₹10');
      return;
    }
    if (!donorName.trim()) {
      toast.error('Please enter your full name for the receipt');
      return;
    }
    if (!donorEmail.trim()) {
      toast.error('Please enter a valid email address for the 80G receipt');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        amount: currentAmount,
        donorName: donorName.trim(),
        donorEmail: donorEmail.trim(),
        donorPhone: donorPhone.trim(),
        donorMessage: donorMessage.trim(),
        isAnonymous,
      };

      if (campaignId) {
        payload.campaignId = campaignId;
      } else {
        payload.ngoId = ngo?._id;
      }

      const res = await api.post('/payments/create-order', payload);
      if (!res.data?.success) {
        throw new Error(res.data?.message || 'Failed to create donation order');
      }

      const orderData = res.data.data;
      setActiveOrder(orderData);

      if (window.Razorpay) {
        const options = {
          key: orderData.key,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'ServeX Platform',
          description: `Donation to ${ngo?.organizationName || 'Serve-X Partner NGO'}`,
          order_id: orderData.orderId,
          handler: async (response) => {
            await handleVerifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
          },
          prefill: {
            name: donorName,
            email: donorEmail,
            contact: donorPhone,
          },
          theme: {
            color: '#07549A',
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback test payment confirmation
        setShowSimulatedConfirm(true);
      }
    } catch (err) {
      console.error('Donation initiation error', err);
      toast.error(err.response?.data?.message || err.message || 'Payment initiation failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !ngo) return null;

  if (showSimulatedConfirm && activeOrder) {
    return (
      <RazorpayCheckoutModal
        isOpen={true}
        onClose={() => {
          setShowSimulatedConfirm(false);
          setActiveOrder(null);
        }}
        orderData={activeOrder}
        title={campaignTitle || `Direct Contribution - ${ngo?.organizationName || 'Verified NGO'}`}
        beneficiaryName={ngo?.organizationName || 'Serve-X Partner NGO'}
        donorName={donorName}
        donorEmail={donorEmail}
        onPaymentSuccess={handleVerifyPayment}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[2000] overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <img
              src={
                ngo.logo ||
                'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=120&fit=crop'
              }
              alt={ngo.organizationName}
              className="w-10 h-10 rounded-xl object-cover border border-gray-200 bg-white shadow-2xs shrink-0"
            />
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-[#101828] truncate">
                {ngo.organizationName}
              </h3>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3" /> Verified NGO
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-[#07549A] font-semibold">Section 80G Active</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <form onSubmit={handleInitiateDonation} className="space-y-4">
              {/* Preset Amounts Grid */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Select Contribution Amount (INR)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-2.5">
                  {PRESET_AMOUNTS.map((amt) => {
                    const isSelected = selectedAmount === amt && !customAmount;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleAmountClick(amt)}
                        className={`py-2 text-xs font-extrabold rounded-xl border transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#07549A] text-white border-[#07549A] shadow-xs'
                            : 'bg-[#F8FAFC] text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Amount Input */}
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">
                    ₹
                  </span>
                  <input
                    type="text"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="Enter custom amount..."
                    className="w-full pl-8 pr-4 py-2.5 bg-[#F8FAFC] border border-gray-200 rounded-xl text-xs sm:text-sm font-bold text-[#101828] focus:outline-hidden focus:ring-2 focus:ring-[#07549A] transition"
                  />
                </div>
              </div>

              {/* 80G Tax Benefit Banner */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800">
                <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>50% Tax Exemption:</strong> Official 80G tax receipt generated instantly for ₹{currentAmount.toLocaleString('en-IN')}.
                </span>
              </div>

              {/* Donor Contact Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#07549A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Email for 80G Receipt *
                  </label>
                  <input
                    type="email"
                    required
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#07549A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#07549A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  Encouraging Message (Optional)
                </label>
                <input
                  type="text"
                  value={donorMessage}
                  onChange={(e) => setDonorMessage(e.target.value)}
                  placeholder="Leave a message of hope..."
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#07549A]"
                />
              </div>

              {/* Anonymous Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded text-[#07549A] focus:ring-[#07549A]"
                />
                <span className="text-xs text-gray-600 font-medium">
                  Make this contribution anonymous on public champion lists
                </span>
              </label>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#00B98B] hover:bg-[#009E77] text-white font-extrabold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Proceed to Donate ₹{currentAmount.toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 font-medium pt-1">
                <span>🔒 256-bit Encrypted</span>
                <span>•</span>
                <span>📄 Instant Section 80G Receipt</span>
                <span>•</span>
                <span>⚡ Direct NGO Settlement</span>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
};

