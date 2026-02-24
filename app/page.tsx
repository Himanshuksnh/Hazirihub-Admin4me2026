'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserTable from '@/components/UserTable';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { User } from '@/lib/types';

export default function Home() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const usersRes = await fetch(`/api/users?page=${page}&limit=10`);
      const usersData = await usersRes.json();
      console.log('Users data:', usersData);
      setUsers(usersData.users || []);
      setTotalPages(usersData.totalPages || 1);

      // Fetch analytics
      const analyticsRes = await fetch('/api/analytics');
      const analyticsData = await analyticsRes.json();
      console.log('Analytics data:', analyticsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (email: string) => {
    router.push(`/users/${encodeURIComponent(email)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">HaziriHub Admin Dashboard</h1>

        {analytics && <AnalyticsDashboard data={analytics} />}

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">All Users</h2>
          <UserTable users={users} onUserClick={handleUserClick} />
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
