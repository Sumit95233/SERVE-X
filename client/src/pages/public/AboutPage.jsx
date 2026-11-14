import React from 'react';
import { Heart, ShieldCheck, Users, Globe2, Target, Award } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#F7F9FC] py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-[#07549A] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
            Our Mission & Story
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#101828] mt-3 mb-4">
            Bridging the Gap for Global Good.
          </h1>
          <p className="text-sm sm:text-base text-[#475467] leading-relaxed">
            ServeX was founded with a singular purpose: to remove friction and lack of trust from charitable giving, connecting passionate volunteers and generous donors directly with verified grassroots organizations across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-[#E5EAF0] shadow-xs text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#00B98B] flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-[#101828] mb-2">100% Verified Partners</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Every NGO registered on ServeX undergoes physical and document audits, ensuring transparent legal credentials and verifiable ground operations.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#E5EAF0] shadow-xs text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#07549A] flex items-center justify-center mx-auto mb-4">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-[#101828] mb-2">Zero Waste Rehoming</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Our unique item donation pipeline connects surplus urban clothes, devices, and books directly with nearby rural and urban shelters.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#E5EAF0] shadow-xs text-center">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-[#101828] mb-2">Complete Fiscal Traceability</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Secure bank-grade checkout via Razorpay with automated 80G tax certificates and live fund allocation tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
