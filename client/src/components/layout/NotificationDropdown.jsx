import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

export const NotificationDropdown = ({ isOpen, onClose, viewAllLink = '/donor/notifications' }) => {
  const { notifications, unreadCount, loading, markingAll, markAsRead, markAllAsRead } = useNotifications();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIconForType = (type) => {
    switch (type) {
      case 'donation':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 shadow-xs">
            <IndianRupee className="w-4 h-4 text-[#059669]" />
          </div>
        );
      case 'claim':
        return (
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center shrink-0 shadow-xs">
            <Package className="w-4 h-4 text-[#07549A]" />
          </div>
        );
      case 'verification':
        return (
          <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200/80 flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
        );
      case 'success':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
            <Info className="w-4 h-4 text-[#667085]" />
          </div>
        );
    }
  };

  const handleItemClick = (n) => {
    if (!n.isRead) {
      markAsRead(n._id);
    }
    if (n.link && n.link.trim() !== '') {
      onClose();
      navigate(n.link);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2.5 w-[380px] sm:w-[420px] max-w-[calc(100vw-24px)] bg-white border border-[#DFE7F0] rounded-2xl shadow-[0_20px_50px_rgba(16,42,67,0.18)] z-[1100] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      role="dialog"
      aria-label="Notifications Dropdown"
    >
      {/* Header */}
      <div className="p-4 border-b border-[#E4E9F0] flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-sm text-[#101828]">Notifications</h3>
          {unreadCount > 0 ? (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#EAF3FF] text-[#07549A]">
              {unreadCount} unread
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F8FAFC] text-[#667085]">
              All caught up
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            disabled={markingAll}
            className="text-xs font-semibold text-[#07549A] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>{markingAll ? 'Marking...' : 'Mark all as read'}</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-[#E4E9F0]">
        {loading && notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#667085]">
            <div className="w-5 h-5 border-2 border-[#07549A] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span>Loading notifications...</span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] border border-[#E4E9F0] text-[#667085] flex items-center justify-center mx-auto mb-2.5">
              <Bell className="w-6 h-6 text-[#667085]" />
            </div>
            <h4 className="font-bold text-sm text-[#101828]">No notifications yet</h4>
            <p className="text-xs text-[#667085] mt-1 max-w-[240px] mx-auto">
              You are completely up to date with donations and claims.
            </p>
          </div>
        ) : (
          notifications.slice(0, 8).map((n) => (
            <div
              key={n._id}
              onClick={() => handleItemClick(n)}
              className={`p-3.5 flex items-start gap-3 transition cursor-pointer ${
                n.isRead
                  ? 'bg-white hover:bg-[#F8FAFC]'
                  : 'bg-[#F0F7FF] hover:bg-[#EAF3FF]/80'
              }`}
            >
              {getIconForType(n.type)}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-xs text-[#101828] truncate">
                    {n.title}
                  </h4>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#07549A] shrink-0" title="Unread" />
                  )}
                </div>

                <p className="text-xs text-[#475467] leading-relaxed mt-0.5 line-clamp-2">
                  {n.message}
                </p>

                <div className="flex items-center justify-between mt-1 text-[11px] text-[#667085]">
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
                    <span className="text-[#07549A] font-semibold flex items-center gap-0.5">
                      View <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-[#F8FAFC] border-t border-[#E4E9F0] text-center">
        <Link
          to={viewAllLink}
          onClick={onClose}
          className="text-xs font-semibold text-[#07549A] hover:underline inline-flex items-center gap-1"
        >
          <span>View all notifications</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
};
