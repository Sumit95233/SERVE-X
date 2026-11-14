import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Package, ShieldCheck, MapPin, Clock, Info, CheckCircle2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const ItemDonationPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    category: 'Clothes',
    quantity: 1,
    unit: 'pieces',
    description: '',
    condition: 'Good',
    intendedRecipients: ['Anyone in Need'],
    city: 'New Delhi',
    state: 'Delhi',
    pickupAddress: '',
    pickupAvailability: 'Evenings after 6 PM, or weekends',
    imageUrl: '',
  });

  const categories = ['Clothes', 'Food', 'Books', 'Medicine', 'Toys', 'Electronics', 'Furniture', 'Other'];
  const recipientOptions = ['Children', 'Elderly', 'Women', 'Homeless', 'Flood Victims', 'Migrants', 'Anyone in Need'];
  const conditions = ['New', 'Like New', 'Good', 'Fair'];

  const handleRecipientToggle = (r) => {
    setForm((prev) => {
      const exists = prev.intendedRecipients.includes(r);
      return {
        ...prev,
        intendedRecipients: exists
          ? prev.intendedRecipients.filter((item) => item !== r)
          : [...prev.intendedRecipients, r],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.pickupAddress) {
      toast.error('Please complete all required fields');
      return;
    }

    if (form.intendedRecipients.length === 0) {
      toast.error('Please select at least one intended recipient group');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: form.title,
        category: form.category,
        quantity: Number(form.quantity),
        unit: form.unit,
        description: form.description,
        condition: form.condition,
        intendedRecipients: form.intendedRecipients,
        city: form.city,
        state: form.state,
        pickupAddress: form.pickupAddress,
        pickupAvailability: form.pickupAvailability,
        images: form.imageUrl ? [form.imageUrl] : [],
      };

      const res = await api.post('/items', payload);
      if (res.data?.success) {
        toast.success('Item listing created! Verified NGOs in your city can now request pickup.');
        navigate('/donor/history');
      }
    } catch (err) {
      console.error('Error creating item donation', err);
      toast.error(err.response?.data?.message || 'Failed to create item donation listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-[#00B98B] bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
            In-Kind Contribution
          </span>
          <h1 className="text-3xl font-extrabold text-[#101828] mt-2 mb-2">
            Donate Physical Goods
          </h1>
          <p className="text-sm text-[#64748B]">
            Turn surplus items into life-changing resources for verified shelters and schools.
          </p>
        </div>

        {/* Address Privacy Alert Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-[#EBF3FB] border border-[#07549A]/20 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#07549A] shrink-0 mt-0.5" />
          <div className="text-xs text-[#07549A] leading-relaxed">
            <strong>Address Privacy Protection:</strong> Your exact pickup address is never exposed publicly. It is securely encrypted and revealed only to the verified NGO partner after you explicitly accept their claim request.
          </div>
        </div>

        {/* Donation Form Card */}
        <div className="bg-white rounded-3xl p-8 border border-[#E5EAF0] shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-[#101828] uppercase tracking-wider mb-1.5">
                Listing Title *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. 25 Warm Winter Woolen Sweaters & Thermal Jackets"
                className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#00B98B]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#101828] uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#00B98B]"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101828] uppercase tracking-wider mb-1.5">
                  Quantity *
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#00B98B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101828] uppercase tracking-wider mb-1.5">
                  Unit
                </label>
                <input
                  type="text"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  placeholder="e.g. items, kg, boxes, pairs"
                  className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#00B98B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] uppercase tracking-wider mb-1.5">
                Item Condition *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {conditions.map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setForm({ ...form, condition: cond })}
                    className={`py-2 text-xs font-semibold rounded-xl border transition ${
                      form.condition === cond
                        ? 'bg-[#00B98B] border-[#00B98B] text-white shadow-xs'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] uppercase tracking-wider mb-1.5">
                Description & Contents *
              </label>
              <textarea
                rows={3}
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the items, sizes, package condition, and any useful notes..."
                className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#00B98B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] uppercase tracking-wider mb-1.5">
                Intended Recipient Groups
              </label>
              <div className="flex flex-wrap gap-2">
                {recipientOptions.map((r) => {
                  const isChecked = form.intendedRecipients.includes(r);
                  return (
                    <button
                      type="button"
                      key={r}
                      onClick={() => handleRecipientToggle(r)}
                      className={`text-xs px-3.5 py-1.5 rounded-full border transition ${
                        isChecked
                          ? 'bg-[#07549A] border-[#07549A] text-white font-semibold'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {r}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#101828] uppercase tracking-wider mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="e.g. New Delhi"
                  className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#00B98B]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#101828] uppercase tracking-wider mb-1.5">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  placeholder="e.g. Delhi"
                  className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#00B98B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] uppercase tracking-wider mb-1.5">
                Pickup Address (Private to claimant only) *
              </label>
              <input
                type="text"
                required
                value={form.pickupAddress}
                onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })}
                placeholder="House / Flat / Tower / Street details..."
                className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#00B98B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] uppercase tracking-wider mb-1.5">
                Pickup Availability Time Window *
              </label>
              <input
                type="text"
                required
                value={form.pickupAvailability}
                onChange={(e) => setForm({ ...form, pickupAvailability: e.target.value })}
                placeholder="e.g. Weekdays 6 PM - 9 PM, All day Sunday"
                className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#00B98B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] uppercase tracking-wider mb-1.5">
                Photo Image URL (Optional)
              </label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://example.com/item-photo.jpg"
                className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#00B98B]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#00B98B] hover:bg-[#009E77] text-white font-bold text-sm rounded-xl shadow-md transition disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" />
              {loading ? 'Publishing Listing...' : 'Publish Item Donation Listing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
