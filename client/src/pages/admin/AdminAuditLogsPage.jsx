import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { ShieldCheck, Clock, Terminal } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/admin/audit-logs');
      if (res.data?.success) {
        setLogs(res.data.data);
      }
    } catch (err) {
      console.error('Audit logs error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101828]">
            System Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Immutable system logs documenting administrative verifications, status changes, and critical payment events.
          </p>
        </div>

        {loading ? (
          <div className="py-20">
            <LoadingSpinner message="Loading audit trail..." />
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 border border-[#E5EAF0] shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider font-sans">
                    <th className="pb-3">Action</th>
                    <th className="pb-3">Actor</th>
                    <th className="pb-3">Resource Type</th>
                    <th className="pb-3">Resource ID</th>
                    <th className="pb-3 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50/70">
                      <td className="py-3 font-bold text-[#07549A]">{log.action}</td>
                      <td className="py-3 text-gray-700">
                        {log.actorId?.fullName || log.actorId?.email || 'System'}
                      </td>
                      <td className="py-3 text-gray-600">{log.resourceType}</td>
                      <td className="py-3 text-gray-400 text-[11px] truncate max-w-[120px]">
                        {log.resourceId}
                      </td>
                      <td className="py-3 text-right text-gray-500 font-sans">
                        {new Date(log.createdAt).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
