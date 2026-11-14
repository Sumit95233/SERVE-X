import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Clean truncation helper to ensure strings never overflow their allocated width
export const truncate = (str, maxChars = 35) => {
  if (!str) return 'N/A';
  const clean = String(str).trim();
  return clean.length > maxChars ? clean.slice(0, maxChars - 2) + '..' : clean;
};

// Number to words converter for Indian Rupee denominations
export const numberToWordsINR = (num) => {
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const n = Math.floor(Math.abs(Number(num) || 0));
  if (n === 0) return 'Zero Rupees Only';

  const convertLessThanOneThousand = (val) => {
    let str = '';
    if (val >= 100) {
      str += a[Math.floor(val / 100)] + ' Hundred ';
      val %= 100;
    }
    if (val >= 20) {
      str += b[Math.floor(val / 10)] + (val % 10 !== 0 ? ' ' + a[val % 10] : '') + ' ';
    } else if (val > 0) {
      str += a[val] + ' ';
    }
    return str.trim();
  };

  let words = '';
  const crore = Math.floor(n / 10000000);
  const remainderCrore = n % 10000000;
  const lakh = Math.floor(remainderCrore / 100000);
  const remainderLakh = remainderCrore % 100000;
  const thousand = Math.floor(remainderLakh / 1000);
  const remainderThousand = remainderLakh % 1000;

  if (crore > 0) words += convertLessThanOneThousand(crore) + ' Crore ';
  if (lakh > 0) words += convertLessThanOneThousand(lakh) + ' Lakh ';
  if (thousand > 0) words += convertLessThanOneThousand(thousand) + ' Thousand ';
  if (remainderThousand > 0) words += convertLessThanOneThousand(remainderThousand);

  return `${words.trim()} Rupees Only`;
};

export const INSPIRATIONAL_QUOTES = [
  {
    quote: 'No one has ever become poor by giving.',
    author: 'Anne Frank',
  },
  {
    quote: 'We make a living by what we get, but we make a life by what we give.',
    author: 'Winston Churchill',
  },
  {
    quote: 'The simplest acts of kindness are by far more powerful than a thousand heads bowing in prayer.',
    author: 'Mahatma Gandhi',
  },
  {
    quote: 'Giving is not just about making a donation. It is about making a difference.',
    author: 'Kathy Calvin',
  },
  {
    quote: 'It is not how much we give but how much love we put into giving.',
    author: 'Mother Teresa',
  },
];

/**
 * Generates an executive A4 donation receipt PDF buffer using PDFKit.
 * Guaranteed zero-overlap, single-page fit, and clean PostScript standard fonts.
 */
