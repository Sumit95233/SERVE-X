import React from 'react';
import { PackageOpen } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'There are currently no records matching your criteria.',
  action,
}) => {
  return (
    <div className="text-center py-12 px-4 bg-white rounded-2xl border border-[#E5EAF0] my-4 shadow-xs">
      <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#F0FDF4] text-[#00B98B] flex items-center justify-center">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-[#101828] mb-1">{title}</h3>
      <p className="text-sm text-[#64748B] max-w-sm mx-auto mb-5">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
