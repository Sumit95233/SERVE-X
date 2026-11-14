import nodemailer from 'nodemailer';
import { MonetaryDonation } from '../models/MonetaryDonation.js';
import { User } from '../models/User.js';
import {
  generateReceiptPdfBuffer,
  saveReceiptPdfToDisk,
  INSPIRATIONAL_QUOTES,
} from './pdfReceipt.service.js';

// Safe HTML escaping helper to prevent HTML injection in email bodies
export const escapeHtml = (unsafeText) => {
  if (unsafeText === null || unsafeText === undefined) return '';
  return String(unsafeText)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Builds the responsive HTML and plain text email content for verified donations.
 */
export const buildThankYouEmailContent = ({
  donorName,
  formattedAmount,
  campaignName,
  donationReference,
  formattedDonationDate,
  clientUrl,
  supportEmail,
  quoteObj,
}) => {
  const chosenQuote = quoteObj || INSPIRATIONAL_QUOTES[0];
  const safeDonorName = escapeHtml(donorName || 'Generous Supporter');
  const safeCampaignName = escapeHtml(campaignName || 'Verified Community Cause');
  const safeReference = escapeHtml(donationReference || 'N/A');
  const safeDate = escapeHtml(formattedDonationDate);
  const safeAmount = escapeHtml(formattedAmount);
  const safeSupportEmail = escapeHtml(supportEmail || 'sumitrajslm2018@gmail.com');
  const safeQuoteText = escapeHtml(chosenQuote.quote);
  const safeQuoteAuthor = escapeHtml(chosenQuote.author);

  const donationDetailsUrl = `${clientUrl}/donor/history`;
  const exploreCausesUrl = `${clientUrl}/campaigns`;

  const subject = 'Heartfelt Thanks from Serve-X for Your Generous Contribution!';
  const preheader = `Thank you ${safeDonorName}! Your verified donation receipt #${safeReference} is attached.`;

  const textBody = `Dear ${safeDonorName},

Thank you from all of us at Serve-X! Your generous contribution of ${safeAmount} has been successfully verified.
Your kindness brings hope, resources, and essential support to communities in need.

"${safeQuoteText}"
— ${safeQuoteAuthor}

DONATION SUMMARY:
- Verified Contribution: ${safeAmount}
- Beneficiary Cause: ${safeCampaignName}
- Official Receipt Number: ${safeReference}
- Contribution Date: ${safeDate}
- Tax Exemption: Section 80G Certified (50% Tax Deduction)
- Payment Status: Verified & Completed via Razorpay Gateway

OFFICIAL RECEIPT ATTACHED:
We have attached your official Section 80G Tax Exemption Receipt (ServeX_Receipt_${safeReference}.pdf) to this email for your tax filing records.

View Donation History: ${donationDetailsUrl}
Explore More Causes: ${exploreCausesUrl}

With sincere gratitude and warmth,
The Serve-X Foundation Team
Bridging the Gap for Global Good
Chandigarh University Gate no 4
Contact: +91 95233 34322 | Email: ${safeSupportEmail}
`;

  const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #F4F7FB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    table { border-collapse: collapse; }
    img { border: 0; outline: none; text-decoration: none; }
    .btn { display: inline-block; padding: 12px 24px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 8px; text-align: center; }
  </style>
</head>
<body style="margin: 0; padding: 24px 0; background-color: #F4F7FB;">
  <!-- Preview Preheader -->
  <div style="display: none; max-height: 0px; overflow: hidden; opacity: 0; font-size: 1px; color: #FFFFFF;">
    ${preheader}
  </div>

  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F4F7FB;">
    <tr>
      <td align="center" style="padding: 12px 16px;">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; background-color: #FFFFFF; border-radius: 18px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 20px rgba(16,42,67,0.08);">
          
          <!-- Header Bar -->
          <tr>
            <td style="padding: 32px 36px; background: linear-gradient(135deg, #0C2340 0%, #07549A 100%); text-align: left;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 28px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">
                      Serve<span style="color: #00B98B;">X</span>
                    </span>
                    <div style="font-size: 13px; color: #94A3B8; margin-top: 4px; font-weight: 500;">
                      Bridging the Gap for Global Good
                    </div>
                  </td>
                  <td align="right">
                    <span style="background-color: rgba(0,185,139,0.2); border: 1px solid rgba(0,185,139,0.5); color: #34D399; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px;">
                      Verified Donation
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 36px 36px 24px 36px; color: #101828;">
              <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 800; color: #101828; line-height: 1.3;">
                Dear ${safeDonorName},
              </h1>
              <p style="margin: 0 0 24px 0; font-size: 15px; color: #475467; line-height: 1.6;">
                Thank you from the bottom of our hearts for making a difference through <strong>Serve-X</strong>! Your generosity directly empowers communities, families, and partner organizations with vital support and resources.
              </p>

              <!-- Heartwarming Inspirational Quote Card -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #ECFDF5 0%, #E0F2FE 100%); border-left: 4px solid #00B98B; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 18px 22px;">
                    <div style="font-size: 15px; font-style: italic; color: #064E3B; line-height: 1.6; font-weight: 500;">
                      &ldquo;${safeQuoteText}&rdquo;
                    </div>
                    <div style="font-size: 13px; font-weight: 700; color: #047857; margin-top: 6px;">
                      &mdash; ${safeQuoteAuthor}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Donation Summary Card -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-bottom: 12px; font-size: 12px; color: #64748B; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                          Contribution Summary
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #475467;">
                          Verified Amount: <strong style="color: #047857; font-size: 20px; font-weight: 800;">${safeAmount}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #475467;">
                          Beneficiary Cause: <strong style="color: #101828;">${safeCampaignName}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #475467;">
                          Receipt Reference: <code style="background-color: #EDF2F7; padding: 3px 8px; border-radius: 6px; font-size: 13px; color: #0B1F33; font-weight: 700;">${safeReference}</code>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #475467;">
                          Date & Time: <span style="color: #101828; font-weight: 500;">${safeDate}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 10px; font-size: 13px; color: #059669; font-weight: 700;">
                          &#10003; Payment Verified via Razorpay Secure Gateway
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- PDF Attachment Notice Card -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F0FDF4; border: 2px dashed #00B98B; border-radius: 12px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="36" valign="middle">
                          <div style="width: 32px; height: 32px; border-radius: 8px; background-color: #00B98B; color: #FFFFFF; font-size: 16px; font-weight: bold; text-align: center; line-height: 32px;">
                            &#128196;
                          </div>
                        </td>
                        <td style="padding-left: 12px;">
                          <div style="font-size: 14px; font-weight: 700; color: #07549A;">
                            Official 80G Tax Exemption Receipt (PDF) Attached
                          </div>
                          <div style="font-size: 12px; color: #047857; margin-top: 3px; line-height: 1.4;">
                            We have attached your official stamped receipt (<strong>ServeX_Receipt_${safeReference}.pdf</strong>) to this email for your tax filing records under Section 80G.
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Action CTAs -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                <tr>
                  <td align="left">
                    <a href="${donationDetailsUrl}" class="btn" style="background-color: #07549A; color: #FFFFFF; font-weight: 700; padding: 12px 24px; border-radius: 10px; text-decoration: none; display: inline-block; margin-right: 12px; margin-bottom: 8px;">
                      View Donation History
                    </a>
                    <a href="${exploreCausesUrl}" class="btn" style="background-color: #FFFFFF; color: #07549A; border: 1px solid #D0D5DD; font-weight: 700; padding: 12px 24px; border-radius: 10px; text-decoration: none; display: inline-block; margin-bottom: 8px;">
                      Explore More Causes &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Signoff -->
              <div style="border-top: 1px solid #E2E8F0; padding-top: 20px; font-size: 14px; color: #475467; line-height: 1.6;">
                With sincere gratitude and warmth,<br>
                <strong style="color: #101828;">The Serve-X Team</strong><br>
                <span style="font-size: 12px; color: #64748B;">Bridging the Gap for Global Good &bull; Chandigarh University Gate no 4</span>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: #F8FAFC; border-top: 1px solid #E2E8F0; text-align: center; font-size: 12px; color: #64748B; line-height: 1.6;">
              <p style="margin: 0 0 6px 0;">
                This email confirms a verified donation recorded by ServeX Platform.
              </p>
              <p style="margin: 0;">
                Have questions or need assistance? Reply directly to <a href="mailto:${safeSupportEmail}" style="color: #07549A; text-decoration: none; font-weight: 700;">${safeSupportEmail}</a> or call <strong>+91 95233 34322</strong>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, preheader, textBody, htmlBody };
};

