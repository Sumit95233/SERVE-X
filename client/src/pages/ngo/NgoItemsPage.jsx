import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  Package,
  Search,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  PackageSearch,
  Handshake,
  X,
  Filter,
  Boxes,
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export const NgoItemsPage = () => {
  const { ngo } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [claimQuantity, setClaimQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [claiming, setClaiming] = useState(false);

  const categories = ['All', 'Clothes', 'Food', 'Books', 'Medicine', 'Toys', 'Electronics', 'Furniture', 'Other'];

  useEffect(() => {
    fetchItems();
  }, [category, city]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('status', 'available');
      if (category && category !== 'All') params.append('category', category);
      if (city) params.append('city', city);

      const res = await api.get(`/items?${params.toString()}`);
      if (res.data?.success) {
        setItems(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching donor items', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (ngo?.verificationStatus !== 'verified') {
      toast.error('Only verified NGOs can submit item claim requests');
      return;
    }

    setClaiming(true);
    try {
      const res = await api.post(`/items/${selectedItem._id}/claims`, {
        requestedQuantity: Number(claimQuantity),
        notes,
      });

      if (res.data?.success) {
        toast.success('Claim request submitted to donor! They will be notified to coordinate pickup.');
        setSelectedItem(null);
        setNotes('');
        fetchItems();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit claim');
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#059669] mb-1">
            <span>NGO Workspace</span>
            <span>/</span>
            <span>In-Kind Item Discovery</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
            Browse Available Donor Goods
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Discover in-kind physical supplies listed by donors across India and claim them for doorstep pickup & community distribution.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-[#059669] bg-[#ECFDF5] px-3.5 py-2 rounded-xl border border-[#A7F3D0]">
          <Boxes className="w-4 h-4" />
          <span>{items.length} Supplies Available</span>
        </div>
      </div>

      {/* Verification Notice if not verified */}
      {ngo?.verificationStatus !== 'verified' && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-xs text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            Your NGO account is pending verification. You can view all listed items, and claiming will activate once documents are audited.
          </span>
        </div>
      )}

      {/* 2. Filter & City Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((c) => {
            const isSelected = category === c || (!category && c === 'All');
            return (
              <button
                key={c}
                onClick={() => setCategory(c === 'All' ? '' : c)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#059669] text-white shadow-xs'
                    : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* City Filter */}
        <div className="w-full md:w-64 relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Filter by city / district..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] placeholder-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
          />
        </div>
      </div>

      {/* 3. Items Grid */}
      {loading ? (
        <div className="py-20 bg-white rounded-2xl border border-[#E2E8F0]">
          <LoadingSpinner message="Searching available physical donations..." />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#E2E8F0] shadow-xs space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center mx-auto">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-base text-[#0F172A]">No Donor Goods Listed Matching Filters</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            Try adjusting your category selection or search city to discover supplies available from donors.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2 gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 bg-[#F1F5F9] text-[#334155] rounded-full border border-[#E2E8F0]">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full capitalize">
                    {item.condition || 'Good Condition'}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-[#0F172A] mb-1 line-clamp-2" title={item.title}>
                  {item.title}
                </h3>
                <p className="text-xs text-[#64748B] mb-3 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] space-y-3">
                <div className="flex justify-between text-xs text-[#475569]">
                  <span>Available Quantity:</span>
                  <span className="font-bold text-[#0F172A]">
                    {item.quantity} {item.unit || 'units'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                  <MapPin className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                  <span className="truncate">{item.pickupAddress || item.city || 'India'}</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedItem(item);
                    setClaimQuantity(item.quantity);
                  }}
                  disabled={ngo?.verificationStatus !== 'verified'}
                  className="w-full py-2 bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs rounded-xl shadow-xs transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Handshake className="w-3.5 h-3.5" />
                  <span>Claim for Beneficiaries</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Claim Submission Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[1200] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#CBD5E1] space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center font-bold">
                  🤝
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#0F172A]">Claim Item Donation</h3>
                  <p className="text-[11px] text-[#64748B]">Send pickup request to donor</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="w-7 h-7 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-xs">
              <div className="font-bold text-[#0F172A]">{selectedItem.title}</div>
              <div className="text-[#64748B] mt-0.5">
                Max available: <strong>{selectedItem.quantity} {selectedItem.unit || 'units'}</strong> in {selectedItem.city || 'India'}
              </div>
            </div>

            <form onSubmit={handleClaimSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                  Requested Quantity
                </label>
                <input
                  type="number"
                  min={1}
                  max={selectedItem.quantity}
                  required
                  value={claimQuantity}
                  onChange={(e) => setClaimQuantity(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                  Message to Donor & Distribution Plan
                </label>
                <textarea
                  rows={3}
                  required
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Explain how your NGO team will collect the items and distribute them to beneficiaries..."
                  className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={claiming}
                  className="px-5 py-2 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-xl disabled:opacity-50 shadow-xs cursor-pointer"
                >
                  {claiming ? 'Submitting...' : 'Submit Claim Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};