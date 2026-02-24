import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK (singleton pattern)
export function initializeFirebaseAdmin() {
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
  return admin;
}

export const getFirestore = () => {
  initializeFirebaseAdmin();
  return admin.firestore();
};
