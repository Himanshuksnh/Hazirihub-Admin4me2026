'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, BookOpen, Clock, ChevronDown, ChevronUp } from 'lucide-react';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAllAttendance, setShowAllAttendance] = useState(false);

  useEffect(() => {
    if (params.email) {
      fetchUserData(params.email as string);
    }
  }, [params.email]);

  const fetchUserData = async (email: string) => {
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(email)}`);
      const data = await res.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAttendance = (attendance: any[]) => {
    if (!attendance || attendance.length === 0) return { percentage: 0, present: 0, total: 0 };
    const present = attendance.filter(a => a.status === 'present').length;
    return {
      percentage: Math.round((present / attendance.length) * 100),
      present,
      total: attendance.length
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">User not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        {/* User Profile */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-4">
            {userData.photoURL ? (
              <img
                src={userData.photoURL}
                alt={userData.name}
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center text-2xl">
                {userData.name?.charAt(0) || '?'}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">{userData.name || 'Unknown User'}</h1>
              <p className="text-gray-400">{userData.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Joined: {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Semesters */}
        {userData.semesters && userData.semesters.length > 0 ? (
          userData.semesters.map((semester: any) => {
            const attendance = calculateAttendance(semester.attendance);
            
            return (
              <div key={semester.id} className="bg-gray-800 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold">
                    {semester.name || 'Semester'} - Year {semester.year}
                    {semester.isCurrent && (
                      <span className="ml-3 text-sm bg-green-600 px-3 py-1 rounded-full">Current</span>
                    )}
                    {semester.isArchived && (
                      <span className="ml-3 text-sm bg-gray-600 px-3 py-1 rounded-full">Archived</span>
                    )}
                  </h2>
                  <div className="text-sm text-gray-400">
                    Started: {semester.startDate ? new Date(semester.startDate).toLocaleDateString() : 'N/A'}
                  </div>
                </div>

                {/* Attendance Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={20} className="text-blue-400" />
                      <h3 className="font-semibold">Overall Attendance</h3>
                    </div>
                    <p className="text-3xl font-bold">{attendance.percentage}%</p>
                    <p className="text-sm text-gray-400">
                      {attendance.present} / {attendance.total} classes
                    </p>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen size={20} className="text-green-400" />
                      <h3 className="font-semibold">Present</h3>
                    </div>
                    <p className="text-3xl font-bold text-green-400">
                      {semester.attendance?.filter((a: any) => a.status === 'present').length || 0}
                    </p>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen size={20} className="text-red-400" />
                      <h3 className="font-semibold">Absent</h3>
                    </div>
                    <p className="text-3xl font-bold text-red-400">
                      {semester.attendance?.filter((a: any) => a.status === 'absent').length || 0}
                    </p>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={20} className="text-purple-400" />
                      <h3 className="font-semibold">Total Subjects</h3>
                    </div>
                    <p className="text-3xl font-bold">{semester.subjects?.length || 0}</p>
                  </div>
                </div>

                {/* Subjects */}
                {semester.subjects && semester.subjects.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Subjects ({semester.subjects.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {semester.subjects.map((subject: any) => {
                        // Calculate attendance for this subject
                        const subjectAttendance = semester.attendance?.filter((a: any) => a.subjectId === subject.id) || [];
                        const subjectPresent = subjectAttendance.filter((a: any) => a.status === 'present').length;
                        const subjectTotal = subjectAttendance.length;
                        const subjectPercentage = subjectTotal > 0 ? Math.round((subjectPresent / subjectTotal) * 100) : 0;
                        
                        return (
                          <div
                            key={subject.id}
                            className="bg-gray-700 rounded-lg p-4"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div
                                className="w-4 h-4 rounded-full flex-shrink-0"
                                style={{ backgroundColor: subject.color || '#888' }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{subject.name}</p>
                                {subject.isLab && (
                                  <span className="text-xs text-blue-400">Lab</span>
                                )}
                              </div>
                            </div>
                            <div className="text-sm text-gray-400">
                              Attendance: <span className={subjectPercentage >= 75 ? 'text-green-400' : 'text-red-400'}>
                                {subjectPercentage}%
                              </span> ({subjectPresent}/{subjectTotal})
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Timetable */}
                {semester.timetable && semester.timetable.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Weekly Timetable</h3>
                    <div className="overflow-x-auto">
                      <div className="grid grid-cols-1 gap-3">
                        {semester.timetable.map((day: any, idx: number) => (
                          <div key={idx} className="bg-gray-700 rounded-lg p-4">
                            <h4 className="font-semibold text-lg mb-2 capitalize">{day.dayOfWeek}</h4>
                            <div className="flex flex-wrap gap-2">
                              {day.theorySubjects?.map((subjectId: string, i: number) => {
                                const subject = semester.subjects?.find((s: any) => s.id === subjectId);
                                return subject ? (
                                  <div
                                    key={i}
                                    className="px-3 py-1 rounded text-sm"
                                    style={{ backgroundColor: subject.color + '40', color: subject.color }}
                                  >
                                    {subject.name}
                                  </div>
                                ) : null;
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Attendance */}
                {semester.attendance && semester.attendance.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold">
                        Attendance History ({semester.attendance.length} total records)
                      </h3>
                      <button
                        onClick={() => setShowAllAttendance(!showAllAttendance)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                      >
                        {showAllAttendance ? (
                          <>
                            <ChevronUp size={20} />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown size={20} />
                            Show All
                          </>
                        )}
                      </button>
                    </div>
                    <div className="space-y-3">
                      {(() => {
                        // Group attendance by date
                        const attendanceByDate: { [key: string]: any[] } = {};
                        semester.attendance.forEach((entry: any) => {
                          if (!attendanceByDate[entry.date]) {
                            attendanceByDate[entry.date] = [];
                          }
                          attendanceByDate[entry.date].push(entry);
                        });

                        // Sort dates descending
                        const sortedDates = Object.keys(attendanceByDate)
                          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

                        // Show only 10 days or all based on state
                        const datesToShow = showAllAttendance ? sortedDates : sortedDates.slice(0, 10);

                        return (
                          <>
                            {datesToShow.map((date) => {
                              const entries = attendanceByDate[date];
                              const presentCount = entries.filter(e => e.status === 'present').length;
                              const absentCount = entries.filter(e => e.status === 'absent').length;
                              const cancelledCount = entries.filter(e => e.status === 'cancelled').length;
                              
                              return (
                                <div key={date} className="bg-gray-700 rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <div>
                                      <h4 className="font-semibold text-lg">
                                        {new Date(date).toLocaleDateString('en-US', { 
                                          weekday: 'long', 
                                          year: 'numeric', 
                                          month: 'long', 
                                          day: 'numeric' 
                                        })}
                                      </h4>
                                      <p className="text-sm text-gray-400">
                                        {entries.length} classes • 
                                        <span className="text-green-400 ml-2">{presentCount} Present</span>
                                        {absentCount > 0 && <span className="text-red-400 ml-2">{absentCount} Absent</span>}
                                        {cancelledCount > 0 && <span className="text-gray-400 ml-2">{cancelledCount} Cancelled</span>}
                                      </p>
                                    </div>
                                    <div className="text-2xl font-bold">
                                      {Math.round((presentCount / entries.length) * 100)}%
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {entries.map((entry: any, idx: number) => {
                                      const subject = semester.subjects?.find((s: any) => s.id === entry.subjectId);
                                      return (
                                        <div
                                          key={idx}
                                          className="flex items-center justify-between bg-gray-800 rounded p-2"
                                        >
                                          <div className="flex items-center gap-2">
                                            <div
                                              className="w-3 h-3 rounded-full"
                                              style={{ backgroundColor: subject?.color || '#888' }}
                                            />
                                            <span className="text-sm">{subject?.name || 'Unknown'}</span>
                                          </div>
                                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            entry.status === 'present' ? 'bg-green-600 text-white' :
                                            entry.status === 'absent' ? 'bg-red-600 text-white' :
                                            entry.status === 'cancelled' ? 'bg-gray-600 text-white' :
                                            'bg-yellow-600 text-white'
                                          }`}>
                                            {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                            
                            {!showAllAttendance && sortedDates.length > 10 && (
                              <div className="text-center text-gray-400 text-sm">
                                Showing 10 of {sortedDates.length} days. Click "Show All" to see more.
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-400">
            No semester data available
          </div>
        )}
      </div>
    </div>
  );
}