/**
 * Sends a verified donation thank-you email asynchronously with official Section 80G PDF receipt attached.
 * Idempotent, retry-safe, and never throws to caller.
 */
export const sendDonationThankYouEmail = async (donationId) => {
  try {
    if (!donationId) return { success: false, reason: 'MISSING_DONATION_ID' };

    const donation = await MonetaryDonation.findById(donationId)
      .populate('campaignId', 'title')
      .populate('ngoId', 'organizationName registrationNumber city state')
      .populate('donorId', 'fullName email isPublicDonor emailPreferences');

    if (!donation) {
      return { success: false, reason: 'DONATION_NOT_FOUND' };
    }

    if (donation.paymentStatus !== 'successful') {
      return { success: false, reason: 'PAYMENT_NOT_VERIFIED' };
    }

    const idempotencyKey = `email_receipt_${donation.receiptNumber || donation._id}`;

    // Idempotency check: don't duplicate if already sent or simulated
    if (
      donation.emailDeliveryStatus === 'sent' ||
      donation.emailDeliveryStatus === 'simulated'
    ) {
      return {
        success: true,
        status: donation.emailDeliveryStatus,
        deliveryId: donation.emailDeliveryId,
        alreadyProcessed: true,
      };
    }

    // Check user preferences if donor has an account
    if (donation.donorId && donation.donorId.emailPreferences) {
      if (donation.donorId.emailPreferences.donationReceipts === false) {
        donation.emailDeliveryStatus = 'skipped';
        donation.idempotencyKey = idempotencyKey;
        await donation.save();
        return { success: true, status: 'skipped', reason: 'USER_OPTED_OUT' };
      }
    }

    const recipientEmail = donation.donorEmail;
    if (!recipientEmail || !recipientEmail.includes('@')) {
      donation.emailDeliveryStatus = 'failed';
      donation.emailError = 'Invalid recipient email address';
      donation.idempotencyKey = idempotencyKey;
      await donation.save();
      return { success: false, reason: 'INVALID_RECIPIENT_EMAIL' };
    }

    const donorName = donation.donorName || (donation.donorId?.fullName) || 'Generous Supporter';
    const campaignName = donation.campaignId?.title || 'Verified Community Cause';
    const formattedAmount = `₹${donation.amount.toLocaleString('en-IN')}`;
    const formattedDate = new Date(donation.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const supportEmail = process.env.EMAIL_REPLY_TO || 'sumitrajslm2018@gmail.com';
    const emailFrom = process.env.EMAIL_FROM || 'Serve-X <sumitrajslm2018@gmail.com>';

    // Select inspirational quote
    const chosenQuote = INSPIRATIONAL_QUOTES[Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length)];

    const { subject, textBody, htmlBody } = buildThankYouEmailContent({
      donorName,
      formattedAmount,
      campaignName,
      donationReference: donation.receiptNumber || `DON_${donation._id}`,
      formattedDonationDate: formattedDate,
      clientUrl,
      supportEmail,
      quoteObj: chosenQuote,
    });

    // 1. GENERATE OFFICIAL SECTION 80G RECEIPT PDF BUFFER & SAVE COPY TO DISK
    const { filePath, filename, buffer: pdfBuffer } = await saveReceiptPdfToDisk(donation);
    donation.receiptPdfPath = filePath;

    let deliveryId = null;
    let deliveryStatus = 'pending';

    // Provider check 1: Resend HTTP API
    if (
      process.env.EMAIL_PROVIDER === 'resend' &&
      process.env.EMAIL_API_KEY &&
      !process.env.EMAIL_API_KEY.includes('YOUR_')
    ) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.EMAIL_API_KEY}`,
        },
        body: JSON.stringify({
          from: emailFrom,
          to: [recipientEmail],
          reply_to: supportEmail,
          subject,
          text: textBody,
          html: htmlBody,
          attachments: [
            {
              filename,
              content: pdfBuffer.toString('base64'),
            },
          ],
          headers: {
            'X-Entity-Ref-ID': idempotencyKey,
          },
        }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData?.message || 'Resend API rejected message');
      }

      deliveryId = resData.id || `resend_${Date.now()}`;
      deliveryStatus = 'sent';
    }
    // Provider check 2: SMTP Transport via Nodemailer
    else if (
      process.env.SMTP_HOST &&
      process.env.SMTP_HOST.trim() !== '' &&
      process.env.SMTP_PASS &&
      process.env.SMTP_PASS.trim() !== '' &&
      !process.env.SMTP_HOST.includes('YOUR_')
    ) {
      const isGmail = process.env.SMTP_HOST.includes('gmail');
      const cleanPass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');
      const transporter = nodemailer.createTransport(
        isGmail
          ? {
              service: 'gmail',
              auth: {
                user: process.env.SMTP_USER,
                pass: cleanPass,
              },
            }
          : {
              host: process.env.SMTP_HOST,
              port: parseInt(process.env.SMTP_PORT || '587', 10),
              secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
              auth: {
                user: process.env.SMTP_USER,
                pass: cleanPass,
              },
            }
      );

      console.log(`[EmailService] Attempting real SMTP email dispatch to ${recipientEmail} via ${isGmail ? 'Gmail Service' : process.env.SMTP_HOST}...`);

      const info = await transporter.sendMail({
        from: emailFrom,
        to: recipientEmail,
        replyTo: supportEmail,
        subject,
        text: textBody,
        html: htmlBody,
        messageId: `<${idempotencyKey}@servex.org>`,
        attachments: [
          {
            filename,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      });

      deliveryId = info.messageId || `smtp_${Date.now()}`;
      deliveryStatus = 'sent';
      console.log(`[EmailService] Real email successfully delivered to ${recipientEmail}! Message ID: ${deliveryId}`);
    }
    // Provider check 3: Development fallback simulation
    else {
      // In development / test environment with unconfigured provider credentials, safely simulate delivery
      deliveryId = `sim_msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      deliveryStatus = 'simulated';

      if (process.env.NODE_ENV !== 'test') {
        console.log(`[EmailService] Verified donation thank-you email sent to ${recipientEmail} (Reference: ${donation.receiptNumber}, Amount: ${formattedAmount}, Delivery ID: ${deliveryId})`);
        console.log(`[EmailService] Attached Official 80G Receipt PDF generated & saved at: ${filePath}`);
      }
    }

    donation.emailDeliveryStatus = deliveryStatus;
    donation.emailDeliveryId = deliveryId;
    donation.emailSentAt = new Date();
    donation.idempotencyKey = idempotencyKey;
    donation.emailError = null;
    await donation.save();

    return {
      success: true,
      status: deliveryStatus,
      deliveryId,
      recipient: recipientEmail,
      receiptPdfPath: filePath,
    };
  } catch (err) {
    console.error('[EmailService Error]', err.message);

    // Record failure on donation record without failing payment transaction
    try {
      await MonetaryDonation.findByIdAndUpdate(donationId, {
        emailDeliveryStatus: 'failed',
        emailError: err.message,
      });
    } catch (saveErr) {
      console.error('[EmailService Save Error]', saveErr);
    }

    return {
      success: false,
      reason: err.message,
    };
  }
};
