'use client';

import { User } from '@/lib/types';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface UserTableProps {
  users: User[];
  onUserClick: (email: string) => void;
}

export default function UserTable({ users, onUserClick }: UserTableProps) {
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-gray-300">Photo</th>
              <th className="text-left py-3 px-4 text-gray-300">Name</th>
              <th className="text-left py-3 px-4 text-gray-300">Email</th>
              <th className="text-left py-3 px-4 text-gray-300">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.email}
                onClick={() => onUserClick(user.email)}
                className="border-b border-gray-700 hover:bg-gray-700 cursor-pointer transition"
              >
                <td className="py-3 px-4">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white">
                      {user.name?.charAt(0) || '?'}
                    </div>
                  )}
                </td>
                <td className="py-3 px-4 text-white">{user.name || 'N/A'}</td>
                <td className="py-3 px-4 text-gray-300">{user.email}</td>
                <td className="py-3 px-4 text-gray-400">
                  {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Never'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
