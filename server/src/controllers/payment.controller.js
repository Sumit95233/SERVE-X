import { MonetaryDonation } from '../models/MonetaryDonation.js';
import { Campaign } from '../models/Campaign.js';
import { NGO } from '../models/NGO.js';
import { PaymentEvent } from '../models/PaymentEvent.js';
import {
  createRazorpayOrder,
  verifyPaymentSignature,
  verifyWebhookSignature,
  generateReceiptNumber,
} from '../services/razorpay.service.js';
import { sendNotification, createAuditLog } from '../services/notification.service.js';
import { sendDonationThankYouEmail } from '../services/emailService.js';
import { generateReceiptPdfBuffer } from '../services/pdfReceipt.service.js';

export const createOrder = async (req, res, next) => {
  try {
    let { campaignId, ngoId, amount, donorName, donorEmail, donorPhone, donorMessage, isAnonymous } = req.body;

    if (!amount || Number(amount) < 1) {
      return res.status(400).json({
        success: false,
        message: 'Minimum contribution amount is ₹1',
        code: 'INVALID_AMOUNT',
      });
    }

    let campaign = null;
    let targetNgoId = ngoId;

    if (campaignId) {
      campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found',
          code: 'CAMPAIGN_NOT_FOUND',
        });
      }
      targetNgoId = campaign.ngoId;
    } else if (ngoId) {
      // Find active campaign for this NGO, or create a general donation campaign
      campaign = await Campaign.findOne({ ngoId, status: 'active' });
      if (!campaign) {
        const ngo = await NGO.findById(ngoId);
        if (!ngo) {
          return res.status(404).json({
            success: false,
            message: 'NGO not found',
            code: 'NGO_NOT_FOUND',
          });
        }
        campaign = await Campaign.create({
          ngoId: ngo._id,
          title: `Direct Community & Mission Support - ${ngo.organizationName}`,
          description: `Direct monetary contribution towards the operational and community programs of ${ngo.organizationName}.`,
          causeCategory: ngo.causeCategories?.[0] || 'Community Development',
          goalAmount: 1000000,
          amountRaised: 0,
          donorCount: 0,
          images: [ngo.logo || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&fit=crop'],
          city: ngo.city,
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          beneficiaryDescription: `Communities supported by ${ngo.organizationName} in ${ngo.city}, ${ngo.state}`,
          fundUsagePlan: '100% Direct community assistance and operational delivery.',
          status: 'active',
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide either campaignId or ngoId to donate',
        code: 'MISSING_RECIPIENT',
      });
    }

    if (campaign.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: `Campaign is currently not accepting donations (Status: ${campaign.status})`,
        code: 'CAMPAIGN_INACTIVE',
      });
    }

    const receipt = `RCPT_${Date.now()}`;
    const order = await createRazorpayOrder({
      amount: Number(amount),
      currency: 'INR',
      receipt,
    });

    const finalDonorEmail = (donorEmail || req.user?.email || '').trim();
    const finalDonorName = (donorName || req.user?.fullName || 'Generous Supporter').trim();

    const donation = await MonetaryDonation.create({
      donorId: req.user ? req.user._id : null,
      donorName: finalDonorName,
      donorEmail: finalDonorEmail,
      donorPhone: (donorPhone || '').trim(),
      ngoId: targetNgoId,
      campaignId: campaign._id,
      amount: Number(amount),
      currency: 'INR',
      razorpayOrderId: order.id,
      paymentStatus: 'initiated',
      donorMessage: donorMessage || '',
      isAnonymous: Boolean(isAnonymous),
    });

    res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        donationId: donation._id,
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_ServeXPlatformKey',
        campaignTitle: campaign.title,
        donorName: finalDonorName,
        donorEmail: finalDonorEmail,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const isValid = verifyPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Payment signature verification failed. Untrusted payment evidence.',
        code: 'SIGNATURE_VERIFICATION_FAILED',
      });
    }

    const donation = await MonetaryDonation.findOne({ razorpayOrderId });
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Associated donation record not found',
        code: 'DONATION_RECORD_NOT_FOUND',
      });
    }

    // Idempotency check: if already successful, return existing receipt
    if (donation.paymentStatus === 'successful') {
      return res.json({
        success: true,
        message: 'Payment already verified',
        data: {
          receiptNumber: donation.receiptNumber,
          donationId: donation._id,
          amount: donation.amount,
          status: donation.paymentStatus,
        },
      });
    }

    // Update donation status
    const receiptNumber = generateReceiptNumber();
    donation.paymentStatus = 'successful';
    donation.razorpayPaymentId = razorpayPaymentId;
    donation.razorpaySignature = razorpaySignature;
    donation.receiptNumber = receiptNumber;
    await donation.save();

    // Increment campaign amount raised atomically
    await Campaign.findByIdAndUpdate(donation.campaignId, {
      $inc: {
        amountRaised: donation.amount,
        donorCount: 1,
      },
    });

    // Notify donor if logged in
    if (donation.donorId) {
      await sendNotification({
        userId: donation.donorId,
        title: 'Donation Successful!',
        message: `Your payment of ₹${donation.amount.toLocaleString('en-IN')} was verified. Receipt #${receiptNumber} generated.`,
        type: 'donation',
        link: `/donor/history`,
      });
    }

    // Notify NGO
    const ngo = await NGO.findById(donation.ngoId);
    if (ngo && ngo.userId) {
      await sendNotification({
        userId: ngo.userId,
        title: 'New Donation Received!',
        message: `A generous contribution of ₹${donation.amount.toLocaleString('en-IN')} has been received.`,
        type: 'donation',
        link: `/ngo/donations`,
      });
    }

    await createAuditLog({
      actorId: donation.donorId || null,
      action: 'PAYMENT_VERIFIED_SUCCESSFUL',
      resourceType: 'MonetaryDonation',
      resourceId: donation._id,
      metadata: {
        amount: donation.amount,
        receiptNumber,
        razorpayPaymentId,
      },
    });

    // Dispatch verified thank-you email with attached official 80G PDF receipt
    try {
      await sendDonationThankYouEmail(donation._id);
    } catch (emailErr) {
      console.error('[Async Email Delivery Notice]', emailErr?.message || emailErr);
    }

    res.json({
      success: true,
      message: 'Payment verified successfully. Donation confirmed!',
      data: {
        donationId: donation._id,
        receiptNumber,
        amount: donation.amount,
        status: donation.paymentStatus,
        donorName: donation.donorName,
        createdAt: donation.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const handleWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const rawBody = req.rawBody || JSON.stringify(req.body);

    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid && process.env.NODE_ENV === 'production') {
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }

    const event = req.body;
    const eventId = event?.id || `webhook_${Date.now()}`;

    // Idempotency: check if event already recorded
    const existingEvent = await PaymentEvent.findOne({ providerEventId: eventId });
    if (existingEvent) {
      return res.json({ success: true, message: 'Event already handled' });
    }

    const payload = event?.payload?.payment?.entity;
    const orderId = payload?.order_id;
    const paymentId = payload?.id;

    await PaymentEvent.create({
      providerEventId: eventId,
      eventType: event?.event || 'unknown',
      orderId,
      paymentId,
      processingStatus: 'processed',
      payload: event,
    });

    if (event.event === 'payment.captured' && orderId) {
      const donation = await MonetaryDonation.findOne({ razorpayOrderId: orderId });
      if (donation && donation.paymentStatus !== 'successful') {
        donation.paymentStatus = 'successful';
        donation.razorpayPaymentId = paymentId;
        donation.receiptNumber = generateReceiptNumber();
        await donation.save();

        await Campaign.findByIdAndUpdate(donation.campaignId, {
          $inc: { amountRaised: donation.amount, donorCount: 1 },
        });

        // Dispatch verified thank-you email with attached official 80G PDF receipt
        try {
          await sendDonationThankYouEmail(donation._id);
        } catch (emailErr) {
          console.error('[Webhook Async Email Notice]', emailErr?.message || emailErr);
        }
      }
    }

    res.json({ success: true, message: 'Webhook received and processed' });
  } catch (err) {
    next(err);
  }
};

