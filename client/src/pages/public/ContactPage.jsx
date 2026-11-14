import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Your message has been received! Our support team will respond within 24 hours.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-[#00B98B] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#101828] mt-2 mb-2">
            Contact ServeX Support
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Have inquiries about NGO verification, bulk corporate giving, or platform partnerships? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-6 border border-[#E5EAF0] shadow-xs text-center">
            <Mail className="w-8 h-8 text-[#07549A] mx-auto mb-2" />
            <h4 className="font-bold text-sm text-[#101828]">Email Support</h4>
            <a href="mailto:sumitrajslm2018@gmail.com" className="text-xs text-gray-500 hover:text-[#07549A] mt-1 block break-all font-medium transition">
              sumitrajslm2018@gmail.com
            </a>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#E5EAF0] shadow-xs text-center">
            <Phone className="w-8 h-8 text-[#00B98B] mx-auto mb-2" />
            <h4 className="font-bold text-sm text-[#101828]">Direct Line</h4>
            <a href="tel:+919523334322" className="text-xs text-gray-500 hover:text-[#00B98B] mt-1 block font-medium transition">
              +91 95233 34322
            </a>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#E5EAF0] shadow-xs text-center">
            <MapPin className="w-8 h-8 text-teal-600 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-[#101828]">Headquarters</h4>
            <p className="text-xs text-gray-500 mt-1 font-medium">Chandigarh University Gate no 4</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-[#E5EAF0] shadow-xs max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#101828] uppercase mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#101828] uppercase mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] uppercase mb-1">
                Subject
              </label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] uppercase mb-1">
                Message
              </label>
              <textarea
                rows={4}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#07549A] hover:bg-[#003B64] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
