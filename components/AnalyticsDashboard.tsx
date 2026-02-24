'use client';

import { Users, Activity, TrendingUp, BookOpen } from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  activeUsers7Days: number;
  activeUsers30Days: number;
  averageAttendance: number;
  topSubjects: { name: string; count: number }[];
  semesterDistribution: { [key: string]: number };
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
}

export default function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium opacity-90">Total Users</h3>
          <Users size={24} />
        </div>
        <p className="text-3xl font-bold">{data.totalUsers}</p>
      </div>

      <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium opacity-90">Active (7 Days)</h3>
          <Activity size={24} />
        </div>
        <p className="text-3xl font-bold">{data.activeUsers7Days}</p>
      </div>

      <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium opacity-90">Active (30 Days)</h3>
          <TrendingUp size={24} />
        </div>
        <p className="text-3xl font-bold">{data.activeUsers30Days}</p>
      </div>

      <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium opacity-90">Avg Attendance</h3>
          <BookOpen size={24} />
        </div>
        <p className="text-3xl font-bold">{data.averageAttendance}%</p>
      </div>
    </div>
  );
}
