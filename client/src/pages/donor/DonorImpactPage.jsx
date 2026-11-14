import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Award, Heart, Sparkles, TrendingUp, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ImpactScoreCard } from '../../components/donor/ImpactScoreCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const DonorImpactPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalMoney: 0, totalItems: 0, count: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [moneyRes, itemRes] = await Promise.all([
          api.get('/payments/history'),
          api.get('/items?mine=true'),
        ]);

        const money = (moneyRes.data?.data || [])
          .filter((d) => d.paymentStatus === 'successful')
          .reduce((acc, c) => acc + c.amount, 0);

        const items = (itemRes.data?.data || []).reduce((acc, c) => acc + (c.quantity || 1), 0);
        setStats({ totalMoney: money, totalItems: items, count: (moneyRes.data?.data || []).length });
      } catch (err) {
        console.error('Impact stats error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Calculating your humanitarian footprint..." />
      </div>
    );
  }

  const milestones = [
    { title: 'First Step to Change', desc: 'Made your initial verified contribution on ServeX', achieved: true },
    { title: 'Community Pillar', desc: 'Supported 3 or more verified charitable campaigns', achieved: stats.count >= 3 },
    { title: 'Sustained Humanitarian', desc: 'Contributed more than ₹20,000 in life-saving funds', achieved: stats.totalMoney >= 20000 },
    { title: 'Zero Waste Champion', desc: 'Rehomed 50+ useful physical goods with shelters', achieved: stats.totalItems >= 50 },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FC] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-bold text-[#07549A] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
            Impact Verification
          </span>
          <h1 className="text-3xl font-extrabold text-[#101828] mt-2 mb-2">
            Your Personal Impact Roadmap
          </h1>
          <p className="text-sm text-[#64748B]">
            Transparent accountability for every rupee donated and physical item rehomed.
          </p>
        </div>

        <ImpactScoreCard
          totalMoney={stats.totalMoney}
          totalItems={stats.totalItems}
          completedClaims={stats.count}
        />

        {/* Milestones Roadmap */}
        <div className="bg-white rounded-3xl p-8 border border-[#E5EAF0] shadow-xs">
          <h3 className="text-lg font-bold text-[#101828] mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#00B98B]" />
            Philanthropic Milestones
          </h3>

          <div className="space-y-4">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border flex items-center justify-between transition ${
                  m.achieved
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-gray-50 border-gray-100 opacity-60'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      m.achieved
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {m.achieved ? <CheckCircle2 className="w-6 h-6" /> : idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#101828]">{m.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{m.desc}</p>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    m.achieved
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {m.achieved ? 'Achieved' : 'In Progress'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
