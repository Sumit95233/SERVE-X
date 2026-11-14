import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  Package,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2,
  ClipboardList,
  Filter,
  Flame,
  Search,
  MapPin,
  X,
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export const NgoRequirementsPage = () => {
  const { ngo } = useAuth();
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [urgencyFilter, setUrgencyFilter] = useState('All');

  const [form, setForm] = useState({
    title: '',
    category: 'Clothes',
    quantityRequired: 10,
    unit: 'pieces',
    description: '',
    urgency: 'medium',
    city: ngo?.city || 'New Delhi',
    state: ngo?.state || 'Delhi',
    requiredBy: '',
  });

  const categories = ['Clothes', 'Food', 'Books', 'Medicine', 'Toys', 'Electronics', 'Furniture', 'Other'];
  const urgencies = ['low', 'medium', 'high', 'urgent'];

  useEffect(() => {
    fetchRequirements();
  }, []);

  const fetchRequirements = async () => {
    setLoading(true);
    try {
      const res = await api.get('/requirements?mine=true');
      if (res.data?.success) {
        setRequirements(res.data.data || []);
      }
    } catch (err) {
      console.error('Error loading requirements', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (ngo?.verificationStatus !== 'verified') {
      toast.error('Only verified NGOs can publish active public requirements');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/requirements', {
        ...form,
        quantityRequired: Number(form.quantityRequired),
      });

      if (res.data?.success) {
        toast.success('Urgent item requirement published successfully');
        setShowModal(false);
        setForm({
          title: '',
          category: 'Clothes',
          quantityRequired: 10,
          unit: 'pieces',
          description: '',
          urgency: 'medium',
          city: ngo?.city || 'New Delhi',
          state: ngo?.state || 'Delhi',
          requiredBy: '',
        });
        fetchRequirements();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create requirement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = async (id) => {
    try {
      await api.delete(`/requirements/${id}`);
      toast.success('Requirement closed successfully');
      fetchRequirements();
    } catch {
      toast.error('Failed to close requirement');
    }
  };

  const filteredRequirements = requirements.filter((req) => {
    if (categoryFilter !== 'All' && req.category !== categoryFilter) return false;
    if (urgencyFilter !== 'All' && req.urgency !== urgencyFilter) return false;
    return true;
  });

  const totalRequired = requirements.reduce((acc, r) => acc + (r.quantityRequired || 0), 0);
  const totalFulfilled = requirements.reduce((acc, r) => acc + (r.quantityFulfilled || 0), 0);
  const activeCount = requirements.filter((r) => r.status === 'active').length;
  const urgentCount = requirements.filter((r) => r.urgency === 'urgent' || r.urgency === 'high').length;

  return (
    <div className="space-y-6">
      {/* 1. Header with Breadcrumb & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#059669] mb-1">
            <span>NGO Workspace</span>
            <span>/</span>
            <span>Supply Logistics</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
            Item Requirements Manager
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            List and manage urgent in-kind physical supplies needed for your on-ground beneficiary programs.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish New Requirement</span>
        </button>
      </div>

      {/* 2. Four Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5] text-[#059669] flex items-center justify-center shrink-0 ring-1 ring-[#A7F3D0]/60 shadow-xs">
            <ClipboardList className="w-5 h-5 font-bold" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider truncate">
              Active Needs Posted
            </div>
            <div className="text-xl font-black text-[#0F172A] mt-0.5 tabular-nums truncate">
              {activeCount}
            </div>
            <p className="text-[11px] text-[#059669] font-medium mt-0.5">Open for donor pledges</p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FEF2F2] to-[#FEE2E2] text-[#DC2626] flex items-center justify-center shrink-0 ring-1 ring-[#FECACA]/60 shadow-xs">
            <Flame className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider truncate">
              Urgent / High Priority
            </div>
            <div className="text-xl font-black text-[#DC2626] mt-0.5 tabular-nums truncate">
              {urgentCount}
            </div>
            <p className="text-[11px] text-[#DC2626] font-medium mt-0.5">Requires immediate pickup</p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] text-[#0284C7] flex items-center justify-center shrink-0 ring-1 ring-[#BAE6FD]/60 shadow-xs">
            <Package className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider truncate">
              Total Units Needed
            </div>
            <div className="text-xl font-black text-[#0F172A] mt-0.5 tabular-nums truncate">
              {totalRequired.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-[#64748B] font-medium mt-0.5">Across all categories</p>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0 ring-1 ring-[#BBF7D0]/60 shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider truncate">
              Units Fulfilled
            </div>
            <div className="text-xl font-black text-[#16A34A] mt-0.5 tabular-nums truncate">
              {totalFulfilled.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-[#16A34A] font-medium mt-0.5">Delivered to community</p>
          </div>
        </div>
      </div>

      {/* 3. Filters */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-[#64748B] mr-1">Category:</span>
          {['All', ...categories].map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                categoryFilter === c
                  ? 'bg-[#059669] text-white shadow-xs'
                  : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-[#64748B]">Urgency:</span>
          {['All', 'urgent', 'high', 'medium'].map((u) => (
            <button
              key={u}
              onClick={() => setUrgencyFilter(u)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                urgencyFilter === u
                  ? 'bg-[#0F172A] text-white'
                  : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Requirements Grid */}
      {loading ? (
        <div className="py-20 bg-white rounded-2xl border border-[#E2E8F0]">
          <LoadingSpinner message="Loading requirements..." />
        </div>
      ) : filteredRequirements.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#E2E8F0] shadow-xs space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center mx-auto">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-base text-[#0F172A]">No Item Requirements Matching Filter</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            Publish your urgent requirements so donors in your district can offer physical donations directly.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-[#059669] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish First Requirement</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRequirements.map((req) => {
            const percent = req.quantityRequired
              ? Math.min(100, Math.round(((req.quantityFulfilled || 0) / req.quantityRequired) * 100))
              : 0;

            const isUrgent = req.urgency === 'urgent';
            const isHigh = req.urgency === 'high';

            return (
              <div
                key={req._id}
                className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 bg-[#F1F5F9] text-[#334155] rounded-full border border-[#E2E8F0]">
                      {req.category}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isUrgent
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : isHigh
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {req.urgency}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#0F172A] mb-1.5 line-clamp-1" title={req.title}>
                    {req.title}
                  </h3>
                  <p className="text-xs text-[#64748B] mb-3 line-clamp-2 leading-relaxed">
                    {req.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] mb-4">
                    <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>{req.city || ngo?.city || 'India'}, {req.state || ngo?.state || ''}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0]">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-[#64748B] font-medium">Fulfillment Status</span>
                    <span className="font-bold text-[#0F172A]">
                      {req.quantityFulfilled || 0} / {req.quantityRequired} {req.unit || 'units'} ({percent}%)
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden mb-3.5">
                    <div
                      className={`h-full rounded-full transition-all ${
                        percent >= 100 ? 'bg-[#10B981]' : 'bg-[#059669]'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <StatusBadge status={req.status || 'active'} />
                    {req.status === 'active' && (
                      <button
                        onClick={() => handleClose(req._id)}
                        className="text-xs text-rose-600 hover:text-rose-800 font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Close Need</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Publish Requirement Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[1200] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#CBD5E1] space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center font-bold">
                  📦
                </div>
                <div>
                  <h3 className="text-base font-black text-[#0F172A]">Publish Urgent Item Requirement</h3>
                  <p className="text-[11px] text-[#64748B]">Request material goods for on-ground distribution</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                  Item Title
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. 100 Math & Science School Books for Tribal Students"
                  className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                    Urgency Priority
                  </label>
                  <select
                    value={form.urgency}
                    onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] capitalize focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
                  >
                    {urgencies.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                    Quantity Needed
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={form.quantityRequired}
                    onChange={(e) => setForm({ ...form, quantityRequired: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                    Unit Type
                  </label>
                  <input
                    type="text"
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    placeholder="pieces, kg, kits, boxes"
                    className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                  Beneficiary Need & Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detail who will receive these supplies, condition accepted, and how your NGO will distribute them..."
                  className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-xl disabled:opacity-50 shadow-xs cursor-pointer"
                >
                  {submitting ? 'Publishing...' : 'Publish Requirement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};