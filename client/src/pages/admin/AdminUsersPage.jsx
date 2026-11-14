import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Users, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const url = roleFilter ? `/admin/users?role=${roleFilter}` : '/admin/users';
      const res = await api.get(url);
      if (res.data?.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Error loading users', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101828]">
              User Accounts
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Registered platform participants across donor, NGO representative, and administrator roles.
            </p>
          </div>

          <div className="flex bg-white p-1 rounded-2xl border border-gray-200">
            {['', 'donor', 'ngo', 'admin'].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-4 py-1.5 text-xs font-bold rounded-xl capitalize transition ${
                  roleFilter === r
                    ? 'bg-[#07549A] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {r === '' ? 'All Roles' : r}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20">
            <LoadingSpinner message="Loading user directory..." />
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 border border-[#E5EAF0] shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50/70">
                      <td className="py-3.5 font-bold text-[#101828]">{u.fullName}</td>
                      <td className="py-3.5 text-gray-600">{u.email}</td>
                      <td className="py-3.5 text-gray-500">{u.phone || '—'}</td>
                      <td className="py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : u.role === 'ngo'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString('en-IN')}
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
