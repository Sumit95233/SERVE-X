import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  Clock,
  Heart,
  Users,
  Building2,
  Calendar,
  IndianRupee,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ReceiptModal } from '../../components/common/ReceiptModal';
import { RazorpayCheckoutModal } from '../../components/common/RazorpayCheckoutModal';
import toast from 'react-hot-toast';

export const CampaignDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const isNgo = user?.role === 'ngo';
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  // Donation form state
  const [amount, setAmount] = useState(1000);
  const [donorName, setDonorName] = useState(user?.fullName || '');
  const [donorEmail, setDonorEmail] = useState(user?.email || '');
  const [donorPhone, setDonorPhone] = useState(user?.phone || '');
  const [donorMessage, setDonorMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donating, setDonating] = useState(false);

  // Payment confirmation & receipt modal
  const [receiptData, setReceiptData] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Test simulation modal if standard Razorpay script isn't loaded
  const [showSimulatedModal, setShowSimulatedModal] = useState(false);
  const [activeOrderData, setActiveOrderData] = useState(null);

  const presetAmounts = [500, 1000, 2500, 5000, 10000];

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  useEffect(() => {
    if (user) {
      if (!donorName) setDonorName(user.fullName || '');
      if (!donorEmail) setDonorEmail(user.email || '');
      if (!donorPhone) setDonorPhone(user.phone || '');
    }
  }, [user]);

  const fetchCampaign = async () => {
    try {
      const res = await api.get(`/campaigns/${id}`);
      if (res.data?.success) {
        setCampaign(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load campaign', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDonateInitiation = async (e) => {
    e.preventDefault();
    if (!amount || amount < 10) {
      toast.error('Minimum contribution amount is ₹10');
      return;
    }
    if (!donorName || !donorEmail) {
      toast.error('Please provide your name and email');
      return;
    }

    setDonating(true);
    try {
      // 1. Create order on the backend
      const res = await api.post('/payments/create-order', {
        campaignId: id,
        amount: Number(amount),
        donorName,
        donorEmail,
        donorPhone,
        donorMessage,
        isAnonymous,
      });

      if (!res.data?.success) {
        throw new Error(res.data?.message || 'Failed to create payment order');
      }

      const orderData = res.data.data;
      setActiveOrderData(orderData);

      // 2. Check if Razorpay script is present
      if (window.Razorpay) {
        const options = {
          key: orderData.key,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'ServeX Platform',
          description: `Donation for ${campaign.title}`,
          order_id: orderData.orderId,
          handler: async (response) => {
            await handlePaymentVerification({
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
        // Smooth test fallback modal for offline or development sandbox
        setShowSimulatedModal(true);
      }
    } catch (err) {
      console.error('Donation initiation error', err);
      toast.error(err.response?.data?.message || err.message || 'Payment initiation failed');
    } finally {
      setDonating(false);
    }
  };

  const handlePaymentVerification = async ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
    try {
      const res = await api.post('/payments/verify', {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      });

      if (res.data?.success) {
        toast.success('Thank you! Donation verified successfully.');
        setShowSimulatedModal(false);
        // Refresh campaign raised totals
        fetchCampaign();

        // Fetch full official receipt
        const receiptRes = await api.get(`/payments/${res.data.data.receiptNumber}/receipt`);
        if (receiptRes.data?.success) {
          setReceiptData(receiptRes.data.data);
          setIsReceiptOpen(true);
        }
      } else {
        toast.error('Payment verification failed');
      }
    } catch (err) {
      console.error('Verification error', err);
      toast.error(err.response?.data?.message || 'Payment verification failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Loading campaign details..." />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="max-w-lg mx-auto py-24 text-center px-4">
        <div className="w-16 h-16 bg-blue-50 text-[#07549A] rounded-3xl flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-2xs">
          <Heart className="w-8 h-8 text-[#07549A]" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Campaign Not Found</h2>
        <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
          The requested fundraising campaign is not active or could not be located. You can explore all verified active fundraisers across India.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/campaigns"
            className="px-5 py-2.5 bg-[#07549A] hover:bg-[#06457E] text-white text-xs font-bold rounded-xl transition shadow-xs"
          >
            Browse All Campaigns
          </Link>
          <Link
            to="/ngos"
            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl transition"
          >
            Explore Verified NGOs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] py-8 sm:py-10 w-full max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 w-full max-w-full">
        {/* 1. TOP HEADER & BREADCRUMB */}
        <div className="space-y-3">
          <Link
            to="/campaigns"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#07549A] hover:text-[#06457E] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Campaigns</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#07549A] bg-[#EAF3FF] border border-[#BFDBFE] px-3 py-1 rounded-full uppercase tracking-wider">
              {campaign.causeCategory}
            </span>
            <span className="text-xs text-[#526780] bg-white border border-[#DFE7F0] px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{campaign.daysLeft} days remaining</span>
            </span>
            <span className="text-xs text-[#059669] bg-[#E6F8F0] border border-[#A6F4C5] px-3 py-1 rounded-full font-bold flex items-center gap-1 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
              <span>Section 80G Tax Benefit</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#102A43] tracking-tight leading-tight">
            {campaign.title}
          </h1>

          <div className="flex items-center gap-2.5 pt-1 text-xs">
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-[#DFE7F0] bg-white shrink-0">
              <img
                src={campaign.ngoId?.logo || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=80&fit=crop'}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-[#526780]">Organized by </span>
              <strong className="text-[#102A43] font-bold">{campaign.ngoId?.organizationName}</strong>
              <span className="text-[#7C8DA5] ml-1.5">• {campaign.ngoId?.city || 'India'}</span>
            </div>
          </div>
        </div>

        {/* 2. BALANCED SIDE-BY-SIDE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols): Hero Image & Comprehensive Story */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl overflow-hidden border border-[#E5EAF0] shadow-sm bg-white">
              <img
                src={
                  campaign.images?.[0] ||
                  'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&fit=crop'
                }
                alt={campaign.title}
                className="w-full h-80 sm:h-[400px] object-cover"
              />
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5EAF0] shadow-xs space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[#101828] mb-2">About this Fundraiser</h3>
                <p className="text-sm text-[#475467] leading-relaxed">{campaign.description}</p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-lg font-bold text-[#101828] mb-2">Who Beneficiaries Are</h3>
                <p className="text-sm text-[#475467] leading-relaxed">{campaign.beneficiaryDescription}</p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-lg font-bold text-[#101828] mb-3">Fund Allocation Plan</h3>
                <div className="bg-[#EDFAF5] p-4 rounded-2xl border border-emerald-100 text-emerald-900 text-sm font-medium leading-relaxed">
                  {campaign.fundUsagePlan}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center gap-3 p-4 bg-[#F8FAFC] rounded-2xl">
                <ShieldCheck className="w-6 h-6 text-[#059669] shrink-0" />
                <div className="text-xs text-[#526780]">
                  <strong className="text-[#102A43] block font-bold">100% Verified Impact Guarantee</strong>
                  All disbursements are strictly audited. Your contribution generates an official Section 80G tax receipt instantly.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Donation Form + Recent Supporters */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5EAF0] shadow-md">
              <div className="mb-6">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-3xl font-black text-[#101828]">
                    ₹{(campaign.amountRaised || 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-gray-500">
                    of ₹{(campaign.goalAmount || 0).toLocaleString('en-IN')} goal
                  </span>
                </div>

                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-[#07549A] to-[#00B98B] rounded-full"
                    style={{ width: `${campaign.progressPercentage || 0}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-gray-600 font-semibold">
                  <span>{campaign.progressPercentage || 0}% Funded</span>
                  <span>{campaign.donorCount || 0} Supporters</span>
                </div>
              </div>

              {isNgo ? (
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 text-center space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] border border-emerald-200 flex items-center justify-center mx-auto">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-[#101828]">
                    NGO Partner Workspace View
                  </h4>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    This fundraiser is active on the Serve-X public directory for individual and corporate donors. Incoming donor contributions and gateway credits are logged in your NGO Partner Workspace.
                  </p>
                  <Link
                    to="/ngo/dashboard"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-xl shadow-xs transition"
                  >
                    <span>Open Partner Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleDonateInitiation} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#101828] uppercase tracking-wider mb-2">
                      Select Contribution Amount (INR)
                    </label>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {presetAmounts.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setAmount(p)}
                          className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                            amount === p
                              ? 'bg-[#07549A] border-[#07549A] text-white shadow-xs'
                              : 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100'
                          }`}
                        >
                          ₹{p.toLocaleString('en-IN')}
                        </button>
                      ))}
                    </div>

                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 font-bold">
                        ₹
                      </span>
                      <input
                        type="number"
                        min={10}
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        placeholder="Custom amount"
                        required
                        className="w-full pl-8 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-bold text-[#101828] focus:outline-hidden focus:ring-2 focus:ring-[#07549A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#101828] uppercase tracking-wider mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="e.g. Vikram Aditya"
                      className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#07549A]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#101828] uppercase tracking-wider mb-1">
                        Email for 80G Receipt
                      </label>
                      <input
                        type="email"
                        required
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#07549A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#101828] uppercase tracking-wider mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={donorPhone}
                        onChange={(e) => setDonorPhone(e.target.value)}
                        placeholder="10-digit mobile"
                        className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#07549A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#101828] uppercase tracking-wider mb-1">
                      Encouraging Message (Optional)
                    </label>
                    <input
                      type="text"
                      value={donorMessage}
                      onChange={(e) => setDonorMessage(e.target.value)}
                      placeholder="Leave a message of hope..."
                      className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#07549A]"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded text-[#07549A] focus:ring-[#07549A]"
                    />
                    <label htmlFor="anonymous" className="text-xs text-gray-600 font-medium cursor-pointer">
                      Make this donation anonymous on public lists
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={donating}
                    className="w-full py-3.5 bg-[#00B98B] hover:bg-[#009E77] text-white font-black text-sm rounded-xl shadow-md transition disabled:opacity-50 mt-4 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    {donating ? 'Initializing...' : `Proceed to Pay ₹${Number(amount || 0).toLocaleString('en-IN')}`}
                  </button>
                </form>
              )}

              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-center gap-4 text-[11px] text-gray-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Razorpay Test Secured
                </span>
                <span>•</span>
                <span>Section 80G Tax Exemption</span>
              </div>
            </div>

            {/* Recent Supporters in Right Column below Donation Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5EAF0] shadow-xs">
              <h3 className="text-base font-bold text-[#101828] mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#07549A]" />
                  Recent Supporters
                </span>
                <span className="text-xs text-[#526780] font-normal">
                  {campaign.donorCount || 0} supporters
                </span>
              </h3>

              {(!campaign.supporters || campaign.supporters.length === 0) ? (
                <p className="text-xs text-gray-500 py-2">Be the first to contribute to this campaign!</p>
              ) : (
                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {campaign.supporters.map((sup, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-[#F8FAFC] border border-gray-100 flex justify-between items-center text-xs"
                    >
                      <div>
                        <div className="font-bold text-[#101828]">{sup.donorName}</div>
                        {sup.message && (
                          <div className="text-gray-500 italic mt-0.5 line-clamp-1">"{sup.message}"</div>
                        )}
                      </div>
                      <div className="font-extrabold text-[#00B98B] text-xs shrink-0 ml-2">
                        ₹{Number(sup.amount).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* High-Fidelity Simulated Razorpay Checkout Modal */}
      <RazorpayCheckoutModal
        isOpen={showSimulatedModal}
        onClose={() => setShowSimulatedModal(false)}
        orderData={activeOrderData}
        title={campaign?.title}
        beneficiaryName={campaign?.ngoId?.organizationName || 'Serve-X Partner NGO'}
        donorName={donorName}
        donorEmail={donorEmail}
        onPaymentSuccess={handlePaymentVerification}
      />

      {/* Official 80G Receipt Modal */}
      <ReceiptModal
        receipt={receiptData}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
};
