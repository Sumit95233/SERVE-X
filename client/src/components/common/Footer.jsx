import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#002642] text-white pt-14 pb-10 border-t border-[#003B64] w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-[#003B64]/60">
          {/* 1. Brand Info (Desktop: 4 cols) */}
          <div className="md:col-span-6 lg:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00B98B] to-[#55E6C1] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Serve<span className="text-[#00B98B]">X</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-sm">
              Empowering grassroots change by directly connecting verified NGOs across India with passionate volunteers and generous donors.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00B98B]/10 border border-[#00B98B]/20 text-[11px] font-bold text-[#00B98B]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Verified NGOs</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#07549A]/20 border border-[#07549A]/30 text-[11px] font-bold text-[#55E6C1]">
                <span>Section 80G Eligible</span>
              </div>
            </div>
          </div>

          {/* 2. Explore Links (Desktop: 2 cols) */}
          <div className="col-span-6 sm:col-span-3 md:col-span-3 lg:col-span-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-[#94A3B8]">
              <li>
                <Link to="/home" className="hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link to="/ngos" className="hover:text-white transition">NGO Directory</Link>
              </li>
              <li>
                <Link to="/ngo-locator" className="hover:text-white transition">NGO Locator Map</Link>
              </li>
              <li>
                <Link to="/campaigns" className="hover:text-white transition">Active Campaigns</Link>
              </li>
              <li>
                <Link to="/donor/donate-items" className="hover:text-white transition">Donate Items</Link>
              </li>
            </ul>
          </div>

          {/* 3. Get Involved Links (Desktop: 2 cols) */}
          <div className="col-span-6 sm:col-span-3 md:col-span-3 lg:col-span-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Get Involved
            </h4>
            <ul className="space-y-2.5 text-xs text-[#94A3B8]">
              <li>
                <Link to="/register" className="hover:text-white transition">Register as Donor</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition">Apply as NGO Partner</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">Organization Sign In</Link>
              </li>
              <li>
                <Link to="/donor/impact" className="hover:text-white transition">Impact Roadmap</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">About Us</Link>
              </li>
            </ul>
          </div>

          {/* 4. Professional Contact & Support Box (Desktop: 4 cols) */}
          <div className="md:col-span-6 lg:col-span-4 space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00B98B] animate-pulse" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Contact & Support
              </h4>
            </div>

            <div className="space-y-2.5">
              {/* Email Card */}
              <a
                href="mailto:sumitrajslm2018@gmail.com"
                className="flex items-center gap-3 p-2.5 rounded-xl bg-[#001D33]/70 border border-[#003B64] hover:border-[#00B98B]/60 hover:bg-[#002644] transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-[#00B98B]/10 border border-[#00B98B]/30 text-[#00B98B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">
                    Support Email
                  </div>
                  <div className="text-xs font-semibold text-white/95 truncate group-hover:text-[#00B98B] transition-colors">
                    sumitrajslm2018@gmail.com
                  </div>
                </div>
              </a>

              {/* Phone Card */}
              <a
                href="tel:+919523334322"
                className="flex items-center gap-3 p-2.5 rounded-xl bg-[#001D33]/70 border border-[#003B64] hover:border-[#00B98B]/60 hover:bg-[#002644] transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-[#00B98B]/10 border border-[#00B98B]/30 text-[#00B98B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">
                    Direct Helpline
                  </div>
                  <div className="text-xs font-semibold text-white/95 truncate group-hover:text-[#00B98B] transition-colors">
                    +91 95233 34322
                  </div>
                </div>
              </a>

              {/* Address Card */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#001D33]/70 border border-[#003B64]">
                <div className="w-9 h-9 rounded-lg bg-[#00B98B]/10 border border-[#00B98B]/30 text-[#00B98B] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">
                    Headquarters
                  </div>
                  <div className="text-xs font-semibold text-white/95 truncate">
                    Chandigarh University Gate no 4
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#94A3B8] gap-4">
          <p>© {new Date().getFullYear()} ServeX Foundation India. All rights reserved.</p>
          <div className="flex items-center gap-6 font-medium">
            <Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link to="/contact" className="hover:text-white transition">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