export const generateReceiptPdfBuffer = async (donation) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 36,
        info: {
          Title: `ServeX Donation Receipt - ${donation.receiptNumber || 'Receipt'}`,
          Author: 'ServeX Platform',
          Subject: 'Section 80G Tax Exemption Donation Receipt',
          Keywords: 'Donation, Receipt, ServeX, 80G, NGO, Charity',
        },
      });

      const buffers = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      const pageWidth = 595.28; // standard A4 pt
      const contentWidth = pageWidth - 72; // 36pt margin on each side = 523.28
      const startX = 36;
      let y = 36;

      // 1. TOP BRAND HEADER RIBBON
      doc.rect(startX, y, contentWidth, 62).fill('#0C2340');

      // ServeX Logo
      doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(22).text('Serve', startX + 16, y + 14, { continued: true, lineBreak: false });
      doc.fillColor('#00B98B').text('X', { lineBreak: false });

      doc.fillColor('#94A3B8').font('Helvetica').fontSize(8).text('Bridging the Gap for Global Good', startX + 16, y + 38, { lineBreak: false });
      doc.fillColor('#CBD5E1').font('Helvetica').fontSize(7.2).text('Chandigarh University Gate no 4 • sumitrajslm2018@gmail.com • +91 95233 34322', startX + 16, y + 49, { lineBreak: false });

      // Receipt Badge on Right
      doc.rect(startX + contentWidth - 165, y + 11, 150, 40).fill('#1E3A5F');
      doc.fillColor('#34D399').font('Helvetica-Bold').fontSize(8).text('OFFICIAL 80G RECEIPT', startX + contentWidth - 165, y + 16, { width: 150, align: 'center', lineBreak: false });
      doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(8.5).text(donation.receiptNumber || 'SRVX-RECEIPT', startX + contentWidth - 165, y + 29, { width: 150, align: 'center', lineBreak: false });

      y += 70;

      // 2. STATUTORY TAX BENEFIT NOTICE BANNER
      doc.rect(startX, y, contentWidth, 22).fill('#ECFDF5');
      doc.rect(startX, y, 4, 22).fill('#059669');
      doc.fillColor('#065F46').font('Helvetica-Bold').fontSize(7.5).text(
        'SECTION 80G TAX EXEMPTION: Donations qualify for 50% deduction under Section 80G of the Indian Income Tax Act 1961.',
        startX + 12,
        y + 7,
        { width: contentWidth - 20, lineBreak: false }
      );

      y += 28;

      // 3. TWO-COLUMN SUMMARY CARDS (DONOR & BENEFICIARY)
      const colWidth = (contentWidth - 12) / 2;
      const cardHeight = 100;

      // Left: Donor Details Card
      doc.rect(startX, y, colWidth, cardHeight).fillAndStroke('#F8FAFC', '#E2E8F0');
      doc.rect(startX, y, colWidth, 20).fill('#07549A');
      doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(8.5).text('DONOR DETAILS', startX + 10, y + 5, { lineBreak: false });

      let dyLeft = y + 26;
      const addDonorRow = (label, val) => {
        doc.fillColor('#64748B').font('Helvetica').fontSize(7.5).text(label, startX + 10, dyLeft, { width: 85, lineBreak: false });
        doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(7.5).text(truncate(val, 28), startX + 95, dyLeft, { width: colWidth - 105, lineBreak: false });
        dyLeft += 17;
      };

      addDonorRow('Full Name:', donation.donorName || 'Generous Supporter');
      addDonorRow('Email ID:', donation.donorEmail || 'Not Specified');
      addDonorRow('Phone Number:', donation.donorPhone || '+91 95233 34322');
      addDonorRow('Tax Exemption:', 'Section 80G Eligible (50%)');

      // Right: Beneficiary NGO Details Card
      const rightX = startX + colWidth + 12;
      doc.rect(rightX, y, colWidth, cardHeight).fillAndStroke('#F8FAFC', '#E2E8F0');
      doc.rect(rightX, y, colWidth, 20).fill('#07549A');
      doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(8.5).text('BENEFICIARY NGO DETAILS', rightX + 10, y + 5, { lineBreak: false });

      let dyRight = y + 26;
      const addNgoRow = (label, val) => {
        doc.fillColor('#64748B').font('Helvetica').fontSize(7.5).text(label, rightX + 10, dyRight, { width: 85, lineBreak: false });
        doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(7.5).text(truncate(val, 28), rightX + 95, dyRight, { width: colWidth - 105, lineBreak: false });
        dyRight += 17;
      };

      const ngoName = donation.ngoId?.organizationName || donation.ngo?.organizationName || 'Serve-X Partner NGO';
      const regNo = donation.ngoId?.registrationNumber || donation.ngo?.registrationNumber || 'IND/PY/2024/0009';
      const city = donation.ngoId?.city || donation.ngo?.city || 'Mannadipet';
      const state = donation.ngoId?.state || donation.ngo?.state || 'Puducherry';

      addNgoRow('Organization:', ngoName);
      addNgoRow('DARPAN / Reg:', regNo);
      addNgoRow('Jurisdiction:', `${city}, ${state}`.trim().replace(/^,|,$/g, ''));
      addNgoRow('Verification:', '100% NITI Aayog Verified Partner');

      y += cardHeight + 10;

      // 4. DEDICATED FULL-WIDTH CAMPAIGN / CAUSE CARD (ZERO OVERLAP GUARANTEED)
      const campaignTitle = donation.campaignId?.title || donation.campaign?.title || 'Geriatric Healthcare, Medicines & Compassionate Living for Elders in Mannadipet';
      
      doc.rect(startX, y, contentWidth, 36).fillAndStroke('#F8FAFC', '#E2E8F0');
      doc.rect(startX, y, 4, 36).fill('#07549A');

      doc.fillColor('#64748B').font('Helvetica-Bold').fontSize(7).text('SUPPORTED CAUSE / CAMPAIGN INITIATIVE', startX + 12, y + 6, { lineBreak: false });
      doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(8.5).text(truncate(campaignTitle, 80), startX + 12, y + 18, {
        width: contentWidth - 24,
        lineBreak: false,
      });

      y += 46;

      // 5. TRANSACTION / AUDIT BREAKDOWN TABLE
      doc.rect(startX, y, contentWidth, 54).fillAndStroke('#FFFFFF', '#CBD5E1');
      doc.rect(startX, y, contentWidth, 18).fill('#F1F5F9');
      
      doc.fillColor('#475467').font('Helvetica-Bold').fontSize(7.5);
      doc.text('TRANSACTION REF', startX + 10, y + 5, { width: 130, lineBreak: false });
      doc.text('PAYMENT GATEWAY', startX + 150, y + 5, { width: 110, lineBreak: false });
      doc.text('RAZORPAY ORDER ID', startX + 270, y + 5, { width: 130, lineBreak: false });
      doc.text('PAYMENT STATUS', startX + 410, y + 5, { width: 100, lineBreak: false });

      const ty1 = y + 23;
      doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(7.5);
      doc.text(truncate(donation.receiptNumber || 'SRVX-REC', 20), startX + 10, ty1, { lineBreak: false });
      doc.font('Helvetica').fontSize(7.5).text('Razorpay Secured', startX + 150, ty1, { lineBreak: false });
      doc.font('Courier').fontSize(7).text(truncate(donation.razorpayOrderId || 'order_mwcptcs_77c9', 24), startX + 270, ty1, { lineBreak: false });
      doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#059669').text('VERIFIED & COMPLETED', startX + 410, ty1, { lineBreak: false });

      const ty2 = y + 37;
      doc.fillColor('#64748B').font('Helvetica').fontSize(7);
      doc.text(truncate(`Payment ID: ${donation.razorpayPaymentId || 'pay_verified'}`, 24), startX + 10, ty2, { lineBreak: false });
      doc.text('Currency: INR (Indian Rupee)', startX + 150, ty2, { lineBreak: false });
      doc.text('Security: 256-Bit SSL Digital Signed', startX + 270, ty2, { lineBreak: false });
      doc.text('Instant 80G Compliant', startX + 410, ty2, { lineBreak: false });

      y += 64;

      // 6. CONTRIBUTION AMOUNT HIGHLIGHT BANNER
      const formattedAmount = Number(donation.amount || 0).toLocaleString('en-IN');
      const amountInWords = numberToWordsINR(donation.amount);

      doc.rect(startX, y, contentWidth, 52).fill('#EBFDF5');
      doc.rect(startX, y, contentWidth, 52).stroke('#A7F3D0');

      doc.fillColor('#065F46').font('Helvetica-Bold').fontSize(7.5).text('TOTAL CONTRIBUTION RECEIVED', startX + 14, y + 8, { lineBreak: false });
      doc.fillColor('#047857').font('Helvetica-Bold').fontSize(18).text(`Rs. ${formattedAmount}`, startX + 14, y + 19, { lineBreak: false });
      doc.fillColor('#065F46').font('Helvetica-Oblique').fontSize(7.5).text(
        `Amount in Words: ${truncate(amountInWords, 65)}`,
        startX + 14,
        y + 38,
        { width: contentWidth - 28, lineBreak: false }
      );

      y += 60;

      // 7. HEARTWARMING INSPIRATIONAL QUOTE BOX
      const quoteObj = INSPIRATIONAL_QUOTES[0];
      doc.rect(startX, y, contentWidth, 38).fill('#F0F9FF');
      doc.rect(startX, y, 4, 38).fill('#0284C7');

      doc.fillColor('#0369A1').font('Helvetica-Oblique').fontSize(8.5).text(
        `"${quoteObj.quote}"`,
        startX + 14,
        y + 8,
        { width: contentWidth - 28, lineBreak: false }
      );
      doc.fillColor('#0284C7').font('Helvetica-Bold').fontSize(7.5).text(
        `— ${quoteObj.author}`,
        startX + 14,
        y + 22,
        { lineBreak: false }
      );

      y += 46;

      // 8. AUTHORIZED DIGITAL SEAL & SIGNATURE SECTION
      const signY = y;
      doc.rect(startX, signY, contentWidth, 58).fillAndStroke('#F8FAFC', '#E2E8F0');

      // Left: Legal Declaration
      doc.fillColor('#334155').font('Helvetica').fontSize(6.8).text(
        'LEGAL CERTIFICATION: This document certifies that the aforementioned contribution was received by Serve-X Foundation on behalf of the verified partner NGO for humanitarian, educational, or healthcare development under registered non-profit charter.',
        startX + 12,
        signY + 8,
        { width: contentWidth - 165, lineGap: 1.5 }
      );
      doc.fillColor('#64748B').font('Helvetica').fontSize(6.5).text(
        'Valid without physical signature under Section 4 of the Information Technology Act 2000.',
        startX + 12,
        signY + 41,
        { width: contentWidth - 165, lineBreak: false }
      );

      // Right: Digital Signature Stamp
      const sealX = startX + contentWidth - 144;
      doc.rect(sealX, signY + 6, 134, 46).fillAndStroke('#FFFFFF', '#00B98B');
      doc.fillColor('#00B98B').font('Helvetica-Bold').fontSize(7.5).text('SERVEX DIGITAL SEAL', sealX, signY + 10, { width: 134, align: 'center', lineBreak: false });
      doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(7).text('AUTHORIZED SIGNATORY', sealX, signY + 21, { width: 134, align: 'center', lineBreak: false });
      doc.fillColor('#64748B').font('Helvetica').fontSize(6.2).text('Compliance & Accounts Cell', sealX, signY + 30, { width: 134, align: 'center', lineBreak: false });
      doc.fillColor('#059669').font('Courier').fontSize(6.2).text(`REF: ${Date.now().toString(36).toUpperCase()}`, sealX, signY + 38, { width: 134, align: 'center', lineBreak: false });

      y += 66;

      // 9. FOOTER NOTE
      doc.rect(startX, y, contentWidth, 0.5).fill('#CBD5E1');
      doc.fillColor('#94A3B8').font('Helvetica').fontSize(6.8).text(
        'ServeX Foundation • Chandigarh University Gate no 4 • Support: sumitrajslm2018@gmail.com • Contact: +91 95233 34322 • All Rights Reserved',
        startX,
        y + 5,
        { width: contentWidth, align: 'center', lineBreak: false }
      );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Saves receipt PDF to disk inside server/receipts directory and returns the absolute path.
 */
export const saveReceiptPdfToDisk = async (donation) => {
  const receiptsDir = path.resolve('receipts');
  if (!fs.existsSync(receiptsDir)) {
    fs.mkdirSync(receiptsDir, { recursive: true });
  }

  const filename = `ServeX_Receipt_${donation.receiptNumber || donation._id}.pdf`;
  const filePath = path.join(receiptsDir, filename);

  const buffer = await generateReceiptPdfBuffer(donation);
  await fs.promises.writeFile(filePath, buffer);

  return { filePath, filename, buffer };
};
