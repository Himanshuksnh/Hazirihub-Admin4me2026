import { NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';

export async function GET(
  request: Request,
  context: { params: Promise<{ email: string }> }
) {
  try {
    const params = await context.params;
    const email = decodeURIComponent(params.email);
    const db = getFirestore();

    const semestersSnapshot = await db
      .collection('users')
      .doc(email)
      .collection('semesters')
      .get();

    if (semestersSnapshot.empty) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let currentSemesterId = null;
    const currentSemDoc = semestersSnapshot.docs.find(d => d.id === 'current_semester');
    if (currentSemDoc) {
      currentSemesterId = currentSemDoc.data().semesterId;
    }

    const semesters = semestersSnapshot.docs
      .filter(doc => doc.id !== 'current_semester' && doc.id !== 'migration_status')
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || 'Semester',
          year: data.year || 0,
          number: data.number || 0,
          isCurrent: data.isCurrent || false,
          isArchived: data.isArchived || false,
          startDate: data.startDate || data.createdAt,
          subjects: data.subjects || [],
          timetable: data.timetable || [],
          attendance: data.attendance || []
        };
      });

    return NextResponse.json({
      email,
      name: email.split('@')[0],
      photoURL: null,
      currentSemesterId,
      createdAt: semesters[0]?.createdAt || new Date().toISOString(),
      semesters
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 });
  }
}
