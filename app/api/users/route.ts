import { NextResponse } from 'next/server';
import { getFirestore, initializeFirebaseAdmin } from '@/lib/firebase-admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const admin = initializeFirebaseAdmin();
    const db = getFirestore();
    
    // Get all users from Firebase Authentication
    const authUsers = await admin.auth().listUsers();
    const authUsersMap = new Map();
    
    authUsers.users.forEach(user => {
      if (user.email) {
        authUsersMap.set(user.email, {
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: user.metadata.creationTime,
          lastActive: user.metadata.lastSignInTime
        });
      }
    });
    
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

      const authUser = authUsersMap.get(userEmail);
      
      users.push({
        email: userEmail,
        name: authUser?.displayName || userEmail.split('@')[0],
        photoURL: authUser?.photoURL || null,
        currentSemesterId,
        lastActive: authUser?.lastActive || new Date().toISOString(),
        createdAt: authUser?.createdAt || new Date().toISOString()
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
