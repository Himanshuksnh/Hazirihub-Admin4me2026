import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: 'hazirihub'
    });
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

export async function GET() {
  try {
    // Get all users from Firebase Authentication
    const listUsersResult = await admin.auth().listUsers();
    
    const users = listUsersResult.users.map(user => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      creationTime: user.metadata.creationTime,
      lastSignInTime: user.metadata.lastSignInTime
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching auth users:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
