import { NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const db = getFirestore();
    const usersSnapshot = await db.collection('users').get();

    let totalUsers = 0;
    let activeUsers7Days = 0;
    let activeUsers30Days = 0;
    const semesterDistribution: { [key: string]: number } = {};
    const subjectCounts: { [key: string]: number } = {};
    let totalAttendancePercentage = 0;
    let usersWithAttendance = 0;

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    for (const userDoc of usersSnapshot.docs) {
      totalUsers++;

      const semestersSnapshot = await db
        .collection('users')
        .doc(userDoc.id)
        .collection('semesters')
        .get();

      for (const semDoc of semestersSnapshot.docs) {
        if (semDoc.id === 'current_semester' || semDoc.id === 'migration_status') {
          continue;
        }

        const semData = semDoc.data();
        const semKey = `${semData.name || 'Unknown'} - Year ${semData.year || 'N/A'}`;
        semesterDistribution[semKey] = (semesterDistribution[semKey] || 0) + 1;

        if (semData.subjects && Array.isArray(semData.subjects)) {
          semData.subjects.forEach((subject: any) => {
            subjectCounts[subject.name] = (subjectCounts[subject.name] || 0) + 1;
          });
        }

        if (semData.attendance && Array.isArray(semData.attendance)) {
          const attendance = semData.attendance;
          if (attendance.length > 0) {
            const present = attendance.filter((a: any) => a.status === 'present').length;
            const percentage = (present / attendance.length) * 100;
            totalAttendancePercentage += percentage;
            usersWithAttendance++;
          }

          attendance.forEach((a: any) => {
            if (a.date) {
              const attDate = new Date(a.date);
              if (attDate > sevenDaysAgo) activeUsers7Days++;
              if (attDate > thirtyDaysAgo) activeUsers30Days++;
            }
          });
        }
      }
    }

    const averageAttendance = usersWithAttendance > 0 
      ? totalAttendancePercentage / usersWithAttendance 
      : 0;

    return NextResponse.json({
      totalUsers,
      activeUsers7Days: Math.min(activeUsers7Days, totalUsers),
      activeUsers30Days: Math.min(activeUsers30Days, totalUsers),
      averageAttendance: Math.round(averageAttendance * 10) / 10,
      semesterDistribution,
      topSubjects: Object.entries(subjectCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([name, count]) => ({ name, count }))
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
