import React from 'react';

export const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-[#F7F9FC] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-3xl p-8 sm:p-12 border border-[#E5EAF0] shadow-xs space-y-6">
        <h1 className="text-3xl font-extrabold text-[#101828]">Privacy Policy</h1>
        <p className="text-xs text-gray-500">Last updated: October 2026</p>

        <div className="prose text-xs sm:text-sm text-[#475467] leading-relaxed space-y-4">
          <p>
            ServeX ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by ServeX.
          </p>

          <h3 className="text-base font-bold text-[#101828]">1. Donor Address Privacy Protection</h3>
          <p>
            When listing physical goods for donation, your exact residential address is stored securely and is never displayed publicly on search results or discovery feeds. It is only made accessible to an authorized verified NGO after you explicitly approve their claim request.
          </p>

          <h3 className="text-base font-bold text-[#101828]">2. Financial and Payment Security</h3>
          <p>
            All monetary contributions are processed through Razorpay. ServeX never receives, stores, or handles credit card numbers, CVVs, or UPI PINs on its servers.
          </p>

          <h3 className="text-base font-bold text-[#101828]">3. Section 80G Tax Records</h3>
          <p>
            To generate legally compliant Section 80G donation receipts, we record the donor's full name, email, and transaction reference. This information is shared exclusively with the receiving verified partner NGO.
          </p>
        </div>
      </div>
    </div>
  );
};

export const TermsPage = () => {
  return (
    <div className="min-h-screen bg-[#F7F9FC] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-3xl p-8 sm:p-12 border border-[#E5EAF0] shadow-xs space-y-6">
        <h1 className="text-3xl font-extrabold text-[#101828]">Terms of Service</h1>
        <p className="text-xs text-gray-500">Last updated: October 2026</p>

        <div className="prose text-xs sm:text-sm text-[#475467] leading-relaxed space-y-4">
          <p>
            Welcome to ServeX. By accessing or using our platform, you agree to be bound by these terms.
          </p>

          <h3 className="text-base font-bold text-[#101828]">1. NGO Eligibility & Verification</h3>
          <p>
            Only registered non-profit entities possessing valid government registration certificates may apply as NGO partners. Verification is subject to administrative due diligence and may be revoked if misrepresentation occurs.
          </p>

          <h3 className="text-base font-bold text-[#101828]">2. Item Donation Commitments</h3>
          <p>
            Donors listing physical items represent that listed items are in safe, usable condition. NGOs claiming items commit to picking them up during scheduled time slots and distributing them to declared beneficiaries without commercial resale.
          </p>

          <h3 className="text-base font-bold text-[#101828]">3. Monetary Donations</h3>
          <p>
            Contributions to active fundraising campaigns are irrevocable once executed, barring demonstrated payment fraud or unauthorized card use as handled through standard banking dispute protocols.
          </p>
        </div>
      </div>
    </div>
  );
};
