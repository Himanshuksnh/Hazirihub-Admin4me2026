import { NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const db = getFirestore();
    const snapshot = await db.collection('users').get();
    const users = [];

    for (const doc of snapshot.docs) {
      const userEmail = doc.id;
      
      const semestersSnapshot = await db
        .collection('users')
        .doc(userEmail)
        .collection('semesters')
        .get();

      let currentSemesterId = null;
      const currentSemDoc = semestersSnapshot.docs.find(d => d.id === 'current_semester');
      if (currentSemDoc) {
        currentSemesterId = currentSemDoc.data().semesterId;
      }

      users.push({
        email: userEmail,
        name: userEmail.split('@')[0],
        photoURL: null,
        currentSemesterId,
        lastActive: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
    }

    const filteredUsers = search
      ? users.filter(user => 
          user.email?.toLowerCase().includes(search.toLowerCase()) ||
          user.name?.toLowerCase().includes(search.toLowerCase())
        )
      : users;

    const total = filteredUsers.length;
    const startIndex = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      users: paginatedUsers,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
