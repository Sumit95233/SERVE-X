import React from 'react';
import { Award, Sparkles, TrendingUp } from 'lucide-react';

export const ImpactScoreCard = ({ totalMoney = 0, totalItems = 0, completedClaims = 0 }) => {
  // Transparent gamified score calculation:
  // 1 point per ₹100 donated + 25 points per item donated + 50 points per completed pickup
  const score = Math.max(0, Math.round(totalMoney / 100) + totalItems * 25 + completedClaims * 50);

  const getTier = (pts) => {
    if (pts >= 2500) return { title: 'Legendary Benefactor', next: 2500, isMax: true, tierBadge: 'bg-purple-50 text-purple-700 border-purple-200' };
    if (pts >= 1000) return { title: 'Platinum Humanitarian', next: 2500, isMax: false, tierBadge: 'bg-purple-50 text-purple-700 border-purple-200' };
    if (pts >= 400) return { title: 'Gold Philanthropist', next: 1000, isMax: false, tierBadge: 'bg-amber-50 text-amber-700 border-amber-200' };
    if (pts >= 100) return { title: 'Silver Change-Maker', next: 400, isMax: false, tierBadge: 'bg-blue-50 text-[#07549A] border-blue-200' };
    return { title: 'Bronze Guardian', next: 100, isMax: false, tierBadge: 'bg-emerald-50 text-[#059669] border-emerald-200' };
  };

  const tier = getTier(score);
  const progressPercent = tier.isMax
    ? 100
    : Math.min(100, Math.max(0, Math.round((score / tier.next) * 100)));

  return (
    <div className="bg-white border border-[#E1E8F0] rounded-2xl p-6 shadow-[0_2px_8px_rgba(16,42,67,0.03)] hover:shadow-xs transition">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        {/* Left: Score & Tier */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center ring-1 ring-amber-200">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold text-[#667085] tracking-wider uppercase">
              Personal Impact Score
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${tier.tierBadge}`}>
              {tier.title}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-[#102A43] tracking-tight tabular-nums">
              {score.toLocaleString('en-IN')}
            </span>
            <span className="text-sm font-bold text-[#059669]">impact points</span>
          </div>
          <p className="text-xs text-[#667085] mt-1.5 max-w-lg">
            {score === 0
              ? 'Start contributing to unlock points and advance through impact ranks.'
              : 'Points earned: ₹100 = 1 pt • 1 Physical Item = 25 pts • Verified Pickup = 50 pts'}
          </p>
        </div>

        {/* Right: Milestone Progress */}
        <div className="w-full md:w-80 bg-[#F8FAFC] border border-[#E4E9F0] rounded-2xl p-4 shadow-xs">
          <div className="flex justify-between items-center text-xs font-bold text-[#101828] mb-1.5">
            <span className="text-[#667085]">
              {tier.isMax ? 'Milestone Status' : 'Next Milestone'}
            </span>
            <span className="font-extrabold text-[#07549A] tabular-nums">
              {tier.isMax ? 'Maximum Tier' : `${score} / ${tier.next} pts`}
            </span>
          </div>

          <div className="w-full h-2.5 bg-[#E4E9F0] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#059669] to-[#047857] rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-[#667085] mt-2 font-medium">
            <span className="font-bold text-[#059669]">Progress: {progressPercent}%</span>
            <span>
              {tier.isMax
                ? 'Completed — Top rank reached'
                : `${tier.next - score} pts to next rank`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