export const getDonationHistory = async (req, res, next) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const query = { donorId: req.user._id };

    const [donations, total] = await Promise.all([
      MonetaryDonation.find(query)
        .populate('campaignId', 'title causeCategory images')
        .populate('ngoId', 'organizationName city state')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      MonetaryDonation.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: donations,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getReceipt = async (req, res, next) => {
  try {
    const { receiptNumber } = req.params;
    const donation = await MonetaryDonation.findOne({ receiptNumber })
      .populate('campaignId', 'title causeCategory')
      .populate('ngoId', 'organizationName registrationNumber address city state pincode contactPerson email phone');

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found',
        code: 'RECEIPT_NOT_FOUND',
      });
    }

    // Access control: only owner, admin, or the receiving NGO can view registered donor receipt
    if (donation.donorId) {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required to view this receipt',
          code: 'UNAUTHORIZED',
        });
      }
      const isOwner = String(req.user._id) === String(donation.donorId);
      const isAdmin = req.user.role === 'admin';
      const isNgo = req.user.role === 'ngo' && donation.ngoId && String(req.user._id) === String(donation.ngoId.userId);

      if (!isOwner && !isAdmin && !isNgo) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this receipt',
          code: 'UNAUTHORIZED_RECEIPT_ACCESS',
        });
      }
    }

    res.json({
      success: true,
      data: {
        receiptNumber: donation.receiptNumber,
        donationDate: donation.createdAt,
        amount: donation.amount,
        currency: donation.currency,
        paymentStatus: donation.paymentStatus,
        razorpayPaymentId: donation.razorpayPaymentId,
        donorName: donation.isAnonymous ? 'Anonymous Donor' : donation.donorName,
        donorEmail: donation.donorEmail,
        campaign: donation.campaignId,
        ngo: donation.ngoId,
        taxExemptionNote: 'Eligible for 50% tax exemption under Section 80G of the Income Tax Act (where applicable).',
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getNgoReceivedDonations = async (req, res, next) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user._id });
    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: 'NGO record not found for this account',
      });
    }

    const { page = 1, limit = 50, type = 'all', search } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const query = {
      ngoId: ngo._id,
      paymentStatus: 'successful',
    };

    if (type === 'campaign') {
      query.campaignId = { $ne: null };
    } else if (type === 'direct') {
      query.campaignId = null;
    }

    if (search) {
      query.$or = [
        { donorName: { $regex: search, $options: 'i' } },
        { receiptNumber: { $regex: search, $options: 'i' } },
        { donorEmail: { $regex: search, $options: 'i' } },
      ];
    }

    const [donations, total, stats] = await Promise.all([
      MonetaryDonation.find(query)
        .populate('campaignId', 'title causeCategory')
        .populate('donorId', 'fullName email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      MonetaryDonation.countDocuments(query),
      MonetaryDonation.aggregate([
        { $match: { ngoId: ngo._id, paymentStatus: 'successful' } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
            totalCount: { $sum: 1 },
            avgDonation: { $avg: '$amount' },
          },
        },
      ]),
    ]);

    const summary = {
      totalAmount: stats[0]?.totalAmount || 0,
      totalCount: stats[0]?.totalCount || 0,
      avgDonation: Math.round(stats[0]?.avgDonation || 0),
    };

    res.json({
      success: true,
      data: donations,
      summary,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const downloadReceiptPdf = async (req, res, next) => {
  try {
    const { receiptNumber } = req.params;
    const donation = await MonetaryDonation.findOne({ receiptNumber })
      .populate('campaignId', 'title causeCategory')
      .populate('ngoId', 'organizationName registrationNumber address city state pincode contactPerson email phone');

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found',
        code: 'RECEIPT_NOT_FOUND',
      });
    }

    const pdfBuffer = await generateReceiptPdfBuffer(donation);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="ServeX_Receipt_${donation.receiptNumber || 'Donation'}.pdf"`
    );
    res.setHeader('Content-Length', pdfBuffer.length);
    res.end(pdfBuffer);
  } catch (err) {
    next(err);
  }
};

