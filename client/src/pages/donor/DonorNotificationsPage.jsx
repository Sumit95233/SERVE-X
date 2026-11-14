import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Clock,
  ExternalLink,
  Package,
  IndianRupee,
  ShieldCheck,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const DonorNotificationsPage = () => {
  const {
    notifications,
    unreadCount,
    loading,
    markingAll,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const getIconForType = (type) => {
    switch (type) {
      case 'donation':
        return <IndianRupee className="w-4 h-4 text-[#059669]" />;
      case 'claim':
        return <Package className="w-4 h-4 text-[#07549A]" />;
      case 'verification':
        return <ShieldCheck className="w-4 h-4 text-[#7C3AED]" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-[#059669]" />;
      default:
        return <Info className="w-4 h-4 text-[#667085]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F6FA] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#101828]">
              Notifications
            </h1>
            <p className="text-xs sm:text-sm text-[#667085] mt-1">
              Live updates on pickup coordination, claim confirmations, and donation receipts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EAF3FF] text-[#07549A] border border-[#DCE4ED]">
                {unreadCount} unread
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-[#059669] border border-[#E4E9F0]">
                All caught up
              </span>
            )}

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                disabled={markingAll}
                className="px-3.5 py-1.5 bg-[#07549A] hover:bg-[#06457E] text-white text-xs font-semibold rounded-[10px] shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <CheckCheck className="w-4 h-4" />
                <span>{markingAll ? 'Marking...' : 'Mark all as read'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {loading && notifications.length === 0 ? (
          <div className="py-20">
            <LoadingSpinner message="Loading updates..." />
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#E4E9F0] shadow-[0_2px_8px_rgba(16,42,67,0.04)]">
            <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] border border-[#E4E9F0] text-[#667085] flex items-center justify-center mx-auto mb-3">
              <Bell className="w-6 h-6 text-[#667085]" />
            </div>
            <h3 className="font-bold text-sm text-[#101828]">No Notifications Yet</h3>
            <p className="text-xs text-[#667085] mt-1">You are completely up to date!</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E4E9F0] divide-y divide-[#E4E9F0] shadow-[0_2px_8px_rgba(16,42,67,0.04)] overflow-hidden">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`p-5 flex items-start justify-between gap-4 transition ${
                  n.isRead ? 'bg-white hover:bg-[#F8FAFC]' : 'bg-[#F0F7FF] hover:bg-[#EAF3FF]/80'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#E4E9F0] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    {getIconForType(n.type)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#101828]">{n.title}</h4>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#07549A]" title="Unread" />
                      )}
                    </div>
                    <p className="text-xs text-[#475467] leading-relaxed">{n.message}</p>
                    <div className="flex items-center gap-4 text-[11px] text-[#667085] pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(n.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {n.link && (
                        <Link
                          to={n.link}
                          className="text-[#07549A] font-semibold hover:underline flex items-center gap-1"
                        >
                          <span>Open Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {!n.isRead && (
                  <button
                    type="button"
                    onClick={() => markAsRead(n._id)}
                    className="p-1.5 text-xs text-[#667085] hover:text-[#07549A] hover:bg-[#EAF3FF] rounded-lg transition shrink-0 cursor-pointer"
                    title="Mark as read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
